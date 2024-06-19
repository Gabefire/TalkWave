/// <reference types="vite-plugin-svgr/client" />
import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useClickOutside from "../../../hooks/useClickOutside.tsx";
import SearchIcon from "../../../assets/magnify.svg?react";
import { channelType, userSearchDto } from "../../../types/messages.ts";
import "./header.css";
import { AuthContext } from "../../../contexts/authProvider.tsx";
import axios, { isAxiosError } from "axios";
import UserIcon from "./user_icon";
import { TailSpin } from "react-loader-spinner";
import useProvideAuth from "../../../hooks/useProvideAuth.tsx";
import ProfilePic from "../profile_pic";
import ChannelListContext from "../../../contexts/channelListContext.ts";
import { ACTION } from "../../../reducers/channelReducer.ts";

function Header() {
  const [displayJoinGroupMenu, setDisplayJoinGroupMenu] = useState(false);
  const [displaySearchBox, setDisplaySearchBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [groupSearchResults, setGroupSearchResults] = useState(
    [] as channelType[]
  );
  const [userSearchResults, setUserSearchResults] = useState(
    [] as userSearchDto[]
  );
  const [loadingSearchResults, setLoadingSearchResults] = useState(true);

  const navigator = useNavigate();

  const profilePopoverRef = useRef<HTMLDivElement>(null);
  const profileBoxRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { logout } = useProvideAuth();

  const user = useContext(AuthContext);

  const { dispatch, changeLoading } = useContext(ChannelListContext);

  // profile drop down
  useClickOutside(
    profileBoxRef,
    () => {
      setDisplayJoinGroupMenu(false);
    },
    profilePopoverRef
  );

  // search box
  useClickOutside(
    searchBarRef,
    () => {
      setSearchTerm("");
      setDisplaySearchBox(false);
    },
    searchBoxRef
  );

  //useEffect search logic
  useEffect(() => {
    const getSearchResults = async () => {
      try {
        const results = await Promise.all([
          (
            await axios.get<channelType[]>(`/api/GroupChannel/${searchTerm}`)
          ).data,
          (await axios.get<userSearchDto[]>(`/api/User/${searchTerm}`)).data,
        ]);
        setGroupSearchResults(results[0]);
        setUserSearchResults(results[1]);
        setLoadingSearchResults(false);
      } catch (err) {
        console.error(err);
      }
    };
    if (!searchTerm) {
      setDisplaySearchBox(false);
      return;
    }
    const timeoutId = setTimeout(getSearchResults, 200);
    return () => {
      clearTimeout(timeoutId);
      setLoadingSearchResults(true);
    };
  }, [searchTerm]);

  const joinGroupChannel = async (channel: channelType) => {
    try {
      changeLoading(true);
      await axios.put(`/api/GroupChannel/join/${channel.channelId}`);
      dispatch({
        type: ACTION.ADD_CHANNELS,
        payload: {
          channels: [channel],
        },
      });
      navigator(`${channel.type}/${channel.channelId}`);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        navigator(`${channel.type}/${channel.channelId}`);
      } else {
        console.error(err);
      }
    } finally {
      changeLoading(false);
    }
  };

  return (
    <div className="top-header">
      <div className="left-header">
        <h3>TalkWave</h3>
        <div
          ref={profileBoxRef}
          className="user-field"
          onClick={() => setDisplayJoinGroupMenu(!displayJoinGroupMenu)}
        >
          {/*Log in pic will need to go here when logic is added*/}
          <ProfilePic
            url=""
            size="20"
            userName={user.userName?.toString() as string}
          />
          {displayJoinGroupMenu ? (
            <div className="profile popover" ref={profilePopoverRef}>
              <div className="triangle"></div>
              <Link to={"/edit-profile"} className="popover-item">
                Edit Profile
              </Link>
              <Link to={"/"} className="popover-item" onClick={logout}>
                Logout
              </Link>
            </div>
          ) : undefined}
        </div>
      </div>
      <div className="right-header">
        {/*Search bar*/}
        <div className="search-container">
          <input
            type="search"
            className="search-bar"
            ref={searchBarRef}
            onChange={(e) => {
              if (searchTerm) {
                setDisplaySearchBox(true);
              }
              setSearchTerm(e.target.value);
            }}
            value={searchTerm}
          />
          <SearchIcon
            height={"1.8rem"}
            fill="white"
            onClick={() => searchBarRef.current!.focus()}
            cursor={"pointer"}
          />
          {displaySearchBox ? (
            <div className="search-box popover" ref={searchBoxRef}>
              {loadingSearchResults ? (
                <TailSpin
                  height="20"
                  width="20"
                  color="white"
                  ariaLabel="tail-spin-loading"
                  wrapperClass="load-search"
                />
              ) : (
                <>
                  <div className="users-search-section search-section">
                    <h5>Users</h5>
                    <div className="results">
                      {userSearchResults.length > 0 ? (
                        userSearchResults.map((user) => {
                          return <UserIcon user={user} key={user.userId} />;
                        })
                      ) : (
                        <div className="no-results">No Results</div>
                      )}
                    </div>
                  </div>
                  <div className="groups-search-section search-section">
                    <h5>Groups</h5>{" "}
                    <div className="results">
                      {groupSearchResults.length > 0 ? (
                        groupSearchResults.map((channel) => {
                          if (channel.type == "group") {
                            return (
                              <button
                                onClick={async (e) => {
                                  await joinGroupChannel(channel);
                                  if (e) setSearchTerm("");
                                }}
                                key={channel.channelId}
                                className="user-icon"
                              >
                                {`# ${channel.name}`}
                              </button>
                            );
                          }
                        })
                      ) : (
                        <div className="no-results">No Results</div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}

export default Header;

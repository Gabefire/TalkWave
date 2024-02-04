/// <reference types="vite-plugin-svgr/client" />
import { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import useClickOutside from "../useClickOutside";
import SearchIcon from "../../../assets/magnify.svg?react";
import { channelType, userSearchDto } from "../../../types/messages";
import "./header.css";
import { AuthContext } from "../../../contexts/authProvider";
import axios from "axios";
import UserIcon from "./user_icon";
import useProvideAuth from "../../../useProvideAuth";

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

  const profilePopoverRef = useRef<HTMLDivElement>(null);
  const profileBoxRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const user = useContext(AuthContext);

  const { logout } = useProvideAuth();

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
      } catch (err) {
        console.log(err);
      }
    };
    if (!searchTerm) {
      setDisplaySearchBox(false);
      return;
    }
    const timeoutId = setTimeout(getSearchResults, 2000);
    setLoadingSearchResults(false);
    return () => {
      clearTimeout(timeoutId);
      setLoadingSearchResults(true);
    };
  }, [searchTerm]);

  const joinGroupChannel = async (channelId: string) => {
    try {
      await axios.put(`/api/GroupChannel/join/${channelId}`);
    } catch (err) {
      console.log(err);
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
          <img className="profile-pic" src="./" alt="Profile" />
          <div className="name">{user.userName}</div>
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
              <div className="users-search-section search-section">
                <h5>Users</h5>
                {loadingSearchResults ? (
                  <div className="load">Loading...</div>
                ) : (
                  <div className="results">
                    {userSearchResults.length > 0 ? (
                      userSearchResults.map((user) => {
                        return <UserIcon user={user} />;
                      })
                    ) : (
                      <div className="no-results">No Results</div>
                    )}
                  </div>
                )}
              </div>
              <div className="groups-search-section search-section">
                <h5>Groups</h5>{" "}
                {loadingSearchResults ? (
                  <div className="load">Loading...</div>
                ) : (
                  <div className="results">
                    {groupSearchResults.length > 0 ? (
                      groupSearchResults.map((channel) => {
                        if (channel.type == "group") {
                          return (
                            <Link
                              to={`${channel.type}/${channel.channelId}`}
                              onClick={async (e) => {
                                await joinGroupChannel(channel.channelId);
                                if (e) setSearchTerm("");
                              }}
                            >
                              {`# ${channel.name}`}
                            </Link>
                          );
                        }
                      })
                    ) : (
                      <div className="no-results">No Results</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}

export default Header;

/// <reference types="vite-plugin-svgr/client" />
import { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import useClickOutside from "../useClickOutside";
import SearchIcon from "../../../assets/magnify.svg?react";
import { channelType } from "../../../types/messages";

import "./header.css";
import { AuthContext } from "../../../authProvider";

function Header() {
  const [displayJoinGroupMenu, setDisplayJoinGroupMenu] = useState(false);
  const [displaySearchBox, setDisplaySearchBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([] as channelType[]);
  const [loadingSearchResults, setLoadingSearchResults] = useState(true);

  const profilePopoverRef = useRef<HTMLDivElement>(null);
  const profileBoxRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const user = useContext(AuthContext);

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
    const getSearchResults = async (search: string) => {
      try {
        //Fetch here to get items search from back end
        console.log(search);
        setSearchResults([
          {
            name: "group1",
            channelId: "1234",
            type: "group",
            isOwner: true,
          },
          {
            name: "group2",
            channelId: "12345",
            type: "group",
            isOwner: true,
          },
          {
            name: "user1",
            channelId: "1236",
            type: "user",
            isOwner: true,
          },
          {
            name: "user2",
            channelId: "1237",
            type: "user",
            isOwner: true,
          },
        ]);
      } catch (error) {
        return;
      }
    };
    if (!searchTerm) {
      setDisplaySearchBox(false);
      return;
    }
    getSearchResults(searchTerm);
    setLoadingSearchResults(false);
  }, [searchTerm]);

  return (
    <div className="top-header">
      <div className="left-header">
        <h3>TalkWave</h3>
        <div
          ref={profileBoxRef}
          className="user-field"
          onClick={() => setDisplayJoinGroupMenu(!displayJoinGroupMenu)}
        >
          {/*Log in name and pic will need to go here when logic is added*/}
          <img className="profile-pic" src="./" alt="Profile" />
          <div className="name">{user.userName}</div>
          {displayJoinGroupMenu ? (
            <div className="profile popover" ref={profilePopoverRef}>
              <div className="triangle"></div>
              <Link to={"/edit-profile"} className="popover-item">
                Edit Profile
              </Link>
              <Link to={"/"} className="popover-item">
                Logout
              </Link>
            </div>
          ) : undefined}
        </div>
      </div>
      <div className="right-header">
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
                    {searchResults.length > 0 ? (
                      searchResults.map((channel) => {
                        if (channel.type == "user") {
                          return (
                            <Link
                              to={`${channel.type}/${channel.channelId}`}
                              onClick={(e) => {
                                if (e) setSearchTerm("");
                              }}
                            >
                              {channel.name}
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
              <div className="groups-search-section search-section">
                <h5>Groups</h5>{" "}
                {loadingSearchResults ? (
                  <div className="load">Loading...</div>
                ) : (
                  <div className="results">
                    {searchResults.length > 0 ? (
                      searchResults.map((channel) => {
                        if (channel.type == "group") {
                          return (
                            <Link
                              to={`${channel.type}/${channel.channelId}`}
                              onClick={(e) => {
                                if (e) setSearchTerm("");
                              }}
                            >
                              {channel.name}
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

/// <reference types="vite-plugin-svgr/client" />
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import useClickOutside from "../useClickOutside";
import SearchIcon from "../../../assets/magnify.svg?react";
import { roomType } from "../../../types/messages";

import "./header.css";

function Header() {
  const [displayJoinGroupMenu, setDisplayJoinGroupMenu] = useState(false);
  const [displaySearchBox, setDisplaySearchBox] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([] as roomType[]);
  const [loadingSearchResults, setLoadingSearchResults] = useState(true);

  const profilePopoverRef = useRef<HTMLDivElement>(null);
  const profileBoxRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

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
            id: "1234",
            type: "group",
          },
          {
            name: "group2",
            id: "12345",
            type: "group",
          },
          {
            name: "user1",
            id: "1236",
            type: "user",
          },
          {
            name: "user2",
            id: "1237",
            type: "user",
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
          <div className="name">Gabe Underwood</div>
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
                      searchResults.map((room) => {
                        if (room.type == "user") {
                          return (
                            <Link
                              to={`${room.type}/${room.id}`}
                              onClick={(e) => {
                                if (e) setSearchTerm("");
                              }}
                            >
                              {room.name}
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
                      searchResults.map((room) => {
                        if (room.type == "group") {
                          return (
                            <Link
                              to={`${room.type}/${room.id}`}
                              onClick={(e) => {
                                if (e) setSearchTerm("");
                              }}
                            >
                              {room.name}
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

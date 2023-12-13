/// <reference types="vite-plugin-svgr/client" />
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import useClickOutside from "../useClickOutside";
import SearchIcon from "./magnify.svg?react";

import "./header.css";

function Header() {
  const [displayJoinGroupMenu, setDisplayJoinGroupMenu] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const additionalRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    wrapperRef,
    () => {
      setDisplayJoinGroupMenu(false);
    },
    additionalRef
  );

  return (
    <div className="top-header">
      <div className="left-header">
        <h3>TalkWave</h3>
        <div
          ref={additionalRef}
          className="user-field"
          onClick={() => setDisplayJoinGroupMenu(!displayJoinGroupMenu)}
        >
          {/*Log in name and pic will need to go here when logic is added*/}
          <img className="profile-pic" src="./" alt="Profile" />
          <div className="name">Gabe Underwood</div>
          {displayJoinGroupMenu ? (
            <div className="profile popover" ref={wrapperRef}>
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
          <SearchIcon height={"2rem"} fill="white" />
          <input type="text" className="search-bar" />
        </div>
      </div>
    </div>
  );
}

export default Header;

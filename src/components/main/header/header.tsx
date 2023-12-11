import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import useClickOutside from "../useClickOutside";

import "./header.css";

function Header() {
  const [displayJoinGroupMenu, setDisplayJoinGroupMenu] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => {
    setDisplayJoinGroupMenu(false);
  });

  return (
    <div className="top-header">
      <div className="header-icons">
        <button className="drop-down">=</button>
        {displayJoinGroupMenu ? (
          <div className="profile popover" ref={wrapperRef}>
            <div className="triangle"></div>
            <Link to={"/edit-profile"} className="join-group-item">
              Edit Profile
            </Link>
            <Link to={"/"} className="join-group-item">
              Logout
            </Link>
          </div>
        ) : undefined}
        <div
          className="user-field"
          onClick={(e: React.PointerEvent<HTMLDivElement>) => {
            if (e != undefined) {
              setDisplayJoinGroupMenu(!displayJoinGroupMenu);
            }
          }}
          ref={wrapperRef}
        >
          <img className="profile-pic" src="./" alt="Profile" />
          <div className="name">Gabe</div>
        </div>
      </div>
      <h3>TalkWave</h3>
    </div>
  );
}

export default Header;

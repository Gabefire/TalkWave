import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import useClickOutside from "../useClickOutside";

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
      <div className="profile-icons">
        <button className="drop-down">=</button>

        <div
          ref={additionalRef}
          className="user-field"
          onClick={() => setDisplayJoinGroupMenu(!displayJoinGroupMenu)}
        >
          <img className="profile-pic" src="./" alt="Profile" />
          <div className="name" ref={additionalRef}>
            Gabe Underwood
          </div>
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
        </div>
      </div>
      <h3>TalkWave</h3>
    </div>
  );
}

export default Header;

import { useEffect, useState, useRef } from "react";
import { roomType } from "../../../types/messages";

import "./side_bar.css";
import { Link, NavLink } from "react-router-dom";

import useClickOutside from "./useClickOutside";

function SideBar() {
  const [roomList, setRoomList] = useState([] as roomType[]);
  const [activeButton, setActiveButton] = useState(
    "all" as "all" | "user" | "group"
  );
  const [displayJoinGroupMenu, setDisplayJoinGroupMenu] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const additionalRef = useRef<HTMLButtonElement>(null);
  useClickOutside(wrapperRef, additionalRef, () => {
    setDisplayJoinGroupMenu(false);
  });

  useEffect(() => {
    //API to get group list start in all groups
    const roomList: roomType[] = [
      {
        type: "group",
        name: "group1",
        id: "1234",
      },
      {
        type: "group",
        name: "group2",
        id: "1235",
      },
      {
        type: "user",
        name: "user1",
        id: "1236",
      },
      {
        type: "user",
        name: "user2",
        id: "1237",
      },
    ];
    setRoomList(roomList);
  }, []);

  return (
    <div className="side-bar">
      <div className="side-bar-header">
        <h2>Messaging</h2>
        <div className="join-group-container">
          <button
            className="join-group"
            onClick={() => setDisplayJoinGroupMenu(!displayJoinGroupMenu)}
            ref={additionalRef}
          >
            +
          </button>
          {displayJoinGroupMenu ? (
            <div className="join-group-menu" ref={wrapperRef}>
              <Link
                to={"message-user"}
                className="message-user join-group-item"
              >
                Message User
              </Link>
              <Link to={"join-group"} className="join-group join-group-item">
                Join Group
              </Link>
              <Link
                to={"create-group"}
                className="create-group join-group-item"
              >
                Create Group
              </Link>
            </div>
          ) : undefined}
        </div>
      </div>
      <div className="room-type-header">
        <button
          className={activeButton === "all" ? "active-btn" : "inactive-btn"}
          onClick={(e) => {
            setActiveButton(e.currentTarget.value as "all");
          }}
          value={"all"}
        >
          All
        </button>
        <button
          className={activeButton === "user" ? "active-btn" : "inactive-btn"}
          onClick={(e) => {
            setActiveButton(e.currentTarget.value as "user");
          }}
          value={"user"}
        >
          Direct
        </button>
        <button
          className={activeButton === "group" ? "active-btn" : "inactive-btn"}
          onClick={(e) => {
            setActiveButton(e.currentTarget.value as "group");
          }}
          value={"group"}
        >
          Groups
        </button>
      </div>
      <div className="rooms">
        {roomList.length > 0
          ? roomList.map((room) => {
              if (activeButton === "all") {
                return (
                  <NavLink
                    to={`${room.type}/${room.id}`}
                    className="room"
                    key={room.id}
                  >
                    {room.name}
                  </NavLink>
                );
              }
              if (activeButton === room.type) {
                return (
                  <NavLink
                    to={`${room.type}/${room.id}`}
                    className="room"
                    key={room.id}
                  >
                    {room.name}
                  </NavLink>
                );
              }
            })
          : "No Rooms Found"}
      </div>
    </div>
  );
}

export default SideBar;

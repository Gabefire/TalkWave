import { useEffect, useState, useRef } from "react";
import { channelType } from "../../../types/messages";

import "./side_bar.css";
import { Link, NavLink } from "react-router-dom";

import useClickOutside from "../useClickOutside";
import axios from "axios";

function SideBar() {
  const [channelList, setChannelList] = useState([] as channelType[]);
  const [activeButton, setActiveButton] = useState(
    "all" as "all" | "user" | "group"
  );
  const [displayJoinGroupMenu, setDisplayJoinGroupMenu] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const additionalRef = useRef<HTMLButtonElement>(null);
  useClickOutside(
    wrapperRef,
    () => {
      setDisplayJoinGroupMenu(false);
    },
    additionalRef
  );

  useEffect(() => {
    const getChannels = async () => {
      try {
        const channelList = await axios.get<channelType[]>("/api/Channel");
        setChannelList(channelList.data);
      } catch (error) {
        console.log(error);
      }
    };
    getChannels();
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
            <div className="join-group-menu popover" ref={wrapperRef}>
              <div className="triangle"></div>
              <Link
                to={"create-group"}
                className="create-group popover-item"
                onClick={(e) => {
                  if (e) setDisplayJoinGroupMenu(false);
                }}
              >
                Create Group
              </Link>
            </div>
          ) : undefined}
        </div>
      </div>
      <div className="channel-type-header">
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
      <div className="channels">
        {channelList.length > 0
          ? channelList.map((channel) => {
              if (activeButton === "all") {
                return (
                  <NavLink
                    to={`${channel.type}/${channel.channelId}`}
                    className="channel"
                    key={channel.channelId}
                  >
                    {channel.type == "group"
                      ? `# ${channel.name}`
                      : channel.name}
                  </NavLink>
                );
              }
              if (activeButton === channel.type) {
                return (
                  <NavLink
                    to={`${channel.type}/${channel.channelId}`}
                    className="channel"
                    key={channel.channelId}
                  >
                    {channel.type === "group"
                      ? `# ${channel.name}`
                      : channel.name}
                  </NavLink>
                );
              }
            })
          : "No channels Found"}
      </div>
    </div>
  );
}

export default SideBar;

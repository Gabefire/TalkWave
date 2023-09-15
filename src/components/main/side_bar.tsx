import { useEffect, useState } from "react";
import { messageQueryType } from "../../types/messages";

interface sideBarType {
  updateMessageQuery: (data: messageQueryType) => void;
}

function SideBar({ updateMessageQuery }: sideBarType) {
  const [roomList, setRoomList] = useState([] as messageQueryType[]);
  const [activeButton, setActiveButton] = useState(
    "all" as "all" | "direct" | "groups"
  );

  useEffect(() => {
    //API to get group list start in all groups
    const roomList: messageQueryType[] = [
      {
        type: "group",
        name: "group1",
      },
      {
        type: "group",
        name: "group2",
      },
      {
        type: "user",
        name: "user1",
      },
      {
        type: "user",
        name: "user2",
      },
    ];
    setRoomList(roomList);
  }, []);
  const updateMessage = () => {
    const data: messageQueryType = {
      name: "test",
      type: "user",
    };
    updateMessageQuery(data);
  };
  return (
    <div className="side-bar">
      <div className="side-bar-header">
        <h2>Messaging</h2>
        <button>+</button>
      </div>
      <div className="room-type-header">
        <button
          className={activeButton === "all" ? "active-btn" : "inactive-btn"}
          onClick={(e) => {
            console.log(e.currentTarget.value);
            setActiveButton(e.currentTarget.value as "all");
          }}
          value={"all"}
        >
          All
        </button>
        <button
          className={activeButton === "direct" ? "active-btn" : "inactive-btn"}
          onClick={(e) => {
            console.log(e.currentTarget.value);
            setActiveButton(e.currentTarget.value as "direct");
          }}
          value={"direct"}
        >
          Direct
        </button>
        <button
          className={activeButton === "groups" ? "active-btn" : "inactive-btn"}
          onClick={(e) => {
            console.log(e.currentTarget.value);
            setActiveButton(e.currentTarget.value as "groups");
          }}
          value={"groups"}
        >
          Groups
        </button>
      </div>
    </div>
  );
}

export default SideBar;

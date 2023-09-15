import { useEffect, useState } from "react";
import { messageQueryType, roomType } from "../../types/messages";

interface sideBarType {
  updateMessageQuery: (data: messageQueryType) => void;
}

function SideBar({ updateMessageQuery }: sideBarType) {
  const [roomList, setRoomList] = useState([] as roomType[]);
  const [activeButton, setActiveButton] = useState(
    "all" as "all" | "user" | "group"
  );

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
  const updateMessage = (room: roomType) => {
    const data: messageQueryType = {
      name: room.name,
      type: room.type,
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
          className={activeButton === "user" ? "active-btn" : "inactive-btn"}
          onClick={(e) => {
            console.log(e.currentTarget.value);
            setActiveButton(e.currentTarget.value as "user");
          }}
          value={"user"}
        >
          Direct
        </button>
        <button
          className={activeButton === "group" ? "active-btn" : "inactive-btn"}
          onClick={(e) => {
            console.log(e.currentTarget.value);
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
                  <div
                    className="room"
                    key={room.id}
                    onClick={() => updateMessage(room)}
                  >
                    {room.name}
                  </div>
                );
              }
              if (activeButton === room.type) {
                return (
                  <div
                    className="room"
                    key={room.id}
                    onClick={() => updateMessage(room)}
                  >
                    {room.name}
                  </div>
                );
              }
            })
          : "No Rooms Found"}
      </div>
    </div>
  );
}

export default SideBar;

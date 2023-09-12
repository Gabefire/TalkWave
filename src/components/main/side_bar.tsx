import { messageQueryType } from "../../types/messages";

interface sideBarType {
  updateMessageQuery: (data: messageQueryType) => void;
}

function SideBar({ updateMessageQuery }: sideBarType) {
  const onClick = () => {
    const data: messageQueryType = {
      name: "test",
      type: "user",
    };
    updateMessageQuery(data);
  };
  return (
    <>
      <div>Sidebar</div>
      <button onClick={onClick}></button>
    </>
  );
}

export default SideBar;

import "./header.css"

function Header() {
  return (
    <div className="top-header">
      <div className="header-icons">
        <button className="drop-down">=</button>
        <div className="user-field">
          <div className="name">Gabe</div>
          <button className="user-drop-downs">{">"}</button>
        </div>
      </div>
      <h3>TalkWave</h3>
    </div>
  );
}

export default Header;

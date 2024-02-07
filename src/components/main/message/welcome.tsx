import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <>
      <div className="modal">
        <h2>Welcome to TalkWave</h2>
        <button
          className="modal-button welcome-button"
          onClick={() => navigate("/main/create-group")}
        >
          Create Group
        </button>
      </div>
    </>
  );
}

export default Welcome;

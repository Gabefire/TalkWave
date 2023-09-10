import { Link, useNavigate } from "react-router-dom";
import { loginErrorType } from "../../types/auth";

interface mainPageType {
  login: (user: {
    username: string;
    password: string;
  }) => Promise<void | loginErrorType[]>;
}

const MainPage = ({ login }: mainPageType) => {
  const loginTryMe = async () => {
    try {
      await login({ username: "Guest", password: "12345" });
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/main");
    }
  };

  const navigate = useNavigate();
  return (
    <div className="auth">
      <h1>Welcome to TalkWave</h1>
      <button className="auth-btn login" onClick={() => navigate("/login")}>
        Login
      </button>
      <button className="auth-btn sign-up" onClick={() => navigate("/sign-up")}>
        Sign Up
      </button>
      <Link className="auth-link guest" to="/main" onClick={loginTryMe}>
        Continue as Guest
      </Link>
    </div>
  );
};

export default MainPage;

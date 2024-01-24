import { useNavigate } from "react-router-dom";
import { loginErrorType } from "../../types/auth";

interface mainPageType {
  login: (user: {
    email: string;
    password: string;
  }) => Promise<void | loginErrorType[]>;
}

export default function MainPage({ login }: mainPageType) {
  const navigate = useNavigate();

  const loginTryMe = async () => {
    try {
      await login({ email: "test@test.com", password: "1234" });
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/main");
    }
  };

  return (
    <div className="auth">
      <h1>Welcome to TalkWave</h1>
      <button className="auth-btn login" onClick={() => navigate("/login")}>
        Login
      </button>
      <button className="auth-btn sign-up" onClick={() => navigate("/sign-up")}>
        Sign Up
      </button>
      <button className="auth-link guest" onClick={loginTryMe}>
        Continue as Guest
      </button>
    </div>
  );
}

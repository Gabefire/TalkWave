import { useNavigate } from "react-router-dom";
import { useProvideAuth } from "../../hooks/useProvideAuth";

export default function MainPage() {
  const { login } = useProvideAuth();
  const navigate = useNavigate();

  const loginTryMe = async () => {
    try {
      await login({ email: "test@test.com", password: "1234" });
      navigate("/main");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-form">
      <h1>Welcome to TalkWave</h1>
      <button className="auth-btn login" onClick={() => navigate("/login")}>
        Login
      </button>
      <button className="auth-btn sign-up" onClick={() => navigate("/sign-up")}>
        Sign Up
      </button>
      <button className="auth-btn login" onClick={loginTryMe}>
        Continue as Guest
      </button>
    </div>
  );
}

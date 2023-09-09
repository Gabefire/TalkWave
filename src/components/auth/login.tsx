import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginErrorType } from "../../types/auth";
import { useNavigate } from "react-router-dom";

interface loginType {
  login: (user: {
    username: string;
    password: string;
  }) => Promise<void | loginErrorType[]>;
}

const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required").max(100),
  password: z.string().min(1, "Password is required"),
});

type loginFormSchemaType = z.infer<typeof loginFormSchema>;

const Login = ({ login }: loginType) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<loginFormSchemaType>({ resolver: zodResolver(loginFormSchema) });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<loginFormSchemaType> = async (user) => {
    const results = await login(user);
    if (results instanceof Array) {
      results.forEach((obj) => {
        const key = Object.keys(obj)[0];
        const value = Object.values(obj)[0];
        if (key === "username") {
          setError("username", { type: "manual", message: `${value}` });
        } else if (key === "password") {
          setError("password", { type: "manual", message: `${value}` });
        } else if (key === "serverError") {
          setError("root.serverError", { type: "404", message: `${value}` });
        }
      });
      return;
    } else {
      navigate("/");
    }
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>
      <label htmlFor="username" className="form-group">
        Username:
        <input
          aria-label="username"
          type="text"
          id="username"
          placeholder="Enter Username"
          className="form-input"
          {...register("username")}
        />
        <span className="required-span"></span>
        {errors.username && (
          <span className="field-error" aria-live="polite">
            {errors.username?.message}
          </span>
        )}
      </label>
      <label htmlFor="password">
        Password:
        <input
          type="password"
          id="password"
          placeholder="Enter Password"
          className="form-input"
          autoComplete="current-password"
          {...register("password")}
        />
        <span className="required-span"></span>
        {errors.password && (
          <span className="field-error" aria-live="polite">
            {errors.password?.message}
          </span>
        )}
      </label>
      {errors.root && (
        <div className="errors">{errors.root?.serverError.message}</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="form-button login"
      >
        Login
      </button>
    </form>
  );
};

export default Login;

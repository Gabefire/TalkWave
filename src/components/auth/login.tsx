import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useProvideAuth from "../../hooks/useProvideAuth";
import { useNavigate } from "react-router-dom";

const loginFormSchema = z.object({
  email: z.string().min(1, "Email is required").max(100),
  password: z.string().min(1, "Password is required"),
});

type loginFormSchemaType = z.infer<typeof loginFormSchema>;

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<loginFormSchemaType>({ resolver: zodResolver(loginFormSchema) });

  const { login } = useProvideAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<loginFormSchemaType> = async (user) => {
    const results = await login(user);
    if (results instanceof Array) {
      results.forEach((obj) => {
        const key = Object.keys(obj)[0];
        const value = Object.values(obj)[0];
        if (key === "email") {
          setError("email", { type: "manual", message: `${value}` });
        } else if (key === "password") {
          setError("password", { type: "manual", message: `${value}` });
        } else if (key === "root") {
          setError("root.serverError", { type: "404", message: `${value}` });
        }
      });
    } else {
      navigate("/main");
    }
  };
  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Login</h1>
      <label htmlFor="email" className="form-group">
        Email:
        <input
          aria-label="email"
          type="text"
          id="email"
          placeholder="Enter email"
          className="form-input"
          {...register("email")}
        />
        <span className="required-span"></span>
        {errors.email && (
          <span className="field-error" aria-live="polite">
            {errors.email?.message}
          </span>
        )}
      </label>
      <label htmlFor="password" className="form-group">
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
      <button
        className="form-button sign-up"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        Back
      </button>
    </form>
  );
}

export default Login;

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginErrorType, signUpErrorType } from "../../types/auth";
import { useNavigate } from "react-router-dom";

interface signUpType {
  login: (user: {
    email: string;
    password: string;
  }) => Promise<void | loginErrorType[]>;
  signUp: (user: {
    userName: string;
    email: string;
    password: string;
  }) => Promise<void | signUpErrorType[]>;
}

const signUpFormSchema = z
  .object({
    userName: z.string().min(1, "Username is required").max(100),
    email: z.string().email("Invalid email").or(z.literal("")),
    password: z.string().min(1, "Password is required"),
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Passwords do not match",
  });

export type signUpFormSchemaType = z.infer<typeof signUpFormSchema>;

const SignUp = ({ signUp, login }: signUpType) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<signUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
  });

  const navigate = useNavigate();

  const validateResults = (results: signUpErrorType[] | loginErrorType[]) => {
    results.forEach((obj) => {
      const key = Object.keys(obj)[0];
      const value = Object.values(obj)[0];
      if (key === "userName") {
        setError("userName", { type: "manual", message: `${value}` });
      } else if (key === "password") {
        setError("password", { type: "manual", message: `${value}` });
      } else if (key == "email") {
        setError("email", { type: "manual", message: `${value}` });
      } else if (key === "root") {
        setError("root.serverError", { type: "manual", message: `${value}` });
      } else if (key === "passwordConfirmation") {
        setError("passwordConfirmation", {
          type: "manual",
          message: `${value}`,
        });
      } else if (key === "email") {
        setError("email", { type: "manual", message: `${value}` });
      }
    });
  };

  const onSubmit: SubmitHandler<signUpFormSchemaType> = async (user) => {
    const signUpResults = await signUp(user);
    if (signUpResults instanceof Array && signUpResults.length > 0) {
      validateResults(signUpResults);
      return;
    } else {
      const loginResults = await login({
        email: user.email,
        password: user.password,
      });
      if (loginResults instanceof Array && loginResults.length > 0) {
        validateResults(loginResults);
        return;
      }
      navigate("/main");
    }
  };
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      <h1>Sign Up</h1>
      <label htmlFor="username" className="form-group">
        Username:
        <input
          aria-label="username"
          type="text"
          id="username"
          placeholder="Enter Username"
          className="form-input"
          {...register("userName")}
        />
        <span className="required-span"></span>
        {errors.userName && (
          <span className="field-error" aria-live="polite">
            {errors.userName?.message}
          </span>
        )}
      </label>
      <label htmlFor="email" className="form-group">
        Email:
        <input
          aria-label="email"
          type="email"
          id="email"
          placeholder="Enter Email"
          className="form-input"
          {...register("email")}
        />
        <span className="required-span"></span>
        {errors.email !== undefined && (
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
          autoComplete="new-password"
          {...register("password")}
        />
        <span className="required-span"></span>
        {errors.password && (
          <span className="field-error" aria-live="polite">
            {errors.password?.message}
          </span>
        )}
      </label>
      <label htmlFor="password-confirmation" className="form-group">
        Confirm Password:
        <input
          type="password"
          id="password-confirmation"
          placeholder="Confirm Password"
          className="form-input"
          autoComplete="new-password"
          {...register("passwordConfirmation")}
        />
        <span className="required-span"></span>
        {errors.passwordConfirmation && (
          <span className="field-error" aria-live="polite">
            {errors.passwordConfirmation?.message}
          </span>
        )}
      </label>
      {errors.root && (
        <div className="errors">{errors.root?.serverError.message}</div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="form-button sign-up"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignUp;

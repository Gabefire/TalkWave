import { signUpUserType, loginErrorType } from "../../types/auth";

export const signUp = (signUpUser: signUpUserType) => {
  // API call to sign up user return JWT token and log in
  try {
    if (signUpUser.username === "error") {
      throw new Error("something went wrong");
    } else {
      console.log(signUpUser);
    }
  } catch (err) {
    if (typeof err === "string") {
      return [{ serverError: err }];
    } else if (err instanceof Error) {
      return [{ serverError: err.message }];
    }
  }
};

export const login = async (user: {
  username: string;
  password: string;
}): Promise<void | loginErrorType[]> => {
  // API call to log in JWT token added to local storage
  try {
    if (user.username === "error") {
      throw new Error("something went wrong");
    } else {
      console.log(user);
    }
  } catch (err) {
    if (typeof err === "string") {
      return [{ root: err }];
    } else if (err instanceof Error) {
      return [{ root: err.message }];
    }
  }
};

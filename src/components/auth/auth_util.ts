import { loginErrorType, signUpErrorType } from "../../types/auth";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.API_URL;

export const signUp = async (signUpUser: {
  userName: string;
  password: string;
  email: string;
}): Promise<void | signUpErrorType[]> => {
  try {
    const result = await axios.post("/api/User/register", signUpUser)
    if (result.status != 200) {
      throw new Error(result.data);
    } 
  } catch (err) {

    if (typeof err === "string") {
      return [{ root: err }];
    } else if (axios.isAxiosError(err)){
      if (err.response?.status == 409)
      {
        return [{ root: err.response?.data }];
      }
      else
      {
        return [{root: "Something went wrong"}]
      }
    }
  }
};

export const login = async (user: {
  email: string;
  password: string;
}): Promise<void | loginErrorType[]> => {
  try {
    const jwt  = (await axios.post<string>("/api/User/login", user)).data
    localStorage.setItem("auth", jwt)
  } catch (err) {
    if (typeof err === "string") {
      return [{ root: err }];
    } else if (axios.isAxiosError(err)) {
      return [{ root: err.response?.data }];
      }
    }
  };

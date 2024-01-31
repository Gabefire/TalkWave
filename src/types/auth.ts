export type signUpUserType = {
  userName: string;
  password: string;
  passwordConfirmation: string;
  email: string;
}

export type loginUserType = {
  email: string;
  password: string;
}

export type loginUserDtoType = {
  userName: string;
  token: string;
}

export type user = {
  userName: string;
  email: string;
}

export type loginErrorType = {
  userName?: string;
  password?: string;
  root?: string;
}

export type signUpErrorType = {
  userName?: string;
  password?: string;
  passwordConfirmation?: string;
  email?: string;
  root?: string;
}

export type authContextType = {
  userName: string | null,
  setUserName: (userName: string| null) => void
  token: string | null,
  setToken: (token: string | null) => void 
}


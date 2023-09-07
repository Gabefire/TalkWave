export interface signUpUserType {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

export interface loginErrorType {
  username?: string;
  password?: string;
  root?: string;
}

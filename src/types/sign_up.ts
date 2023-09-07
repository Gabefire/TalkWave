export interface signUpUserType {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

export interface loginErrorType {
  username?: string;
  password?: string;
  connection?: string;
}

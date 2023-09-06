export interface signUpUserType {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
}

export type errorHandlerFuncType = (err: Error | string) => void;

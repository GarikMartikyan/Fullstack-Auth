export interface IUserRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUserLoginForm {
  email: string;
  password: string;
}

export type UserRegisterRequest = {
  email: string;
  password: string;
};

export type UserLoginRequest = UserRegisterRequest;

export type UserRegisterResponse = {
  accessToken: string;
  refreshToken: string;
  user: IUserData;
};

export type UserLoginResponse = UserRegisterResponse;

export interface IUserData {
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
}

export interface IErrorResponse {
  message: string;
  errors: Record<string, string>;
}

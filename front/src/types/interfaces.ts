export interface IUserRegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUserRegisterRequest {
  email: string;
  password: string;
}

export interface IUserLoginForm {
  email: string;
  password: string;
}

export interface IUserLoginRequest {
  email: string;
  password: string;
}

export interface IUserData {
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
}

export interface IUserResponse {
  user: IUserData;
  accessToken: string;
  refreshToken: string;
}

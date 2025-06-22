
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    email: string;
    isSubscribed: boolean;
  };
  token: string;
}

export interface RefreshResponse {
  token: string;
  expiresIn: number;
}

export interface VerifyResponse {
  user: {
    email: string;
    isSubscribed: boolean;
  };
}

export interface SubscribeResponse {
  success: boolean;
  user: {
    email: string;
    isSubscribed: boolean;
  };
}

export type FirebaseLoginRequest = LoginRequest;
export type FirebaseRegisterRequest = RegisterRequest;

export interface FirebaseUserData {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  photoURL?: string;
  isSubscribed: boolean;
}

export interface AuthStateUser {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  isEmailVerified: boolean;
  photoURL?: string;
}

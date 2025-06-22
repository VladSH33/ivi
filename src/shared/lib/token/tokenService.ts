import Cookies from 'js-cookie';

const TOKEN_KEY = "auth_token";

export const tokenService = {
  getToken: () => {
    return Cookies.get(TOKEN_KEY);
  },

  setToken: (token: string, expiresIn?: number) => {
    if (expiresIn) {
      Cookies.set(TOKEN_KEY, token, {
        expires: expiresIn / (60 * 60 * 24),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    } else {
      Cookies.set(TOKEN_KEY, token, {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    }
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },
}; 
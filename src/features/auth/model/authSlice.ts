import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/firebase';
import { 
  FirebaseAuthService, 
  FirebaseUser, 
  FirebaseLoginRequest, 
  FirebaseRegisterRequest 
} from '../api/firebaseAuthService';
import { tokenService } from '@/shared/lib/token/tokenService';

interface User {
  id: string;
  email: string;
  name: string;
  isSubscribed: boolean;
  isEmailVerified: boolean;
  photoURL?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

export const loginWithEmail = createAsyncThunk(
  'auth/loginWithEmail',
  async (credentials: FirebaseLoginRequest, { rejectWithValue }) => {
    try {
      const user = await FirebaseAuthService.loginWithEmail(credentials);
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const registerWithEmail = createAsyncThunk(
  'auth/registerWithEmail',
  async (userData: FirebaseRegisterRequest, { rejectWithValue }) => {
    try {
      const user = await FirebaseAuthService.registerWithEmail(userData);
      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await FirebaseAuthService.logout();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await FirebaseAuthService.resetPassword(email);
      return email;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    return new Promise<FirebaseUser | null>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            const tokenResult = await firebaseUser.getIdTokenResult();
            const expirationTime = new Date(tokenResult.expirationTime).getTime();
            const currentTime = Date.now();
            const expiresInSeconds = (expirationTime - currentTime) / 1000;
            
            tokenService.setToken(token, expiresInSeconds);

            const user: FirebaseUser = {
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              name: firebaseUser.displayName || firebaseUser.email!.split('@')[0],
              isEmailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL || undefined
            };
            resolve(user);
          } catch (error) {
            console.error('Ошибка инициализации токена:', error);
            resolve(null);
          }
        } else {
          tokenService.removeToken();
          resolve(null);
        }
        unsubscribe();
      });
    });
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    toggleSubscription: (state) => {
      if (state.user) {
        state.user.isSubscribed = !state.user.isSubscribed;
      }
    },
    setSubscription: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isSubscribed = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...action.payload,
          isSubscribed: false
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(registerWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = {
          ...action.payload,
          isSubscribed: false
        };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isInitialized = true;
        if (action.payload) {
          state.user = {
            ...action.payload,
            isSubscribed: false
          };
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      });
  },
});

export const { setUser, clearUser, clearError, setInitialized, toggleSubscription, setSubscription } = authSlice.actions;
export default authSlice.reducer;
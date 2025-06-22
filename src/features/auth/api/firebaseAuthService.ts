import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  AuthError
} from "firebase/auth";
import { auth } from "@/app/firebase";
import { tokenService } from "@/shared/lib/token/tokenService";

export interface FirebaseLoginRequest {
  email: string;
  password: string;
}

export interface FirebaseRegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface FirebaseUser {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  photoURL?: string;
}

export class FirebaseAuthService {
  static async registerWithEmail({ email, password, name }: FirebaseRegisterRequest): Promise<FirebaseUser> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name
      });

      await sendEmailVerification(user);

      const token = await user.getIdToken();
      const tokenResult = await user.getIdTokenResult();
      const expirationTime = new Date(tokenResult.expirationTime).getTime();
      const currentTime = Date.now();
      const expiresInSeconds = (expirationTime - currentTime) / 1000;
      
      tokenService.setToken(token, expiresInSeconds);

      return {
        id: user.uid,
        email: user.email!,
        name: name,
        isEmailVerified: user.emailVerified,
        photoURL: user.photoURL || undefined
      };
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  static async loginWithEmail({ email, password }: FirebaseLoginRequest): Promise<FirebaseUser> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const token = await user.getIdToken();
      const tokenResult = await user.getIdTokenResult();
      const expirationTime = new Date(tokenResult.expirationTime).getTime();
      const currentTime = Date.now();
      const expiresInSeconds = (expirationTime - currentTime) / 1000;
      
      tokenService.setToken(token, expiresInSeconds);

      return {
        id: user.uid,
        email: user.email!,
        name: user.displayName || user.email!.split('@')[0],
        isEmailVerified: user.emailVerified,
        photoURL: user.photoURL || undefined
      };
    } catch (error) {
      console.error('Ошибка входа:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
      tokenService.removeToken();
    } catch (error) {
      console.error('Ошибка выхода:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Ошибка сброса пароля:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  static getCurrentUser(): User | null {
    return auth.currentUser;
  }

  static async resendEmailVerification(): Promise<void> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Пользователь не авторизован');
    }

    try {
      await sendEmailVerification(user);
    } catch (error) {
      console.error('Ошибка отправки email верификации:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  static async refreshToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    try {
      const token = await user.getIdToken(true); // force refresh
      const tokenResult = await user.getIdTokenResult();
      const expirationTime = new Date(tokenResult.expirationTime).getTime();
      const currentTime = Date.now();
      const expiresInSeconds = (expirationTime - currentTime) / 1000;
      
      tokenService.setToken(token, expiresInSeconds);
      
      return token;
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      return null;
    }
  }

  static async getCurrentToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }

    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Ошибка получения токена:', error);
      return null;
    }
  }

  private static handleAuthError(error: AuthError): Error {
    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('Пользователь с таким email не найден');
      case 'auth/wrong-password':
        return new Error('Неверный пароль');
      case 'auth/email-already-in-use':
        return new Error('Пользователь с таким email уже существует');
      case 'auth/weak-password':
        return new Error('Пароль слишком слабый. Минимум 6 символов');
      case 'auth/invalid-email':
        return new Error('Неверный формат email');
      case 'auth/too-many-requests':
        return new Error('Слишком много попыток. Попробуйте позже');
      case 'auth/network-request-failed':
        return new Error('Ошибка сети. Проверьте интернет-соединение и настройки браузера');
      case 'auth/popup-closed-by-user':
        return new Error('Окно авторизации было закрыто');
      case 'auth/cancelled-popup-request':
        return new Error('Авторизация была отменена');
      default:
        return new Error(error.message || 'Произошла неизвестная ошибка');
    }
  }
} 
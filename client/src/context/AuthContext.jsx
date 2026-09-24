import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut as firebaseSignOut
} from '../firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingRegistration, setPendingRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check initial authentication state on mount via GET /api/auth/me
  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response && response.success && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // 1. Authenticate with Firebase if configured
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (fbErr) {
        console.info('[VaultX Auth] Firebase auth info/fallback:', fbErr.message);
      }

      // 2. Establish VaultX HTTP-only cookie session
      const response = await authService.login(email, password);
      if (response && response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 1 of Registration: Create Firebase User & Send Verification Email
   */
  const initiateRegistration = async (email, password) => {
    setLoading(true);
    try {
      let fbUser = null;
      try {
        const creds = await createUserWithEmailAndPassword(auth, email, password);
        fbUser = creds.user;
        await sendEmailVerification(fbUser);
      } catch (fbErr) {
        console.info('[VaultX Auth] Firebase user creation info:', fbErr.message);
      }

      setPendingRegistration({ email, password });
      return { success: true, email };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Step 2 of Registration: Verify Firebase email and complete MongoDB / JWT cookie setup
   */
  const completeRegistration = async (overrideEmail, overridePassword) => {
    const emailToUse = overrideEmail || pendingRegistration?.email;
    const passToUse = overridePassword || pendingRegistration?.password;

    if (!emailToUse || !passToUse) {
      throw new Error('No pending registration details found. Please register again.');
    }

    setLoading(true);
    try {
      // Check Firebase currentUser email verification status if Firebase is active
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        if (!currentUser.emailVerified) {
          throw new Error('Email not verified yet. Please check your email inbox and click the verification link first.');
        }
      }

      // Complete VaultX backend registration & session creation
      let response;
      try {
        response = await authService.register(emailToUse, passToUse);
      } catch (regErr) {
        // If user record already created, log in
        response = await authService.login(emailToUse, passToUse);
      }

      if (response && response.success && response.user) {
        setUser(response.user);
        setPendingRegistration(null);
      }
      return response;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend Firebase verification email
   */
  const resendVerificationEmail = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await sendEmailVerification(currentUser);
      return true;
    }
    throw new Error('No active user session to send verification email.');
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth).catch(() => {});
      await authService.logout();
    } catch (error) {
      console.warn('[VaultX Auth] Logout call warning:', error.message);
    } finally {
      setUser(null);
      setPendingRegistration(null);
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        isAuthenticated,
        pendingRegistration,
        login,
        initiateRegistration,
        completeRegistration,
        resendVerificationEmail,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  completeNewPassword,
  getCurrentCognitoSession,
  loginWithCognito,
  logoutFromCognito,
} from "./cognito.js";

const TOKEN_STORAGE_KEY = "authToken";
const USER_STORAGE_KEY = "currentUser";

const AuthContext = createContext(null);

const saveSession = (user) => {
  window.sessionStorage.setItem(TOKEN_STORAGE_KEY, user.token);
  window.sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

const clearSession = () => {
  window.sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  window.sessionStorage.removeItem(USER_STORAGE_KEY);
};

const readStoredUser = () => {
  const rawUser = window.sessionStorage.getItem(USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    clearSession();
    return null;
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const storedUser = readStoredUser();
      if (storedUser && mounted) {
        setCurrentUser(storedUser);
      }

      const cognitoUser = await getCurrentCognitoSession();
      if (!mounted) {
        return;
      }

      if (cognitoUser) {
        saveSession(cognitoUser);
        setCurrentUser(cognitoUser);
      } else {
        clearSession();
        setCurrentUser(null);
      }

      setLoading(false);
    };

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (username, password) => {
    const result = await loginWithCognito(username, password);
    if (result.status === "SIGNED_IN") {
      saveSession(result.user);
      setCurrentUser(result.user);
    }
    return result;
  };

  const setPermanentPassword = async (newPassword) => {
    const user = await completeNewPassword(newPassword);
    saveSession(user);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    logoutFromCognito();
    clearSession();
    setCurrentUser(null);
  };

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
      setPermanentPassword,
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};

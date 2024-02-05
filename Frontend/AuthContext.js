import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isUserAuthenticated: true,
      };
    case 'LOGOUT':
      return {
        ...state,
        isUserAuthenticated: false,
      };
    default:
      return state;
  }
};

const initialState = {
  isUserAuthenticated: false,
};

// AuthProvider component to wrap the app and provide authentication context
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Check if token exists in AsyncStorage
        const token = await AsyncStorage.getItem('token');

        if (token) {
          // Dispatch action to set user as authenticated
          dispatch({ type: 'LOGIN' });
        }
      } catch (error) {
        // TODO Handle AsyncStorage or token retrieval errors
      }
    };

    checkAuthState();
  }, []);

  const login = async (token) => {
    try {
      // Save the JWT token in AsyncStorage upon successful login
      await AsyncStorage.setItem('token', token);

      // Dispatch action to set user as authenticated
      dispatch({ type: 'LOGIN' });
    } catch (error) {
      // TODO Handle AsyncStorage or token storage errors
    }
  };

  const logout = async () => {
    try {
      // Remove the JWT token from AsyncStorage upon logout
      await AsyncStorage.removeItem('token');

      // Dispatch action to set user as not authenticated
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      // TODO Handle AsyncStorage or token removal errors
    }
  };

  return (
    <AuthContext.Provider value={{ state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
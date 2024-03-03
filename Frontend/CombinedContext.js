import React, { createContext, useReducer, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";

const url = process.env.REACT_APP_BACKEND_URL

const CombinedContext = createContext();

export const useCombinedContext = () => useContext(CombinedContext);

const combinedReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isUserAuthenticated: true,
        userData: action.payload.userData,
      };
    case 'LOGOUT':
      return {
        ...state,
        isUserAuthenticated: false,
        userData: null,
      };
    case 'SET_USER':
      return {
        ...state,
        userData: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {
  isUserAuthenticated: false,
  userData: null,
};

export const CombinedProvider = ({ children }) => {
  const [state, dispatch] = useReducer(combinedReducer, initialState);

  useEffect(() => {
  const checkAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (token) {
        const userData = await AsyncStorage.getItem('userData');
        // TODO Remove!!! Dev Only
        console.log("USER DATA", userData)
        if (userData) {
          dispatch({ type: 'LOGIN', payload: { userData: JSON.parse(userData) } });
        } else {
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
    } catch (error) {
      console.error('Error retrieving authentication state:', error);
    }
  };

  checkAuthState();
}, []);

  const setUser = (userData) => {
        dispatch({type: 'SET_USER', payload: userData});
        AsyncStorage.setItem('userData', JSON.stringify(userData));
    };

  const login = async (token) => {
  try {
    await AsyncStorage.setItem('token', token);

    const userData = await fetchUserData();

    await AsyncStorage.setItem('userData', JSON.stringify(userData));

    dispatch({ type: 'LOGIN', payload: { userData } });
  } catch (error) {
    console.error('Error storing token or fetching user data:', error);
  }
};

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const apiKey = process.env.REACT_NATIVE_API_KEY;
      const storedToken = await AsyncStorage.getItem('token');

      // TODO Remove!!! Dev Only
      console.log("STORED TOKEN", storedToken)
      if (storedToken) {

          console.log("Collecting user data from backend")
        const decodedToken = jwtDecode(storedToken);
        const user_id = decodedToken.sub;
        const config = {
          headers: {
            'X-API-Key': apiKey,
          },
        };
        const response = await axios.post(`${url}/account`, { id: user_id }, config);
        return response.data.user;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const updateUserFromBackend = async () => {
    try {
      const updatedUserData = await fetchUserData();
      // TODO Remove!!! Dev Only
      console.log("Setting user data from backend")
      console.log(updatedUserData)
      dispatch({ type: 'SET_USER', payload: updatedUserData });
    } catch (error) {
      console.error('Error updating user data from backend:', error);
    }
  };

  useEffect(() => {
    updateUserFromBackend();
  }, []);

  return (
    <CombinedContext.Provider value={{userData: state.userData, state, setUser, login, logout, updateUserFromBackend }}>
      {children}
    </CombinedContext.Provider>
  );
};
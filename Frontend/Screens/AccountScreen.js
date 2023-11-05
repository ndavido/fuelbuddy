import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

// Styling 
import {
  Main,
  ContainerWrapper,
  ContainerInner,
  ContainerContent,
  InputWrapper,
  TxtWrapper,
  WelcomeTxt,
  BttnDiv2,
} from '../styles/wrapper';

const AccountScreen = () => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API request to fetch user account information from the backend
    const fetchUserInfo = async () => {
      try {
        const apiKey = process.env.REACT_NATIVE_API_KEY;

        // Add the API key to the request headers
        const config = {
          headers: {
            'X-API-Key': apiKey,
          },
        };

        const response = await axios.post('http://127.0.0.1:5000/account', { username: "TEST" }, config);
        if (response.data) {
          const userJSON = response.data.user; // Assuming userJSON is a JSON string
          const parsedUser = JSON.parse(userJSON); // Parse the JSON string

          setUserInfo(parsedUser);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user account information:', error);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <Main>
      <ContainerWrapper>
        <ContainerInner>
          <ContainerContent>
            <TxtWrapper>
              <WelcomeTxt>Your Account</WelcomeTxt>
            </TxtWrapper>
            {loading ? (
              <Text>Loading...</Text>
            ) : (
              <InputWrapper>
                <Text>Full Name: {userInfo.full_name}</Text>
                <Text>@{userInfo.username}</Text>
                <Text>Phone Number: {userInfo.phone_number}</Text>
                <Text>Email: {userInfo.email}</Text>
              </InputWrapper>
            )}
          </ContainerContent>
        </ContainerInner>
      </ContainerWrapper>
    </Main>
  );
};

export default AccountScreen;

import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import axios from 'axios';

// Styling 
import {
  Main2,
} from '../styles/wrapper';
import {
  AccountWrapper, AccountInner, AccountContent, AccountTopInfo, AccountBottomInfo, AccountTitle, AccountTxt, AccountTxtWrapper, AccountUsername
} from '../styles/accountPage';
import MainLogo from '../styles/mainLogo';
import AccountImg from '../styles/accountImg';

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

        const response = await axios.post('ec2-54-172-255-239.compute-1.amazonaws.com/account', { username: "TEST" }, config);
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
    <Main2>
      <MainLogo/>
      <AccountWrapper>
        <AccountInner>
          <AccountTopInfo>
            <AccountContent>
              <AccountTitle>Account</AccountTitle>
              <AccountImg/>
              <AccountUsername>@{userInfo.username}</AccountUsername>
            </AccountContent>
          </AccountTopInfo>
          <AccountBottomInfo>
            <AccountContent>
              <AccountTxtWrapper>
                <Text>Name</Text>
                <AccountTxt>{userInfo.full_name}</AccountTxt>
                <Text>Phone Number</Text>
                <AccountTxt>{userInfo.phone_number}</AccountTxt>
                <Text>Email</Text>
                <AccountTxt>{userInfo.email}</AccountTxt>
              </AccountTxtWrapper>
            </AccountContent>
          </AccountBottomInfo>
        </AccountInner>
      </AccountWrapper>
    </Main2>
  );
};

export default AccountScreen;

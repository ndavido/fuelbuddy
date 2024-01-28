import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode";
import * as Updates from 'expo-updates';

// Styling
import {
    AccountWrapper,
    AccountInner,
    AccountContent,
    AccountTopInfo,
    AccountBottomInfo,
    AccountTitle,
    AccountRegularInfo,
    AccountTxt,
    AccountTxtWrapper,
    AccountUsername,
    DeveloperTick
} from '../styles/accountPage';
import MainLogo from '../styles/mainLogo';
import AccountImg from '../styles/accountImg';
import {MenuButton} from "../styles/accountButton";
import {H3, H4, H5, H6} from "../styles/text";
import {InputTxt, Main} from "../styles/styles";
import {TAnimatedGenericButton} from "../styles/AnimatedIconButton";

const url = process.env.REACT_APP_BACKEND_URL

const AccountScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedFullName, setEditedFullName] = useState('');
    const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation();

    const handleEditToggle = () => {
        setEditMode(!editMode);
        // Initialize editable fields with current data
        if (!editMode) {
            setEditedFullName(userInfo.full_name);
            setEditedPhoneNumber(userInfo.phone_number);
            setEditedEmail(userInfo.email);
        }
    };

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const handleSave = async () => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            // Prepare the updated user data
            const updatedUserData = {
                ...userInfo,
                full_name: editedFullName,
                phone_number: editedPhoneNumber,
                email: editedEmail
            };

            // API call to update user information
            const response = await axios.patch(`${url}/edit_account`, updatedUserData, config);

            if (response.data && response.data.message === 'Account updated successfully') {
                // Update local user info state and exit edit mode
                setUserInfo(updatedUserData);
                setEditMode(false);

                // Update the user data in AsyncStorage
                await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
            } else {
                // Handle unsuccessful update
                console.log("Update unsuccessful");
            }
        } catch (error) {
            console.error('Error updating account:', error);
        }
    };

    const handleDelete = () => {
        navigation.navigate('DeleteConfirm');
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userDataJson = await AsyncStorage.getItem('userData');
                if (userDataJson) {
                    const userData = JSON.parse(userDataJson);
                    setUserInfo(userData);

                    // Set initial values for editable fields
                    setEditedFullName(userData.full_name || '');
                    setEditedPhoneNumber(userData.phone_number || '');
                    setEditedEmail(userData.email || '');
                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <Main>
            <MainLogo bButton={true}/>
            <AccountWrapper>
                <AccountRegularInfo>
                    <AccountContent>
                        <H3 tmargin='20px' lmargin='20px' bmargin='10px'>Account</H3>
                        <AccountTxtWrapper>
                            <H5 tmargin='10px' bmargin='10px'>Personal Information</H5>
                            <TAnimatedGenericButton text="Route To Station" onPress={() => {}}/>
                            {editMode ? (
                                <>
                                    <H6 bmargin='5px'>Username</H6>
                                    <AccountTxt bgColor='grey'>@{userInfo.username}</AccountTxt>
                                    <H6 bmargin='5px'>Phone Number</H6>
                                    <AccountTxt bgColor='grey'>{userInfo.phone_number}</AccountTxt>
                                    <H6 bmargin='5px'>Name</H6>
                                    <InputTxt bcolor='white' value={editedFullName} onChangeText={setEditedFullName}
                                               placeholder="Full Name"/>
                                    <H6 bmargin='5px'>Email</H6>
                                    <InputTxt bcolor='white' value={editedEmail} onChangeText={setEditedEmail}
                                               placeholder="Email"/>
                                    <Button title="Save" onPress={handleSave}/>
                                </>
                            ) : (
                                <>
                                    <H6 bmargin='5px'>Username</H6>
                                    <AccountTxt bgColor='grey'>@{userInfo.username}</AccountTxt>
                                    <H6 bmargin='5px'>Phone Number</H6>
                                    <AccountTxt bgColor='grey'>{userInfo.phone_number}</AccountTxt>
                                    <H6 bmargin='5px'>Name</H6>
                                    <AccountTxt bgColor='#FFFFFF'>{userInfo.full_name}</AccountTxt>
                                    <H6 bmargin='5px'>Email</H6>
                                    <AccountTxt bgColor='#FFFFFF'>{userInfo.email}</AccountTxt>
                                </>
                            )}
                            <Button title={editMode ? "Cancel" : "Edit"} onPress={handleEditToggle}/>
                            <H6 tmargin='10px' bmargin='10px'>{message}</H6>
                            <H5 tmargin='40px' bmargin='5px'>Delete Account</H5>
                            <H6 style={{opacity: 0.6}} bmargin='20px' weight='400'>Not comfortable? Deleting your
                                account will
                                remove all data from our servers</H6>
                            <MenuButton title='Delete Account'
                                        bgColor='red'
                                        txtColor='white'
                                        onPress={handleDelete}
                                        emoji="🥲"/>
                        </AccountTxtWrapper>
                    </AccountContent>
                </AccountRegularInfo>
            </AccountWrapper>
        </Main>
    );
};

export default AccountScreen;
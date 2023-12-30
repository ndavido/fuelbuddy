import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode";

// Styling
import {
    Main2,
} from '../styles/wrapper';
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

const AccountScreen = () => {
    const [userInfo, setUserInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedFullName, setEditedFullName] = useState('');
    const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
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

    const handleSave = async () => {
        try {
            const apiKey = process.env.REACT_NATIVE_API_KEY;

            // Add the API key to the request headers
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            await axios.patch('http://127.0.0.1:5000/edit_account', {
                username: userInfo.username,
                full_name: editedFullName,
                phone_number: editedPhoneNumber,
                email: editedEmail
            }, config);
            // Update local user info state and exit edit mode
            setUserInfo({...userInfo, full_name: editedFullName, phone_number: editedPhoneNumber, email: editedEmail});
            setEditMode(false);
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
                    setUserInfo(JSON.parse(userDataJson));
                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <Main2>
            <MainLogo bButton={true} />
            <AccountWrapper>
                <AccountInner>
                    <AccountRegularInfo>
                        <AccountContent>
                            <H3 tmargin='20px' lmargin='20px' bmargin='10px'>Account</H3>
                            <AccountTxtWrapper>
                                <H5 tmargin='10px' bmargin='10px'>Personal Information</H5>
                                {editMode ? (
                                    <>
                                        <H6 bmargin='5px'>Username</H6>
                                        <AccountTxt bgColor='grey'>@{userInfo.username}</AccountTxt>
                                        <H6 bmargin='5px'>Name</H6>
                                        <TextInput value={editedFullName} onChangeText={setEditedFullName}
                                                   placeholder="Full Name"/>
                                        <H6 bmargin='5px'>Phone Number</H6>
                                        <TextInput value={editedPhoneNumber} onChangeText={setEditedPhoneNumber}
                                                   placeholder="Phone Number"/>
                                        <H6 bmargin='5px'>Email</H6>
                                        <TextInput value={editedEmail} onChangeText={setEditedEmail}
                                                   placeholder="Email"/>
                                        <Button title="Save" onPress={handleSave}/>
                                    </>
                                ) : (
                                    <>
                                        <H6 bmargin='5px'>Username</H6>
                                        <AccountTxt bgColor='grey'>@{userInfo.username}</AccountTxt>
                                        <H6 bmargin='5px'>Name</H6>
                                        <AccountTxt bgColor='#FFFFFF'>{userInfo.full_name}</AccountTxt>
                                        <H6 bmargin='5px'>Phone Number</H6>
                                        <AccountTxt bgColor='#FFFFFF'>{userInfo.phone_number}</AccountTxt>
                                        <H6 bmargin='5px'>Email</H6>
                                        <AccountTxt bgColor='#FFFFFF'>{userInfo.email}</AccountTxt>
                                    </>
                                )}
                                <Button title={editMode ? "Cancel" : "Edit"} onPress={handleEditToggle}/>
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
                </AccountInner>
            </AccountWrapper>
        </Main2>
    );
};

export default AccountScreen;
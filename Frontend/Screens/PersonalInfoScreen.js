import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, RefreshControl} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import { useCombinedContext } from '../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import MainLogo from '../styles/mainLogo';
import {H3, H4, H5, H6} from "../styles/text";
import {AccountContainer, ButtonContainer, InputTxt, Main, TextContainer, WrapperScroll} from "../styles/styles";
import {ButtonButton} from "../styles/buttons";

const url = process.env.REACT_APP_BACKEND_URL

const AccountScreen = () => {
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editedFullName, setEditedFullName] = useState('');
    const [editedPhoneNumber, setEditedPhoneNumber] = useState('');
    const [editedEmail, setEditedEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const { userData, setUser, updateUserFromBackend } = useCombinedContext();

    const handleEditToggle = () => {
        setEditMode(!editMode);

        if (!editMode) {
            setEditedFullName(userData.full_name);
            setEditedPhoneNumber(userData.phone_number);
            setEditedEmail(userData.email);
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

            const updatedUserData = {
                ...userData,
                full_name: editedFullName,
                phone_number: editedPhoneNumber,
                email: editedEmail
            };

            const response = await axios.patch(`${url}/edit_account`, updatedUserData, config);

            if (response.data && response.data.message === 'Account updated successfully') {
                setUser({ ...updatedUserData });
                setEditMode(false);

            } else {
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
        updateUserFromBackend();
    }, []);

    return (
        <Main>
            <MainLogo bButton={true} PageTxt='Account'/>
            <WrapperScroll>
                <AccountContainer style={{minHeight: 800}}>
                    <H3 tmargin='20px' bmargin='20px'>my Info</H3>
                    <ButtonContainer style={{position: 'absolute', marginTop: 15, marginLeft: 10}}>
                        <View style={{zIndex: 1, marginLeft: 'auto', flexDirection: "row"}}>
                            {editMode ? (<ButtonButton text={"Save"} color={"#6BFF91"} onPress={handleSave}/>) : null}
                            <ButtonButton color={editMode ? "red" : "#3891FA"} text={editMode ? "Cancel" : "Edit"}
                                          onPress={handleEditToggle}/>
                        </View>
                    </ButtonContainer>

                    {editMode ? (
                        <>
                            <H6 bmargin='5px'>Username</H6>
                            <TextContainer bgColor='grey'>@{userData.username}</TextContainer>
                            <H6 bmargin='5px'>Phone Number</H6>
                            <TextContainer bgColor='grey'>{userData.phone_number}</TextContainer>
                            <H6 bmargin='5px'>Name</H6>
                            <InputTxt bcolor='white' value={editedFullName} onChangeText={setEditedFullName}
                                      placeholder="Full Name"/>
                            <H6 bmargin='5px'>Email</H6>
                            <InputTxt bcolor='white' value={editedEmail} onChangeText={setEditedEmail}
                                      placeholder="Email"/>
                        </>
                    ) : (
                        <>
                            <H6 bmargin='5px'>Username</H6>
                            <TextContainer>@{userData.username}</TextContainer>
                            <H6 bmargin='5px'>Phone Number</H6>
                            <TextContainer bgColor='grey'>{userData.phone_number}</TextContainer>
                            <H6 bmargin='5px'>Name</H6>
                            <TextContainer bgColor='#FFFFFF'>{userData.full_name}</TextContainer>
                            <H6 bmargin='5px'>Email</H6>
                            <TextContainer bgColor='#FFFFFF'>{userData.email}</TextContainer>
                        </>
                    )}
                    <H6 tmargin='10px' bmargin='10px'>{message}</H6>
                    <H5 tmargin='40px' bmargin='5px'>Delete Account</H5>
                    <H6 style={{opacity: 0.6}} bmargin='20px' weight='400'>Not comfortable? Deleting your
                        account will
                        remove all data from our servers</H6>
                    <ButtonButton pos="single" iconColor="white" icon="cross" color="red"
                                  txtColor="black" txtMargin="15px" text="Delete Account" onPress={handleDelete}/>
                </AccountContainer>
            </WrapperScroll>
        </Main>
    );
};

export default AccountScreen;
import React from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {View, Text, Button} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const DeleteConfirmScreen = () => {
        const navigate = useNavigation();
        const handleConfirmDelete = async () => {

            const apiKey = process.env.REACT_NATIVE_API_KEY;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };
            const handleLogout = async () => {
                try {
                    // Clear the token stored in AsyncStorage
                    await AsyncStorage.removeItem('token');

                    delete axios.defaults.headers.common['Authorization'];

                    navigation.navigate('Welcome');

                } catch (error) {
                    console.error('Error logging out:', error);
                }
            };

            try {
                const apiKey = process.env.REACT_NATIVE_API_KEY;

                // Add the API key to the request headers
                const config = {
                    headers: {
                        'X-API-Key': apiKey,
                    },
                };

                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    const decodedToken = jwtDecode(storedToken);
                    console.log(decodedToken);

                    const phone = decodedToken.sub;

                    const response = await axios.post('http://127.0.0.1:5000/delete_account', {phone_number: phone}, config);

                    if (response.data.message === 'Account deleted successfully!') {
                        try {
                            // Clear the token stored in AsyncStorage
                            handleLogout();

                        } catch (error) {
                            console.error('Error logging out:', error);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user account information:', error);
            }
        };

        return (
            <View>
                <Text>Do you really want to delete your account?</Text>
                <Button title="Yes, Delete" onPress={handleConfirmDelete}/>
                <Button title="No, Go Back" onPress={() => navigation.goBack()}/>
            </View>
        );
    }
;

export default DeleteConfirmScreen;

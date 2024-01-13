import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, FlatList, TouchableOpacity, Button, StyleSheet} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

import MainLogo from '../styles/mainLogo';
import {MenuButton} from '../styles/accountButton';
import {InputTxt, Main} from '../styles/styles';
import {
    AccountWrapper,
    AccountContent,
    AccountTxtWrapper,
    AccountRegularInfo,
    AccountTxt,
} from '../styles/accountPage';
import {jwtDecode} from "jwt-decode";

const apiKey = process.env.REACT_NATIVE_API_KEY;

const FriendsScreen = () => {
    const [friends, setFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const fetchFriends = async () => {
        try {


            const token = await AsyncStorage.getItem('token');

            const response = await axios.get('http://127.0.0.1:5000/list_friends', {
                headers: {
                    'X-API-Key': apiKey,
                },
            });

            setFriends(response.data.friends);
        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const searchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const phone = jwtDecode(token).sub;

            const response = await axios.post(
                'http://127.0.0.1:5000/search_users',
                {
                    phone_number: phone,
                    search_term: searchTerm,
                },
                {
                    headers: {
                        'X-API-Key': apiKey,
                    },
                }
            );

            setSearchResults(response.data.users);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };


    useEffect(() => {
        fetchFriends();
    }, []);

    const handleDeleteFriend = (friendId) => {
        console.log(`Deleting friend with ID: ${friendId}`);
    };

    return (
        <Main>
            <MainLogo bButton={true}/>
            <AccountWrapper>
                <AccountRegularInfo>
                    <AccountContent>
                        <Text>Friends</Text>
                        <AccountTxtWrapper>
                            <Text>Search Friends</Text>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search Friends"
                                value={searchTerm}
                                onChangeText={(text) => setSearchTerm(text)}
                            />
                            <Button title="Search" onPress={searchUsers}/>
                            <FlatList
                                data={searchTerm ? searchResults : friends}
                                keyExtractor={(item) => item.user_id}
                                renderItem={({item}) => (
                                    <View style={styles.friendItem}>
                                        <Text>{item.username}</Text>
                                        <TouchableOpacity onPress={() => handleDeleteFriend(item.user_id)}>
                                            <Text style={styles.deleteButton}>Delete</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </AccountTxtWrapper>
                    </AccountContent>
                </AccountRegularInfo>
            </AccountWrapper>
            <MenuButton
                title="Back to Account"
                bgColor="blue"
                txtColor="white"
                onPress={() => navigation.navigate('Account')}
                emoji="⬅️"
            />
        </Main>
    );
};

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 8,
        paddingHorizontal: 8,
    },
    friendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'lightgray',
        paddingVertical: 8,
    },
    deleteButton: {
        color: 'red',
    },
});

export default FriendsScreen;

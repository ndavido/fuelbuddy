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
    const [requestedFriends, setRequestedFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFriends = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user1 = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            const response = await axios.post(
                'http://127.0.0.1:5000/list_friends',
                {phone_number: user1},
                config
            );

            if (response.data && response.data.friends) {
                setFriends(response.data.friends);
            }

        } catch (error) {
            console.error('Error fetching friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRequestedFriends = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user1 = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            const response = await axios.post(
                'http://127.0.0.1:5000/requested_friends',
                {phone_number: user1},
                config
            );

            if (response.data && response.data.requested_friends) {
                setRequestedFriends(response.data.requested_friends);
            }

        } catch (error) {
            console.error('Error fetching requested friends:', error);
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
        fetchRequestedFriends()
    }, []);

    const handleDeleteFriend = (friendId) => {
        console.log(`Deleting friend with ID: ${friendId}`);
    };

    const handleMakeFriend = async (friendId) => {
        try {
            console.log(`Making friend with ID: ${friendId}`);
            const token = await AsyncStorage.getItem('token');

            const phone = jwtDecode(token).sub;

            const response = await axios.post(
                'http://127.0.0.1:5000/send_friend_request',
                {
                    phone_number: phone,
                    friend_number: friendId,
                },
                {
                    headers: {
                        'X-API-Key': apiKey,
                    },
                }
            );

        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const decideFriend = async (requestId, action) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const phone = jwtDecode(token).sub;

            const response = await axios.post(
                'http://127.0.0.1:5000/respond_friend_request',
                {
                    phone_number: phone,
                    request_id: requestId,
                    action: action,
                },
                {
                    headers: {
                        'X-API-Key': apiKey,
                    },
                }
            );

            console.log(response.data.message);
            // Handle the response as needed, for example, update UI or show a notification

        } catch (error) {
            console.error('Error responding to friend request:', error);
            // Handle errors as needed
        }
    };

    return (
        <Main>
            <MainLogo bButton={true}/>
            <AccountWrapper>
                <AccountRegularInfo>
                    <AccountContent>
                        <Text>Friends</Text>
                        <AccountTxtWrapper>
                            <Text>Friends</Text>
                            <FlatList
                                data={friends}
                                keyExtractor={(item) => item.friend_id.toString()} // Assuming friend_id is a number
                                renderItem={({item}) => (
                                    <View style={styles.friendItem} key={item.friend_id}>
                                        <Text>{item.friend_name}</Text>
                                    </View>
                                )}
                            />
                            <Text>Requested</Text>
                            <FlatList
                                data={searchTerm ? searchResults : requestedFriends}
                                keyExtractor={(item) => item.friend_id}
                                renderItem={({item}) => (
                                    <View style={styles.friendItem}>
                                        <Text>{item.friend_name}</Text>
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity
                                                style={styles.acceptButton}
                                                onPress={() => decideFriend(item.request_id, 'accept')}
                                            >
                                                <Text style={styles.buttonText}>Accept</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.rejectButton}
                                                onPress={() => decideFriend(item.request_id, 'reject')}
                                            >
                                                <Text style={styles.buttonText}>Reject</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            />


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
                                        <TouchableOpacity onPress={() => handleMakeFriend(item.phone_number)}>
                                            <Text style={styles.deleteButton}>Friend</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </AccountTxtWrapper>
                    </AccountContent>
                </AccountRegularInfo>
            </AccountWrapper>
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
        color: 'green',
    },
});

export default FriendsScreen;

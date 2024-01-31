import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    Button,
    StyleSheet,
    Modal,
    RefreshControl
} from 'react-native';
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
import {H3, H5, H6} from "../styles/text";

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL

const FriendsScreen = () => {
    const [friends, setFriends] = useState([]);
    const [requestedFriends, setRequestedFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const hasRequestedFriends = requestedFriends.length > 0;

    const [refreshing, setRefreshing] = useState(false);

    console.log(url)

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
                `${url}/list_friends`,
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

    const onRefresh = async () => {
        setRefreshing(true);
        // Perform your refresh logic here, e.g., refetch data
        await fetchFriends();
        await fetchRequestedFriends();
        setRefreshing(false);
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
                `${url}/requested_friends`,
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

    const openSearchModal = () => {
        setSearchModalVisible(true);
    };

    const closeSearchModal = () => {
        setSearchModalVisible(false);
    };

    const searchUsers = async () => {
        try {
            const token = await AsyncStorage.getItem('token');

            const phone = jwtDecode(token).sub;

            const response = await axios.post(
                `${url}/search_users`,
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

    const handleSearch = async () => {
        searchUsers();
    };

    const handleDeleteFriend = (friendId) => {
        console.log(`Deleting friend with ID: ${friendId}`);
    };

    const handleMakeFriend = async (friendId) => {
        try {
            console.log(`Making friend with ID: ${friendId}`);
            const token = await AsyncStorage.getItem('token');

            const phone = jwtDecode(token).sub;

            const response = await axios.post(
                `${url}/send_friend_request`,
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
                `${url}/respond_friend_request`,
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

    useEffect(() => {
        fetchFriends();
        fetchRequestedFriends()
    }, []);

    return (
        <Main>
            <MainLogo PageTxt='Friends'/>
            <AccountWrapper>
                <AccountRegularInfo refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }>
                    <AccountContent>
                        <H3 tmargin='20px' lmargin='20px' bmargin='5px'></H3>
                        <H5 style={styles.addFriendButton}tmargin='10px' lmargin='20px' onPress={openSearchModal}>Add Friends</H5>
                        <AccountTxtWrapper>

                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={isSearchModalVisible}
                                onRequestClose={closeSearchModal}
                            >
                                <View style={styles.modalContainer}>
                                    <View style={styles.modalContent}>
                                        <Text style={styles.modalTitle}>🔍Search Friends</Text>
                                        <TextInput
                                            style={styles.searchInput}
                                            placeholder="Search Friends"
                                            value={searchTerm}
                                            onChangeText={(text) => setSearchTerm(text)}
                                        />
                                        <Button title="Search" onPress={handleSearch}/>
                                        <Button title="Close" onPress={closeSearchModal}/>
                                        <FlatList
                                            data={searchTerm ? searchResults : friends}
                                            keyExtractor={(item) => item.user_id}
                                            renderItem={({item}) => (
                                                <View style={styles.friendItem}>
                                                    <H6 weight="400" bmargin='5px'
                                                        style={{opacity: 0.5}}>{item.username}</H6>
                                                    <TouchableOpacity
                                                        onPress={() => handleMakeFriend(item.phone_number)}>
                                                        <Text style={styles.addFriendButton}>🫂Add</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                            refreshControl={
                                                <RefreshControl
                                                    refreshing={refreshing}
                                                    onRefresh={onRefresh}
                                                />
                                            }
                                        />
                                    </View>
                                </View>
                            </Modal>
                            {hasRequestedFriends && (
                                <>
                                    <H5 tmargin='10px' bmargin='10px'>Added Me</H5>
                                    <FlatList
                                        data={searchTerm ? searchResults : requestedFriends}
                                        keyExtractor={(item) => item.friend_id}
                                        renderItem={({item}) => (
                                            <View style={styles.friendItem}>
                                                <H6 weight="400" bmargin='5px'
                                                    style={{opacity: 0.5}}>{item.friend_name}</H6>
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
                                </>
                            )}
                            <H5 tmargin='10px' bmargin='10px'>Friends</H5>
                            <FlatList
                                data={friends}
                                keyExtractor={(item) => item.friend_id.toString()} // Assuming friend_id is a number
                                renderItem={({item}) => (
                                    <View style={styles.friendItem} key={item.friend_id}>
                                        <H6 weight="400" bmargin='5px' style={{opacity: 0.5}}>{item.friend_name}</H6>
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    
    
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
        height:400,
        width:250
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign:'center'
    },
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
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
        paddingVertical: 8,
    },
    deleteButton: {
        color: 'green',
    },
    addFriendButton:{
        color: '#6BFF91'
    }
});

export default FriendsScreen;

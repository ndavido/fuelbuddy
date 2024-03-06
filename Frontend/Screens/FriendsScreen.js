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
import { Ionicons } from '@expo/vector-icons';

// Styling
import MainLogo from '../styles/mainLogo';
import {
    ButtonContainer,
    Main,
    WrapperScroll, AccountContainer,
    ModalContent, SearchBox, TextWrapper
} from '../styles/styles';
import {jwtDecode} from "jwt-decode";
import {H3, H4, H5, H6} from "../styles/text";
import {ButtonButton} from "../styles/buttons";


const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL

const FriendsScreen = () => {
    const [friends, setFriends] = useState([]);
    const [requestedFriends, setRequestedFriends] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [friendRequestsCount, setFriendRequestsCount] = useState(0);
    const [friendRequests, setFriendRequests] = useState([]);
    const [isFriendRequestsModalVisible, setFriendRequestsModalVisible] = useState(false);


    const navigation = useNavigation();

    useEffect(() => {
        fetchFriends();
        fetchRequestedFriends();
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user1 = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };

            const response = await axios.post(
                `${url}/friend_requests`,
                {phone_number: user1},
                config
            );

            if (response.data && response.data.friend_requests) {
                setFriendRequests(response.data.friend_requests);
                setFriendRequestsCount(response.data.friend_requests.length);
            }

        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user1 = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
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
                    'Authorization': `Bearer ${token}`,
                },
            };

            console.log(user1)

            const response = await axios.post(
                `${url}/requested_friends`,
                {phone_number: user1},
                config
            );

            console.log(response.data)

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

    useEffect(() => {
        const searchUsers = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const user_id = jwtDecode(token).sub;

                const response = await axios.post(
                    `${url}/search_users`,
                    {
                        id: user_id,
                        search_term: searchTerm,
                    },
                    {
                        headers: {
                            'X-API-Key': apiKey,
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );

                const filteredResults = response.data.users.filter(user => (
                    !friends.some(friend => friend.friend_id === user.user_id)
                ));

                setSearchResults(filteredResults);
            } catch (error) {
                console.error('Error searching users:', error);
            }
        };

    const openFriendRequestsModal = () => {
    setFriendRequestsModalVisible(true); // Set the friend requests modal visibility to true
    setFriendRequestsCount(0); // Reset the friend requests count
};



    const closeFriendRequestsModal = () => {
        setFriendRequestsModalVisible(false);
    };

    const handleSearch = async (text) => {
        setSearchTerm(text);
    };

    const handleDeleteFriend = (friendId) => {
        console.log(`Deleting friend with ID: ${friendId}`);
    };

    const handleMakeFriend = async (friendId) => {
        try {
            console.log(`Making friend with ID: ${friendId}`);
            const token = await AsyncStorage.getItem('token');
            const phone = jwtDecode(token).sub;

            setPendingRequests(prevRequests => [...prevRequests, friendId]);

            setFriends(prevFriends => {
                return prevFriends.map(friend => {
                    if (friend.friend_id === friendId) {
                        return {...friend, loading: true};
                    }
                    return friend;
                });
            });

            const response = await axios.post(
                `${url}/send_friend_request`,
                {
                    phone_number: phone,
                    friend_number: friendId,
                },
                {
                    headers: {
                        'X-API-Key': apiKey,
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            setPendingRequests(prevRequests => prevRequests.filter(id => id !== friendId));

            setFriends(prevFriends => {
                return prevFriends.map(friend => {
                    if (friend.friend_id === friendId) {
                        return {...friend, loading: false};
                    }
                    return friend;
                });
            });

        } catch (error) {
            console.error('Error sending friend request:', error);

            setPendingRequests(prevRequests => prevRequests.filter(id => id !== friendId));

            setFriends(prevFriends => {
                return prevFriends.map(friend => {
                    if (friend.friend_id === friendId) {
                        return {...friend, loading: false};
                    }
                    return friend;
                });
            });
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
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log(response.data.message);
            onRefresh();

        } catch (error) {
            console.error('Error responding to friend request:', error);
        }
    };

    useEffect(() => {
        fetchFriends();
        fetchRequestedFriends()
    }, []);

    return (
        <Main>
        <MainLogo PageTxt='Friends'/>
        <WrapperScroll refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
            />
        }>
            <AccountContainer style={{minHeight: 800}}>
                <ButtonContainer style={{position: 'absolute', marginTop: 15, marginLeft: 10}}>
                    <TouchableOpacity onPress={openFriendRequestsModal}>
                        <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                            <ButtonButton icon="bell"
                                          badge={friendRequestsCount}
                                          onPress={openFriendRequestsModal}/>
                        </View>
                    </TouchableOpacity>
                </ButtonContainer>
                <View>
                    {friends.map(item => (
                        <View style={styles.friendItem} key={item.friend_id}>
                            <H6 weight="400" bmargin='5px' style={{opacity: 0.5}}>{item.friend_name}</H6>
                        </View>
                    ))}
                </View>
            </AccountContainer>
        </WrapperScroll>
        <Modal
            animationType="fade"
            transparent={true}
            visible={isFriendRequestsModalVisible}
            onRequestClose={closeFriendRequestsModal}>
            <View style={styles.modalContainer}>
                <ModalContent>
            <TouchableOpacity onPress={closeFriendRequestsModal}>
                <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
                    <H5 tmargin="10px" bmargin="30px" style={{textAlign: 'center'}}>Friend Requests</H5>
                    <ButtonContainer style={{position: 'absolute', marginTop: 15, marginLeft: 10}}>
                        <TouchableOpacity onPress={openFriendRequestsModal}>
                            <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                {/* Bell Icon */}
                                <Ionicons name="ios-notifications" size={24} color="black" />
                                {/* Badge for notification count */}
                                {friendRequestsCount > 0 && (
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{friendRequestsCount}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </ButtonContainer>
                    {friendRequests.map(request => (
                        <View key={request.id} style={styles.friendRequestItem}>
                            <H6 weight="400" bmargin='5px' style={{opacity: 0.5}}>{request.requester_name}</H6>
                            <View style={styles.friendRequestButtons}>
                                <ButtonButton text="Accept" color="#6BFF91"
                                              onPress={() => decideFriend(request.id, 'accept')}/>
                                <ButtonButton text="Deny" color="#FF3B30"
                                              onPress={() => decideFriend(request.id, 'reject')}/>
                            </View>
                        </View>
                    ))}
                </ModalContent>
            </View>
        </Modal>
    </Main>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    friendItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'lightgray',
        paddingVertical: 8,
    },
});

export default FriendsScreen;

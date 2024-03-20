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
import {useCombinedContext} from "../CombinedContext";
import {Ionicons} from '@expo/vector-icons';

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL

const FriendsScreen = () => {
    const [friends, setFriends] = useState([]);
    const [requestedFriends, setRequestedFriends] = useState([]);
    const [friendsRequested, setFriendsRequested] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchModalVisible, setSearchModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const hasRequestedFriends = requestedFriends.length > 0;
    const hasFriends = friends.length > 0;
    const hasFriendsRequested = friendsRequested.length > 0;

    const [pendingRequests, setPendingRequests] = useState([]);
    const [friendRequestsCount, setFriendRequestsCount] = useState(0);
    const [isFriendRequestModalVisible, setFriendRequestModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();

    console.log(url)

    const fetchFriends = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user_id = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.post(
                `${url}/list_friends`,
                {id: user_id},
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
        await fetchFriendsRequested();
        setRefreshing(false);
    };

    const silentRefresh = async () => {
        await fetchFriends();
        await fetchRequestedFriends();
        await fetchFriendsRequested();
    };

    const fetchRequestedFriends = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user_id = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.post(
                `${url}/received_friend_requests`,
                {id: user_id},
                config
            );

            console.log(response.data)

            if (response.data && response.data.requested_friends) {
                setRequestedFriends(response.data.requested_friends);
                setFriendRequestsCount(response.data.requested_friends.length); // Update friendRequestsCount
            }

        } catch (error) {
            console.error('Error fetching requested friends:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFriendsRequested = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user_id = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            console.log(url)

            console.log(user_id)

            const response = await axios.post(
                `${url}/sent_friend_requests`,
                {id: user_id},
                config
            );

            console.log("Friends Requested", response.data)

            if (response.data && response.data.friends_requested) {
                setFriendsRequested(response.data.friends_requested);
            }

        } catch (error) {
            console.error('Error fetching friends requested:', error);
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

    const openFriendRequestsModal = () => {
        setFriendRequestModalVisible(true);
    };

    const closeFriendRequestsModal = () => {
        setFriendRequestModalVisible(false);
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

                const resultsWithStatus = filteredResults.map(result => ({
                    ...result,
                    isPending: friendsRequested.some(fr => fr.friend_id === result.user_id)
                }));

                setSearchResults(resultsWithStatus);
            } catch (error) {
                console.error('Error searching users:', error);
            }
        };

        const delaySearch = setTimeout(() => {
            if (searchTerm.length > 1) {
                searchUsers();
            }
        }, 100);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

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
            const user_id = jwtDecode(token).sub;

            setPendingRequests(prevRequests => [...prevRequests, friendId]);

            setSearchResults(prevResults => prevResults.map(result => {
                if (result.phone_number === friendId) {
                    return {...result, isPending: true};
                }
                return result;
            }));

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
                    id: user_id,
                    friend_number: friendId,
                },
                {
                    headers: {
                        'X-API-Key': apiKey,
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            console.log("Friend Request:", response.data.message);

            await silentRefresh();

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
            const user_id = jwtDecode(token).sub;

            const response = await axios.post(
                `${url}/respond_friend_request`,
                {
                    id: user_id,
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
        fetchFriendsRequested()
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
                    <TouchableOpacity onPress={openFriendRequestsModal} style={styles.touchableContent}>
                        <View style={styles.bellIconContainer}>
                            <ButtonButton icon="bell" color='yellow' iconColor='black'
                                          onPress={openFriendRequestsModal}/>
                            {friendRequestsCount > 0 && (
                                <View style={styles.badgeContainer}>
                                    <Text style={styles.badgeText}>{friendRequestsCount}</Text>
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                    <H3 tmargin='20px' lmargin='0px' bmargin='5px'>Friends</H3>
                    <ButtonContainer style={{position: 'absolute', marginTop: 70, marginLeft: 10}}>
                        <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                            <ButtonButton text="Add friends" onPress={openSearchModal}/>
                        </View>
                    </ButtonContainer>
                    <TextWrapper>
                        <View>
                            {friends.map(item => (
                                <View style={styles.friendItem} key={item.friend_id}>
                                    <H6 weight="400" bmargin='5px' style={{opacity: 0.5}}>{item.friend_name}</H6>
                                </View>
                            ))}
                        </View>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isSearchModalVisible}
                            onRequestClose={closeSearchModal}
                        >
                            <View style={styles.modalContainer}>
                                <ModalContent>
                                    <H5 tmargin="10px" bmargin="30px" style={{textAlign: 'center'}}>Add Friends</H5>
                                    <ButtonContainer style={{position: 'absolute', marginTop: 20, marginLeft: 20}}>
                                        <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                            <ButtonButton icon="cross" color="#eaedea" iconColor="#b8bec2"
                                                          onPress={closeSearchModal}/>
                                        </View>
                                    </ButtonContainer>
                                    <SearchBox
                                        placeholder="Search Friends"
                                        value={searchTerm}
                                        onChangeText={handleSearch}
                                    />
                                    {searchTerm && searchResults && (
                                        <>
                                            <H5 tmargin="40px" bmargin="10px">Results</H5>
                                            <View>
                                                {searchResults.map(item => (
                                                    <View style={styles.friendItem} key={item.user_id}>
                                                        <H6 weight="400" bmargin='5px'
                                                            style={{opacity: 0.5}}>{item.username}</H6>
                                                        <View style={{
                                                            zIndex: 1,
                                                            marginLeft: 'auto',
                                                            flexDirection: "row"
                                                        }}>
                                                            {item.isPending || pendingRequests.includes(item.phone_number) ? (
                                                                <ButtonButton text={"Pending"} color={"#FFD700"}
                                                                              disabled={true}/>
                                                            ) : (
                                                                <ButtonButton text={"Add"} color={"#6BFF91"}
                                                                              onPress={() => handleMakeFriend(item.phone_number)}/>
                                                            )}
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </>
                                    )}
                                </ModalContent>
                            </View>
                        </Modal>
                    </TextWrapper>
                </AccountContainer>
            </WrapperScroll>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isFriendRequestModalVisible}
                onRequestClose={() => setFriendRequestModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <ModalContent>
                        <TouchableOpacity onPress={() => setFriendRequestModalVisible(false)}
                                          style={styles.closeButton}>
                            <Ionicons name="close" style={styles.closeIcon}/>
                        </TouchableOpacity>
                        <H5 tmargin='10px' bmargin='10px'>Friend Requests</H5>
                        <FlatList
                            data={requestedFriends}
                            renderItem={({item}) => (
                                <View style={styles.friendItem} key={item.request_id}>
                                    <H6 weight="400" bmargin='5px' style={{opacity: 0.5}}>{item.friend_name}</H6>
                                    <View style={{zIndex: 1, marginLeft: 'auto', flexDirection: "row"}}>
                                        <ButtonButton text={"Accept"} color={"#6BFF91"}
                                                      onPress={() => decideFriend(item.request_id, 'accept')}/>
                                        <ButtonButton color={"#3891FA"} text={"Deny"}
                                                      onPress={() => decideFriend(item.request_id, 'reject')}/>
                                    </View>
                                </View>
                            )}
                            keyExtractor={(item) => item.request_id.toString()}
                        />
                    </ModalContent>
                </View>
            </Modal>

        </Main>
    );
};

const styles = StyleSheet.create({
    touchableContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        marginLeft: 1,
    },

    bellIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    badgeContainer: {
        position: 'absolute',
        top: -5,
        right: -10,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingVertical: 2,
        paddingHorizontal: 5,
        marginLeft: 5,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
    },
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
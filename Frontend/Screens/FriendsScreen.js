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
    FContainer,
    InputTxt,
    Main,
    FSButtonContainer,
    AddFriendButton,
    WrapperScroll, AccountContainer,
    ModalContent, SearchBox
} from '../styles/styles';
import {
    AccountTxtWrapper,
} from '../styles/accountPage';
import {jwtDecode} from "jwt-decode";
import {H3, H4, H5, H6} from "../styles/text";
import {ButtonButton} from "../styles/AnimatedIconButton";


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

    const [pendingRequests, setPendingRequests] = useState([]);

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

    useEffect(() => {
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

                const filteredResults = response.data.users.filter(user => (
                    !friends.some(friend => friend.friend_id === user.user_id)
                ));

                setSearchResults(filteredResults);
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
                />
            }>
                <AccountContainer style={{minHeight: 800}}>
                    <H3 tmargin='20px' lmargin='0px' bmargin='5px'>Friends</H3>
                    <ButtonContainer style={{position: 'absolute', marginTop: 15, marginLeft: 10}}>
                        <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                            <ButtonButton text="Add Friends" onPress={openSearchModal}/>
                        </View>
                    </ButtonContainer>
                    <AccountTxtWrapper>
                        {hasRequestedFriends && (
                            <>
                                <H5 tmargin='10px' bmargin='10px'>Added Me</H5>
                                <View>
                                    {searchTerm ? (
                                        searchResults.map(item => (
                                            <View style={styles.friendItem} key={item.request_id}>
                                                <H6 weight="400" bmargin='5px'
                                                    style={{opacity: 0.5}}>{item.friend_name}</H6>
                                                <View style={{zIndex: 1, marginLeft: 'auto', flexDirection: "row"}}>
                                                    <ButtonButton text={"Accept"} color={"#6BFF91"}
                                                                  onPress={() => decideFriend(item.request_id, 'accept')}/>
                                                    <ButtonButton color={"#3891FA"}
                                                                  text={"Deny"}
                                                                  onPress={() => decideFriend(item.request_id, 'reject')}/>
                                                </View>
                                            </View>
                                        ))
                                    ) : (
                                        requestedFriends.map(item => (
                                            <View style={styles.friendItem} key={item.request_id}>
                                                <H6 weight="400" bmargin='5px'
                                                    style={{opacity: 0.5}}>{item.friend_name}</H6>
                                                <View style={{zIndex: 1, marginLeft: 'auto', flexDirection: "row"}}>
                                                    <ButtonButton text={"Accept"} color={"#6BFF91"}
                                                                  onPress={() => decideFriend(item.request_id, 'accept')}/>
                                                    <ButtonButton color={"#3891FA"}
                                                                  text={"Deny"}
                                                                  onPress={() => decideFriend(item.request_id, 'reject')}/>
                                                </View>
                                            </View>
                                        ))
                                    )}
                                </View>
                            </>
                        )}
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
                                                            {pendingRequests.includes(item.phone_number) ? (
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
                    </AccountTxtWrapper>
                </AccountContainer>
            </WrapperScroll>
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

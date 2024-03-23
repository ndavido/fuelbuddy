import React, {useState, useEffect, useRef} from 'react';
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
import { useRoute }  from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';

// Styling
import MainLogo from '../styles/mainLogo';
import {
    ButtonContainer,
    Main, Container,
    WrapperScroll, AccountContainer,
    ModalContent, SearchBox, TextWrapper
} from '../styles/styles';
import {jwtDecode} from "jwt-decode";
import {H2, H3, H4, H5, H6} from "../styles/text";
import {ButtonButton} from "../styles/buttons";
import {useCombinedContext} from "../CombinedContext";
import {Ionicons} from '@expo/vector-icons';

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL

const FriendsProfileScreen = () => {
    const route = useRoute();
    const { friend } = route.params;

    const [friendInfo, setFriendInfo] = useState([]);

    const [refreshing, setRefreshing] = useState(false);

    const [loading, setLoading] = useState(true);

    const bottomSheetRef = useRef(null);

    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();

    console.log(url)

    console.log(friend)

    const fetchFriendInfo = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const user_id = jwtDecode(token).sub;

            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            console.log("Friend Id", friend.friend_id)

            const response = await axios.post(
                `${url}/view_friend_profile`,
                {friend_id: friend.friend_id},
                config
            );

            console.log("Friend Info", response.data.friend_profile)

            if (response.data.friend_profile) {
                setFriendInfo(response.data.friend_profile);
            }

        } catch (error) {
            console.error('Error fetching friend Info :(', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchFriendInfo();
        setRefreshing(false);
    };

    const handleDeleteFriend = (friendId) => {
        console.log(`Deleting friend with ID: ${friendId}`);
    };

    useEffect(() => {
        fetchFriendInfo();
    }, []);

    return (
        <Main>
            <MainLogo bButton={true} PageTxt=''/>
            <WrapperScroll refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }>
                <AccountContainer style={{minHeight: 800}}>
                    <H2 tmargin='20px' lmargin='0px' bmargin='5px'>{friendInfo.username}</H2>
                    <TextWrapper>
                        <H6>Phone Number: {friendInfo.phone_number}</H6>
                        <H6>Name: {friendInfo.first_name} {friendInfo.surname}</H6>
                        <H6>Email: {friendInfo.email}</H6>
                        {friendInfo.random_fav_station && <H6>Random Favourite Station: {friendInfo.random_fav_station.name}</H6>}
                        {friendInfo.recent_activity && <><H6>Recent Activity: {friendInfo.recent_activity.activity}</H6><H6>Time: {friendInfo.recent_activity.timestamp}</H6></>}
                    </TextWrapper>
                </AccountContainer>
            </WrapperScroll>
        </Main>
    );
};

export default FriendsProfileScreen;
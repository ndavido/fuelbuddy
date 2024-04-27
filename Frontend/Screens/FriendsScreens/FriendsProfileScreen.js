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
import {useRoute} from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';

// Styling
import MainLogo from '../../styles/mainLogo';
import {
    ButtonContainer,
    Main, Container,
    WrapperScroll, AccountContainer,
    ModalContent, SearchBox, TextWrapper, Content, Card
} from '../../styles/styles';
import {jwtDecode} from "jwt-decode";
import {H2, H3, H4, H5, H6} from "../../styles/text";
import {ButtonButton} from "../../styles/buttons";
import {useCombinedContext} from "../../CombinedContext";
import {Ionicons} from '@expo/vector-icons';
import {AccountImg} from "../../styles/images";

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL

const FriendsProfileScreen = () => {
    const route = useRoute();
    const {friend} = route.params;

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
                    <Container>
                        <H2 tmargin='5px' bmargin='5px'>@{friendInfo.username}</H2>
                        <ButtonContainer style={{position: 'absolute', marginTop: 20, marginLeft: 20}}>
                            <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                                <ButtonButton text="Friended" color="#eaedea" txtColor="#b8bec2"/>
                            </View>
                        </ButtonContainer>
                        <AccountImg/>
                        <H4 style={{
                            marginTop: 10,
                            marginBottom: 20,
                                textAlign: 'center',
                                opacity: 0.5
                            }}>{friendInfo.first_name} {friendInfo.surname}</H4>
                        <Card style={{marginRight: -10, marginLeft: -10}}>
                            {friendInfo.recent_activity && <><H6>Recent
                                Activity</H6><H5>{friendInfo.recent_activity.activity}</H5><H6 style={{opacity: 0.6}}>{friendInfo.recent_activity.timestamp}</H6></>}
                        </Card>
                        {friendInfo.random_fav_station &&
                            <Card style={{marginRight: -10, marginLeft: -10}}>
                                <H6>Random Favorite Station</H6>
                                <H5>{friendInfo.random_fav_station.name}</H5>
                            </Card>
                        }
                    </Container>
                </AccountContainer>
            </WrapperScroll>
        </Main>
    );
};

export default FriendsProfileScreen;
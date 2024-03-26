import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, RefreshControl, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useCombinedContext} from '../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import MainLogo from '../styles/mainLogo';
import {H2, H3, H4, H5, H6} from "../styles/text";
import {
    AccountContainer,
    ButtonContainer,
    Container, Content,
    InputTxt,
    Main,
    TextContainer,
    WrapperScroll
} from "../styles/styles";
import {ButtonButton} from "../styles/buttons";
import {AccountImg} from "../styles/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {jwtDecode} from "jwt-decode";

const apiKey = process.env.REACT_NATIVE_API_KEY;
const url = process.env.REACT_APP_BACKEND_URL

const UserStationScreen = () => {
    const [loading, setLoading] = useState(true);
    const [favoriteStations, setFavoriteStations] = useState([]);
    const [favoriteStatus, setFavoriteStatus] = useState({});
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const fetchStations = async () => {
        try {

            const user_id = jwtDecode(token).sub;

            console.log("User ID: ", user_id)

            const updatedUserData = {
                id: user_id,
            };

            const fav_response = await axios.get(`${url}/get_favorite_fuel_stations`, {
                params: updatedUserData,
                headers: {
                    "X-API-Key": apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            if (fav_response.data && fav_response.data.favorite_stations) {
                const initialFavoriteStatus = fav_response.data.favorite_stations.reduce(
                    (status, favStation) => {
                        status[favStation.station_id] = true;
                        return status;
                    },
                    {}
                );

                setFavoriteStations(fav_response.data.favorite_stations);
                setFavoriteStatus(initialFavoriteStatus);
                // TODO Remove Dev only!!
                console.log("Fav Stations:", fav_response.data.favorite_stations)

            } else {
                console.log("No favorite stations found");
                setFavoriteStations([]);
                setFavoriteStatus({});
            }

        } catch (error) {
            console.error('Error fetching favorite fuel stations:', error);
        }
    };


    useEffect(() => {
        fetchStations();
    }, []);

    return (
        <Main>
            <MainLogo bButton={true} PageTxt='Stations'/>
            <WrapperScroll>
                <AccountContainer style={{minHeight: 800}}>
                    <H3 tmargin='20px' bmargin='20px'>my Stations</H3>
                    <ButtonContainer style={{position: 'absolute', marginTop: 15, marginLeft: 10}}>

                    </ButtonContainer>
                    <Content>
                        <View>
                            {favoriteStations.map(item => (
                                <View key={item.station_id}>
                                    <H4>{item.name}</H4>
                                    <H6>{item.station_id}</H6>
                                    <H6>{item.location.latitude}</H6>
                                    <H6>{item.location.longitude}</H6>
                                    <H6>{item.prices.petrol_price}</H6>
                                    <H6>{item.prices.petrol_updated_at}</H6>
                                    <H6>{item.prices.diesel_price}</H6>
                                    <H6>{item.prices.diesel_updated_at}</H6>
                                </View>
                            ))}
                        </View>
                    </Content>
                </AccountContainer>
            </WrapperScroll>
        </Main>
    );
};

export default UserStationScreen;
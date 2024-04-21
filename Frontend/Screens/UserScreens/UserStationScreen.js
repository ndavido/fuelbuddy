import React, {useState, useEffect} from 'react';
import {View, Text, Button, TextInput, RefreshControl, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {useCombinedContext} from '../../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import MainLogo from '../../styles/mainLogo';
import {H2, H3, H4, H5, H6, H8} from "../../styles/text";
import {
    AccountContainer,
    ButtonContainer, Card, CardContainer, CardMini,
    Container, Content,
    InputTxt,
    Main,
    TextContainer,
    WrapperScroll
} from "../../styles/styles";
import {ButtonButton} from "../../styles/buttons";
import {AccountImg} from "../../styles/images";
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
                                {favoriteStations.map(station => (
                                    <TouchableOpacity>
                                        <CardMini bColor="#ffffff">
                                            <H5>{station.name}</H5>
                                            <H6 style={{opacity: 0.6}}>{station.address}</H6>
                                            <H6 style={{marginTop: 10}}>Current Prices</H6>
                                            <CardContainer style={{marginRight: -10, marginLeft: -10}}>
                                                <Card bColor="#f7f7f7">
                                                    <H5 style={{opacity: 0.6, textAlign: 'center'}}>Petrol</H5>
                                                    <H3 weight='600'
                                                        style={{textAlign: 'center'}}>{station.prices.petrol_price ? parseFloat(station.prices.petrol_price).toFixed(2) : 'NA'}</H3>
                                                    <H8 style={{opacity: 0.6, textAlign: 'center'}}>Last
                                                        Updated: {station.prices.petrol_updated_at}</H8>
                                                </Card>
                                                <Card bColor="#f7f7f7">
                                                    <H5 style={{opacity: 0.6, textAlign: 'center'}}>Diesel</H5>
                                                    <H3 weight='600'
                                                        style={{textAlign: 'center'}}>{station.prices.diesel_price ? parseFloat(station.prices.diesel_price).toFixed(2) : 'NA'}</H3>
                                                    <H8 style={{opacity: 0.6, textAlign: 'center'}}>Last
                                                        Updated: {station.prices.diesel_updated_at}</H8>
                                                </Card>
                                            </CardContainer>
                                        </CardMini>
                                    </TouchableOpacity>
                                ))}
                            </View>
                    </Content>
                </AccountContainer>
            </WrapperScroll>
        </Main>
    );
};

export default UserStationScreen;
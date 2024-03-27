import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode";

// Styling
import {
    AccountContainer, ButtonContainer,
    Content,
    Main, TextContainer, TextWrapper, Wrapper,
} from '../styles/styles';
import MainLogo from '../styles/mainLogo';
import {H3, H4, H5, H6} from "../styles/text";
import {View} from "react-native";
import {ButtonButton} from "../styles/buttons";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY;

const VehicleScreen = () => {
    const [userVehicle, setUserVehicle] = useState({});
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const handleDelete = () => {
        navigation.navigate('DeleteConfirm');
    };

    useEffect(() => {
        const fetchUsersCar = async () => {
            try {
                const jwt_user = await AsyncStorage.getItem('token');
                const user_id = jwtDecode(jwt_user).sub;

                const config = {
                    headers: {
                        'X-API-Key': apiKey,
                        'Authorization': `Bearer ${jwt_user}`,
                    },
                };
                const response = await axios.post(`${url}/get_user_vehicle`, {id: user_id}, config);

                console.log(response.data)
                if (response.data) {
                    setUserVehicle(response.data);
                    console.log(userVehicle);
                }

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('No vehicle found');
                    setUserVehicle(null);
                } else {
                    console.error('Error fetching User Vehicle:', error);
                }
            }
        };

        fetchUsersCar();
    }, []);

    return (
        <Main>
            <MainLogo bButton={true} PageTxt='Vehicle'/>
            <Wrapper>
                <AccountContainer style={{minHeight: 800}}>
                    <H3 tmargin='20px' bmargin='20px'>my Vehicle</H3>
                    <ButtonContainer style={{position: 'absolute', marginTop: 10, marginLeft: 10}}>
                        <View style={{zIndex: 1, marginLeft: 'auto', marginRight: 0}}>
                            {userVehicle ? (
                                <ButtonButton color='#6BFF91' text='Update Vehicle'
                                              accessibilityLabel="Update Vehicle Button" accessible={true}
                                />
                            ) : (
                                <ButtonButton icon='plus' text='Add Vehicle' accessibilityLabel="Add Vehicle Button"
                                              accessible={true}/>
                            )}
                        </View>
                    </ButtonContainer>
                    <Content>
                        {userVehicle ? (
                            <>
                                <H6 bmargin='5px'>Make</H6>
                                <TextContainer bcolor="#FFFFFF">{userVehicle.make}</TextContainer>
                                <H6 bmargin='5px'>Model</H6>
                                <TextContainer bcolor="#FFFFFF">{userVehicle.model}</TextContainer>
                                <H6 bmargin='5px'>Series</H6>
                                <TextContainer bcolor="#FFFFFF">{userVehicle.series}</TextContainer>
                                <H6 bmargin='5px'>Year</H6>
                                <TextContainer bcolor="#FFFFFF">{userVehicle.year}</TextContainer>
                                <H6 bmargin='5px'>Trim</H6>
                                <TextContainer bcolor="#FFFFFF">{userVehicle.trim}</TextContainer>
                                <H6 bmargin='5px'>Transmission</H6>
                                <TextContainer bcolor="#FFFFFF">{userVehicle.transmission}</TextContainer>
                                <H6 bmargin='5px'>100km/l</H6>
                                <TextContainer
                                    bcolor="#FFFFFF">{userVehicle.city_fuel_per_100km_l} Litres</TextContainer>
                            </>
                        ) : (
                            <H6 bmargin='5px'>No Vehicle Found</H6>
                        )}
                    </Content>
                </AccountContainer>
            </Wrapper>
        </Main>
    );
};

export default VehicleScreen;
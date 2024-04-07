import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCombinedContext} from '../../CombinedContext';
import * as Updates from 'expo-updates';

// Styling
import {H3, H4, H5, H6} from "../../styles/text";
import {
    AccountContainer,
    ButtonContainer, Container, Content,
    InputTxt, LRButtonDiv,
    Main, SearchBox,
    TextContainer,
    WelcomeMain, Wrapper,
    WrapperScroll
} from "../../styles/styles";
import {ButtonButton} from "../../styles/buttons";
import {FlatList, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY;

const ReceiptStationScreen = () => {
    const route = useRoute();
    const {receipt, receiptImage} = route.params;

    console.log("Receipt On Station Screen", receipt)

    const [allStations, setAllStations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStations, setFilteredStations] = useState([]);
    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedStationName, setSelectedStationName] = useState('Select Station');

    const [isMenuExpanded, setIsMenuExpanded] = useState(false);

    const [selectedFuelType, setSelectedFuelType] = useState(receipt.fuel_type || 'unleaded');
    const [editedFuelAmount, setEditedFuelAmount] = useState((receipt.volume || 0).toString());
    const [editedPricePerLitre, setEditedPricePerLitre] = useState((receipt.price_per_litre || 0).toString());
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const {token, userData, setUser, updateUserFromBackend} = useCombinedContext();

    async function reloadApp() {
        await Updates.reloadAsync();

        /*TODO Remove DEV ONLY!!*/
        console.log("Reloaded")
    }

    const fetchStations = async (query) => {
        try {
            const requestBody = {
                user_longitude: null,
                user_latitude: null,
                radius: null,
            };

            const response = await axios.post(`${url}/fuel_stations`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log(response.data)

            // TODO Remove Dev Only

            setAllStations(response.data);

        } catch (error) {
            console.error(error);
        }
    };

    const filterStations = (query) => {
        if (!query) {
            setFilteredStations(allStations);
            return;
        }

        const filtered = allStations.filter(station =>
            station.name.toLowerCase().includes(query.toLowerCase()) ||
            station.address.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredStations(filtered);
    };

    const handleSelectingStation = (station) => {
        setSelectedStation(station);
        setSelectedStationName(station.name);
        setIsMenuExpanded(false);
    }

    const handleSave = async () => {
        try {
            const fuelTypeToUpdate = selectedFuelType === 'unleaded' ? 'petrol_price' : 'diesel_price';
            const oppositeFuelType = selectedFuelType === 'unleaded' ? 'diesel_price' : 'petrol_price';
            const priceToUpdate = parseFloat(editedPricePerLitre);

            const payload = {
                fuelPrices: [{
                    station_id: selectedStation.id,
                    [fuelTypeToUpdate]: priceToUpdate,
                    [oppositeFuelType]: 1.50,
                    timestamp: new Date().toISOString(),
                }],
            };

            const response = await fetch(`${url}/store_fuel_prices`, {
                method: 'POST', headers: {
                    "X-API-Key": apiKey,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(payload),
            });

            if (response.ok) {
                console.log('Successfully updated fuel prices');
                navigation.navigate('CompleteReceipt', {receipt: receipt});
            } else {
                console.error('Failed to update fuel prices');
            }
        } catch (error) {
            console.error('Error updating fuel prices:', error);
        }
    };

    const handleSkip = async () => {
        navigation.navigate('CompleteReceipt', {receipt: receipt, receiptImage: receiptImage});
    }

    const toggleMenu = () => {
        setIsMenuExpanded(!isMenuExpanded);
    };

    useEffect(() => {

        updateUserFromBackend();
        fetchStations();
    }, []);

    useEffect(() => {
        filterStations(searchQuery);
    }, [searchQuery, allStations]);

    return (
        <WelcomeMain>
            <Wrapper>
                <Content>
                    <Container>
                        <H3 bmargin="10px">Update Station Price</H3>
                        <>
                            <H6>Fuel Station</H6>
                            <TouchableOpacity onPress={toggleMenu}>
                <TextContainer bgColor='grey'>{selectedStationName}</TextContainer>
                <Icon style={{position: 'absolute', right: 0, padding: 10}}
                      name={isMenuExpanded ? 'chevron-up' : 'chevron-down'} size={16}
                      color="black"/>
            </TouchableOpacity>
                            {isMenuExpanded && (
                                <>
                                    <SearchBox
                                        placeholder="Search for Station"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                    <>
                                        <H5 tmargin="20px" bmargin="10px">Results</H5>
                                        <View style={{marginBottom: 30}}>
                                            <FlatList
                                                style={{height: 150}}
                                                data={filteredStations}
                                                keyExtractor={station => station.id}
                                                renderItem={({item}) => (
                                                    <TextContainer onPress={() => handleSelectingStation(item)}>
                                                        {item.name} - {item.address}
                                                    </TextContainer>
                                                )}
                                            />
                                        </View>
                                    </>
                                </>
                            )}
                            <H6 bmargin='5px'>Fuel Type</H6>
                            <View>
                                <Picker
                                    selectedValue={selectedFuelType}
                                    onValueChange={(itemValue) => setSelectedFuelType(itemValue)}
                                >
                                    <Picker.Item label="Unleaded" value="unleaded"/>
                                    <Picker.Item label="Diesel" value="diesel"/>
                                </Picker>
                            </View>
                            <H6 bmargin='5px'>Fuel Amount</H6>
                            <InputTxt placeholder="Fuel Amount" value={editedFuelAmount}
                                      onChangeText={setEditedFuelAmount}/>
                            <H6 bmargin='5px'>Price Per Litre</H6>
                            <InputTxt placeholder="Price Per Litre" value={editedPricePerLitre}
                                      onChangeText={setEditedPricePerLitre}/>

                        </>
                        <H6 tmargin='10px' bmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton color="#6bff91" txtWidth="100%"
                                      txtColor="white" text="Continue" onPress={handleSave}/>
                        <ButtonButton color="transparent" txtWidth="100%"
                                      txtColor="black" text="Skip" onPress={handleSkip}/>
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default ReceiptStationScreen;
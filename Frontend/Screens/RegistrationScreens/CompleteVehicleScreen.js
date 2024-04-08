import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
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

const CompleteVehicleScreen = () => {
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [modelSearchQuery, setModelSearchQuery] = useState('');

    const [isMakeMenuExpanded, setIsMakeMenuExpanded] = useState(false);
    const [allMakes, setAllMakes] = useState([]);
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedMakeName, setSelectedMakeName] = useState('Select Make');
    const [filteredMakes, setFilteredMakes] = useState([]);

    const [isModelMenuExpanded, setIsModelMenuExpanded] = useState(false);
    const [allModels, setAllModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedModelName, setSelectedModelName] = useState('Select Model');
    const [filteredModels, setFilteredModels] = useState([]);

    const [allYears, setAllYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedYearName, setSelectedYearName] = useState('Select Year');
    const [isYearMenuExpanded, setIsYearMenuExpanded] = useState(false);

    const [isTrimMenuExpanded, setIsTrimMenuExpanded] = useState(false);
    const [selectedTrim, setSelectedTrim] = useState('');
    const [selectedTrimName, setSelectedTrimName] = useState('Select Trim');
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [userVehicle, setUserVehicle] = useState(null)

    const [carKmPerLiter, setCarKmPerLiter] = useState(0);


    const navigation = useNavigation();
    const {userData, setUser, updateUserFromBackend, token} = useCombinedContext();

    const fetchMakes = async (query) => {
        try {

            const response = await axios.get(`${url}/vehicle_makes`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log(response.data.makes)

            // TODO Remove Dev Only

            setAllMakes(response.data.makes);

        } catch (error) {
            console.error(error);
        }
    };

    const fetchModels = async (selectedMake) => {
        try {

            const response = await axios.get(`${url}/vehicle_models/${selectedMake}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            setAllModels(response.data.models);


        } catch (error) {
            console.error(error);
        }
    };

    const fetchYears = async (selectedModel) => {
        try {

            const response = await axios.get(`${url}/vehicle_years/${selectedModel}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });
            const transformedYears = Object.keys(response.data).map(yearRange => ({
                title: yearRange,
                data: response.data[yearRange]
            }));
            setAllYears(transformedYears);
            console.log("Trans", allYears)


        } catch (error) {
            console.error(error);
        }
    };

    const filterMakes = (query) => {
        if (!query) {
            setFilteredMakes(allMakes);
            return;
        }

        const filtered = allMakes.filter(make =>
            make.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredMakes(filtered);
    };

    const filterModels = (query) => {
        if (!query) {
            setFilteredModels(allModels);
            return;
        }

        const filtered = allModels.filter(model => model.toLowerCase().includes(query.toLowerCase()));
        setFilteredModels(filtered);
    };

    const handleSelectingMake = (station) => {
        setSelectedMake(station);
        setSelectedMakeName(station);
        setIsMakeMenuExpanded(false);

        setSelectedModel('');
        setSelectedModelName('Select Model');
        setAllModels([]);

        fetchModels(station);
    }

    const handleSave = async () => {
        try {

            const vehicleData = {
                make: selectedMake,
                model: selectedModel,
                year: selectedYear,
                trim: selectedTrim,
                series: userVehicle.series ? userVehicle.series : '',
                body_type: userVehicle.body_type ? userVehicle.body_type : '',
                engine_type: userVehicle.engine_type ? userVehicle.engine_type : '',
                transmission: userVehicle.transmission ? userVehicle.transmission : '',
                fuel_tank_capacity_l: userVehicle.fuel_tank_capacity_l ? userVehicle.fuel_tank_capacity_l : '',
                city_fuel_per_100km_l: userVehicle.city_fuel_per_100km_l ? userVehicle.city_fuel_per_100km_l : '',
                co2_emissions_g_km: userVehicle.co2_emissions_g_km ? userVehicle.co2_emissions_g_km : '',
            };

            const response = await axios.post(`${url}/create_user_vehicle`, vehicleData, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`
                },
            });

            console.log(response.data.message);
            if (response.data) {
                navigation.navigate('SetPreferences');
            }

        } catch (error) {
            console.error(error);
        }

    };

    const handleSkip = async () => {
        navigation.navigate('SetPreferences');
    }

    const toggleMenu = () => {
        setIsMakeMenuExpanded(!isMakeMenuExpanded);
    };

    useEffect(() => {
        updateUserFromBackend();
        fetchMakes();
    }, []);

    useEffect(() => {
        filterMakes(searchQuery);
    }, [searchQuery, allMakes]);

    useEffect(() => {
        filterModels(modelSearchQuery);
    }, [modelSearchQuery, allModels]);

    const handleSelectingModel = (model) => {
        setSelectedModel(model);
        setSelectedModelName(model);
        setIsModelMenuExpanded(false);

        fetchYears(model);
    };

    const handleSelectYear = (year) => {
        setSelectedYear(year.title);
        setSelectedYearName(year.title);
        setSelectedVehicle(year.data);

        console.log("Selected Vehicle", year.data)

        setIsYearMenuExpanded(false);
    };

    const handleSelectTrim = (trim) => {
        setSelectedTrim(trim.trim);
        setSelectedTrimName(trim.trim);
        setIsTrimMenuExpanded(false);

        setUserVehicle(trim);

        console.log("Selected Trim", trim)
    };

    const toggleYearMenu = () => {
        setIsYearMenuExpanded(!isYearMenuExpanded);
    };

    return (
        <WelcomeMain>
            <Wrapper>
                <Content>
                    <Container>
                        <H3 tmargin='20px' bmargin='20px'>Add Vehicle</H3>
                        <>
                            <H6 bmargin='5px'>Make</H6>
                            <TouchableOpacity onPress={toggleMenu}>
                                <TextContainer bgColor='grey'>{selectedMakeName}</TextContainer>
                                <Icon style={{position: 'absolute', right: 0, padding: 10}}
                                      name={isMakeMenuExpanded ? 'chevron-up' : 'chevron-down'} size={16}
                                      color="black"/>
                            </TouchableOpacity>
                            {isMakeMenuExpanded && (
                                <>
                                    <SearchBox
                                        placeholder="Search for Make"
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                    <>
                                        <H5 tmargin="20px" bmargin="10px">Results</H5>
                                        {allMakes.length > 0 ? (
                                            <View style={{marginBottom: 30}}>
                                                <FlatList
                                                    style={{height: 150}}
                                                    data={filteredMakes}
                                                    keyExtractor={makes => makes.toString()}
                                                    renderItem={({item}) => (
                                                        <TouchableOpacity onPress={() => handleSelectingMake(item)}>
                                                            <TextContainer>
                                                                {item}
                                                            </TextContainer>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </View>
                                        ) : (
                                            <H5 style={{marginBottom: 40}}>Loading Makes...</H5>
                                        )}
                                    </>
                                </>
                            )}
                            <H6 bmargin='5px'>Model</H6>
                            <TouchableOpacity onPress={() => setIsModelMenuExpanded(!isModelMenuExpanded)}
                                              disabled={selectedMake === ''}>
                                <TextContainer bgColor={selectedMake === '' ? 'grey' : '#FFFFFF'}>
                                    {selectedModelName}
                                </TextContainer>
                                <Icon
                                    style={{position: 'absolute', right: 0, padding: 10}}
                                    name={isModelMenuExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={16}
                                    color="black"
                                />
                            </TouchableOpacity>

                            {isModelMenuExpanded && (
                                <>
                                    <SearchBox
                                        placeholder="Search for Model"
                                        value={modelSearchQuery}
                                        onChangeText={setModelSearchQuery}
                                    />
                                    <H5 tmargin="20px" bmargin="10px">Results</H5>
                                    <View style={{marginBottom: 30}}>
                                        <FlatList
                                            style={{height: 150}}
                                            data={filteredModels}
                                            keyExtractor={item => item}
                                            renderItem={({item}) => (
                                                <TouchableOpacity onPress={() => handleSelectingModel(item)}>
                                                    <TextContainer>{item}</TextContainer>
                                                </TouchableOpacity>
                                            )}
                                        />
                                    </View>
                                </>
                            )}
                            <H6 bmargin='5px'>Year</H6>
                            <TouchableOpacity onPress={toggleYearMenu} disabled={selectedModel === ''}>
                                <TextContainer bgColor={selectedModel === '' ? 'grey' : '#FFFFFF'}>
                                    {selectedYearName}
                                </TextContainer>
                                <Icon
                                    style={{position: 'absolute', right: 0, padding: 10}}
                                    name={isYearMenuExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={16}
                                    color="black"
                                />
                            </TouchableOpacity>

                            {isYearMenuExpanded && (
                                <View style={{marginBottom: 30}}>
                                    <FlatList
                                        style={{height: 150}}
                                        data={allYears}
                                        keyExtractor={item => item.title}
                                        renderItem={({item}) => (
                                            <TouchableOpacity onPress={() => handleSelectYear(item)}>
                                                <TextContainer>{item.title}</TextContainer>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}
                            <H6 bmargin='5px'>Trim</H6>
                            <TouchableOpacity onPress={() => setIsTrimMenuExpanded(!isTrimMenuExpanded)}
                                              disabled={selectedVehicle === null}>
                                <TextContainer bgColor={selectedVehicle === null ? 'grey' : '#FFFFFF'}>
                                    {selectedTrimName}
                                </TextContainer>
                                <Icon
                                    style={{position: 'absolute', right: 0, padding: 10}}
                                    name={isTrimMenuExpanded ? 'chevron-up' : 'chevron-down'}
                                    size={16}
                                    color="black"
                                />
                            </TouchableOpacity>

                            {isTrimMenuExpanded && (
                                <View style={{marginBottom: 30}}>
                                    <FlatList
                                        style={{height: 150}}
                                        data={selectedVehicle}
                                        keyExtractor={item => item.trim}
                                        renderItem={({item}) => (
                                            <TouchableOpacity onPress={() => handleSelectTrim(item)}>
                                                <TextContainer>{item.trim}</TextContainer>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>
                            )}
                            <H6 bmargin='5px'>Km/l</H6>
                            <TextContainer
                                bgColor='#FFFFFF'>{userVehicle ? userVehicle.city_fuel_per_100km_l : 'Car KM'}</TextContainer>
                        </>
                        <H6 tmargin='10px' bmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <ButtonButton color="#6bff91" txtWidth="100%"
                                      txtColor="white" text="Continue" onPress={handleSave}
                                      accessibilityLabel="Continue" accessible={true} disabled={!selectedTrim}/>
                        <ButtonButton color="transparent" txtWidth="100%"
                                      txtColor="black" text="Skip" onPress={handleSkip} accessibilityLabel="Skip"
                                      accessible={true}/>
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default CompleteVehicleScreen;
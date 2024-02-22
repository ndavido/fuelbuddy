import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';


//Styling
import {
    WelcomeMain,
    InputTxt,
    PhoneTxt,
    CCTxt,
    Content,
    Wrapper,
    Container,
    LRContainer, LRButtonDiv
} from "../styles/styles";
import PressableButton from '../styles/buttons';
import {Logo} from '../styles/images';
import {H1, H2, H3, H4, H5, H6, Img, Txt} from '../styles/text.js';
import Toast from '../Components/Toast.js';
import {forwardRef, useRef, useImperativeHandle} from 'react';

const url = process.env.REACT_APP_BACKEND_URL

const validateName = (name) => {
    // Check if name has at least two words (first name and last name)
    const nameParts = name.split(' ');
    return nameParts.length >= 2;
};

const validateUsername = (username) => {
    // Check if username is at least 6 characters long
    return username.length >= 6 && username.length <= 20;
}; 

const validatePhoneNumber = (phoneNumber) => {
    // Validate phone number pattern 8XXXXXXXX or 08XXXXXXXX
    const phoneNumberPattern = /^(08\d{8}|8\d{8})$/;
    return phoneNumberPattern.test(phoneNumber);
};

const PhoneContainer = styled(View)`
  flex-direction: row;
`;

const RegisterScreen = () => {
    const [errorBorder, setErrorBorder] = useState(false);
    const [inputErrorBorder, setInputErrorBorder] = useState(false);
    const [inputErrorBorder1, setInputErrorBorder1] = useState(false);
    const toastRef = useRef(null);


    const showToast = () => {
        if (toastRef.current) {
          toastRef.current.success('This is a success message');
        }
      };
    
      const showErrorToast = (message) => {
        if (toastRef.current) {
          toastRef.current.error(message);
          console.log("error toast call")
        }
      };


    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        full_name: '',
        username: '',
        phone_number: '',
    });

    const countryCode = '353';

    const [message, setMessage] = useState('');
    const [nameError, setNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    const handleChange = (name, value) => {
        setFormData({...formData, [name]: value});
        switch (name) {
            case 'full_name':
                const nameParts = name.split(' ');
                if (value.length > 20) {
                    setNameError('');
                } else if(value.length < 1) {
                    setNameError('');
                }
                else{
                    setNameError('');
                }
                break;
            case 'username':
                if (value.length > 20) {
                    setUsernameError('');
                } else {
                    setUsernameError('');
                }
                break;
            case 'phone_number':
                setPhoneError('');
                break;
            default:
                break;
        }
    };


    const handleRegister = async () => {
        try {
            if (!validateName(formData.full_name)) {
                showErrorToast('Please enter a valid name (first and last name)');
                setInputErrorBorder1(true);
                setInputErrorBorder(false); // Reset inputErrorBorder
                setErrorBorder(false); // Reset errorBorder
                return;
            } else if (!validateUsername(formData.username)) {
                showErrorToast('Username must be between 6-20 characters inclusive');
                setInputErrorBorder(true);
                setInputErrorBorder1(false); // Reset inputErrorBorder1
                setErrorBorder(false); // Reset errorBorder
                return;
            } else if (!validatePhoneNumber(formData.phone_number)) {
                showErrorToast('Please enter a valid phone number (e.g. 8XXXXXXXX or 08XXXXXXXX)');
                setErrorBorder(true);
                setInputErrorBorder(false); // Reset inputErrorBorder
                setInputErrorBorder1(false); // Reset inputErrorBorder1
                return;
            }
    
            // Proceed with registration
            const apiKey = process.env.REACT_NATIVE_API_KEY;
            const fullNum = `${countryCode}${formData.phone_number}`;
            const username = formData.username.toLowerCase();
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                },
            };
    
            const response = await axios.post(`${url}/register`, {
                ...formData,
                username: username,
                phone_number: fullNum
            }, config);
    
            if (response && response.data) {
                setMessage(response.data.message);
    
                if (response.data.message === 'Verification code sent successfully!') {
                    navigation.navigate('RegisterVerify', {
                        username: username,
                        phone_number: fullNum,
                        full_name: formData.full_name
                    });
                } else {
                    showErrorToast(response.data.message);
                }
            } else {
                showErrorToast(response.data.message);
                setErrorBorder(true);
            }
        } catch (error) {
            showErrorToast(error.response?.data?.error);
            setErrorBorder(true);
        }
    };


    return (
        <WelcomeMain>
            <Logo/>
            <Toast ref={toastRef} />
            <Wrapper>
                <Content>
                    <LRContainer>
                        <PressableButton
                            title='Register'
                            bgColor='#F7F7F7'
                            txtColor='black'
                            width='50%'
                        />
                        <PressableButton
                            onPress={() => navigation.navigate('Login')}
                            title='Login'
                            bgColor='#6bff91'
                            txtColor='white'
                            width='50%'
                        />
                    </LRContainer>
                    <Container>
                        <H6 bmargin='5px'>Name</H6>
                        <InputTxt
                            inputErrorBorder1 = {inputErrorBorder1}
                            placeholder=""
                            onChangeText={(text) => handleChange('full_name', text)}
                        />
                        {nameError ? <Text style={{color: 'red'}}>{nameError}</Text> : null}

                        <H6 bmargin='5px'>Username</H6>
                        <InputTxt
                            inputErrorBorder = {inputErrorBorder}
                            placeholder=""
                            onChangeText={(text) => handleChange('username', text)}
                        />
                        {usernameError ? <Text style={{color: 'red'}}>{usernameError}</Text> : null}

                        <H6 bmargin='5px'>Phone Number</H6>
                        <PhoneContainer>
                            <CCTxt
                                value="+353"
                                editable={false}
                                placeholder=""
                                onChangeText={(text) => handleChange('country_code', text)}
                            />

                            <PhoneTxt
                                errorBorder = {errorBorder}
                                placeholder=""
                                maxLength={10}
                                onChangeText={(text) => handleChange('phone_number', text)}
                            />
                        </PhoneContainer>

                        {phoneError ? <Text style={{color: 'red'}}>{phoneError}</Text> : null}
                        <H6 tmargin='10px'>{message}</H6>
                    </Container>
                    <LRButtonDiv>
                        <PressableButton
                            onPress={handleRegister}
                            title='Send Register Code'
                            bgColor='#6bff91'
                        />
                    </LRButtonDiv>
                </Content>
            </Wrapper>
        </WelcomeMain>
    );
};

export default RegisterScreen;
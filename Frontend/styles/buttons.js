import React from 'react';
import {TouchableOpacity, Text, Button} from 'react-native';
import {Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons} from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components/native';
import {useNavigation} from "@react-navigation/native";

/* Heart Button */
const HeartButton = styled(Animatable.View)`
  background-color: ${(props) => (props.isActive ? '#FFBABA' : '#eaedea')};
  padding: 7px;
  position: relative;
  border-radius: 10px;
  transform: scale(${(props) => (props.isActive ? 1.2 : 1)});
  opacity: ${(props) => (props.isActive ? 0.8 : 1)};
`;

export const AnimatedHeartButton = ({initialIsActive, onPress}) => {
    const [isActive, setIsActive] = React.useState(initialIsActive);

    const handlePress = () => {
        const newIsActive = !isActive;
        setIsActive(newIsActive);
        if (onPress) {
            onPress(newIsActive);
        }
    };

    React.useEffect(() => {
        setIsActive(initialIsActive);
    }, [initialIsActive]);

    return (
        <TouchableOpacity onPress={handlePress}>
            <HeartButton isActive={isActive} animation="pulse">
                <Entypo name="heart" size={26} color={isActive ? 'red' : '#b8bec2'}/>
            </HeartButton>
        </TouchableOpacity>
    );
};

/* TODO Refactor Generic Button */
const GenericButton = styled(Animatable.View)`
  background-color: #6BFF91;
  padding: 7px;
  position: relative;
  margin-left: 8px;
  border-radius: 10px;
  transform: scale(1);
  opacity: 1;
`;

export const AnimatedGenericButton = ({onPress}) => {
    const handlePress = () => {
        if (onPress) {
            onPress();
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <GenericButton animation="pulse">
                <Entypo name="plus" size={26} color="#FFFFFF"/>
            </GenericButton>
        </TouchableOpacity>
    );
};

/* Main Button ~ Tons Of Options */
const applyPosition = props => {
    if (props.pos === "top") {
        return `margin-top: 10px; 
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                border-bottom: 4px black;
                padding: 10px;`;
    } else if (props.pos === "bottom") {
        return `margin-bottom: 10px; 
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;
                padding: 10px;`;
    } else if (props.pos === "middle") {
        return `padding: 10px;`;
    } else if (props.pos === "single") {
        return `margin-bottom: 10px;
                margin-top: 10px;
                border-radius: 10px;
                padding: 10px;`;
    } else {
        return 'border-radius: 10px;';
    }
};

const IconComponent = ({series, icon, iconColor}) => {
    if (series === "fa") {
        return <FontAwesome name={icon} size={26} color={iconColor || "#FFFFFF"}/>;
    } else if (series === "fa5") {
        return <FontAwesome5 name={icon} size={26} color={iconColor || "#FFFFFF"}/>;
    } else if (series === "mci") {
        return <MaterialCommunityIcons name={icon} size={26} color={iconColor || "#FFFFFF"}/>;
    } else {
        return <Entypo name={icon} size={26} color={iconColor || "#FFFFFF"}/>;
    }
};

const applyColor = props => {
    if (props.color) {
        return `background-color: ${props.color};`;
    } else {
        return `background-color: #3891FA;`;
    }
};

const applyTextColor = props => {
    if (props.txtColor) {
        return `color: ${props.txtColor};`;
    } else {
        return `color: #FFFFFF;`;
    }
};

const applyTextMargin = props => {
    if (props.txtMargin) {
        return `margin-left: ${props.txtMargin}; opacity: 0.6;`;
    } else if (!props.icon && !props.txtWidth) {
        return `margin-left: 5px;`;
    } else {
        return `text-align: center;`;
    }
};

const applyPlacement = ({place}) => {
    if (place === "right") {
        return `margin-left: auto;`;
    } else if (place === "center") {
        return `flex: 1;`;
    } else {
        return ``;
    }
};

const ButtonWrapper = styled.TouchableOpacity`
  width: ${props => props.width || 'auto'};
  opacity: ${(props) => props.disabled ? '0.5' : '1'};
  ${applyPlacement};
` ;

const TGenericButton = styled(Animatable.View)`
  flex-direction: row;
  align-items: center;
  ${applyColor};
  width: 100%;
  padding-top: 7px;
  padding-bottom: 7px;
  padding-left: 7px;
  padding-right: ${(props) => (props.hasText ? '10px' : '7px')};
  align-self: normal;
  position: relative;
  ${applyPosition};
  transform: scale(1);
  opacity: 1;
`;

const ButtonText = styled.Text`
  ${applyTextMargin};
  ${applyTextColor};
  font-size: 16px;
  width: ${props => props.txtWidth || 'auto'};
  line-height: 26px;
  font-family: 'Poppins_500Medium';
`;

export const ButtonButton = ({width, place, txtWidth, series, color, icon, txtMargin, text, txtColor, onPress, iconColor, pos, disabled}) => {
    const handlePress = () => {
        if (onPress) {
            onPress();
        }
    };

    return (
        <ButtonWrapper disabled={disabled} place={place} width={width} onPress={handlePress}>
            <TGenericButton color={color} hasText={!!text} pos={pos}>
                <IconComponent series={series} icon={icon} iconColor={iconColor}/>
                {text ? <ButtonText txtWidth={txtWidth} txtMargin={txtMargin} txtColor={txtColor}>{text}</ButtonText> : null}
            </TGenericButton>
        </ButtonWrapper>
    );
};

/* Back Button */
const Container = styled.View`
  position: absolute;
  padding: 5px;
  left: 0;
  bottom: 0;
`;

const BackButtonContainer = styled(TouchableOpacity)`
  padding: 5px;
  margin-left: 5px;
  background-color: transparent;
  border-radius: 5px;
  align-items: center;
`;

const Icon = styled(FontAwesome5)`
  color: #515151;
  font-size: 18px;
`;

export const BackButton = ({title = 'Back'}) => {
    const navigation = useNavigation();

    return (
        <Container>
            <BackButtonContainer onPress={() => navigation.goBack()}>
                <Icon name="arrow-left"/>
            </BackButtonContainer>
        </Container>

    );
};

export const ToggleButton = ({ title, selected, onPress }) => {
    return (
        <Button
            title={title}
            onPress={onPress}
            style={{ backgroundColor: selected ? 'lightblue' : 'lightgray' }}
        />
    );
};

export const CenterButtonContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const CenterButton = styled.TouchableOpacity`
  width: 70px;
  height: 70px;
  border-radius: 35px; 
  background-color: #6BFF91;
  justify-content: center;
  align-items: center;
`;

export const SideButton = styled.TouchableOpacity`
  opacity: ${(props) => props.disabled ? '0.5' : '1'};
  flex: 1;
  justify-content: center;
  align-items: center;
`;

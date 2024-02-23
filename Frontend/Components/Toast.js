import React, {forwardRef, useRef, useState, useImperativeHandle} from 'react';
import {View, Animated, Text, StatusBar, StyleSheet} from 'react-native';

const Toast = forwardRef((props, ref) => {
    const toastRef = useRef(null)
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [modalShown, setModalShown] = useState(false);
    const [message, setMessage] = useState('Success!');
    const [toastColor, setToastColor] = useState('green');
    const [textColor, setTextColor] = useState('black');

    const closeToast = () => {
        setTimeout(() => {
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 350,
                useNativeDriver: false,
            }).start(() => {
                StatusBar.setBarStyle('default');
                setModalShown(false);
            });
        }, 2000);
    };

    const callToast = (message, type) => {
        if (modalShown) return;
        setToastType(message, type);
        setModalShown(true);
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: 350,
            useNativeDriver: false,
        }).start(closeToast);
    };

    let animation = animatedValue.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [-100, -10, 0],
    });

    useImperativeHandle(ref, () => ({
        success(message) {
            callToast(message, 'success');
            StatusBar.setBarStyle('dark-content');
        },
        error(message) {
            callToast(message, 'error');
            StatusBar.setBarStyle('light-content');
        },
    }));

    const setToastType = (message = 'Success!', type = 'success') => {
        let color;
        let textColorValue;
        if (type == 'error') {
            color = 'red';
            textColorValue = 'white';
        }
        if (type == 'success') {
            color = '#6bff91';
            textColorValue = 'white';
        }
        setMessage(message);
        setToastColor(color);
        setTextColor(textColorValue);
    };

    return modalShown ? (
        <Animated.View style={[styles.container, {backgroundColor: toastColor, transform: [{translateY: animation}]}]}>
            <View style={styles.row}>
                <Text style={[styles.message, {color: textColor}]}>{message}</Text>
            </View>
        </Animated.View>
    ) : null;


    
});

export const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        minHeight: 100,
        width: '100%',
        backgroundColor: 'green',
        zIndex: 1000,
        justifyContent: 'flex-end',
        padding: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6.27,
        elevation: 10,
    },
    message: {
        fontSize: 14,
        color: 'black',
        fontWeight: 'bold',
        marginHorizontal: 10,
        lineHeight: 18,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Toast;
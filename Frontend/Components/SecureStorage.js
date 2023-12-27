import * as SecureStore from 'expo-secure-store';
import CryptoJS from 'crypto-js';
const SS_SECRET_KEY = process.env.SS_SECRET_KEY;

const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SS_SECRET_KEY).toString();
};

const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SS_SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

export const saveData = async (key, data) => {
    const encryptedData = encryptData(data);
    await SecureStore.setItemAsync(key, encryptedData);
};

export const loadData = async (key) => {
    const encryptedData = await SecureStore.getItemAsync(key);
    return encryptedData ? decryptData(encryptedData) : null;
};

export const updateData = async (key, newData) => {
    const existingData = await loadData(key);
    const updatedData = { ...existingData, ...newData };
    await saveData(key, updatedData);
};
import React, {useState, useEffect} from 'react';
import {View, Text, Button, FlatList, TextInput, TouchableOpacity} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from "jwt-decode";
import DropDownPicker from 'react-native-dropdown-picker';

// Styling
import {
    AccountContainer,
    Content,
    Main, TextWrapper, Wrapper,
} from '../styles/styles';
import MainLogo from '../styles/mainLogo';
import {H3, H4, H5, H6} from "../styles/text";
import {useCombinedContext} from "../CombinedContext";

const url = process.env.REACT_APP_BACKEND_URL
const apiKey = process.env.REACT_NATIVE_API_KEY;

const DeveloperScreen = () => {
    const [usersInfo, setUsersInfo] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const [openRoleDropdown, setOpenRoleDropdown] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [roleItems, setRoleItems] = useState([]);

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchText, setSearchText] = useState('');

    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const {token, userData, updateUserFromBackend, logout} = useCombinedContext();

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const jwt_user = await AsyncStorage.getItem('token');
                const user_id = jwtDecode(jwt_user).sub;

                console.log('User Id', user_id, 'Token', jwt_user);
                const config = {
                    headers: {
                        'X-API-Key': apiKey,
                        'Authorization': `Bearer ${token}`,
                    },
                };
                const response = await axios.post(`${url}/view_all_users`, {id: user_id}, config);

                console.log(response.data)


                if (response.data) {
                    const formattedData = response.data.map(userString => JSON.parse(userString));
                    setUsersInfo(formattedData);
                    setFilteredUsers(formattedData);
                    console.log(usersInfo);
                }

            } catch (error) {
                console.error('Error fetching All Users:', error);
            }
        };

        const roles = ['user', 'Developer', 'admin', 'Station_Owner'];
        const formattedRoles = roles.map(role => ({label: role, value: role}));
        setRoleItems(formattedRoles);
        fetchAllUsers();
    }, []);

    useEffect(() => {
        const filtered = usersInfo.filter(user => user.username.toLowerCase().includes(searchText.toLowerCase()));
        setFilteredUsers(filtered);
    }, [searchText, usersInfo]);

    const handleAddRole = async () => {
        if (!selectedUser || !selectedRole) {
            console.log(selectedUser._id.$oid)
            console.log(selectedRole)
            console.error('No user or role selected');
            return;
        }

        try {
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${url}/update_role`, {
                user_id: selectedUser._id.$oid,
                role: selectedRole
            }, config);

            if (response.data.message === 'Role updated successfully!') {
                console.log('Role updated successfully!');
                fetchAllUsers();
            }
            console.log(response.data);
        } catch (error) {
            console.error('Error adding role:', error);
        }
    }

    const handleRemoveRole = async () => {
        if (!selectedUser || !selectedRole) {
            console.log(selectedUser._id.$oid)
            console.log(selectedRole)
            console.error('No user or role selected');
            return;
        }

        try {
            const config = {
                headers: {
                    'X-API-Key': apiKey,
                    'Authorization': `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${url}/remove_role`, {
                user_id: selectedUser._id.$oid,
                role: selectedRole
            }, config);

            if (response.data.message === 'Role updated successfully!') {
                console.log('Role updated successfully!');
                fetchAllUsers();
            }
            console.log(response.data);
        } catch (error) {
            console.error('Error adding role:', error);
        }
    }

    return (
        <Main>
            <MainLogo bButton={true} PageTxt=''/>
            <Wrapper>
                <AccountContainer style={{minHeight: 800}}>
                    <Content>
                        <View>
                            <H4 tmargin='20px' bmargin='10px'>Developer Menu</H4>
                            <TextInput
                                placeholder="Search User"
                                value={searchText}
                                onChangeText={text => setSearchText(text)}
                                style={{
                                    marginBottom: 10,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderColor: 'gray',
                                    borderWidth: 1
                                }}
                            />
                            <H4>Selected User: {selectedUser ? selectedUser.username : 'None'}</H4>
                            <DropDownPicker
                                open={openRoleDropdown}
                                value={selectedRole}
                                items={roleItems}
                                setOpen={setOpenRoleDropdown}
                                setValue={setSelectedRole}
                                setItems={setRoleItems}
                                placeholder="Select Role"
                                style={{marginBottom: 10}}
                            />

                            <Button title="Add Role" onPress={handleAddRole}/>
                            <Button title="Remove Role" onPress={handleRemoveRole}/>
                            <H4>Users</H4>
                            <FlatList style={{height: 400}}
                                      data={filteredUsers}
                                      keyExtractor={(item) => item._id.$oid}
                                      renderItem={({item}) => (

                                          <TouchableOpacity
                                              onPress={() => setSelectedUser(item)}
                                              style={{
                                                  borderBottomWidth: 1,
                                                  borderColor: 'lightgray',
                                                  padding: 10,
                                                  backgroundColor: selectedUser?._id.$oid === item._id.$oid ? 'lightblue' : 'white'
                                              }}
                                          >
                                              <H3>{item.username}</H3>
                                              <H6>Roles: {item.roles.join(', ')}</H6>
                                          </TouchableOpacity>

                                      )}
                            />
                        </View>
                    </Content>
                </AccountContainer>
            </Wrapper>
        </Main>
    );
};

export default DeveloperScreen;
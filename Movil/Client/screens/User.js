import React, {useState, useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View,StyleSheet,Text,TouchableOpacity} from 'react-native';

import CredentialsContext from './../components/CredentialsContext';

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useNavigation } from '@react-navigation/native';

import axios from 'axios';

import { Table, Row, Rows } from 'react-native-table-component';

import Users from '../Modal/Users';

const {tertiary, darklight,secondary, primary, grey}= Colors;

const User = () => {
const [hidePassword,setHidePassword] = useState(true);
const ip = 'http://192.168.1.187:8080/api';
const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
const {name,lastName,role,email} = storedCredentials;
const [selectedUser,setSelectedUser] = useState('');

//For the Modal
const [modalVisible,setModalVisible] = useState(false);

const navigation = useNavigation();

const [users,setUsers] = useState([]);

const clearLogin = () => {
    AsyncStorage.removeItem('inventoryManagementCredentials')
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
  };

  const getUsers = async () => {
    const url = ip+'/getUsers';
    try {
      const response = await axios.get(url);
      const resultArray = response.data;
      setUsers(resultArray);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }
//For the Modal to close
const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUsers();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);



  const tableHead = ['Nombre', 'Apellido', 'Rol'];
  const tableData = users.map((user) => [
    user.Nombre,
    user.ApePat,
    <TouchableOpacity
    onPress={() => {setSelectedUser(user.Correo); openModal()}} >
   <Text style={styles.textB}>{ user.Rol}</Text>
  </TouchableOpacity>
  ]);

    return(
        <StyledContainer>
            <StatusBar style="dark"/>
            <View style={styles.center}>
            <PageLogo resizeMode="cover" source={require('./../assets/images/C4Logo.png')}/>
                <PageTitle>{name} {lastName}</PageTitle>
                <SubTitle>{email}</SubTitle> 
                <StyledButton onPress={clearLogin}>
                    <ButtonText>Logout</ButtonText>
                </StyledButton>
                </View>

            {(role == 1) &&
                <View style={styles.innerContainer}>
      <Table borderStyle={{ borderWidth: 2, borderColor: tertiary}}>
        <Row data={tableHead} style={styles.head} textStyle={styles.headText} />
        <Rows data={tableData} textStyle={styles.text} />
      </Table>
                </View>}
                <Users isVisible={modalVisible} closeModal={closeModal} user={selectedUser}/>
        </StyledContainer>
    );
}

const styles = StyleSheet.create({
    center: {
        width: "auto",
        alignItems: 'center'},
    innerContainer: {
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 5,
      },
      head: {
        height: 40, backgroundColor: secondary, 
      },
      headText: {
        margin: 6, fontWeight: 'bold', color: primary,fontSize: 16,paddingLeft:15
      },
      text: {
        fontSize: 16,
        marginVertical: 3,
        color: secondary,
        paddingLeft:10,
        padding: 15,

      },
      textB: {
        fontSize: 16,
        marginVertical: 3,
        color: tertiary,
        paddingLeft:10,
        padding: 15,
        fontWeight: 'bold'
      },
  });

export default User;
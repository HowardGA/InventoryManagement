import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View} from 'react-native';

import CredentialsContext from './../components/CredentialsContext';

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useNavigation } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary}= Colors;

const User = () => {
const [hidePassword,setHidePassword] = useState(true);



const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext);
const {name,lastName,email} = storedCredentials;
const navigation = useNavigation();

const clearLogin = () => {
    AsyncStorage.removeItem('inventoryManagementCredentials')
      .then(() => {
        setStoredCredentials("");
      })
      .catch((error) => console.log(error));
  };

    return(
        <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
            <PageLogo resizeMode="cover" source={require('./../assets/images/C4Logo.png')}/>
                <PageTitle>Usuario</PageTitle>

                <SubTitle>{name} {lastName}</SubTitle> 
                <SubTitle>{email}</SubTitle>
                <StyledButton onPress={clearLogin}>
                    <ButtonText>Logout</ButtonText>
                </StyledButton>
            </InnerContainer>
        </StyledContainer>
    );
}

export default User;
import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

//formik
import {Formik} from 'formik';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View} from 'react-native';

import {CredentialsContext} from './../components/CredentialsContext';

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

const {tertiary, darklight,secondary, primary}= Colors;

const Welcome = () => {
const [hidePassword,setHidePassword] = useState(true);

const {storedCredentials, setStoredCredentials} = useState(CredentialsContext);
const {name,lastName,email} = storedCredentials;


    return(
        <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
                <PageLogo resizeMode="cover" source={require('./../assets/images/C4Logo.png')}/>
                <PageTitle>Home</PageTitle>
                <SubTitle>{name}</SubTitle>
            </InnerContainer>
        </StyledContainer>
    );
}

export default Welcome;
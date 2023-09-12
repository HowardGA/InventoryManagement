import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View} from 'react-native';

import {CredentialsContext} from './../components/CredentialsContext';

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useNavigation } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary}= Colors;

const Welcome = () => {
const [hidePassword,setHidePassword] = useState(true);



const {storedCredentials, setStoredCredentials} = useState(CredentialsContext);
//const {name,lastName,email} = storedCredentials;
const navigation = useNavigation();

    return(
        <StyledContainer>
            <StatusBar style="dark"/>
            <InnerContainer>
                <PageTitle>Home</PageTitle>
                <RightIcon onPress={() => navigation.navigate('AddBarcode')}>
                    <Ionicons  name={'barcode-outline'} size={30} color={secondary}/>
                </RightIcon>
                {/* <SubTitle>{name}</SubTitle> */}
            </InnerContainer>
        </StyledContainer>
    );
}

export default Welcome;
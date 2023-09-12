import React, {useState, useContext} from 'react';
import { StatusBar } from 'expo-status-bar';

//Credentials Context
import CredentialsContext from './../components/CredentialsContext';

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

//Axios
import axios from 'axios';

//formik
import {Formik} from 'formik';``

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View, ActivityIndicator} from 'react-native';
//colors
const {tertiary, darklight,secondary, primary}= Colors;

//Keyboard Avoiding View
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

const Login = ({navigation}) => {
const [hidePassword,setHidePassword] = useState(true);
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();

    const {storedCredentials, setStoredCredentials} = useState(CredentialsContext);

const handleLogin = (credentials, setSubmitting) =>{
    handleMessage(null);
    const url = "http://192.168.1.187:8080/api/login";

    axios
        .post(url,credentials)
        .then((response) => {
            const result = response.data;
            const {message,status,data} = result;

            if (status !== 'SUCCESS'){
                handleMessage(message,status);
            }else{
                persistLogin({...data[0]}, message, status);
            }
            setSubmitting(false);

    }).catch(error => {
        console.log(error.JSON());
        setSubmitting(false);
        handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
    })
}

    const handleMessage = (message,type = 'FAIL') => {
        setMessage(message);
        setMessageType(type);
    }

    const persistLogin = (credentials, message, status) => {
        AsyncStorage.setItem('inventoryManagementCredentials',JSON.stringify(credentials))
        .then(() => {
            handleMessage(message,status);
            setStoredCredentials(credentials);
        })
        .catch(error => {
            console.log(error);
            handleMessage("Persisting Login Failed");
        })
    }

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark"/>
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('./../assets/images/C4Logo.png')}/>
                    <PageTitle>Gestión de Inventarios</PageTitle>
                    <SubTitle>Inicio de Sesión</SubTitle>
                    <Formik
                        initialValues={{email:'',password:''}}
                        onSubmit={(values,{setSubmitting}) => {
                            if(values.email == '' || values.password == '' ){
                                handleMessage("Por favor llene todos los campos");
                                setSubmitting(false);
                            }else{
                                handleLogin(values,setSubmitting);
                            }
                        }}>
                    {
                        ({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => 
                            (<StyledFormArea>
                                <MyTextInput
                                    label="Correo Electronico"
                                    icon="mail"
                                    placeholder="example@mail.com"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                />

                                <MyTextInput
                                    label="Contraseña"
                                    icon="lock"
                                    placeholder="* * * * * * * "
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry= {hidePassword}
                                    isPassword = {true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />

                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Entrar</ButtonText>
                                </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                                <Line/>

                                <StyledButton google={true} onPress={handleSubmit}>
                                    <Fontisto name="google" color={primary} size={25}/>
                                    <ButtonText google={true}>Iniciar con Google</ButtonText>
                                </StyledButton>

                                <ExtraView>
                                    <ExtraText>¿No tienes una cuenta? </ExtraText>
                                    <Textlink onPress={() => navigation.navigate('Signup')}>
                                    <TextLinkContent>Registrate</TextLinkContent>
                                    </Textlink>
                                </ExtraView>

                            </StyledFormArea>
                    )}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label, icon, isPassword,hidePassword,setHidePassword, ...props}) =>{
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={secondary}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye' }size={30} color={darklight}/>
                </RightIcon>
            )}
        </View>
    );
}

export default Login;
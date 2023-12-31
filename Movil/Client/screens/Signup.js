import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

//import axios
import axios from 'axios';

//formik
import {Formik} from 'formik';

//icons
import {Octicons, Ionicons} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View,ActivityIndicator} from 'react-native';

const {tertiary, darklight,secondary, primary}= Colors;

//Keyboard avoiding avoid view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

const Signup = ({navigation}) => {
const ip = 'http://192.168.1.187:8080/api';
const [hidePassword,setHidePassword] = useState(true);

//Form handling
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();




const handleSignup = (credentials, setSubmitting) =>{
    handleMessage(null);
    const url = ip+"/register";

    axios
        .post(url,credentials)
        .then((response) => {
            const result = response.data;
            const {message,status} = result;

            if (status !== 'SUCCESS'){
                handleMessage(message,status);
            }else{
                handleMessage(message,status);
                navigation.navigate('Login');
            }
            setSubmitting(false);

    }).catch((error) => {
        console.error(error);
        handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
    })
}

    const handleMessage = (message,type = 'FAILED') => {
        setMessage(message);
        setMessageType(type);
    }



    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
            <StatusBar style="light" backgroundColor={secondary} />
                <InnerContainer>
                    <PageTitle>Gestión de Inventarios</PageTitle>
                    <SubTitle>Registrate</SubTitle>
                    <Formik
                        initialValues={{name:'',lastname:'',email:'',password:'',confirmPassword:''}}
                        onSubmit={(values, setSubmitting) => {
                            values = {...values};
                            if(values.name == '' || values.lastname == '' || values.email == ''|| values.password == ''|| values.confirmPassword == ''){
                                handleMessage("Por favor llene todos los campos");
                                setSubmitting(false);
                            }else if (values.password !== values.confirmPassword){
                                handleMessage("Las contraseñas no son iguales");
                                setSubmitting(false);
                            }else{
                                handleSignup(values,setSubmitting);
                            }
                        }}>
                    {
                        ({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => 
                            (<StyledFormArea>
                                <MyTextInput
                                    label="Nombre"
                                    icon="person"
                                    placeholder="Howard"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('name')}
                                    onBlur={handleBlur('name')}
                                    value={values.name}
                                    keyboardType="email-address"
                                />

                                <MyTextInput
                                    label="Apellido"
                                    icon="person"
                                    placeholder="García"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('lastname')}
                                    onBlur={handleBlur('lastname')}
                                    value={values.lastname}
                                    keyboardType="email-address"
                                />

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

                                <MyTextInput
                                    label="Confirma la Contraseña"
                                    icon="lock"
                                    placeholder="* * * * * * * "
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('confirmPassword')}
                                    onBlur={handleBlur('confirmPassword')}
                                    value={values.confirmPassword}
                                    secureTextEntry= {hidePassword}
                                    isPassword = {true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />

                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Registrar</ButtonText>
                                </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                                <Line/>

                                <ExtraView>
                                    <ExtraText>¿Ya tienes una cuenta? </ExtraText>
                                    <Textlink onPress={() => navigation.navigate('Login')}>
                                    <TextLinkContent>Inicia Sesión</TextLinkContent>
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

export default Signup;
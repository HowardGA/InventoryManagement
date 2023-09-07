import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

//formik
import {Formik} from 'formik';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View} from 'react-native';
//colors
const {tertiary, darklight,secondary, primary}= Colors;

//Keyboard Avoiding View
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

const Login = ({navigation}) => {
const [hidePassword,setHidePassword] = useState(true);

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
                        onSubmit={(values) => {
                            console.log(values);
                            navigation.navigate('Welcome');
                        }}>
                    {
                        ({handleChange, handleBlur, handleSubmit, values}) => 
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

                                <MsgBox>...</MsgBox>

                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Entrar</ButtonText>
                                </StyledButton>

                                <Line/>

                                <StyledButton google={true} onPress={handleSubmit}>
                                    <Fontisto name="google" color={primary} size={25}/>
                                    <ButtonText google={true}>Iniciar con Google</ButtonText>
                                </StyledButton>

                                <ExtraView>
                                    <ExtraText>¿No tienes una cuenta?</ExtraText>
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
import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';

//formik
import {Formik} from 'formik';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View} from 'react-native';

const {tertiary, darklight,secondary, primary}= Colors;

//Keyboard avoiding avoid view
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

const Signup = () => {
const [hidePassword,setHidePassword] = useState(true);

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>Gestión de Inventarios</PageTitle>
                    <SubTitle>Registrate</SubTitle>
                    <Formik
                        initialValues={{Name:'',lastName:'',email:'',password:'',confirmPassword:''}}
                        onSubmit={(values) => {
                            console.log(values);
                        }}>
                    {
                        ({handleChange, handleBlur, handleSubmit, values}) => 
                            (<StyledFormArea>
                                <MyTextInput
                                    label="Nombre"
                                    icon="person"
                                    placeholder="Howard"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('Name')}
                                    onBlur={handleBlur('Name')}
                                    value={values.Name}
                                    keyboardType="email-address"
                                />

                                <MyTextInput
                                    label="Apellido"
                                    icon="mail"
                                    placeholder="García"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('lastName')}
                                    onBlur={handleBlur('lastName')}
                                    value={values.lastName}
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
                                    label="Confirma Contraseña"
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

                                <MsgBox>...</MsgBox>

                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Entrar</ButtonText>
                                </StyledButton>

                                <Line/>

                                <ExtraView>
                                    <ExtraText>¿Ya tienes una cuenta?</ExtraText>
                                    <Textlink>
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
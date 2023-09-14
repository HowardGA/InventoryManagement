import React, {useState, useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

//formik
import {Formik,Field} from 'formik';

import { Picker } from '@react-native-picker/picker';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View,ActivityIndicator} from 'react-native';

import {CredentialsContext} from './../components/CredentialsContext';

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

//Keyboard
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

//import BarcodeScanner Modal
import Scanner from './../Modal/BarCodeScannerM';
import Brand from './../Modal/Brand';

const {tertiary, darklight,secondary, primary, grey}= Colors;

const Add = () => {
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();
const [modalVisibleScanner,setModalVisibleScanner] = useState(false);
const [modalVisibleBrand,setModalVisibleBrand] = useState(false);
const [scannedData, setScannedData] = useState(); 
const [brandValue, setBrandValue] = useState(); 
const [locationValue, setLocationValue] = useState(); 


//gets this values from the DataBase
const marcaOptions = ['Option 1', 'Option 2', 'Option 3'];

const ubicacionOptions = ['Option 1', 'Option 2', 'Option 3'];

const {storedCredentials, setStoredCredentials} = useState(CredentialsContext);
//const {name,lastName,email} = storedCredentials;

const handleAdd = (values, setSubmitting) =>{
    handleMessage(null);
    
}

const handleMessage = (message,type = 'FAIL') => {
    setMessage(message);
    setMessageType(type);
}

const openModalScanner = () => {
    setModalVisibleScanner(true);
  };

  const closeModalScanner = () => {
    setModalVisibleScanner(false);
  };

  const handleBarcodeScanned = (data) => {
    setScannedData(data); 
    console.log("inside add: "+scannedData);
    setModalVisibleScanner(false);
  };

  const openModalBrand = () => {
    setModalVisibleBrand(true);
  };

  const closeModalBrand = () => {
    setModalVisibleBrand(false);
  };

  const handleBrand = (value) => {
    setBrandValue(value); 
    setModalVisibleBrand(false);
  };

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>Agregar</PageTitle>
                        <Formik
                          initialValues={{codigo:'',nombre:'',modelo:'',color:'',descripcion:'',marca:'',ubicacion:''}}
                          onSubmit={(values,{setSubmitting}) => {
                              if(values.codigo == '' || values.nombre == '' || values.modelo == '' || values.descripcion == ''|| values.marca == ''|| values.ubicacion == ''){
                                  handleMessage("Por favor llene todos los campos");
                                  setSubmitting(false);
                              }else{
                                  handleAdd(values,setSubmitting);
                              }
                          }}>
                             {
                        ({handleChange, handleBlur, handleSubmit, values, isSubmitting,setValues,setFieldValue}) => 
                            (<StyledFormArea>
                                <MyTextInput
                                    label="UPC"
                                    icon="number"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('codigo')}
                                    onBlur={handleBlur('codigo')}
                                    value={values.codigo}
                                    keyboardType="numeric"
                                    openModalScanner={openModalScanner} 
                                />
                             

                                <MyTextInput
                                    label="Nombre"
                                    icon="list-unordered"
                                    placeholder="Silla Empresarial"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('nombre')}
                                    onBlur={handleBlur('nombre')}
                                    value={values.nombre}
                                />

                                <MyTextInput
                                    label="Modelo"
                                    icon="list-unordered"
                                    placeholder="H6034C1"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('modelo')}
                                    onBlur={handleBlur('modelo')}
                                    value={values.modelo}
                                />

                                <MyTextInput
                                    label="Color"
                                    icon="list-unordered"
                                    placeholder="Indigo"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('color')}
                                    onBlur={handleBlur('color')}
                                    value={values.color}
                                />

                                <MyTextInput
                                    label="Descripción"
                                    icon="pencil"
                                    placeholder="Con 4 patas / Respaldo..."
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('descripcion')}
                                    onBlur={handleBlur('descripcion')}
                                    value={values.descripcion}
                                />

                <View>
                  <StyledInputLabel>Marca</StyledInputLabel>
                  <Picker
                    selectedValue={brandValue}
                    onValueChange={(itemValue) => setBrandValue(itemValue)}
                    style={{backgroundColor:grey, padding: 15,
                        paddingLeft: 55,
                        paddingRight:55,
                        borderRadius: 5,
                        fontSize: 16,
                        height: 60,
                        marginVertical: 3,
                        marginBottom: 10,
                        color: secondary, width:'75%'}}
                  >
                    <Picker.Item label="Seleccionar marca" value=""/>      

                    {marcaOptions.map((option) => (
                      <Picker.Item label={option} value={option} key={option}   style={{
                      borderRadius: 10,color: secondary}}/>
                    ))}
                  </Picker>
                  <RightIcon onPress={openModalBrand}>
                    <Ionicons name={'add'} size={30} color={secondary} />
                  </RightIcon>
                </View>
{/*_________________________________ */}
                <View>
                  <StyledInputLabel>Ubicación</StyledInputLabel>
                  <Picker
                    selectedValue={locationValue}
                    onValueChange={(itemValue) => setLocationValue(itemValue)}
                    style={{backgroundColor:grey, padding: 15,
                        paddingLeft: 55,
                        paddingRight:55,
                        borderRadius: 5,
                        fontSize: 16,
                        height: 60,
                        marginVertical: 3,
                        marginBottom: 10,
                        color: secondary, width:'75%'}}
                  >
                    <Picker.Item label="Seleccionar Ubicación" value=""/>      

                    {ubicacionOptions.map((option) => (
                      <Picker.Item label={option} value={option} key={option}   style={{
                      borderRadius: 10,color: secondary}}/>
                    ))}
                  </Picker>
                  <RightIcon onPress={openModalBrand}>
                    <Ionicons name={'add'} size={30} color={secondary} />
                  </RightIcon>
                </View>

                {useEffect(() => {
                    if (scannedData) {
                    setValues({ ...values, codigo: scannedData });
                    }
                    if (locationValue){
                        setFieldValue('ubicacion', locationValue );
                    }
                    if (brandValue){
                        setFieldValue('marca', brandValue);
                    }
                }, [scannedData,locationValue,brandValue])}

                                
                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Agregar</ButtonText>
                                </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                            </StyledFormArea>
                    )}
                        </Formik>
                        <Scanner isVisible={modalVisibleScanner} closeModal={closeModalScanner} onBarcodeScanned={handleBarcodeScanned}/>
                        <Brand isVisible={modalVisibleBrand} closeModal={closeModalBrand} onBrand={handleBrand}/>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label, icon,openModalScanner,openModalBrand, ...props}) =>{
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={secondary}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {label == 'UPC' && (
                <RightIcon onPress={openModalScanner}>
                    <Ionicons name={'barcode-outline'}size={30} color={secondary}/>
                </RightIcon>
            )}

        </View>
    );
}

export default Add;
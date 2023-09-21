import React, {useState, useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

//formik
import {Formik} from 'formik';

import { Picker } from '@react-native-picker/picker';

//icons
import {Octicons, Ionicons} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,
StyledScrollView} from './../components/styles';

import {View,ActivityIndicator,Alert,RefreshControl} from 'react-native';

import CredentialsContext from './../components/CredentialsContext';
import { useFocusEffect } from '@react-navigation/native';

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

//Keyboard
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

//import BarcodeScanner Modal
import Scanner from './../Modal/BarCodeScannerM';
import Brand from './../Modal/Brand';
import Location from './../Modal/Location';

const {tertiary, darklight,secondary, primary, grey}= Colors;

const Add = () => {
  //get stored credentials
const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext); 
const {email} = storedCredentials;
const ip = 'http://192.168.1.187:8080/api';
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();
const [modalVisibleScanner,setModalVisibleScanner] = useState(false);
const [modalVisibleBrand,setModalVisibleBrand] = useState(false);
const [modalVisibleLocation,setModalVisibleLocation] = useState(false);
const [scannedData, setScannedData] = useState(); 
const [brandValue, setBrandValue] = useState(); 
const [locationValue, setLocationValue] = useState(); 
const [dbLocationValue, setDbLocationValue] = useState([]);
const [dbBrandValue, setDbBrandValue] = useState([]);

//To refresh the values
const [refreshing, setRefreshing] = useState(false);

//gets this values from the DataBase
const marcaOptions = dbBrandValue;

const ubicacionOptions = dbLocationValue;





const getLocations = async () => {
  const url = ip+"/ubicaciones";

  try {
    const response = await axios.get(url);
    const result = response.data;
    const resultArray = result.map((item) => item.Lugar);
    setDbLocationValue(resultArray);
  } catch (error) {
    console.error("Error fetching locations:", error);
    handleMessage("Ocurrió un error al obtener ubicaciones, por favor verifica tu conexión e intenta nuevamente");
  }
}

const getBrands = async () => {
  const url = ip+"/marcas";

  try {
    const response = await axios.get(url);

    if (response.status === 200 && Array.isArray(response.data)) {
      const result = response.data;
      const resultArray = result.map((item) => item.Nombre);
      setDbBrandValue(resultArray);
    } else {
      console.error("Invalid response data format:", response.data);
      handleMessage("La respuesta del servidor tiene un formato inválido");
    }
  } catch (error) {
    console.error("Error fetching brands:", error);
    handleMessage("Ocurrió un error al obtener marcas, por favor verifica tu conexión e intenta nuevamente");
  }
}

//check if the ID has been registered before
const checkId = () => {
  const url = ip+`/idCheck/${scannedData}`;

  axios
  .get(url)
  .then((response) => {
      const result = response.data;
      const {id} = result;
       if(id == 1){
          sameIdAlert();
            }
}).catch((error) => {
  console.error(error);
  handleMessage("Err");
})  
}

//throw an alert if the ID that wants to be register is the same
const sameIdAlert = () => {
  Alert.alert('UPC Invalido!', 'El codigo UPC que se quiere utilizar ya esta registrado, por favor revise su código', [
    {
      text: 'OK',
      onPress: () => setScannedData(),
    }
  ]);
}

useEffect(() => {
  const fetchData = async () => {
    try {
      await getBrands();
      await getLocations();
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, []);


const handleAdd = (values, setSubmitting) =>{
  handleMessage(null);
  const url = ip+"/addItem";
  values.email = email;
  console.log("Form Values:", values);
  axios
      .post(url,values)
      .then((response) => {
          const result = response.data;
          const {message,status,data} = result;

          if (status !== 'SUCCESS'){
              handleMessage(message,status);
          }else{
            handleMessage(message,status);
          }
          setSubmitting(false);

  }).catch((error) => {
      console.error(error);
      setSubmitting(false);
      handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
  })    
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
    const url= ip+'/setBrand';
    const requestData = {brand:value}
    axios
        .post(url,requestData)
        .then((response) => {
            const result = response.data;
            const {message} = result;
            const status = 'SUCCESS';

      handleMessage(message,status);

    }).catch((error) => {
        console.error(error);
        setSubmitting(false);
        handleMessage("Ocurrió un error, vuelve a intentarlo");
    })
    setModalVisibleBrand(false);
  };

  const openModalLocation = () => {
    setModalVisibleLocation(true);
  };

  const closeModalLocation = () => {
    setModalVisibleLocation(false);
  };

  const handleLocation = (value) => {
    const url= ip+'/setLocation';
    const requestData = {location:value}
    axios
        .post(url,requestData)
        .then((response) => {
            const result = response.data;
            const {message} = result;
            const status = 'SUCCESS';

      handleMessage(message,status);

    }).catch((error) => {
        console.error(error);
        setSubmitting(false);
        handleMessage("Ocurrió un error, vuelve a intentarlo");
    })
    setModalVisibleBrand(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
      getBrands()
      getLocations()
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Error while refreshing:', error);
        setRefreshing(false);
      });
  };

    return(
      <StyledScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
      >
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>Agregar</PageTitle>
                        <Formik
                          initialValues={{codigo:'',nombre:'',modelo:'',color:'',descripcion:'',marca:'',ubicacion:''}}
                          onSubmit={(values,{setSubmitting}) => {
                              if(values.codigo == '' || values.nombre == '' || values.modelo == '' || values.color == '' || values.descripcion == ''|| values.marca == ''|| values.ubicacion == ''){
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
                  <RightIcon onPress={openModalLocation}>
                    <Ionicons name={'add'} size={30} color={secondary} />
                  </RightIcon>
                </View>

                {useEffect(() => {
                    if (scannedData) {
                      checkId();
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
                        <Location isVisible={modalVisibleLocation} closeModal={closeModalLocation} onLocation={handleLocation}/>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
        </StyledScrollView>
    );
}

const MyTextInput = ({label, icon,openModalScanner, ...props}) =>{
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
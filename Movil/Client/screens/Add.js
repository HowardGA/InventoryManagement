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

import {View,ActivityIndicator,Alert,RefreshControl,Image} from 'react-native';

import CredentialsContext from './../components/CredentialsContext';
import { useFocusEffect } from '@react-navigation/native';

//import image picker
import * as ImagePicker from 'expo-image-picker';

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
const [municipio, setMunicipio] = useState(); 
let scannedDataSerial1 = false;

const [upcScannedData, setUpcScannedData] = useState('');
const [serialScannedData, setSerialScannedData] = useState('');
const [inputType,setInputType] = useState('');

//fot the images
const [pickedImages, setPickedImages] = useState([]);
//To clean theform
const [cleanInputs, setCleanInputs] = useState(false);
//To refresh the values
const [refreshing, setRefreshing] = useState(false);

//gets this values from the DataBase
const marcaOptions = dbBrandValue;

const ubicacionOptions = dbLocationValue;

const MunicipioOptions = ['Playas de Rosarito','Tijuana','Tecate','Ensenada','Mexicali'];

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
const checkId = (scannedData, codeType) => {//code type is if its a UPC or a Serial Number
  let endpoint;
  if (codeType === 'UPC') {
    endpoint = `/idCheck/${scannedData}`;
  } else if (codeType === 'Serial') {
    endpoint = `/serialCheck/${scannedData}`;
  } else {
    // Handle invalid codeType here
    return;
  }

  const url = ip + endpoint;
  axios
  .get(url)
  .then((response) => {
      const result = response.data;
      const {id} = result;
       if(id == 1){
          sameIdAlert(codeType);
            }
}).catch((error) => {
  console.error(error);
  handleMessage("Err");
})  
}

//throw an alert if the ID that wants to be register is the same
const sameIdAlert = (codeType) => {
  let message = '';
  if (codeType === 'UPC') {
    message = 'El código UPC que se quiere utilizar ya está registrado, por favor revise su código UPC.';
  } else if (codeType === 'Serial') {
    message = 'El número serial que se quiere utilizar ya está registrado, por favor revise su número serial.';
  }

  Alert.alert('Código Duplicado', message, [
    {
      text: 'OK',
      onPress: () => setScannedData(),
    }
  ]);
};

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


const handleAdd = async (values, setSubmitting, pickedImages) => {
  try {
    handleMessage(null);
    const url = `${ip}/addItem`;
    values.email = email;
    console.log(values);

 
    const formData = new FormData();
    for (const key in values) {
      formData.append(key, values[key]);
    }

    // Add images to the FormData
    pickedImages.forEach((imageUri, index) => {
      const fileExtension = imageUri.endsWith(".jpg") ? "jpg" : "png";
      const uniqueIdentifier = Date.now() + index;
      const fileName = `${values.codigo}_${values.serial}_${uniqueIdentifier}.${fileExtension}`;
      formData.append("images", {
        uri: imageUri,
        type: "image/jpeg", // Adjust the content type as needed
        name: fileName,
      });
    });

    // Make the POST request using Axios
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data", // Set the content type for FormData
      },
    });

    const result = response.data;
    const { message, status, data } = result;

    if (status !== "SUCCESS") {
      handleMessage(message, status);
    } else {     
      setCleanInputs(true);
      setPickedImages([]);
      handleMessage(message, status);
    }
    
    // Set submitting to false after the request is complete
    setSubmitting(false);
  } catch (error) {
    console.error(error);
    setSubmitting(false);
    handleMessage("Ocurrió un error, verifica tu conexión e inténtalo de nuevo");
  }
};

const handleMessage = (message,type = 'FAIL') => {
    setMessage(message);
    setMessageType(type);
}

const openModalScanner = (inputType) => {
  setModalVisibleScanner(true);
  setInputType(inputType);
};


  const closeModalScanner = () => {
    setModalVisibleScanner(false);
  };

  const handleBarcodeScanned = (data , inputType) => {
    if (inputType === 'UPC') {
      setUpcScannedData(data);
    } else if (inputType === 'Número Serial') {
      setSerialScannedData(data);
    }
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

  const pickImage = async (upcNumber, serialNumber) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert('Permission to access the camera roll is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
  
    if (!result.canceled) {
      // Determine the selected assets
      const selectedAssets = result.assets;
  
      // Determine the file extensions and file names for each selected image
      const fileExtensions = selectedAssets.map(
        (asset) => (asset.mediaType === 'photo' ? 'jpg' : 'png')
      );
  
      const uniqueIdentifier = Date.now();
  
      const fileNames = selectedAssets.map(
        (_, index) =>
          `${upcNumber}_${serialNumber}_${uniqueIdentifier}_${index}.${fileExtensions[index]}`
      );
  
      // Upload the selected images to your server
      const formData = new FormData();
      selectedAssets.forEach((asset, index) => {
        formData.append('images', {
          uri: asset.uri,
          type: asset.mediaType,
          name: fileNames[index],
        });
      });
  
      setPickedImages([...pickedImages, ...selectedAssets.map((asset) => asset.uri)]);
  
      // Perform the image upload with the formData
      // ...
    }
  };
  

  const pickImageFromCamera = async (upcNumber, serialNumber) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
  
    if (permissionResult.granted === false) {
      alert('Permission to access the camera is required!');
      return;
    }
  
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
  
    if (!result.canceled) {
      // Determine the selected asset
      const selectedAsset = result.assets[0];
  
      // Determine the file extension based on the selected image type
      const fileExtension = selectedAsset.mediaType === 'photo' ? 'jpg' : 'png';
  
      // Generate a unique identifier (e.g., a UUID)
      const uniqueIdentifier = Date.now();
  
      // Generate the file name
      const fileName = `${upcNumber}_${serialNumber}_${uniqueIdentifier}.${fileExtension}`;
  
      // Upload the selected image to your server
      const formData = new FormData();
      formData.append('image', {
        uri: selectedAsset.uri,
        type: selectedAsset.type,
        name: fileName,
      });
      setPickedImages([...pickedImages, selectedAsset.uri]);
  
      // Perform the image upload with the formData
      // ...
    }
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
                          initialValues={{codigo:'',serial:'',nombre:'',modelo:'',descripcion:'',marca:'',ubicacion:'',municipio:'',resguardante:''}}
                          onSubmit={(values,{setSubmitting}) => {
                              if(values.codigo == '' || values.serial == '' || values.nombre == '' || values.modelo == '' || values.descripcion == ''|| values.marca == ''|| values.ubicacion == '' || values.municipio == ''){
                                  handleMessage("Por favor llene todos los campos");
                                  setSubmitting(false);
                              }else{
                                  handleAdd(values, setSubmitting, pickedImages);
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
                                  inputType="UPC"
                                />

                                <MyTextInput
                                  label="Número Serial"
                                  icon="number"
                                  placeholder="1234567890"
                                  placeholderTextColor={darklight}
                                  onChangeText={handleChange('serial')}
                                  onBlur={handleBlur('serial')}
                                  value={values.serial}
                                  keyboardType="numeric"
                                  openModalScanner={openModalScanner}
                                  inputType="Número Serial" 
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
                                    label="Descripción"
                                    icon="pencil"
                                    placeholder="Con 4 patas / Respaldo..."
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('descripcion')}
                                    onBlur={handleBlur('descripcion')}
                                    value={values.descripcion}
                                    reportComment={true}
                                    isMultiline={true}
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
                {/*----------------------------- */}
                <View>
                  <StyledInputLabel>Municipio</StyledInputLabel>
                  <Picker
                    selectedValue={municipio}
                    onValueChange={(itemValue) => setMunicipio(itemValue)}
                    style={{backgroundColor:grey, padding: 15,
                        paddingLeft: 55,
                        paddingRight:55,
                        borderRadius: 5,
                        fontSize: 16,
                        height: 60,
                        marginVertical: 3,
                        marginBottom: 10,
                        color: secondary, width:'100%'}}
                  >
                    <Picker.Item label="Seleccionar Municipio" value=""/>     
                    {MunicipioOptions.map((option) => (
                      <Picker.Item label={option} value={option} key={option}   style={{
                      borderRadius: 10,color: secondary}}/>
                    ))} 
                  </Picker>
                </View>


                                <MyTextInput
                                label="Resguardante"
                                icon="person-fill"
                                placeholder="Nombre del Resguardante"
                                placeholderTextColor={darklight}
                                onChangeText={handleChange('resguardante')}
                                onBlur={handleBlur('resguardante')}
                                value={values.resguardante}
                            />

                                <StyledButton google={true} onPress={() => pickImage(upcScannedData,serialScannedData)}>
                                <Ionicons name={'images'} size={25} color={primary} />
                                    <ButtonText>  Añadir Imagenes</ButtonText>
                                </StyledButton>
                                <StyledButton google={true} onPress={() => pickImageFromCamera(upcScannedData,serialScannedData)}>
                                <Ionicons name={'camera'} size={25} color={primary} />
                                    <ButtonText>  Tomar Fotografía</ButtonText>
                                </StyledButton>

                                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                  {pickedImages.map((uri, index) => (
                                    <Image
                                      key={index}
                                      source={{ uri }}
                                      style={{ width: 100, height: 100, margin: 3 }}
                                    />
                                  ))}
                                </View>



                {useEffect(() => {
                    if (upcScannedData) {
                      setValues({ ...values, codigo: upcScannedData });
                      checkId(upcScannedData,"UPC");
                    }  
                    if (serialScannedData) {
                      checkId(serialScannedData,"Serial");
                      setValues({ ...values, serial: serialScannedData });
                    }                   
                    if (locationValue){
                        setFieldValue('ubicacion', locationValue );
                    }
                    if (brandValue){
                        setFieldValue('marca', brandValue);
                    }
                    if (scannedDataSerial1) {
                      setValues({ ...values, serial: scannedData });
                    }
                    setFieldValue('municipio',municipio);
                    if(cleanInputs){
                      setValues({
                        codigo: "",
                        serial: "",
                        nombre: "",
                        modelo: "",
                        descripcion: "",
                        marca: "",
                        ubicacion: "",
                        municipio: "",
                        resguardante: '',
                      });
                      setBrandValue("");
                      setLocationValue(""); 
                      setMunicipio(""); 
                      setCleanInputs(false);
                      setSerialScannedData("");
                    }
                }, [upcScannedData,serialScannedData,locationValue,brandValue,municipio,cleanInputs,setBrandValue,setLocationValue,setMunicipio,setCleanInputs])}

                                
                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Agregar Articulo</ButtonText>
                                </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                            </StyledFormArea>
                    )}
                        </Formik>
                        <Scanner isVisible={modalVisibleScanner} closeModal={closeModalScanner} onBarcodeScanned={(data) => handleBarcodeScanned(data, inputType)}/>
                        <Brand isVisible={modalVisibleBrand} closeModal={closeModalBrand} onBrand={handleBrand}/>
                        <Location isVisible={modalVisibleLocation} closeModal={closeModalLocation} onLocation={handleLocation}/>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
        </StyledScrollView>
    );
}

const MyTextInput = ({ label, icon, openModalScanner, inputType,isMultiline, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={30} color={secondary} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} 
          multiline={isMultiline}
          numberOfLines={isMultiline ? 4 : 1} />
      {label === 'UPC' && (
        <RightIcon onPress={() => openModalScanner('UPC')}>
          <Ionicons name={'barcode-outline'} size={30} color={secondary} />
        </RightIcon>
      )}
      {label === 'Número Serial' && (
        <RightIcon onPress={() => openModalScanner('Número Serial')}>
          <Ionicons name={'barcode-outline'} size={30} color={secondary} />
        </RightIcon>
      )}
    </View>
  );
};



export default Add;
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

//Keyboard
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

import Scanner from './../Modal/BarCodeScannerM';

import { useRoute } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary, grey}= Colors;

const Item = () => {
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();
const [modalVisibleScanner,setModalVisibleScanner] = useState(false);
const [scannedData, setScannedData] = useState(); 
const [brandValue, setBrandValue] = useState(); 
const [locationValue, setLocationValue] = useState(); 
const [dbLocationValue, setDbLocationValue] = useState([]);
const [dbBrandValue, setDbBrandValue] = useState([]);
//values from the database
const[UPC,setUPC]=useState();
const[itemName,setItemName]=useState();
const[itemModel,setItemModel]=useState();
const[itemColor,setItemColor]=useState();
const[itemDesc,setItemDesc]=useState();
const[itemCreation,setItemCreation]=useState();
const[itemBrand,setItemBrand]=useState();
const [itemLocation,setitemLocation] = useState();
const [brandPrevPicked, setBrandPrevPicked] = useState();

const route = useRoute();
const { item } = route.params;

//gets this values from the DataBase
const marcaOptions = dbBrandValue;

const ubicacionOptions = dbLocationValue;

const getLocations = async () => {
  const url = "http://192.168.1.184:8080/api/ubicaciones";

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
  const url = "http://192.168.1.184:8080/api/marcas";

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

const getAllInfo = async () => {
    const url = `http://192.168.1.184:8080/api/getArtById/${item}`;

    axios
      .get(url)
      .then((response) => {
          const result = response.data;
          const {data} = result;
            const{Num_Referencia,Nombre,Modelo,Color,Descripcion,FechaCreacion,Marca,locacion} = data;
                setUPC(Num_Referencia);
                setItemName(Nombre);
                setItemModel(Modelo);
                setItemColor(Color);
                setItemDesc(Descripcion);
                setItemCreation(FechaCreacion);
                setItemBrand(Marca);
                setitemLocation(locacion)
  }).catch((error) => {
      console.error(error);
      handleMessage("Err");
  })    
}



useEffect(() => {
  const fetchData = async () => {
    try {
      await getAllInfo();
      await getBrands();
      await getLocations();

    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, []);


const handleUpdate = (values, setSubmitting) =>{
  handleMessage(null);
  const url = "http://192.168.1.184:8080/api/addItem";
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

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>{item}</PageTitle>
                        <Formik
                          initialValues={{codigo:'',nombre:'',modelo:'',color:'',descripcion:'',marca:'',ubicacion:''}}
                          onSubmit={(values,{setSubmitting}) => {
                              if(values.codigo == '' || values.nombre == '' || values.modelo == '' || values.color == '' || values.descripcion == ''|| values.marca == ''|| values.ubicacion == ''){
                                  handleMessage("Por favor llene todos los campos");
                                  setSubmitting(false);
                              }else{
                                  handleUpdate(values,setSubmitting);
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
                                <MyTextInput
                                    label="Marca"
                                    icon="list-unordered"
                                    placeholder="Marca"
                                    placeholderTextColor={darklight}
                                    value={brandPrevPicked}
                                    updBrand={true}
                                />
                                 <RightIcon /*onPress={}*/>
                                    <Ionicons name={'chevron-forward-outline'} size={30} color={secondary} />
                                </RightIcon>
                                </View>

                                <View>
                                <MyTextInput
                                    label="Ubicación"
                                    icon="list-unordered"
                                    placeholder="Ubicacion"
                                    placeholderTextColor={darklight}
                                    value={itemLocation}
                                    updBrand={true}
                                />

                                <RightIcon /*onPress={}*/>
                                    <Ionicons name={'chevron-forward-outline'} size={30} color={secondary} />
                                </RightIcon>
                                </View>


                {/* <View>
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
                        color: secondary, width:'100%'}}
                  >

                    <Picker.Item label='Seleccione una Marca' value=""/>      

                    {marcaOptions.map((option) => (
                      <Picker.Item label={option} value={option} key={option}   style={{
                      borderRadius: 10,color: secondary}}/>
                    ))}
                  </Picker>
                </View> */}
{/*_________________________________ */}
                {/* <View>
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
                        color: secondary, width:'100%'}}
                  >
                    <Picker.Item label="Seleccionar Ubicación" value=""/>      

                    {ubicacionOptions.map((option) => (
                      <Picker.Item label={option} value={option} key={option}   style={{
                      borderRadius: 10,color: secondary}}/>
                    ))}
                  </Picker>
                </View> */}

                {useEffect(() => {
                   if (UPC) {
                    setValues({
                      ...values,
                      codigo: UPC,
                      nombre: itemName,
                      modelo: itemModel,
                      color: itemColor,
                      descripcion: itemDesc,
                      ubicacion: itemLocation
                    });
                    console.log(itemLocation);
                  }
                    if (locationValue){
                        setFieldValue('ubicacion', locationValue );
                    }
                    if (brandValue){
                        setFieldValue('marca', brandValue);
                    }
                      setBrandPrevPicked(marcaOptions[((itemBrand-1))]);
                }, [UPC,itemName,itemModel,itemColor,itemDesc,locationValue,brandValue,itemBrand,marcaOptions,itemLocation])}

                                
                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Actualizar</ButtonText>
                                </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                            </StyledFormArea>
                    )}
                        </Formik>
                        <Scanner isVisible={modalVisibleScanner} closeModal={closeModalScanner} onBarcodeScanned={handleBarcodeScanned}/>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
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

export default Item;
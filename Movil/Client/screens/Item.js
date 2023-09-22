import React, {useState, useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';

//formik
import {Formik} from 'formik';

//icons
import {Octicons, Ionicons} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View,ActivityIndicator,Alert} from 'react-native';
import CredentialsContext from './../components/CredentialsContext';

//Keyboard
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

import Scanner from './../Modal/BarCodeScannerM';
import Selector from '../Modal/Selector';

import { useRoute } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary, grey}= Colors;

const Item = () => {
const ip = 'http://192.168.1.187:8080/api';
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
const [itemUsr, setItemUsr] = useState();
const [itemStatus, setItemStatus] = useState();
//to use the selector modal
const [selector, setSelector] = useState('');
const [modalVisibleSelector,setModalVisibleSelector] = useState(false);
const [selectorPicked, setSelectorPicked] = useState('');
const [hasRunEffect, setHasRunEffect] = useState(false);
const [comentary,setComentary] = useState('');

const route = useRoute();
const { item } = route.params;
const {runEffect} = route.params;

const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext); 
const {email} = storedCredentials;

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

const getAllInfo = async () => {
    const url = ip+`/getArtById/${item}`;

    axios
      .get(url)
      .then((response) => {
          const result = response.data;
          const {data} = result;
            const{Num_Referencia,Nombre,Modelo,Color,Descripcion,FechaCreacion,Marca,locacion,usuario,estado} = data;
                setUPC(Num_Referencia);
                setItemName(Nombre);
                setItemModel(Modelo);
                setItemColor(Color);
                setItemDesc(Descripcion);
                setItemCreation(FechaCreacion);
                setItemBrand(Marca);
                setitemLocation(locacion);
                setItemUsr(usuario);
                setItemStatus(estado);
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
  const url = ip+"/addReport";
  const updValues = {
    UPC: values.codigo,
    ubicacion: values.ubicacion,
    comentario: comentary,
    accion: 'Actualización',
    usuario: email
  };
  axios
      .post(url,updValues)
      .then((response) => {
          const result = response.data;
          const {message,status} = result;

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

  const openModalSelector = () => {
    setModalVisibleSelector(true);
  };

  const closeModalSelector = () => {
    setModalVisibleSelector(false);
  };

  const handleSelector = (data) => {
    setSelectorPicked(data);
  };
  const handleComentary = (data) => {
    setComentary(data); //comentary of why the locatio was changed
  };

  const handleDisable = () =>{
    console.log("Se")
  }

  const disableAlert = () => {
    Alert.alert('Cuidado!', 'Un administrador debera aceptar su solicitud de baja para este articulo, ¿Esta usted seguro de dar de baja este articulo? Una vez ejecutado el cambio no se podra revertir.', [
      {
        text: 'Cancelar',
      },
      {
        text: 'Enviar Baja',
        onPress: () => handleDisable(),
      }
    ]);
  }


    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark"/>
                <InnerContainer>
                    <PageTitle>{item}</PageTitle>
                    <RightIcon >
                    <Octicons name={'location'}size={30} color={secondary}/>
                </RightIcon>
                        <Formik
                          initialValues={{codigo:'',nombre:'',modelo:'',color:'',descripcion:'',marca:'',ubicacion:'',fechaCreacion:'',creadoPor:'',estado:''}}
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
                                    readOnly
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
                                    readOnly
                                />

                                <MyTextInput
                                    label="Color"
                                    icon="list-unordered"
                                    placeholder="Indigo"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('color')}
                                    onBlur={handleBlur('color')}
                                    value={values.color}
                                    readOnly
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
                                    value={values.marca = brandPrevPicked}
                                    onChangeText={handleChange('marca')}
                                    onBlur={handleBlur('marca')}
                                    readOnly
                                />
                                 {/*<RightIcon onPress={() => {setSelector('marcas'); openModalSelector()}}>
                                    <Ionicons name={'chevron-forward-outline'} size={30} color={secondary} />
                            </RightIcon>*/}
                                </View>

                                <View>
                                <MyTextInput
                                    label="Ubicación"
                                    icon="list-unordered"
                                    placeholder="Ubicacion"
                                    placeholderTextColor={darklight}
                                    value={values.ubicacion =(selectorPicked !== '')? selectorPicked : itemLocation}
                                    updBrand={true}
                                    onChangeText={handleChange('ubicacion')}
                                    onBlur={handleBlur('ubiacion')}
                                    readOnly
                                />

                                <RightIcon onPress={() => {setSelector('ubicaciones');openModalSelector()}}>
                                    <Ionicons name={'chevron-forward-outline'} size={30} color={secondary} />
                                </RightIcon>
                                </View>

                                <MyTextInput
                                    label="Fecha de Creación"
                                    icon="calendar"
                                    placeholder="Fecha"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('fechaCreacion')}
                                    onBlur={handleBlur('fechaCreacion')}
                                    value={values.fechaCreacion}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Creado Por"
                                    icon="person-fill"
                                    placeholder="Howard García"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('creadoPor')}
                                    onBlur={handleBlur('creadoPor')}
                                    value={values.creadoPor}
                                    readOnly
                                />

                                  <MyTextInput
                                    label="Estado"
                                    icon="unverified"
                                    placeholder="Activo"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('estado')}
                                    onBlur={handleBlur('estado')}
                                    value={values.estado}
                                    readOnly
                                />
                                

                {useEffect(() => {
                //  if (!hasRunEffect) {
                    if (UPC) {
                      setValues({
                        ...values,
                        codigo: UPC,
                        nombre: itemName,
                        modelo: itemModel,
                        color: itemColor,
                        descripcion: itemDesc,
                        ubicacion: itemLocation,
                        fechaCreacion: itemCreation,
                        creadoPor: itemUsr,
                        estado: itemStatus
                      });
                    }   
                //  }
                    if (locationValue){
                        setFieldValue('ubicacion', locationValue );
                    }
                    if (brandValue){
                        setFieldValue('marca', brandValue);
                    }
                   //r setHasRunEffect(true);
                      setBrandPrevPicked(marcaOptions[((itemBrand-1))]);
                }, [hasRunEffect, UPC, itemName, itemModel, itemColor, itemDesc, locationValue, brandValue, itemBrand, marcaOptions, itemLocation, itemUsr, itemStatus])}

                                
                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Actualizar</ButtonText>
                                </StyledButton>}

                                {!isSubmitting && <StyledButton onPress={disableAlert} disable={true}>
                                    <ButtonText>Dar de Baja</ButtonText>
                                </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                            </StyledFormArea>
                    )}
                        </Formik>
                        <Scanner isVisible={modalVisibleScanner} closeModal={closeModalScanner} onBarcodeScanned={handleBarcodeScanned}/>
                        <Selector isVisible={modalVisibleSelector} closeModal={closeModalSelector} onSelector={handleSelector} action={selector} onComentary={handleComentary}/>
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
                <RightIcon >{/*onPress={openModalScanner}*/}
                    <Ionicons name={'barcode-outline'}size={30} color={darklight}/>
                </RightIcon>
            )}
        </View>
    );
}

export default Item;
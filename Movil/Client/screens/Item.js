import React, {useState, useContext,useEffect} from 'react';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

//formik
import {Formik} from 'formik';

// Datetimepicker
import DateTimePicker from '@react-native-community/datetimepicker';

//icons
import {Octicons, Ionicons} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {View,ActivityIndicator,Alert,Image,TouchableOpacity} from 'react-native';
import CredentialsContext from './../components/CredentialsContext';

//Keyboard
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

import Scanner from './../Modal/BarCodeScannerM';
import Selector from '../Modal/Selector';
import LocationHistory from '../Modal/LocationHostory';
import Disable from '../Modal/Disable';

import { useRoute } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary, grey}= Colors;

const Item = () => {
const ip = 'http://192.168.1.187:8080/api';
const imageIP = 'http://192.168.1.187:8080/images/';
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
const[serial,setSerial]=useState();
const[itemName,setItemName]=useState();
const[itemModel,setItemModel]=useState();
const[itemDesc,setItemDesc]=useState();
const[itemCreation,setItemCreation]=useState();
const[itemBrand,setItemBrand]=useState();
const [itemLocation,setitemLocation] = useState();
const [itemMunicipio,setitemMunicipio] = useState();
const [brandPrevPicked, setBrandPrevPicked] = useState();
const [itemUsr, setItemUsr] = useState();
const [itemStatus, setItemStatus] = useState();
const [resguardante, setResguardante] = useState();
const [motivo, setMotivo] = useState();
//to use the selector modal
const [selector, setSelector] = useState('');
const [modalVisibleSelector,setModalVisibleSelector] = useState(false);
const [modalVisibleLocationHistory,setModalVisibleLocationHistory] = useState(false);
const [comentary,setComentary] = useState('');
const [ubicacionSelectorPicked, setUbicacionSelectorPicked] = useState('');
const [municipioSelectorPicked, setMunicipioSelectorPicked] = useState('');

//to know if the locations was updated or not
const [ubicacionModified, setUbicacionModified] = useState(false);
const [isButtonClicked, setIsButtonClicked] = useState(false);

const [modalVisibleDisable,setModalVisibleDisable] = useState(false);

const [fechaComfirmacion, setFechaComfirmacion] = useState();
const [show, setShow] = useState(false);
const [date, setDate] = useState(new Date(2000, 0, 1));

const route = useRoute();
const { item } = route.params;
//values sent from DisableItems
const {UPCDisable, baja, history} = route.params;

//store the image names
const [imageNames , setImageNames] = useState([]);

const {storedCredentials, setStoredCredentials} = useContext(CredentialsContext); 
const {email} = storedCredentials;

//gets this values from the DataBase
const marcaOptions = dbBrandValue;

const ubicacionOptions = dbLocationValue;
//format the date
function formatSpanishDate(inputDateString) {
  const date = new Date(inputDateString);

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  };

  return date.toLocaleString('es-ES', options);
}

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
    const url = ip+`/getArtById/${item || UPCDisable}`;

    axios
      .get(url)
      .then((response) => {
          const result = response.data;
          const {data} = result;
            const{Num_Referencia,NSerial,Nombre,Modelo,Descripcion,FechaCreacion,Marca,locacion,Municipio,usuario,estado,images,Resguardante} = data;
                setUPC(Num_Referencia);
                setSerial(NSerial);
                setItemName(Nombre);
                setItemModel(Modelo);
                setItemDesc(Descripcion);
                setItemCreation(formatSpanishDate(FechaCreacion));
                setItemBrand(Marca);
                setitemLocation(locacion);
                setitemMunicipio(Municipio);
                setItemUsr(usuario);
                setItemStatus(estado);
                setImageNames(images);
                setResguardante(Resguardante);
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
  setUbicacionModified(false);
}, []);


const handleUpdate = (values, setSubmitting) =>{
  handleMessage(null);
  const url = ip+"/addReport";
  const updValues = {
    UPC: values.codigo,
    ubicacion: values.ubicacion,
    municipio: values.municipio,
    comentario: comentary,
    accion: 'Actualización',
    usuario: email
  };
  console.log(updValues);
  axios
      .post(url,updValues)
      .then((response) => {
          const result = response.data;
          const {message,status} = result;

          if (status !== 'SUCCESS'){
              handleMessage(message,status);
          }else{
            handleMessage(message,status);
            setIsButtonClicked(true);// so you cant just spamm the update button
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
  const openModalLocationHistory = () => {
    setModalVisibleLocationHistory(true);
  };
  const closeModalLocationHistory = () => {
    setModalVisibleLocationHistory(false);
  };

 const handleSelector = (data) => {
  if (selector === 'ubicaciones') {
    setUbicacionSelectorPicked(data);
  } else if (selector === 'Municipio') {
    setMunicipioSelectorPicked(data);
  }

};

  const handleComentary = (data) => {
    setComentary(data); //comentary of why the locatio was changed
  };

  const disableAlert = () => {
    Alert.alert('Cuidado!', 'Un administrador debera aceptar su solicitud de baja para este articulo, ¿Esta usted seguro de dar de baja este articulo? Una vez ejecutado el cambio no se podra revertir.', [
      {
        text: 'Cancelar',
      },
      {
        text: 'Proceder',
        onPress: () => openModalDisable(),
      }
    ]);
  }
  
  const disableReport = (issue) =>{
    handleMessage(null);
    const url = ip+"/addReport";
    const updValues = {
      UPC: UPC,
      ubicacion: itemLocation,
      municipio: itemMunicipio,
      comentario: issue,
      accion: 'Petición de Baja',
      usuario: email
    };
    console.log(updValues);
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
  
    }).catch((error) => {
        console.error(error);
        handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
    })    
  }

  const handleSelectorChange = (newValue) => {
    setUbicacionModified(true); 
  };

  //disable modal
  const openModalDisable = () => {
    setModalVisibleDisable(true);
  };

  const closeModalDisable = () => {
    setModalVisibleDisable(false);
  };

  const handleModalDisable = (value) => {
    console.log("this is the value:" ,value);
      disableReport(value)
    setModalVisibleDisable(false);
  };
  
  const showDatePicker = () => {
    setShow('date');
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
    setFechaComfirmacion(currentDate);
  };

  const getMotivo = () =>{
    handleMessage(null);
    const url = `${ip}/getMotiveDisable/${UPC}`;
    axios
        .get(url)
        .then((response) => {
            const result = response.data;

            setMotivo(result.comentario);

    }).catch((error) => {
        console.error(error);
        setSubmitting(false);
        handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
    })    
  }

  const defenitiveBaja = () =>{
    console.log("am i here?")
    handleMessage(null);
    const url = ip+"/disableItem/2";
    const updValues = {
      UPC: UPC,
      comentario: motivo,
      comfirmedDate: fechaComfirmacion
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
  
    }).catch((error) => {
        console.error(error);
        handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
    })    
  }

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
            <StatusBar style="light" backgroundColor={secondary} />
                <InnerContainer>
                    <PageTitle>{item || UPCDisable}</PageTitle>
                    <RightIcon onPress={openModalLocationHistory}>
                    <Octicons name={'location'}size={30} color={secondary}/>
                </RightIcon>
                {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={onChange}
              style={{
                backgroundColor: 'yellow',
              }}
            />
          )}
                        <Formik
                          initialValues={{codigo:'',serial:'',nombre:'',modelo:'',descripcion:'',marca:'',ubicacion:'',fechaCreacion:'',creadoPor:'',estado:'',municipio:'',fechaComfirmacion:'',resguardante:'',motivo:''}}
                          onSubmit={(values,{setSubmitting}) => {
                            values = { ...values, fechaComfirmacion:  fechaComfirmacion};
                              if(values.codigo == '' || values.nombre == '' || values.modelo == '' || values.descripcion == ''|| values.marca == ''|| values.ubicacion == ''){
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
                                    label="Número de Inventario"
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
                                    label="Número Serial"
                                    icon="number"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('serial')}
                                    onBlur={handleBlur('serial')}
                                    value={values.serial}
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
                                    readOnly
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
                                    label="Descripción"
                                    icon="pencil"
                                    placeholder="Con 4 patas / Respaldo..."
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('descripcion')}
                                    onBlur={handleBlur('descripcion')}
                                    value={values.descripcion}
                                    reportComment={true}
                                    isMultiline={true}
                                    readOnly
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
                                  value={values.ubicacion = (ubicacionSelectorPicked !== '') ? ubicacionSelectorPicked : itemLocation}
                                  onChangeText={(text) => {
                                    setUbicacionSelectorPicked(text);
                                    handleChange('ubicacion')(text);
                                  }}
                                  onBlur={handleBlur('ubicacion')}
                                  readOnly
                                />

                                {!baja &&
                                <RightIcon onPress={() => {setSelector('ubicaciones');openModalSelector()}}>
                                    <Ionicons name={'chevron-forward-outline'} size={30} color={secondary} />
                                </RightIcon>
                                }
                                </View>
                                

                                <View>
                                <MyTextInput
                                  label="Municipio"
                                  icon="list-unordered"
                                  placeholder="Municipio"
                                  placeholderTextColor={darklight}
                                  value={values.municipio = (municipioSelectorPicked !== '') ? municipioSelectorPicked : itemMunicipio}
                                  onChangeText={(text) => {
                                    setMunicipioSelectorPicked(text);
                                    handleChange('municipio')(text);
                                  }}
                                  onBlur={handleBlur('municipio')}
                                  readOnly
                                />

                                {!baja &&
                                <RightIcon onPress={() => {setSelector('Municipio');openModalSelector()}}>
                                    <Ionicons name={'chevron-forward-outline'} size={30} color={secondary} />
                                </RightIcon>
                                }
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
                                    reportComment={true}
                                    isMultiline={true}
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
                                    reportComment={true}
                                    isMultiline={true}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Resguardante"
                                    icon="person-fill"
                                    placeholder="Nombre del Resguardante"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('resguardante')}
                                    onBlur={handleBlur('resguardante')}
                                    value={values.resguardante}
                                    readOnly
                                />


                              {baja && //this is so they can add the date in which mexicali comfirmed the "baja"
                                  
                                    <MyTextInput
                                        label="Motivo de la Baja"
                                        icon="comment"
                                        placeholder="Motivo"
                                        placeholderTextColor={darklight}
                                        onChangeText={handleChange('motivo')}
                                        onBlur={handleBlur('motivo')}
                                        value={values.motivo}
                                        readOnly
                                    />}
                                 {baja && !history &&
                                 <MyTextInput
                                 label="Agregar Fecha de comfirmación"
                                 icon="calendar"
                                 placeholder="YYYY - MM - DD"
                                 placeholderTextColor={darklight}
                                 onChangeText={handleChange('fechaComfirmacion')}
                                 onBlur={handleBlur('fechaComfirmacion')}
                                 value={fechaComfirmacion ? fechaComfirmacion.toDateString() : ''}
                                 editable={false}
                                 isDate={true}
                                 showDatePicker={showDatePicker}
                                />
                              }
                                

                {useEffect(() => {
                //  if (!hasRunEffect) {
                    if (UPC) {
                      setValues({
                        ...values,
                        codigo: UPC,
                        serial: serial,
                        nombre: itemName,
                        modelo: itemModel,
                        descripcion: itemDesc,
                        ubicacion: itemLocation,
                        municipio: itemMunicipio,
                        fechaCreacion: itemCreation,
                        creadoPor: itemUsr,
                        estado: itemStatus,
                        resguardante: resguardante
                      });
                    }   
                //  }
                if(baja){
                  getMotivo();
                  setValues({ ...values, codigo: UPC,
                    serial: serial,
                    nombre: itemName,
                    modelo: itemModel,
                    descripcion: itemDesc,
                    ubicacion: itemLocation,
                    municipio: itemMunicipio,
                    fechaCreacion: itemCreation,
                    creadoPor: itemUsr,
                    estado: itemStatus,
                    resguardante: resguardante,motivo: motivo});
                }
                    if (locationValue){
                        setFieldValue('ubicacion', locationValue );
                    }
                    if (brandValue){
                        setFieldValue('marca', brandValue);
                    }
                   //r setHasRunEffect(true);
                      setBrandPrevPicked(marcaOptions[((itemBrand-1))]);
                }, [motivo,resguardante, UPC,serial, itemName, itemModel, itemDesc, locationValue, brandValue, itemBrand, marcaOptions, itemLocation, itemUsr, itemStatus,itemMunicipio])}

                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                      {imageNames.map((imageName, index) => (
                                        <Image
                                          key={index}
                                          source={{ uri: `${imageIP}${imageName}` }}
                                          style={{ width: 100, height: 100, margin: 3 }}
                                        />
                                      ))}
                                    </View>

                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && !isButtonClicked && !baja &&(
                                  <StyledButton onPress={handleSubmit} disabled={!ubicacionModified}>
                                    <ButtonText>Actualizar</ButtonText>
                                  </StyledButton>
                                )}

                                {!isSubmitting && !baja && <StyledButton onPress={disableAlert} disable={true}>
                                    <ButtonText>Dar de Baja</ButtonText>
                                </StyledButton>}

                                  {!isSubmitting && baja && !history &&<StyledButton onPress={defenitiveBaja} disable={true}>
                                  <ButtonText>Comfirmar Baja</ButtonText>
                              </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                    
                                </StyledButton>}

                            </StyledFormArea>
                    )}
                        </Formik>
                        <Scanner isVisible={modalVisibleScanner} closeModal={closeModalScanner} onBarcodeScanned={handleBarcodeScanned}/>
                        <Selector isVisible={modalVisibleSelector} closeModal={closeModalSelector} onSelector={handleSelector} action={selector} onComentary={handleComentary} onSelectorChange={handleSelectorChange}/>
                        <LocationHistory isVisible={modalVisibleLocationHistory} closeModal={closeModalLocationHistory}  action={UPC}/>
                        <Disable isVisible={modalVisibleDisable} closeModal={closeModalDisable} onDisable={handleModalDisable}/>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label, icon,openModalScanner,isMultiline, isDate, showDatePicker, ...props}) =>{
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={secondary}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            
            {isDate ? (
        <TouchableOpacity onPress={showDatePicker}>
          <StyledTextInput {...props} />
        </TouchableOpacity>
      ) : (
        <StyledTextInput {...props} multiline={isMultiline} numberOfLines={isMultiline ? 4 : 1} />
      )}
      

            {label == 'UPC' && (
                <RightIcon >{/*onPress={openModalScanner}*/}
                    <Ionicons name={'barcode-outline'}size={30} color={darklight}/>
                </RightIcon>
            )}
              {label == 'Número Serial' && (
                <RightIcon >{/*onPress={openModalScanner}*/}
                    <Ionicons name={'barcode-outline'}size={30} color={darklight}/>
                </RightIcon>
            )}

        </View>
    );
}

export default Item;
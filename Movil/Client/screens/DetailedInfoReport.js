import React, {useState, useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import axios from 'axios';
//formik
import {Formik} from 'formik';

//icons
import {Octicons, Ionicons} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, StyledButton, ButtonText, Colors,MsgBox,
        } from './../components/styles';

import {View,ActivityIndicator,Alert,Image,TouchableOpacity} from 'react-native';
import CredentialsContext from './../components/CredentialsContext';

//Keyboard
import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
//Image Modal
import Images from '../Modal/Images';

const {tertiary, darklight,secondary, primary, grey}= Colors;

const Item = () => {
const ip = 'http://192.168.1.187:8080/api';
const imageIP = 'http://192.168.1.187:8080/images/';
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();
const [report, setReport] = useState({});

//values from the database
const[accion,setAccion]=useState();
const[fechaCreacion,setFechaCreacion]=useState();
const[fechaAprobacion,setfechaAprobacion]=useState();
const[estatus,setEstatus]=useState();
const[usuario,setUsuario]=useState();
const[articulo,setArticulo]=useState();
const[ubicacion,setUbicacion]=useState();
const[comentario,setComentario]=useState();
const [municipio,setMunicipio] = useState();
const [marca, setMarca] = useState();
const [modelo,setModelo] = useState();
const [resguardante,setResguardante] = useState();
const [UPC,setUPC] = useState();
const [serial,setSerial] = useState();
//store the image names
const [imageNames , setImageNames] = useState([]);
const [selectedImage, setSelectedImage] = useState(null);
const [modalImagesVisible, setModalImagesVisible] = useState(false);

const navigation = useNavigation();

const handleImageClick = (imageName) => {
  setSelectedImage(imageName);
  setModalImagesVisible(true);
};

const openModalImages = () => {
  setModalImagesVisible(true);
}

const closeModalImages = () => {
  setModalImagesVisible(false);
  setSelectedImage(null);
};
const route = useRoute();
const { reportNumber,history } = route.params;

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


const getReport = async () => {
    const url = ip+`/getReportById/${reportNumber}`;
    try {
      const response = await axios.get(url);
      const reportObj = response.data;

      setAccion(reportObj[0].Accion);
      setFechaCreacion(formatSpanishDate(reportObj[0].FechaCreacion));
      setfechaAprobacion(formatSpanishDate(reportObj[0].FechaAprobacion));
      setEstatus(reportObj[0].EstatusRep);
      setUsuario(reportObj[0].Usuario);
      setArticulo(reportObj[0].Articulo);
      setMarca(reportObj[0].Marca);
      setModelo(reportObj[0].Modelo);
      setResguardante(reportObj[0].Resguardante);
      setUbicacion(reportObj[0].Ubicacion);
      setMunicipio(reportObj[0].Municipio);
      setComentario(reportObj[0].Motivo);
      setUPC(reportObj[0].UPC)
      setSerial(reportObj[0].Serial)
      setImageNames(reportObj[0].images);

    } catch (error) {
      console.error("Error fetching:", error);
    }
  }

  const handleUpdate = (values, setSubmitting) =>{
    handleMessage(null);
    const url = ip+"/updItem";
    const updValues = {
      UPC: UPC,
      ubicacion: ubicacion,
      comentario: comentario,
      reporte:reportNumber,
      municipio: municipio
    };
    axios
        .put(url,updValues)
        .then((response) => {
            const result = response.data;
            const {message,status} = result;
  
            if (status !== 'SUCCESS'){
                handleMessage(message,status);
                setSubmitting(false);

            }else{
              handleMessage(message,status);
              setSubmitting(false);
              navigation.navigate('Reportes');
            }
             setSubmitting(false);
  
    }).catch((error) => {
        console.error("Yo? ",error);
        setSubmitting(false);
        handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
    })    
  }

  const proceedBaja = (setSubmitting) =>{
    handleMessage(null);
    const url = ip+"/disableItem/1";
    const updValues = {
      UPC: UPC,
      comentario: comentario,
      reporte:reportNumber
    };
    axios
        .post(url,updValues)
        .then((response) => {
            const result = response.data;
            const {message,status} = result;
  
            if (status !== 'SUCCESS'){
                handleMessage(message,status);
                setSubmitting(false);
                navigation.navigate('Reportes');

            }else{
              handleMessage(message,status);
              setSubmitting(false);

            }
             setSubmitting(false);
  
    }).catch((error) => {
        console.error("got an error fam: ",error);
        setSubmitting(false);
        handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
    })    
  }

const handleMessage = (message,type = 'FAIL') => {
    setMessage(message);
    setMessageType(type);
}

  const disableAlert = (setSubmitting) => {
    Alert.alert('Cuidado!', 'Esta apunto de aceptar el cambio, ¿Esta seguro?', [
      {
        text: 'Cancelar',
        onPress: () => setSubmitting(false)
      },
      {
        text: 'Aceptar',
        onPress: () => (accion == 'Actualización') ? handleUpdate(setSubmitting) : proceedBaja(setSubmitting)
      }
    ]);
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
          await getReport();
        } catch (error) {
          console.error(error);
        }
      };
    
      fetchData();  },[]);

      const dismissAlert = () => {
        Alert.alert('Cuidado!', 'Esta apunto de rechazar el cambio, ¿Esta seguro?', [
          {
            text: 'Cancelar',
            onPress: () => setSubmitting(false)
          },
          {
            text: 'Aceptar',
            onPress: () => handleRejection()
          }
        ]);
      }
    

    const handleRejection = () => {
      handleMessage(null);
    const url = `${ip}/removeReport`;
    const updValues = {
      reporte:reportNumber
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
              navigation.navigate('Reportes');
            }
  
    }).catch((error) => {
        console.error("got an error fam: ",error);
        handleMessage("Ocurrió un error, checa tu conexión y vuelve a intentarlo");
    })    
    }


    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
            <StatusBar style="light" backgroundColor={secondary} />
                <InnerContainer>
                    <PageTitle>Información</PageTitle>
                        <Formik
                          initialValues={{accion:'',FechaCreacion:'',FechaAprobacion:'',estatus:'',articulo:'',ubicacion:'',municipio:'',comentario:''}}
                          onSubmit={(values,{setSubmitting}) => {
                            disableAlert(setSubmitting);
                          }}>
                             {
                        ({handleChange, handleBlur, handleSubmit, values, isSubmitting,setValues,setFieldValue}) => 
                            (<StyledFormArea>
                                <MyTextInput
                                    label="Accion que se Quiere Hacer"
                                    icon="play"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('accion')}
                                    onBlur={handleBlur('accion')}
                                    value={accion}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Fecha de Creación"
                                    icon="calendar"
                                    placeholder="Pendiente"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('FechaCreacion')}
                                    onBlur={handleBlur('FechaCreacion')}
                                    value={fechaCreacion}
                                    readOnly
                                    reportComment={true}
                                    isMultiline={true}
                                />

                                <MyTextInput
                                    label="Fecha de Revisión"
                                    icon="calendar"
                                    placeholder="Pendiente"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('FechaAprobacion')}
                                    onBlur={handleBlur('FechaAprobacion')}
                                    value={fechaAprobacion}
                                    readOnly
                                    reportComment={true}
                                    isMultiline={true}
                                />

                                <MyTextInput
                                    label="Estatus"
                                    icon="question"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('estatus')}
                                    onBlur={handleBlur('estatus')}
                                    value={estatus}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Usuario"
                                    icon="person-fill"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('usuario')}
                                    onBlur={handleBlur('usuario')}
                                    value={usuario}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Articulo"
                                    icon="list-unordered"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('articulo')}
                                    onBlur={handleBlur('articulo')}
                                    value={articulo}
                                    readOnly
                                />

                                  <MyTextInput
                                    label="Número de Inventario"
                                    icon="list-unordered"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('articulo')}
                                    onBlur={handleBlur('articulo')}
                                    value={UPC}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Número Serial"
                                    icon="list-unordered"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('articulo')}
                                    onBlur={handleBlur('articulo')}
                                    value={serial}
                                    readOnly
                                />
                                
                                  <MyTextInput
                                    label="Marca"
                                    icon="list-unordered"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('articulo')}
                                    onBlur={handleBlur('articulo')}
                                    value={marca}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Modelo"
                                    icon="list-unordered"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('articulo')}
                                    onBlur={handleBlur('articulo')}
                                    value={modelo}
                                    readOnly
                                />
                                      <MyTextInput
                                    label="Resguardante"
                                    icon="list-unordered"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('articulo')}
                                    onBlur={handleBlur('articulo')}
                                    value={resguardante}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Ubicación En Cuestion"
                                    icon="location"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('ubicacion')}
                                    onBlur={handleBlur('ubicacion')}
                                    value={ubicacion}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Municipio"
                                    icon="home"
                                    placeholder="Playas de Rosarito"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('municipio')}
                                    onBlur={handleBlur('municipio')}
                                    value={municipio}
                                    readOnly
                                />

                                <MyTextInput
                                    label="Motivo de la Solicitud"
                                    icon="comment"
                                    placeholder="1234567890"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('comentario')}
                                    onBlur={handleBlur('comentario')}
                                    value={comentario}
                                    readOnly
                                    reportComment={true}
                                    isMultiline={true}
                                />

                                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {imageNames.map((imageName, index) => (
                                          <TouchableOpacity key={index} onPress={() => {openModalImages(),handleImageClick(imageName)}}>
                                            <Image
                                              source={{ uri: `${imageIP}${imageName}` }}
                                              style={{ width: 100, height: 100, margin: 3 }}
                                            />
                                          </TouchableOpacity>
                                        ))}
                                    </View>
                                
                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && !history && <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Aceptar</ButtonText>
                                </StyledButton>}

                                { !history && <StyledButton onPress={dismissAlert} disable={true}>
                                    <ButtonText>Rechazar</ButtonText>
                                </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                            </StyledFormArea>
                    )}
                        </Formik>
                        <Images modalImagesVisible={modalImagesVisible} closeModalImages={closeModalImages} imageIP={imageIP} selectedImage={selectedImage}/>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const MyTextInput = ({label, icon,isMultiline, ...props}) =>{
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={secondary}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}
            multiline={isMultiline} // Use the multiline prop
            numberOfLines={isMultiline ? 4 : 1} // Set the number of lines
            />
        </View>
    );
}

export default Item;
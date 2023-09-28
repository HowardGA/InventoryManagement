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

import { useRoute } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary, grey}= Colors;

const Item = () => {
const ip = 'http://192.168.1.187:8080/api';
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

const route = useRoute();
const { reportID } = route.params;

const getReport = async () => {
    const url = ip+`/getReportById/${reportID.id}`;
    try {
      const response = await axios.get(url);
      const reportObj = response.data;
      console.log(reportObj);
      setAccion(reportObj.Accion);
      setFechaCreacion(reportObj.FechaCreacion);
      setfechaAprobacion(reportObj.FechaAprobacion);
      setEstatus(reportObj.Estatus);
      setUsuario(reportObj.Usuario);
      setArticulo(reportObj.Articulo);
      setUbicacion(reportObj.Ubicacion);
      setMunicipio(reportObj.Municipio);
      setComentario(reportObj.Comentario);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }

  const handleUpdate = (values, setSubmitting) =>{
    handleMessage(null);
    const url = ip+"/updItem";
    const updValues = {
      UPC: articulo,
      ubicacion: ubicacion,
      comentario: comentario,
      reporte:reportID.id
    };
    axios
        .put(url,updValues)
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

  const disableAlert = (setSubmitting) => {
    Alert.alert('Cuidado!', 'Esta apunto de aceptar el cambio, ¿Esta seguro?', [
      {
        text: 'Cancelar',
        
      },
      {
        text: 'Aceptar',
        onPress: () => handleUpdate(),
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

    const handleRejection = () => {

    }


    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark"/>
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
                                />

                                <MyTextInput
                                    label="Fecha de Revisión"
                                    icon="calendar"
                                    placeholder="-"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('FechaAprobacion')}
                                    onBlur={handleBlur('FechaAprobacion')}
                                    value={fechaAprobacion}
                                    readOnly
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

                                
                                <MsgBox type={messageType}>{message}</MsgBox>

                                {!isSubmitting && <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Aceptar</ButtonText>
                                </StyledButton>}

                                {!isSubmitting && <StyledButton onPress={handleRejection} disable={true}>
                                    <ButtonText>Rechazar</ButtonText>
                                </StyledButton>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                            </StyledFormArea>
                    )}
                        </Formik>
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
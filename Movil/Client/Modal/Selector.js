import React, { useState, useEffect } from 'react';
import { Modal, View,ActivityIndicator,StyleSheet,TouchableOpacity} from 'react-native';
import axios from 'axios';

import{StyledContainer,MsgBox,LeftIcon,InnerContainer,SubTitle,StyledInputLabel,StyledFormArea,StyledButton, ButtonText, Colors,BarCodeScannerV,PageTitle,StyledTextInput} from '../components/styles';

import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';

import {Octicons} from '@expo/vector-icons'

const {tertiary, darklight,secondary, primary,grey}= Colors;

const Selector = ({ isVisible, closeModal, onSelector,action,onComentary,onSelectorChange}) => {
  const ip = 'http://192.168.1.187:8080/api';
    const [message,setMessage] = useState();
    const [messageType,setMessageType] = useState();
    const [dbSelectorValue, setDbSelectorValue] = useState([]);
    const [selectorValue, setSelectorValue] = useState(); 
    const [municipioValues , setMunicipioValues] = useState([]);

    const selectorOptions = dbSelectorValue;
    const arrayMunicipios = ['Playas de Rosarito','Tijuana','Tecate','Ensenada','Mexicali'];

    console.log(action);

    const getSelector = async () => {
      const url = ip + `/${action}`;
        axios
  .get(url)
  .then((response) => {
      const result = response.data;
        
        // Use map to conditionally select Lugar or Nombre based on action
        const resultArray = result.map((item) => {
          return action === 'ubicaciones' ? item.Lugar : item.Nombre;
        });
        setDbSelectorValue(resultArray);
      }).catch ((error) => {
        console.error(error);
        handleMessage("Err");
      })  
      }

    useMunicipios = () => {
      setMunicipioValues(arrayMunicipios);
    }

    const handleSelector = (values,setSubmitting) => {
        onSelector(selectorValue);
        console.log(values);
        onComentary(values.comentario);
        closeModal();
        setSubmitting(false);
        onSelectorChange(selectorValue);
    }

    const handleMessage = (message,type = 'FAIL') => {
        setMessage(message);
        setMessageType(type);
    }
    useEffect(() => {
      if (isVisible && action == 'ubicaciones') {
        getSelector();
      }else{
        useMunicipios();
      }
    }, [isVisible]);

    return (
      (action == 'ubicaciones') ? (
        <Modal visible={isVisible} transparent animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Octicons name="x" size={30} color={secondary} />
          </TouchableOpacity>
              <Formik
                initialValues={{ selector: '', comentario:''}}
                onSubmit={(values, { setSubmitting }) => {
                  if (values.marca == '' || values.comentario == '') {
                    handleMessage('Por favor llene todos los campos');
                    setSubmitting(false);
                  } else {
                    handleSelector(values, setSubmitting);
                  }
                }}
              >
                {({ handleSubmit, isSubmitting,handleChange, handleBlur, values}) => (
                  <StyledFormArea>
                    <View>
                  <StyledInputLabel>Ubicaciones</StyledInputLabel>
                  <Picker
                    selectedValue={selectorValue}
                    onValueChange={(itemValue) => setSelectorValue(itemValue)}
                    style={{backgroundColor:grey, padding: 15,
                        paddingLeft: 55,
                        paddingRight:55,
                        borderRadius: 5,
                        fontSize: 16,
                        height: 60,
                        marginVertical: 3,
                        marginBottom: 10,
                        color: secondary}}
                  >
                    <Picker.Item label="Seleccionar" value=""/>      

                    {selectorOptions.map((option) => (
                      <Picker.Item label={option} value={option} key={option}   style={{
                      borderRadius: 10,color: secondary}}/>
                    ))}
                  </Picker>
                </View>

                <MyTextInput
                    label="¿Por que se esta cambiando la ubicación?"
                    icon="question"
                    placeholder="Motivo"
                    placeholderTextColor={darklight}
                    onChangeText={handleChange('comentario')}
                    onBlur={handleBlur('comentario')}
                    value={values.comentario}
                />

                    <MsgBox type={messageType}>{message}</MsgBox>
    
                    {!isSubmitting && (
                      <StyledButton onPress={handleSubmit}>
                        <ButtonText>              Aceptar              </ButtonText>
                      </StyledButton>
                    )}
    
                    {isSubmitting && (
                      <StyledButton disabled={true}>
                        <ActivityIndicator size="large" color={primary} />
                      </StyledButton>
                    )}
                  </StyledFormArea>
                )}
              </Formik>
            </View>
          </View>
        </Modal>
    ) : (
      <Modal visible={isVisible} transparent animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Octicons name="x" size={30} color={secondary} />
          </TouchableOpacity>
              <Formik
                initialValues={{ selector: '', comentario:''}}
                onSubmit={(values, { setSubmitting }) => {
                  if (values.marca == '' || values.comentario == '') {
                    handleMessage('Por favor llene todos los campos');
                    setSubmitting(false);
                  } else {
                    handleSelector(values, setSubmitting);
                  }
                }}
              >
                {({ handleSubmit, isSubmitting,handleChange, handleBlur, values}) => (
                  <StyledFormArea>
                    <View>
                  <StyledInputLabel>Municipio</StyledInputLabel>
                  <Picker
                    selectedValue={selectorValue}
                    onValueChange={(itemValue) => setSelectorValue(itemValue)}
                    style={{backgroundColor:grey, padding: 15,
                        paddingLeft: 55,
                        paddingRight:55,
                        borderRadius: 5,
                        fontSize: 16,
                        height: 60,
                        marginVertical: 3,
                        marginBottom: 10,
                        color: secondary}}
                  >
                    <Picker.Item label="Seleccionar" value=""/>      

                    {municipioValues.map((option) => (
                      <Picker.Item label={option} value={option} key={option}   style={{
                      borderRadius: 10,color: secondary}}/>
                    ))}
                  </Picker>
                </View>

                <MyTextInput
                    label="¿Por qué se esta cambiando el Municipio?"
                    icon="question"
                    placeholder="Motivo"
                    placeholderTextColor={darklight}
                    onChangeText={handleChange('comentario')}
                    onBlur={handleBlur('comentario')}
                    value={values.comentario}
                />

                    <MsgBox type={messageType}>{message}</MsgBox>
    
                    {!isSubmitting && (
                      <StyledButton onPress={handleSubmit}>
                        <ButtonText>              Aceptar              </ButtonText>
                      </StyledButton>
                    )}
    
                    {isSubmitting && (
                      <StyledButton disabled={true}>
                        <ActivityIndicator size="large" color={primary} />
                      </StyledButton>
                    )}
                  </StyledFormArea>
                )}
              </Formik>
            </View>
          </View>
        </Modal>
                    )
      );
    };
    
    const styles = StyleSheet.create({
      centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalView: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
    });

const MyTextInput = ({label, icon, ...props}) =>{
    return(
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={secondary}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
        </View>
    );
}

export default Selector;

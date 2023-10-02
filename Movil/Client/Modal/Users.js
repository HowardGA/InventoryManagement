import React, { useState, useEffect } from 'react';
import { Modal, View,ActivityIndicator,StyleSheet,TouchableOpacity} from 'react-native';
import axios from 'axios';

import{MsgBox,StyledInputLabel,StyledFormArea,StyledButton, ButtonText, Colors} from '../components/styles';

import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';

import {Octicons} from '@expo/vector-icons'

const {tertiary, darklight,secondary, primary,grey}= Colors;

const Users = ({ isVisible, closeModal, user}) => {
  const ip = 'http://192.168.1.187:8080/api';
    const [message,setMessage] = useState();
    const [messageType,setMessageType] = useState();
    const [selectorValue, setSelectorValue] = useState(); 

    console.log(user);
    const arrayRoles = ['Admin','General','Visualizador'];

     const disableUser = () => {

     }

    const handleSelector = (values,setSubmitting) => {
        const url = `${ip}/setUser/${user}`;
        axios
        .post(url,values)
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
        closeModal();
        setSubmitting(false);
    }

    const handleMessage = (message,type = 'FAIL') => {
        setMessage(message);
        setMessageType(type);
    }

    return (
        <Modal visible={isVisible} transparent animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Octicons name="x" size={30} color={secondary} />
          </TouchableOpacity>
              <Formik
                initialValues={{ Rol: ''}}
                onSubmit={(values,{ setSubmitting }) => {
                  if (values.Rol == '') {
                    handleMessage('Por favor llene todos los campos');
                    setSubmitting(false);
                  } else {
                    handleSelector(values,setSubmitting);
                  }
                }}
              >
                {({ handleSubmit, isSubmitting,setValues,values}) => (
                  <StyledFormArea>
                    <View>
                  <StyledInputLabel>Seleccionar Nuevo Rol</StyledInputLabel>
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
                    <Picker.Item label="Roles" value=""/>      

                    {arrayRoles.map((option) => (
                      <Picker.Item label={option} value={option} key={option}   style={{
                      borderRadius: 10,color: secondary}}/>
                    ))}
                  </Picker>
                </View>

                {useEffect (() => {
                    if (selectorValue) {
                        setValues({
                          ...values,
                          Rol: selectorValue,
                        });
                    }
                },[selectorValue])}

                    <MsgBox type={messageType}>{message}</MsgBox>

                    {!isSubmitting && (
                      <StyledButton onPress={disableUser} disable={true}>
                        <ButtonText>Dar de Baja</ButtonText>
                      </StyledButton>
                    )}
    
                    {!isSubmitting &&(
                      <StyledButton onPress={handleSubmit} >
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

export default Users;

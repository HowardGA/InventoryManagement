import React, { useState, useEffect } from 'react';
import { Modal, View,ActivityIndicator,StyleSheet,TouchableOpacity} from 'react-native';

import{StyledContainer,MsgBox,LeftIcon,InnerContainer,SubTitle,StyledInputLabel,StyledFormArea,StyledButton, ButtonText, Colors,BarCodeScannerV,PageTitle,StyledTextInput} from '../components/styles';

import { Formik } from 'formik';

import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

const {tertiary, darklight,secondary, primary}= Colors;

const Location = ({ isVisible, closeModal, onLocation}) => {
    const [message,setMessage] = useState();
    const [messageType,setMessageType] = useState();

    const handleLocation = (values,setSubmitting) => {
        onLocation(values.locacion);
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
                initialValues={{ locacion: '' }}
                onSubmit={(values, { setSubmitting }) => {
                  if (values.marca == '') {
                    handleMessage('Por favor llene todos los campos');
                    setSubmitting(false);
                  } else {
                    handleLocation(values, setSubmitting);
                  }
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                  <StyledFormArea>
                    <MyTextInput
                      label="Nombre"
                      icon="pin"
                      placeholder="Comedor"
                      placeholderTextColor={darklight}
                      onChangeText={handleChange('locacion')}
                      onBlur={handleBlur('locacion')}
                      value={values.locacion}
                    />
    
                    <MsgBox type={messageType}>{message}</MsgBox>
    
                    {!isSubmitting && (
                      <StyledButton onPress={handleSubmit}>
                        <ButtonText>Guardar</ButtonText>
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

export default Location;

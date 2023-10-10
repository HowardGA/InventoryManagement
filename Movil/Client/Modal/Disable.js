import React, { useState, useEffect } from 'react';
import { Modal, View,ActivityIndicator,StyleSheet,TouchableOpacity} from 'react-native';

import{StyledContainer,MsgBox,LeftIcon,InnerContainer,SubTitle,StyledInputLabel,StyledFormArea,StyledButton, ButtonText, Colors,BarCodeScannerV,PageTitle,StyledTextInput} from '../components/styles';

import { Formik } from 'formik';

import {Octicons} from '@expo/vector-icons'

const {tertiary, darklight,secondary, primary}= Colors;

const Disable = ({ isVisible, closeModal, onDisable}) => {
    const [message,setMessage] = useState();
    const [messageType,setMessageType] = useState();

    const handleLocation = (values,setSubmitting) => {
        onDisable(values.baja);
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
                initialValues={{ baja: '' }}
                onSubmit={(values, { setSubmitting }) => {
                  if (values.baja == '') {
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
                      label="Motivo de la Baja"
                      icon="x-circle-fill"
                      placeholder="Motivo"
                      placeholderTextColor={darklight}
                      onChangeText={handleChange('baja')}
                      onBlur={handleBlur('baja')}
                      value={values.baja}
                    />
    
                    <MsgBox type={messageType}>{message}</MsgBox>
    
                    {!isSubmitting && (
                      <StyledButton onPress={handleSubmit}>
                        <ButtonText>Mandar Solicitud</ButtonText>
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

export default Disable;

import React, { useState, useEffect } from 'react';
import { Modal, View,ActivityIndicator,StyleSheet} from 'react-native';

import{StyledContainer,MsgBox,LeftIcon,InnerContainer,SubTitle,StyledInputLabel,StyledFormArea,StyledButton, ButtonText, Colors,BarCodeScannerV,PageTitle,StyledTextInput} from '../components/styles';

import { Formik } from 'formik';

import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons'

const {tertiary, darklight,secondary, primary}= Colors;

const Brand = ({ isVisible, closeModal, onBrand}) => {
    const [message,setMessage] = useState();
    const [messageType,setMessageType] = useState();

    const handleBrand = (values,setSubmitting) => {
        onBrand(values.marca);
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
              <Formik
                initialValues={{ marca: '' }}
                onSubmit={(values, { setSubmitting }) => {
                  if (values.marca == '') {
                    handleMessage('Por favor llene todos los campos');
                    setSubmitting(false);
                  } else {
                    handleBrand(values, setSubmitting);
                  }
                }}
              >
                {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                  <StyledFormArea>
                    <MyTextInput
                      label="Nombre"
                      icon="pin"
                      placeholder="example@mail.com"
                      placeholderTextColor={darklight}
                      onChangeText={handleChange('marca')}
                      onBlur={handleBlur('marca')}
                      value={values.marca}
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

export default Brand;

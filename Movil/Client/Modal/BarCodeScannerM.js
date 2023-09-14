import React, { useState, useEffect } from 'react';
import { Modal, Text, StyleSheet,View} from 'react-native';

import{StyledContainer,InnerContainer,SubTitle,StyledButton, ButtonText, Colors,BarCodeScannerV} from '../components/styles';

import {BarCodeScanner} from 'expo-barcode-scanner';

const {tertiary, darklight,secondary, primary}= Colors;

const BarCodeScannerM = ({ isVisible, closeModal, onBarcodeScanned}) => {
  const [hasPermission,setHasPermission] = useState(null);
    const [scanned,setScanned] = useState(null);

    //request camera permission
    useEffect(() => {
        const askForPermission = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
          };
        
          askForPermission();
    },[]);

    const handleBarCodeScanned = ({type,data}) => {
        setScanned(false);
        onBarcodeScanned(data);
        closeModal();
    }

    //check if the camera has permission
    if (hasPermission === null){
        return (
                <StyledContainer>
                    <Text>Permitir Acceso a la Camara</Text>
                </StyledContainer>
        );
    }

    if(hasPermission === false){
        return (
                <StyledContainer>
                    <InnerContainer>
                        <SubTitle>Permita el Acceso a la Camara</SubTitle>
                        <StyledButton onPress={() => askForPermission()}>
                            <ButtonText>
                                Permitir Camara
                            </ButtonText>
                        </StyledButton>
                    </InnerContainer>
                </StyledContainer>
        );
    }

    return (
        <Modal visible={isVisible} transparent animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <BarCodeScannerV>
                <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                  style={{ flex: 1, width: '100%' }}
                />
              </BarCodeScannerV>
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
    

export default BarCodeScannerM;

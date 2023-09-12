import React, {useState, useEffect}from "react";
import {Text,View,Button} from 'react-native';

import{StyledContainer,InnerContainer,SubTitle,StyledButton, ButtonText, Colors,BarCodeScannerV,PageTitle} from './../components/styles';

import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';

import {BarCodeScanner} from 'expo-barcode-scanner';

const {tertiary, darklight,secondary, primary}= Colors;

const AddBarcode = (navigate) => {
    const [hasPermission,setHasPermission] = useState(null);
    const [scanned,setScanned] = useState(null);
    const [text,setText] = useState('No se ha escaneado nada')

    //request camera permission
    useEffect(() => {
        const askForPermission = async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
          };
        
          askForPermission();
    },[]);

    const handleBarCodeScanned = ({type,data}) => {
        setScanned(true);
        setText(data);
        console.log('Type: '+type+' data: '+data);
    }

    //check if the camera has permission
    if (hasPermission === null){
        return (
            <KeyboardAvoidingWrapper>
                <StyledContainer>
                    <Text>Permitir Acceso a la Camara</Text>
                </StyledContainer>
            </KeyboardAvoidingWrapper>
        );
    }

    if(hasPermission === false){
        return (
            <KeyboardAvoidingWrapper>
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
            </KeyboardAvoidingWrapper>
        );
    }

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <InnerContainer>
                <PageTitle>Escanee un Codigo</PageTitle>
                <BarCodeScannerV>
                    <BarCodeScanner 
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{flex: 1, width:'100%'}}/>
                </BarCodeScannerV>
                    <SubTitle>{text}</SubTitle>
                    {scanned && 
                        <StyledButton onPress={() => setScanned(false)}>
                            <ButtonText>
                                Escanear de Nuevo 
                            </ButtonText>
                        </StyledButton>}
                        </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

export default AddBarcode;
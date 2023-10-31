import React, {useState,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

//icons
import {Ionicons} from '@expo/vector-icons'

import{StyledContainer,PageTitle,StyledFormArea,StyledTextInput, StyledInputLabel, RightIcon, StyledButton, Colors,MsgBox,
       } from './../components/styles';

import {StyleSheet,View,Text,ActivityIndicator} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary}= Colors;

import axios from 'axios';

import { Formik } from 'formik';

import Scanner from './../Modal/BarCodeScannerM';

import KeyboardAvoidingWrapper from './../components/KeyboardAvoidingWrapper';


const Welcome = () => {
const ip = 'http://192.168.1.187:8080/api';
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();
const [modalVisibleScanner,setModalVisibleScanner] = useState(false);
const [scannedData, setScannedData] = useState(); 
const [activeItems, setActiveItems] = useState();
const [pendingItems, setPendingItems] = useState();
const [disabledItems, setDisabledItems] = useState();


const navigation = useNavigation();

const getCount = async () => {
    const url = ip+'/countItems';
    try {
      const response = await axios.get(url);
      const {Activos,Pendientes,Baja} = response.data;
        setActiveItems(Activos);
        setPendingItems(Pendientes);
        setDisabledItems(Baja);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCount();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
  
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
  setModalVisibleScanner(false);
};

const lookUp = (values,setSubmitting) => {
  const item = values.codigo;
  const runEffect = false;
  handleMessage(null);
  const url = ip+`/getArtById/${item}`;
  axios
      .get(url)
      .then((response) => {
          const result = response.data;
          const {message,status} = result;

          if (status !== 'SUCCESS'){
              handleMessage(message,status);
          }else{
            handleMessage(message,status);
            navigation.navigate('Item',{item},{runEffect});
          }  
          setSubmitting(false);
  }).catch((error) => {
      console.error(error);
      setSubmitting(false);
      handleMessage("Articulo Inexistente");
  })    
}

  const handleButtonClick = (item) => {
    handleMessage(null);
    const url = ip+`/getArtById/${item}`;
    axios
        .get(url)
        .then((response) => {
            const result = response.data;
            const {message,status} = result;
  
            if (status !== 'SUCCESS'){
                handleMessage(message,status);
            }else{
              handleMessage(message,status);
              navigation.navigate('Item',{item});

            }  
    }).catch((error) => {
        console.error(error);
        handleMessage("Articulo Inexistente");
    })    
  };


    return(
      <KeyboardAvoidingWrapper>
        <StyledContainer>
<StatusBar style="light" backgroundColor={secondary} />
                <PageTitle>Buscar</PageTitle>
                <View style={styles.Search}>
                <Formik
                        initialValues={{codigo:''}}
                        onSubmit={(values,{setSubmitting}) => {
                            if(values.codigo == ''){
                                handleMessage("Por favor llene el campo");
                                setSubmitting(false);
                            }else{
                                lookUp(values,setSubmitting);
                            }
                        }}>
                    {
                        ({handleChange, handleBlur, handleSubmit, values,setValues, isSubmitting,setSubmitting}) => 
                            (<StyledFormArea>
                                <MyTextInput
                                    label=""
                                    placeholder="Buscar Articulo"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('codigo')}
                                    onBlur={handleBlur('codigo')}
                                    value={values.codigo}
                                    welcome={true}
                                    openModalScanner={openModalScanner}
                                />
                                    {useEffect(() => {
                                      if (scannedData) {
                                      setValues({ ...values, codigo: scannedData });
                                      handleButtonClick(scannedData);
                                      }
                                  }, [scannedData])}
                                <MsgBox type={messageType}>{message}</MsgBox>
                                <View style={styles.SearchB}/>
                                {!isSubmitting && <RightIcon onPress={handleSubmit} searchIcon={true}>
                                      <Ionicons name={'search-sharp'}size={30} color={primary}/>
                                    
                                </RightIcon>}

                                {isSubmitting && <StyledButton disabled={true}>
                                    <ActivityIndicator size="large" color={primary}/>
                                </StyledButton>}

                            </StyledFormArea>
                    )}
                    </Formik>
                    </View>
                    <View style={styles.container}>
                      <View style={styles.smallCircle}>
                        <Ionicons name={'trending-up-outline'}size={60} color={secondary} style={styles.trending}/>
                        <View style={styles.quantityContainer}>
                          <Text style={styles.quantity}>{activeItems}</Text>
                        </View>
                        <Text style={styles.numberText}>Artículos Activos</Text>
                        </View>
                      <View style={styles.smallCircle}>
                        <Ionicons name={'trending-down-outline'}size={60} color={secondary} style={styles.trending}/>
                        <View style={styles.quantityContainer}>
                          <Text style={styles.quantity}>{disabledItems}</Text>
                        </View>
                        <Text style={styles.numberText}>Bajas</Text>
                      </View>
                      <View style={styles.smallCircle}>
                        <Ionicons name={'trash-bin-outline'}size={60} color={secondary} style={styles.trending}/>
                        <View style={styles.quantityContainer}>
                          <Text style={styles.quantity}>{pendingItems}</Text>
                        </View>
                        <Text style={styles.numberText}>Bajas Pendientes</Text>
                      </View>
                    </View>

                <Scanner isVisible={modalVisibleScanner} closeModal={closeModalScanner} onBarcodeScanned={handleBarcodeScanned}/>
        </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
      paddingHorizontal: 20,
      borderRadius: 5,
      paddingTop: 20,
    },
    Ricon:{
        right: 15,
        position: "absolute",
        zIndex: 1,
        top: 10,
    },
    Search:{
        alignItems:'center'
    },
    SearchB:{
      backgroundColor: secondary,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      height:60,
      width:50,
      position:'absolute',
      marginLeft:270,
      marginTop:21,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    smallCircle: {
      backgroundColor: primary,
      borderRadius:50,
      width: 270,
      height: 180,
      borderColor: secondary,
      borderWidth : 7,
      marginBottom: 10,
      marginTop:10,
      flex: 1,
      flexDirection: 'row',
    },
    numberText: {
      fontSize: 25, 
      color: tertiary,
      fontWeight:'bold',
      letterSpacing: 1,
      marginTop: 100,
      marginLeft: 22,
      position: 'absolute'

    },
    trending: {
      marginLeft:20,
      marginTop: 10,
      position: 'absolute'
    },
    quantityContainer: {
      alignItems: 'flex-end', 
      flex: 1, 
      marginRight: 20
    },
    quantity: {
      fontSize: 50, 
      color: secondary,
      fontWeight:'bold',
      letterSpacing: 1,
      marginTop: 15,
      marginLeft: 1,
    }
  });

const MyTextInput = ({label,openModalScanner, ...props}) =>{
    return(
        <View>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {label == '' && (
                <RightIcon onPress={openModalScanner} welcomeIcon={true}>
                    <Ionicons name={'barcode-outline'}size={30} color={secondary}/>
                </RightIcon>
            )}
        </View>
    );
            }
  
export default Welcome;
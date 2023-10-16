import React, {useState,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

//icons
import {Ionicons,Octicons} from '@expo/vector-icons'

import { Formik } from 'formik';

import{StyledContainer,StyledFormArea,PageLogo,PageTitle,StyledTextReport,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
       } from './../components/styles';

import {StyleSheet,View,ScrollView,RefreshControl,FlatList,ActivityIndicator} from 'react-native';


import { useNavigation } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary,grey}= Colors;

import axios from 'axios';
import Scanner from './../Modal/BarCodeScannerM';
import Bajas_Reports_History from './../Modal/Bajas_Reports_History'


const DisableItems = () => {
const ip = 'http://192.168.1.187:8080/api';
const [refreshing, setRefreshing] = useState(false);
const [pendingBajasData,setPendingBajasData] = useState([]);
const [modalVisibleScanner,setModalVisibleScanner] = useState(false);
const [scannedData, setScannedData] = useState(); 
const [isRefreshing, setIsRefreshing] = useState(false);
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();
const [modalVisibleHistory,setModalVisibleHistory] = useState(false);
const baja = true;


const navigation = useNavigation();

const handleMessage = (message,type = 'FAIL') => {
    setMessage(message);
    setMessageType(type);
}

const handleDetailedInfo = (reportID) => {
    const UPCDisable = reportID.text;
    navigation.navigate('Item',{UPCDisable,baja});
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
  handleMessage(null);
  const UPCDisable = item;
  const url = ip+`/getBajasPendientes/${item}`;
  axios
      .get(url)
      .then((response) => {
          const result = response.data;
          const {message,status} = result;

          if (status !== 'SUCCESS'){
              handleMessage(message,status);
          }else{
            handleMessage(message,status);
            navigation.navigate('Item',{UPCDisable,baja});
          }  
          setSubmitting(false);
  }).catch((error) => {
      console.error(error);
      setSubmitting(false);
      handleMessage("Err");
  })    
  }

  const handleButtonClick = (item) => {
    const url = ip+`/getBajasPendientes/${item}`;
    const UPCDisable = item;
    console.log("This is at Scanner: ",UPCDisable," ",baja)
    axios
        .get(url)
        .then((response) => {
            const result = response.data;
            const {message,status} = result;
  
            if (status !== 'SUCCESS'){
              console.log("error here")
                handleMessage(message,status);
            }else{
              handleMessage(message,status);
              navigation.navigate('Item',{UPCDisable,baja});
            }  
    }).catch((error) => {
        console.error(error);
        handleMessage("Articulo Inexistente");
    })    
  };

  ///
const notificationsBajas = [];

const getBajas = async () => {
    const url = ip+'/getPendingStatus';
    try {
      const response = await axios.get(url);
      const resultArray = response.data;
      setPendingBajasData(resultArray);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }
  
  let i = 0;
  pendingBajasData.forEach(bajas => {
    const fechaCreacion = new Date(bajas.Fecha);
    const notificationText = `${bajas.Num_Referencia}`;

  //the thing thats going to be shown in the list 
    const notification = {
      id: i,
      text: notificationText,
      date: fechaCreacion,
    };
  
    notificationsBajas.push(notification);
    i++;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getBajas();
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  const onRefresh = () => {
    // Function to refresh the list
    setRefreshing(true); // Set refreshing to true to display the refresh indicator
    getBajas()
      .then(() => setRefreshing(false)) // After fetching data, set refreshing back to false
      .catch((error) => {
        console.error(error);
        setRefreshing(false); // In case of an error, also set refreshing back to false
      });
  };
  
  const closeModalHistory = () => {
    setModalVisibleHistory(false);
  };
  
  const openModalHistory = () => {
    setModalVisibleHistory(true);
  };

    return(
        <StyledContainer>
            <StatusBar style="light" backgroundColor={secondary} />
        <PageTitle>Bajas Pendientes</PageTitle>
        <RightIcon reportHistory={true} onPress={openModalHistory}>
                    <Octicons name={'history'}size={30} color={secondary}/>
                </RightIcon>
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
          <FlatList
            data={notificationsBajas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.notification}>
                <StyledTextReport>{item.text}</StyledTextReport>
                <RightIcon
                  onPress={() => handleDetailedInfo(item)}
                  onReports={true}
                >
                  <Ionicons
                    name={'information-circle'}
                    size={30}
                    color={tertiary}
                  />
                </RightIcon>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={tertiary}
              />
            }
          />
        </View>
        <Scanner isVisible={modalVisibleScanner} closeModal={closeModalScanner} onBarcodeScanned={handleBarcodeScanned}/>
        <Bajas_Reports_History isVisible={modalVisibleHistory} closeModal={closeModalHistory}  title={"Bajas"} report={false} bajas={true}/>
      </StyledContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
      },
      notification: {
        backgroundColor: '#E5E5E5', // Background color of the pill
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,

      },
      separator: {
        height: 5, // Adjust the value to control the spacing between pills
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

export default DisableItems;
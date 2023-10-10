import React, {useState, useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

//icons
import {Ionicons} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {StyleSheet,View,Text,TouchableOpacity,ActivityIndicator,ScrollView,RefreshControl} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary,grey}= Colors;

import { Table, Row, Rows } from 'react-native-table-component';

import axios from 'axios';

import { Formik } from 'formik';

import Scanner from './../Modal/BarCodeScannerM';

const Welcome = () => {
const ip = 'http://192.168.1.187:8080/api';
const [hidePassword,setHidePassword] = useState(true);
const [items,setItems] = useState([]);
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();
const [modalVisibleScanner,setModalVisibleScanner] = useState(false);
const [scannedData, setScannedData] = useState(); 
const [refreshing, setRefreshing] = useState(false);

const navigation = useNavigation();

const getItems = async () => {
    const url = ip+'/getAllArtUPC';
    try {
      const response = await axios.get(url);
      const resultArray = response.data;
      setItems(resultArray);
    } catch (error) {
      console.error("Error fetching:", error);
      setItems(["Error"," de"," Conexión"]);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getItems();
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
      getItems()
      .then(() => {
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Error while refreshing:', error);
        setRefreshing(false);
      });
  };
  
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

  const tableHead = ['UPC'];
  const tableData = items.map((item) => [
    <View>
        <Text style={styles.UPC}>{item}</Text>
     <TouchableOpacity style={styles.Ricon} key={item}
     onPress={() => handleButtonClick(item)} >
     <Ionicons name={'chevron-forward-outline'} size={30} color={secondary} />
   </TouchableOpacity>
   </View>
  ]);

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
      <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
        <StyledContainer>
            <StatusBar style="dark"/>
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
                <View style={styles.innerContainer}>
                    <Table borderStyle={{ borderWidth: 2, borderColor: tertiary}}>
                    <Row data={tableHead} style={styles.head} textStyle={styles.headText} />
                    <Rows data={tableData} textStyle={styles.text}/>
                    </Table>
                </View>
                <Scanner isVisible={modalVisibleScanner} closeModal={closeModalScanner} onBarcodeScanned={handleBarcodeScanned}/>
        </StyledContainer>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    innerContainer: {
      paddingHorizontal: 20,
      borderRadius: 5,
      paddingTop: 20,
    },
    head: { height: 40, backgroundColor: secondary },
    headText: { margin: 6, fontWeight: 'bold', color: primary,fontSize: 16, paddingLeft: 55,paddingRight: 55,},
    text: {
        backgroundColor: grey,
        padding: 15,
        paddingLeft: 55,
        paddingRight: 55,
        fontSize: 16,
        marginVertical: 3,
        color: secondary
    },
    UPC:{
        padding: 15,
        paddingLeft: 55,
        paddingRight: 55,
        fontSize: 16,
        color: secondary
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
      backgroundColor: 'white', // Set your background color
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
  
export default Welcome;
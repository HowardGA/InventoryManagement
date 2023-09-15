import React, {useState, useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

//icons
import {Octicons, Ionicons} from '@expo/vector-icons'

import{StyledContainer,InnerContainer,PageLogo,PageTitle,SubTitle,StyledFormArea,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
        ExtraView,ExtraText,Textlink,TextLinkContent} from './../components/styles';

import {StyleSheet,View,Text,TouchableOpacity} from 'react-native';

import {CredentialsContext} from './../components/CredentialsContext';

//AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useNavigation } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary,grey}= Colors;

import { Table, Row, Rows } from 'react-native-table-component';

import axios from 'axios';

import { Formik } from 'formik';

const Welcome = () => {
const [hidePassword,setHidePassword] = useState(true);
const [items,setItems] = useState([]);
const [message,setMessage] = useState();
const [messageType,setMessageType] = useState();

const {storedCredentials, setStoredCredentials} = useState(CredentialsContext);
//const {name,lastName,email} = storedCredentials;

const navigation = useNavigation();

const getItems = async () => {
    const url = 'http://192.168.1.184:8080/api/getAllArtUPC';
    try {
      const response = await axios.get(url);
      const resultArray = response.data;
      setItems(resultArray);
    } catch (error) {
      console.error("Error fetching:", error);
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

  const handleMessage = (message,type = 'FAIL') => {
    setMessage(message);
    setMessageType(type);
}

const lookUp = () => {

}

  const tableHead = ['UFC'];
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
    // Do something when the button is clicked for a specific item
    console.log('Button clicked for item:', item);
  };


    return(
        <StyledContainer>
            <StatusBar style="dark"/>
                <PageTitle>Buscar</PageTitle>
                <View style={styles.Search}>
                <Formik
                        initialValues={{codigo:''}}
                        onSubmit={(values,{setSubmitting}) => {
                            if(values.codigo == ''){
                                handleMessage("Por favor llene todos los campos");
                                setSubmitting(false);
                            }else{
                                handleLogin(values,setSubmitting);
                            }
                        }}>
                    {
                        ({handleChange, handleBlur, handleSubmit, values, isSubmitting}) => 
                            (<StyledFormArea>
                                <MyTextInput
                                    label=""
                                    placeholder="Buscar Articulo"
                                    placeholderTextColor={darklight}
                                    onChangeText={handleChange('codigo')}
                                    onBlur={handleBlur('codigo')}
                                    value={values.codigo}
                                />

                                <MsgBox type={messageType}>{message}</MsgBox>

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
        </StyledContainer>
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
    }
  });

const MyTextInput = ({label, ...props}) =>{
    return(
        <View>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {label == '' && (
                <RightIcon onPress={() => lookUp()}>
                    <Ionicons name={'search-sharp'}size={30} color={tertiary}/>
                </RightIcon>
            )}
        </View>
    );
            }
  
export default Welcome;
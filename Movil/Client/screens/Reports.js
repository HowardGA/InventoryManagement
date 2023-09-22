import React, {useState, useContext,useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';

//icons
import {Ionicons} from '@expo/vector-icons'


import{StyledContainer,InnerContainer,PageLogo,PageTitle,StyledTextReport,StyledTextInput, StyledInputLabel, LeftIcon, RightIcon, StyledButton, ButtonText, Colors,MsgBox,Line,
       } from './../components/styles';

import {StyleSheet,View,ScrollView,RefreshControl,FlatList} from 'react-native';


import { useNavigation } from '@react-navigation/native';

const {tertiary, darklight,secondary, primary,grey}= Colors;

import axios from 'axios';

const Reporte = () => {
const ip = 'http://192.168.1.187:8080/api';
const [refreshing, setRefreshing] = useState(false);
const [reportsData,setReportsData] = useState([]);
const [isRefreshing, setIsRefreshing] = useState(false);

const navigation = useNavigation();

  
const handleDetailedInfo = (reportID) => {
navigation.navigate('DetailedInfoReport',{reportID});
}



const notificationsReport = [];

const getReports = async () => {
    const url = ip+'/getReports';
    try {
      const response = await axios.get(url);
      const resultArray = response.data;
      setReportsData(resultArray);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }
  
  reportsData.forEach(report => {
    const fechaCreacion = new Date(report.FechaCreacion);
    const notificationText = `${report.Accion} de ${report.Articulo}`;
  
    const notification = {
      id: report.Numero.toString(),
      text: notificationText,
      date: fechaCreacion,
    };
  
    notificationsReport.push(notification);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getReports();
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  const onRefresh = () => {
    // Function to refresh the list
    setRefreshing(true); // Set refreshing to true to display the refresh indicator
    getReports()
      .then(() => setRefreshing(false)) // After fetching data, set refreshing back to false
      .catch((error) => {
        console.error(error);
        setRefreshing(false); // In case of an error, also set refreshing back to false
      });
  };
  


    return(
        <StyledContainer>
        <StatusBar style="dark" />
        <PageTitle>Reportes</PageTitle>
        <View style={styles.container}>
          <FlatList
            data={notificationsReport}
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
  });

  
export default Reporte;
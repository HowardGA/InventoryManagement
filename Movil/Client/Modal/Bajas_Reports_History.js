import React, { useState, useEffect } from 'react';
import { Modal, View,FlatList,StyleSheet,TouchableOpacity,RefreshControl} from 'react-native';

import{Colors,PageTitle,StyledTextReport} from '../components/styles';

import {Octicons} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';


const {tertiary, darklight,secondary, primary}= Colors;

const Bajas_Reports_History = ({ isVisible, closeModal,title,report,bajas}) => {
    const ip = 'http://192.168.1.187:8080/api';
    const navigation = useNavigation();
    const [reportsData,setReportsData] = useState([]);
    const [bajasData,setBajasData] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

      const handleDetailedInfoReport = (reportID) => {
        const reportNumber = reportID.id;
        const history = true;
        navigation.navigate('DetailedInfoReport',{reportNumber,history});
      }

      const handleDetailedInfoBaja = (UPCDisable) => {
        const baja = true;
        const history = true;
        console.log("hell nah: ",UPCDisable)
        navigation.navigate('Item',{UPCDisable, baja, history});
      }
      const notificationsRep = [];

      const getReportsHistoryAndHandleInfo = async () => {
      
        try {
          const url = `${ip}/getReportsHistory`;
          const response =  await axios.get(url);
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
      
        notificationsRep.push(notification);  
          });

      const notificationsBaja = [];
      const getBajasHistoryAndHandleInfo = async () => {
      
        try {
          const url = `${ip}/getBajasHistory`;
          const response =  await axios.get(url);
          const resultArray = response.data;
          setBajasData(resultArray);
                } catch (error) {
          console.error("Error fetching:", error);
        }
      }
      bajasData.forEach(baja => {
      
        const notification = {
          id: baja.Num_Referencia,
        };
      
        notificationsBaja.push(notification);  
          });


      useEffect(() => {
        const fetchData = async () => {
          try {
            (report) ?  getReportsHistoryAndHandleInfo() :  getBajasHistoryAndHandleInfo()
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchData();
      }, [report]);

   const onRefresh = () => {
    // Function to refresh the list
    setRefreshing(true); // Set refreshing to true to display the refresh indicator

   (report) ? getReportsHistoryAndHandleInfo() : getBajasHistoryAndHandleInfo()

      .then(() => setRefreshing(false)) // After fetching data, set refreshing back to false
      .catch((error) => {
        console.error(error);
        setRefreshing(false); // In case of an error, also set refreshing back to false
      });
  };


    return (
        <Modal visible={isVisible} transparent animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <PageTitle>{`Historial ${title}`}</PageTitle>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Octicons name="x" size={30} color={secondary} />
          </TouchableOpacity>
{console.log("baja",notificationsBaja)}
          <FlatList
            data={report ? notificationsRep : notificationsBaja}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.notification}>
                <TouchableOpacity  onPress={() => {
                    closeModal();
                    (report) ? handleDetailedInfoReport(item) : handleDetailedInfoBaja(item.id)
                    }}>
                        <StyledTextReport>{report ? item.text : item.id}</StyledTextReport>

                </TouchableOpacity>
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

export default Bajas_Reports_History;

import React, { useState, useEffect } from 'react';
import { Modal, View,StyleSheet,TouchableOpacity,RefreshControl,FlatList} from 'react-native';
import axios from 'axios';

import{StyledTextReport, Colors,PageTitle} from '../components/styles';

import {Octicons} from '@expo/vector-icons'

const {tertiary, darklight,secondary, primary,grey}= Colors;

const LocationHistory = ({ isVisible, closeModal,action}) => {
  const ip = 'http://192.168.1.187:8080/api';
  const [refreshing, setRefreshing] = useState(false);
    const [message,setMessage] = useState();
    const [messageType,setMessageType] = useState();
    const [locationHistory, setLocaitonHistory] = useState([]);
    
    const locationHistoryArray = [];

const getLocationHistory = async () => {
    const url = ip+`/locationHistory/${action}`;
    try {
      const response = await axios.get(url);
      const resultArray = response.data;
      setLocaitonHistory(resultArray);
      
    } catch (error) {
      console.error("Error fetching:", error);
    }
  }

  let i = 1;
  locationHistory.forEach(location => {
    const ubicacion = location.Lugar;
    const fechaEntrada = new Date(location.FechaEntrada);
    const fechaSalida = location.FechaSalida ? new Date(location.FechaSalida) : "Ubicación Actual";
    const comentario = location.Comentario;
  
    const notification = {
      id: i,
      ubicacion:ubicacion,
      fechaEntrada: fechaEntrada,
      fechaSalida: fechaSalida,
      comentario: comentario
    };
  
    locationHistoryArray.push(notification);
    i++;
  });

    const handleMessage = (message,type = 'FAIL') => {
        setMessage(message);
        setMessageType(type);
    }
    useEffect(() => {
      if (isVisible) {
        getLocationHistory();
      }
    }, [isVisible]);


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

    return (
        <Modal visible={isVisible} transparent animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <PageTitle>Historial Ubicación</PageTitle>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Octicons name="x" size={30} color={secondary} />
          </TouchableOpacity>
          <FlatList
  data={locationHistoryArray}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <View style={styles.notification}>
      <StyledTextReport>Motivo: {item.comentario}</StyledTextReport>
      <StyledTextReport>
        Fecha de Entrada: {item.fechaEntrada.toLocaleString()}
      </StyledTextReport>
      <StyledTextReport>
        Fecha de Salida: {item.fechaSalida.toLocaleString()}
      </StyledTextReport>
      <StyledTextReport>Ubicación: {item.ubicacion}</StyledTextReport>
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

export default LocationHistory;

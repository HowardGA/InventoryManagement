import React, { useState } from 'react';
import {Octicons} from '@expo/vector-icons';
import{Colors} from '../components/styles';

import { View, Image, StyleSheet,TouchableOpacity, Modal} from 'react-native';
const {primary}= Colors;

const Images = ({ selectedImage, imageIP,modalImagesVisible,closeModalImages }) => {

  return (
      <Modal visible={modalImagesVisible} transparent={true}>
        <View style={styles.centeredView}>
            
          <Image
            source={{ uri: `${imageIP}${selectedImage}` }}
            style={styles.modalView}
            />
            <TouchableOpacity onPress={closeModalImages} style={styles.closeButton}>
            <Octicons name="x" size={30} color={primary} />
          </TouchableOpacity>
        </View>
      </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: "80%",
    height: "50%",
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
  },
  closeButton: {
    position: 'absolute',
    top: 120,
    right: 55,
  },
});

export default Images;

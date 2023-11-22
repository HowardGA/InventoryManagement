import React, { useState } from 'react';
import {Octicons} from '@expo/vector-icons';
import{Colors} from '../components/styles';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';


import { Alert,View, Image, StyleSheet,TouchableOpacity, Modal} from 'react-native';
const {primary,secondary}= Colors;

const Images = ({ selectedImage, imageIP,modalImagesVisible,closeModalImages }) => {

  const downloadImage = async (uri, fileName) => {
    const fileUri = FileSystem.documentDirectory + fileName;
    
    try {
      const res = await FileSystem.downloadAsync(uri, fileUri);
      saveFile(res.uri);
    } catch (error) {
      Alert.alert('Error al descargar la Imágen', 'Vuelve a intentar descargar la imágen');
      console.error('Error downloading image:', error);
    }
  };
  
  const saveFile = async (fileUri) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
  
    if (status === "granted") {
      try {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync('Download');
  
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
  
        alert("Success");
      } catch (err) {
        console.log("Save err: ", err);
      }
    } else {
      alert("Please allow permissions to download");
    }
  };
  return (
      <Modal visible={modalImagesVisible} transparent={true}>
        <View style={styles.centeredView}>
            
          <Image
            source={{ uri: `${imageIP}${selectedImage}` }}
            style={styles.modalView}
            />
            <TouchableOpacity onPress={closeModalImages} style={styles.closeButton}>
             <Octicons name="x" size={30} color={'#D80032'} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => downloadImage(`${imageIP}${selectedImage}`,selectedImage)} style={styles.downloadButton}>
          <Octicons name="download" size={30} color={'#D2DE32'} />
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
  downloadButton: {
    position: 'absolute',
    bottom: 270,
    right: 340,
  },
});

export default Images;

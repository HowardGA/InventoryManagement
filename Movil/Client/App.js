import React,{ useEffect, useState } from 'react';

//Screen Stacks
import RootStack from './Navigators/RootStack';

//apploading
import AppLoading from 'expo-app-loading';

//credentials context
import CredentialsContext from './components/CredentialsContext';

//async Storage
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [storedCredentials, setStoredCredentials] = useState("");

  const checkLoginCredentials = () => {
    AsyncStorage.getItem('inventoryManagementCredentials')
      .then((result) => {
        console.log('AsyncStorage result:', result); // Log the result
        if (result !== null) {
          setStoredCredentials(JSON.parse(result));
        } else {
          setStoredCredentials(null);
        }
      })
      .catch((error) => console.log(error));
  };
  
  
  if(!appReady){
    return(
      <AppLoading
        startAsync={checkLoginCredentials}
        onFinish={() => setAppReady(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <CredentialsContext.Provider value={{storedCredentials,setStoredCredentials}}>
          <RootStack/>
    </CredentialsContext.Provider>
  );
}

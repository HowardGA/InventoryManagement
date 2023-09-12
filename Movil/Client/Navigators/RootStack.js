import React from 'react';

//React Navigator
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//colors
import {Colors} from './../components/styles';
const {primary,secondary,tertiary} = Colors;

//Screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import Add from './../screens/Add';
import AddBarcode from './../screens/AddBarcode';

const Stack = createNativeStackNavigator();

// credentials context
import  CredentialsContext  from './../components/CredentialsContext';

//import the tabs navigator we did
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
      <Tab.Navigator options={{
        headerShown: false,
        headerTitleStyle: {
            color: secondary
          },
      }}>
        <Tab.Screen name="Home" component={Welcome}  options={{
        headerShown: false,
      }}/>
        <Tab.Screen name="Add" component={Add} options={{
        headerShown: false,
      }}/>
      </Tab.Navigator>
    );
  };
  

const RootStack = () => {
  return (
    <CredentialsContext.Consumer>
      {({ storedCredentials }) => (
        <NavigationContainer style={{ backgroundColor: 'red' }}>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerTintColor: tertiary,
              headerTransparent: true,
              headerTitle: '',
              headerLeftContainerStyle: {
                paddingLeft: 20,
              },
            }}
          >
            {storedCredentials ? (
              <Stack.Screen
                options={{
                  headerTintColor: secondary,
                  headerShown: false,
                }}
                name="Welcome"
                component={TabNavigator}
              />
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Signup" component={Signup} />
              </>
            )}
             <Stack.Screen name="AddBarcode" component={AddBarcode} />
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </CredentialsContext.Consumer>
  );
};



export default RootStack;
import React from 'react';

//React Navigator
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import icons
import {Ionicons} from '@expo/vector-icons'

//colors
import {Colors} from './../components/styles';
const {primary,secondary,tertiary} = Colors;

//Screens
import Login from './../screens/Login';
import Signup from './../screens/Signup';
import Welcome from './../screens/Welcome';
import Add from './../screens/Add';
import AddBarcode from './../screens/AddBarcode';
import User from './../screens/User';

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
        <Tab.Screen name="Buscar" component={Welcome}  options={{
        headerShown: false, tabBarIcon: ({size, color}) => (
          <Ionicons name={'search'} size={25} color={secondary}/>
        ),tabBarLabelStyle:{
          color: secondary
        }
      }}/>
        <Tab.Screen name="Agregar" component={Add} options={{
        headerShown: false,  tabBarIcon: ({size, color}) => (
          <Ionicons name={'add-circle'} size={25} color={secondary}/>
        ),tabBarLabelStyle:{
          color: secondary
        }
      }}/>
        <Tab.Screen name="Usuario" component={User} options={{
        headerShown: false,  tabBarIcon: ({size, color}) => (
          <Ionicons name={'person'} size={25} color={secondary}/>
        ),tabBarLabelStyle:{
          color: secondary
        }
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
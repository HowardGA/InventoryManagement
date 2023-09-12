// Import necessary packages
import { createDrawerNavigator } from '@react-navigation/drawer';
import Welcome from './../screens/Welcome'; // Import your existing screens

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Welcome">
      <Drawer.Screen name="Welcome" component={Welcome} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

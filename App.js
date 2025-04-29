
import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';


import HomeScreen from './screens/HomeScreen';
import SignUpScreen from './screens/SignUpScreen';
import DashboardScreen from './screens/DashboardScreen';
import SellScreen from './screens/SellScreen';
import CartScreen from './screens/CartScreen'; 
import ProductSelectionScreen from './screens/ProductSelectionScreen';
import InventoryScreen from './screens/InventoryScreen';
import NewCustomerScreen from './screens/NewCustomerScreen';
import NewProductScreen from './screens/NewProductScreen';
import CashCloseScreen from './screens/CashCloseScreen';
import SalesBookScreen from './screens/SalesBookScreen';
import SuppliersScreen from './screens/SuppliersScreen';
import NewSuplierScreen from './screens/NewSupliersScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="SellScreen" component={SellScreen} />
            <Stack.Screen name="CartScreen" component={CartScreen} />
            <Stack.Screen name="ProductSelectionScreen" component={ProductSelectionScreen} />
            <Stack.Screen name="InventoryScreen" component={InventoryScreen} />
            <Stack.Screen name="NewCustomer" component={NewCustomerScreen} />
            <Stack.Screen name="NewProductScreen" component={NewProductScreen} />
            <Stack.Screen name="CashCloseScreen" component={CashCloseScreen} />
            <Stack.Screen name="SalesBookScreen" component={SalesBookScreen} />
            <Stack.Screen name="SuppliersScreen" component={SuppliersScreen} />
            <Stack.Screen name="NewSuplierScreen" component={NewSuplierScreen} />
          </Stack.Navigator>
          <Toaster />
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: 'none',
  },
});

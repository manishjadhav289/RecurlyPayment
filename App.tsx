import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import CartScreen from './src/screens/CartScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import SuccessScreen from './src/screens/SuccessScreen';

export type RootStackParamList = {
  Cart: undefined;
  Payment: { amount: number; planCode: string; planName: string };
  Success: { subscriptionId: string };
};

export type CartScreenProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;
export type PaymentScreenProps = NativeStackScreenProps<RootStackParamList, 'Payment'>;
export type SuccessScreenProps = NativeStackScreenProps<RootStackParamList, 'Success'>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Cart"
        screenOptions={{
          headerStyle: { backgroundColor: '#6366f1' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}>
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{ title: '🛒 Your Cart' }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{ title: '💳 Payment' }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

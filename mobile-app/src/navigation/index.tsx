// mobile-app/src/navigation/index.tsx
import React from 'react';
// Usaremos o Stack (navegação) diretamente aqui
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'; // USAMOS O @react-navigation/stack
import { ActivityIndicator, View } from 'react-native';

import { useAuthManager } from '@/hooks/useAuthManager'; 
import LoginScreen from '@/screens/Auth/LoginScreen'; 
import RegisterScreen from '@/screens/Auth/RegisterScreen'; 
import DashboardScreen from '@/screens/DashboardScreen'; 

const AppStack = createStackNavigator();

export default function Routes() {
  const { signed, loading } = useAuthManager(); // Nosso hook customizado

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        {signed ? (
          // Rotas Protegidas
          <AppStack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          // Rotas Públicas
          <>
            <AppStack.Screen name="Login" component={LoginScreen} />
            <AppStack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
}
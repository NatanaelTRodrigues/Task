// mobile-app/src/navigation/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { ActivityIndicator, View } from 'react-native';
import { AuthRoutes } from './AuthRoutes';
import { AppRoutes } from './AppRoutes'; 
import { useAuthManager } from '@/services/authManager';

const Stack = createNativeStackNavigator();

export default function Routes() {
  const { signed, loading } = useAuthManager(); 

  if (loading) {
    // Exibe tela de loading enquanto verifica o token AsyncStorage
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Decide qual conjunto de rotas carregar */}
        {signed ? (
          // Rotas Protegidas (Dashboard, Tarefas)
          <Stack.Screen name="AppRoutes" component={AppRoutes} />
        ) : (
          // Rotas Públicas (Login, Cadastro)
          <Stack.Screen name="AuthRoutes" component={AuthRoutes} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
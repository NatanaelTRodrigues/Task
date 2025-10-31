// mobile-app/src/navigation/AuthRoutes.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas que criaremos no próximo passo:
import LoginScreen from '@/screens/Auth/LoginScreen'; 
import RegisterScreen from '@/screens/Auth/RegisterScreen'; 

const AuthStack = createNativeStackNavigator();

export const AuthRoutes: React.FC = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);
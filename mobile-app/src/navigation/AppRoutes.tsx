// mobile-app/src/navigation/AppRoutes.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas que criaremos no próximo passo:
import DashboardScreen from '@/screens/DashboardScreen'; 

const AppStack = createNativeStackNavigator();

export const AppRoutes: React.FC = () => (
  <AppStack.Navigator>
    <AppStack.Screen name="Dashboard" component={DashboardScreen} />
  </AppStack.Navigator>
);
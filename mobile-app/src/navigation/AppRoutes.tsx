// mobile-app/src/navigation/AppRoutes.tsx
import React from 'react';
// Mude de createNativeStackNavigator para createStackNavigator se você instalou o Stack
import { createStackNavigator } from '@react-navigation/stack'; 

// Telas que criamos:
import DashboardScreen from '@/screens/DashboardScreen'; 
import CreateTaskScreen from '@/screens/App/CreateTaskScreen'; 

const AppStack = createStackNavigator();

export const AppRoutes: React.FC = () => (
  <AppStack.Navigator initialRouteName="Dashboard">
    <AppStack.Screen 
      name="Dashboard" 
      component={DashboardScreen} 
      options={{ title: 'Minhas Tarefas' }} 
    />
    <AppStack.Screen 
      name="CreateTask" // Nova rota para o formulário
      component={CreateTaskScreen} 
      options={{ title: 'Nova Tarefa' }} 
    />
  </AppStack.Navigator>
);
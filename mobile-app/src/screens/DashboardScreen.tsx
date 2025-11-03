// mobile-app/src/screens/App/DashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuthManager } from '@/hooks/useAuthManager';

export default function DashboardScreen() {
  const { user, signOut } = useAuthManager();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TaskFlow Dashboard</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.welcomeText}>Bem-vindo, {user?.username || 'Usuário'}!</Text>
        <Text style={styles.infoText}>Esta é a sua área de tarefas (CRUD)</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Sair (Logout)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  userInfo: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#dc2626', // Red
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
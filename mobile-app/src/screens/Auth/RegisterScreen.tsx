// mobile-app/src/screens/Auth/RegisterScreen.tsx
import { useAuthManager } from '@/services/authManager';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';


const RegisterScreen: React.FC = ({ navigation }: any) => {
  const { signUp, loading } = useAuthManager(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError('');
    if (!username || !password) {
        setError('Preencha todos os campos.');
        return;
    }
    try {
        await signUp({ username, password });

    } catch (e: any) {
        setError(e.response?.data || 'Falha no registro. O usuário pode já existir.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Nome de Usuário"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title={loading ? 'Carregando...' : 'Registrar'} onPress={handleRegister} disabled={loading} />
      <Button title="Voltar ao Login" onPress={() => navigation.navigate('Login')} />
      {loading && <ActivityIndicator size="large" style={styles.loading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 15, padding: 10 },
  error: { color: 'red', marginBottom: 10, textAlign: 'center' },
  loading: { marginTop: 20 },
});

export default RegisterScreen;
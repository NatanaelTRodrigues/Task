// mobile-app/src/screens/Auth/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthManager } from '@/services/authManager';

const LoginScreen: React.FC = ({ navigation }: any) => {
  const { signIn, loading } = useAuthManager(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
        setError('Preencha todos os campos.');
        return;
    }
    try {
        await signIn({ username, password });
    } catch (e: any) {
        setError(e.response?.data || 'Falha ao conectar ou credenciais inválidas.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fazer Login</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        placeholder="Usuário"
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
      <Button title={loading ? 'Carregando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
      <Button title="Criar Conta" onPress={() => navigation.navigate('Register')} />
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

export default LoginScreen;
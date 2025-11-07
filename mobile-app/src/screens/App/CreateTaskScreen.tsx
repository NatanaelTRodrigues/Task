// mobile-app/src/screens/App/CreateTaskScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createTask } from '@/services/taskService';
import Input from '@/components/Input';

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleCreate = async () => {
    if (!title) {
      Alert.alert('Erro', 'O título da tarefa é obrigatório.');
      return;
    }

    setLoading(true);
    try {
      await createTask({ title, description });
      Alert.alert('Sucesso', 'Tarefa criada!');

      // Volta para o dashboard e (em uma app real) força uma atualização da lista
      navigation.goBack(); 
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar tarefa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Nova Tarefa</Text>

      <Input
        label="Título"
        value={title}
        onChangeText={setTitle}
      />
      <Input
        label="Descrição (Opcional)"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Button 
        title={loading ? 'Salvando...' : 'Criar Tarefa'} 
        onPress={handleCreate} 
        disabled={loading}
      />
      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
});
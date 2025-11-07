// mobile-app/src/screens/App/DashboardScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useAuthManager } from '@/hooks/useAuthManager';
import { getTasks } from '@/services/taskService';
import { ITask } from '@/models/ITask';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Componente simples para renderizar cada item da lista
const TaskItem: React.FC<{ task: ITask }> = ({ task }) => (
    <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {task.description && <Text style={styles.taskDescription}>{task.description}</Text>}
        <Text style={task.completed ? styles.completed : styles.pending}>
            Status: {task.completed ? 'Concluída' : 'Pendente'}
        </Text>
    </View>
);

export default function DashboardScreen() {
  const { user, signOut } = useAuthManager();
  const navigation = useNavigation();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      // Em caso de falha de autenticação (401), o erro será capturado pela API
      // e o usuário será forçado a deslogar, se for configurado no serviço.
    } finally {
      setLoading(false);
    }
  }, []);

  // CRÍTICO: Recarrega as tarefas sempre que a tela entra em foco (ex: após criar uma nova)
  useFocusEffect(
    useCallback(() => {
      loadTasks();
      return () => {};
    }, [loadTasks])
  );

  const renderEmptyState = () => (
      <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você não tem nenhuma tarefa pendente.</Text>
          <Text style={styles.emptyText}>Crie sua primeira tarefa!</Text>
      </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Tarefas</Text>
        <TouchableOpacity onPress={signOut}>
            <Text style={styles.logoutButton}>Sair</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={styles.loading} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TaskItem task={item} />}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}

      {/* Botão Flutuante para Criar Tarefa */}
      <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('CreateTask' as never)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  logoutButton: { color: '#dc2626', fontSize: 16, fontWeight: 'bold' },
  loading: { flex: 1, justifyContent: 'center' },

  // Estilos da Lista e Card
  taskCard: { backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginTop: 10, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  taskTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  taskDescription: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  completed: { color: 'green', marginTop: 5, fontWeight: 'bold' },
  pending: { color: 'orange', marginTop: 5, fontWeight: 'bold' },

  // Estado Vazio
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, color: '#6b7280', textAlign: 'center' },

  // Botão Flutuante
  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 30, bottom: 30, backgroundColor: '#3b82f6', borderRadius: 30, elevation: 8 },
  fabText: { fontSize: 25, color: 'white' },
});
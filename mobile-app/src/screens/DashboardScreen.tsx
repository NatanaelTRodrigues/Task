// mobile-app/src/screens/App/DashboardScreen.tsx (APENAS A PARTE DO COMPONENTE PRINCIPAL E HANDLERS MUDAM)
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuthManager } from '@/hooks/useAuthManager';
import { getTasks, toggleTaskCompletion, deleteTask } from '@/services/taskService'; // NOVOS IMPORTS
import { ITask } from '@/models/ITask';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Definição das Props para TaskItem
interface TaskItemProps {
    task: ITask;
    onToggle: (task: ITask) => void;
    onDelete: (taskId: number) => void;
}

// Componente simples para renderizar cada item da lista (ATUALIZADO)
const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => (
    <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        {task.description && <Text style={styles.taskDescription}>{task.description}</Text>}
        <Text style={task.completed ? styles.completed : styles.pending}>
            Status: {task.completed ? 'Concluída' : 'Pendente'}
        </Text>

        <View style={styles.actionsContainer}>
            <TouchableOpacity 
                style={[styles.actionButton, task.completed ? styles.actionReopen : styles.actionComplete]}
                onPress={() => onToggle(task)}
            >
                <Text style={styles.actionText}>{task.completed ? 'Reabrir' : 'Concluir'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.actionButtonDelete}
                onPress={() => onDelete(task.id)}
            >
                <Text style={styles.actionText}>Excluir</Text>
            </TouchableOpacity>
        </View>
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
      Alert.alert("Erro", "Falha ao buscar tarefas. Tente novamente ou verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
      return () => {};
    }, [loadTasks])
  );

  // NOVO: Handler para Alternar Status (PUT)
  const handleToggle = async (task: ITask) => {
      try {
          const updatedTask = await toggleTaskCompletion(task);
          // Atualiza o estado local para refletir a mudança
          setTasks(prevTasks => 
              prevTasks.map(t => (t.id === updatedTask.id ? updatedTask : t))
          );
      } catch (error) {
          Alert.alert('Erro', 'Falha ao atualizar a tarefa.');
      }
  };

  // NOVO: Handler para Excluir (DELETE)
  const handleDelete = async (taskId: number) => {
      Alert.alert(
          "Confirmar Exclusão",
          "Tem certeza que deseja excluir esta tarefa permanentemente?",
          [
              { text: "Cancelar", style: "cancel" },
              { text: "Excluir", style: "destructive", onPress: async () => {
                  try {
                      await deleteTask(taskId);
                      // Remove do estado local
                      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
                      Alert.alert('Sucesso', 'Tarefa excluída.');
                  } catch (error) {
                      Alert.alert('Erro', 'Falha ao excluir a tarefa.');
                  }
              }},
          ],
          { cancelable: true }
      );
  };

  const renderEmptyState = () => (
      <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você não tem nenhuma tarefa pendente.</Text>
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
          renderItem={({ item }) => (
            <TaskItem 
                task={item} 
                onToggle={handleToggle} 
                onDelete={handleDelete} 
            />
          )}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={{ flexGrow: 1 }}
        />
      )}

      <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('CreateTask' as never)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... (Estilos existentes)
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
  logoutButton: { color: '#dc2626', fontSize: 16, fontWeight: 'bold' },
  loading: { flex: 1, justifyContent: 'center' },

  taskCard: { backgroundColor: '#fff', padding: 15, marginHorizontal: 20, marginTop: 10, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  taskTitle: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
  taskDescription: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  completed: { color: 'green', marginTop: 5, fontWeight: 'bold' },
  pending: { color: 'orange', marginTop: 5, fontWeight: 'bold' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, color: '#6b7280', textAlign: 'center' },

  fab: { position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center', right: 30, bottom: 30, backgroundColor: '#3b82f6', borderRadius: 30, elevation: 8 },
  fabText: { fontSize: 25, color: 'white' },

  // NOVOS ESTILOS PARA AÇÕES
  actionsContainer: { flexDirection: 'row', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#eee', justifyContent: 'flex-end' },
  actionButton: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginLeft: 10 },
  actionComplete: { backgroundColor: '#10b981' }, // Verde
  actionReopen: { backgroundColor: '#f97316' }, // Laranja
  actionButtonDelete: { backgroundColor: '#ef4444', paddingVertical: 5, paddingHorizontal: 10, borderRadius: 5, marginLeft: 10 }, // Vermelho
  actionText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});
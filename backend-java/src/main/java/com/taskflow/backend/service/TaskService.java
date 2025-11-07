// TaskService.java
package com.taskflow.backend.service;

import com.taskflow.backend.model.Task;
import com.taskflow.backend.model.User;
import com.taskflow.backend.repository.TaskRepository;
import com.taskflow.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository, UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
    }

    // CRIAÇÃO: Cria uma nova tarefa associada a um usuário
    public Task createTask(Task task) {
        // Garante que o usuário existe antes de salvar a tarefa
        Optional<User> userOptional = userRepository.findById(task.getUser().getId());
        if (userOptional.isEmpty()) {
            throw new RuntimeException("Usuário não encontrado.");
        }
        // Anexa o objeto User gerenciado
        task.setUser(userOptional.get());
        return taskRepository.save(task);
    }

    // LEITURA: Busca tarefas por ID do usuário (para o dashboard)
    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    
}
// TaskController.java
package com.taskflow.backend.controller;

import com.taskflow.backend.model.Task;
import com.taskflow.backend.dto.TaskMapper;
import com.taskflow.backend.dto.TaskRequest;
import com.taskflow.backend.dto.TaskResponse;
import com.taskflow.backend.model.User;
import com.taskflow.backend.service.TaskService;
import com.taskflow.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*") 
public class TaskController {

    private final TaskService taskService;
    private final UserService userService; // Necessário para buscar o usuário real

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    // Endpoint POST: Cria uma nova tarefa
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
        @RequestBody TaskRequest request,
        @AuthenticationPrincipal UserDetails userDetails // Injeta o usuário autenticado (JWT)
    ) {
        // 1. Obter o User real a partir do username do JWT
        User creator = userService.findByUsername(userDetails.getUsername());

        // 2. Converter Request para Entidade e anexar o User
        Task taskEntity = TaskMapper.toEntity(request, creator);

        // 3. Salvar
        Task createdTask = taskService.createTask(taskEntity);

        // 4. Retornar DTO de Resposta
        return new ResponseEntity<>(TaskMapper.toResponse(createdTask), HttpStatus.CREATED);
    }

    // Endpoint GET: Lista tarefas do usuário autenticado
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getMyTasks(
        @AuthenticationPrincipal UserDetails userDetails // Injeta o usuário autenticado (JWT)
    ) {
        User user = userService.findByUsername(userDetails.getUsername());

        List<Task> tasks = taskService.getTasksByUserId(user.getId());

        // Converter lista de Entidades para DTOs de Resposta
        List<TaskResponse> response = tasks.stream()
            .map(TaskMapper::toResponse)
            .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
public ResponseEntity<TaskResponse> updateTask(
    @PathVariable Long id,
    @RequestBody TaskRequest request,
    @AuthenticationPrincipal UserDetails userDetails // Injeta o usuário autenticado
) {
    // 1. Obter o User real
    User user = userService.findByUsername(userDetails.getUsername());

    // 2. Tentar buscar a tarefa, garantindo a propriedade
    Task existingTask = taskService.getTaskByIdAndUserId(id, user.getId())
        .orElseThrow(() -> new RuntimeException("Tarefa não encontrada ou acesso negado."));

    // 3. Aplicar as mudanças
    existingTask.setTitle(request.getTitle());
    existingTask.setDescription(request.getDescription());
    // Se a request tiver um campo 'completed', ele também seria mapeado aqui

    // 4. Salvar e retornar
    Task updatedTask = taskService.updateTask(existingTask);
    return ResponseEntity.ok(TaskMapper.toResponse(updatedTask));
}

// Endpoint DELETE: Remove uma tarefa
@DeleteMapping("/{id}")
public ResponseEntity<Void> deleteTask(
    @PathVariable Long id,
    @AuthenticationPrincipal UserDetails userDetails
) {
    // 1. Obter o User real
    User user = userService.findByUsername(userDetails.getUsername());

    // 2. Buscar a tarefa, garantindo a propriedade antes de deletar
    taskService.getTaskByIdAndUserId(id, user.getId())
        .orElseThrow(() -> new RuntimeException("Tarefa não encontrada ou acesso negado."));

    // 3. Deletar (se a verificação passou)
    taskService.deleteTask(id);

    // 4. Retornar No Content
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
}
    
}
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
@CrossOrigin(origins = "*") // Permite acesso do frontend
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

    
}
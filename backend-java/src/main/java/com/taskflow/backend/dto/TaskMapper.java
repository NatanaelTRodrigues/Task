// TaskMapper.java
package com.taskflow.backend.dto;

import com.taskflow.backend.model.Task;
import com.taskflow.backend.model.User;

public class TaskMapper {

    public static Task toEntity(TaskRequest request, User user) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setUser(user);
        return task;
    }

    public static TaskResponse toResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setCompleted(task.isCompleted());
        response.setCreatedAt(task.getCreatedAt());
        response.setUsername(task.getUser().getUsername());
        return response;
    }
}
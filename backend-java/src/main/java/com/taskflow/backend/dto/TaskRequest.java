// TaskRequest.java
package com.taskflow.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TaskRequest {
    private String title;
    private String description;
    private Long userId; 
}


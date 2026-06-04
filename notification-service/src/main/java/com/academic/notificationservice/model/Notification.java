package com.academic.notificationservice.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String recipient;

    @NotBlank
    @Column(nullable = false)
    private String message;

    @NotBlank
    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private boolean sent;
}

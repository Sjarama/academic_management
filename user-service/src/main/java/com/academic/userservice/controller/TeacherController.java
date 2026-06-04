package com.academic.userservice.controller;

import com.academic.userservice.model.Teacher;
import com.academic.userservice.service.TeacherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

    private final TeacherService service;

    @GetMapping
    public List<Teacher> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Teacher> getById(@PathVariable Long id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Teacher> getByEmail(@PathVariable String email) {
        return service.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Teacher> create(@Valid @RequestBody Teacher teacher) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(teacher));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Teacher> update(@PathVariable Long id, @Valid @RequestBody Teacher teacher) {
        return service.update(id, teacher)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!service.delete(id)) return ResponseEntity.notFound().build();
        return ResponseEntity.noContent().build();
    }
}

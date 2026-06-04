package com.academic.userservice.service;

import com.academic.userservice.model.Teacher;
import com.academic.userservice.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final TeacherRepository repository;

    public List<Teacher> findAll() {
        return repository.findAll();
    }

    public Optional<Teacher> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<Teacher> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public Teacher save(Teacher teacher) {
        return repository.save(teacher);
    }

    public Optional<Teacher> update(Long id, Teacher incoming) {
        return repository.findById(id).map(existing -> {
            existing.setFirstName(incoming.getFirstName());
            existing.setLastName(incoming.getLastName());
            existing.setEmail(incoming.getEmail());
            existing.setPhone(incoming.getPhone());
            existing.setAddress(incoming.getAddress());
            existing.setSpecialty(incoming.getSpecialty());
            return repository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}

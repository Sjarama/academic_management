package com.academic.userservice.service;

import com.academic.userservice.model.Student;
import com.academic.userservice.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository repository;

    public List<Student> findAll() {
        return repository.findAll();
    }

    public Optional<Student> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<Student> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public Student save(Student student) {
        return repository.save(student);
    }

    public Optional<Student> update(Long id, Student incoming) {
        return repository.findById(id).map(existing -> {
            existing.setFirstName(incoming.getFirstName());
            existing.setLastName(incoming.getLastName());
            existing.setEmail(incoming.getEmail());
            existing.setPhone(incoming.getPhone());
            existing.setAddress(incoming.getAddress());
            return repository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}

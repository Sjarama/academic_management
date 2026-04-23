package com.academic.courseservice.service;

import com.academic.courseservice.model.Course;
import com.academic.courseservice.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository repository;

    public List<Course> findAll() {
        return repository.findAll();
    }

    public Optional<Course> findById(Long id) {
        return repository.findById(id);
    }

    public List<Course> findByTeacherId(Long teacherId) {
        return repository.findByTeacherId(teacherId);
    }

    public Course save(Course course) {
        return repository.save(course);
    }

    public Optional<Course> update(Long id, Course incoming) {
        return repository.findById(id).map(existing -> {
            existing.setName(incoming.getName());
            existing.setDescription(incoming.getDescription());
            existing.setTeacherId(incoming.getTeacherId());
            existing.setCredits(incoming.getCredits());
            existing.setMaxStudents(incoming.getMaxStudents());
            return repository.save(existing);
        });
    }

    public boolean delete(Long id) {
        if (!repository.existsById(id)) return false;
        repository.deleteById(id);
        return true;
    }
}

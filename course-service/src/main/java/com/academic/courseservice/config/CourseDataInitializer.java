package com.academic.courseservice.config;

import com.academic.courseservice.model.Course;
import com.academic.courseservice.repository.CourseRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class CourseDataInitializer implements ApplicationRunner {

    private final CourseRepository courseRepository;

    public CourseDataInitializer(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (courseRepository.count() > 0) {
            return;
        }

        courseRepository.save(createCourse("Matemáticas", "Álgebra y cálculo para grados superiores.", 1L, 6, 30));
        courseRepository.save(createCourse("Programación", "Introducción a Java y desarrollo backend.", 2L, 5, 25));
        courseRepository.save(createCourse("Historia", "Historia moderna y contemporánea.", 3L, 4, 40));
    }

    private Course createCourse(String name, String description, Long teacherId, Integer credits, Integer maxStudents) {
        Course course = new Course();
        course.setName(name);
        course.setDescription(description);
        course.setTeacherId(teacherId);
        course.setCredits(credits);
        course.setMaxStudents(maxStudents);
        return course;
    }
}

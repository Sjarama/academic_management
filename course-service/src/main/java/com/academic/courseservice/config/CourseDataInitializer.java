package com.academic.courseservice.config;

import com.academic.courseservice.model.Course;
import com.academic.courseservice.repository.CourseRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class CourseDataInitializer implements ApplicationRunner {

    private final CourseRepository courseRepository;
    private final Random random = new Random();

    public CourseDataInitializer(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (courseRepository.count() > 0) {
            return;
        }

        String[] subjects = {"Matemáticas", "Programación", "Historia", "Física", "Química", "Biología", "Economía", "Filosofía", "Arte", "Diseño", "Redes", "Estadística", "Análisis de Datos", "Ingeniería", "Gestión", "Derecho", "Psicología", "Comunicación", "Marketing", "Sociología"};
        String[] descriptions = {"Curso intensivo con enfoque práctico.", "Aprende fundamentos clave.", "Contenidos actualizados para el rendimiento académico.", "Cubre teoría y casos reales.", "Métodos modernos adaptados a la carrera."};

        for (int i = 0; i < 20; i++) {
            String subject = subjects[i % subjects.length];
            String name = subject + " Avanzado";
            String description = descriptions[random.nextInt(descriptions.length)];
            Long teacherId = (long) (random.nextInt(15) + 1);
            Integer credits = random.nextInt(5) + 3;
            Integer maxStudents = random.nextInt(31) + 20;
            Integer approvalPercentage = random.nextInt(100) + 1;
            courseRepository.save(createCourse(name, description, teacherId, credits, maxStudents, approvalPercentage));
        }
    }

    private Course createCourse(String name, String description, Long teacherId, Integer credits, Integer maxStudents, Integer approvalPercentage) {
        Course course = new Course();
        course.setName(name);
        course.setDescription(description);
        course.setTeacherId(teacherId);
        course.setCredits(credits);
        course.setMaxStudents(maxStudents);
        course.setApprovalPercentage(approvalPercentage);
        return course;
    }
}

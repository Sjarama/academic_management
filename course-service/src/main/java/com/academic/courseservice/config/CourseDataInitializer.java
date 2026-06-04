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

<<<<<<< Updated upstream
        courseRepository.save(createCourse("Matemáticas", "Álgebra y cálculo para grados superiores.", 1L, 6, 30));
        courseRepository.save(createCourse("Programación", "Introducción a Java y desarrollo backend.", 2L, 5, 25));
        courseRepository.save(createCourse("Historia", "Historia moderna y contemporánea.", 3L, 4, 40));
=======
        String[] subjects = {"Matemáticas", "Programación", "Historia", "Física", "Química", "Biología", "Economía", "Filosofía", "Arte", "Diseño", "Redes", "Estadística", "Análisis de Datos", "Ingeniería", "Gestión", "Derecho", "Psicología", "Comunicación", "Marketing", "Sociología"};
        String[] descriptions = {"Curso intensivo con enfoque práctico.", "Aprende fundamentos clave.", "Contenidos actualizados para el rendimiento académico.", "Cubre teoría y casos reales.", "Métodos modernos adaptados a la carrera."};

        for (int i = 0; i < 20; i++) {
            String subject = subjects[i];
            String name = subject + " Avanzado";
            String description = descriptions[random.nextInt(descriptions.length)];
            Long teacherId = (long) (i + 1); // Profesor i tiene el curso i (profesor 1 -> curso 1, profesor 2 -> curso 2, etc.)
            Integer credits = random.nextInt(5) + 3;
            Integer maxStudents = random.nextInt(31) + 20;
            Integer approvalPercentage = random.nextInt(100) + 1;
            courseRepository.save(createCourse(name, description, teacherId, credits, maxStudents, approvalPercentage));
        }
>>>>>>> Stashed changes
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

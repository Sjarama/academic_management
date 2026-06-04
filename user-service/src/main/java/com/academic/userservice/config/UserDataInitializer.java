package com.academic.userservice.config;

import com.academic.userservice.model.Student;
import com.academic.userservice.model.Teacher;
import com.academic.userservice.repository.StudentRepository;
import com.academic.userservice.repository.TeacherRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class UserDataInitializer implements ApplicationRunner {

    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final Random random = new Random();

    public UserDataInitializer(StudentRepository studentRepository, TeacherRepository teacherRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        boolean hasStudents = studentRepository.count() > 0;
        boolean hasTeachers = teacherRepository.count() > 0;

        String[] firstNames = {"Ana", "Carlos", "María", "Sofía", "Pablo", "Julieta", "Diego", "Isabel", "Mateo", "Valentina", "Camila", "Agustín", "Fernanda", "Nicolás", "Lucía", "Sebastián", "Catalina", "Benjamín", "Antonia", "José"};
        String[] lastNames = {"Pérez", "López", "Gómez", "Martínez", "Rodríguez", "Sánchez", "Castillo", "Morales", "Vargas", "Fuentes", "Navarro", "Rojas", "Molina", "Jiménez", "Ortiz", "Torres", "Paredes", "Muñoz", "Bravo", "Silva"};
        String[] specialties = {"Matemáticas", "Programación", "Historia", "Física", "Química", "Biología", "Economía", "Filosofía", "Arte", "Diseño", "Redes", "Estadística", "Análisis de Datos", "Ingeniería", "Gestión", "Derecho", "Psicología", "Comunicación", "Marketing", "Sociología"};

        if (!hasTeachers) {
            for (int i = 0; i < 20; i++) {
                String firstName = firstNames[i % firstNames.length];
                String lastName = lastNames[i % lastNames.length];
                String specialty = specialties[i];
                String email = String.format("profesor%d@example.com", i + 1);
                String phone = String.format("+56 9 8765 %04d", 4321 + i);
                String address = String.format("Avenida Profesor %d", i + 1);
                teacherRepository.save(createTeacher(firstName, lastName, email, phone, address, specialty));
            }
        }

        if (!hasStudents) {
            for (int i = 1; i <= 70; i++) {
                String firstName = firstNames[random.nextInt(firstNames.length)];
                String lastName = lastNames[random.nextInt(lastNames.length)];
                String email = String.format("%s.%s%d@example.com", firstName.toLowerCase(), lastName.toLowerCase(), i);
                String phone = String.format("+56 9 %04d %04d", random.nextInt(10000), random.nextInt(10000));
                String address = String.format("Calle %d %d", random.nextInt(120) + 1, random.nextInt(200) + 1);
                String comuna = Student.REGION_METROPOLITANA_COMUNAS.get(random.nextInt(Student.REGION_METROPOLITANA_COMUNAS.size()));
                studentRepository.save(createStudent(firstName, lastName, email, phone, address, comuna));
            }
        } else {
            studentRepository.findAll().stream()
                    .filter(student -> student.getComuna() == null || student.getComuna().isBlank())
                    .forEach(student -> {
                        student.setComuna(Student.REGION_METROPOLITANA_COMUNAS.get(random.nextInt(Student.REGION_METROPOLITANA_COMUNAS.size())));
                        studentRepository.save(student);
                    });
        }
    }

    private Student createStudent(String firstName, String lastName, String email, String phone, String address, String comuna) {
        Student student = new Student();
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setEmail(email);
        student.setPhone(phone);
        student.setAddress(address);
        student.setComuna(comuna);
        return student;
    }

    private Teacher createTeacher(String firstName, String lastName, String email, String phone, String address, String specialty) {
        Teacher teacher = new Teacher();
        teacher.setFirstName(firstName);
        teacher.setLastName(lastName);
        teacher.setEmail(email);
        teacher.setPhone(phone);
        teacher.setAddress(address);
        teacher.setSpecialty(specialty);
        return teacher;
    }
}

package com.academic.userservice.config;

import com.academic.userservice.model.Student;
import com.academic.userservice.model.Teacher;
import com.academic.userservice.repository.StudentRepository;
import com.academic.userservice.repository.TeacherRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class UserDataInitializer implements ApplicationRunner {

    private final StudentRepository studentRepository;
<<<<<<< Updated upstream
=======
    private final TeacherRepository teacherRepository;
    private final Random random = new Random();
>>>>>>> Stashed changes

    public UserDataInitializer(StudentRepository studentRepository, TeacherRepository teacherRepository) {
        this.studentRepository = studentRepository;
        this.teacherRepository = teacherRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (studentRepository.count() > 0 && teacherRepository.count() > 0) {
            return;
        }

<<<<<<< Updated upstream
        studentRepository.save(createStudent("Ana", "Pérez", "ana.perez@example.com", "+34 600 123 456", "Calle Mayor 10"));
        studentRepository.save(createStudent("Carlos", "López", "carlos.lopez@example.com", "+34 600 654 321", "Avenida Constitución 22"));
        studentRepository.save(createStudent("María", "Gómez", "maria.gomez@example.com", "+34 600 987 654", "Plaza España 5"));
=======
        String[] firstNames = {"Ana", "Carlos", "María", "Sofía", "Pablo", "Julieta", "Diego", "Isabel", "Mateo", "Valentina", "Camila", "Agustín", "Fernanda", "Nicolás", "Lucía", "Sebastián", "Catalina", "Benjamín", "Antonia", "José"};
        String[] lastNames = {"Pérez", "López", "Gómez", "Martínez", "Rodríguez", "Sánchez", "Castillo", "Morales", "Vargas", "Fuentes", "Navarro", "Rojas", "Molina", "Jiménez", "Ortiz", "Torres", "Paredes", "Muñoz", "Bravo", "Silva"};
        String[] specialties = {"Matemáticas", "Programación", "Historia", "Física", "Química", "Biología", "Economía", "Filosofía", "Arte", "Diseño", "Redes", "Estadística", "Análisis de Datos", "Ingeniería", "Gestión", "Derecho", "Psicología", "Comunicación", "Marketing", "Sociología"};

        // Crear 20 profesores
        if (teacherRepository.count() == 0) {
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

        // Crear estudiantes
        if (studentRepository.count() == 0) {
            for (int i = 1; i <= 70; i++) {
                String firstName = firstNames[random.nextInt(firstNames.length)];
                String lastName = lastNames[random.nextInt(lastNames.length)];
                String email = String.format("%s.%s%d@example.com", firstName.toLowerCase(), lastName.toLowerCase(), i);
                String phone = String.format("+56 9 %04d %04d", random.nextInt(10000), random.nextInt(10000));
                String address = String.format("Calle %d %d", random.nextInt(120) + 1, random.nextInt(200) + 1);
                String comuna = Student.REGION_METROPOLITANA_COMUNAS.get(random.nextInt(Student.REGION_METROPOLITANA_COMUNAS.size()));
                studentRepository.save(createStudent(firstName, lastName, email, phone, address, comuna));
            }
        }
>>>>>>> Stashed changes
    }

    private Student createStudent(String firstName, String lastName, String email, String phone, String address) {
        Student student = new Student();
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setEmail(email);
        student.setPhone(phone);
        student.setAddress(address);
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

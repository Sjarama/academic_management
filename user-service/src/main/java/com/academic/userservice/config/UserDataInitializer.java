package com.academic.userservice.config;

import com.academic.userservice.model.Student;
import com.academic.userservice.repository.StudentRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class UserDataInitializer implements ApplicationRunner {

    private final StudentRepository studentRepository;

    public UserDataInitializer(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (studentRepository.count() > 0) {
            return;
        }

        studentRepository.save(createStudent("Ana", "Pérez", "ana.perez@example.com", "+34 600 123 456", "Calle Mayor 10"));
        studentRepository.save(createStudent("Carlos", "López", "carlos.lopez@example.com", "+34 600 654 321", "Avenida Constitución 22"));
        studentRepository.save(createStudent("María", "Gómez", "maria.gomez@example.com", "+34 600 987 654", "Plaza España 5"));
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
}

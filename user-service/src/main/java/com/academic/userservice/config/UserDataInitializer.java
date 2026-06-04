package com.academic.userservice.config;

import com.academic.userservice.model.Student;
import com.academic.userservice.repository.StudentRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class UserDataInitializer implements ApplicationRunner {

    private final StudentRepository studentRepository;
    private final Random random = new Random();

    public UserDataInitializer(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (studentRepository.count() > 0) {
            return;
        }

        String[] firstNames = {"Ana", "Carlos", "María", "Sofía", "Pablo", "Julieta", "Diego", "Isabel", "Mateo", "Valentina", "Camila", "Agustín", "Fernanda", "Nicolás", "Lucía", "Sebastián", "Catalina", "Benjamín", "Antonia", "José"};
        String[] lastNames = {"Pérez", "López", "Gómez", "Martínez", "Rodríguez", "Sánchez", "Castillo", "Morales", "Vargas", "Fuentes", "Navarro", "Rojas", "Molina", "Jiménez", "Ortiz", "Torres", "Paredes", "Muñoz", "Bravo", "Silva"};

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
}

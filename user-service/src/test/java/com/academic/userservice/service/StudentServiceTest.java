package com.academic.userservice.service;

import com.academic.userservice.model.Student;
import com.academic.userservice.repository.StudentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    StudentRepository repository;

    @InjectMocks
    StudentService service;

    @Test
    void findAll_returnsAllStudents() {
        Student s = new Student();
        s.setFirstName("Ana");
        s.setLastName("Pérez");
        when(repository.findAll()).thenReturn(List.of(s));

        List<Student> result = service.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFirstName()).isEqualTo("Ana");
    }

    @Test
    void findById_existingId_returnsStudent() {
        Student s = new Student();
        s.setId(1L);
        s.setFirstName("Carlos");
        when(repository.findById(1L)).thenReturn(Optional.of(s));

        Optional<Student> result = service.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getFirstName()).isEqualTo("Carlos");
    }

    @Test
    void findById_missingId_returnsEmpty() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThat(service.findById(99L)).isEmpty();
    }

    @Test
    void findByEmail_existingEmail_returnsStudent() {
        Student s = new Student();
        s.setEmail("ana@test.com");
        when(repository.findByEmail("ana@test.com")).thenReturn(Optional.of(s));

        assertThat(service.findByEmail("ana@test.com")).isPresent();
    }

    @Test
    void findByEmail_missingEmail_returnsEmpty() {
        when(repository.findByEmail("noexiste@test.com")).thenReturn(Optional.empty());

        assertThat(service.findByEmail("noexiste@test.com")).isEmpty();
    }

    @Test
    void save_persistsAndReturnsStudent() {
        Student s = new Student();
        s.setFirstName("María");
        s.setEmail("maria@test.com");
        when(repository.save(s)).thenReturn(s);

        Student result = service.save(s);

        assertThat(result.getFirstName()).isEqualTo("María");
        verify(repository).save(s);
    }

    @Test
    void update_existingId_updatesFields() {
        Student existing = new Student();
        existing.setId(1L);
        existing.setFirstName("Viejo");

        Student incoming = new Student();
        incoming.setFirstName("Nuevo");
        incoming.setLastName("Apellido");
        incoming.setEmail("nuevo@test.com");
        incoming.setPhone("123");
        incoming.setAddress("Calle 1");
        incoming.setComuna("Santiago");

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Optional<Student> result = service.update(1L, incoming);

        assertThat(result).isPresent();
        assertThat(result.get().getFirstName()).isEqualTo("Nuevo");
    }

    @Test
    void update_missingId_returnsEmpty() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThat(service.update(99L, new Student())).isEmpty();
    }

    @Test
    void delete_existingId_deletesAndReturnsTrue() {
        when(repository.existsById(1L)).thenReturn(true);

        boolean result = service.delete(1L);

        assertThat(result).isTrue();
        verify(repository).deleteById(1L);
    }

    @Test
    void delete_missingId_returnsFalse() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThat(service.delete(99L)).isFalse();
        verify(repository, never()).deleteById(any());
    }
}

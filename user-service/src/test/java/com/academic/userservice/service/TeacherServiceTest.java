package com.academic.userservice.service;

import com.academic.userservice.model.Teacher;
import com.academic.userservice.repository.TeacherRepository;
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
class TeacherServiceTest {

    @Mock
    TeacherRepository repository;

    @InjectMocks
    TeacherService service;

    @Test
    void findAll_returnsAllTeachers() {
        Teacher t = new Teacher();
        t.setFirstName("Juan");
        when(repository.findAll()).thenReturn(List.of(t));

        assertThat(service.findAll()).hasSize(1);
    }

    @Test
    void findById_existingId_returnsTeacher() {
        Teacher t = new Teacher();
        t.setId(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(t));

        assertThat(service.findById(1L)).isPresent();
    }

    @Test
    void findById_missingId_returnsEmpty() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThat(service.findById(99L)).isEmpty();
    }

    @Test
    void findByEmail_found_returnsTeacher() {
        Teacher t = new Teacher();
        t.setEmail("prof@test.com");
        when(repository.findByEmail("prof@test.com")).thenReturn(Optional.of(t));

        assertThat(service.findByEmail("prof@test.com")).isPresent();
    }

    @Test
    void save_persistsTeacher() {
        Teacher t = new Teacher();
        t.setFirstName("Pedro");
        when(repository.save(t)).thenReturn(t);

        Teacher result = service.save(t);

        assertThat(result.getFirstName()).isEqualTo("Pedro");
        verify(repository).save(t);
    }

    @Test
    void update_existingId_updatesFields() {
        Teacher existing = new Teacher();
        existing.setId(1L);
        existing.setFirstName("Antiguo");

        Teacher incoming = new Teacher();
        incoming.setFirstName("Actualizado");
        incoming.setLastName("Apellido");
        incoming.setEmail("updated@test.com");
        incoming.setPhone("999");
        incoming.setAddress("Av. Nueva");
        incoming.setSpecialty("Física");

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Optional<Teacher> result = service.update(1L, incoming);

        assertThat(result).isPresent();
        assertThat(result.get().getFirstName()).isEqualTo("Actualizado");
        assertThat(result.get().getSpecialty()).isEqualTo("Física");
    }

    @Test
    void update_missingId_returnsEmpty() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThat(service.update(99L, new Teacher())).isEmpty();
    }

    @Test
    void delete_existingId_deletesAndReturnsTrue() {
        when(repository.existsById(1L)).thenReturn(true);

        assertThat(service.delete(1L)).isTrue();
        verify(repository).deleteById(1L);
    }

    @Test
    void delete_missingId_returnsFalse() {
        when(repository.existsById(99L)).thenReturn(false);

        assertThat(service.delete(99L)).isFalse();
        verify(repository, never()).deleteById(any());
    }
}

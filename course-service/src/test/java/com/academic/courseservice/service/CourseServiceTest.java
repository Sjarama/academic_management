package com.academic.courseservice.service;

import com.academic.courseservice.model.Course;
import com.academic.courseservice.repository.CourseRepository;
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
class CourseServiceTest {

    @Mock
    CourseRepository repository;

    @InjectMocks
    CourseService service;

    @Test
    void findAll_returnsAllCourses() {
        Course c = new Course();
        c.setName("Matemáticas");
        when(repository.findAll()).thenReturn(List.of(c));

        List<Course> result = service.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Matemáticas");
    }

    @Test
    void findAll_empty_returnsEmptyList() {
        when(repository.findAll()).thenReturn(List.of());

        assertThat(service.findAll()).isEmpty();
    }

    @Test
    void findById_existingId_returnsCourse() {
        Course c = new Course();
        c.setId(1L);
        c.setName("Programación");
        when(repository.findById(1L)).thenReturn(Optional.of(c));

        Optional<Course> result = service.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Programación");
    }

    @Test
    void findById_missingId_returnsEmpty() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThat(service.findById(99L)).isEmpty();
    }

    @Test
    void findByTeacherId_returnsMatchingCourses() {
        Course c = new Course();
        c.setTeacherId(2L);
        when(repository.findByTeacherId(2L)).thenReturn(List.of(c));

        List<Course> result = service.findByTeacherId(2L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTeacherId()).isEqualTo(2L);
    }

    @Test
    void save_persistsAndReturnsCourse() {
        Course c = new Course();
        c.setName("Historia");
        c.setTeacherId(1L);
        when(repository.save(c)).thenReturn(c);

        Course result = service.save(c);

        assertThat(result.getName()).isEqualTo("Historia");
        verify(repository).save(c);
    }

    @Test
    void update_existingId_updatesAllFields() {
        Course existing = new Course();
        existing.setId(1L);
        existing.setName("Viejo Nombre");
        existing.setTeacherId(1L);

        Course incoming = new Course();
        incoming.setName("Nuevo Nombre");
        incoming.setDescription("Nueva descripción");
        incoming.setTeacherId(2L);
        incoming.setCredits(6);
        incoming.setMaxStudents(35);

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Optional<Course> result = service.update(1L, incoming);

        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("Nuevo Nombre");
        assertThat(result.get().getCredits()).isEqualTo(6);
        assertThat(result.get().getTeacherId()).isEqualTo(2L);
    }

    @Test
    void update_missingId_returnsEmpty() {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        assertThat(service.update(99L, new Course())).isEmpty();
        verify(repository, never()).save(any());
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

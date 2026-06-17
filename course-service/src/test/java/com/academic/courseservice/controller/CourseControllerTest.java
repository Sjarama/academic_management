package com.academic.courseservice.controller;

import com.academic.courseservice.model.Course;
import com.academic.courseservice.service.CourseService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseControllerTest {

    @Mock
    CourseService service;

    @InjectMocks
    CourseController controller;

    private Course buildCourse(Long id, String name) {
        Course c = new Course();
        c.setId(id);
        c.setName(name);
        c.setDescription("Descripción de " + name);
        c.setTeacherId(1L);
        c.setCredits(4);
        c.setMaxStudents(30);
        c.setApprovalPercentage(70);
        return c;
    }

    @Test
    void getAll_returnsList() {
        when(service.findAll()).thenReturn(List.of(buildCourse(1L, "Fullstack"), buildCourse(2L, "Backend")));

        List<Course> result = controller.getAll();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Fullstack");
    }

    @Test
    void getAll_empty_returnsEmptyList() {
        when(service.findAll()).thenReturn(List.of());

        assertThat(controller.getAll()).isEmpty();
    }

    @Test
    void getById_existing_returnsOk() {
        Course c = buildCourse(1L, "Fullstack");
        when(service.findById(1L)).thenReturn(Optional.of(c));

        var response = controller.getById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getName()).isEqualTo("Fullstack");
    }

    @Test
    void getById_missing_returnsNotFound() {
        when(service.findById(99L)).thenReturn(Optional.empty());

        var response = controller.getById(99L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void getByTeacher_returnsList() {
        when(service.findByTeacherId(1L)).thenReturn(List.of(buildCourse(1L, "Curso A")));

        List<Course> result = controller.getByTeacher(1L);

        assertThat(result).hasSize(1);
    }

    @Test
    void create_returnsCreated() {
        Course input = buildCourse(null, "Nuevo Curso");
        Course saved = buildCourse(5L, "Nuevo Curso");
        when(service.save(any())).thenReturn(saved);

        var response = controller.create(input);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getId()).isEqualTo(5L);
    }

    @Test
    void update_existing_returnsOk() {
        Course updated = buildCourse(1L, "Actualizado");
        when(service.update(eq(1L), any())).thenReturn(Optional.of(updated));

        var response = controller.update(1L, buildCourse(null, "Actualizado"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getName()).isEqualTo("Actualizado");
    }

    @Test
    void update_missing_returnsNotFound() {
        when(service.update(eq(99L), any())).thenReturn(Optional.empty());

        var response = controller.update(99L, new Course());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    void delete_existing_returnsNoContent() {
        when(service.delete(1L)).thenReturn(true);

        var response = controller.delete(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(service).delete(1L);
    }

    @Test
    void delete_missing_returnsNotFound() {
        when(service.delete(99L)).thenReturn(false);

        var response = controller.delete(99L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}

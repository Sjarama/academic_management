package com.academic.courseservice.controller;

import com.academic.courseservice.dto.StudentDto;
import com.academic.courseservice.model.Course;
import com.academic.courseservice.repository.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportControllerTest {

    @Mock
    CourseRepository courseRepository;

    ReportController controller;

    @BeforeEach
    void setUp() {
        // URL deliberadamente incorrecta para que loadStudents() retorne array vacío
        controller = new ReportController(courseRepository, "http://localhost:9999");
    }

    private Course buildCourse(Long id, String name) {
        Course c = new Course();
        c.setId(id);
        c.setName(name);
        c.setDescription("Descripción de " + name);
        c.setTeacherId(1L);
        c.setCredits(4);
        c.setMaxStudents(30);
        return c;
    }

    @Test
    void reportPage_withEmptyCourses_returnsHtmlWithNoCoursesMessage() {
        when(courseRepository.findAll()).thenReturn(List.of());

        String html = controller.reportPage();

        assertThat(html).contains("No hay cursos registrados");
        assertThat(html).contains("Academia - Cursos y Estudiantes");
    }

    @Test
    void reportPage_withCourses_rendersCoursesTable() {
        when(courseRepository.findAll()).thenReturn(List.of(
                buildCourse(1L, "Fullstack III"),
                buildCourse(2L, "Backend con Spring")
        ));

        String html = controller.reportPage();

        assertThat(html).contains("Fullstack III");
        assertThat(html).contains("Backend con Spring");
        assertThat(html).contains("<table>");
    }

    @Test
    void reportPage_withNullDescription_rendersEmptyCell() {
        Course c = buildCourse(1L, "Curso sin desc");
        c.setDescription(null);
        c.setCredits(null);
        c.setMaxStudents(null);
        when(courseRepository.findAll()).thenReturn(List.of(c));

        String html = controller.reportPage();

        assertThat(html).contains("Curso sin desc");
        assertThat(html).doesNotContain("null");
    }

    @Test
    void reportPage_studentsUnavailable_rendersNoStudentsMessage() {
        when(courseRepository.findAll()).thenReturn(List.of());

        String html = controller.reportPage();

        assertThat(html).contains("No se pudo cargar la lista de estudiantes");
    }

    @Test
    void reportPage_withTrailingSlashUrl_removesSlashAndHandlesGracefully() {
        ReportController ctrlSlash = new ReportController(courseRepository, "http://localhost:9999/");
        when(courseRepository.findAll()).thenReturn(List.of(buildCourse(1L, "Curso")));

        String html = ctrlSlash.reportPage();

        assertThat(html).contains("Curso");
    }

    @Test
    void studentDto_accessors_workCorrectly() {
        StudentDto dto = new StudentDto(1L, "Ana", "Pérez", "ana@test.com", "+56 9 1234", "Calle 1");

        assertThat(dto.id()).isEqualTo(1L);
        assertThat(dto.firstName()).isEqualTo("Ana");
        assertThat(dto.lastName()).isEqualTo("Pérez");
        assertThat(dto.email()).isEqualTo("ana@test.com");
        assertThat(dto.phone()).isEqualTo("+56 9 1234");
        assertThat(dto.address()).isEqualTo("Calle 1");
        assertThat(dto.toString()).contains("Ana");
        assertThat(dto).isEqualTo(new StudentDto(1L, "Ana", "Pérez", "ana@test.com", "+56 9 1234", "Calle 1"));
        assertThat(dto.hashCode()).isNotZero();
    }
}

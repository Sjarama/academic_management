package com.academic.courseservice.controller;

import com.academic.courseservice.dto.StudentDto;
import com.academic.courseservice.model.Course;
import com.academic.courseservice.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class ReportController {

    private final CourseRepository courseRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String userServiceUrl;

    public ReportController(CourseRepository courseRepository,
                            @Value("${user.service.url:http://user-service:8081}") String userServiceUrl) {
        this.courseRepository = courseRepository;
        this.userServiceUrl = userServiceUrl;
    }

    @GetMapping(value = {"/", "/report"}, produces = MediaType.TEXT_HTML_VALUE)
    public String reportPage() {
        List<Course> courses = courseRepository.findAll();
        StudentDto[] students = loadStudents();
        return buildHtml(courses, students);
    }

    private StudentDto[] loadStudents() {
        try {
            String baseUrl = userServiceUrl.endsWith("/") ? userServiceUrl.substring(0, userServiceUrl.length() - 1) : userServiceUrl;
            String url = baseUrl + "/api/students";
            StudentDto[] result = restTemplate.getForObject(url, StudentDto[].class);
            return result == null ? new StudentDto[0] : result;
        } catch (Exception ex) {
            return new StudentDto[0];
        }
    }

    private String buildHtml(List<Course> courses, StudentDto[] students) {
        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang=\"es\"><head>");
        html.append("<meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
        html.append("<title>Listado de cursos y estudiantes</title>");
        html.append("<style>body{font-family:Arial,Helvetica,sans-serif;background:#f5f7fb;color:#212121;margin:0;padding:20px;} ");
        html.append("h1,h2{color:#2c3e50;} table{width:100%;border-collapse:collapse;margin-bottom:30px;} ");
        html.append("th,td{padding:12px 10px;border:1px solid #dfe3e8;text-align:left;} th{background:#2c3e50;color:#fff;} ");
        html.append("tr:nth-child(even){background:#eef2f7;} .container{max-width:1100px;margin:0 auto;} .note{margin-bottom:15px;color:#555;}");
        html.append("</style></head><body><div class=\"container\">");
        html.append("<h1>Academia - Cursos y Estudiantes</h1>");
        html.append("<p class=\"note\">Datos cargados desde Docker. El servicio de cursos muestra los cursos y consulta estudiantes desde el servicio de usuarios.</p>");

        html.append("<section><h2>Cursos</h2>");
        if (courses.isEmpty()) {
            html.append("<p>No hay cursos registrados.</p>");
        } else {
            html.append("<table><thead><tr><th>ID</th><th>Nombre</th><th>Descripción</th><th>Profesor</th><th>Créditos</th><th>Máx. alumnos</th></tr></thead><tbody>");
            for (Course course : courses) {
                html.append("<tr>")
                        .append("<td>").append(course.getId()).append("</td>")
                        .append("<td>").append(course.getName()).append("</td>")
                        .append("<td>").append(course.getDescription() == null ? "" : course.getDescription()).append("</td>")
                        .append("<td>").append(course.getTeacherId()).append("</td>")
                        .append("<td>").append(course.getCredits() == null ? "" : course.getCredits()).append("</td>")
                        .append("<td>").append(course.getMaxStudents() == null ? "" : course.getMaxStudents()).append("</td>")
                        .append("</tr>");
            }
            html.append("</tbody></table>");
        }
        html.append("</section>");

        html.append("<section><h2>Estudiantes</h2>");
        if (students.length == 0) {
            html.append("<p>No se pudo cargar la lista de estudiantes o no hay estudiantes registrados.</p>");
        } else {
            html.append("<table><thead><tr><th>ID</th><th>Nombre</th><th>Email</th><th>Teléfono</th><th>Dirección</th></tr></thead><tbody>");
            for (StudentDto student : students) {
                html.append("<tr>")
                        .append("<td>").append(student.id()).append("</td>")
                        .append("<td>").append(student.firstName()).append(" ").append(student.lastName()).append("</td>")
                        .append("<td>").append(student.email()).append("</td>")
                        .append("<td>").append(student.phone() == null ? "" : student.phone()).append("</td>")
                        .append("<td>").append(student.address() == null ? "" : student.address()).append("</td>")
                        .append("</tr>");
            }
            html.append("</tbody></table>");
        }
        html.append("</section>");
        html.append("</div></body></html>");
        return html.toString();
    }
}

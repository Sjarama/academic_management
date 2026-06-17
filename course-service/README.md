# Course Service

Microservicio de gestión de cursos académicos. Administra cursos, su asignación a profesores y el porcentaje de aprobación.

## Tecnologías
- Java 21 · Spring Boot 3 · Spring Data JPA
- MySQL 8.0 (base de datos: `db_cursos`)
- Docker · Maven

## Puerto
`8082`

## Endpoints

### Cursos `/api/courses`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/courses` | Listar todos los cursos |
| GET | `/api/courses/{id}` | Obtener curso por ID |
| POST | `/api/courses` | Crear nuevo curso |
| PUT | `/api/courses/{id}` | Actualizar curso |
| DELETE | `/api/courses/{id}` | Eliminar curso |

## Modelo de datos

**Course**: `id, name, description, teacherId, credits, maxStudents, approvalPercentage (1–100)`

## Ejecución local (Docker)

```bash
docker-compose up course-db course-service
```

## Ejecución local (Maven)

```bash
cd course-service
./mvnw spring-boot:run
```

## Tests

```bash
./mvnw test
# Reporte JaCoCo: target/site/jacoco/index.html
```

## Variables de entorno
| Variable | Valor por defecto |
|----------|-----------------|
| DB_HOST | course-db |
| DB_PORT | 3306 |
| DB_NAME | db_cursos |
| DB_USER | root |
| DB_PASS | secret |
| USER_SERVICE_URL | http://user-service:8081 |

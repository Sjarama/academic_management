# User Service

Microservicio de gestión de usuarios del sistema académico. Administra estudiantes y profesores.

## Tecnologías
- Java 21 · Spring Boot 3 · Spring Data JPA
- MySQL 8.0 (base de datos: `db_usuarios`)
- Docker · Maven

## Puerto
`8081`

## Endpoints

### Estudiantes `/api/students`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/students` | Listar todos los estudiantes |
| GET | `/api/students/{id}` | Obtener estudiante por ID |
| GET | `/api/students/comunas` | Listar comunas disponibles |
| POST | `/api/students` | Crear nuevo estudiante |
| PUT | `/api/students/{id}` | Actualizar estudiante |
| DELETE | `/api/students/{id}` | Eliminar estudiante |

### Profesores `/api/teachers`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/teachers` | Listar todos los profesores |
| GET | `/api/teachers/{id}` | Obtener profesor por ID |
| POST | `/api/teachers` | Crear nuevo profesor |
| PUT | `/api/teachers/{id}` | Actualizar profesor |
| DELETE | `/api/teachers/{id}` | Eliminar profesor |

## Modelo de datos

**Student**: `id, firstName, lastName, email (unique), phone, address, comuna`

**Teacher**: `id, firstName, lastName, email (unique), phone, address, specialty`

## Ejecución local (Docker)

```bash
docker-compose up user-db user-service
```

## Ejecución local (Maven)

```bash
cd user-service
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
| DB_HOST | user-db |
| DB_PORT | 3306 |
| DB_NAME | db_usuarios |
| DB_USER | root |
| DB_PASS | secret |

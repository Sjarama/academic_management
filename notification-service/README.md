# Notification Service

Microservicio de gestión de notificaciones del sistema académico. Permite crear, consultar y administrar notificaciones enviadas a estudiantes y profesores.

## Tecnologías
- Java 21 · Spring Boot 3 · Spring Data JPA
- MySQL 8.0 (base de datos: `db_notificaciones`)
- Docker · Maven

## Puerto
`8084`

## Endpoints

### Notificaciones `/api/notifications`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/notifications` | Listar todas las notificaciones |
| GET | `/api/notifications/{id}` | Obtener notificación por ID |
| POST | `/api/notifications` | Crear nueva notificación |
| PUT | `/api/notifications/{id}` | Actualizar notificación |
| DELETE | `/api/notifications/{id}` | Eliminar notificación |

## Modelo de datos

**Notification**: `id, recipient, message, type, sent (boolean), sentAt`

**Tipos comunes**: `PAGO_PENDIENTE`, `PAGO_CONFIRMADO`, `BIENVENIDA`, `RECORDATORIO`

## Ejecución local (Docker)

```bash
docker-compose up notification-db notification-service
```

## Ejecución local (Maven)

```bash
cd notification-service
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
| DB_HOST | notification-db |
| DB_PORT | 3306 |
| DB_NAME | db_notificaciones |
| DB_USER | root |
| DB_PASS | secret |

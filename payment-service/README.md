# Payment Service

Microservicio de gestión de pagos del sistema académico. Registra y administra los pagos de estudiantes, incluyendo monto, fecha de vencimiento y estado.

## Tecnologías
- Java 21 · Spring Boot 3 · Spring Data JPA
- MySQL 8.0 (base de datos: `db_pagos`)
- Docker · Maven

## Puerto
`8083`

## Endpoints

### Pagos `/api/payments`
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/payments` | Listar todos los pagos |
| GET | `/api/payments/{id}` | Obtener pago por ID |
| POST | `/api/payments` | Registrar nuevo pago |
| PUT | `/api/payments/{id}` | Actualizar pago |
| DELETE | `/api/payments/{id}` | Eliminar pago |

## Modelo de datos

**Payment**: `id, studentId, courseId (opcional), amount, status, dueDate`

**Estados**: `Pendiente`, `Pagado`, `Vencido`

## Ejecución local (Docker)

```bash
docker-compose up payment-db payment-service
```

## Ejecución local (Maven)

```bash
cd payment-service
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
| DB_HOST | payment-db |
| DB_PORT | 3306 |
| DB_NAME | db_pagos |
| DB_USER | root |
| DB_PASS | secret |

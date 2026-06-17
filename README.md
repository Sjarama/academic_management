# Sistema de Gestión Académica

**DSY1106 - Desarrollo Fullstack III — EP3**  
Duoc UC | Sede Mac-Iver

Plataforma de gestión académica basada en arquitectura de microservicios con Spring Boot, React y Docker.

---

## Arquitectura del sistema

```
┌──────────────────────────────────────────────────────────────────┐
│                   Frontend React (Vite + Chart.js)               │
│                      http://localhost:5501                       │
└─────────────────────────┬────────────────────────────────────────┘
                          │ HTTP REST / CORS
         ┌────────────────┼──────────────────┐──────────────────┐
         │                │                  │                  │
         ▼                ▼                  ▼                  ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ user-service │ │course-service│ │payment-svc   │ │notif-service │
│   :8081      │ │   :8082      │ │   :8083      │ │   :8084      │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │
       ▼                ▼                ▼                ▼
  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
  │ user-db │    │course-db │    │payment-db│    │notification-db│
  │  :3307  │    │  :3308   │    │  :3309   │    │    :3310      │
  └─────────┘    └──────────┘    └──────────┘    └──────────────┘

                    ┌─────────────────┐
                    │    RabbitMQ     │
                    │  :5672 / :15672 │
                    └─────────────────┘
```

## Microservicios

| Servicio | Puerto | Base de datos | Descripción |
|----------|--------|---------------|-------------|
| [user-service](./user-service/README.md) | 8081 | db_usuarios | Estudiantes y profesores |
| [course-service](./course-service/README.md) | 8082 | db_cursos | Cursos académicos |
| [payment-service](./payment-service/README.md) | 8083 | db_pagos | Pagos estudiantiles |
| [notification-service](./notification-service/README.md) | 8084 | db_notificaciones | Notificaciones |

## Stack tecnológico

- **Backend**: Java 21, Spring Boot 3, Spring Data JPA, Hibernate, Lombok
- **Frontend**: React 18, Vite, Chart.js 4, Axios
- **Base de datos**: MySQL 8.0 (una por microservicio — aislamiento total)
- **Mensajería**: RabbitMQ 3
- **Contenedores**: Docker, Docker Compose
- **Cobertura**: JaCoCo Maven Plugin (≥ 60% en todos los servicios)

---

## Requisitos previos

- Docker Desktop (con el motor corriendo)
- Git

## Despliegue completo

```bash
# 1. Iniciar Docker Desktop
docker desktop start

# 2. Clonar el repositorio
git clone https://github.com/Sjarama/academic_management.git
cd academic_management

# 3. Levantar todo el stack (build + contenedores)
docker-compose up --build -d

# 4. Verificar que todos los contenedores estén corriendo
docker ps
```

La aplicación estará disponible en **http://localhost:5501**

---

## Tests y cobertura JaCoCo

```bash
cd user-service         && ./mvnw test   # → 65.6% cobertura
cd course-service       && ./mvnw test   # → 86.2% cobertura
cd payment-service      && ./mvnw test   # → 98.2% cobertura
cd notification-service && ./mvnw test   # → 68.6% cobertura

# Reporte HTML en: target/site/jacoco/index.html
```

## Colección Postman

Importar `postman/Academic_Management_API.postman_collection.json` en Postman.  
Contiene todos los endpoints CRUD para los 4 microservicios con ejemplos de request/response.

## Verificación de base de datos (MySQL directo)

```bash
# Estudiantes
docker exec -it user-db mysql -u root -psecret db_usuarios -e "SELECT * FROM students LIMIT 5;"

# Cursos
docker exec -it course-db mysql -u root -psecret db_cursos -e "SELECT * FROM courses LIMIT 5;"

# Pagos
docker exec -it payment-db mysql -u root -psecret db_pagos -e "SELECT * FROM payments LIMIT 5;"

# Notificaciones
docker exec -it notification-db mysql -u root -psecret db_notificaciones -e "SELECT * FROM notifications LIMIT 5;"
```

## Desarrollo frontend local

```bash
cd frontend-react
npm install
npm run dev
# Disponible en http://localhost:5173
```

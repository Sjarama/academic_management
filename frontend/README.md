# Frontend Academic Management

Este frontend está diseñado para consumir los microservicios:

- `user-service` en `http://localhost:8081`
- `course-service` en `http://localhost:8082`
- `payment-service` en `http://localhost:8083`
- `notification-service` en `http://localhost:8084`

## Cómo ejecutar

1. Inicia los microservicios con Docker Compose:

```powershell
cd c:\Users\ANTONIO\Documents\GitHub\academic_management
docker-compose up --build
```

2. Inicia el frontend con Docker Compose desde la raíz del proyecto:

```powershell
cd c:\Users\ANTONIO\Documents\GitHub\academic_management
docker-compose up --build frontend
```

3. Abre el navegador en:

```
http://localhost:5500
```

## Uso

- Selecciona el microservicio que quieras administrar.
- Verás el listado de registros disponibles.
- Usa el formulario para crear o actualizar por ID.
- El botón de eliminar está disponible en cada tarjeta.

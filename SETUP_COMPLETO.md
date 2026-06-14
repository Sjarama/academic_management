# 🚀 SETUP COMPLETO - Academic Management

## 📋 Cambios Realizados

### 1. ✅ CORS Actualizado
Agregué `localhost:5052` (puerto de frontend-info) a los CORS de:
- `course-service`
- `payment-service`
- `notification-service`

Esto permite que frontend-info haga requests a las APIs.

### 2. ✅ SVG Ondas Mejorado
Cambié `preserveAspectRatio="none"` a `preserveAspectRatio="xMidYMid slice"` para:
- Mantener proporciones correctas
- No distorsionar la onda
- Verse igual en todos los navegadores

---

## 🔧 PASO A PASO - Para que funcione todo

### **1. Limpiar e Iniciar Docker desde cero**

```bash
# Detener todos los contenedores
docker-compose down -v

# Reconstruir las imágenes (importante por los cambios en CORS)
docker-compose build --no-cache

# Levantar los contenedores
docker-compose up -d

# Esperar 20 segundos para que todo se inicialice
```

### **2. Verificar que los servicios están corriendo**

```bash
# Ver los contenedores activos
docker ps

# Deberías ver:
# - user-service (puerto 8081)
# - course-service (puerto 8082)  
# - payment-service (puerto 8083)
# - notification-service (puerto 8084)
# - frontend (puerto 5501)
# - frontend-info (puerto 5052)
```

### **3. Verificar que se generaron datos**

Abre tu navegador y ve a:

**Endpoints para verificar datos:**

```
http://localhost:8081/api/students
http://localhost:8082/api/courses
http://localhost:8083/api/payments
```

Si ves JSON con datos, está correcto ✅

---

## 🎯 Acceder a la página

### Frontend Info (nueva página bonita)
```
http://localhost:5052
```

Deberías ver:
- ✅ Diseño moderno con ondas
- ✅ Número de estudiantes (ej: 70)
- ✅ Grid de características
- ✅ Modal de contacto funcional

### Frontend (página principal)
```
http://localhost:5501
```

---

## 🛠️ CRUD - Cómo funciona

El CRUD funciona a través de las APIs:

### **Leer (GET)**
```
GET http://localhost:8082/api/courses          # Todos los cursos
GET http://localhost:8082/api/courses/1        # Curso por ID
GET http://localhost:8082/api/courses/teacher/1  # Cursos por profesor
```

### **Crear (POST)**
```
POST http://localhost:8082/api/courses
Content-Type: application/json

{
  "name": "Nuevo Curso",
  "description": "Descripción",
  "teacherId": 1,
  "credits": 4,
  "maxStudents": 30,
  "approvalPercentage": 75
}
```

### **Actualizar (PUT)**
```
PUT http://localhost:8082/api/courses/1
Content-Type: application/json

{
  "name": "Curso Actualizado",
  ...
}
```

### **Eliminar (DELETE)**
```
DELETE http://localhost:8082/api/courses/1
```

---

## 📊 Datos Iniciales

Cada servicio genera datos automáticamente:

- **user-service**: 70 estudiantes + 20 profesores
- **course-service**: 20 cursos
- **payment-service**: 400 pagos (20 por cada estudiante)

Esto se genera con los **Data Initializers** al levantar Docker.

---

## ✅ Checklist de Verificación

- [ ] Docker levantado (`docker-compose up -d`)
- [ ] Todos los servicios corriendo (`docker ps`)
- [ ] Datos en las APIs (`http://localhost:8081/api/students`)
- [ ] Frontend-info accesible (`http://localhost:5052`)
- [ ] Ondas se ven bien (sin distorsión)
- [ ] Número de estudiantes aparece (ej: 70)
- [ ] Modal de contacto funciona

---

## 🐛 Troubleshooting

### "No se cargan datos en el CRUD"
1. Verifica que Docker está corriendo: `docker ps`
2. Revisa logs: `docker-compose logs -f`
3. Asegúrate que esperas 30 segundos después de levantar

### "No aparece el número de estudiantes"
1. Abre DevTools (F12)
2. Pestaña "Network" - busca llamadas a `http://localhost:8081/api/students`
3. Si ves error 404 o conexión rechazada, el servicio no está levantado

### "Las ondas se ven mal/distorsionadas"
1. Limpia caché: `Ctrl+Shift+Del` 
2. Recarga: `Ctrl+R` o `Cmd+R`
3. Si persiste, reconstruye Docker: `docker-compose down -v && docker-compose build --no-cache`

### "CORS error en la consola"
1. Los servicios pueden no haberse reconstruido
2. Ejecuta: `docker-compose down -v`
3. Luego: `docker-compose build --no-cache`
4. Y: `docker-compose up`

---

## 📞 Resumen de puertos

| Servicio | Puerto | URL |
|----------|--------|-----|
| Frontend | 5501 | http://localhost:5501 |
| Frontend Info | 5052 | http://localhost:5052 |
| User Service API | 8081 | http://localhost:8081 |
| Course Service API | 8082 | http://localhost:8082 |
| Payment Service API | 8083 | http://localhost:8083 |
| Notification Service API | 8084 | http://localhost:8084 |
| RabbitMQ | 5672 | amqp://localhost:5672 |

---

## 🎉 ¡Listo!

Una vez hayas seguido estos pasos, todo debería funcionar perfectamente.

¿Preguntas? Revisa este archivo o los logs de Docker: `docker-compose logs`


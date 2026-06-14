# Frontend Info - Setup y Acceso

## Acceso a la página

### 1. **Mediante Docker (Recomendado)**
Una vez que levantes Docker con `docker-compose up`, la página estará disponible en:

```
http://localhost:5052
```

**Ventajas:**
- ✅ Diseño se carga correctamente
- ✅ Consulta a API funciona
- ✅ Todo se ve perfecto

### 2. **Acceso local (Desarrollo)**
Para abrir el archivo directamente sin servidor:

```
Abre: frontend-info/index.html
```

**Limitaciones:**
- ⚠️ La API no funcionará (restricción del navegador)
- ⚠️ Algunos recursos podrían no cargar correctamente

---

## Requisitos para funcionamiento completo

1. **Docker corriendo** con los servicios:
   - `user-service` en puerto `8081`
   - `course-service` en puerto `8082`
   - `payment-service` en puerto `8083`
   - `notification-service` en puerto `8084`

2. **Base de datos de usuarios** con datos iniciales

3. **Acceder por localhost:5052** (no por archivo local)

---

## Comando para iniciar

```bash
docker-compose up
```

Luego abre: **http://localhost:5052**

---

## Solución de problemas

| Problema | Causa | Solución |
|----------|-------|----------|
| No se ve diseño | Rutas incorrectas | Accede por http://localhost:5052 |
| No muestra estudiantes | API no responde | Verifica que user-service esté en 8081 |
| Errores CORS | Acceso file:// | Usa Docker o servidor local |
| Puerto 5052 ocupado | Otro proceso | Cambia en docker-compose.yml |

---

## Estructura de archivos

```
frontend-info/
├── index.html       # Página principal
├── styles.css       # Estilos modernos responsivos
├── app.js          # Lógica y API
├── Dockerfile      # Configuración Docker (Nginx)
├── nginx.conf      # Configuración Nginx
├── .dockerignore   # Archivos a ignorar en Docker
└── README.md       # Este archivo
```

---

## Notas técnicas

- **Servidor:** Nginx (en Docker)
- **Puerto:** 5052
- **Archivo de configuración:** `nginx.conf`
- **API endpoint:** `http://localhost:8081/api/students`
- **Caché:** CSS/JS cacheados por 1 hora, HTML sin cache


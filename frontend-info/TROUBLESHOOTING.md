# 🔧 TROUBLESHOOTING - Frontend Info

## ✅ Verificar que todo está funcionando

### 1. Verifica que Docker esté corriendo
```bash
docker ps
```
Deberías ver estos contenedores:
- `frontend-info`
- `user-service` en puerto 8081
- `course-service` en puerto 8082
- `payment-service` en puerto 8083
- `notification-service` en puerto 8084
- `frontend` en puerto 5501

### 2. Accede a la página
```
http://localhost:5052
```

### 3. Abre la consola del navegador (F12)
Deberías ver en la consola:
```
✓ Estudiantes cargados: 70
```

---

## ❌ Problemas Comunes

### **Problema: No se carga el diseño (página en blanco o muy plana)**

**Causas posibles:**
- CSS no se carga
- JavaScript error
- Rutas incorrectas

**Soluciones:**

1. **Verifica que el contenedor esté corriendo:**
   ```bash
   docker logs frontend-info
   ```

2. **Reconstruye el contenedor:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. **Limpia el caché del navegador:**
   - Presiona `Ctrl+Shift+Del` (o Cmd+Shift+Del en Mac)
   - Limpia caché y cookies
   - Recarga la página

4. **Verifica en DevTools (F12):**
   - Ve a la pestaña "Network"
   - Busca errores 404 en styles.css o app.js
   - Si hay errores, el servidor no está sirviendo los archivos

---

### **Problema: No muestra número de estudiantes**

**Causas posibles:**
- API no responde
- CORS bloqueado
- user-service no está corriendo

**Soluciones:**

1. **Verifica que user-service esté corriendo:**
   ```bash
   docker logs user-service
   ```

2. **Prueba la API directamente:**
   ```
   http://localhost:8081/api/students
   ```
   Debería devolver JSON con lista de estudiantes

3. **Mira la consola (F12) para ver el error:**
   - Busca mensajes rojo en la pestaña "Console"
   - El error te dirá qué está mal

4. **Reinicia los servicios:**
   ```bash
   docker-compose restart user-service
   docker-compose restart frontend-info
   ```

---

### **Problema: Puerto 5052 ya está en uso**

**Solución:**

1. **Opción A: Encuentra qué está usando el puerto**
   ```bash
   netstat -ano | findstr :5052
   ```

2. **Opción B: Cambia el puerto en docker-compose.yml**
   ```yaml
   frontend-info:
     ports:
       - "127.0.0.1:5053:5052"  # Cambio de 5052 a 5053
   ```
   Luego accede a: `http://localhost:5053`

3. **Opción C: Detén todos los contenedores**
   ```bash
   docker-compose down
   docker-compose up
   ```

---

### **Problema: Acceso por archivo local (index.html) no funciona**

**Esto es esperado.** El navegador bloquea:
- Carga de CSS/JS desde file://
- Fetch a APIs HTTP desde file://

**Solución obligatoria:** Usa Docker
```bash
docker-compose up
# Accede a: http://localhost:5052
```

---

## 🔍 Debugging

### Ver logs de cada servicio

**Frontend-info:**
```bash
docker logs frontend-info -f
```

**User-service:**
```bash
docker logs user-service -f
```

### Ejecutar comando en el contenedor

```bash
docker exec -it frontend-info sh
# Luego navega a /usr/share/nginx/html/
ls -la
```

### Resetear todo y empezar de cero

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## ✨ Verifica que todo esté correcto

Una vez que la página esté corriendo en `http://localhost:5052`, deberías ver:

- ✅ **Navbar** sticky con logo "Academic Management"
- ✅ **Sección Hero** con onda SVG animada
- ✅ **Tarjeta de estudiantes** grande y destacada mostrando un número (ej: 70)
- ✅ **Grid de 6 características** con iconos emoji
- ✅ **Sección CTA** en gradiente azul-naranja
- ✅ **Modal de contacto** funcional
- ✅ **Responsivo** en mobile (abre DevTools y reduce pantalla)

Si todo se ve así: **¡Todo está correcto!** 🎉

---

## 📞 Contacto / Más ayuda

Si los problemas persisten:

1. **Verifica que Docker está actualizado:**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Prueba con un navegador diferente**

3. **Revisa los logs:**
   ```bash
   docker-compose logs
   ```

4. **Reinicia Docker completamente:**
   - Cierra Docker Desktop
   - Espera 30 segundos
   - Abre Docker Desktop nuevamente
   - Levanta los contenedores: `docker-compose up`


# Guía de Despliegue del Entorno Académico (Docker)
Para asegurar el correcto funcionamiento de los servicios, siga estrictamente el procedimiento detallado a continuación:

## 1. Preparación del Entorno
Es imprescindible verificar que el motor de contenedores esté operativo. Para ello, inicie la aplicación Docker Desktop y asegúrese de que el servicio se encuentre en estado Running antes de proceder con los comandos de terminal.
Para la inicialización del docker desktop se debe tulizar el siguiente comando:
docker desktop start
Para verificar que docker desktop esta corriendo se debe utilizar el siguiente comando:
docker ps

## 2. Clonación del Repositorio
Debe obtener una copia local del código fuente. Ejecute la clonación del repositorio oficial mediante el siguiente comando:
git clone https://github.com/Sjarama/academic_management.git

Nota: Asegúrese de contar con los permisos de acceso necesarios para interactuar con el repositorio remoto.

## 3. Localización del Directorio de Trabajo
Una vez clonado el proyecto, acceda a la interfaz de línea de comandos (CLI) de su preferencia y navegue hasta el directorio raíz del proyecto utilizando la ruta:
cd academic_management

## 4. Orquestación y Levantamiento de Servicios
Para finalizar, proceda con el despliegue de la infraestructura definida en el archivo de configuración. Utilice la herramienta Docker Compose para inicializar los contenedores en segundo plano (detached mode), asegurando el levantamiento de las bases de datos y el broker de mensajería:

## Bash
`docker-compose up --build -d` 

Este comando descargará las imágenes necesarias y configurará las instancias para los módulos de usuarios, cursos, pagos, notificaciones y el servicio de RabbitMQ de forma simultánea.

Después de levantar los servicios, se puede acceder al frontend de gestión principal en `http://localhost:5501` y al nuevo frontend informativo en `http://localhost:5052`.


# Testeo
## Estudiantes 
Pasos a seguir para ver todos los estudiantes:
Ejecutar en el terminal el siguiente comando:
docker exec -it user-db mysql -u root -psecret db_usuarios

-- ver todos los estudiantes
SELECT * FROM students;


-- ver estructura de la tabla
DESCRIBE students;

## Cursos
Pasos a seguir para ver todos los cursos:
Ejecutar en la terminal el siguiente comando:
docker exec -it course-db mysql -u root -psecret db_cursos
-- ver todos los cursos
SELECT * FROM courses;
-- ver estructura de la tabla
DESCRIBE courses;


-- salir
exit

## Comandos útiles y prácticas recomendadas

Usa estos comandos para levantar, detener y hacer backup/restore sin perder datos.

- Levantar (preserva volúmenes):
```bash
docker-compose up -d
```

- Parar sin eliminar volúmenes (libera CPU/RAM):
```bash
docker-compose stop
```

- Parar y eliminar contenedores/red (preserva volúmenes):
```bash
docker-compose down
```

- Parar y eliminar contenedores + volúmenes (BORRA DATOS):
```bash
docker-compose down -v
```

- Reconstruir tras cambios en código (recomendado tras `git pull`):
```bash
docker-compose build --no-cache
docker-compose up -d --build
```

- Ver logs de un servicio (ej. `user-service`):
```bash
docker logs -f user-service
```

- Listar contenedores y puertos:
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

- Backup de la base de datos MySQL (desde host):
```bash
docker exec user-db sh -c 'exec mysqldump -u root -p"$MYSQL_ROOT_PASSWORD" db_usuarios' > backup_user_db.sql
```

- Restaurar backup (desde host):
```bash
cat backup_user_db.sql | docker exec -i user-db sh -c 'mysql -u root -p"$MYSQL_ROOT_PASSWORD" db_usuarios'
```

- Limpiar recursos Docker no usados (opcional):
```bash
docker system prune -f --volumes
```

Nota sobre redes e IPs fijas: si el `docker-compose.yml` usa `ipv4_address`, evita ejecutar otra stack que use la misma subred. Si prefieres mayor flexibilidad, elimina las líneas `ipv4_address` para dejar que Docker asigne IPs automáticamente.


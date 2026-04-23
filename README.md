**Guía de Despliegue del Entorno Académico (Docker)**
Para asegurar el correcto funcionamiento de los servicios, siga estrictamente el procedimiento detallado a continuación:

**1. Preparación del Entorno**
Es imprescindible verificar que el motor de contenedores esté operativo. Para ello, inicie la aplicación Docker Desktop y asegúrese de que el servicio se encuentre en estado Running antes de proceder con los comandos de terminal.
Para la inicialización del docker desktop se debe tulizar el siguiente comando:
docker desktop start
Para verificar que docker desktop esta corriendo se debe utilizar el siguiente comando:
docker ps

**2. Clonación del Repositorio**
Debe obtener una copia local del código fuente. Ejecute la clonación del repositorio oficial mediante el siguiente comando:
git clone https://github.com/Sjarama/academic_management.git

Nota: Asegúrese de contar con los permisos de acceso necesarios para interactuar con el repositorio remoto.

**3. Localización del Directorio de Trabajo**
Una vez clonado el proyecto, acceda a la interfaz de línea de comandos (CLI) de su preferencia y navegue hasta el directorio raíz del proyecto utilizando la ruta:
cd academic_management

**4. Orquestación y Levantamiento de Servicios**
Para finalizar, proceda con el despliegue de la infraestructura definida en el archivo de configuración. Utilice la herramienta Docker Compose para inicializar los contenedores en segundo plano (detached mode), asegurando el levantamiento de las bases de datos y el broker de mensajería:

Bash
docker-compose up -d user-db course-db payment-db notification-db rabbitmq
Este comando descargará las imágenes necesarias y configurará las instancias para los módulos de usuarios, cursos, pagos, notificaciones y el servicio de RabbitMQ de forma simultánea.

# Pruebas Selenium (tests)

Este archivo explica cómo preparar el entorno e ejecutar las pruebas Selenium incluidas en este repositorio.

**Requisitos**
- Python 3.10 o superior
- `pip` (gestor de paquetes de Python)
- Navegador Google Chrome (o Chromium) instalado
- Conexión a la aplicación bajo prueba (BASE_URL)

> Las dependencias Python necesarias están en `tests/requirements.txt`.

**Instalación (desde la raíz del repositorio)**

1. Crear y activar un entorno virtual (recomendado)

PowerShell:
```powershell
python -m venv .venv
. .venv\Scripts\Activate.ps1
```
cmd.exe:
```cmd
python -m venv .venv
.venv\Scripts\activate.bat
```

2. Instalar dependencias

```bash
pip install -r tests/requirements.txt
```

`tests/requirements.txt` contiene:
- `selenium`
- `webdriver-manager` (recomendado para gestionar automáticamente ChromeDriver)

**Configuración del driver**

- Recomendado: usar `webdriver-manager` (ya está en `requirements.txt`). No se necesita descargar manualmente `chromedriver`.
- Si prefieres instalar `chromedriver` manualmente: descarga la versión que coincida con tu Chrome y coloca el ejecutable en el `PATH`.

**Variables de entorno (ejemplo en PowerShell)**

- `BASE_URL`: URL base de la aplicación a probar (ej. `http://localhost:5501`)
- `HEADLESS`: `1` para modo headless, `0` para ver la ventana del navegador

Ejemplo (PowerShell):
```powershell
$env:BASE_URL = 'http://localhost:5501'
$env:HEADLESS = '0'
python .\tests\selenium_crud_tests.py
```

**Ejecutar las pruebas**

Desde la raíz del repositorio (con el entorno activado y dependencias instaladas):

```bash
python .\tests\selenium_crud_tests.py
```

**Solución de problemas**
- Si aparece un error de versión de ChromeDriver: asegúrate de que Chrome está actualizado o usa `webdriver-manager` para descargar automáticamente la versión correcta.
- Si el navegador no se muestra y quieres ver la ventana, establece `HEADLESS` a `0`.
- Para más información sobre `webdriver-manager`, consulta su documentación: https://pypi.org/project/webdriver-manager/

Si quieres, puedo ejecutar los tests aquí o añadir instrucciones para ejecutar un conjunto más amplio de pruebas (por ejemplo, con `pytest`).

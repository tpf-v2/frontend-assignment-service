
# Frontend Assignment Service

Este proyecto es el frontend del sistema de asignación de equipos y temas desarrollado como parte del Trabajo Profesional en FIUBA. Está construido con React y tiene como objetivo proporcionar una interfaz amigable para gestionar las asignaciones.

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js**: Descarga e instala la versión más reciente desde [https://nodejs.org/](https://nodejs.org/).
- **npm** (incluido con Node.js) o **yarn** para manejar dependencias.

## Instalación

Sigue estos pasos para instalar y ejecutar el proyecto en tu máquina local:

1. **Clona el repositorio:**

   ```bash
   git clone https://github.com/trabajo-profesional-fiuba/frontend-assignment-service.git
   cd frontend-assignment-service
   ```

2. **Instala las dependencias:**

   Usando npm:

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz del proyecto y define las variables necesarias según el archivo `.env.example` proporcionado en el repositorio.

4. **Ejecuta el proyecto:**

   Con npm:

   ```bash
   npm run start:dev
   ```

   Esto iniciará la aplicación en modo de desarrollo. Por defecto, estará disponible en `http://localhost:3000`.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

- **`npm run start:dev`**: Inicia el servidor de desarrollo.
- **`npm run start:stg`**: Inicia el servidor de staging.
- **`npm run start:prod`**: Inicia el servidor de produccion.
- **`npm run build`**: Genera una versión optimizada para producción en el directorio `build`.

## Estructura del Proyecto

El proyecto está organizado en los siguientes directorios principales:

- **`src`**: Contiene el código fuente de la aplicación.
  - **`components`**: Componentes reutilizables de la interfaz.
  - **`pages`**: Páginas principales de la aplicación.
  - **`redux`**: Gestión del estado utilizando Redux.
  - **`services`**: Lógica para las llamadas al backend.
  - **`styles`**: Archivos de estilos globales y específicos.
- **`public`**: Archivos estáticos y el archivo `index.html`.

## Contribución

Si deseas colaborar en el proyecto:

1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Agrega nueva funcionalidad"`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

Para cualquier consulta o sugerencia, no dudes en abrir un issue en el repositorio.

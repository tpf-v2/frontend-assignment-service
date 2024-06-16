
## Instalación

1. Clona el repositorio:

    ```bash
    git clone <URL_de_tu_repositorio>
    cd fronted-assignment-service
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Inicia la aplicación:

    ```bash
    npm start
    ```

La aplicación estará disponible en `http://localhost:3000`.

## Componentes

### `RoleSelection.js`
Este componente permite al usuario seleccionar su rol (Estudiante o Profesor) y redirige al formulario correspondiente.

### `StudentForm.js` y `TeacherForm.js`
Estos componentes representan los formularios para Estudiantes y Profesores, respectivamente. Actualmente, ambos formularios son idénticos y permiten la entrada de Nombre, Apellido y Padrón.

## License

Este proyecto está licenciado bajo la MIT License.
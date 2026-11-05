# Frontend Examen 4 - ITM

Aplicación Angular para gestionar estudiantes y productos mediante una API REST. Los productos se consultan y modifican directamente en el backend; no se usan datos ficticios ni almacenamiento local.

## Tecnologías

- Angular 22 con componentes standalone y Angular Router.
- TypeScript y formularios de Angular.
- `HttpClient` para las peticiones HTTP.
- Backend REST local en FastAPI.

## Requisitos

- Node.js y npm compatibles con la versión instalada de Angular CLI.
- Backend ejecutándose en `http://localhost:8000`.

## Instalación y ejecución

```bash
npm install
npm start
```

El frontend estará disponible en [http://localhost:4200](http://localhost:4200). La URL base de la API se configura en `src/environments/environment.ts`.

## Rutas

- `/estudiantes`: módulo existente de gestión de estudiantes.
- `/productos`: gestión de productos.

El sidebar permanece en el shell compartido al navegar entre ambas rutas. La ruta raíz redirige a `/estudiantes`.

## CRUD de Productos

La pantalla de Productos utiliza el recurso `/productos` y el modelo definido por el backend: `id`, `nombre`, `descripcion`, `precio` y `stock`.

- **Listar:** al abrir la pantalla se ejecuta `GET http://localhost:8000/productos`.
- **Consultar por ID:** ingresar el identificador y seleccionar **Buscar** para ejecutar `GET http://localhost:8000/productos/{id}`. **Ver todos** vuelve a consultar la colección.
- **Crear:** completar nombre, precio y stock; se envían nombre, descripción, precio y stock mediante `POST http://localhost:8000/productos`.
- **Editar:** seleccionar **Editar**, modificar el formulario y guardar con `PUT http://localhost:8000/productos/{id}`.
- **Eliminar:** seleccionar **Eliminar** y confirmar para ejecutar `DELETE http://localhost:8000/productos/{id}`.

Los cambios se reflejan en la tabla usando las respuestas del backend o el éxito confirmado de la operación. Al recargar, la pantalla vuelve a consultar el servidor. Los errores HTTP y de conexión se informan en la interfaz.

## Verificación manual

1. Iniciar el backend y confirmar que responde en `http://localhost:8000`.
2. Ejecutar Angular y abrir `http://localhost:4200/productos`.
3. En las herramientas del navegador, abrir **Network** y verificar las solicitudes a `/productos`, sus métodos y estados HTTP.
4. Probar listado, búsqueda por ID, creación, edición y eliminación. Recargar la página para comprobar que los cambios persisten en el backend.

Para compilar y ejecutar las pruebas configuradas:

```bash
npm run build
npm test
```

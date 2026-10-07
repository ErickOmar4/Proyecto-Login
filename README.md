<p align="center">
  <img src="img/logoito.png" alt="Logo ITO" width="120">
</p>

<h1 align="center">Proyecto Login</h1>
<p align="center"><b>Control de usuarios y alumnos</b></p>

<p align="center">
  Instituto Tecnológico de Oaxaca · Ingeniería en Sistemas Computacionales
</p>

| Integrante | Usuario de GitHub |
|---|---|
| Erick Omar (NOMBRE COMPLETO) | [@ErickOmar4](https://github.com/ErickOmar4) |
| Joseph (NOMBRE COMPLETO) | [@JoseJose7520-dev(https://github.com/JoseJose7520-dev) |

**Demo en vivo (GitHub Pages):**

---

## Descripción

Sistema web de dos pantallas que simula el acceso a un sistema escolar. En `login.html` el usuario escribe su correo y contraseña; si ambos pasan la validación, entra a `index.html`, donde puede capturar usuarios, registrar alumnos con su número de control y consultar en un modal si el alumno es mayor de edad. El inicio de sesión es simulado con JavaScript, sin backend.

**Flujo:** `login.html` → `index.html` → *Salir del sistema* → `login.html`

---

## Tecnologías

- **HTML5, CSS3 y JavaScript** (sin frameworks de JS).
- **Framework CSS:** no se usó Bootstrap ni Tailwind. Los estilos son propios (`css/base.css`, `css/login.css`, `css/index.css`) más la hoja de la librería visual [Componente_Visual](https://github.com/ErickOmar4/Componente_Visual).
- **utileria.js** ([repositorio](https://github.com/ErickOmar4/utileria2.js)): funciones de validación (`validarCorreo`, `validarPassword`, `validarLongitud`, `solo_numeros`, `solo_letras`, `contarCaracteres`, `calcularEdad`, `esMayorEdad`). Se carga por CDN de jsDelivr.
- **librerIaV.js (UIKit):** componentes visuales; se usa para el carrusel del login y el modal de edad.

---

## Estructura del proyecto

```
Proyecto-Login/
├── README.md
├── login.html        Pantalla de acceso
├── index.html        Pantalla del sistema (sidebar, navbar, captura)
├── css/
│   ├── base.css      Variables, botones, campos, alertas y tablas comunes
│   ├── login.css     Estilos del login
│   └── index.css     Estilos del sistema
├── js/
│   ├── login.js      Validación del acceso y creación de la sesión
│   └── index.js      Sidebar, navbar, formularios y modal
└── img/
    ├── avatar.png    Avatar del usuario en el navbar
    ├── logoito.png   Logo e ícono de pestaña
    ├── ito.png       Imagen del carrusel
    └── capturas/     Capturas de pantalla del README
```

---

## Documentación

### ¿Cómo fluye el login hacia el sistema?



### ¿Cómo se pasa el nombre de usuario del login al navbar?

En `login.js`, el nombre se obtiene de la parte del correo antes de la `@`, cambiando puntos o guiones por espacios y poniendo mayúscula a cada palabra. Por ejemplo, `juan.perez@correo.com` se convierte en **Juan Perez**. Se guarda junto con el correo:

```js
sessionStorage.setItem('sesion', JSON.stringify({ correo: mail, nombre }));
```

En `index.js` se lee ese objeto y se coloca en el navbar, en el saludo de Inicio y en el menú desplegable:

```js
const sesion = JSON.parse(sessionStorage.getItem('sesion') || 'null');
$('.usuario-nombre').textContent = sesion.nombre || sesion.correo;
```

### Cerrar sesión

Al dar clic en el nombre del navbar se despliega el menú con **Salir del sistema**. Esa opción borra la sesión con `sessionStorage.removeItem('sesion')` y regresa a `login.html`.

### Métodos principales

| Archivo | Método / evento | Qué hace |
|---|---|---|
| login.js | `marcar(input, ok, mensaje)` | Pinta el campo como válido o inválido y muestra el error |
| login.js | `submit` de `.form-login` | Valida, crea la sesión y redirige a index.html |
| login.js | `click` de `.ver-password` | Muestra u oculta la contraseña |
| index.js | `alternarMenuUsuario(abrir)` | Abre o cierra el dropdown del usuario (también con clic fuera o Esc) |
| index.js | `click` de `.boton-menu` | Abre o cierra el sidebar (botón hamburguesa) |
| index.js | `click` de `[data-vista]` | Cambia entre las vistas Inicio y Captura |
| index.js | `submit` de `.form-usuario` | Valida usuario (3 a 20 caracteres), correo y contraseña |
| index.js | `submit` de `.form-alumno` | Valida nombre, número de control de 6 dígitos y fecha, y abre el modal de edad |
| index.js | `agregarFila()` / `actualizarTotales()` | Agrega el registro a la tabla y actualiza los contadores de Inicio |
| index.js | `escapar(texto)` | Evita inyectar HTML en el contenido del modal |

---

## Proceso de creación

### 1. Login
Se maquetó `login.html` con un panel lateral (logo, carrusel de imágenes y descripción) y el formulario de correo y contraseña. Después se programó `login.js` con las validaciones de `utileria.js` y la sesión simulada.

![Login](img/capturas/01-login.png)

### 2. Sidebar


### 3. Navbar con el usuario
En la parte derecha se muestra el avatar y el nombre del usuario que inició sesión. Al hacer clic se despliega su correo y la opción **Salir del sistema**.

![Navbar](img/capturas/03-navbar.png)

### 4. Captura de usuarios


### 5. Número de control


### 6. Modal de edad

---

## Flujo completo funcionando


---

## Cómo ejecutarlo

- **En línea:** abrir el enlace de GitHub Pages de arriba.
- **Local:** clonar el repositorio y abrir `login.html` en el navegador (o con la extensión Live Server de VS Code).

```
git clone https://github.com/ErickOmar4/Proyecto-Login.git
```

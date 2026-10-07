/* index.js - lógica del sistema: sidebar, navbar, formularios (utileria.js) y modal (UIKit) */
document.addEventListener('DOMContentLoaded', () => {
  const sesion = JSON.parse(sessionStorage.getItem('sesion') || 'null');
  if (!sesion) return; // el guard del <head> ya redirige a login.html

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);
  const usuarios = [];
  const alumnos = [];

  /* ---------- Navbar ---------- */
  const nombreMostrado = sesion.nombre || sesion.correo;
  $('.usuario-nombre').textContent = nombreMostrado;
  $('.saludo-nombre').textContent = nombreMostrado;
  $('.usuario-correo').textContent = sesion.correo;

  const botonUsuario = $('.usuario-boton');
  const menuUsuario = $('.usuario-menu');
  function alternarMenuUsuario(abrir) {
    menuUsuario.hidden = !abrir;
    botonUsuario.setAttribute('aria-expanded', String(abrir));
  }
  botonUsuario.addEventListener('click', () => alternarMenuUsuario(menuUsuario.hidden));
  document.addEventListener('click', (e) => { if (!e.target.closest('.usuario')) alternarMenuUsuario(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') alternarMenuUsuario(false); });

  $('.usuario-salir').addEventListener('click', () => {
    sessionStorage.removeItem('sesion');
    location.href = 'login.html';
  });

  /* ---------- Sidebar ---------- */
  const esMovil = () => matchMedia('(max-width: 991.98px)').matches;
  $('.boton-menu').addEventListener('click', () => {
    document.body.classList.toggle(esMovil() ? 'menu-abierto' : 'menu-cerrado');
  });
  $('.fondo-menu').addEventListener('click', () => document.body.classList.remove('menu-abierto'));

  $$('[data-vista]').forEach((enlace) => {
    enlace.addEventListener('click', (e) => {
      e.preventDefault();
      $$('[data-seccion]').forEach((s) => { s.hidden = s.dataset.seccion !== enlace.dataset.vista; });
      $$('[data-vista]').forEach((a) => a.classList.toggle('activo', a === enlace));
      document.body.classList.remove('menu-abierto');
    });
  });

  /* ---------- Utilidades ---------- */
  function marcar(input, ok, mensaje) {
    input.classList.toggle('invalido', !ok);
    input.classList.toggle('valido', ok);
    input.closest('.campo').querySelector('.error').textContent = ok ? '' : mensaje;
    return ok;
  }
  function limpiar(form) {
    form.reset();
    form.querySelectorAll('.valido, .invalido').forEach((i) => i.classList.remove('valido', 'invalido'));
  }
  function agregarFila(tbody, valores, esPrimera) {
    if (esPrimera) tbody.innerHTML = '';
    const fila = tbody.insertRow();
    valores.forEach((v) => { fila.insertCell().textContent = v; }); // textContent evita inyectar HTML
  }
  function actualizarTotales() {
    $('.total-usuarios').textContent = usuarios.length;
    $('.total-alumnos').textContent = alumnos.length;
  }
  function escapar(texto) {
    const mapa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return String(texto).replace(/[&<>"']/g, (c) => mapa[c]);
  }

  /* ---------- Formulario de usuarios ---------- */
  const formUsuario = $('.form-usuario');
  formUsuario.addEventListener('submit', (e) => {
    e.preventDefault();
    const { usuario, correo, password } = formUsuario.elements;
    const largo = contarCaracteres(usuario.value.trim());

    const okUsuario = marcar(usuario, largo >= 3 && largo <= 20, 'El nombre de usuario debe tener entre 3 y 20 caracteres.');
    const okCorreo = marcar(correo, validarCorreo(correo.value.trim()), 'Escribe un correo válido, por ejemplo nombre@correo.com.');
    const okPass = marcar(password, validarPassword(password.value), 'Usa al menos 8 caracteres, con mayúscula, minúscula, número y un símbolo (@$!%*?&.#_-).');
    if (!(okUsuario && okCorreo && okPass)) return;

    usuarios.push({ usuario: usuario.value.trim(), correo: correo.value.trim() });
    agregarFila($('.lista-usuarios'), [usuario.value.trim(), correo.value.trim()], usuarios.length === 1);
    actualizarTotales();
    limpiar(formUsuario);
  });

  /* ---------- Formulario de alumnos ---------- */
  const formAlumno = $('.form-alumno');
  const { nombre, control, nacimiento } = formAlumno.elements;
  nacimiento.max = new Date().toISOString().split('T')[0];
  control.addEventListener('input', () => { control.value = control.value.replace(/\D/g, ''); });

  formAlumno.addEventListener('submit', (e) => {
    e.preventDefault();

    const okNombre = marcar(nombre, solo_letras(nombre.value.trim()), 'Escribe el nombre solo con letras.');
    const okControl = marcar(control, solo_numeros(control.value) && validarLongitud(control.value, 6), 'El número de control debe tener exactamente 6 dígitos.');
    const edad = nacimiento.value ? calcularEdad(nacimiento.value) : NaN;
    const okNac = marcar(nacimiento, edad >= 0 && edad <= 120, 'Elige una fecha de nacimiento válida.');
    if (!(okNombre && okControl && okNac)) return;

    if (alumnos.some((a) => a.control === control.value)) {
      marcar(control, false, 'Ese número de control ya está registrado.');
      return;
    }

    const nombreAlumno = nombre.value.trim();
    const mayor = esMayorEdad(nacimiento.value);
    alumnos.push({ control: control.value, nombre: nombreAlumno, edad });
    agregarFila($('.lista-alumnos'), [control.value, nombreAlumno, edad], alumnos.length === 1);
    actualizarTotales();

    // Modal de edad (librería visual UIKit)
    const modal = UIKit.modal({
      title: 'Edad del alumno',
      content:
        `<p class="modal-texto">${escapar(nombreAlumno)} tiene ${edad} años.</p>` +
        `<div class="alerta ${mayor ? 'alerta-ok' : 'alerta-aviso'}">${mayor ? 'Es mayor de edad.' : 'Es menor de edad.'}</div>` +
        `<button type="button" class="boton boton-marca" data-cerrar>Entendido</button>`
    });
    modal.element.querySelector('[data-cerrar]').addEventListener('click', modal.close);

    limpiar(formAlumno);
  });
});

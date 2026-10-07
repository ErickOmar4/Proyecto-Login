/* login.js - validación del acceso (simulado, sin backend) con utileria.js */
document.addEventListener('DOMContentLoaded', () => {
  // Si ya hay sesión, entrar directo al sistema
  if (sessionStorage.getItem('sesion')) { location.replace('index.html'); return; }

  const form = document.querySelector('.form-login');
  const { correo, password } = form.elements;
  const alerta = document.querySelector('.alerta-login');
  const botonVer = document.querySelector('.ver-password');

  // Pinta el estado del campo y su mensaje de error
  function marcar(input, ok, mensaje) {
    input.classList.toggle('invalido', !ok);
    input.classList.toggle('valido', ok);
    input.closest('.campo').querySelector('.error').textContent = ok ? '' : mensaje;
    return ok;
  }

  botonVer.addEventListener('click', () => {
    const mostrar = password.type === 'password';
    password.type = mostrar ? 'text' : 'password';
    botonVer.classList.toggle('activo', mostrar);
    botonVer.setAttribute('aria-label', mostrar ? 'Ocultar contraseña' : 'Mostrar contraseña');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alerta.hidden = true;

    const correoOk = marcar(correo, validarCorreo(correo.value.trim()),
      'Escribe un correo válido, por ejemplo nombre@correo.com.');
    const passOk = marcar(password, validarPassword(password.value),
      'Usa al menos 8 caracteres, con mayúscula, minúscula, número y un símbolo (@$!%*?&.#_-).');

    if (!correoOk || !passOk) {
      alerta.textContent = 'Revisa los campos marcados para continuar.';
      alerta.hidden = false;
      return;
    }

    // Sesión simulada: el nombre sale de la parte del correo antes de la @
    const mail = correo.value.trim();
    const nombre = mail.split('@')[0].replace(/[._-]+/g, ' ')
      .replace(/\b\p{L}/gu, (l) => l.toUpperCase());
    sessionStorage.setItem('sesion', JSON.stringify({ correo: mail, nombre }));
    location.href = 'index.html';
  });
});

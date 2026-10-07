/* recuperar.js - recuperación de contraseña simulada (sin backend) con utileria.js y UIKit.modal */
document.addEventListener('DOMContentLoaded', () => {
  const enlace = document.querySelector('.enlace-recuperar');
  if (!enlace) return;

  const correoLogin = document.querySelector('.form-login').elements.correo;
  const passwordLogin = document.querySelector('.form-login').elements.password;
  const MINUTOS_VIGENCIA = 5;
  let codigo = null;
  let vence = 0;
  let correoRecuperar = '';

  // Pinta el estado del campo y su mensaje de error (igual que en login.js)
  function marcar(input, ok, mensaje) {
    input.classList.toggle('invalido', !ok);
    input.classList.toggle('valido', ok);
    input.closest('.campo').querySelector('.error').textContent = ok ? '' : mensaje;
    return ok;
  }

  // Código simulado de 6 dígitos que "llegaría" al correo
  function generarCodigo() {
    codigo = String(Math.floor(100000 + Math.random() * 900000));
    vence = Date.now() + MINUTOS_VIGENCIA * 60 * 1000;
  }

  enlace.addEventListener('click', (e) => {
    e.preventDefault();
    const modal = UIKit.modal({ title: 'Recuperar contraseña', content: '' });
    const contenido = modal.element.querySelector('.uikit-modal-content');
    pasoCorreo(contenido, modal);
  });

  /* ---------- Paso 1: pedir el correo ---------- */
  function pasoCorreo(contenido, modal) {
    contenido.innerHTML = `
      <p class="pasos">Paso 1 de 2</p>
      <p class="texto-suave modal-texto">Escribe el correo de tu cuenta y te enviaremos un código de verificación.</p>
      <form class="form-recuperar" novalidate>
        <label class="campo">
          <span class="campo-titulo">Correo electrónico</span>
          <input class="control" type="email" name="correo" autocomplete="username" placeholder="nombre@correo.com">
          <small class="error"></small>
        </label>
        <button type="submit" class="boton boton-marca boton-ancho">Enviar código</button>
      </form>`;

    const form = contenido.querySelector('.form-recuperar');
    const { correo } = form.elements;
    // Si ya escribió un correo válido en el login, lo reutilizamos
    if (validarCorreo(correoLogin.value.trim())) correo.value = correoLogin.value.trim();
    correo.focus();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = marcar(correo, validarCorreo(correo.value.trim()), 'Escribe un correo válido, por ejemplo nombre@correo.com.');
      if (!ok) return;
      correoRecuperar = correo.value.trim();
      generarCodigo();
      pasoCodigo(contenido, modal);
    });
  }

  /* ---------- Paso 2: código y nueva contraseña ---------- */
  function pasoCodigo(contenido, modal) {
    contenido.innerHTML = `
      <p class="pasos">Paso 2 de 2</p>
      <p class="texto-suave modal-texto">Enviamos un código a <b class="correo-destino"></b>.</p>
      <div class="alerta alerta-aviso codigo-simulado">
        Simulación: como no hay servidor de correo, tu código es <b class="codigo"></b>.
        Vence en ${MINUTOS_VIGENCIA} minutos.
      </div>
      <form class="form-nueva" novalidate>
        <label class="campo">
          <span class="campo-titulo">Código de verificación</span>
          <input class="control" type="text" name="codigo" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="6 dígitos">
          <small class="error"></small>
        </label>
        <label class="campo">
          <span class="campo-titulo">Nueva contraseña</span>
          <input class="control" type="password" name="nueva" autocomplete="new-password" placeholder="Mínimo 8 caracteres">
          <small class="error"></small>
        </label>
        <label class="campo">
          <span class="campo-titulo">Confirmar contraseña</span>
          <input class="control" type="password" name="confirmar" autocomplete="new-password">
          <small class="error"></small>
        </label>
        <button type="submit" class="boton boton-marca boton-ancho">Cambiar contraseña</button>
        <button type="button" class="enlace reenviar">Reenviar código</button>
      </form>`;

    // textContent para no inyectar HTML con lo que escribió el usuario
    contenido.querySelector('.correo-destino').textContent = correoRecuperar;
    contenido.querySelector('.codigo').textContent = codigo;

    const form = contenido.querySelector('.form-nueva');
    const { codigo: inputCodigo, nueva, confirmar } = form.elements;
    inputCodigo.addEventListener('input', () => { inputCodigo.value = inputCodigo.value.replace(/\D/g, ''); });
    inputCodigo.focus();

    contenido.querySelector('.reenviar').addEventListener('click', () => {
      generarCodigo();
      contenido.querySelector('.codigo').textContent = codigo;
      marcar(inputCodigo, true, '');
      inputCodigo.classList.remove('valido');
      inputCodigo.value = '';
      inputCodigo.focus();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const valor = inputCodigo.value;

      let okCodigo;
      if (!(solo_numeros(valor) && validarLongitud(valor, 6))) {
        okCodigo = marcar(inputCodigo, false, 'El código debe tener exactamente 6 dígitos.');
      } else if (Date.now() > vence) {
        okCodigo = marcar(inputCodigo, false, 'El código venció. Da clic en "Reenviar código".');
      } else {
        okCodigo = marcar(inputCodigo, valor === codigo, 'El código no coincide.');
      }
      const okNueva = marcar(nueva, validarPassword(nueva.value),
        'Usa al menos 8 caracteres, con mayúscula, minúscula, número y un símbolo (@$!%*?&.#_-).');
      const okConfirmar = marcar(confirmar, confirmar.value !== '' && confirmar.value === nueva.value,
        'Las contraseñas no coinciden.');
      if (!(okCodigo && okNueva && okConfirmar)) return;

      codigo = null; // el código solo sirve una vez
      pasoListo(contenido, modal);
    });
  }

  /* ---------- Paso final: confirmación ---------- */
  function pasoListo(contenido, modal) {
    contenido.innerHTML = `
      <div class="alerta alerta-ok">Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión.</div>
      <button type="button" class="boton boton-marca boton-ancho volver">Volver al inicio de sesión</button>`;

    const volver = contenido.querySelector('.volver');
    volver.focus();
    volver.addEventListener('click', () => {
      modal.close();
      correoLogin.value = correoRecuperar;
      passwordLogin.value = '';
      passwordLogin.focus();
    });
  }
});

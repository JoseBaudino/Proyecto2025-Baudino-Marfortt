import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSession } from '@/contexts/session';
import useFormulario from '@/hooks/useFormulario';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { CLAVES, leerLocal, guardarLocal } from '@/utils/storage';
import { validarEmail, validarPassword, validarTexto } from '@/utils/validaciones';

/**
 * Validadores del formulario de login.
 * @constant
 * @type {Object<string, Function>}
 */
const VALIDAR_LOGIN = {
  email: validarEmail,
  password: validarPassword,
};

/**
 * Validadores del formulario de registro.
 * @constant
 * @type {Object<string, Function>}
 */
const VALIDAR_REGISTRO = {
  nombre: (valor) => validarTexto(valor, 'El nombre'),
  email: validarEmail,
  password: validarPassword,
  confirmar: (valor, valores) => {
    if (!valor) return 'Repita la contraseña';
    return valor === valores.password ? '' : 'Las contraseñas no coinciden';
  },
};

/**
 * Página de bienvenida con los formularios de inicio de sesión y registro.
 * @method HomePage
 * @return {JSX.Element} Página de login / registro
 */
const HomePage = () => {
  const navigate = useNavigate();
  const { session, login } = useSession();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const loginForm = useFormulario({ email: leerLocal(CLAVES.USUARIO)?.email || '', password: '' }, VALIDAR_LOGIN);
  const registroForm = useFormulario({ nombre: '', email: '', password: '', confirmar: '' }, VALIDAR_REGISTRO);

  // El mensaje temporal se oculta solo a los 4 segundos
  useEffect(() => {
    if (!mensaje.texto) return undefined;
    const temporizador = setTimeout(() => setMensaje({ texto: '', tipo: '' }), 4000);
    return () => clearTimeout(temporizador);
  }, [mensaje]);

  if (session) return <Navigate to="/" replace />;

  /**
   * Muestra un mensaje de éxito o error en la parte superior del formulario.
   * @method avisar
   * @param {string} texto - Texto del mensaje
   * @param {string} [tipo='success'] - Tipo de mensaje: success o error
   * @return {void}
   */
  const avisar = (texto, tipo = 'success') => setMensaje({ texto, tipo });

  /**
   * Valida el login y, si las credenciales coinciden con el usuario registrado, inicia la sesión.
   * @method manejarLogin
   * @param {React.FormEvent} e - Evento submit del formulario
   * @return {void}
   */
  const manejarLogin = (e) => {
    e.preventDefault();
    const { valido, mensajes } = loginForm.validarTodo();
    if (!valido) {
      avisar(mensajes[0], 'error');
      return;
    }
    const usuario = leerLocal(CLAVES.USUARIO);
    const { email, password } = loginForm.valores;
    if (!usuario) {
      avisar('No hay usuario registrado. Por favor, regístrese primero.', 'error');
    } else if (usuario.email !== email.trim() || usuario.password !== password) {
      loginForm.setValor('password', '');
      avisar('Credenciales incorrectas. Verifique su email y contraseña.', 'error');
    } else {
      login(usuario.email);
      navigate('/');
    }
  };

  /**
   * Valida el formulario de registro y guarda el nuevo usuario en localStorage.
   * @method manejarRegistro
   * @param {React.FormEvent} e - Evento submit del formulario
   * @return {void}
   */
  const manejarRegistro = (e) => {
    e.preventDefault();
    const { valido, mensajes } = registroForm.validarTodo();
    if (!valido) {
      avisar(mensajes[0], 'error');
      return;
    }
    const { nombre, email, password } = registroForm.valores;
    if (leerLocal(CLAVES.USUARIO)?.email === email.trim()) {
      registroForm.setValor('email', '');
      avisar('Ya existe una cuenta con este email', 'error');
      return;
    }
    guardarLocal(CLAVES.USUARIO, { name: nombre.trim(), email: email.trim(), password, registeredAt: new Date().toISOString() });
    loginForm.setValor('email', email.trim());
    registroForm.reiniciar();
    setMostrarRegistro(false);
    avisar('¡Cuenta creada exitosamente! Ahora puede iniciar sesión.');
  };

  /**
   * Cambia entre el formulario de login y el de registro.
   * @method alternarFormulario
   * @param {boolean} registro - true para mostrar el registro, false para el login
   * @return {Function} Manejador del evento click
   */
  const alternarFormulario = (registro) => (e) => {
    e.preventDefault();
    setMostrarRegistro(registro);
    setMensaje({ texto: '', tipo: '' });
  };

  return (
    <main className="hero">
      <div className="overlay">
        <h1>🌱 Bienvenido a AgroGestión 360 🌱</h1>
        <p>La plataforma integral para gestión de maquinaria, ganadería y costos de siembra.</p>

        {mensaje.texto && (
          <div className={`auth-message ${mensaje.tipo}`} role="alert">
            {mensaje.texto}
          </div>
        )}

        <div className="auth-container">
          {!mostrarRegistro ? (
            <section id="login-form" className="auth-form active">
              <h2>Iniciar Sesión</h2>
              <form onSubmit={manejarLogin} noValidate>
                <Input label="Correo electrónico:" id="login-email" type="email" name="email" placeholder="Ingrese su correo electrónico" maxLength={60} size={30} value={loginForm.valores.email} onChange={loginForm.cambiar} error={loginForm.errores.email} />
                <Input label="Contraseña:" id="login-password" type="password" name="password" placeholder="Ingrese su contraseña" maxLength={30} size={30} value={loginForm.valores.password} onChange={loginForm.cambiar} error={loginForm.errores.password} />
                <Button type="submit" className="primary">Iniciar Sesión</Button>
              </form>
              <p className="auth-switch">
                ¿No tenés cuenta? <a href="#/home" onClick={alternarFormulario(true)}>Registrate aquí</a>
              </p>
            </section>
          ) : (
            <section id="register-form" className="auth-form active">
              <h2>Crear Cuenta</h2>
              <form onSubmit={manejarRegistro} noValidate>
                <Input label="Nombre completo:" id="register-name" name="nombre" placeholder="Ingrese su nombre completo" maxLength={50} size={30} value={registroForm.valores.nombre} onChange={registroForm.cambiar} error={registroForm.errores.nombre} />
                <Input label="Correo electrónico:" id="register-email" type="email" name="email" placeholder="ejemplo@correo.com" maxLength={60} size={30} value={registroForm.valores.email} onChange={registroForm.cambiar} error={registroForm.errores.email} />
                <Input label="Contraseña:" id="register-password" type="password" name="password" placeholder="Mínimo 8 caracteres" maxLength={30} size={30} value={registroForm.valores.password} onChange={registroForm.cambiar} error={registroForm.errores.password} />
                <Input label="Confirmar contraseña:" id="register-confirm" type="password" name="confirmar" placeholder="Repita su contraseña" maxLength={30} size={30} value={registroForm.valores.confirmar} onChange={registroForm.cambiar} error={registroForm.errores.confirmar} />
                <Button type="submit" className="primary">Crear Cuenta</Button>
              </form>
              <p className="auth-switch">
                ¿Ya tenés cuenta? <a href="#/home" onClick={alternarFormulario(false)}>Iniciá sesión aquí</a>
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default HomePage;

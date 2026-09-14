import React, { useState } from 'react';
import { 
  Leaf, 
  Lock, 
  Mail, 
  User as UserIcon, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  EyeOff,
  KeyRound,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Truck
} from 'lucide-react';
import { PURIFICACION_VEREDAS } from '../models/veredasData';
import { UserRole } from '../types';
import { AuthController } from '../controllers/authController';
import { modelStore } from '../models/store';

interface AuthViewProps {
  onSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  // Navigation state: 'login' | 'register' | 'recover'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'recover'>('login');

  // Login inputs - ALWAYS blank on first load as requested
  const [emailOrDoc, setEmailOrDoc] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register inputs - Blank inputs for clean fill
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState(''); // OPTIONAL
  const [regDoc, setRegDoc] = useState('');
  const [regVereda, setRegVereda] = useState(PURIFICACION_VEREDAS[0].name);
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('habitante');
  const [regPassword, setRegPassword] = useState(''); // Mandatory, max 10 chars, no spaces
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Recover Password inputs
  const [recoverDocOrEmail, setRecoverDocOrEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [recoverSuccessMsg, setRecoverSuccessMsg] = useState('');

  // Status & error messages
  const [errorMsg, setErrorMsg] = useState('');

  // Handle password input change restricting to max 10 characters and NO spaces
  const handlePasswordNoSpaces = (value: string, setter: (val: string) => void) => {
    // Strip all spaces and restrict to maximum 10 characters
    const sanitized = value.replace(/\s/g, '').slice(0, 10);
    setter(sanitized);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrDoc.trim()) {
      setErrorMsg('Por favor ingresa tu número de documento, usuario o correo.');
      return;
    }

    const result = AuthController.login(emailOrDoc, password);
    if (!result.success) {
      setErrorMsg(result.message || 'Error al iniciar sesión.');
      return;
    }

    onSuccess();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = regName.trim();
    const cleanDoc = regDoc.trim();
    const cleanPhone = regPhone.trim();
    const cleanPass = regPassword.trim();

    if (!cleanName) {
      setErrorMsg('El nombre completo es obligatorio.');
      return;
    }

    if (!cleanDoc) {
      setErrorMsg('El número de documento / cédula es obligatorio.');
      return;
    }

    if (!cleanPhone) {
      setErrorMsg('El número de teléfono móvil es obligatorio.');
      return;
    }

    if (!cleanPass) {
      setErrorMsg('La contraseña es obligatoria (máximo 10 caracteres, sin espacios).');
      return;
    }

    if (cleanPass.length > 10) {
      setErrorMsg('La contraseña no puede superar 10 caracteres.');
      return;
    }

    if (/\s/.test(regPassword)) {
      setErrorMsg('La contraseña no puede contener espacios en blanco.');
      return;
    }

    const result = AuthController.register({
      name: cleanName, // EXACT name without alterations
      email: regEmail.trim() ? regEmail.trim() : undefined, // Optional email
      documentId: cleanDoc,
      vereda: regVereda,
      phone: cleanPhone,
      role: regRole,
      password: cleanPass
    });

    if (!result.success) {
      setErrorMsg(result.message || 'Error al registrar usuario.');
      return;
    }

    onSuccess();
  };

  const handleRecoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setRecoverSuccessMsg('');

    if (!recoverDocOrEmail.trim()) {
      setErrorMsg('Ingresa tu cédula, documento o correo registrado.');
      return;
    }

    if (!newPassword) {
      setErrorMsg('Ingresa la nueva contraseña (hasta 10 caracteres, sin espacios).');
      return;
    }

    if (newPassword.length > 10) {
      setErrorMsg('La contraseña no puede superar 10 caracteres.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Las contraseñas no coinciden. Por favor verifica.');
      return;
    }

    const res = AuthController.recoverPassword(recoverDocOrEmail, newPassword);
    if (!res.success) {
      setErrorMsg(res.message);
      return;
    }

    setRecoverSuccessMsg(`¡Contraseña restablecida con éxito para ${res.user?.name}! Ahora puedes iniciar sesión con tu nueva clave.`);
    // Fill credentials in login for smooth transition
    setEmailOrDoc(recoverDocOrEmail);
    setPassword(newPassword);
  };

  // Demo account selection state (Only fills credentials in the form as an option before entering)
  const [selectedDemoRole, setSelectedDemoRole] = useState<UserRole | null>(null);

  const getDemoUser = (role: UserRole) => {
    const users = modelStore.getUsers();
    return users.find(u => u.role === role);
  };

  const handleSelectDemoAccount = (role: UserRole) => {
    const user = getDemoUser(role);
    if (user) {
      setEmailOrDoc(user.documentId);
      setPassword(user.password || '123456');
      setSelectedDemoRole(role);
      setErrorMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-emerald-900 flex flex-col justify-center items-center p-4 relative overflow-y-auto selection:bg-emerald-300 selection:text-emerald-950">
      {/* Background Decorative Rings */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md my-auto py-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-amber-300 shadow-xl shadow-emerald-950/50 mb-3 border-2 border-white/20">
            <Leaf className="w-9 h-9 text-emerald-950" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Eco-Rural</span>
            <span className="bg-amber-400 text-emerald-950 text-xs px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider">
              Tolima
            </span>
          </h1>
          <p className="text-sm font-semibold text-emerald-200 mt-1">
            Sistema de Gestión de Basura y Aseo Rural
          </p>
          <p className="text-xs text-emerald-300/80 mt-0.5">
            Purificación, Tolima &middot; Veredas Limpias, Cero Quemas
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Top Tabs (Login / Register / Recover) */}
          {authMode !== 'recover' ? (
            <div className="flex border-b border-gray-200">
              <button
                id="tab-login-btn"
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                className={`flex-1 py-3.5 text-xs font-bold text-center cursor-pointer transition-colors ${
                  authMode === 'login'
                    ? 'text-emerald-900 border-b-2 border-emerald-600 bg-emerald-50/60 font-black'
                    : 'text-gray-500 hover:text-gray-700 bg-gray-50'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                id="tab-register-btn"
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                className={`flex-1 py-3.5 text-xs font-bold text-center cursor-pointer transition-colors ${
                  authMode === 'register'
                    ? 'text-emerald-900 border-b-2 border-emerald-600 bg-emerald-50/60 font-black'
                    : 'text-gray-500 hover:text-gray-700 bg-gray-50'
                }`}
              >
                Crear Cuenta
              </button>
            </div>
          ) : (
            <div className="bg-emerald-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-amber-300" />
                <span className="text-xs font-bold">Recuperación de Contraseña</span>
              </div>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); setRecoverSuccessMsg(''); }}
                className="text-xs text-emerald-200 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver</span>
              </button>
            </div>
          )}

          <div className="p-6">
            {/* Error Banner */}
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Recovery Success Banner */}
            {recoverSuccessMsg && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <div>
                  <p>{recoverSuccessMsg}</p>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); setRecoverSuccessMsg(''); }}
                    className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline block"
                  >
                    Hacer clic aquí para iniciar sesión ahora
                  </button>
                </div>
              </div>
            )}

            {/* 1. LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cédula, Documento o Correo</span>
                  </label>
                  <input
                    id="input-login-usuario"
                    type="text"
                    value={emailOrDoc}
                    onChange={e => setEmailOrDoc(e.target.value)}
                    placeholder="Escribe tu número de cédula o correo..."
                    required
                    autoComplete="username"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-medium bg-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contraseña</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => { setAuthMode('recover'); setErrorMsg(''); }}
                      className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="input-login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => handlePasswordNoSpaces(e.target.value, setPassword)}
                      maxLength={10}
                      placeholder="Ingresa tu contraseña..."
                      required
                      autoComplete="current-password"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-medium bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                      title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Feedback when a demo account is selected */}
                {selectedDemoRole && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-start justify-between animate-in fade-in">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-extrabold text-emerald-900">
                          Cuenta seleccionada: {getDemoUser(selectedDemoRole)?.name || selectedDemoRole}
                        </div>
                        <p className="text-[11px] text-emerald-700 leading-snug mt-0.5">
                          Cédula y contraseña autocompletadas en el formulario. Haz clic en <strong>"Ingresar al Sistema Rural"</strong> para confirmar y acceder.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDemoRole(null);
                        setEmailOrDoc('');
                        setPassword('');
                      }}
                      className="text-[10px] font-bold text-gray-500 hover:text-red-600 ml-2 px-2 py-1 rounded bg-white border border-gray-200 shrink-0 cursor-pointer"
                      title="Limpiar campos"
                    >
                      Limpiar
                    </button>
                  </div>
                )}

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 mt-2"
                >
                  <span>Ingresar al Sistema Rural</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Acceso Rápido de Demostración - Solo como opción previa para cargar la cuenta antes de entrar */}
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Acceso Rápido de Demostración</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Opción antes de entrar
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 mb-2.5 leading-snug">
                    Selecciona una cuenta de prueba para autocompletar la cédula y la contraseña en los campos de arriba. <strong>No entrará directamente sin pedir la cuenta</strong>; deberás confirmar haciendo clic en el botón de ingreso.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {/* Coordinador Card */}
                    <button
                      id="btn-demo-coordinador"
                      type="button"
                      onClick={() => handleSelectDemoAccount('coordinador')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedDemoRole === 'coordinador'
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 bg-gray-50/80 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[11px] font-black text-purple-900 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-purple-600" />
                          Coordinador
                        </span>
                        {selectedDemoRole === 'coordinador' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-gray-800 truncate">
                        {getDemoUser('coordinador')?.name || 'Carlos Morales'}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        CC: 93.382.410
                      </div>
                    </button>

                    {/* Conductor Card */}
                    <button
                      id="btn-demo-conductor"
                      type="button"
                      onClick={() => handleSelectDemoAccount('conductor')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedDemoRole === 'conductor'
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 bg-gray-50/80 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[11px] font-black text-sky-900 flex items-center gap-1">
                          <Truck className="w-3 h-3 text-sky-600" />
                          Conductor
                        </span>
                        {selectedDemoRole === 'conductor' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-gray-800 truncate">
                        {getDemoUser('conductor')?.name || 'Jairo Benítez'}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        CC: 14.280.993
                      </div>
                    </button>

                    {/* Habitante Card */}
                    <button
                      id="btn-demo-habitante"
                      type="button"
                      onClick={() => handleSelectDemoAccount('habitante')}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedDemoRole === 'habitante'
                          ? 'border-emerald-600 bg-emerald-50/90 ring-2 ring-emerald-500/20'
                          : 'border-gray-200 bg-gray-50/80 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[11px] font-black text-amber-900 flex items-center gap-1">
                          <UserIcon className="w-3 h-3 text-amber-600" />
                          Habitante
                        </span>
                        {selectedDemoRole === 'habitante' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        )}
                      </div>
                      <div className="text-[11px] font-bold text-gray-800 truncate">
                        {getDemoUser('habitante')?.name || 'Esperanza Guzmán'}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                        CC: 65.742.118
                      </div>
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* 2. REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Nombre Completo *</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">Exactamente como aparecerá</span>
                  </label>
                  <input
                    id="input-reg-nombre"
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Escribe tus nombres y apellidos..."
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Cédula / Documento *
                    </label>
                    <input
                      id="input-reg-cedula"
                      type="text"
                      value={regDoc}
                      onChange={e => setRegDoc(e.target.value)}
                      placeholder="Número de cédula..."
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Teléfono Móvil *
                    </label>
                    <input
                      id="input-reg-telefono"
                      type="tel"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="315 xxx xxxx"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Vereda de Purificación</span>
                  </label>
                  <select
                    id="select-reg-vereda"
                    value={regVereda}
                    onChange={e => setRegVereda(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
                  >
                    {PURIFICACION_VEREDAS.map(v => (
                      <option key={v.id} value={v.name}>{v.name} ({v.zone})</option>
                    ))}
                  </select>
                </div>

                {/* CORREO NO OBLIGATORIO (OPCIONAL) */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>Correo Electrónico</span>
                    <span className="text-[10px] text-gray-400 font-semibold">(Opcional)</span>
                  </label>
                  <input
                    id="input-reg-email"
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="Opcional (si tienes correo electrónico)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
                  />
                </div>

                {/* CONTRASEÑA OBLIGATORIA (HASTA 10 CARACTERES, SIN ESPACIOS, CON VER CONTRASEÑA) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-700 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contraseña Obligatoria *</span>
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Hasta 10 carácteres, sin espacios ({regPassword.length}/10)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="input-reg-password"
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={e => handlePasswordNoSpaces(e.target.value, setRegPassword)}
                      maxLength={10}
                      placeholder="Crea tu contraseña (máx 10 letras/números)..."
                      required
                      className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                      title={showRegPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Tipo de Usuario / Rol
                  </label>
                  <select
                    id="select-reg-rol"
                    value={regRole}
                    onChange={e => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-semibold text-emerald-900 bg-emerald-50"
                  >
                    <option value="habitante">Habitante Rural / Líder Comunitario</option>
                    <option value="conductor">Conductor / Operador de Camión</option>
                    <option value="coordinador">Coordinador de Aseo Municipal</option>
                    <option value="administrador">Administrador del Sistema</option>
                  </select>
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer mt-3"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Crear Cuenta y Activar Servicio</span>
                </button>
              </form>
            )}

            {/* 3. RECOVER PASSWORD FORM */}
            {authMode === 'recover' && (
              <form onSubmit={handleRecoverSubmit} className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                  Ingresa tu número de cédula, teléfono o correo. Te permitiremos asignar una nueva contraseña segura al instante.
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Cédula, Teléfono o Correo Registrado *
                  </label>
                  <input
                    id="input-recover-doc"
                    type="text"
                    value={recoverDocOrEmail}
                    onChange={e => setRecoverDocOrEmail(e.target.value)}
                    placeholder="ej: 93.382.410 o 312 458 9021"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Nueva Contraseña *
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      Hasta 10 carácteres, sin espacios ({newPassword.length}/10)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="input-recover-newpassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => handlePasswordNoSpaces(e.target.value, setNewPassword)}
                      maxLength={10}
                      placeholder="Nueva clave..."
                      required
                      className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                      title={showNewPassword ? 'Ocultar' : 'Ver contraseña'}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Confirmar Nueva Contraseña *
                  </label>
                  <input
                    id="input-recover-confirm"
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={e => handlePasswordNoSpaces(e.target.value, setConfirmNewPassword)}
                    maxLength={10}
                    placeholder="Repite la nueva clave..."
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                </div>

                <button
                  id="btn-submit-recover"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Restablecer y Guardar Contraseña</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Environmental Message Footer */}
        <div className="mt-4 text-center text-xs text-emerald-200/80 flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Purificación Tolima &middot; Protegiendo los campos y el agua del Magdalena</span>
        </div>
      </div>
    </div>
  );
};

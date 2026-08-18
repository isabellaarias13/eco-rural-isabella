import React, { useState } from 'react';
import { Leaf, Lock, Mail, User as UserIcon, MapPin, Phone, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PURIFICACION_VEREDAS } from '../models/veredasData';
import { UserRole } from '../types';
import { AuthController } from '../controllers/authController';

interface AuthViewProps {
  onSuccess: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [emailOrDoc, setEmailOrDoc] = useState('coordinador@ecorural-purificacion.gov.co');
  const [password, setPassword] = useState('123456');

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regDoc, setRegDoc] = useState('');
  const [regVereda, setRegVereda] = useState(PURIFICACION_VEREDAS[0].name);
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('habitante');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrDoc.trim()) {
      setErrorMsg('Por favor ingresa tu correo, cédula o usuario.');
      return;
    }
    AuthController.login(emailOrDoc, password);
    onSuccess();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regDoc.trim() || !regPhone.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }
    AuthController.register({
      name: regName,
      email: regEmail,
      documentId: regDoc,
      vereda: regVereda,
      phone: regPhone,
      role: regRole
    });
    onSuccess();
  };

  const quickDemoLogin = (role: UserRole) => {
    AuthController.switchDemoRole(role);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-900 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md my-auto relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 via-teal-400 to-amber-300 shadow-xl shadow-emerald-950/50 mb-3 border-2 border-white/20">
            <Leaf className="w-9 h-9 text-emerald-950" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Eco-Rural</span>
            <span className="bg-amber-400 text-emerald-950 text-xs px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
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

        {/* Auth Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
          {/* Tab switcher: Login / Register */}
          <div className="flex border-b border-gray-200">
            <button
              id="tab-login-btn"
              onClick={() => { setIsRegister(false); setErrorMsg(''); }}
              className={`flex-1 py-3.5 text-xs font-bold text-center cursor-pointer transition-colors ${
                !isRegister
                  ? 'text-emerald-800 border-b-2 border-emerald-600 bg-emerald-50/50'
                  : 'text-gray-500 hover:text-gray-700 bg-gray-50'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              id="tab-register-btn"
              onClick={() => { setIsRegister(true); setErrorMsg(''); }}
              className={`flex-1 py-3.5 text-xs font-bold text-center cursor-pointer transition-colors ${
                isRegister
                  ? 'text-emerald-800 border-b-2 border-emerald-600 bg-emerald-50/50'
                  : 'text-gray-500 hover:text-gray-700 bg-gray-50'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          <div className="p-6">
            {errorMsg && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {!isRegister ? (
              /* LOGIN FORM */
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <UserIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Usuario / Correo / Cédula</span>
                  </label>
                  <input
                    id="input-login-usuario"
                    type="text"
                    value={emailOrDoc}
                    onChange={e => setEmailOrDoc(e.target.value)}
                    placeholder="ej: coordinador@ecorural-purificacion.gov.co"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contraseña</span>
                  </label>
                  <input
                    id="input-login-password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-medium"
                  />
                </div>

                <button
                  id="btn-submit-login"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
                >
                  <span>Ingresar al Sistema Rural</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    id="input-reg-nombre"
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    placeholder="Nombre y Apellidos"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Cédula / Documento
                    </label>
                    <input
                      id="input-reg-cedula"
                      type="text"
                      value={regDoc}
                      onChange={e => setRegDoc(e.target.value)}
                      placeholder="93.xxx.xxx"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Teléfono Móvil
                    </label>
                    <input
                      id="input-reg-telefono"
                      type="text"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="315 xxx xxxx"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs"
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

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    id="input-reg-email"
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="tu.correo@ejemplo.com"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
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
                  </select>
                </div>

                <button
                  id="btn-submit-register"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer mt-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Crear Cuenta y Activar Servicio</span>
                </button>
              </form>
            )}

            {/* Quick Demo Access Bar */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-center mb-2.5">
                Acceso Rápido de Demostración
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  id="btn-demo-coordinador"
                  type="button"
                  onClick={() => quickDemoLogin('coordinador')}
                  className="px-2 py-1.5 rounded-lg bg-emerald-100/70 hover:bg-emerald-200 text-emerald-950 text-[11px] font-bold transition-colors cursor-pointer border border-emerald-300 text-center"
                >
                  Coordinador
                </button>
                <button
                  id="btn-demo-conductor"
                  type="button"
                  onClick={() => quickDemoLogin('conductor')}
                  className="px-2 py-1.5 rounded-lg bg-sky-100/70 hover:bg-sky-200 text-sky-950 text-[11px] font-bold transition-colors cursor-pointer border border-sky-300 text-center"
                >
                  Conductor
                </button>
                <button
                  id="btn-demo-habitante"
                  type="button"
                  onClick={() => quickDemoLogin('habitante')}
                  className="px-2 py-1.5 rounded-lg bg-amber-100/70 hover:bg-amber-200 text-amber-950 text-[11px] font-bold transition-colors cursor-pointer border border-amber-300 text-center"
                >
                  Habitante
                </button>
              </div>
            </div>
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

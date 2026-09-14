import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ShieldAlert,
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Search, 
  Calendar, 
  Edit3, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Sparkles,
  Lock,
  BadgeCheck
} from 'lucide-react';
import { User, isAdmin, UserRole } from '../types';
import { modelStore } from '../models/store';
import { PURIFICACION_VEREDAS } from '../models/veredasData';

interface PerfilViewProps {
  currentUser: User;
  users: User[];
  onNavigateTab?: (tab: string) => void;
}

export const PerfilView: React.FC<PerfilViewProps> = ({
  currentUser,
  users,
  onNavigateTab
}) => {
  const isUserAdmin = isAdmin(currentUser);

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editEmail, setEditEmail] = useState(currentUser.email || '');
  const [editVereda, setEditVereda] = useState(currentUser.vereda);
  const [editPassword, setEditPassword] = useState(currentUser.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);

  // Registered users directory state
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'todos' | UserRole>('todos');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccessMessage(null);
    setSaveErrorMessage(null);

    if (!editName.trim()) {
      setSaveErrorMessage('El nombre no puede estar vacío.');
      return;
    }

    if (editPassword && editPassword.length < 4) {
      setSaveErrorMessage('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    const result = modelStore.updateUserProfile(currentUser.id, {
      name: editName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim() || undefined,
      vereda: editVereda,
      password: editPassword || currentUser.password
    });

    if (result.success) {
      setSaveSuccessMessage('¡Tu información ha sido actualizada y guardada exitosamente!');
      setIsEditing(false);
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } else {
      setSaveErrorMessage(result.message || 'Error al guardar los cambios.');
    }
  };

  const handleCancelEdit = () => {
    setEditName(currentUser.name);
    setEditPhone(currentUser.phone);
    setEditEmail(currentUser.email || '');
    setEditVereda(currentUser.vereda);
    setEditPassword(currentUser.password || '');
    setIsEditing(false);
    setSaveErrorMessage(null);
  };

  // Filter registered users
  const filteredUsers = users.filter(u => {
    const term = userSearch.toLowerCase().trim();
    const matchesSearch = 
      u.name.toLowerCase().includes(term) ||
      u.documentId.toLowerCase().includes(term) ||
      u.vereda.toLowerCase().includes(term) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      u.role.toLowerCase().includes(term);

    const matchesRole = roleFilter === 'todos' ? true : u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'administrador':
        return (
          <span className="bg-purple-100 text-purple-900 border border-purple-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            Administrador
          </span>
        );
      case 'coordinador':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Coordinador
          </span>
        );
      case 'conductor':
        return (
          <span className="bg-sky-100 text-sky-900 border border-sky-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1">
            <UserIcon className="w-3.5 h-3.5 text-sky-700" />
            Conductor
          </span>
        );
      case 'habitante':
      default:
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1">
            <UserIcon className="w-3.5 h-3.5 text-amber-700" />
            Habitante
          </span>
        );
    }
  };

  return (
    <div id="perfil-view" className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h2 className="text-xl font-black text-emerald-950 tracking-tight">
              Mi Perfil & Directorio de Personas Registradas
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Consulta tu información personal, gestiona tus credenciales y verifica las personas registradas en el sistema rural
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {getRoleBadge(currentUser.role)}
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center space-x-2.5 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {saveErrorMessage && (
        <div className="p-4 bg-red-50 border border-red-300 text-red-900 rounded-2xl flex items-center space-x-2.5 text-xs font-semibold animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{saveErrorMessage}</span>
        </div>
      )}

      {/* Grid: Left Column (My Profile & Edit) + Right Column (Permissions & Quick Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Information Card (2 cols on desktop) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-amber-300 font-black text-xl flex items-center justify-center shadow-md">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-black text-emerald-950">{currentUser.name}</h3>
                <p className="text-xs text-gray-500">Cédula / Documento: <span className="font-mono font-bold text-gray-800">{currentUser.documentId}</span></p>
              </div>
            </div>

            {!isEditing ? (
              <button
                id="btn-edit-profile"
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Mi Información</span>
              </button>
            ) : (
              <button
                id="btn-cancel-edit-profile"
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancelar</span>
              </button>
            )}
          </div>

          {!isEditing ? (
            /* Read-Only View of User Details */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Nombre Completo
                </span>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  {currentUser.name}
                </span>
              </div>

              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Número de Documento / Cédula
                </span>
                <span className="text-sm font-bold text-gray-900 font-mono flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" />
                  {currentUser.documentId}
                </span>
              </div>

              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Teléfono de Contacto
                </span>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  {currentUser.phone || 'No registrado'}
                </span>
              </div>

              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Correo Electrónico
                </span>
                <span className="text-sm font-bold text-gray-900 truncate flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  {currentUser.email || 'No registrado'}
                </span>
              </div>

              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Vereda o Sector de Residencia
                </span>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {currentUser.vereda}
                </span>
              </div>

              <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Rol y Permisos en el Sistema
                </span>
                <div className="mt-1">
                  {getRoleBadge(currentUser.role)}
                </div>
              </div>
            </div>
          ) : (
            /* Editable Form to Update Information */
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    id="input-edit-name"
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Cédula (No modificable)
                  </label>
                  <input
                    type="text"
                    value={currentUser.documentId}
                    disabled
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-xs font-mono font-medium text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Teléfono Celular *
                  </label>
                  <input
                    id="input-edit-phone"
                    type="text"
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    id="input-edit-email"
                    type="email"
                    value={editEmail}
                    onChange={e => setEditEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Vereda de Purificación *
                  </label>
                  <select
                    id="select-edit-vereda"
                    value={editVereda}
                    onChange={e => setEditVereda(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-gray-900 bg-white"
                  >
                    {PURIFICACION_VEREDAS.map(v => (
                      <option key={v.id} value={v.name}>{v.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Nueva Contraseña
                    </label>
                    <span className="text-[10px] text-gray-400">Opcional</span>
                  </div>
                  <div className="relative">
                    <input
                      id="input-edit-password"
                      type={showPassword ? 'text' : 'password'}
                      value={editPassword}
                      onChange={e => setEditPassword(e.target.value)}
                      placeholder="Dejar vacía para mantener actual"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-gray-900 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-save-profile"
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: Roles & Capabilities Card */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-black tracking-tight">Nivel de Acceso y Permisos</h4>
            </div>

            {isUserAdmin ? (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-emerald-800/60 rounded-xl border border-emerald-700/60 text-emerald-100">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-4 h-4" />
                    Cuenta de Administrador Activa
                  </p>
                  <p className="leading-relaxed text-[11px]">
                    Tienes control total: puedes programar rutas, registrar nuevos camiones, registrar pesajes de recolección y eliminar o modificar información en todo el sistema.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[11px] text-emerald-200 font-medium pl-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Edición y eliminación de rutas veredales</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Alta y baja de camiones en la flota</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Control y resolución de alertas por quema</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-emerald-800/60 rounded-xl border border-emerald-700/60 text-emerald-100">
                  <p className="font-bold text-emerald-200 flex items-center gap-1.5 mb-1">
                    <Lock className="w-4 h-4 text-amber-300" />
                    Modo de Consulta & Participación Ciudadana
                  </p>
                  <p className="leading-relaxed text-[11px]">
                    Tu rol actual es <strong>{currentUser.role}</strong>. Para mantener la integridad de los datos oficiales, los cambios estructurales y eliminaciones están restringidos exclusivamente a administradores.
                  </p>
                </div>
                <ul className="space-y-1.5 text-[11px] text-emerald-200 font-medium pl-1">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Reportar incidencias y quemas en veredas</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Consultar rutas y horarios asignados</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Visualizar pesajes y reciclaje en Purificación</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2 text-xs">
            <h5 className="font-black text-gray-900 uppercase tracking-wider text-[11px]">
              Vereda Asignada
            </h5>
            <p className="text-gray-600 leading-relaxed text-[11px]">
              Estás vinculado a la vereda <strong>{currentUser.vereda}</strong>. Las notificaciones de recolección y alertas comunitarias se orientarán principalmente a tu sector rural.
            </p>
          </div>
        </div>
      </div>

      {/* DIRECTORY OF REGISTERED PERSONS SECTION (Real-time updates) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-emerald-950">
                Directorio de Personas Registradas ({users.length})
              </h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Lista sincronizada en tiempo real. En cuanto una persona se registra, su nombre aparece de inmediato en este listado.
            </p>
          </div>

          <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{users.length} usuarios activos en Tolima</span>
          </span>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="input-search-registered-users"
              type="text"
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              placeholder="Buscar por nombre, documento, vereda o correo..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Filtrar por rol:</span>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold bg-white text-gray-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="todos">Todos los Roles ({users.length})</option>
              <option value="habitante">Habitantes</option>
              <option value="conductor">Conductores</option>
              <option value="coordinador">Coordinadores</option>
              <option value="administrador">Administradores</option>
            </select>
          </div>
        </div>

        {/* Users Table / Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase font-black tracking-wider text-[10px] border-y border-gray-200">
                <th className="p-3 rounded-l-lg">Nombre del Usuario</th>
                <th className="p-3">Documento / Cédula</th>
                <th className="p-3">Rol / Tipo</th>
                <th className="p-3">Vereda</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3 text-right rounded-r-lg">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400 text-xs">
                    No se encontraron usuarios registrados con el criterio de búsqueda "{userSearch}".
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => {
                  const isCurrent = user.id === currentUser.id || user.documentId === currentUser.documentId;
                  return (
                    <tr 
                      key={user.id || user.documentId || idx}
                      className={`hover:bg-emerald-50/50 transition-colors ${isCurrent ? 'bg-emerald-50/70 font-semibold' : ''}`}
                    >
                      <td className="p-3">
                        <div className="flex items-center space-x-2.5">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            isCurrent 
                              ? 'bg-emerald-700 text-white shadow-xs' 
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
                              <span>{user.name}</span>
                              {isCurrent && (
                                <span className="bg-emerald-700 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded">
                                  Tú
                                </span>
                              )}
                            </div>
                            {user.email && (
                              <div className="text-[10px] text-gray-400 truncate max-w-[180px]">{user.email}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3 font-mono font-bold text-gray-700">
                        {user.documentId}
                      </td>

                      <td className="p-3">
                        {getRoleBadge(user.role)}
                      </td>

                      <td className="p-3 text-gray-700">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{user.vereda}</span>
                        </div>
                      </td>

                      <td className="p-3 text-gray-600 font-mono text-[11px]">
                        {user.phone || '—'}
                      </td>

                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Registrado
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

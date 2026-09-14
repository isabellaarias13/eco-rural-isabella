import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Users, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  CheckCheck, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Search,
  ShieldAlert,
  Info,
  Trash2
} from 'lucide-react';
import { AppNotification, User } from '../types';
import { modelStore } from '../models/store';
import { ReportController } from '../controllers/reportController';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  users: User[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  users
}) => {
  const [activeTab, setActiveTab] = useState<'notificaciones' | 'usuarios'>('notificaciones');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExportingCSV, setIsExportingCSV] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteStatusMessage, setDeleteStatusMessage] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Clean deduplicated users list
  const cleanUsers = React.useMemo(() => {
    return modelStore.deduplicateUsers(users);
  }, [users]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    modelStore.markAllNotificationsAsRead();
  };

  const handleExportUsersCSV = () => {
    setIsExportingCSV(true);
    try {
      ReportController.exportUsersToCSV(cleanUsers);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingCSV(false);
    }
  };

  const handleExportUsersPDF = () => {
    setIsExportingPDF(true);
    try {
      ReportController.exportUsersToPDF(cleanUsers);
    } catch (e) {
      console.error(e);
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    const targetName = userToDelete.name;
    const targetRole = userToDelete.role;
    const result = modelStore.deleteUser(userToDelete.id);
    setIsDeleting(false);
    setUserToDelete(null);

    if (result.success) {
      setDeleteStatusMessage(`El usuario "${targetName}" (${targetRole.toUpperCase()}) fue eliminado del registro exitosamente.`);
      setTimeout(() => setDeleteStatusMessage(null), 4500);
    } else {
      setDeleteStatusMessage(result.message);
      setTimeout(() => setDeleteStatusMessage(null), 4500);
    }
  };

  const filteredUsers = cleanUsers.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.documentId.includes(q) ||
      u.vereda.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-emerald-900 text-white px-5 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-700/70 flex items-center justify-center text-amber-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black tracking-tight flex items-center gap-2">
                <span>Centro de Notificaciones & Usuarios</span>
                {unreadCount > 0 && (
                  <span className="bg-amber-400 text-emerald-950 text-[10px] font-bold px-2 py-0.2 rounded-full">
                    {unreadCount} nuevas
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-emerald-200">
                Avisos comunitarios y registro oficial de habitantes de Purificación
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
            title="Cerrar panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/80 px-4 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('notificaciones')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notificaciones'
                ? 'bg-white text-emerald-950 border-t-2 border-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Notificaciones y Alertas</span>
            {unreadCount > 0 && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('usuarios')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'usuarios'
                ? 'bg-white text-emerald-950 border-t-2 border-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Usuarios Registrados</span>
            <span className="bg-gray-200 text-gray-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {cleanUsers.length}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: NOTIFICATIONS FEED */}
          {activeTab === 'notificaciones' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Historial de Avisos ({notifications.length})
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <CheckCheck className="w-4 h-4 text-emerald-600" />
                    <span>Marcar todas como leídas</span>
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Bell className="w-10 h-10 mx-auto mb-2 opacity-30 text-emerald-800" />
                  <p className="text-xs font-medium">No hay notificaciones en este momento.</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        !notif.read
                          ? 'bg-emerald-50/70 border-emerald-200 shadow-sm'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2.5">
                          <div className="mt-0.5 shrink-0">
                            {notif.type === 'alerta' ? (
                              <ShieldAlert className="w-4 h-4 text-red-600" />
                            ) : notif.type === 'comunidad' ? (
                              <Users className="w-4 h-4 text-emerald-600" />
                            ) : notif.type === 'exito' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Info className="w-4 h-4 text-sky-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs font-bold text-gray-900">{notif.title}</h4>
                              {!notif.read && (
                                <span className="bg-amber-400 text-emerald-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                                  Nueva
                                </span>
                              )}
                              {notif.vereda && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md font-semibold">
                                  {notif.vereda}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-700 mt-1 leading-relaxed">{notif.message}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 shrink-0 font-medium">{notif.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REGISTERED USERS LIST & DOWNLOADS */}
          {activeTab === 'usuarios' && (
            <div className="space-y-4">
              {deleteStatusMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl flex items-center justify-between text-xs font-bold shadow-xs animate-in fade-in">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{deleteStatusMessage}</span>
                  </div>
                  <button
                    onClick={() => setDeleteStatusMessage(null)}
                    className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Header Action Bar for Users */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Censo de Usuarios de Purificación ({cleanUsers.length})</span>
                  </h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Descarga el listado completo o elimina cualquier usuario que desees dar de baja.
                  </p>
                </div>

                {/* Download Buttons for Users */}
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={handleExportUsersCSV}
                    disabled={isExportingCSV}
                    className="flex-1 sm:flex-none px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95"
                    title="Descargar en Excel o CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Excel / CSV</span>
                  </button>

                  <button
                    onClick={handleExportUsersPDF}
                    disabled={isExportingPDF}
                    className="flex-1 sm:flex-none px-3 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-1.5 active:scale-95"
                    title="Descargar listado en PDF Oficial"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-300" />
                    <span>PDF Oficial</span>
                  </button>
                </div>
              </div>

              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar usuario por nombre, cédula o vereda..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                />
              </div>

              {/* Users List Cards / Table */}
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs font-medium">
                    No se encontraron usuarios con ese criterio de búsqueda.
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <div
                      key={user.id}
                      className="p-3 bg-white hover:bg-gray-50/80 rounded-xl border border-gray-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center font-black text-xs border border-emerald-300 shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-gray-900">{user.name}</span>
                            <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold uppercase ${
                              user.role === 'coordinador'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : user.role === 'conductor'
                                ? 'bg-sky-100 text-sky-900 border border-sky-300'
                                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            }`}>
                              {user.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1 flex-wrap">
                            <span><strong>C.C.:</strong> {user.documentId}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-emerald-600" />
                              {user.vereda}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {user.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                        <div className="text-left sm:text-right text-[11px] text-gray-400 sm:shrink-0">
                          {user.email ? (
                            <div className="text-emerald-700 font-medium truncate max-w-[150px]">{user.email}</div>
                          ) : (
                            <div className="italic text-gray-400">Sin correo</div>
                          )}
                          <div className="text-[10px] text-gray-400 mt-0.5">
                            {user.createdAt ? `Reg: ${user.createdAt}` : 'Usuario inicial'}
                          </div>
                        </div>

                        {/* DELETE BUTTON */}
                        <button
                          id={`btn-modal-delete-user-${user.id}`}
                          type="button"
                          onClick={() => setUserToDelete(user)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95"
                          title={`Eliminar usuario ${user.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
          <span>Purificación, Tolima &middot; Eco-Rural Oficial</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

        {/* MODAL CONFIRMATION TO DELETE USER */}
        {userToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95">
              <div className="flex items-center space-x-3 text-red-600">
                <div className="w-11 h-11 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-gray-900">
                    ¿Eliminar usuario del registro?
                  </h3>
                  <p className="text-xs text-gray-500">
                    Esta acción quitará al habitante o usuario de la base de datos de Purificación de forma permanente.
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 text-xs space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Nombre:</span>
                  <span className="font-extrabold text-gray-900">{userToDelete.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Documento / C.C.:</span>
                  <span className="font-mono font-bold text-gray-800">{userToDelete.documentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Rol asignado:</span>
                  <span className="font-bold text-emerald-800 uppercase text-[10px] bg-emerald-100 px-2 py-0.5 rounded">
                    {userToDelete.role}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Vereda:</span>
                  <span className="text-gray-700">{userToDelete.vereda}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setUserToDelete(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-colors cursor-pointer shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isDeleting ? 'Eliminando...' : 'Sí, Eliminar Usuario'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

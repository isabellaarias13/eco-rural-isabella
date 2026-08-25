import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Leaf, 
  MapPin, 
  User as UserIcon, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  BookOpen,
  ChevronDown,
  Database,
  CloudCheck
} from 'lucide-react';
import { User, AppNotification } from '../types';
import { modelStore } from '../models/store';
import { AuthController } from '../controllers/authController';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenReportModal: () => void;
  onOpenGuideModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenGuideModal
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [firebaseConnected, setFirebaseConnected] = useState(true);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const update = () => {
      setNotifications(modelStore.getNotifications());
      setFirebaseConnected(modelStore.isFirebaseConnected());
    };
    update();
    return modelStore.subscribe(update);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notif: AppNotification) => {
    modelStore.markNotificationAsRead(notif.id);
    if (notif.linkTab) {
      setActiveTab(notif.linkTab);
      setShowNotifMenu(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Principal' },
    { id: 'recolecciones', label: 'Recolecciones' },
    { id: 'rutas', label: 'Rutas' },
    { id: 'camiones', label: 'Camiones' },
    { id: 'reportes', label: 'Reportes y Análisis' }
  ];

  return (
    <header id="main-header" className="bg-emerald-900 text-white sticky top-0 z-40 shadow-md border-b border-emerald-800">
      {/* Top micro-bar for Purificación Tolima regional identity */}
      <div className="bg-emerald-950 px-4 py-1 text-xs text-emerald-200/90 flex flex-wrap justify-between items-center border-b border-emerald-800/60">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-white">Municipio de Purificación, Tolima</span>
          <span className="hidden sm:inline text-emerald-400">|</span>
          <span className="hidden sm:inline">Zona Rural &middot; Cuidado del Aire y la Fauna</span>
          <span className="hidden md:inline-flex items-center gap-1 bg-emerald-800/80 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-600/50">
            <Database className="w-2.5 h-2.5 text-emerald-400" />
            <span>Cloud Firestore Conectado</span>
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            id="btn-anti-quema-banner"
            onClick={onOpenReportModal}
            className="flex items-center space-x-1 text-amber-300 hover:text-amber-200 font-semibold cursor-pointer transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reportar Quema o Basurero Ilegal</span>
          </button>
          <button 
            id="btn-guia-reciclaje"
            onClick={onOpenGuideModal}
            className="hidden md:flex items-center space-x-1 text-emerald-200 hover:text-white cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guía de Aseo Rural</span>
          </button>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-inner text-white font-bold text-xl">
              <Leaf className="w-6 h-6 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">Eco-Rural</span>
                <span className="bg-amber-400 text-emerald-950 text-[10px] uppercase font-black px-1.5 py-0.5 rounded tracking-wider">
                  Tolima
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 font-medium">Gestión de Basura & Aseo Rural</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-sm ring-1 ring-emerald-600'
                      : 'text-emerald-100 hover:bg-emerald-800/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Notifications, Emergency, User Profile */}
          <div className="flex items-center space-x-3">
            {/* Quick Report Button */}
            <button
              id="btn-quick-alert"
              onClick={onOpenReportModal}
              className="hidden sm:flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-emerald-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-emerald-950" />
              <span>Reportar Incidencia</span>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="btn-notifications-toggle"
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-lg bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 hover:text-white relative cursor-pointer transition-colors"
                title="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div 
                  id="notifications-panel"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-gray-900 text-sm">Notificaciones de Purificación</span>
                      {unreadCount > 0 && (
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                          {unreadCount} nuevas
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => modelStore.markAllNotificationsAsRead()}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                      >
                        Marcar leídas
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-gray-500">
                        No hay notificaciones registradas
                      </div>
                    ) : (
                      notifications.slice(0, 6).map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3.5 hover:bg-emerald-50/70 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-emerald-50/40 font-medium' : 'opacity-85'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-bold text-emerald-950">{notif.title}</h4>
                            <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                          {notif.vereda && (
                            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded mt-1.5">
                              <MapPin className="w-2.5 h-2.5 mr-0.5" />
                              {notif.vereda}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Switcher Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  id="btn-user-menu"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-emerald-800/80 hover:bg-emerald-800 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="font-bold text-white leading-none truncate max-w-[110px]">{currentUser.name}</p>
                    <p className="text-[10px] text-emerald-300 capitalize">{currentUser.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>

                {showUserMenu && (
                  <div 
                    id="user-dropdown-panel"
                    className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 p-2 z-50"
                  >
                    <div className="p-3 border-b border-gray-100 bg-gray-50 rounded-lg">
                      <p className="text-xs font-bold text-gray-900">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-500">{currentUser.email}</p>
                      <div className="flex items-center space-x-1 mt-1 text-[11px] text-emerald-700 font-medium">
                        <MapPin className="w-3 h-3" />
                        <span>Vereda: {currentUser.vereda}</span>
                      </div>
                    </div>

                    {/* Fast role switcher for easy evaluation */}
                    <div className="p-2 border-b border-gray-100">
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">
                        Cambiar Rol de Prueba
                      </p>
                      <div className="grid grid-cols-3 gap-1">
                        {(['coordinador', 'conductor', 'habitante'] as const).map(role => (
                          <button
                            key={role}
                            onClick={() => {
                              AuthController.switchDemoRole(role);
                              setShowUserMenu(false);
                            }}
                            className={`px-2 py-1 text-[10px] font-bold rounded capitalize cursor-pointer transition-colors ${
                              currentUser.role === role
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-1">
                      <button
                        id="btn-logout"
                        onClick={() => {
                          AuthController.logout();
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden flex overflow-x-auto space-x-2 py-2 border-t border-emerald-800 scrollbar-none">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                  isActive ? 'bg-emerald-800 text-white' : 'text-emerald-200 hover:bg-emerald-800/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

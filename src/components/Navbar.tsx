import React, { useState } from 'react';
import { 
  Leaf, 
  LayoutDashboard, 
  Route as RouteIcon, 
  Truck as TruckIcon, 
  BarChart3, 
  LogOut, 
  Bell, 
  ShieldAlert, 
  BookOpen, 
  Scale, 
  Menu, 
  X, 
  Sparkles,
  User as UserIcon
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onOpenReportIncident: () => void;
  onOpenGuide: () => void;
  onOpenNotifications: () => void;
  notificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  onLogout,
  onOpenReportIncident,
  onOpenGuide,
  onOpenNotifications,
  notificationsCount
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Principal', icon: LayoutDashboard },
    { id: 'recolecciones', label: 'Recolecciones', icon: Scale },
    { id: 'rutas', label: 'Rutas y Horarios', icon: RouteIcon },
    { id: 'camiones', label: 'Camiones y Flota', icon: TruckIcon },
    { id: 'reportes', label: 'Reportes y Análisis', icon: BarChart3 },
    { id: 'perfil', label: 'Mi Perfil', icon: UserIcon },
  ];

  return (
    <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-40 border-b border-emerald-800">
      {/* Top Notification Bar for Rural Tolima */}
      <div className="bg-emerald-950 px-4 py-1 text-[11px] text-emerald-200 border-b border-emerald-800/50 flex justify-between items-center">
        <div className="flex items-center space-x-2 truncate">
          <span className="bg-amber-400 text-emerald-950 font-black px-1.5 py-0.2 rounded text-[9px] uppercase tracking-wider">
            Purificación Tolima
          </span>
          <span className="truncate">Campaña "Veredas Limpias, Cero Quemas de Basura" &middot; 2026</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-[10px]">
          <button 
            onClick={onOpenGuide}
            className="text-amber-300 hover:text-amber-200 font-bold hover:underline cursor-pointer flex items-center gap-1"
          >
            <BookOpen className="w-3 h-3" />
            <span>Guía de Separación</span>
          </button>
          <span className="text-emerald-700">|</span>
          <button 
            onClick={onOpenReportIncident}
            className="text-emerald-300 hover:text-white font-semibold cursor-pointer flex items-center gap-1"
          >
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Reportar Incidencia</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div 
            onClick={() => onSelectTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-300 flex items-center justify-center text-emerald-950 shadow-md">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black tracking-tight text-white">Eco-Rural</span>
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black uppercase px-1.5 py-0.2 rounded-full">
                  Tolima
                </span>
              </div>
              <p className="text-[10px] font-semibold text-emerald-300 leading-none">
                Aseo & Gestión de Basura Rural
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-950 shadow-sm'
                      : 'text-emerald-100 hover:text-white hover:bg-emerald-800/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-emerald-300'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Profile & Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Quick Alert Button */}
            <button
              id="nav-quick-report-btn"
              onClick={onOpenReportIncident}
              className="bg-amber-400 hover:bg-amber-300 text-emerald-950 px-3 py-1.5 rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center space-x-1 shadow-sm"
              title="Reportar quema o botadero en vereda"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Reportar</span>
            </button>

            {/* Notifications Bell */}
            <button
              id="nav-bell-desktop"
              onClick={onOpenNotifications}
              className="relative p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
              title={`${notificationsCount} notificaciones y usuarios`}
            >
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-900 animate-pulse"></span>
              )}
            </button>

            {/* Current User Info */}
            <div 
              onClick={() => onSelectTab('perfil')}
              className="flex items-center space-x-2 pl-2 border-l border-emerald-800 cursor-pointer hover:opacity-90 transition-opacity"
              title="Ver mi perfil"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-xs border border-emerald-600 shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-white truncate max-w-[130px]" title={currentUser.name}>
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-300 capitalize font-medium">
                  {currentUser.role} &middot; {currentUser.vereda.split(' ')[0]}
                </div>
              </div>
            </div>

            <button
              id="btn-logout"
              onClick={onLogout}
              className="p-1.5 text-emerald-300 hover:text-red-300 hover:bg-emerald-800 rounded-lg transition-colors cursor-pointer ml-1"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Right Action Buttons (Notifications + Hamburger) */}
          <div className="lg:hidden flex items-center space-x-1.5">
            <button
              id="nav-bell-mobile"
              onClick={onOpenNotifications}
              className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer relative"
              title="Ver notificaciones y usuarios"
            >
              <Bell className="w-5 h-5" />
              {notificationsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-ping"></span>
              )}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 focus:outline-none cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-t border-emerald-800 px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2.5 ${
                    isActive ? 'bg-white text-emerald-950' : 'text-emerald-100 hover:bg-emerald-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Mobile Notifications button in menu */}
            <button
              id="mobile-menu-notifications-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenNotifications();
              }}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between text-amber-200 bg-emerald-900/60 hover:bg-emerald-900 border border-emerald-700/50"
            >
              <div className="flex items-center space-x-2.5">
                <Bell className="w-4 h-4 text-amber-300" />
                <span>Notificaciones & Censo de Usuarios</span>
              </div>
              {notificationsCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                  {notificationsCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-emerald-800 flex justify-between items-center text-xs">
            <div className="flex items-center space-x-2">
              <UserIcon className="w-4 h-4 text-amber-300" />
              <span className="font-bold truncate max-w-[160px]">{currentUser.name}</span>
            </div>
            <button
              onClick={onLogout}
              className="text-red-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

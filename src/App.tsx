import React, { useState, useEffect } from 'react';
import { modelStore } from './models/store';
import { AuthController } from './controllers/authController';
import { Navbar } from './components/Navbar';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { RecoleccionesView } from './views/RecoleccionesView';
import { RutasView } from './views/RutasView';
import { CamionesView } from './views/CamionesView';
import { ReportesView } from './views/ReportesView';

// Modals
import { NewRouteModal } from './components/NewRouteModal';
import { NewTruckModal } from './components/NewTruckModal';
import { NewCollectionModal } from './components/NewCollectionModal';
import { ReportIncidentModal } from './components/ReportIncidentModal';
import { RuralRecyclingGuideModal } from './components/RuralRecyclingGuideModal';

export default function App() {
  const [state, setState] = useState(modelStore.getState());
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modal states
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [isTruckModalOpen, setIsTruckModalOpen] = useState(false);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Subscribe to Model Store changes (MVC Observer Pattern)
  useEffect(() => {
    const unsubscribe = modelStore.subscribe(newState => {
      setState({ ...newState });
    });
    return () => unsubscribe();
  }, []);

  // If user is not authenticated, display login / register view
  if (!state.currentUser) {
    return <AuthView onSuccess={() => setActiveTab('dashboard')} />;
  }

  const handleLogout = () => {
    AuthController.logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navigation Bar with active tab state and role badge */}
      <Navbar
        currentUser={state.currentUser}
        activeTab={activeTab}
        onSelectTab={tab => setActiveTab(tab)}
        onLogout={handleLogout}
        onOpenReportIncident={() => setIsReportModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        notificationsCount={state.notifications.length}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            routes={state.routes}
            collections={state.collections}
            trucks={state.trucks}
            alerts={state.alerts}
            notifications={state.notifications}
            monthlyStats={state.monthlyStats}
            materials={state.materials}
            onNavigateTab={tab => setActiveTab(tab)}
            onOpenNewRoute={() => setIsRouteModalOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'recolecciones' && (
          <RecoleccionesView
            routes={state.routes}
            collections={state.collections}
            trucks={state.trucks}
            onOpenNewRoute={() => setIsRouteModalOpen(true)}
            onOpenNewCollection={() => setIsCollectionModalOpen(true)}
          />
        )}

        {activeTab === 'rutas' && (
          <RutasView
            routes={state.routes}
            trucks={state.trucks}
            alerts={state.alerts}
            onOpenNewRoute={() => setIsRouteModalOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'camiones' && (
          <CamionesView
            trucks={state.trucks}
            onOpenNewTruck={() => setIsTruckModalOpen(true)}
          />
        )}

        {activeTab === 'reportes' && (
          <ReportesView
            monthlyStats={state.monthlyStats}
            materials={state.materials}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 px-6 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-semibold text-emerald-950">
            Eco-Rural Purificación &copy; 2026 &middot; Sistema de Gestión de Basura y Aseo Rural del Tolima
          </p>
          <div className="flex items-center space-x-4 text-emerald-700 font-bold">
            <button 
              onClick={() => setIsGuideModalOpen(true)} 
              className="hover:underline cursor-pointer"
            >
              Guía de Separación
            </button>
            <button 
              onClick={() => setIsReportModalOpen(true)} 
              className="hover:underline cursor-pointer"
            >
              Reportar Incidencia
            </button>
            <span className="text-gray-400 font-normal">Tolima, Colombia</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewRouteModal
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        trucks={state.trucks}
      />

      <NewTruckModal
        isOpen={isTruckModalOpen}
        onClose={() => setIsTruckModalOpen(false)}
      />

      <NewCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        trucks={state.trucks}
      />

      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <RuralRecyclingGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />
    </div>
  );
}


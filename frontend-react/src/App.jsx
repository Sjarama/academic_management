import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ToastContainer from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import EntityPage from './pages/EntityPage';
import { useToast } from './hooks/useToast';
import { SERVICES } from './config/services';
import './App.css';

const EntityPageWrapper = forwardRef(function EntityPageWrapper({ svc, toast, refreshKey }, ref) {
  const [triggerNew, setTriggerNew]       = useState(0);
  const [triggerExport, setTriggerExport] = useState(0);

  useImperativeHandle(ref, () => ({
    openCreate: () => setTriggerNew(n => n + 1),
    exportData: () => setTriggerExport(n => n + 1),
  }));

  return (
    <EntityPage
      svc={svc}
      toast={toast}
      refreshKey={refreshKey}
      triggerNew={triggerNew}
      triggerExport={triggerExport}
    />
  );
});

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [refreshKey, setRefreshKey]   = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toasts, toast }             = useToast();
  const pageRef                       = useRef(null);

  const svc = SERVICES[currentPage];

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
      />

      <div className="main">
        <Topbar
          currentPage={currentPage}
          onRefresh={() => setRefreshKey(k => k + 1)}
          onNew={() => pageRef.current?.openCreate()}
          onExport={() => pageRef.current?.exportData()}
          onMenuToggle={() => setSidebarOpen(o => !o)}
        />

        <div className="content">
          {currentPage === 'dashboard' ? (
            <Dashboard refreshKey={refreshKey} />
          ) : svc ? (
            <EntityPageWrapper
              key={currentPage}
              svc={svc}
              toast={toast}
              refreshKey={refreshKey}
              ref={pageRef}
            />
          ) : null}
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ReportForm from './components/ReportForm';
import SubmissionList from './components/SubmissionList';
import Dashboard from './components/Dashboard';
import { AppView } from './types';
import { storageService } from './services/storageService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.FORM);

  useEffect(() => {
    storageService.incrementPageView(activeView).catch(console.error);
  }, [activeView]);

  const renderView = () => {
    switch (activeView) {
      case AppView.FORM:
        return <ReportForm onSuccess={() => setActiveView(AppView.LIST)} />;
      case AppView.LIST:
        return <SubmissionList />;
      case AppView.DASHBOARD:
        return <Dashboard />;
      default:
        return <ReportForm onSuccess={() => setActiveView(AppView.LIST)} />;
    }
  };

  return (
    <Layout activeView={activeView} setActiveView={setActiveView}>
      <div className="transition-opacity duration-300">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;

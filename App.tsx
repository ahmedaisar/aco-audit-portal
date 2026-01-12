
import React, { useState } from 'react';
import Layout from './components/Layout';
import ReportForm from './components/ReportForm';
import COBForm from './components/COBForm';
import AHRForm from './components/AHRForm';
import SubmissionList from './components/SubmissionList';
import Dashboard from './components/Dashboard';
import { AppView, TabType } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.FORM);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.RAS);

  const renderForm = () => {
    switch (activeTab) {
      case TabType.RAS:
        return <ReportForm onSuccess={() => setActiveView(AppView.LIST)} />;
      case TabType.COB:
        return <COBForm onSuccess={() => setActiveView(AppView.LIST)} />;
      case TabType.AHR:
        return <AHRForm onSuccess={() => setActiveView(AppView.LIST)} />;
      default:
        return <ReportForm onSuccess={() => setActiveView(AppView.LIST)} />;
    }
  };

  const renderView = () => {
    switch (activeView) {
      case AppView.FORM:
        return (
          <div className="space-y-8">
            <div className="flex justify-center bg-white/50 p-1.5 rounded-2xl border border-slate-200 max-w-fit mx-auto shadow-sm backdrop-blur-sm">
              {Object.values(TabType).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${
                    activeTab === tab 
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/20' 
                    : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {renderForm()}
          </div>
        );
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
      <div className="transition-all duration-300">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;

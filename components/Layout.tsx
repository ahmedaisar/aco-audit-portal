
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:h-16 items-center py-3 md:py-0 gap-3">
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="bg-teal-600 text-white p-2 rounded-lg shadow-sm">
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-slate-800 leading-tight">Atmosphere Core</h1>
                <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-teal-600 font-bold">Change Request Portal</p>
              </div>
            </div>
            
            <nav className="flex w-full md:w-auto bg-slate-100 md:bg-transparent p-1 md:p-0 rounded-xl md:rounded-none space-x-1">
              {(Object.values(AppView)).map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`flex-1 md:flex-none px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all capitalize ${
                    activeView === view 
                      ? 'bg-white md:bg-teal-50 text-teal-700 shadow-sm md:shadow-none' 
                      : 'text-slate-500 hover:text-slate-700 md:hover:bg-slate-50'
                  }`}
                >
                  {view === 'form' ? 'New Request' : view === 'list' ? 'Requests' : 'Analytics'}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-[10px] md:text-xs">
          &copy; {new Date().getFullYear()} Atmosphere Core. Private and Confidential.
        </div>
      </footer>
    </div>
  );
};

export default Layout;


import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { WebsiteChangeRequest } from '../types';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<WebsiteChangeRequest[]>([]);
  const [pageViews, setPageViews] = useState<Record<string, number>>({});

  useEffect(() => {
    storageService.getRequests().then(setData).catch(console.error);
    storageService.getPageViews().then(setPageViews).catch(console.error);
  }, []);

  const priorityCounts = {
    High: data.filter(r => r.priority === 'High').length,
    Medium: data.filter(r => r.priority === 'Medium').length,
    Low: data.filter(r => r.priority === 'Low').length
  };

  const deptCounts: Record<string, number> = {};
  data.forEach(r => {
    deptCounts[r.department] = (deptCounts[r.department] || 0) + 1;
  });

  const sortedDeptData = Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1]);

  const maxDeptCount = Math.max(...Object.values(deptCounts), 1);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </div>
        <p className="text-slate-500 font-bold">No analytics data available yet.</p>
        <p className="text-slate-400 text-xs mt-1">Submit a request to see the visualization breakdown.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', val: data.length, col: 'text-slate-800' },
          { label: 'High Priority', val: priorityCounts.High, col: 'text-red-600' },
          { label: 'Avg Files', val: (data.reduce((acc, curr) => acc + curr.files.length, 0) / data.length).toFixed(1), col: 'text-teal-600' },
          { label: 'Departments', val: Object.keys(deptCounts).length, col: 'text-indigo-600' }
        ].map((card, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-teal-200 hover:shadow-md">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{card.label}</p>
            <p className={`text-3xl font-black mt-2 ${card.col}`}>{card.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Tracker (Library-free Bar Chart) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
            Requests by Department
          </h3>
          <div className="space-y-4">
            {sortedDeptData.map(([dept, count]) => (
              <div key={dept} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-slate-600 uppercase tracking-tight">{dept}</span>
                  <span className="text-teal-600">{count} requests</span>
                </div>
                <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(count / maxDeptCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigator Tracking Stats */}
        <div className="bg-slate-900 p-6 rounded-2xl shadow-sm text-white">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-400 rounded-full"></span>
            View Tracker
          </h3>
          <div className="space-y-6">
            {Object.entries(pageViews).map(([view, count]) => (
              <div key={view} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mb-1">{view}</p>
                  <p className="text-xs text-slate-300 font-medium">Page loads</p>
                </div>
                <div className="text-2xl font-black">{count}</div>
              </div>
            ))}
            {Object.keys(pageViews).length === 0 && (
              <p className="text-xs text-slate-500 italic text-center py-4">No tracking data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-amber-500 rounded-full"></span>
          Priority Distribution
        </h3>
        <div className="flex flex-wrap gap-4">
          {[
            { label: 'High', count: priorityCounts.High, color: 'bg-red-500' },
            { label: 'Medium', count: priorityCounts.Medium, color: 'bg-amber-500' },
            { label: 'Low', count: priorityCounts.Low, color: 'bg-blue-500' }
          ].map((p) => (
            <div key={p.label} className="flex-1 min-w-[120px] p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${p.color}`}></div>
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">{p.label}</span>
              </div>
              <div className="text-2xl font-black text-slate-800">{p.count}</div>
              <div className="text-[10px] text-slate-500 font-bold mt-1">
                {((p.count / data.length) * 100).toFixed(0)}% of total
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


import React, { useState, useEffect } from 'react';
import { WebsiteChangeRequest } from '../types';
import { storageService } from '../services/storageService';

const SubmissionList: React.FC = () => {
  const [requests, setRequests] = useState<WebsiteChangeRequest[]>([]);
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<WebsiteChangeRequest | null>(null);

  useEffect(() => {
    storageService.getRequests().then(setRequests).catch(console.error);
  }, []);

  const filtered = requests.filter(r => 
    r.requestorName.toLowerCase().includes(search.toLowerCase()) ||
    r.pageName.toLowerCase().includes(search.toLowerCase()) ||
    r.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    storageService.exportToCSV(requests);
  };

  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      High: 'bg-red-100 text-red-700 border-red-200',
      Medium: 'bg-amber-100 text-amber-700 border-amber-200',
      Low: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold border ${colors[priority as keyof typeof colors]}`}>
        {priority}
      </span>
    );
  };

  const TabTypeBadge = ({ tabType }: { tabType: string }) => {
    const colors = {
      RAS: 'bg-teal-100 text-teal-700 border-teal-200',
      COB: 'bg-purple-100 text-purple-700 border-purple-200',
      AHR: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold border ${colors[tabType as keyof typeof colors]}`}>
        {tabType}
      </span>
    );
  };

  const RequestCard: React.FC<{ req: WebsiteChangeRequest }> = ({ req }) => (
    <div 
      onClick={() => setSelectedRequest(req)}
      className={`p-4 bg-white border rounded-xl mb-3 shadow-sm transition-all active:scale-95 ${selectedRequest?.id === req.id ? 'border-teal-500 ring-1 ring-teal-500' : 'border-slate-200'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-slate-800 text-sm">{req.requestorName}</div>
          <TabTypeBadge tabType={req.tabType} />
        </div>
        <PriorityBadge priority={req.priority} />
      </div>
      <div className="text-xs text-slate-600 font-medium mb-1">{req.pageName}</div>
      <div className="flex justify-between items-end mt-4">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{req.department}</span>
        <span className="text-[10px] font-bold text-teal-600">{req.desiredGoLiveDate}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header controls */}
      <div className="flex flex-col gap-4 bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg md:text-2xl font-bold text-slate-800">Website Requests</h2>
            <p className="text-slate-500 text-xs md:text-sm">{requests.length} total</p>
          </div>
          <button
            onClick={handleExport}
            className="bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 active:scale-95 md:px-5 md:py-2.5 md:text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden md:inline">Export CSV</span>
            <span className="md:hidden">CSV</span>
          </button>
        </div>
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search name, page..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main List Column */}
        <div className={`lg:col-span-2 ${selectedRequest ? 'hidden md:block' : 'block'}`}>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Requestor</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Page Target</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((req) => (
                    <tr 
                      key={req.id} 
                      className={`hover:bg-slate-50 transition-colors cursor-pointer group ${selectedRequest?.id === req.id ? 'bg-teal-50' : ''}`}
                      onClick={() => setSelectedRequest(req)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800 text-sm">{req.requestorName}</div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{req.department}</div>
                      </td>
                      <td className="px-6 py-4"><TabTypeBadge tabType={req.tabType} /></td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-700 font-bold">{req.pageName}</div>
                        <div className="text-[10px] text-teal-600 truncate max-w-[120px]">{req.url}</div>
                      </td>
                      <td className="px-6 py-4"><PriorityBadge priority={req.priority} /></td>
                      <td className="px-6 py-4 text-[10px] font-black text-slate-600">{req.desiredGoLiveDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Mobile Card List */}
          <div className="md:hidden">
            {filtered.map(req => <RequestCard key={req.id} req={req} />)}
            {filtered.length === 0 && <p className="text-center py-10 text-slate-400 italic text-sm">No requests found.</p>}
          </div>
        </div>

        {/* Detail View Column */}
        <div className={`${selectedRequest ? 'block' : 'hidden md:block'} bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 overflow-y-auto max-h-[80vh] md:max-h-[700px]`}>
          {selectedRequest ? (
            <div className="space-y-6">
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex flex-col">
                  <button 
                    onClick={() => setSelectedRequest(null)}
                    className="md:hidden text-teal-600 text-xs font-bold mb-2 flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back to List
                  </button>
                  <h3 className="text-lg md:text-xl font-bold text-slate-800">Request Detail</h3>
                  <p className="text-xs text-teal-600 font-bold">{selectedRequest.id.split('-')[0].toUpperCase()}</p>
                </div>
                <PriorityBadge priority={selectedRequest.priority} />
              </div>

              <div className="space-y-4">
                <section>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</label>
                  <div className="mt-1">
                    <TabTypeBadge tabType={selectedRequest.tabType} />
                  </div>
                </section>

                <section>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                  <div className="mt-1 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                    "{selectedRequest.changeDescription}"
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-4">
                  <section>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Page</label>
                    <p className="mt-0.5 text-xs font-bold text-slate-800">{selectedRequest.pageName}</p>
                  </section>
                  <section>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Go-Live</label>
                    <p className="mt-0.5 text-xs font-bold text-slate-800">{selectedRequest.desiredGoLiveDate}</p>
                  </section>
                </div>

                <section>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">URL</label>
                  <p className="mt-0.5 text-[10px] text-teal-600 break-all">{selectedRequest.url}</p>
                </section>

                {/* AHR/COB Specific Fields */}
                {(selectedRequest.tabType === 'AHR' || selectedRequest.tabType === 'COB') && (
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    {selectedRequest.resortName && (
                      <section>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resort</label>
                        <p className="mt-0.5 text-xs font-bold text-slate-800">{selectedRequest.resortName}</p>
                      </section>
                    )}
                    {selectedRequest.resortOpsContact && (
                      <section>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Resort Contact</label>
                        <p className="mt-0.5 text-xs font-bold text-slate-800">{selectedRequest.resortOpsContact}</p>
                      </section>
                    )}
                  </div>
                )}

                {/* Checklist Data for AHR/COB */}
                {selectedRequest.checklistData && Object.keys(selectedRequest.checklistData).length > 0 && (
                  <section className="pt-2 border-t border-slate-100">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Audit Checklist Results</label>
                    <div className="bg-slate-50 rounded-xl border border-slate-100 p-3 max-h-48 overflow-y-auto">
                      <div className="space-y-2 text-[10px]">
                        {Object.entries(selectedRequest.checklistData).map(([key, value]) => (
                          <div key={key} className="flex justify-between gap-2">
                            <span className="text-slate-600 flex-1">{key}</span>
                            <span className={`font-bold ${
                              value === 'Yes' ? 'text-green-600' : 
                              value === 'No' ? 'text-red-600' : 
                              'text-amber-600'
                            }`}>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                <section>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Files ({selectedRequest.files.length})</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedRequest.files.map((file, idx) => (
                      <a 
                        key={idx} 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-white hover:bg-slate-50 border border-slate-200 text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                        <span className="truncate max-w-[60px]">{file.name}</span>
                      </a>
                    ))}
                  </div>
                </section>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs">
                    {selectedRequest.requestorName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-800 leading-none">{selectedRequest.requestorName}</p>
                    <p className="text-[9px] text-slate-400 uppercase">{selectedRequest.department}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 py-10">
              <p className="text-sm font-bold">Select a request</p>
              <p className="text-[10px]">to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionList;

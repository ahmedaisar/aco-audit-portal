
import React, { useState } from 'react';
import { WebsiteChangeRequest, TabType, Priority } from '../types';
import { storageService } from '../services/storageService';

interface COBFormProps {
  onSuccess: () => void;
}

const CHECKLIST_SECTIONS = [
  {
    id: 'homepage',
    title: '1. HOMEPAGE',
    checkpoints: [
      'Homepage banner reflects current campaigns/OBLU brand vibrancy?',
      'Featured offers and all-inclusive plan highlights visible?',
      'All CTAs (Book Now, Check Availability) active?',
      'Mobile/tablet responsiveness working properly?',
      'COLOURS OF OBLU brand consistency maintained?'
    ]
  },
  {
    id: 'villas',
    title: '2. VILLAS',
    checkpoints: [
      'All villa categories present and named correctly?',
      'Villa images match current configurations (min 4 images per villa)?',
      'Room sizes, amenities, and occupancy details accurate?',
      'All villa booking CTAs functional?',
      'Special features (pools, overwater, etc.) highlighted?',
      'Villa descriptions reflect current setup and renovations?'
    ]
  },
  {
    id: 'dining',
    title: '3. DINING',
    checkpoints: [
      'All operational dining venues listed (no closed restaurants)?',
      'Restaurant operating hours accurate?',
      'Menus downloadable and current?',
      'Cuisine types and service styles correctly described?',
      'Restaurant images show current setup and dishes?',
      'Bar/lounge information and hours updated?'
    ]
  },
  {
    id: 'technical',
    title: '10. TECHNICAL & BOOKING',
    checkpoints: [
      'Navigation menus functional across all devices?',
      'Booking engine loading without errors?',
      'All internal/external links working (no 404s)?',
      'Contact information and resort facts accurate?',
      'Transfer information current and correct?',
      'Page load speed acceptable (<3 seconds)?',
      'Social media links active?'
    ]
  }
];

const COBForm: React.FC<COBFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    resort: '',
    url: '',
    auditDate: new Date().toISOString().split('T')[0],
    auditor: '',
    resortOpsContact: '',
    deadline: ''
  });

  const handleOptionChange = (checkpoint: string, value: string) => {
    setChecklist(prev => ({ ...prev, [checkpoint]: value }));
  };

  const handleNoteChange = (checkpoint: string, value: string) => {
    setNotes(prev => ({ ...prev, [checkpoint]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const request: WebsiteChangeRequest = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        tabType: TabType.COB,
        requestorName: formData.auditor,
        department: 'Digital Audit',
        emailId: 'digital@atmospherecore.com',
        todayDate: formData.auditDate,
        priority: 'Medium',
        url: formData.url,
        pageName: `COB Audit - ${formData.resort}`,
        changeDescription: `Website Audit Checklist Submission for ${formData.resort}`,
        files: [],
        desiredGoLiveDate: formData.deadline,
        resortName: formData.resort,
        resortOpsContact: formData.resortOpsContact,
        checklistData: checklist,
        notesData: notes
      };

      await storageService.saveRequest(request, []);
      alert("COB Audit Checklist submitted successfully!");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to submit audit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Auditor Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resort</label>
            <input
              required
              type="text"
              placeholder="e.g. OBLU SELECT Sangeli"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.resort}
              onChange={e => setFormData({ ...formData, resort: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website URL</label>
            <input
              required
              type="text"
              placeholder="https://..."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Audit Date</label>
            <input
              required
              type="date"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.auditDate}
              onChange={e => setFormData({ ...formData, auditDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Auditor</label>
            <input
              required
              type="text"
              placeholder="Auditor Name"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.auditor}
              onChange={e => setFormData({ ...formData, auditor: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resort Operations Contact</label>
            <input
              required
              type="text"
              placeholder="Contact Person"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.resortOpsContact}
              onChange={e => setFormData({ ...formData, resortOpsContact: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
            <input
              required
              type="date"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
        </div>
      </div>

      {CHECKLIST_SECTIONS.map(section => (
        <div key={section.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-4 font-bold text-sm tracking-widest uppercase">
            {section.title}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs md:text-sm border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-1/3">Checkpoint</th>
                  <th className="px-4 py-4 text-center w-12">Yes</th>
                  <th className="px-4 py-4 text-center w-12">No</th>
                  <th className="px-4 py-4 text-center w-24">Minor Issue</th>
                  <th className="px-6 py-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {section.checkpoints.map((cp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-700 font-medium leading-tight">{cp}</td>
                    {['Yes', 'No', 'Minor Issue'].map(opt => (
                      <td key={opt} className="px-4 py-4 text-center">
                        <input
                          required
                          type="radio"
                          name={`${section.id}-${idx}`}
                          className="w-4 h-4 text-teal-600 focus:ring-teal-500 cursor-pointer"
                          onChange={() => handleOptionChange(cp, opt)}
                        />
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        placeholder="Add remarks..."
                        className="w-full bg-transparent border-b border-transparent focus:border-teal-400 outline-none text-xs transition-all italic"
                        value={notes[cp] || ''}
                        onChange={(e) => handleNoteChange(cp, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-slate-900 hover:bg-black text-white font-bold py-5 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Audit...
          </>
        ) : 'Submit COB Audit Report'}
      </button>
    </form>
  );
};

export default COBForm;

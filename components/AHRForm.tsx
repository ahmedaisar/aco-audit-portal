
import React, { useState } from 'react';
import { WebsiteChangeRequest, TabType, Priority } from '../types';
import { storageService } from '../services/storageService';

interface AHRFormProps {
  onSuccess: () => void;
}

const AHR_CHECKLIST_SECTIONS = [
  {
    id: 'homepage',
    title: '1. HOMEPAGE',
    checkpoints: [
      'Homepage banner reflects current campaigns/seasonality?',
      'Featured offers visible and linked correctly?',
      'All CTAs active with no broken links?',
      'Homepage renders properly on mobile/tablet?'
    ]
  },
  {
    id: 'villas',
    title: '2. VILLAS / ACCOMMODATION',
    checkpoints: [
      'All room categories present and named correctly?',
      'Villa images match actual configurations (min 4 images per villa)?',
      'Amenities, max occupancy, and bed setups accurate?',
      'All villa booking CTAs working?',
      'Special features (pool, overwater) highlighted?'
    ]
  },
  {
    id: 'dining',
    title: '3. DINING',
    checkpoints: [
      'All operational outlets listed (no closed venues)?',
      'Restaurant timings reflect actual service hours?',
      'Menus downloadable and up to date?',
      'Restaurant images show current setup and dishes?'
    ]
  },
  {
    id: 'wellness',
    title: '4. WELLNESS / SPA',
    checkpoints: [
      'Treatment menus and packages current?',
      'Spa hours and booking process accurate?',
      'Spa images reflect current interiors?'
    ]
  },
  {
    id: 'experiences',
    title: '5. EXPERIENCES & ACTIVITIES',
    checkpoints: [
      'All listed activities operational with correct timings?',
      'Discontinued experiences removed?',
      'Special experiences (private dining, weddings) listed correctly?'
    ]
  },
  {
    id: 'offers',
    title: '6. SPECIAL OFFERS / PROMOTIONS',
    checkpoints: [
      'Active offers live with valid dates and T&Cs?',
      'Expired offers archived/removed?',
      'Direct booking benefits clearly highlighted?'
    ]
  },
  {
    id: 'contact',
    title: '7. RESORT FACTS & CONTACT INFO',
    checkpoints: [
      'Phone, email latest and functional?',
      'Hotel info packs updated? (Brochure, hotel plan, etc)',
      'Send test contact message & confirm if receiving?'
    ]
  },
  {
    id: 'gallery',
    title: '8. GALLERY / MEDIA',
    checkpoints: [
      'Images fresh, high-resolution, and representative?',
      'No duplicate or outdated images?',
      'Videos playing correctly (if any)?'
    ]
  },
  {
    id: 'booking',
    title: '9. BOOKING ENGINE',
    checkpoints: [
      'Booking engine loading without errors?',
      'Rates syncing with live availability?',
      'User flow seamless from site to booking engine?'
    ]
  },
  {
    id: 'technical',
    title: '10. TECHNICAL & UX',
    checkpoints: [
      'Navigation menus functional across all devices?',
      'All internal/external links working (no 404s)?',
      'Social media links active?',
      'Homepage load speed acceptable (<5-7 seconds)?'
    ]
  }
];

const AHRForm: React.FC<AHRFormProps> = ({ onSuccess }) => {
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
        tabType: TabType.AHR,
        requestorName: formData.auditor,
        department: 'AHR Quality Assurance',
        emailId: 'audit@atmospherehotelsandresorts.com',
        todayDate: formData.auditDate,
        priority: 'Medium',
        url: formData.url,
        pageName: `AHR Audit - ${formData.resort}`,
        changeDescription: `AHR Digital Audit Report for ${formData.resort}`,
        files: [],
        desiredGoLiveDate: formData.deadline,
        resortName: formData.resort,
        resortOpsContact: formData.resortOpsContact,
        checklistData: checklist,
        notesData: notes
      };

      await storageService.saveRequest(request, []);
      alert("AHR Audit Checklist submitted successfully!");
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
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Auditor Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resort</label>
            <input
              required
              type="text"
              placeholder="e.g. OBLU SELECT Lobigili"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={formData.resort}
              onChange={e => setFormData({ ...formData, resort: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Website URL</label>
            <input
              required
              type="url"
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={formData.url}
              onChange={e => setFormData({ ...formData, url: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Audit Date</label>
            <input
              required
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={formData.auditDate}
              onChange={e => setFormData({ ...formData, auditDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Auditor Name</label>
            <input
              required
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={formData.auditor}
              onChange={e => setFormData({ ...formData, auditor: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Resort Operations Contact</label>
            <input
              required
              type="text"
              placeholder="Name of Contact"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={formData.resortOpsContact}
              onChange={e => setFormData({ ...formData, resortOpsContact: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
            <input
              required
              type="date"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
        </div>
      </div>

      {AHR_CHECKLIST_SECTIONS.map(section => (
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
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-5 rounded-2xl shadow-xl shadow-teal-500/10 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Audit...
          </>
        ) : 'Finalize & Submit AHR Audit Report'}
      </button>
    </form>
  );
};

export default AHRForm;

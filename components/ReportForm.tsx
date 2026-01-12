
import React, { useState, useRef } from 'react';
import { WebsiteChangeRequest, Priority, FileMetadata, TabType } from '../types';
import { storageService } from '../services/storageService';

interface ReportFormProps {
  onSuccess: () => void;
}

const DEPARTMENTS = ['Sales', 'Marketing', 'FnB', 'HR', 'Spa', 'IT', 'Commercial', 'Corporate', 'Other'];

const ReportForm: React.FC<ReportFormProps> = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [formData, setFormData] = useState<Partial<WebsiteChangeRequest>>({
    priority: 'Medium',
    department: 'Marketing',
    todayDate: new Date().toISOString().split('T')[0],
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      alert("Maximum 5 files allowed.");
      return;
    }

    const newFiles: FileMetadata[] = await Promise.all(
      selectedFiles.map(file => {
        return new Promise<FileMetadata>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              base64: reader.result as string
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const request: WebsiteChangeRequest = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        tabType: TabType.RAS,
        requestorName: formData.requestorName || '',
        department: formData.department || '',
        emailId: formData.emailId || '',
        todayDate: formData.todayDate || '',
        priority: formData.priority as Priority,
        url: formData.url || '',
        pageName: formData.pageName || '',
        changeDescription: formData.changeDescription || '',
        files: files,
        desiredGoLiveDate: formData.desiredGoLiveDate || '',
      };

      await storageService.saveRequest(request, rawFiles);
      alert("Website change request submitted successfully!");
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
      <div className="bg-teal-700 px-6 py-8 md:px-8 md:py-10 text-white relative">
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Website Change Request (RAS)</h2>
          <p className="text-teal-100 mt-1 md:mt-2 text-base md:text-lg">Atmosphere Core Digital Operations</p>
          <div className="mt-4 flex items-start md:items-center gap-2 text-xs text-teal-200">
            <svg className="w-4 h-4 mt-0.5 md:mt-0 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>When you submit this form, the owner will see your name and email address.</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8 md:space-y-10">
        <div className="space-y-5 md:space-y-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            Requestor Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">1. Requestor Name *</label>
              <input
                required
                type="text"
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm"
                value={formData.requestorName || ''}
                onChange={(e) => setFormData({ ...formData, requestorName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">2. Department *</label>
              <select
                required
                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all bg-white text-sm"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">3. Email ID *</label>
              <input
                required
                type="email"
                placeholder="email@atmospherehotelsandresorts.com"
                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm"
                value={formData.emailId || ''}
                onChange={(e) => setFormData({ ...formData, emailId: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">4. Today's date *</label>
              <input
                required
                type="date"
                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm"
                value={formData.todayDate || ''}
                onChange={(e) => setFormData({ ...formData, todayDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-3 md:mb-4">5. Priority *</label>
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
                <label key={p} className="cursor-pointer group">
                  <input
                    type="radio"
                    name="priority"
                    className="sr-only"
                    checked={formData.priority === p}
                    onChange={() => setFormData({ ...formData, priority: p })}
                  />
                  <div className={`text-center py-2.5 md:py-3 rounded-xl border-2 transition-all font-bold text-xs md:text-sm ${
                    formData.priority === p 
                      ? 'border-teal-600 bg-teal-50 text-teal-700' 
                      : 'border-slate-100 text-slate-400 group-hover:border-slate-200'
                  }`}>
                    {p}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            Page/Section to be Uploaded
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">6. URL of the Page/Section *</label>
              <input
                required
                type="text"
                placeholder="https://..."
                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm"
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">7. Page Name *</label>
              <input
                required
                type="text"
                placeholder="e.g. Home Page"
                className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm"
                value={formData.pageName || ''}
                onChange={(e) => setFormData({ ...formData, pageName: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-5 md:space-y-6">
          <h3 className="text-lg md:text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
            Details
          </h3>
          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">8. Describe the change in detail *</label>
            <textarea
              required
              rows={4}
              placeholder="What needs to be changed?"
              className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all resize-none text-sm"
              value={formData.changeDescription || ''}
              onChange={(e) => setFormData({ ...formData, changeDescription: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">9. Upload Files if any</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-6 md:p-8 text-center cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all group"
            >
              <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <p className="text-slate-600 font-bold text-sm">Click to upload or drag and drop</p>
            </div>
          </div>
          <div>
            <label className="block text-xs md:text-sm font-bold text-slate-700 mb-1.5 md:mb-2">10. Desired Go-Live Date *</label>
            <input
              required
              type="date"
              className="w-full px-4 py-2.5 md:py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all text-sm"
              value={formData.desiredGoLiveDate || ''}
              onChange={(e) => setFormData({ ...formData, desiredGoLiveDate: e.target.value })}
            />
          </div>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white font-bold py-3.5 md:py-4 px-8 rounded-2xl shadow-xl shadow-teal-500/20 transition-all transform active:scale-[0.98]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;

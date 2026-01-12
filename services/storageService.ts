
import { WebsiteChangeRequest, FileMetadata } from '../types';
import { upload } from '@vercel/blob/client';

export const storageService = {
  saveRequest: async (request: WebsiteChangeRequest, rawFiles: File[]): Promise<void> => {
    // 1. Upload files to Vercel Blob
    const uploadedFiles = await Promise.all(
      rawFiles.map(async (file) => {
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          url: blob.url,
        };
      })
    );

    // 2. Save metadata to Database
    const response = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request,
        files: uploadedFiles,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save request');
    }
  },

  getRequests: async (): Promise<WebsiteChangeRequest[]> => {
    const response = await fetch('/api/requests');
    if (!response.ok) throw new Error('Failed to fetch requests');
    return response.json();
  },

  incrementPageView: async (view: string): Promise<void> => {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageName: view }),
    });
  },

  getPageViews: async (): Promise<Record<string, number>> => {
    const response = await fetch('/api/analytics');
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  },

  clearRequests: async (): Promise<void> => {
    await fetch('/api/requests', { method: 'DELETE' });
  },

  exportToCSV: (requests: WebsiteChangeRequest[]): void => {
    if (requests.length === 0) return;
    
    const headers = [
      'ID', 'Submission Date', 'Type', 'Requestor Name', 'Department', 'Email', 'Priority',
      'Target URL', 'Page Name', 'Description', 'Files Count', 'Desired Go-Live',
      'Resort Name', 'Resort Contact'
    ];
    
    const rows = requests.map(r => [
      r.id,
      new Date(r.timestamp).toLocaleString(),
      r.tabType,
      `"${r.requestorName}"`,
      `"${r.department}"`,
      `"${r.emailId}"`,
      r.priority,
      `"${r.url}"`,
      `"${r.pageName}"`,
      `"${r.changeDescription.replace(/"/g, '""')}"`,
      r.files.length,
      `"${r.desiredGoLiveDate}"`,
      r.resortName ? `"${r.resortName}"` : '',
      r.resortOpsContact ? `"${r.resortOpsContact}"` : ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `atmosphere_requests_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};


export type Priority = 'High' | 'Medium' | 'Low';

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  base64?: string;
  url?: string;
}

export interface WebsiteChangeRequest {
  id: string;
  timestamp: string | number;
  
  // Requestor Details
  requestorName: string;
  department: string;
  emailId: string;
  todayDate: string;
  priority: Priority;
  
  // Page/Section to be Uploaded
  url: string;
  pageName: string;
  
  // Details
  changeDescription: string;
  files: FileMetadata[];
  desiredGoLiveDate: string;
}

export enum AppView {
  FORM = 'form',
  LIST = 'list',
  DASHBOARD = 'dashboard'
}


export type Priority = 'High' | 'Medium' | 'Low';

export enum TabType {
  RAS = 'RAS',
  COB = 'COB',
  AHR = 'AHR'
}

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  base64?: string;
  url?: string;
}

export interface WebsiteChangeRequest {
  id: string;
  timestamp: number;
  tabType: TabType;
  
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

  // Audit Specific Fields (COB/AHR)
  resortName?: string;
  resortOpsContact?: string;
  
  // Checklist Data
  checklistData?: Record<string, string>;
  notesData?: Record<string, string>;
}

export enum AppView {
  FORM = 'form',
  LIST = 'list',
  DASHBOARD = 'dashboard'
}

export interface Project {
  id: string;
  code: string;
  name: string;
  client: string;
  siteId: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Planning' | 'Completed' | 'Archived';
  description?: string;
  createdAt: string;
}

export interface WBSLayer {
  id: string;
  projectId: string;
  name: string; // Earthwork, Subgrade, Base Course, etc.
}

export interface WBSChainage {
  id: string;
  layerId: string;
  projectId: string;
  range: string; // 0-1KM, 1-2KM, etc.
}

export interface WBSComponent {
  id: string;
  chainageId: string;
  layerId: string;
  projectId: string;
  code: string; // CMP-001
  name: string; // Drain, Culvert, Shoulder
  unit: string; // Mtr, Nos, etc.
}

export interface BOQItem {
  id: string;
  sNo: number;
  description: string;
  unit: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface BOQ {
  id: string;
  projectId: string;
  boqNo: string; // BOQ/PRJ-001/01
  date: string;
  status: 'Draft' | 'Approved' | 'Revised';
  items: BOQItem[];
  totalAmount: number;
  version: number;
}

export interface ResourcePlanItem {
  id: string;
  name: string;
  qty: string;
  unit?: string;
}

export interface ActivityPlan {
  id: string;
  projectId: string;
  activityName: string; // e.g. Road Base Work, Drain Construction
  startDate: string;
  endDate: string;
  plannedQty: number;
  unit: string; // e.g. Mtr
  workers: number;
  equipment: string;
  materials: ResourcePlanItem[];
  labours: ResourcePlanItem[];
  machineries: ResourcePlanItem[];
}

export interface ExecutionTypeConfig {
  id: string;
  projectId: string;
  activityId: string;
  type: 'Self' | 'Contractor';
  contractorName?: string;
  contractStartDate?: string;
  contractEndDate?: string;
}

export interface WorkOrder {
  id: string;
  projectId: string;
  woNo: string; // WO/PRJ-001/01
  contractorName: string;
  activityName: string;
  amount: number;
  startDate: string;
  endDate: string;
  scope: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

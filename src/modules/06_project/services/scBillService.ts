import { SCBill } from '../types';

const defaultBills: SCBill[] = [
  {
    id: 'scb-1',
    projectId: 'prj-001',
    billNo: 'SCB/PRJ-001/01',
    contractorName: 'ABC Constructions',
    date: '2026-06-15',
    status: 'Submitted',
    items: [
      {
        id: 'sbi-1',
        activityName: 'Drain Construction (0-1 KM)',
        completedQty: 900,
        rate: 500,
        amount: 450000,
        unit: 'Mtr'
      }
    ],
    totalAmount: 450000,
    remarks: 'Drain excavation and siding work fully certified as per section guidelines.',
    createdAt: '2026-06-15T09:00:00Z'
  },
  {
    id: 'scb-2',
    projectId: 'prj-001',
    billNo: 'SCB/PRJ-001/02',
    contractorName: 'Royal Infrastructure Ltd',
    date: '2026-05-18',
    status: 'Approved',
    items: [
      {
        id: 'sbi-2',
        activityName: 'Kerb Stone Shoulders Laying',
        completedQty: 1200,
        rate: 250,
        amount: 300000,
        unit: 'Mtr'
      },
      {
        id: 'sbi-3',
        activityName: 'Aggregate Pre-coating',
        completedQty: 400,
        rate: 350,
        amount: 140000,
        unit: 'Ton'
      }
    ],
    totalAmount: 440000,
    remarks: 'Approved by executive engineer for billing phase A.',
    createdAt: '2026-05-18T14:30:00Z'
  },
  {
    id: 'scb-3',
    projectId: 'prj-002',
    billNo: 'SCB/PRJ-002/01',
    contractorName: 'Oceanic Dredging Corp',
    date: '2026-05-20',
    status: 'Rejected',
    items: [
      {
        id: 'sbi-4',
        activityName: 'Marine Reclamation Phase 1',
        completedQty: 2000,
        rate: 150,
        amount: 300000,
        unit: 'Cum'
      }
    ],
    totalAmount: 300000,
    remarks: 'Discrepancy in recorded silt parameters vs actual cubic measurement logs.',
    createdAt: '2026-05-20T11:15:00Z'
  }
];

const load = <T>(key: string, backup: T): T => {
  const item = localStorage.getItem(key);
  if (!item) return backup;
  try {
    const parsed = JSON.parse(item);
    return parsed as T;
  } catch {
    return backup;
  }
};

const save = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const scBillService = {
  getBills: (projectId?: string): SCBill[] => {
    const list = load<SCBill[]>('erp_sc_bills', defaultBills);
    if (projectId) {
      return list.filter(b => b.projectId === projectId);
    }
    return list;
  },

  getBill: (id: string): SCBill | undefined => {
    return scBillService.getBills().find(b => b.id === id);
  },

  createBill: (bill: Omit<SCBill, 'id' | 'billNo' | 'status' | 'createdAt'>): SCBill => {
    const list = scBillService.getBills();
    const billNo = `SCB/PRJ-${String(list.length + 1).padStart(3, '0')}/0${list.length + 1}`;
    
    // Auto-calculate item amounts & totalAmount
    const processedItems = bill.items.map(item => ({
      ...item,
      amount: item.completedQty * item.rate
    }));

    const totalAmount = processedItems.reduce((sum, item) => sum + item.amount, 0);

    const newBill: SCBill = {
      ...bill,
      id: `scb-${Date.now()}`,
      billNo,
      status: 'Submitted',
      items: processedItems,
      totalAmount,
      createdAt: new Date().toISOString()
    };

    list.push(newBill);
    save('erp_sc_bills', list);
    return newBill;
  },

  updateBill: (updatedBill: SCBill): void => {
    const list = scBillService.getBills();
    const idx = list.findIndex(b => b.id === updatedBill.id);
    if (idx !== -1) {
      // Re-calculate quantities and totals
      const processedItems = updatedBill.items.map(item => ({
        ...item,
        amount: item.completedQty * item.rate
      }));
      const totalAmount = processedItems.reduce((sum, item) => sum + item.amount, 0);

      list[idx] = {
        ...updatedBill,
        items: processedItems,
        totalAmount
      };
      save('erp_sc_bills', list);
    }
  },

  approveBill: (id: string, status: 'Approved' | 'Rejected', remarks?: string): void => {
    const list = scBillService.getBills();
    const idx = list.findIndex(b => b.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (remarks) {
        list[idx].remarks = remarks;
      }
      save('erp_sc_bills', list);
    }
  },

  deleteBill: (id: string): void => {
    const list = scBillService.getBills();
    const filtered = list.filter(b => b.id !== id);
    save('erp_sc_bills', filtered);
  }
};

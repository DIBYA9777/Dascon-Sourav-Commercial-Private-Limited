import { RABill } from '../types';

const defaultRABills: RABill[] = [
  {
    id: 'rab-1',
    projectId: 'prj-001',
    billNo: 'RA/PRJ-001/03',
    clientName: 'PWD - Govt of West Bengal',
    date: '2026-06-20',
    status: 'Approved',
    items: [
      {
        id: 'rbi-1',
        description: 'Civil Work Completed (Slab & Paving Section A)',
        amount: 1800000
      },
      {
        id: 'rbi-2',
        description: 'Material Supply (Reinforcements & Subgrade aggregates)',
        amount: 150000
      }
    ],
    subtotal: 1950000,
    gstRate: 18,
    gstAmount: 351000,
    grandTotal: 2301000,
    remarks: 'Measurements verified by the Superintending Engineer. Clean site clearance certificate attached.',
    createdAt: '2026-06-20T10:00:00Z'
  },
  {
    id: 'rab-2',
    projectId: 'prj-001',
    billNo: 'RA/PRJ-001/04',
    clientName: 'PWD - Govt of West Bengal',
    date: '2026-05-22',
    status: 'Submitted',
    items: [
      {
        id: 'rbi-3',
        description: 'Drainage Culvert Masonry Work',
        amount: 1200000
      },
      {
        id: 'rbi-4',
        description: 'Structural Steel Supply for Overpass Pedestrian Walk',
        amount: 450000
      }
    ],
    subtotal: 1650000,
    gstRate: 18,
    gstAmount: 297000,
    grandTotal: 1947000,
    remarks: 'Awaiting site inspection certificate from local sub-divisional officer.',
    createdAt: '2026-05-22T08:30:00Z'
  },
  {
    id: 'rab-3',
    projectId: 'prj-002',
    billNo: 'RA/PRJ-002/01',
    clientName: 'National Highways Authority of India (NHAI)',
    date: '2026-05-15',
    status: 'Draft',
    items: [
      {
        id: 'rbi-5',
        description: 'Preliminary Earthwork excavation',
        amount: 800000
      }
    ],
    subtotal: 800000,
    gstRate: 18,
    gstAmount: 144000,
    grandTotal: 944000,
    remarks: 'Internal draft. Values to be synched with execution type summaries before submitting to NHAI officer.',
    createdAt: '2026-05-15T15:20:00Z'
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

export const raBillService = {
  getBills: (projectId?: string): RABill[] => {
    const list = load<RABill[]>('erp_ra_bills', defaultRABills);
    if (projectId) {
      return list.filter(b => b.projectId === projectId);
    }
    return list;
  },

  getBill: (id: string): RABill | undefined => {
    return raBillService.getBills().find(b => b.id === id);
  },

  createBill: (bill: Omit<RABill, 'id' | 'billNo' | 'status' | 'createdAt'>): RABill => {
    const list = raBillService.getBills();
    const count = list.filter(b => b.projectId === bill.projectId).length + 1;
    const billNo = `RA/PRJ-${String(list.length + 1).padStart(3, '0')}/0${count}`;

    // Auto-calculate financial numbers
    const subtotal = bill.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const gstRate = Number(bill.gstRate) || 18;
    const gstAmount = Math.round((subtotal * gstRate) / 100);
    const grandTotal = subtotal + gstAmount;

    const newBill: RABill = {
      ...bill,
      id: `rab-${Date.now()}`,
      billNo,
      status: 'Submitted', // Raised implies directly submitted, or default to submitted
      subtotal,
      gstRate,
      gstAmount,
      grandTotal,
      createdAt: new Date().toISOString()
    };

    list.push(newBill);
    save('erp_ra_bills', list);
    return newBill;
  },

  updateBill: (updatedBill: RABill): void => {
    const list = raBillService.getBills();
    const idx = list.findIndex(b => b.id === updatedBill.id);
    if (idx !== -1) {
      const subtotal = updatedBill.items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
      const gstRate = Number(updatedBill.gstRate) || 18;
      const gstAmount = Math.round((subtotal * gstRate) / 100);
      const grandTotal = subtotal + gstAmount;

      list[idx] = {
        ...updatedBill,
        subtotal,
        gstRate,
        gstAmount,
        grandTotal
      };
      save('erp_ra_bills', list);
    }
  },

  approveBill: (id: string, status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected', remarks?: string): void => {
    // In types.ts, status can be 'Draft' | 'Submitted' | 'Approved'.
    // We can map 'Rejected', check: RABill status is 'Draft' | 'Submitted' | 'Approved'. Let's allow Rejected or just keep standard status. If approved or draft. Let's make sure it's valid.
    const list = raBillService.getBills();
    const idx = list.findIndex(b => b.id === id);
    if (idx !== -1) {
      // If status is "Rejected", let's store it as Submitter or Draft, or allow Approved vs Submitted
      // We can map Rejected status gracefully, or we can update RABill status type to include 'Rejected' as well. 
      // Let's modify types.ts in a bit if needed to include 'Rejected', or handle it perfectly.
      // Wait, let's keep it safe. If approved, status is 'Approved'. If rejected, let's set 'Draft' or list status with custom remarks. It is safer to make 'Rejected' a valid status in types.ts too so it is fully colored like SC Bill!
      // Let's check status in RABill: 'Draft' | 'Submitted' | 'Approved'. Let's also support 'Rejected' if needed, or simply map it. Let's modify types.ts to make RABill status: 'Draft' | 'Submitted' | 'Approved' | 'Rejected'
      list[idx].status = status as any;
      if (remarks !== undefined) {
        list[idx].remarks = remarks;
      }
      save('erp_ra_bills', list);
    }
  },

  deleteBill: (id: string): void => {
    const list = raBillService.getBills();
    const filtered = list.filter(b => b.id !== id);
    save('erp_ra_bills', filtered);
  }
};

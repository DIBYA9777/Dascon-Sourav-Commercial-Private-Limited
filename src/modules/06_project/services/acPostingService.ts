import { ACPosting, AccountingEntry } from '../types';

const defaultPostings: ACPosting[] = [
  {
    id: 'acp-1',
    projectId: 'prj-001',
    referenceType: 'RA Bill',
    referenceNo: 'RA/PRJ-001/03',
    date: '2026-06-20',
    status: 'Posted',
    items: [
      {
        id: 'ae-1',
        accountCode: '1201',
        accountName: 'Accounts Receivable (PWD WB Authority)',
        debit: 2301050,
        credit: 0
      },
      {
        id: 'ae-2',
        accountCode: '4001',
        accountName: 'Gross Construction Progress Income',
        debit: 0,
        credit: 1950000
      },
      {
        id: 'ae-3',
        accountCode: '2205',
        accountName: 'GST Output Payable (18%)',
        debit: 0,
        credit: 351050
      }
    ],
    debitTotal: 2301050,
    creditTotal: 2301050,
    remarks: 'Auto-journal generated from approved RA Bill RA/PRJ-001/03. Certified by client engineer.',
    createdAt: '2026-06-19T10:00:00Z',
    postedAt: '2026-06-20T14:30:00Z'
  },
  {
    id: 'acp-2',
    projectId: 'prj-001',
    referenceType: 'Contractor Bill',
    referenceNo: 'SCB/PRJ-001/01',
    date: '2026-05-22',
    status: 'Pending',
    items: [
      {
        id: 'ae-4',
        accountCode: '5201',
        accountName: 'Sub-Contractor Work Expenses (Road Works)',
        debit: 500000,
        credit: 0
      },
      {
        id: 'ae-5',
        accountCode: '2101',
        accountName: 'Accounts Payable (ABC Constructions)',
        debit: 0,
        credit: 500000
      }
    ],
    debitTotal: 500000,
    creditTotal: 500000,
    remarks: 'Pre-posting generated from raised subcontractor invoice of ABC Constructions. Awaiting final SuperAdmin audit approval.',
    createdAt: '2026-05-22T08:45:00Z'
  },
  {
    id: 'acp-3',
    projectId: 'prj-001',
    referenceType: 'RA Bill',
    referenceNo: 'RA/PRJ-001/04',
    date: '2026-05-22',
    status: 'Pending',
    items: [
      {
        id: 'ae-6',
        accountCode: '1201',
        accountName: 'Accounts Receivable (PWD WB Authority)',
        debit: 1947000,
        credit: 0
      },
      {
        id: 'ae-7',
        accountCode: '4001',
        accountName: 'Gross Construction Progress Income',
        debit: 0,
        credit: 1650000
      },
      {
        id: 'ae-8',
        accountCode: '2205',
        accountName: 'GST Output Payable (18%)',
        debit: 0,
        credit: 297000
      }
    ],
    debitTotal: 1947000,
    creditTotal: 1947000,
    remarks: 'Auto-journal generated from Client RA Bill RA/PRJ-001/04 of ₹1,947,000.',
    createdAt: '2026-05-22T09:00:00Z'
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

export const acPostingService = {
  getPostings: (projectId?: string): ACPosting[] => {
    const list = load<ACPosting[]>('erp_ac_postings', defaultPostings);
    
    // Auto-sync checks: when there are approved RA bills or Contractor bills in localstorage,
    // we can dynamically build pending postings if they are not already created.
    // Let's implement an auto-creation hook so the system feels incredibly "alive" and integrated!
    let updated = false;

    // Load actual RA Bills
    const raBillsJson = localStorage.getItem('erp_ra_bills');
    if (raBillsJson) {
      try {
        const raBills = JSON.parse(raBillsJson) as any[];
        raBills.forEach(bill => {
          // Check if posting already exists
          const exists = list.some(p => p.referenceNo === bill.billNo && p.referenceType === 'RA Bill');
          if (!exists) {
            // Build dynamic entries
            const isApproved = bill.status === 'Approved';
            const items: AccountingEntry[] = [
              {
                id: `ae-dyn-${Date.now()}-1`,
                accountCode: '1201',
                accountName: `Accounts Receivable (${bill.clientName || 'Client Org'})`,
                debit: bill.grandTotal || 0,
                credit: 0
              },
              {
                id: `ae-dyn-${Date.now()}-2`,
                accountCode: '4001',
                accountName: 'Gross Construction Progress Income',
                debit: 0,
                credit: bill.subtotal || 0
              }
            ];

            if (bill.gstAmount > 0) {
              items.push({
                id: `ae-dyn-${Date.now()}-3`,
                accountCode: '2205',
                accountName: `GST Output Payable (${bill.gstRate || 18}%)`,
                debit: 0,
                credit: bill.gstAmount
              });
            }

            const newPosting: ACPosting = {
              id: `acp-dyn-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              projectId: bill.projectId,
              referenceType: 'RA Bill',
              referenceNo: bill.billNo,
              date: bill.date,
              status: isApproved ? 'Posted' : 'Pending', // Approved bills auto-post or pre-populate as posted
              items,
              debitTotal: bill.grandTotal,
              creditTotal: bill.grandTotal,
              remarks: `Auto-journal from client invoice ${bill.billNo}. ${bill.remarks || ''}`,
              createdAt: bill.createdAt || new Date().toISOString()
            };

            list.push(newPosting);
            updated = true;
          }
        });
      } catch (e) {
        console.error('Failed auto-syncing RA bills to AC Posting', e);
      }
    }

    // Load actual Subcontractor Bills
    const scBillsJson = localStorage.getItem('erp_sc_bills');
    if (scBillsJson) {
      try {
        const scBills = JSON.parse(scBillsJson) as any[];
        scBills.forEach(bill => {
          const exists = list.some(p => p.referenceNo === bill.billNo && p.referenceType === 'Contractor Bill');
          if (!exists) {
            const isApproved = bill.status === 'Approved';
            const items: AccountingEntry[] = [
              {
                id: `ae-dyn-sc-${Date.now()}-1`,
                accountCode: '5201',
                accountName: `Sub-Contractor Work Expenses (${bill.contractorName || 'Contractor'})`,
                debit: bill.totalAmount || 0,
                credit: 0
              },
              {
                id: `ae-dyn-sc-${Date.now()}-2`,
                accountCode: '2101',
                accountName: `Accounts Payable (${bill.contractorName || 'Contractor'})`,
                debit: 0,
                credit: bill.totalAmount || 0
              }
            ];

            const newPosting: ACPosting = {
              id: `acp-dyn-sc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
              projectId: bill.projectId,
              referenceType: 'Contractor Bill',
              referenceNo: bill.billNo,
              date: bill.date,
              status: isApproved ? 'Posted' : 'Pending',
              items,
              debitTotal: bill.totalAmount,
              creditTotal: bill.totalAmount,
              remarks: `Auto-journal from subcontractor invoice ${bill.billNo}. ${bill.remarks || ''}`,
              createdAt: bill.createdAt || new Date().toISOString()
            };

            list.push(newPosting);
            updated = true;
          }
        });
      } catch (e) {
        console.error('Failed auto-syncing subcontractor bills to AC Posting', e);
      }
    }

    if (updated) {
      save('erp_ac_postings', list);
    }

    if (projectId) {
      return list.filter(p => p.projectId === projectId);
    }
    return list;
  },

  getPosting: (id: string): ACPosting | undefined => {
    return acPostingService.getPostings().find(p => p.id === id);
  },

  postEntry: (id: string): void => {
    const list = acPostingService.getPostings();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx].status = 'Posted';
      list[idx].postedAt = new Date().toISOString();
      save('erp_ac_postings', list);
    }
  },

  unpostEntry: (id: string): void => {
    const list = acPostingService.getPostings();
    const idx = list.findIndex(p => p.id === id);
    if (idx !== -1) {
      list[idx].status = 'Pending';
      delete list[idx].postedAt;
      save('erp_ac_postings', list);
    }
  }
};

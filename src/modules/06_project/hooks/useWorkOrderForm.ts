import React, { useState } from 'react';
import { WorkOrder } from '../types';
import { KNOWN_CONTRACTORS } from './useExecutionType';

interface WorkOrderFormFields {
  contractorName: string;
  activityName: string;
  amount: number;
  startDate: string;
  endDate: string;
  scope: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

interface UseWorkOrderFormProps {
  initialData?: WorkOrder;
  onSubmit: (data: Omit<WorkOrder, 'id' | 'woNo'>) => void;
  activities: { activityName: string }[];
}

export function useWorkOrderForm({ initialData, onSubmit, activities }: UseWorkOrderFormProps) {
  const [contractorName, setContractorName] = useState(initialData?.contractorName || KNOWN_CONTRACTORS[0]);
  const [activityName, setActivityName] = useState(
    initialData?.activityName || (activities.length > 0 ? activities[0].activityName : '')
  );
  const [amount, setAmount] = useState<number>(initialData?.amount ?? 500000);
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [scope, setScope] = useState(initialData?.scope || '');
  const [status, setStatus] = useState<'Pending' | 'Approved' | 'Rejected'>(initialData?.status || 'Pending');
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!contractorName || !activityName || !startDate || !endDate || amount <= 0) {
      setError('Please fill in all core contract fields with valid parameters.');
      return false;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setError('Contract commencement date cannot be registered after its deadline timeline.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      projectId: initialData?.projectId || '',
      contractorName,
      activityName,
      amount,
      startDate,
      endDate,
      scope: scope.trim() || 'General excavation and resource deployment as mapped in WBS baseline.',
      status
    });
  };

  const reset = () => {
    setContractorName(KNOWN_CONTRACTORS[0]);
    setActivityName(activities.length > 0 ? activities[0].activityName : '');
    setAmount(500000);
    setStartDate('');
    setEndDate('');
    setScope('');
    setStatus('Pending');
    setError('');
  };

  return {
    contractorName,
    setContractorName,
    activityName,
    setActivityName,
    amount,
    setAmount,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    scope,
    setScope,
    status,
    setStatus,
    error,
    setError,
    handleSubmit,
    reset
  };
}

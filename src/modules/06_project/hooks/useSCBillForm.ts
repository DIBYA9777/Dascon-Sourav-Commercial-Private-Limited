import React, { useState, useEffect } from 'react';
import { SCBill, SCBillItem } from '../types';

interface UseSCBillFormProps {
  initialBill?: SCBill;
  projectId: string;
  onSave: (bill: any) => void;
  onClose: () => void;
}

export function useSCBillForm({ initialBill, projectId, onSave, onClose }: UseSCBillFormProps) {
  const [contractorName, setContractorName] = useState('');
  const [date, setDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [items, setItems] = useState<Omit<SCBillItem, 'amount'>[]>([]);

  // Seed default or initial values
  useEffect(() => {
    if (initialBill) {
      setContractorName(initialBill.contractorName);
      setDate(initialBill.date);
      setRemarks(initialBill.remarks || '');
      setItems(initialBill.items.map(({ id, activityName, completedQty, rate, unit }) => ({
        id,
        activityName,
        completedQty,
        rate,
        unit
      })));
    } else {
      setContractorName('');
      setDate(new Date().toISOString().split('T')[0]);
      setRemarks('');
      setItems([
        {
          id: `item-${Date.now()}`,
          activityName: '',
          completedQty: 0,
          rate: 0,
          unit: 'Mtr'
        }
      ]);
    }
  }, [initialBill]);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        activityName: '',
        completedQty: 0,
        rate: 0,
        unit: 'Mtr'
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof Omit<SCBillItem, 'amount'>, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    }));
  };

  // Derive item totals and overall total
  const itemsWithAmounts = items.map(item => ({
    ...item,
    amount: (Number(item.completedQty) || 0) * (Number(item.rate) || 0)
  }));

  const totalAmount = itemsWithAmounts.reduce((sum, item) => sum + item.amount, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!contractorName.trim()) {
      alert('Please provide a Contractor Name.');
      return;
    }
    if (!date) {
      alert('Please provide a Bill Date.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one line item to the bill.');
      return;
    }
    
    // Validate each item
    for (const item of items) {
      if (!item.activityName.trim()) {
        alert('Please fill out all Activity Names.');
        return;
      }
      if (item.completedQty <= 0) {
        alert('Completed Quantity must be positive.');
        return;
      }
      if (item.rate <= 0) {
        alert('Unit Rate must be positive.');
        return;
      }
    }

    const payload = {
      projectId,
      contractorName,
      date,
      remarks,
      items: itemsWithAmounts,
      totalAmount
    };

    onSave(payload);
    onClose();
  };

  return {
    contractorName,
    setContractorName,
    date,
    setDate,
    remarks,
    setRemarks,
    items: itemsWithAmounts,
    totalAmount,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleSubmit
  };
}

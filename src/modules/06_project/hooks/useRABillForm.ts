import React, { useState, useEffect } from 'react';
import { RABill, RABillItem } from '../types';

interface UseRABillFormProps {
  initialBill?: RABill;
  projectId: string;
  onSave: (bill: any) => void;
  onClose: () => void;
}

export function useRABillForm({ initialBill, projectId, onSave, onClose }: UseRABillFormProps) {
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [gstRate, setGstRate] = useState(18); // Default 18% GST (Civil projects)
  const [items, setItems] = useState<Omit<RABillItem, 'amount'> & { amount: number }[]>([]);

  // Seed default or initial values
  useEffect(() => {
    if (initialBill) {
      setClientName(initialBill.clientName);
      setDate(initialBill.date);
      setRemarks(initialBill.remarks || '');
      setGstRate(initialBill.gstRate ?? 18);
      setItems(initialBill.items.map(({ id, description, amount }) => ({
        id,
        description,
        amount
      })));
    } else {
      setClientName('');
      setDate(new Date().toISOString().split('T')[0]);
      setRemarks('');
      setGstRate(18);
      setItems([
        {
          id: `item-${Date.now()}`,
          description: '',
          amount: 0
        }
      ]);
    }
  }, [initialBill]);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        description: '',
        amount: 0
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: 'description' | 'amount', value: any) => {
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

  // Financial values derivations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const gstAmount = Math.round((subtotal * gstRate) / 100);
  const grandTotal = subtotal + gstAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!clientName.trim()) {
      alert('Please provide a Client Name.');
      return;
    }
    if (!date) {
      alert('Please provide a Bill Date.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one line item to the Running Account bill.');
      return;
    }
    
    // Validate each line item
    for (const item of items) {
      if (!item.description.trim()) {
        alert('Please fill out descriptions for all bill items.');
        return;
      }
      if (item.amount <= 0) {
        alert('Items must carry positive values.');
        return;
      }
    }

    const payload = {
      projectId,
      clientName,
      date,
      remarks,
      gstRate,
      items,
      subtotal,
      gstAmount,
      grandTotal
    };

    onSave(payload);
    onClose();
  };

  return {
    clientName,
    setClientName,
    date,
    setDate,
    remarks,
    setRemarks,
    gstRate,
    setGstRate,
    items,
    subtotal,
    gstAmount,
    grandTotal,
    handleAddItem,
    handleRemoveItem,
    handleUpdateItem,
    handleSubmit
  };
}

import { useCallback } from 'react';
import { BOQ, BOQItem } from '../types';

export function useBOQItems(boq: BOQ | null, onSave: (updated: BOQ) => void) {
  
  const calculateTotal = (items: BOQItem[]): number => {
    return items.reduce((sum, item) => sum + (Number(item.qty) * Number(item.rate)), 0);
  };

  const addItem = useCallback((description: string, unit: string, qty: number, rate: number) => {
    if (!boq) return;

    const newItem: BOQItem = {
      id: `bi-${Date.now()}`,
      sNo: boq.items.length + 1,
      description: description.trim(),
      unit,
      qty: Number(qty),
      rate: Number(rate),
      amount: Number(qty) * Number(rate)
    };

    const updatedItems = [...boq.items, newItem];
    const updatedBOQ: BOQ = {
      ...boq,
      items: updatedItems,
      totalAmount: calculateTotal(updatedItems)
    };

    onSave(updatedBOQ);
  }, [boq, onSave]);

  const updateItem = useCallback((id: string, description: string, unit: string, qty: number, rate: number) => {
    if (!boq) return;

    const updatedItems = boq.items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          description: description.trim(),
          unit,
          qty: Number(qty),
          rate: Number(rate),
          amount: Number(qty) * Number(rate)
        };
      }
      return item;
    });

    const updatedBOQ: BOQ = {
      ...boq,
      items: updatedItems,
      totalAmount: calculateTotal(updatedItems)
    };

    onSave(updatedBOQ);
  }, [boq, onSave]);

  const deleteItem = useCallback((id: string) => {
    if (!boq) return;

    const filteredItems = boq.items.filter(item => item.id !== id);
    const updatedItems = filteredItems.map((item, index) => ({
      ...item,
      sNo: index + 1
    }));

    const updatedBOQ: BOQ = {
      ...boq,
      items: updatedItems,
      totalAmount: calculateTotal(updatedItems)
    };

    onSave(updatedBOQ);
  }, [boq, onSave]);

  return {
    addItem,
    updateItem,
    deleteItem
  };
}

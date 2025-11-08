import { useState, useEffect, useCallback } from 'react';
import type { Customer, Invoice } from '../types';

const CRM_STORAGE_KEY = 'theOlivistCrmData';

export const useCrmStore = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem(CRM_STORAGE_KEY);
      if (storedData) {
        setCustomers(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(customers));
      } catch (error) {
        console.error("Failed to save data to localStorage", error);
      }
    }
  }, [customers, isLoaded]);

  const addCustomer = useCallback((name: string): Customer => {
    const existingCustomer = customers.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingCustomer) {
      return existingCustomer;
    }
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name,
      invoices: [],
    };
    setCustomers(prev => [...prev, newCustomer]);
    return newCustomer;
  }, [customers]);

  const addInvoice = useCallback((customerName: string, invoice: Omit<Invoice, 'id'>) => {
    // Check for duplicate MARK across ALL customers
    const invoiceExists = customers.some(c => 
      c.invoices.some(i => i.mark === invoice.mark && i.mark !== 'N/A' && i.mark !== '')
    );
    if (invoiceExists) {
      throw new Error(`An invoice with MARK ${invoice.mark} already exists.`);
    }
    
    setCustomers(prevCustomers => {
      let customerExists = false;
      const updatedCustomers = prevCustomers.map(customer => {
        if (customer.name.toLowerCase() === customerName.toLowerCase()) {
          customerExists = true;
          return {
            ...customer,
            invoices: [...customer.invoices, { ...invoice, id: Date.now().toString() }],
          };
        }
        return customer;
      });

      if (customerExists) {
        return updatedCustomers;
      } else {
        const newCustomer: Customer = {
          id: (Date.now() + 1).toString(),
          name: customerName,
          invoices: [{ ...invoice, id: Date.now().toString() }],
        };
        return [...prevCustomers, newCustomer];
      }
    });
  }, [customers]);

  const clearAllData = useCallback(() => {
    setCustomers([]);
  }, []);

  return { customers, addCustomer, addInvoice, clearAllData, isLoaded };
};

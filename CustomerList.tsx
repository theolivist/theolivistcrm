import React, { useState, useMemo } from 'react';
import { SearchIcon, DocumentTextIcon } from './icons';
import type { Customer } from '../types';

interface CustomerListProps {
  customers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
}

const CustomerCard: React.FC<{customer: Customer; onSelect: () => void;}> = ({ customer, onSelect }) => (
    <div onClick={onSelect} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
        <div className="bg-olivist-light-green text-white rounded-full h-12 w-12 flex-shrink-0 flex items-center justify-center">
            <span className="text-xl font-bold">{customer.name.charAt(0).toUpperCase()}</span>
        </div>
        <div>
            <h3 className="font-bold text-lg text-gray-800">{customer.name}</h3>
            <p className="text-sm text-gray-500">{customer.invoices.length} {customer.invoices.length === 1 ? 'invoice' : 'invoices'}</p>
        </div>
    </div>
);

export const CustomerList: React.FC<CustomerListProps> = ({ customers, onSelectCustomer }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.name.localeCompare(b.name));
  }, [customers, searchTerm]);

  return (
    <div className="container mx-auto">
      <div className="relative mb-6">
        <input 
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-olivist-green"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon className="h-5 w-5 text-gray-400"/>
        </div>
      </div>

      {filteredCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map(customer => (
            <CustomerCard key={customer.id} customer={customer} onSelect={() => onSelectCustomer(customer)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
            <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-300"/>
            <h3 className="mt-4 text-xl font-semibold text-gray-700">No Customers Found</h3>
            <p className="mt-1 text-gray-500">
                {searchTerm ? "No customers match your search." : "Add your first invoice from the Dashboard."}
            </p>
        </div>
      )}
    </div>
  );
};

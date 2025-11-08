import React from 'react';
import type { Customer, Invoice } from '../types';
import { DocumentTextIcon } from './icons';

interface CustomerDetailProps {
  customer: Customer;
}

const InvoiceCard: React.FC<{ invoice: Invoice }> = ({ invoice }) => {
    const totalAmountFormatted = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(invoice.totalAmount);
    
    return (
        <a href={invoice.pdfDataUrl} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-gray-700">Invoice #{invoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString('en-GB')}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-olivist-green">{totalAmountFormatted}</p>
                    <p className="text-xs text-olivist-light-green">View PDF</p>
                </div>
            </div>
        </a>
    );
};

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
  const sortedInvoices = [...customer.invoices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-4">
            <div className="bg-olivist-light-green text-white rounded-full h-16 w-16 flex-shrink-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{customer.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-olivist-green">{customer.name}</h2>
                <p className="text-gray-600">{customer.invoices.length} {customer.invoices.length === 1 ? 'invoice' : 'invoices'} on record</p>
            </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4 text-gray-700">Invoices</h3>
      
      {sortedInvoices.length > 0 ? (
          <div className="space-y-4">
              {sortedInvoices.map(invoice => (
                  <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
          </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
            <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-300"/>
            <h3 className="mt-4 text-xl font-semibold text-gray-700">No Invoices</h3>
            <p className="mt-1 text-gray-500">There are no invoices for this customer yet.</p>
        </div>
      )}
    </div>
  );
};

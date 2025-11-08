import React, { useState } from 'react';
import { fileToBase64 } from '../utils/fileHelpers';
import { analyzeInvoice } from '../services/geminiService';
import type { AnalyzedInvoiceData } from '../services/geminiService';
import type { Invoice } from '../types';

interface InvoiceUploadModalProps {
  onClose: () => void;
  onInvoiceAdd: (customerName: string, invoice: Omit<Invoice, 'id'>) => void;
}

export const InvoiceUploadModal: React.FC<InvoiceUploadModalProps> = ({ onClose, onInvoiceAdd }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file.');
      return;
    }
    
    setFileName(file.name);
    setError(null);
    setIsProcessing(true);

    try {
      const { data: base64Data, dataUrl } = await fileToBase64(file);
      const analyzedData: AnalyzedInvoiceData = await analyzeInvoice(base64Data, file.type);
      
      const newInvoice: Omit<Invoice, 'id'> = {
        invoiceNumber: analyzedData.invoiceNumber,
        mark: analyzedData.mark,
        date: analyzedData.date,
        totalAmount: analyzedData.totalAmount,
        lineItems: analyzedData.lineItems,
        pdfDataUrl: dataUrl,
      };

      onInvoiceAdd(analyzedData.customerName, newInvoice);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      if (errorMessage.includes("already exists")) {
        setError(`Duplicate Invoice: ${errorMessage}`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-olivist-green">Upload Invoice</h2>
          <button onClick={onClose} disabled={isProcessing} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        
        {isProcessing ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olivist-green mx-auto"></div>
            <p className="mt-4 text-lg">Analyzing Invoice...</p>
            <p className="text-sm text-gray-600">AI is reading the details. This may take a moment.</p>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-gray-600">Select a PDF invoice to automatically add it to the CRM.</p>
            <label htmlFor="file-upload" className="w-full flex flex-col items-center px-4 py-6 bg-white text-olivist-green rounded-lg shadow-lg tracking-wide uppercase border border-dashed border-olivist-green cursor-pointer hover:bg-olivist-green hover:text-white transition-colors">
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4 4-4-4h3V9h2v2z" />
              </svg>
              <span className="mt-2 text-base leading-normal">{fileName || "Select a file"}</span>
              <input id="file-upload" type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
            </label>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

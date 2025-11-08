export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  mark: string;
  date: string;
  totalAmount: number;
  lineItems: LineItem[];
  pdfDataUrl: string; // To store and view the original PDF
}

export interface Customer {
  id:string;
  name: string;
  invoices: Invoice[];
}

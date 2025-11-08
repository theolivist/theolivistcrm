import { GoogleGenAI, Type } from "@google/genai";
import type { Invoice, LineItem } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder check. In the target environment, process.env.API_KEY will be set.
  console.warn("API_KEY environment variable not set. Using a placeholder.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'MISSING_API_KEY' });

export interface AnalyzedInvoiceData {
  customerName: string;
  invoiceNumber: string;
  mark: string;
  date: string;
  totalAmount: number;
  lineItems: LineItem[];
}

const invoiceSchema = {
  type: Type.OBJECT,
  properties: {
    customerName: { type: Type.STRING, description: "The full name of the customer or company." },
    invoiceNumber: { type: Type.STRING, description: "The unique invoice identifier number." },
    mark: { type: Type.STRING, description: "The unique MARK identifier from the invoice. It's usually a number found in the document." },
    date: { type: Type.STRING, description: "The date the invoice was issued, in YYYY-MM-DD format." },
    totalAmount: { type: Type.NUMBER, description: "The final total amount due on the invoice." },
    lineItems: {
      type: Type.ARRAY,
      description: "A list of all items or services on the invoice.",
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING, description: "Description of the item or service." },
          quantity: { type: Type.NUMBER, description: "The quantity of the item." },
          unitPrice: { type: Type.NUMBER, description: "The price per unit of the item." },
          total: { type: Type.NUMBER, description: "The total price for the line item (quantity * unitPrice)." },
        },
        required: ["description", "quantity", "unitPrice", "total"],
      },
    },
  },
  required: ["customerName", "invoiceNumber", "mark", "date", "totalAmount", "lineItems"],
};

export const analyzeInvoice = async (
  pdfBase64: string,
  mimeType: string
): Promise<AnalyzedInvoiceData> => {
  try {
    const pdfPart = {
      inlineData: {
        data: pdfBase64,
        mimeType: mimeType,
      },
    };

    const textPart = {
      text: "Analyze this invoice and extract the customer name, invoice number, the unique MARK identifier, date, total amount, and all line items. The filename might start with 'printinvoice' followed by the MARK number. Provide the output in the specified JSON format. If a value is not found, use a reasonable placeholder like 'N/A' for strings and 0 for numbers.",
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [pdfPart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: invoiceSchema,
      }
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);

    // Basic validation
    if (!parsedData.customerName || !parsedData.invoiceNumber || !parsedData.mark) {
        throw new Error("Failed to extract key information (customer, invoice #, or MARK) from invoice.");
    }
    
    return parsedData as AnalyzedInvoiceData;
  } catch (error) {
    console.error("Error analyzing invoice with Gemini API:", error);
    throw new Error("Failed to analyze invoice. Please check the PDF quality or try again.");
  }
};

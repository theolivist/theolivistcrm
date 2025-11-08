import React, { useMemo } from 'react';
import type { Customer } from '../types';
import { UsersIcon, DocumentTextIcon, TagIcon } from './icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-olivist-green/10 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const ChartBar: React.FC<{ label: string; value: number; maxValue: number; isCurrency?: boolean }> = ({ label, value, maxValue, isCurrency }) => {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const formattedValue = isCurrency 
    ? new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(value)
    : value;

  return (
    <div className="flex items-center space-x-2 text-sm py-1">
      <div className="w-1/3 truncate text-gray-600" title={label}>{label}</div>
      <div className="w-2/3 flex items-center space-x-2">
        <div className="flex-grow bg-gray-200 rounded-full h-4">
          <div className="bg-olivist-light-green h-4 rounded-full" style={{ width: `${percentage}%` }} />
        </div>
        <span className="font-semibold w-24 text-right text-gray-700">{formattedValue}</span>
      </div>
    </div>
  );
};


export const MainDashboard: React.FC<{ customers: Customer[] }> = ({ customers }) => {
  const stats = useMemo(() => {
    const allInvoices = customers.flatMap(c => c.invoices);
    const totalTurnover = allInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCustomers = customers.length;
    const totalInvoices = allInvoices.length;

    const topCustomers = [...customers]
      .map(c => ({
        name: c.name,
        totalSpent: c.invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      }))
      .filter(c => c.totalSpent > 0)
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const productSales = allInvoices
      .flatMap(inv => inv.lineItems)
      // FIX: Changed the way reduce is typed to avoid the "Untyped function calls may not accept type arguments" error.
      // By providing a generic type argument to reduce, TypeScript can correctly infer the accumulator's type.
      .reduce<Record<string, { quantity: number; total: number }>>((acc, item) => {
        const key = item.description.trim();
        if (!key) return acc;
        if (!acc[key]) {
          acc[key] = { quantity: 0, total: 0 };
        }
        acc[key].quantity += item.quantity;
        acc[key].total += item.total;
        return acc;
      }, {});

    const topProducts = Object.entries(productSales)
      // FIX: This line previously failed because `productSales` was of type `any`.
      // Correcting the `reduce` call above ensures `productSales` is properly typed, resolving this error.
      .map(([description, data]) => ({ description, ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return { totalTurnover, totalCustomers, totalInvoices, topCustomers, topProducts };
  }, [customers]);

  const turnoverFormatted = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(stats.totalTurnover);

  return (
    <div className="container mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Turnover" value={turnoverFormatted} icon={<span className="text-xl font-bold text-olivist-green">€</span>} />
        <StatCard title="Customers" value={stats.totalCustomers} icon={<UsersIcon className="h-6 w-6 text-olivist-green"/>} />
        <StatCard title="Invoices" value={stats.totalInvoices} icon={<DocumentTextIcon className="h-6 w-6 text-olivist-green"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Top Customers</h3>
            {stats.topCustomers.length > 0 ? (
                <div className="space-y-2">
                    {stats.topCustomers.map(c => (
                        <ChartBar key={c.name} label={c.name} value={c.totalSpent} maxValue={stats.topCustomers[0].totalSpent} isCurrency />
                    ))}
                </div>
            ) : <p className="text-gray-500 text-sm">No customer data available.</p>}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg text-gray-800 mb-3">Top Products (by Revenue)</h3>
            {stats.topProducts.length > 0 ? (
                <div className="space-y-2">
                    {stats.topProducts.map(p => (
                        <ChartBar key={p.description} label={p.description} value={p.total} maxValue={stats.topProducts[0].total} isCurrency/>
                    ))}
                </div>
            ) : <p className="text-gray-500 text-sm">No product data available.</p>}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useCallback } from 'react';
import { CustomerDetail } from './components/CustomerDetail';
import { Header } from './components/Header';
import { useCrmStore } from './hooks/useCrmStore';
import type { Customer } from './types';
import { Login } from './components/Login';
import { TabBar } from './components/TabBar';
import { MainDashboard } from './components/MainDashboard';
import { CustomerList } from './components/CustomerList';
import { ProductsView } from './components/ProductsView';
import { MenuView } from './components/MenuView';
import { InvoiceUploadModal } from './components/InvoiceUploadModal';

type Tab = 'dashboard' | 'customers' | 'products' | 'menu';

const App: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { customers, addInvoice, isLoaded } = useCrmStore();

  const handleLogin = (email: string) => {
    setUserEmail(email);
  };

  const handleSelectCustomer = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedCustomer(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-olivist-gray">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-olivist-green"></div>
      </div>
    );
  }

  if (!userEmail) {
    return <Login onLogin={handleLogin} />;
  }

  if (userEmail !== 'theolivist@gmail.com') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-olivist-gray">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-olivist-green mb-4">Under Construction</h1>
          <p className="text-gray-700">This section is currently being developed for our partners.</p>
          <p className="mt-4 text-sm text-gray-500">For full access, please contact The Olivist.</p>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    if (selectedCustomer) return selectedCustomer.name;
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'customers': return 'Customers';
      case 'products': return 'Products';
      case 'menu': return 'Menu';
      default: return 'The Olivist CRM';
    }
  };

  const renderContent = () => {
    if (selectedCustomer) {
      return <CustomerDetail customer={selectedCustomer} />;
    }
    switch (activeTab) {
      case 'dashboard': return <MainDashboard customers={customers} />;
      case 'customers': return <CustomerList customers={customers} onSelectCustomer={handleSelectCustomer} />;
      case 'products': return <ProductsView />;
      case 'menu': return <MenuView />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-800 bg-olivist-gray">
      <Header
        title={getTitle()}
        showBackButton={!!selectedCustomer}
        onBack={handleBack}
        customers={customers}
        showAddButton={!selectedCustomer && activeTab === 'dashboard'}
        onAddClick={() => setIsModalOpen(true)}
      />
      <main className="p-4 md:p-6 pb-24">
        {renderContent()}
      </main>
      {!selectedCustomer && <TabBar activeTab={activeTab} onTabChange={setActiveTab} />}
      
      {isModalOpen && (
        <InvoiceUploadModal
          onClose={() => setIsModalOpen(false)}
          onInvoiceAdd={addInvoice}
        />
      )}
    </div>
  );
};

export default App;

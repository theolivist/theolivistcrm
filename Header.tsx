import React, { useCallback } from 'react';
import { ArrowLeftIcon, BackupIcon, PlusIcon } from './icons';
import type { Customer } from '../types';

interface HeaderProps {
  title: string;
  showBackButton: boolean;
  onBack: () => void;
  customers: Customer[];
  showAddButton?: boolean;
  onAddClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, showBackButton, onBack, customers, showAddButton, onAddClick }) => {
  
  const handleBackup = useCallback(() => {
    if (customers.length === 0) {
      alert("No data to back up.");
      return;
    }

    try {
      const backupData = JSON.stringify(customers, null, 2);
      const encodedData = encodeURIComponent(backupData);
      const mailtoLink = `mailto:?subject=The%20Olivist%20CRM%20Backup%20${new Date().toISOString().slice(0,10)}&body=Please%20find%20your%20CRM%20data%20backup%20below.%0A%0ASave%20this%20email%20or%20copy%20the%20content%20to%20a%20safe%20place.%0A%0A---%20BACKUP%20DATA%20---%0A%0A${encodedData}`;
      
      window.location.href = mailtoLink;
    } catch (error) {
      console.error("Failed to create backup", error);
      alert("An error occurred while creating the backup file.");
    }
  }, [customers]);

  return (
    <header className="bg-olivist-green text-white sticky top-0 z-10 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center min-w-0">
          {showBackButton && (
            <button onClick={onBack} className="mr-2 p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
          )}
          <h1 className="text-xl font-bold truncate">{title}</h1>
        </div>
        <div className="flex items-center space-x-2">
           {showAddButton && (
            <button onClick={onAddClick} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Add new invoice">
              <PlusIcon className="h-6 w-6" />
            </button>
          )}
          <button onClick={handleBackup} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Create Backup">
            <BackupIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

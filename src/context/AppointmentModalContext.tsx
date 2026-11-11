import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface AppointmentModalContextType {
  isOpen: boolean;
  preselectedService: string | null;
  openModal: (serviceName?: string) => void;
  closeModal: () => void;
}

const AppointmentModalContext = createContext<AppointmentModalContextType | undefined>(undefined);

export const AppointmentModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [preselectedService, setPreselectedService] = useState<string | null>(null);

  const openModal = (serviceName?: string) => {
    if (serviceName) {
      setPreselectedService(serviceName);
    } else {
      setPreselectedService(null);
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setPreselectedService(null);
  };

  return (
    <AppointmentModalContext.Provider value={{ isOpen, preselectedService, openModal, closeModal }}>
      {children}
    </AppointmentModalContext.Provider>
  );
};

export const useAppointmentModal = (): AppointmentModalContextType => {
  const context = useContext(AppointmentModalContext);
  if (!context) {
    throw new Error('useAppointmentModal must be used within an AppointmentModalProvider');
  }
  return context;
};

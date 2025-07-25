import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AccountContextType {
  accountId: string | null;
  setAccountId: (id: string | null) => void;
  isValidAccount: boolean;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

interface AccountProviderProps {
  children: ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accountId, setAccountIdState] = useState<string | null>(null);

  // Extract account from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accParam = urlParams.get('acc');
    
    if (accParam && accParam.length >= 10) {
      setAccountIdState(accParam);
    } else {
      // Auto-redirect to example123 if no valid account in URL
      setAccountIdState('example123');
      const url = new URL(window.location.href);
      url.searchParams.set('acc', 'example123');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  // Update URL when account changes
  const setAccountId = (id: string | null) => {
    setAccountIdState(id);
    
    const url = new URL(window.location.href);
    if (id && id.length >= 10) {
      url.searchParams.set('acc', id);
    } else {
      url.searchParams.delete('acc');
    }
    
    window.history.replaceState({}, '', url.toString());
  };

  const isValidAccount = accountId !== null && accountId.length >= 10;

  return (
    <AccountContext.Provider 
      value={{ 
        accountId, 
        setAccountId, 
        isValidAccount 
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};
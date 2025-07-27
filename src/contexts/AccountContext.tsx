import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AccountContextType {
  accountId: string | null;
  accountUuid: string | null;
  setAccountId: (id: string | null) => void;
  isLoading: boolean;
  isValidAccount: boolean;
}

const AccountContext = createContext<AccountContextType>({
  accountId: null,
  accountUuid: null,
  setAccountId: () => {},
  isLoading: true,
  isValidAccount: false,
});

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
};

interface AccountProviderProps {
  children: React.ReactNode;
}

export const AccountProvider: React.FC<AccountProviderProps> = ({ children }) => {
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountUuid, setAccountUuid] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Function to get or create account UUID
  const getOrCreateAccountUuid = async (accountName: string): Promise<string | null> => {
    try {
      const { data, error } = await supabase
        .rpc('get_or_create_account', { account_name_param: accountName });
      
      if (error) {
        console.error('Error getting/creating account:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getOrCreateAccountUuid:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAccount = async () => {
      setIsLoading(true);
      
      // Get account ID from URL params
      const urlParams = new URLSearchParams(location.search);
      const accParam = urlParams.get('acc');
      
      // Validate account parameter - reject "null" string and invalid values
      if (accParam && accParam !== 'null' && accParam.length >= 10) {
        setAccountId(accParam);
        
        // Get or create the account UUID
        const uuid = await getOrCreateAccountUuid(accParam);
        setAccountUuid(uuid);
      } else {
        setAccountId(null);
        setAccountUuid(null);
      }
      
      setIsLoading(false);
    };

    initializeAccount();
  }, [location.search]);

  const handleSetAccountId = async (id: string | null) => {
    // Validate input - reject "null" string and invalid values
    if (id && (id === 'null' || id.length < 10)) {
      setAccountId(null);
      setAccountUuid(null);
      return;
    }
    
    setAccountId(id);
    
    if (id) {
      const uuid = await getOrCreateAccountUuid(id);
      setAccountUuid(uuid);
    } else {
      setAccountUuid(null);
    }
  };

  const isValidAccount = accountId !== null && accountId !== 'null' && accountId.length >= 10;

  return (
    <AccountContext.Provider 
      value={{ 
        accountId, 
        accountUuid,
        setAccountId: handleSetAccountId, 
        isLoading,
        isValidAccount 
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
import React, { useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, Check, X } from 'lucide-react';

const AccountInput: React.FC = () => {
  const { accountId, setAccountId, isValidAccount } = useAccount();
  const [inputValue, setInputValue] = useState(accountId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.length >= 10) {
      setAccountId(inputValue);
    }
  };

  const handleClear = () => {
    setAccountId(null);
    setInputValue('');
  };

  const isValidInput = inputValue.length >= 10;

  return (
    <Card className="p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <User size={16} className="text-primary" />
        <span className="text-sm font-medium">Tài khoản</span>
        {isValidAccount && (
          <Check size={14} className="text-green-500" />
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập ID tài khoản (tối thiểu 10 ký tự)"
          className={`flex-1 text-sm ${
            inputValue.length > 0 && inputValue.length < 10 
              ? 'border-red-300 focus:border-red-500' 
              : ''
          }`}
        />
        
        {isValidAccount ? (
          <Button 
            type="button" 
            onClick={handleClear}
            variant="outline" 
            size="sm"
            className="px-3"
          >
            <X size={14} />
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={!isValidInput}
            size="sm"
            className="px-3"
          >
            Lưu
          </Button>
        )}
      </form>
      
      {inputValue.length > 0 && inputValue.length < 10 && (
        <p className="text-xs text-red-500 mt-1">
          Cần ít nhất 10 ký tự
        </p>
      )}
      
      {isValidAccount && (
        <p className="text-xs text-green-600 mt-1">
          Đã đăng nhập: {accountId}
        </p>
      )}
    </Card>
  );
};

export default AccountInput;
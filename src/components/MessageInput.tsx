
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SendIcon } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, inputRef }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Digite o símbolo da ação (ex: AAPL) ou par de moedas (ex: EUR/USD)..."
        className="insight-input flex-grow"
        disabled={isLoading}
        ref={inputRef}
      />
      <Button 
        type="submit" 
        className="insight-button" 
        disabled={isLoading || !inputValue.trim()}
      >
        <SendIcon size={18} className="mr-2" />
        {isLoading ? 'Analisando...' : 'Analisar'}
      </Button>
    </form>
  );
};

export default MessageInput;


import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  isSaved?: boolean;
}

interface ChatContainerProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onToggleSidebar: () => void;
  isLoading: boolean;
  onSaveMessage: (messageId: string) => void;
  isMobile: boolean;
  messageInputRef?: React.RefObject<HTMLInputElement>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  onToggleSidebar,
  isLoading,
  onSaveMessage,
  isMobile,
  messageInputRef
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <header className="border-b border-insight-border p-3 flex items-center">
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleSidebar}
            className="mr-2 h-8 w-8"
          >
            <MenuIcon size={18} />
          </Button>
        )}
        <h1 className="text-xl font-semibold flex-1">Insight Finance AI</h1>
        <ThemeToggle />
      </header>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-2xl font-bold mb-2">Bem-vindo ao Insight Finance AI</h2>
            <p className="text-muted-foreground max-w-md mb-4">
              Faça perguntas sobre ações ou pares de moedas para análise fundamentalista detalhada
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
              <div className="border border-insight-border rounded p-3 bg-card">
                <h3 className="font-medium mb-1">Exemplos de Ações:</h3>
                <ul className="text-sm text-muted-foreground">
                  <li>"Analisar ação AAPL"</li>
                  <li>"Análise fundamentalista de MSFT"</li>
                </ul>
              </div>
              <div className="border border-insight-border rounded p-3 bg-card">
                <h3 className="font-medium mb-1">Exemplos de Forex:</h3>
                <ul className="text-sm text-muted-foreground">
                  <li>"Análise de EUR/USD"</li>
                  <li>"Qual a perspectiva para GBP/JPY?"</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                type={message.type}
                timestamp={message.timestamp}
                onSaveMessage={() => onSaveMessage(message.id)}
                isSaved={message.isSaved}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t border-insight-border">
        <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} inputRef={messageInputRef} />
        <div className="text-xs text-center text-muted-foreground mt-3">
          Desenvolvido com OpenAI + Finnhub API + FMP API
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;

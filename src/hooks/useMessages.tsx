
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  isSaved?: boolean;
}

export function useMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedMessages, setSavedMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Carrega mensagens do localStorage na renderização inicial
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('insight-finance-chats');
      const savedFavorites = localStorage.getItem('insight-finance-favorites');
      
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        // Converte datas de string para objetos Date
        setMessages(parsedChats.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        // Converte datas de string para objetos Date
        setSavedMessages(parsedFavorites.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
          isSaved: true
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar conversas salvas:', error);
    }
  }, []);

  // Salva mensagens no localStorage sempre que mudarem
  useEffect(() => {
    try {
      localStorage.setItem('insight-finance-chats', JSON.stringify(messages));
    } catch (error) {
      console.error('Erro ao salvar conversas:', error);
    }
  }, [messages]);

  // Salva favoritos no localStorage sempre que mudarem
  useEffect(() => {
    try {
      localStorage.setItem('insight-finance-favorites', JSON.stringify(savedMessages));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [savedMessages]);

  const handleSaveMessage = (messageId: string) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        // Alterna estado salvo
        const newSavedState = !msg.isSaved;
        
        // Adiciona ou remove dos favoritos
        if (newSavedState) {
          setSavedMessages(prev => [...prev, { ...msg, isSaved: true }]);
          toast({
            title: "Salva",
            description: "Análise adicionada aos favoritos.",
          });
        } else {
          setSavedMessages(prev => prev.filter(saved => saved.id !== messageId));
          toast({
            title: "Removida",
            description: "Análise removida dos favoritos.",
          });
        }
        
        return { ...msg, isSaved: newSavedState };
      }
      return msg;
    });
    
    setMessages(updatedMessages);
  };

  // Função para limpar mensagens
  const clearMessages = () => {
    setMessages([]);
    toast({
      title: "Limpo",
      description: "O histórico de conversas foi limpo.",
    });
  };

  return {
    messages,
    savedMessages,
    isLoading,
    setIsLoading,
    setMessages,
    handleSaveMessage,
    clearMessages
  };
}

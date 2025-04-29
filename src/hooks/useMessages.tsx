
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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

  // Load messages from localStorage on initial render
  useEffect(() => {
    try {
      const savedChats = localStorage.getItem('insight-finance-chats');
      const savedFavorites = localStorage.getItem('insight-finance-favorites');
      
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats);
        // Convert string dates back to Date objects
        setMessages(parsedChats.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
      
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        // Convert string dates back to Date objects
        setSavedMessages(parsedFavorites.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      }
    } catch (error) {
      console.error('Erro ao carregar conversas salvas:', error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('insight-finance-chats', JSON.stringify(messages));
    } catch (error) {
      console.error('Erro ao salvar conversas:', error);
    }
  }, [messages]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('insight-finance-favorites', JSON.stringify(savedMessages));
    } catch (error) {
      console.error('Erro ao salvar favoritos:', error);
    }
  }, [savedMessages]);

  const handleSaveMessage = (messageId: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId) {
          // Toggle saved state
          const newSavedState = !msg.isSaved;
          
          // Add or remove from saved messages
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
      })
    );
  };

  // Add a function to clear messages
  const clearMessages = () => {
    setMessages([]);
    toast({
      title: "Limpo",
      description: "O histórico de conversas foi limpo.",
    });
  };

  // Apply any saved message states to the current messages
  const messagesWithSavedState = messages.map(msg => {
    const isSaved = savedMessages.some(saved => saved.id === msg.id);
    return { ...msg, isSaved };
  });

  return {
    messages: messagesWithSavedState,
    savedMessages,
    isLoading,
    setIsLoading,
    setMessages,
    handleSaveMessage,
    clearMessages
  };
}

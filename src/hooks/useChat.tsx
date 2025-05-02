
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { generateFinancialAnalysis } from '@/services/financialAnalysis';
import { useMessages, type ChatMessage } from '@/hooks/useMessages';

export function useChat() {
  const { messages, savedMessages, isLoading, setIsLoading, setMessages, handleSaveMessage, clearMessages } = useMessages();
  const { toast } = useToast();

  const handleSendMessage = async (message: string) => {
    if (isLoading) return;

    const userMessage: ChatMessage = {
      id: uuidv4(),
      content: message,
      type: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the refactored financial analysis service
      const response = await generateFinancialAnalysis(message);
      
      const aiMessage: ChatMessage = {
        id: `${userMessage.id}-response`,
        content: response,
        type: 'ai',
        timestamp: new Date(),
        isSaved: false
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
      toast({
        title: "Erro",
        description: "Falha ao gerar análise. Por favor, tente novamente.",
        variant: "destructive"
      });

      const errorMessage: ChatMessage = {
        id: `${userMessage.id}-error`,
        content: "Desculpe, não consegui gerar uma análise neste momento. Por favor, tente novamente mais tarde.",
        type: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = useCallback((message: string) => {
    handleSendMessage(message);
  }, []);

  return {
    messages,
    savedMessages,
    isLoading,
    handleSendMessage,
    handleHistoryItemClick,
    handleSaveMessage,
    clearMessages
  };
}

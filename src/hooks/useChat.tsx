
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { generateFinancialAnalysis } from '@/services/financialAnalysis';
import { useMessages, type ChatMessage } from '@/hooks/useMessages';

export function useChat() {
  const { messages, savedMessages, isLoading, setIsLoading, setMessages, handleSaveMessage } = useMessages();
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
      // This would be replaced with actual API calls in a production app
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
      console.error('Error generating analysis:', error);
      toast({
        title: "Error",
        description: "Failed to generate analysis. Please try again.",
        variant: "destructive"
      });

      const errorMessage: ChatMessage = {
        id: `${userMessage.id}-error`,
        content: "Sorry, I couldn't generate an analysis at this time. Please try again later.",
        type: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (message: string) => {
    handleSendMessage(message);
  };

  return {
    messages,
    savedMessages,
    isLoading,
    handleSendMessage,
    handleHistoryItemClick,
    handleSaveMessage
  };
}


import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatContainer from '@/components/ChatContainer';

// Define the ChatMessage interface
interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  isSaved?: boolean;
}

// Mock financial analysis response function (this would be replaced with actual API calls)
const generateFinancialAnalysis = async (query: string): Promise<string> => {
  // This is a placeholder. In a real implementation, this would call the financial APIs and OpenAI
  const assetMatch = query.match(/\b([A-Z]{1,5}(?:\/[A-Z]{3})?)\b/i);
  
  if (!assetMatch) {
    return "I couldn't identify a valid stock ticker or forex pair in your query. Please specify a stock (e.g., AAPL) or forex pair (e.g., EUR/USD).";
  }
  
  const asset = assetMatch[1].toUpperCase();
  
  // Check if it's a forex pair
  if (asset.includes('/')) {
    const [baseCurrency, quoteCurrency] = asset.split('/');
    
    // Sample forex analysis response
    return `${baseCurrency}/${quoteCurrency} Fundamental Analysis:\n\nKey Macroeconomic Indicators:\n• ${baseCurrency} Interest Rate: 4.75%\n• ${quoteCurrency} Interest Rate: 5.50%\n• ${baseCurrency} Inflation Rate: 3.2%\n• ${quoteCurrency} Inflation Rate: 3.7%\n• ${baseCurrency} GDP Growth: 0.3% (Quarter over Quarter)\n• ${quoteCurrency} GDP Growth: 0.5% (Quarter over Quarter)\n\nCentral Bank Outlook:\n• ${baseCurrency} Central Bank: Currently on a holding pattern after a series of rate hikes. Forward guidance suggests potential rate cuts in the next 6 months.\n• ${quoteCurrency} Central Bank: Still maintaining a restrictive stance with one more potential rate hike expected before year-end.\n\nPolitical and Economic Risks:\n• ${baseCurrency}: Moderate political stability, concerns about energy prices\n• ${quoteCurrency}: Strong labor market but housing sector weakness\n\nTrade Balance:\n• ${baseCurrency} Trade Balance: -€15.2B\n• ${quoteCurrency} Trade Balance: -$78.8B\n\nSummary and Outlook:\nBased on the fundamental analysis, the outlook is slightly bearish for ${baseCurrency} against ${quoteCurrency} in the short term due to the interest rate differential and stronger growth in the ${quoteCurrency} economy. However, medium-term outlook suggests potential reversal as ${baseCurrency} central bank is likely to finish its easing cycle before the ${quoteCurrency} central bank.`;
  } 
  else {
    // Sample stock analysis response
    return `${asset} Fundamental Analysis:\n\nCompany Overview:\n${asset} is a major technology company specializing in consumer electronics, software and online services.\n\nKey Financial Metrics:\n• Market Cap: $2.78T\n• P/E Ratio: 28.3\n• P/B Ratio: 34.6\n• ROE: 175%\n• ROA: 28.3%\n• Debt/Equity: 1.65\n• Current Ratio: 1.07\n\nRecent Performance:\n• Revenue (Last Quarter): $89.5B (-1.2% YoY)\n• Net Income: $24.1B (+2.3% YoY)\n• Profit Margins:\n  - Gross: 43.5%\n  - Operating: 30.2%\n  - Net: 25.9%\n\nHistorical Performance:\n• 1Y Return: +18.5%\n• 5Y Return: +252.3%\n\nRecent Insider Trading:\nSlight net selling over the past 3 months, with executives exercising options.\n\nRecent News:\nLaunched new product line with AI capabilities. Partnership with major cloud providers announced.\n\nRisk Analysis:\n• Strong USD may affect overseas revenue\n• Supply chain constraints persisting but improving\n• Increasing competition in key product categories\n• Regulatory scrutiny in multiple markets\n\nSummary:\nBased on fundamental analysis, ${asset} is currently fairly priced, trading slightly above industry average P/E but justifiable given strong cash flow, market position, and growth in services. The company maintains industry-leading margins though faces headwinds from macroeconomic conditions and supply constraints.`;
  }
};

const Index = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedMessages, setSavedMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
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
      console.error('Error loading saved chats:', error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('insight-finance-chats', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chats:', error);
    }
  }, [messages]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('insight-finance-favorites', JSON.stringify(savedMessages));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [savedMessages]);

  // Auto-close sidebar on mobile when sending a message
  useEffect(() => {
    if (isMobile && sidebarOpen && messages.length > 0) {
      setSidebarOpen(false);
    }
  }, [messages.length, isMobile]);

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
              title: "Saved",
              description: "Analysis added to favorites.",
            });
          } else {
            setSavedMessages(prev => prev.filter(saved => saved.id !== messageId));
            toast({
              title: "Removed",
              description: "Analysis removed from favorites.",
            });
          }
          
          return { ...msg, isSaved: newSavedState };
        }
        return msg;
      })
    );
  };

  const handleHistoryItemClick = (message: string) => {
    handleSendMessage(message);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Apply any saved message states to the current messages
  const messagesWithSavedState = messages.map(msg => {
    const isSaved = savedMessages.some(saved => saved.id === msg.id);
    return { ...msg, isSaved };
  });

  return (
    <div className="h-screen flex overflow-hidden bg-insight-background">
      {/* Sidebar - hidden on mobile when not active */}
      <div className={`
        ${isMobile 
          ? sidebarOpen 
            ? 'fixed inset-y-0 left-0 z-40' 
            : 'hidden' 
          : 'flex'}`}>
        <Sidebar 
          chatHistory={messages} 
          savedMessages={savedMessages}
          onHistoryItemClick={handleHistoryItemClick} 
          onToggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <ChatContainer 
        messages={messagesWithSavedState} 
        onSendMessage={handleSendMessage} 
        onToggleSidebar={toggleSidebar}
        isLoading={isLoading}
        onSaveMessage={handleSaveMessage}
        isMobile={isMobile}
      />
    </div>
  );
};

export default Index;

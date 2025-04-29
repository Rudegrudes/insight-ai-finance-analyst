
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import Sidebar from '@/components/Sidebar';
import ChatContainer from '@/components/ChatContainer';
import { useChat } from '@/hooks/useChat';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { 
    messages, 
    savedMessages, 
    isLoading, 
    handleSendMessage, 
    handleHistoryItemClick,
    handleSaveMessage,
    clearMessages
  } = useChat();

  // Auto-close sidebar on mobile when sending a message
  useEffect(() => {
    if (isMobile && sidebarOpen && messages.length > 0) {
      setSidebarOpen(false);
    }
  }, [messages.length, isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
          onClearHistory={clearMessages}
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
        messages={messages} 
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

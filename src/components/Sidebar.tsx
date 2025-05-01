
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HistoryIcon, BookmarkIcon, XIcon, Trash2Icon } from 'lucide-react';

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
  isSaved?: boolean;
}

interface SidebarProps {
  chatHistory: ChatMessage[];
  savedMessages: ChatMessage[];
  onHistoryItemClick: (message: string) => void;
  onToggleSidebar: () => void;
  onClearHistory: () => void;
  onAskQuestion: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  chatHistory, 
  savedMessages,
  onHistoryItemClick, 
  onToggleSidebar,
  onClearHistory,
  onAskQuestion,
  isMobile 
}) => {
  // Group chat history by date
  const groupedHistory = chatHistory
    .filter(msg => msg.type === 'user')
    .reduce((groups: Record<string, ChatMessage[]>, message) => {
      const date = message.timestamp.toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});

  const renderHistoryItem = (message: ChatMessage) => (
    <div 
      key={message.id}
      onClick={() => onHistoryItemClick(message.content)}
      className="history-item"
    >
      {message.content}
    </div>
  );

  return (
    <div className="w-64 bg-sidebar border-r border-insight-border flex flex-col h-full">
      <div className="p-3 border-b border-sidebar-border flex justify-between items-center">
        <h2 className="font-bold text-lg sidebar-title">Insight Finance AI</h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="h-8 w-8">
            <XIcon size={18} />
          </Button>
        )}
      </div>

      <Tabs defaultValue="history" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mx-3 my-2">
          <TabsTrigger value="history">
            <HistoryIcon size={14} className="mr-2" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <BookmarkIcon size={14} className="mr-2" />
            Favoritos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="flex-1 px-3 flex flex-col">
          <ScrollArea className="h-full pr-3 flex-1">
            {Object.entries(groupedHistory).length > 0 ? (
              Object.entries(groupedHistory).map(([date, messages]) => (
                <div key={date} className="mb-4">
                  <h3 className="text-xs text-muted-foreground font-medium mb-1">{date}</h3>
                  <div className="space-y-0.5">
                    {messages.map(renderHistoryItem)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                Seu histórico de pesquisas aparecerá aqui
              </div>
            )}
          </ScrollArea>
          
          {Object.entries(groupedHistory).length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearHistory} 
              className="mt-2 mb-2 flex items-center gap-2 text-muted-foreground hover:text-destructive"
            >
              <Trash2Icon size={14} />
              Limpar Histórico
            </Button>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="flex-1 px-3">
          <ScrollArea className="h-full pr-3">
            {savedMessages.length > 0 ? (
              <div className="space-y-1">
                {savedMessages
                  .filter(msg => msg.type === 'ai')
                  .map(message => (
                    <div 
                      key={message.id}
                      className="p-3 hover:bg-sidebar-accent rounded text-sm border-b border-sidebar-border/40"
                    >
                      <div className="font-medium truncate">{
                        chatHistory.find(m => m.id === message.id.replace('-response', ''))?.content || 'Análise Salva'
                      }</div>
                      <div className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleDateString()}
                      </div>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center py-8">
                Suas análises salvas aparecerão aqui
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t border-sidebar-border">
        <Button className="insight-button w-full" onClick={onAskQuestion}>
          Fazer Pergunta
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

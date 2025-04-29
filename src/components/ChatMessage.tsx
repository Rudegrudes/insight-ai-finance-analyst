
import React from 'react';
import { BookmarkIcon } from 'lucide-react';

type MessageType = 'user' | 'ai';

interface ChatMessageProps {
  message: string;
  type: MessageType;
  timestamp: Date;
  onSaveMessage?: () => void;
  isSaved?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  type, 
  timestamp,
  onSaveMessage,
  isSaved = false
}) => {
  return (
    <div className={`chat-message ${type === 'user' ? 'user-message' : 'ai-message'}`}>
      <div className="flex justify-between items-start">
        <div className="font-medium text-sm text-muted-foreground mb-2">
          {type === 'user' ? 'You' : 'Insight Finance AI'} • {timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>
        {type === 'ai' && (
          <button 
            onClick={onSaveMessage}
            className="text-muted-foreground hover:text-insight transition-colors"
            title={isSaved ? "Remove from favorites" : "Save to favorites"}
          >
            <BookmarkIcon size={16} className={isSaved ? "fill-insight text-insight" : ""} />
          </button>
        )}
      </div>
      <div className="whitespace-pre-wrap">
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;

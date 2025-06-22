import React from "react";
import { ChatMessage as ChatMessageType } from "../../types";
import { AudioPlayer } from "../AudioPlayer/AudioPlayer";
import classes from "./ChatMessage.module.scss";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  const renderMessageContent = () => {
    switch (message.type) {
      case 'text':
        return <div className={classes.textContent}>{message.content}</div>;
      
      case 'file':
        return (
          <div className={classes.fileContent}>
            <div className={classes.fileIcon}>📎</div>
            <div className={classes.fileInfo}>
              <div className={classes.fileName}>{message.fileName}</div>
              {message.fileUrl && (
                <a 
                  href={message.fileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={classes.fileLink}
                >
                  Открыть файл
                </a>
              )}
            </div>
          </div>
        );
      
      case 'voice':
        console.log('Rendering voice message with duration:', message.voiceDuration);
        return (
          <div className={classes.voiceContent}>
            <div className={classes.voiceLabel}>Голосовое сообщение</div>
            {message.fileUrl && (
              <AudioPlayer 
                audioUrl={message.fileUrl} 
                duration={message.voiceDuration || 0} 
              />
            )}
          </div>
        );
      
      case 'system':
        return <div className={classes.systemContent}>{message.content}</div>;
      
      default:
        return <div className={classes.textContent}>{message.content}</div>;
    }
  };

  return (
    <div 
      className={`${classes.chatMessage} ${
        message.isFromSupport ? classes.supportMessage : classes.userMessage
      } ${message.type === 'system' ? classes.systemMessage : ''}`}
    >
      <div className={classes.messageContent}>
        {renderMessageContent()}
      </div>
      <div className={classes.messageTime}>
        {formatTime(message.timestamp)}
      </div>
    </div>
  );
}; 
import React, { useState, useRef, KeyboardEvent } from "react";
import classes from "./MessageInput.module.scss";
import SendIcon from "@/shared/assets/icons/send.svg";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled = false 
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className={classes.messageInput}>
      <div className={classes.inputContainer}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onInput={handleInput}
          placeholder={disabled ? "Подключение..." : "Введите сообщение..."}
          disabled={disabled}
          className={classes.textarea}
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          className={classes.sendButton}
          title="Отправить сообщение"
        >
          <SendIcon />
        </button>
      </div>
      <div className={classes.inputHint}>
        Нажмите Enter для отправки, Shift+Enter для новой строки
      </div>
    </div>
  );
}; 
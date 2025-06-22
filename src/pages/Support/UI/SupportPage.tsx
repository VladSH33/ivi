import React, { useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/StoreProvider/store";
import { 
  useSupportChat,
  ChatMessage,
  MessageInput,
  FileUpload,
  VoiceRecorder
} from "@/features/SupportChat";
import classes from "./SupportPage.module.scss";

export const SupportPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    connectionStatus,
    sendMessage,
    sendFile,
    sendVoiceMessage,
  } = useSupportChat(user?.id);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={classes.supportPage}>
      <div className={classes.header}>
        <h2>Поддержка</h2>
        <div className={classes.connectionStatus}>
          <div
            className={`${classes.statusIndicator} ${
              connectionStatus === "connected" ? classes.connected : classes.disconnected
            }`}
          />
          <span>
            {connectionStatus === "connected" ? "Подключено" : "Не подключено"}
          </span>
        </div>
      </div>

      <div className={classes.chatContainer}>
        <div className={classes.messagesContainer}>
          {messages.length === 0 ? (
            <div className={classes.welcomeMessage}>
              <p>Добро пожаловать в службу поддержки!</p>
              <p>Опишите вашу проблему, и мы поможем вам её решить.</p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={classes.inputSection}>
          <div className={classes.attachments}>
            <FileUpload onFileSelect={sendFile} />
            <VoiceRecorder onVoiceRecord={sendVoiceMessage} />
          </div>
          <MessageInput onSendMessage={sendMessage} disabled={connectionStatus !== "connected"} />
        </div>
      </div>
    </div>
  );
};

export default SupportPage; 
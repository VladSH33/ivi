import { useState, useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConnectionStatus } from "../types";
import { supportWebSocketService, useCreateOrGetChatMutation, useUploadFileMutation, useGetChatHistoryQuery } from "../api/supportWebSocketApi";
import { RootState } from "@/app/StoreProvider/store";
import { setChatId, addMessage, setMessages, setLoading } from "./chatSlice";

export const useSupportChat = (userId?: string) => {
  const dispatch = useDispatch();
  const { messages, chatId, isLoading } = useSelector((state: RootState) => state.supportChat);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  
  const [createOrGetChat] = useCreateOrGetChatMutation();
  const [uploadFile] = useUploadFileMutation();
  
  const isInitialized = useRef(false);
  
  const { data: chatHistory } = useGetChatHistoryQuery(chatId!, {
    skip: !chatId,
  });

  useEffect(() => {
    if (userId && !isInitialized.current) {
      isInitialized.current = true;
      initializeChat();
    }
  }, [userId]);

  useEffect(() => {
    if (chatId && userId && connectionStatus === 'disconnected') {
      supportWebSocketService.connect(userId, chatId);
    }
  }, [chatId, userId, connectionStatus]);

  const initializeChat = async () => {
    if (!userId) return;

    try {
      console.log('Initializing chat for user:', userId);
      dispatch(setLoading(true));
      
      const result = await createOrGetChat({ userId }).unwrap();
      console.log('Chat created/found:', result);
      dispatch(setChatId(result.id));
      
      supportWebSocketService.connect(userId, result.id);
    } catch (error) {
      console.error('Ошибка инициализации чата:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (chatHistory && chatHistory.length > 0) {
      dispatch(setMessages(chatHistory));
    }
  }, [chatHistory, dispatch]);

  useEffect(() => {
    const unsubscribeFromMessages = supportWebSocketService.onMessage((message) => {
      console.log('useSupportChat received message:', message);
      if (message.type === 'voice') {
        console.log('Voice message received with voiceDuration:', message.voiceDuration);
      }
      dispatch(addMessage(message));
    });

    const unsubscribeFromStatus = supportWebSocketService.onStatusChange((status) => {
      setConnectionStatus(status);
    });

    return () => {
      unsubscribeFromMessages();
      unsubscribeFromStatus();
    };
  }, []);

  useEffect(() => {
    return () => {
      supportWebSocketService.disconnect();
    };
  }, []);

  const sendMessage = useCallback((content: string) => {
    if (content.trim()) {
      supportWebSocketService.sendMessage(content.trim());
    }
  }, []);

  const sendFile = useCallback(async (file: File) => {
    if (!chatId || !userId) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('chatId', chatId);
      formData.append('userId', userId);

      const result = await uploadFile(formData).unwrap();
      
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type;
      
      supportWebSocketService.sendFile(fileUrl, file.name, fileType);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      const fileUrl = URL.createObjectURL(file);
      supportWebSocketService.sendFile(fileUrl, file.name, file.type);
    }
  }, [chatId, userId, uploadFile]);

  const sendVoiceMessage = useCallback(async (audioBlob: Blob, duration: number) => {
    console.log('useSupportChat.sendVoiceMessage called with duration:', duration);
    if (!chatId || !userId) return;

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-message.wav');
      formData.append('chatId', chatId);
      formData.append('userId', userId);

      const audioUrl = URL.createObjectURL(audioBlob);
      
      console.log('Calling supportWebSocketService.sendVoiceMessage with duration:', duration);
      supportWebSocketService.sendVoiceMessage(audioUrl, duration);
    } catch (error) {
      console.error('Ошибка отправки голосового сообщения:', error);
      const audioUrl = URL.createObjectURL(audioBlob);
      supportWebSocketService.sendVoiceMessage(audioUrl, duration);
    }
  }, [chatId, userId]);

  return {
    messages,
    connectionStatus,
    chatId,
    sendMessage,
    sendFile,
    sendVoiceMessage,
  };
}; 
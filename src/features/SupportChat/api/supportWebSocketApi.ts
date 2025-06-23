import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ChatMessage, SupportChat, WebSocketMessage, ConnectionStatus } from "../types";
import { BASE_URL } from "@/shared/config/environment";

export const supportWebSocketApi = createApi({
  reducerPath: "supportWebSocketApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
  }),
  tagTypes: ["ChatMessage", "SupportChat"],
  endpoints: (builder) => ({
    getChatHistory: builder.query<ChatMessage[], string>({
      query: (chatId) => `/api/support/chat/${chatId}/messages`,
      providesTags: ["ChatMessage"],
    }),
    createOrGetChat: builder.mutation<SupportChat, { userId: string }>({
      query: ({ userId }) => ({
        url: "/api/support/chat",
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: ["SupportChat"],
    }),
    uploadFile: builder.mutation<{ fileUrl: string; fileName: string }, FormData>({
      query: (formData) => ({
        url: "/api/support/upload",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetChatHistoryQuery,
  useCreateOrGetChatMutation,
  useUploadFileMutation,
} = supportWebSocketApi;

class SupportWebSocketService {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageListeners: Array<(message: ChatMessage) => void> = [];
  private statusListeners: Array<(status: ConnectionStatus) => void> = [];
  private currentStatus: ConnectionStatus = 'disconnected';
  private userId: string | null = null;
  private chatId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private wsUrl: string;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.wsUrl = 'ws://localhost:8080/ws/support';
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      this.wsUrl = `${protocol}//${host}/ws/support`;
    }
    
    console.log('WebSocket URL:', this.wsUrl);
  }

  connect(userId: string, chatId: string) {
    this.userId = userId;
    this.chatId = chatId;
    this.connectWebSocket();
  }

  private connectWebSocket() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.updateStatus('connecting');
    console.log(`Подключение к WebSocket... (попытка ${this.reconnectAttempts + 1})`);
    
    try {
      this.ws = new WebSocket(this.wsUrl);
      this.setupWebSocketHandlers();
    } catch (error) {
      console.error('Ошибка создания WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private setupWebSocketHandlers() {
    if (!this.ws) return;

    console.log('Настройка обработчиков WebSocket...');

    this.ws.onopen = () => {
      console.log('WebSocket подключен успешно!');
      this.updateStatus('connected');
      this.reconnectAttempts = 0;
      
      this.sendConnectionInfo();
      this.startPingPong();
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('Получено WebSocket сообщение:', message);
        this.handleWebSocketMessage(message);
      } catch (error) {
        console.error('❌ Ошибка парсинга WebSocket сообщения:', error);
      }
    };

    this.ws.onclose = (event) => {
      console.log('WebSocket соединение закрыто:', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
      
      this.updateStatus('disconnected');
      this.cleanup();
      
      if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ Ошибка WebSocket:', error);
      this.updateStatus('disconnected');
    };
  }

  private sendConnectionInfo() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    console.log('Отправляем информацию о подключении на сервер');
    
    const connectionMessage: WebSocketMessage = {
      type: 'user_joined',
      payload: {
        userId: this.userId!,
        chatId: this.chatId!,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
    };

    this.ws.send(JSON.stringify(connectionMessage));
  }

  private handleWebSocketMessage(message: WebSocketMessage) {
    console.log('Обработка WebSocket сообщения:', message.type);
    
    switch (message.type) {
      case 'message':
        if (message.payload) {
          console.log('Получено новое сообщение чата');
          this.notifyMessageListeners(message.payload as ChatMessage);
        }
        break;
      case 'pong':
        console.log('Получен pong от сервера');
        break;
      case 'user_joined':
        console.log('Пользователь присоединился:', message.payload);
        break;
      case 'user_left':
        console.log('Пользователь покинул чат:', message.payload);
        break;
      case 'typing':
        console.log('Пользователь печатает:', message.payload);
        break;
      default:
        console.log('Неизвестный тип сообщения:', message.type);
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Достигнуто максимальное количество попыток переподключения');
      this.updateStatus('disconnected');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`Переподключение через ${delay}ms (попытка ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connectWebSocket();
    }, delay);
  }

  private cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }



  private startPingPong() {
    console.log('Запуск ping/pong heartbeat');
    
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const pingMessage: WebSocketMessage = {
          type: 'ping',
          payload: {
            userId: this.userId,
            chatId: this.chatId,
          },
          timestamp: Date.now(),
        };
        
        console.log('Отправка ping на сервер');
        this.ws.send(JSON.stringify(pingMessage));
      } else {
        console.log('WebSocket не готов для ping, состояние:', this.ws?.readyState);
      }
    }, 30000);
  }

  private updateStatus(status: ConnectionStatus) {
    this.currentStatus = status;
    this.statusListeners.forEach(listener => listener(status));
  }

  sendMessage(content: string) {
    if (this.ws?.readyState === WebSocket.OPEN && this.userId && this.chatId) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: this.userId,
        chatId: this.chatId,
        content,
        type: 'text',
        timestamp: Date.now(),
        isFromSupport: false,
      };

      const message: WebSocketMessage = {
        type: 'message',
        payload: userMessage,
        timestamp: Date.now(),
      };

      console.log('Отправка текстового сообщения:', content);
      this.ws.send(JSON.stringify(message));
      
      this.notifyMessageListeners(userMessage);
    } else {
      console.error('WebSocket не готов для отправки сообщения:', {
        wsState: this.ws?.readyState,
        wsStateText: this.getWebSocketStateText(),
        userId: this.userId,
        chatId: this.chatId
      });
      throw new Error('Соединение с сервером потеряно');
    }
  }

  private getWebSocketStateText(): string {
    if (!this.ws) return 'null';
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING: return 'CONNECTING';
      case WebSocket.OPEN: return 'OPEN';
      case WebSocket.CLOSING: return 'CLOSING';
      case WebSocket.CLOSED: return 'CLOSED';
      default: return 'UNKNOWN';
    }
  }

  sendFile(fileUrl: string, fileName: string, fileType: string) {
    if (this.ws?.readyState === WebSocket.OPEN && this.userId && this.chatId) {
      const message: WebSocketMessage = {
        type: 'message',
        payload: {
          id: Date.now().toString(),
          userId: this.userId,
          chatId: this.chatId,
          content: `Файл: ${fileName}`,
          type: 'file',
          timestamp: Date.now(),
          isFromSupport: false,
          fileName,
          fileUrl,
          fileType,
        },
        timestamp: Date.now(),
      };

      this.ws.send(JSON.stringify(message));
      this.notifyMessageListeners(message.payload as ChatMessage);
    }
  }

  sendVoiceMessage(audioUrl: string, duration: number) {
    console.log('sendVoiceMessage called with duration:', duration);
    if (this.ws?.readyState === WebSocket.OPEN && this.userId && this.chatId) {
      const voiceMessage: ChatMessage = {
        id: Date.now().toString(),
        userId: this.userId,
        chatId: this.chatId,
        content: 'Голосовое сообщение',
        type: 'voice',
        timestamp: Date.now(),
        isFromSupport: false,
        fileUrl: audioUrl,
        voiceDuration: duration,
      };
      
      console.log('Created voice message:', voiceMessage);
      console.log('voiceDuration in created message:', voiceMessage.voiceDuration);
      
      const message: WebSocketMessage = {
        type: 'message',
        payload: voiceMessage,
        timestamp: Date.now(),
      };

      this.ws.send(JSON.stringify(message));
      this.notifyMessageListeners(voiceMessage);
    }
  }

  onMessage(listener: (message: ChatMessage) => void) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  onStatusChange(listener: (status: ConnectionStatus) => void) {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private notifyMessageListeners(message: ChatMessage) {
    console.log('notifyMessageListeners called with:', message);
    console.log('voiceDuration in notifyMessageListeners:', message.voiceDuration);
    console.log('Number of listeners:', this.messageListeners.length);
    this.messageListeners.forEach((listener, index) => {
      console.log(`Calling listener ${index} with voiceDuration:`, message.voiceDuration);
      listener(message);
    });
  }

  disconnect() {
    console.log('Отключение от WebSocket...');
    
    this.cleanup();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) { 
      if (this.ws.readyState === WebSocket.OPEN) {
        const leaveMessage: WebSocketMessage = {
          type: 'user_left',
          payload: {
            userId: this.userId,
            chatId: this.chatId,
          },
          timestamp: Date.now(),
        };
        
        console.log('Отправка уведомления о выходе');
        this.ws.send(JSON.stringify(leaveMessage));
      }
      
      this.ws.close(1000, 'User disconnected');
      this.ws = null;
    }

    this.updateStatus('disconnected');
    console.log('WebSocket отключен');
  }

  getStatus() {
    return this.currentStatus;
  }
}

export const supportWebSocketService = new SupportWebSocketService(); 
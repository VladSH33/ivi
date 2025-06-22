import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage } from '../types';

interface ChatState {
  messages: ChatMessage[];
  chatId: string | null;
  isLoading: boolean;
}

const loadStateFromStorage = (): ChatState => {
  try {
    const savedState = localStorage.getItem('supportChatState');
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Ошибка загрузки состояния чата из localStorage:', error);
  }
  return {
    messages: [],
    chatId: null,
    isLoading: false,
  };
};

const saveStateToStorage = (state: ChatState) => {
  try {
    localStorage.setItem('supportChatState', JSON.stringify({
      messages: state.messages,
      chatId: state.chatId,
      isLoading: false,
    }));
  } catch (error) {
    console.error('Ошибка сохранения состояния чата в localStorage:', error);
  }
};

const initialState: ChatState = loadStateFromStorage();

const chatSlice = createSlice({
  name: 'supportChat',
  initialState,
  reducers: {
    setChatId: (state, action: PayloadAction<string>) => {
      state.chatId = action.payload;
      saveStateToStorage(state);
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const existingMessage = state.messages.find(msg => msg.id === action.payload.id);
      if (!existingMessage) {
        state.messages.push(action.payload);
        saveStateToStorage(state);
      }
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
      saveStateToStorage(state);
    },
    clearMessages: (state) => {
      state.messages = [];
      saveStateToStorage(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetChat: (state) => {
      state.messages = [];
      state.chatId = null;
      state.isLoading = false;
      saveStateToStorage(state);
    },
  },
});

export const { 
  setChatId, 
  addMessage, 
  setMessages, 
  clearMessages, 
  setLoading, 
  resetChat 
} = chatSlice.actions;

export default chatSlice.reducer; 
const WebSocket = require('ws');

const wss = new WebSocket.Server({ 
  port: 8080,
  path: '/ws/support'
});

console.log('WebSocket сервер запущен на ws://localhost:8080/ws/support');

const activeConnections = new Map();

wss.on('connection', (ws, req) => {
  console.log('Новое подключение:', req.socket.remoteAddress);
  
  let userId = null;
  let chatId = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log('Получено сообщение:', message.type);

      switch (message.type) {
        case 'user_joined':
          userId = message.payload.userId;
          chatId = message.payload.chatId;
          
          activeConnections.set(ws, { userId, chatId });
          
          console.log(`Пользователь ${userId} присоединился к чату ${chatId}`);
          console.log(`Активных соединений: ${activeConnections.size}`);
          
          setTimeout(() => {
            const welcomeMessage = {
              type: 'message',
              payload: {
                id: Date.now().toString(),
                userId: 'support',
                chatId: chatId,
                content: 'Здравствуйте! Я оператор службы поддержки. Чем могу помочь?',
                type: 'text',
                timestamp: Date.now(),
                isFromSupport: true,
              },
              timestamp: Date.now(),
            };
            
            ws.send(JSON.stringify(welcomeMessage));
            console.log('Отправлено приветствие поддержки');
          }, 2000);
          break;

        case 'ping':
          console.log('Ping от клиента, отправляем pong');
          ws.send(JSON.stringify({
            type: 'pong',
            payload: {
              userId: message.payload.userId,
              chatId: message.payload.chatId,
            },
            timestamp: Date.now(),
          }));
          break;

        case 'message':
          console.log(`Сообщение от ${message.payload.userId}: ${message.payload.content}`);
          
          setTimeout(() => {
            const responses = [
              'Благодарю за обращение. Рассматриваю ваш вопрос.',
              'Понятно. Сейчас проверю информацию по вашей проблеме.',
              'Я передал ваше обращение специалисту. Ожидайте ответа.',
              'Мы работаем над решением вашего вопроса.',
              'Спасибо за предоставленную информацию.',
              'Можете предоставить больше деталей о проблеме?',
              'Попробуйте перезагрузить страницу и повторить действие.',
              'Ваш запрос обрабатывается. Это займет несколько минут.',
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const supportMessage = {
              type: 'message',
              payload: {
                id: Date.now().toString(),
                userId: 'support',
                chatId: message.payload.chatId,
                content: randomResponse,
                type: 'text',
                timestamp: Date.now(),
                isFromSupport: true,
              },
              timestamp: Date.now(),
            };

            ws.send(JSON.stringify(supportMessage));
            console.log(`Ответ поддержки: ${randomResponse}`);
          }, 1500 + Math.random() * 3000);
          break;

        case 'user_left':
          console.log(`Пользователь ${message.payload.userId} покинул чат`);
          break;

        default:
          console.log('Неизвестный тип сообщения:', message.type);
      }
    } catch (error) {
      console.error('❌ Ошибка парсинга сообщения:', error);
    }
  });

  ws.on('close', (code, reason) => {
    console.log(`Соединение закрыто: ${code} ${reason}`);
    
    if (activeConnections.has(ws)) {
      const connection = activeConnections.get(ws);
      console.log(`Пользователь ${connection.userId} отключился`);
      activeConnections.delete(ws);
    }
    
    console.log(`Активных соединений: ${activeConnections.size}`);
  });

  ws.on('error', (error) => {
    console.error('Ошибка WebSocket:', error);
  });

  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(pingInterval);
    }
  }, 30000);
});

process.on('SIGINT', () => {
  console.log('\nОстановка сервера...');
  wss.close(() => {
    console.log('WebSocket сервер остановлен');
    process.exit(0);
  });
});

console.log('Для остановки нажмите Ctrl+C');
console.log('Подключайтесь к ws://localhost:8080/ws/support'); 
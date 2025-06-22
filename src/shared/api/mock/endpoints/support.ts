import { Server, Response } from "miragejs";

export function supportEndpoints(server: Server) {
  server.post("/api/support/chat", (schema, request) => {
    const { userId } = JSON.parse(request.requestBody);
    
    let existingChat = schema.db.supportChats.findBy({ userId, status: "active" }) ||
                      schema.db.supportChats.findBy({ userId, status: "waiting" });
    
    if (existingChat) {
      return new Response(200, {}, existingChat);
    }

    const newChat = server.create("supportChat", {
      id: `chat_${Date.now()}`,
      userId,
      status: "waiting",
      createdAt: Date.now(),
      lastMessageAt: Date.now(),
    });

    return new Response(201, {}, newChat);
  });

  server.get("/api/support/chat/:chatId/messages", (schema, request) => {
    const { chatId } = request.params;
    
    const messages = schema.db.supportMessages.where({ chatId })
      .sort((a: any, b: any) => a.timestamp - b.timestamp);

    return new Response(200, {}, messages);
  });

  server.post("/api/support/upload", (schema, request) => {
    const fileName = `file_${Date.now()}.txt`;
    const fileUrl = `/uploads/${fileName}`;
    
    return new Response(200, {}, {
      fileUrl,
      fileName,
      fileSize: 1024,
      fileType: "text/plain",
    });
  });

  server.get("/api/support/active-connections", (schema, request) => {
    const activeChats = schema.db.supportChats.where({ status: "active" });
    
    return new Response(200, {}, {
      activeConnections: activeChats.length,
      chats: activeChats
    });
  });

  server.patch("/api/support/chat/:chatId", (schema, request) => {
    const { chatId } = request.params;
    const { status } = JSON.parse(request.requestBody);
    
    const chat = schema.db.supportChats.findBy({ id: chatId });
    
    if (!chat) {
      return new Response(404, {}, { error: "Чат не найден" });
    }

    chat.update({ status, lastMessageAt: Date.now() });
    
    return new Response(200, {}, chat);
  });
}
import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from "socket.io";
import { storage } from "./storage";
import { hashPassword, comparePassword, generateToken, authenticate } from "./auth";
import { body, validationResult } from "express-validator";
import { loginUserSchema, registerUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rotas de autenticação
  
  // Registro de usuário
  app.post(
    "/api/auth/register", 
    [
      body("email").isEmail().withMessage("Email inválido"),
      body("email").custom(value => {
        if (!value.endsWith("@gmail.com")) {
          throw new Error("Apenas emails do Gmail são permitidos (@gmail.com)");
        }
        return true;
      }),
      body("password").isLength({ min: 6 }).withMessage("Senha deve ter no mínimo 6 caracteres"),
      body("name").notEmpty().withMessage("Nome é obrigatório"),
    ],
    async (req, res) => {
      try {
        // Validar entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        // Verificar se email já existe
        const existingUser = await storage.getUserByEmail(req.body.email);
        if (existingUser) {
          return res.status(400).json({ message: "Email já cadastrado" });
        }
        
        // Hash da senha
        const hashedPassword = await hashPassword(req.body.password);
        
        // Criar usuário
        const user = await storage.createUser({
          ...req.body,
          password: hashedPassword
        });
        
        // Atualizar status para online
        await storage.updateUserStatus(user.id, true);
        
        // Gerar token JWT
        const token = generateToken(user);
        
        // Retornar token e dados do usuário (sem a senha)
        const { password, ...userData } = user;
        
        res.status(201).json({
          token,
          user: userData
        });
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  );
  
  // Login de usuário
  app.post(
    "/api/auth/login",
    [
      body("email").isEmail().withMessage("Email inválido"),
      body("password").notEmpty().withMessage("Senha é obrigatória"),
    ],
    async (req, res) => {
      try {
        // Validar entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        
        // Buscar usuário pelo email
        const user = await storage.getUserByEmail(req.body.email);
        if (!user) {
          return res.status(401).json({ message: "Credenciais inválidas" });
        }
        
        // Verificar senha
        const isPasswordValid = await comparePassword(req.body.password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Credenciais inválidas" });
        }
        
        // Atualizar status para online
        await storage.updateUserStatus(user.id, true);
        
        // Gerar token JWT
        const token = generateToken(user);
        
        // Retornar token e dados do usuário (sem a senha)
        const { password, ...userData } = user;
        
        res.json({
          token,
          user: userData
        });
      } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.status(500).json({ message: "Erro interno do servidor" });
      }
    }
  );
  
  // Rota para obter dados do usuário atual
  app.get("/api/auth/user", authenticate, (req, res) => {
    // O middleware authenticate já adiciona o usuário à requisição
    const { password, ...userData } = req.user!;
    res.json(userData);
  });
  
  // Rota para logout (apenas marca como offline no banco)
  app.post("/api/auth/logout", authenticate, async (req, res) => {
    try {
      await storage.updateUserStatus(req.user!.id, false);
      res.json({ message: "Logout realizado com sucesso" });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  
  // Rota para obter todos os usuários (para testes)
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remover senhas dos usuários
      const usersWithoutPasswords = users.map(({ password, ...userData }) => userData);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  // API endpoints
  app.get("/api/posts", (req, res) => {
    res.json({
      posts: [
        {
          id: 1,
          author: {
            id: 2,
            name: "Carlos Oliveira",
            username: "@carlosoliveira",
            avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
          },
          content: "Compartilhando algumas fotos da minha viagem ao litoral este final de semana. A vista estava incrível! 🌊 🏖️ #FimDeSemana #Praia",
          image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
          timeAgo: "10h",
          likes: 128,
          comments: 24,
          shares: 3,
        },
        {
          id: 2,
          author: {
            id: 3,
            name: "Julia Santos",
            username: "@juliasantos",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
          },
          content: "Acabei de ler um livro incrível sobre desenvolvimento pessoal e queria compartilhar algumas reflexões...\n\nA principal lição que aprendi é que pequenas mudanças diárias podem trazer resultados extraordinários ao longo do tempo. Vocês já leram algum livro que mudou sua perspectiva sobre a vida? 📚 #DesenvolvimentoPessoal #Leitura",
          timeAgo: "18h",
          likes: 89,
          comments: 42,
          shares: 7,
        }
      ]
    });
  });

  app.get("/api/stories", (req, res) => {
    res.json({
      stories: [
        {
          id: 1,
          username: "Seu story",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
          isOwn: true,
        },
        {
          id: 2,
          username: "Pedro",
          avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
        },
        {
          id: 3,
          username: "Carlos",
          avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
        },
        {
          id: 4,
          username: "Ana",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
        },
        {
          id: 5,
          username: "Rafael",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
        },
        {
          id: 6,
          username: "Julia",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&h=128&q=80",
        }
      ]
    });
  });

  app.get("/api/trading-tops", (req, res) => {
    res.json({
      tradingTops: [
        {
          id: 1,
          topic: "Marketing Digital",
          hashtag: "#MarketingTips",
          avatar: "https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=85&h=85&q=80"
        },
        {
          id: 2,
          topic: "Tecnologia",
          hashtag: "#Inovação",
          avatar: "https://images.unsplash.com/photo-1602934585418-f588bea4215c?ixlib=rb-1.2.1&auto=format&fit=crop&w=85&h=85&q=80"
        },
        {
          id: 3,
          topic: "Empreendedorismo",
          hashtag: "#Business",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=85&h=85&q=80"
        },
        {
          id: 4,
          topic: "Desenvolvimento Pessoal",
          hashtag: "#Mindset",
          avatar: "https://images.unsplash.com/photo-1485217988980-11786ced9454?ixlib=rb-1.2.1&auto=format&fit=crop&w=85&h=85&q=80"
        }
      ]
    });
  });

  // Lista de sugestões de amizade com estado interno - será usada apenas para inicialização
  let friendSuggestions = [
    {
      id: 1,
      name: "Ricardo Fernandes",
      commonFriends: 12,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=85&h=85&q=80",
      status: "pending" // pending, accepted, rejected
    },
    {
      id: 2,
      name: "Mariana Costa",
      commonFriends: 8,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=85&h=85&q=80",
      status: "pending"
    },
    {
      id: 3,
      name: "Eduardo Dias",
      commonFriends: 15,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=85&h=85&q=80",
      status: "pending"
    },
    {
      id: 4,
      name: "Camila Rocha",
      commonFriends: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=85&h=85&q=80",
      status: "pending"
    },
    {
      id: 5,
      name: "Rafael Sousa",
      commonFriends: 7,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.25&w=85&h=85&q=80",
      status: "pending"
    }
  ];

  // Endpoint para obter sugestões de amizade (com dados reais)
  app.get("/api/friend-suggestions", authenticate, async (req: any, res) => {
    try {
      // Obter todos os usuários
      const allUsers = await storage.getAllUsers();
      
      // Obter o usuário autenticado
      const currentUser = await storage.getUser(req.user.id);
      
      if (!currentUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Filtrar usuários que não são amigos e não têm solicitações pendentes
      const possibleSuggestions = allUsers.filter(user => {
        // Remover o próprio usuário
        if (user.id === currentUser.id) {
          return false;
        }
        
        // Remover usuários que já são amigos
        if (currentUser.friendIds?.includes(user.id)) {
          return false;
        }
        
        // Remover usuários que já têm solicitações pendentes
        if (currentUser.pendingFriendIds?.includes(user.id) || user.pendingFriendIds?.includes(currentUser.id)) {
          return false;
        }
        
        return true;
      });
      
      // Converter para o formato esperado pelo cliente
      const suggestions = possibleSuggestions.map(user => {
        // Gerar um número aleatório de amigos em comum (para demonstração)
        const commonFriends = Math.floor(Math.random() * 20);
        
        return {
          id: user.id,
          name: user.name,
          commonFriends: commonFriends,
          avatar: user.avatar,
          status: "pending" // Sempre pendente neste caso
        };
      });
      
      // Retornar apenas sugestões pendentes
      res.json({
        friendSuggestions: suggestions
      });
    } catch (error) {
      console.error("Erro ao obter sugestões de amizade:", error);
      res.status(500).json({ message: "Erro ao obter sugestões de amizade" });
    }
  });
  
  // Endpoint para aceitar uma sugestão de amizade
  app.post("/api/friend-suggestions/:id/accept", authenticate, async (req: any, res) => {
    try {
      const friendId = parseInt(req.params.id);
      
      if (isNaN(friendId)) {
        return res.status(400).json({ message: "ID de usuário inválido" });
      }
      
      // Tentar enviar solicitação de amizade
      const requestSuccess = await storage.sendFriendRequest(req.user.id, friendId);
      
      if (!requestSuccess) {
        return res.status(400).json({ message: "Não foi possível enviar a solicitação" });
      }
      
      // Aceitar automaticamente (para o exemplo)
      const acceptSuccess = await storage.acceptFriendRequest(friendId, req.user.id);
      
      if (!acceptSuccess) {
        return res.status(400).json({ message: "Não foi possível aceitar a solicitação" });
      }
      
      res.json({
        success: true,
        message: "Amizade criada com sucesso"
      });
    } catch (error) {
      console.error("Erro ao aceitar sugestão de amizade:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  
  // Endpoint para recusar uma sugestão de amizade
  app.post("/api/friend-suggestions/:id/reject", authenticate, async (req: any, res) => {
    try {
      // Não fazemos nada, apenas marcamos como sucesso pois é uma sugestão
      // Em um sistema real, poderíamos manter uma lista de usuários rejeitados
      
      res.json({
        success: true,
        message: "Sugestão de amizade rejeitada"
      });
    } catch (error) {
      console.error("Erro ao rejeitar sugestão de amizade:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Rotas para gerenciar amizades reais
  
  // Rota para pesquisar usuários
  app.get("/api/users/search", authenticate, async (req: any, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "O parâmetro de pesquisa 'q' é obrigatório" });
      }
      
      const users = await storage.searchUsers(query);
      
      // Remover informações sensíveis
      const sanitizedUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.json(sanitizedUsers);
    } catch (error) {
      console.error("Erro ao pesquisar usuários:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Rota para obter amigos do usuário
  app.get("/api/users/friends", authenticate, async (req: any, res) => {
    try {
      const friends = await storage.getUserFriends(req.user.id);
      
      // Remover informações sensíveis
      const sanitizedFriends = friends.map(friend => {
        const { password, ...friendWithoutPassword } = friend;
        return friendWithoutPassword;
      });
      
      res.json(sanitizedFriends);
    } catch (error) {
      console.error("Erro ao obter amigos:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Rota para obter solicitações pendentes
  app.get("/api/users/pending-friends", authenticate, async (req: any, res) => {
    try {
      const pendingFriends = await storage.getUserPendingFriends(req.user.id);
      
      // Remover informações sensíveis
      const sanitizedPendingFriends = pendingFriends.map(friend => {
        const { password, ...friendWithoutPassword } = friend;
        return friendWithoutPassword;
      });
      
      res.json(sanitizedPendingFriends);
    } catch (error) {
      console.error("Erro ao obter solicitações pendentes:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Rota para enviar solicitação de amizade
  app.post("/api/users/:userId/friend-request", authenticate, async (req: any, res) => {
    try {
      const receiverId = parseInt(req.params.userId);
      
      if (isNaN(receiverId)) {
        return res.status(400).json({ message: "ID de usuário inválido" });
      }
      
      if (receiverId === req.user.id) {
        return res.status(400).json({ message: "Não é possível enviar solicitação para si mesmo" });
      }
      
      const success = await storage.sendFriendRequest(req.user.id, receiverId);
      
      if (!success) {
        return res.status(400).json({ message: "Não foi possível enviar a solicitação" });
      }
      
      res.json({ message: "Solicitação de amizade enviada com sucesso" });
    } catch (error) {
      console.error("Erro ao enviar solicitação de amizade:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Rota para aceitar solicitação de amizade
  app.post("/api/users/:userId/accept-friend", authenticate, async (req: any, res) => {
    try {
      const friendId = parseInt(req.params.userId);
      
      if (isNaN(friendId)) {
        return res.status(400).json({ message: "ID de usuário inválido" });
      }
      
      const success = await storage.acceptFriendRequest(req.user.id, friendId);
      
      if (!success) {
        return res.status(400).json({ message: "Não foi possível aceitar a solicitação" });
      }
      
      res.json({ message: "Solicitação de amizade aceita com sucesso" });
    } catch (error) {
      console.error("Erro ao aceitar solicitação de amizade:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Rota para rejeitar solicitação de amizade
  app.post("/api/users/:userId/reject-friend", authenticate, async (req: any, res) => {
    try {
      const friendId = parseInt(req.params.userId);
      
      if (isNaN(friendId)) {
        return res.status(400).json({ message: "ID de usuário inválido" });
      }
      
      const success = await storage.rejectFriendRequest(req.user.id, friendId);
      
      if (!success) {
        return res.status(400).json({ message: "Não foi possível rejeitar a solicitação" });
      }
      
      res.json({ message: "Solicitação de amizade rejeitada com sucesso" });
    } catch (error) {
      console.error("Erro ao rejeitar solicitação de amizade:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Rota para atualizar perfil do usuário
  app.patch("/api/users/profile", authenticate, async (req: any, res) => {
    try {
      const { bio, location, avatar } = req.body;
      
      const updatedUser = await storage.updateUserProfile(req.user.id, {
        bio,
        location,
        avatar
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Remover informações sensíveis
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });
  
  // Rota para obter perfil de um usuário específico
  app.get("/api/users/:userId", authenticate, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "ID de usuário inválido" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      // Remover informações sensíveis
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Erro ao obter usuário:", error);
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  const httpServer = createServer(app);
  
  // Configuração do Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  
  // Lista de mensagens em memória
  const chatMessages: {
    id: string;
    sender: string;
    receiver: string;
    content: string;
    timestamp: number;
    read: boolean;
    type: 'text' | 'image' | 'emoji';
  }[] = [];
  
  // Lista de usuários conectados
  const onlineUsers = new Map<string, string>(); // userId -> socketId
  
  // Evento de conexão do socket
  io.on("connection", (socket) => {
    console.log("Novo usuário conectado:", socket.id);
    
    // Evento de login do usuário
    socket.on("user_login", async (userId: string) => {
      console.log(`Usuário ${userId} logado no socket ${socket.id}`);
      onlineUsers.set(userId, socket.id);
      
      // Atualizar status online no banco de dados
      try {
        const userIdNum = parseInt(userId);
        if (!isNaN(userIdNum)) {
          await storage.updateUserStatus(userIdNum, true);
        }
      } catch (error) {
        console.error("Erro ao atualizar status do usuário:", error);
      }
      
      // Notificar outros usuários que este usuário está online
      socket.broadcast.emit("user_status_changed", { userId, status: "online" });
      
      // Enviar mensagens não lidas para o usuário que acabou de conectar
      const unreadMessages = chatMessages.filter(
        msg => msg.receiver === userId && !msg.read
      );
      
      if (unreadMessages.length > 0) {
        socket.emit("unread_messages", unreadMessages);
      }
    });
    
    // Evento de envio de mensagem
    socket.on("send_message", (message: {
      sender: string;
      receiver: string;
      content: string;
      type: 'text' | 'image' | 'emoji';
    }) => {
      const newMessage = {
        id: Date.now().toString(),
        ...message,
        timestamp: Date.now(),
        read: false
      };
      
      // Guardar mensagem
      chatMessages.push(newMessage);
      
      // Enviar para o destinatário, se estiver online
      const receiverSocketId = onlineUsers.get(message.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", newMessage);
      }
      
      // Confirmar para o remetente
      socket.emit("message_sent", {
        messageId: newMessage.id,
        timestamp: newMessage.timestamp
      });
    });
    
    // Evento de marcação de mensagem como lida
    socket.on("mark_as_read", (messageIds: string[]) => {
      messageIds.forEach(id => {
        const message = chatMessages.find(msg => msg.id === id);
        if (message) {
          message.read = true;
        }
      });
      
      // Notificar o remetente original que suas mensagens foram lidas
      const messagesById = messageIds.map(id => chatMessages.find(msg => msg.id === id)).filter(Boolean) as {
        id: string;
        sender: string;
        receiver: string;
        content: string;
        timestamp: number;
        read: boolean;
        type: 'text' | 'image' | 'emoji';
      }[];
      
      if (messagesById.length > 0) {
        // Obter lista de remetentes únicos
        const senderIds: string[] = [];
        messagesById.forEach(msg => {
          if (msg.sender && !senderIds.includes(msg.sender)) {
            senderIds.push(msg.sender);
          }
        });
        
        senderIds.forEach(senderId => {
          const senderSocketId = onlineUsers.get(senderId);
          if (senderSocketId) {
            const readMessageIds = messagesById
              .filter(msg => msg.sender === senderId)
              .map(msg => msg.id)
              .filter(Boolean);
            
            io.to(senderSocketId).emit("messages_read", readMessageIds);
          }
        });
      }
    });
    
    // Evento de digitando
    socket.on("typing", ({ userId, receiverId }: { userId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_typing", { userId });
      }
    });
    
    // Evento de parou de digitar
    socket.on("stop_typing", ({ userId, receiverId }: { userId: string; receiverId: string }) => {
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("user_stop_typing", { userId });
      }
    });
    
    // Evento de desconexão
    socket.on("disconnect", async () => {
      console.log("Usuário desconectado:", socket.id);
      
      // Encontrar o userId pelo socketId e remover do Map
      let disconnectedUserId: string | undefined;
      
      onlineUsers.forEach((socketId, userId) => {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
        }
      });
      
      if (disconnectedUserId) {
        onlineUsers.delete(disconnectedUserId);
        
        // Atualizar status offline no banco de dados
        try {
          const userIdNum = parseInt(disconnectedUserId);
          if (!isNaN(userIdNum)) {
            await storage.updateUserStatus(userIdNum, false);
            await storage.updateLastSeen(userIdNum, new Date());
          }
        } catch (error) {
          console.error("Erro ao atualizar status do usuário desconectado:", error);
        }
        
        // Notificar outros usuários que este usuário está offline
        socket.broadcast.emit("user_status_changed", {
          userId: disconnectedUserId,
          status: "offline"
        });
      }
    });
  });
  
  // Endpoint para obter amigos/contatos (usando dados reais do banco)
  app.get("/api/chat/contacts", authenticate, async (req: any, res) => {
    try {
      // Obter amigos do usuário
      const friends = await storage.getUserFriends(req.user.id);
      
      // Converter para o formato esperado pelo cliente
      const contacts = friends.map(friend => {
        const { password, ...friendData } = friend;
        return {
          id: friendData.id.toString(),
          name: friendData.name,
          avatar: friendData.avatar,
          status: friendData.isOnline ? "online" : "offline",
          lastSeen: friendData.lastSeen ? friendData.lastSeen.toISOString() : new Date().toISOString()
        };
      });
      
      res.json({ contacts });
    } catch (error) {
      console.error("Erro ao obter contatos:", error);
      res.status(500).json({ message: "Erro ao obter contatos" });
    }
  });
  
  // Endpoint para obter histórico de mensagens
  app.get("/api/chat/messages/:userId/:contactId", authenticate, (req: any, res) => {
    const { userId, contactId } = req.params;
    
    // Verificar se o userId corresponde ao usuário autenticado
    if (req.user.id.toString() !== userId) {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }
    
    // Obter mensagens entre os dois usuários
    const messages = chatMessages.filter(
      msg => 
        (msg.sender === userId && msg.receiver === contactId) || 
        (msg.sender === contactId && msg.receiver === userId)
    ).sort((a, b) => a.timestamp - b.timestamp);
    
    res.json({ messages });
  });

  return httpServer;
}

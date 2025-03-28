import { users, type User, type InsertUser } from "@shared/schema";
import { hashPassword } from "./auth";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserStatus(id: number, isOnline: boolean): Promise<User | undefined>;
  updateLastSeen(id: number, lastSeen: Date): Promise<User | undefined>;
  searchUsers(query: string): Promise<User[]>;
  getUserFriends(userId: number): Promise<User[]>;
  getUserPendingFriends(userId: number): Promise<User[]>;
  sendFriendRequest(senderId: number, receiverId: number): Promise<boolean>;
  acceptFriendRequest(userId: number, friendId: number): Promise<boolean>;
  rejectFriendRequest(userId: number, friendId: number): Promise<boolean>;
  updateUserProfile(userId: number, data: { bio?: string, location?: string, avatar?: string }): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    
    // Adicionar alguns usuários de exemplo (apenas para desenvolvimento)
    this.initializeUsers();
  }

  private async initializeUsers() {
    // Adicionar usuários de exemplo com senhas hasheadas
    const hashedPassword = await hashPassword("123456");
    
    const user1: User = {
      id: this.currentId++,
      email: "usuario1@gmail.com",
      name: "Usuário Exemplo 1",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      bio: "Olá! Eu sou o primeiro usuário de exemplo.",
      location: "São Paulo, Brasil",
      friendIds: [],
      pendingFriendIds: []
    };
    
    const user2: User = {
      id: this.currentId++,
      email: "usuario2@gmail.com",
      name: "Usuário Exemplo 2",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      bio: "Olá! Eu sou o segundo usuário de exemplo.",
      location: "Rio de Janeiro, Brasil",
      friendIds: [],
      pendingFriendIds: []
    };
    
    // Adicionar mais alguns usuários
    const user3: User = {
      id: this.currentId++,
      email: "maria@gmail.com",
      name: "Maria Silva",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      bio: "Olá! Sou a Maria e adoro viajar.",
      location: "Belo Horizonte, Brasil",
      friendIds: [],
      pendingFriendIds: []
    };
    
    const user4: User = {
      id: this.currentId++,
      email: "joao@gmail.com",
      name: "João Oliveira",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      bio: "Entusiasta de tecnologia e fotografia.",
      location: "Curitiba, Brasil",
      friendIds: [],
      pendingFriendIds: []
    };
    
    const user5: User = {
      id: this.currentId++,
      email: "ana@gmail.com",
      name: "Ana Luiza Ferreira",
      password: hashedPassword,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      isOnline: false,
      lastSeen: new Date(),
      createdAt: new Date(),
      bio: "Adoro música, livros e programação!",
      location: "Recife, Brasil",
      friendIds: [],
      pendingFriendIds: []
    };
    
    // Adicionar usuários ao Map
    this.users.set(user1.id, user1);
    this.users.set(user2.id, user2);
    this.users.set(user3.id, user3);
    this.users.set(user4.id, user4);
    this.users.set(user5.id, user5);
    
    // Criar algumas amizades de exemplo
    if (user1.friendIds && user2.friendIds) {
      user1.friendIds.push(user2.id);
      user2.friendIds.push(user1.id);
    }
    
    if (user3.friendIds && user4.friendIds) {
      user3.friendIds.push(user4.id);
      user4.friendIds.push(user3.id);
    }
    
    // Criar algumas solicitações pendentes
    if (user1.pendingFriendIds && user3.pendingFriendIds && user5.pendingFriendIds) {
      user1.pendingFriendIds.push(user3.id);
      user3.pendingFriendIds.push(user5.id);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    
    // Criar o usuário com os campos adicionais
    const now = new Date();
    
    // Garantir que avatar nunca seja undefined
    const avatar = insertUser.avatar || null;
    
    const user: User = { 
      ...insertUser,
      avatar,
      id, 
      isOnline: true,
      lastSeen: now,
      createdAt: now,
      bio: "",
      location: "",
      friendIds: [],
      pendingFriendIds: []
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async updateUserStatus(id: number, isOnline: boolean): Promise<User | undefined> {
    const user = this.users.get(id);
    
    if (!user) {
      return undefined;
    }
    
    // Atualizar status e last seen
    const updatedUser = { 
      ...user, 
      isOnline,
      lastSeen: new Date() 
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateLastSeen(id: number, lastSeen: Date): Promise<User | undefined> {
    const user = this.users.get(id);
    
    if (!user) {
      return undefined;
    }
    
    // Atualizar last seen
    const updatedUser = { ...user, lastSeen };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async searchUsers(query: string): Promise<User[]> {
    if (!query || query.trim() === '') {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    return Array.from(this.users.values()).filter(user => 
      user.name.toLowerCase().includes(normalizedQuery) || 
      user.email.toLowerCase().includes(normalizedQuery)
    );
  }

  async getUserFriends(userId: number): Promise<User[]> {
    const user = this.users.get(userId);
    
    if (!user || !user.friendIds || user.friendIds.length === 0) {
      return [];
    }
    
    return Array.from(this.users.values()).filter(u => 
      user.friendIds?.includes(u.id)
    );
  }

  async getUserPendingFriends(userId: number): Promise<User[]> {
    const user = this.users.get(userId);
    
    if (!user || !user.pendingFriendIds || user.pendingFriendIds.length === 0) {
      return [];
    }
    
    return Array.from(this.users.values()).filter(u => 
      user.pendingFriendIds?.includes(u.id)
    );
  }

  async sendFriendRequest(senderId: number, receiverId: number): Promise<boolean> {
    const sender = this.users.get(senderId);
    const receiver = this.users.get(receiverId);
    
    if (!sender || !receiver) {
      return false;
    }
    
    // Verificar se já são amigos
    if (sender.friendIds?.includes(receiverId) || receiver.friendIds?.includes(senderId)) {
      return false;
    }
    
    // Verificar se já existe uma solicitação pendente
    if (receiver.pendingFriendIds?.includes(senderId)) {
      return false;
    }
    
    // Adicionar à lista de pendentes do receptor
    if (!receiver.pendingFriendIds) {
      receiver.pendingFriendIds = [];
    }
    receiver.pendingFriendIds.push(senderId);
    
    // Atualizar no Map
    this.users.set(receiverId, receiver);
    
    return true;
  }

  async acceptFriendRequest(userId: number, friendId: number): Promise<boolean> {
    const user = this.users.get(userId);
    const friend = this.users.get(friendId);
    
    if (!user || !friend) {
      return false;
    }
    
    // Verificar se existe uma solicitação pendente
    if (!user.pendingFriendIds?.includes(friendId)) {
      return false;
    }
    
    // Remover da lista de pendentes
    if (user.pendingFriendIds) {
      user.pendingFriendIds = user.pendingFriendIds.filter(id => id !== friendId);
    }
    
    // Adicionar às listas de amigos
    if (!user.friendIds) {
      user.friendIds = [];
    }
    if (!friend.friendIds) {
      friend.friendIds = [];
    }
    
    user.friendIds.push(friendId);
    friend.friendIds.push(userId);
    
    // Atualizar no Map
    this.users.set(userId, user);
    this.users.set(friendId, friend);
    
    return true;
  }

  async rejectFriendRequest(userId: number, friendId: number): Promise<boolean> {
    const user = this.users.get(userId);
    
    if (!user) {
      return false;
    }
    
    // Verificar se existe uma solicitação pendente
    if (!user.pendingFriendIds?.includes(friendId)) {
      return false;
    }
    
    // Remover da lista de pendentes
    if (user.pendingFriendIds) {
      user.pendingFriendIds = user.pendingFriendIds.filter(id => id !== friendId);
    }
    
    // Atualizar no Map
    this.users.set(userId, user);
    
    return true;
  }

  async updateUserProfile(userId: number, data: { bio?: string, location?: string, avatar?: string }): Promise<User | undefined> {
    const user = this.users.get(userId);
    
    if (!user) {
      return undefined;
    }
    
    // Atualizar dados do perfil
    const updatedUser = { 
      ...user,
      bio: data.bio !== undefined ? data.bio : user.bio,
      location: data.location !== undefined ? data.location : user.location,
      avatar: data.avatar !== undefined ? data.avatar : user.avatar
    };
    
    // Atualizar no Map
    this.users.set(userId, updatedUser);
    
    return updatedUser;
  }
}

export const storage = new MemStorage();

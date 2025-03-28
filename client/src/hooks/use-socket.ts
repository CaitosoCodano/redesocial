import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ChatMessage, MessageStatus, UserStatus, TypingStatus } from '@shared/chat-types';

interface UseSocketProps {
  userId?: string;
}

let socket: Socket | null = null;

export const useSocket = ({ userId }: UseSocketProps = {}) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);
  const [messagesRead, setMessagesRead] = useState<string[]>([]);
  const [userTyping, setUserTyping] = useState<string | null>(null);
  const [statusChanges, setStatusChanges] = useState<UserStatus | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    // Inicializa o socket se ainda não estiver conectado
    if (!socket) {
      // Use window.location para determinar o host onde o socket deve se conectar
      const socketUrl = `${window.location.protocol}//${window.location.host}`;
      socket = io(socketUrl);
    }

    // Configura os listeners
    function onConnect() {
      setIsConnected(true);
      console.log('Socket conectado');
      
      // Se temos um userId, fazemos login
      if (userId) {
        socket?.emit('user_login', userId);
      }
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Socket desconectado');
    }

    function onReceiveMessage(message: ChatMessage) {
      setLastMessage(message);
      
      // Adicionar às mensagens não lidas se o usuário for o destinatário
      if (message.receiver === userId) {
        setUnreadMessages(prev => [...prev, message]);
      }
    }

    function onMessagesRead(messageIds: string[]) {
      setMessagesRead(messageIds);
    }

    function onUserTyping(status: TypingStatus) {
      setUserTyping(status.userId);
      
      // Limpa o status de digitação após 3 segundos se não receber outro evento
      setTimeout(() => {
        setUserTyping(null);
      }, 3000);
    }

    function onUserStopTyping() {
      setUserTyping(null);
    }

    function onUserStatusChanged(status: UserStatus) {
      setStatusChanges(status);
    }

    function onUnreadMessages(messages: ChatMessage[]) {
      setUnreadMessages(messages);
    }

    // Registra os listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('receive_message', onReceiveMessage);
    socket.on('messages_read', onMessagesRead);
    socket.on('user_typing', onUserTyping);
    socket.on('user_stop_typing', onUserStopTyping);
    socket.on('user_status_changed', onUserStatusChanged);
    socket.on('unread_messages', onUnreadMessages);

    // Limpa os listeners ao desmontar
    return () => {
      socket?.off('connect', onConnect);
      socket?.off('disconnect', onDisconnect);
      socket?.off('receive_message', onReceiveMessage);
      socket?.off('messages_read', onMessagesRead);
      socket?.off('user_typing', onUserTyping);
      socket?.off('user_stop_typing', onUserStopTyping);
      socket?.off('user_status_changed', onUserStatusChanged);
      socket?.off('unread_messages', onUnreadMessages);
    };
  }, [userId]);

  // Enviar uma mensagem
  const sendMessage = (message: Omit<ChatMessage, 'id' | 'timestamp' | 'read'>) => {
    if (socket && isConnected) {
      socket.emit('send_message', message);
    } else {
      console.error('Socket não está conectado. Não foi possível enviar a mensagem.');
    }
  };

  // Indicar que está digitando
  const sendTyping = (receiverId: string) => {
    if (socket && isConnected && userId) {
      socket.emit('typing', { userId, receiverId });
    }
  };

  // Indicar que parou de digitar
  const sendStopTyping = (receiverId: string) => {
    if (socket && isConnected && userId) {
      socket.emit('stop_typing', { userId, receiverId });
    }
  };

  // Marcar mensagens como lidas
  const markAsRead = (messageIds: string[]) => {
    if (socket && isConnected) {
      socket.emit('mark_as_read', messageIds);
    }
  };

  return {
    isConnected,
    lastMessage,
    messagesRead,
    userTyping,
    statusChanges,
    unreadMessages,
    sendMessage,
    sendTyping,
    sendStopTyping,
    markAsRead,
  };
};
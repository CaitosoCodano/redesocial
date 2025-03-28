import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatContact, ChatMessage } from '@shared/chat-types';
import { useSocket } from '@/hooks/use-socket';
import { IoMdClose } from 'react-icons/io';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { MdOutlineEmojiEmotions } from 'react-icons/md';
import { FiSend } from 'react-icons/fi';
import { apiRequest } from '@/lib/queryClient';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface ChatWindowProps {
  contact: ChatContact;
  currentUserId: string;
  onClose: () => void;
}

export default function ChatWindow({ contact, currentUserId, onClose }: ChatWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    isConnected,
    lastMessage,
    sendMessage,
    sendTyping,
    sendStopTyping,
    markAsRead,
  } = useSocket({ userId: currentUserId });

  // Carregar histórico de mensagens
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Usar a função sem tipo genérico - o apiRequest já está configurado para retornar os dados
        const response = await apiRequest({
          url: `/api/chat/messages/${currentUserId}/${contact.id}`,
          method: 'GET',
        });
        
        // Verificar se a resposta tem a propriedade 'messages'
        const msgResponse = response as { messages?: ChatMessage[] };
        if (msgResponse && msgResponse.messages) {
          setMessages(msgResponse.messages);
          
          // Marcar mensagens não lidas como lidas
          const unreadMessageIds = msgResponse.messages
            .filter((msg: ChatMessage) => !msg.read && msg.sender === contact.id)
            .map((msg: ChatMessage) => msg.id);
            
          if (unreadMessageIds.length > 0) {
            markAsRead(unreadMessageIds);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
      }
    };

    if (!isMinimized) {
      fetchMessages();
    }
  }, [currentUserId, contact.id, markAsRead, isMinimized]);

  // Lidar com novas mensagens recebidas
  useEffect(() => {
    if (lastMessage && 
        (lastMessage.sender === contact.id || lastMessage.receiver === contact.id) &&
        !messages.some(msg => msg.id === lastMessage.id)) {
      
      setMessages(prev => [...prev, lastMessage]);
      
      // Marcar como lida se não estiver minimizada e for do contato
      if (!isMinimized && lastMessage.sender === contact.id && !lastMessage.read) {
        markAsRead([lastMessage.id]);
      }
    }
  }, [lastMessage, contact.id, messages, markAsRead, isMinimized]);

  // Rolar para a última mensagem
  useEffect(() => {
    if (!isMinimized && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isMinimized, showEmojis]);

  // Fechar o seletor de emojis ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojis(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      // Quando maximizar, focar no input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleSendMessage = () => {
    if (messageInput.trim() && isConnected) {
      const newMessage: Omit<ChatMessage, 'id' | 'timestamp' | 'read'> = {
        sender: currentUserId,
        receiver: contact.id,
        content: messageInput.trim(),
        type: 'text',
      };
      
      sendMessage(newMessage);
      
      // Otimisticamente adicionar a mensagem à UI
      const optimisticMessage: ChatMessage = {
        ...newMessage,
        id: `temp-${Date.now()}`,
        timestamp: Date.now(),
        read: false,
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      setMessageInput('');
      
      // Cancelar qualquer status de digitação
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
        typingTimeout.current = null;
        sendStopTyping(contact.id);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    
    // Gerenciar eventos de digitação
    if (e.target.value.length > 0) {
      if (!typingTimeout.current) {
        sendTyping(contact.id);
      }
      
      // Limpar timeout existente
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      
      // Definir novo timeout
      typingTimeout.current = setTimeout(() => {
        sendStopTyping(contact.id);
        typingTimeout.current = null;
      }, 3000);
    } else if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
      sendStopTyping(contact.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessageInput(prev => prev + emoji.native);
    setShowEmojis(false);
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`fixed bottom-0 right-4 w-80 bg-white rounded-t-lg shadow-lg overflow-hidden transition-all duration-300 z-50 border border-gray-200 flex flex-col
        ${isMinimized ? 'h-12' : 'h-96'}`}
    >
      {/* Cabeçalho */}
      <div 
        className="bg-blue-600 text-white p-2 flex items-center justify-between cursor-pointer"
        onClick={handleToggleMinimize}
      >
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm font-medium truncate">{contact.name}</div>
          {contact.isTyping && !isMinimized && (
            <div className="text-xs italic opacity-80">digitando...</div>
          )}
        </div>
        <div className="flex items-center space-x-1">
          {isMinimized ? (
            <IoChevronUp className="h-4 w-4" />
          ) : (
            <>
              <IoChevronDown className="h-4 w-4" />
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 text-white hover:bg-blue-700" 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                <IoMdClose className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status online */}
      {!isMinimized && (
        <div className="bg-gray-50 p-1 text-center">
          <div className="text-xs text-gray-500 flex items-center justify-center">
            <div className={`h-2 w-2 rounded-full mr-1 ${contact.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            {contact.status === 'online' ? 'Online' : `Última vez: ${new Date(contact.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
          </div>
        </div>
      )}

      {/* Área de mensagens */}
      {!isMinimized && (
        <ScrollArea className="flex-1 p-3 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === currentUserId ? 'justify-end' : 'justify-start'} mb-2`}
            >
              <div
                className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                  message.sender === currentUserId
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                {message.type === 'text' && message.content}
                {message.type === 'emoji' && <span className="text-xl">{message.content}</span>}
                <div className={`text-xs mt-1 ${message.sender === currentUserId ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {message.sender === currentUserId && (
                    <span className="ml-1">{message.read ? '✓✓' : '✓'}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      )}

      {/* Área de entrada */}
      {!isMinimized && (
        <div className="p-2 border-t border-gray-200 relative">
          {showEmojis && (
            <div ref={emojiPickerRef} className="absolute bottom-14 right-2">
              <Picker 
                data={data} 
                onEmojiSelect={handleEmojiSelect} 
                previewPosition="none"
                theme="light"
                skinTonePosition="none"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setShowEmojis(!showEmojis)}
            >
              <MdOutlineEmojiEmotions className="h-5 w-5" />
            </Button>
            <Input
              ref={inputRef}
              placeholder="Digite uma mensagem..."
              value={messageInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <FiSend className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
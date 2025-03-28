import React, { useState, useEffect } from 'react';
import { ChatContact } from '@shared/chat-types';
import ChatWindow from './ChatWindow';
import { useQuery } from '@tanstack/react-query';

interface ChatManagerProps {
  currentUserId: string;
}

export default function ChatManager({ currentUserId }: ChatManagerProps) {
  const [activeChats, setActiveChats] = useState<ChatContact[]>([]);
  
  // Carregar contatos
  const { data: contactsData } = useQuery<{ contacts: ChatContact[] }>({
    queryKey: ['/api/chat/contacts'],
    staleTime: 1000 * 60, // 1 minuto
  });

  // Função para abrir um chat
  const openChat = (contact: ChatContact) => {
    // Verificar se o chat já está aberto
    if (!activeChats.some(chat => chat.id === contact.id)) {
      // Limitar o número de chats abertos a 3
      if (activeChats.length >= 3) {
        setActiveChats(prev => [...prev.slice(1), contact]);
      } else {
        setActiveChats(prev => [...prev, contact]);
      }
    }
  };

  // Função para fechar um chat
  const closeChat = (contactId: string) => {
    setActiveChats(prev => prev.filter(chat => chat.id !== contactId));
  };

  return (
    <>
      {/* Componente flutuante para abrir chats (botão fixo no canto inferior esquerdo) */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => {
            // Abrir o primeiro contato como demonstração
            if (contactsData?.contacts && contactsData.contacts.length > 0) {
              openChat(contactsData.contacts[0]);
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>

      {/* Renderizar janelas de chat */}
      <div className="chat-windows">
        {activeChats.map((contact, index) => (
          <div
            key={contact.id}
            style={{ right: `${(index * 320) + 16}px` }}
            className="fixed bottom-0"
          >
            <ChatWindow
              contact={contact}
              currentUserId={currentUserId}
              onClose={() => closeChat(contact.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
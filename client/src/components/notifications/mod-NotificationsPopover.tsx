import { useState } from "react";
import { Bell, Check, User, Heart, MessageSquare, UserPlus } from "lucide-react";

interface Notification {
  id: number;
  type: "like" | "comment" | "follow" | "mention";
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  timeAgo: string;
  read: boolean;
}

export default function NotificationsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "like",
      user: {
        name: "Ana Silva",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      },
      content: "curtiu sua publicação",
      timeAgo: "2min",
      read: false,
    },
    {
      id: 2,
      type: "comment",
      user: {
        name: "Carlos Oliveira",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      },
      content: "comentou na sua publicação",
      timeAgo: "20min",
      read: false,
    },
    {
      id: 3,
      type: "follow",
      user: {
        name: "Mariana Costa",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      },
      content: "começou a seguir você",
      timeAgo: "1h",
      read: true,
    },
    {
      id: 4,
      type: "mention",
      user: {
        name: "Rafael Santos",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80",
      },
      content: "mencionou você em um comentário",
      timeAgo: "3h",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark all as read when opening
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "follow":
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case "mention":
        return <User className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-30 overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Notificações</h3>
            <button 
              className="text-sm text-primary hover:text-primary/80"
              onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
            >
              <Check className="h-4 w-4 inline mr-1" />
              Marcar todas como lidas
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma notificação
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 hover:bg-gray-50 flex items-start space-x-3 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={notification.user.avatar}
                        alt={notification.user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">
                        <span className="font-medium">{notification.user.name}</span>{" "}
                        {notification.content}
                      </p>
                      <span className="text-xs text-gray-500">{notification.timeAgo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 text-center">
            <button className="text-sm text-primary hover:underline">
              Ver todas as notificações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
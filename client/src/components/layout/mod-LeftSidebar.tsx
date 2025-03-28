import { Home, Search, Bell, MessageSquare, User, Settings } from "lucide-react";
import NotificationsPopover from "../notifications/mod-NotificationsPopover";
import UserMenu from "../user/mod-UserMenu";

export default function LeftSidebar() {
  return (
    <div className="hidden md:flex flex-col w-64 bg-white shadow-sm border-r border-gray-200 h-screen sticky top-0">
      {/* Logo and Brand */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
            />
          </svg>
          <h1 className="ml-3 text-xl font-semibold text-gray-800">SocialNet</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          MENU
        </h2>

        <div className="space-y-1">
          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md bg-blue-50 text-primary"
          >
            <Home className="h-5 w-5 mr-3" />
            Início
          </a>

          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary"
          >
            <Search className="h-5 w-5 mr-3" />
            Pesquisar
          </a>

          <div className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary">
            <NotificationsPopover />
            <span className="ml-3">Notificações</span>
          </div>

          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary"
          >
            <MessageSquare className="h-5 w-5 mr-3" />
            Mensagens
          </a>

          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary"
          >
            <User className="h-5 w-5 mr-3" />
            Perfil
          </a>

          <a
            href="#"
            className="flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary"
          >
            <Settings className="h-5 w-5 mr-3" />
            Configurações
          </a>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="mt-auto">
          <UserMenu />
        </div>
      </nav>
    </div>
  );
}
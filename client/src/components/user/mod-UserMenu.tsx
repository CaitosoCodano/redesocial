import { useState } from "react";
import { LogOut, User, Settings, HelpCircle, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    alert("Usuário desconectado");
  };

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className="flex items-center px-2 py-1 rounded-md text-gray-700 hover:bg-gray-50"
      >
        <img
          className="h-8 w-8 rounded-full object-cover mr-2"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="User profile"
        />
        <div className="hidden md:block text-left">
          <p className="font-medium text-sm">João Silva</p>
          <p className="text-xs text-gray-500">@joaosilva</p>
        </div>
        <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-30 py-1">
          <div className="border-b border-gray-100 pb-3 pt-2 px-4">
            <p className="font-medium">João Silva</p>
            <p className="text-xs text-gray-500">joao.silva@example.com</p>
          </div>

          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="h-4 w-4 mr-3 text-gray-500" />
            Meu Perfil
          </a>

          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-4 w-4 mr-3 text-gray-500" />
            Configurações
          </a>

          <a
            href="#"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <HelpCircle className="h-4 w-4 mr-3 text-gray-500" />
            Ajuda e Suporte
          </a>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
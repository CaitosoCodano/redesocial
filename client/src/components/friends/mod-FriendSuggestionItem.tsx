import { useState } from "react";
import { Check, X } from "lucide-react";

interface FriendSuggestionItemProps {
  name: string;
  avatar: string;
  mutualFriends: number;
  onAdd: () => void;
  onRemove: () => void;
}

export default function FriendSuggestionItem({
  name,
  avatar,
  mutualFriends,
  onAdd,
  onRemove,
}: FriendSuggestionItemProps) {
  const [status, setStatus] = useState<"none" | "pending" | "added" | "removed">("none");

  const handleAdd = () => {
    setStatus("added");
    onAdd();
  };

  const handleRemove = () => {
    setStatus("removed");
    onRemove();
  };

  return (
    <div className="flex items-center space-x-3 mb-4">
      <img
        src={avatar}
        alt={`${name} profile`}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="font-medium text-gray-800">{name}</p>
        <p className="text-xs text-gray-500">{mutualFriends} amigos em comum</p>
        
        {status === "none" && (
          <div className="flex space-x-2 mt-2">
            <button 
              onClick={handleAdd}
              className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition flex items-center"
            >
              Adicionar
            </button>
            <button 
              onClick={handleRemove}
              className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-md hover:bg-gray-300 transition"
            >
              Remover
            </button>
          </div>
        )}

        {status === "added" && (
          <div className="flex items-center mt-2 text-green-600 text-xs">
            <Check className="h-3 w-3 mr-1" />
            Solicitação enviada
          </div>
        )}

        {status === "removed" && (
          <div className="flex items-center mt-2 text-gray-500 text-xs">
            <X className="h-3 w-3 mr-1" />
            Sugestão removida
          </div>
        )}
      </div>
    </div>
  );
}
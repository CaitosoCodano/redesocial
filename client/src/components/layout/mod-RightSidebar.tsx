import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Tipo para sugestão de amizade
interface FriendSuggestion {
  id: number;
  name: string;
  commonFriends: number;
  avatar: string;
  status: "pending" | "accepted" | "rejected";
}

// Tipo para tópico de trending
interface TrendingTopic {
  id: number;
  topic: string;
  hashtag: string;
  avatar: string;
}

export default function RightSidebar() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [expandedSuggestions, setExpandedSuggestions] = useState(false);
  const [localSuggestions, setLocalSuggestions] = useState<FriendSuggestion[]>([]);
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  // Query para obter sugestões de amizade
  const { data: friendSuggestionsData, isLoading: isLoadingFriendSuggestions } = useQuery<{
    friendSuggestions: FriendSuggestion[]
  }>({
    queryKey: ["/api/friend-suggestions"],
    staleTime: 60000, // 1 minuto
  });
  
  // Efeito para atualizar as sugestões locais quando os dados mudam
  useEffect(() => {
    if (friendSuggestionsData?.friendSuggestions) {
      setLocalSuggestions(friendSuggestionsData.friendSuggestions.filter(fs => !pendingIds.has(fs.id)));
    }
  }, [friendSuggestionsData, pendingIds]);

  // Query para obter trending topics
  const { data: trendingTopicsData, isLoading: isLoadingTrendingTopics } = useQuery<{
    tradingTops: TrendingTopic[]
  }>({
    queryKey: ["/api/trading-tops"],
    staleTime: 60000, // 1 minuto
  });

  // Mutation para aceitar amizade
  const acceptFriendMutation = useMutation<any, Error, number>({
    mutationFn: async (id: number) => {
      // Atualizar estado local imediatamente
      setPendingIds(prev => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });
      
      // Remover da lista local
      setLocalSuggestions(prev => prev.filter(fs => fs.id !== id));
      
      return apiRequest({ 
        method: "POST", 
        url: `/api/friend-suggestions/${id}/accept` 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friend-suggestions"] });
      toast({
        title: "Amizade aceita!",
        description: "Você aceitou a solicitação de amizade.",
      });
    },
    onError: (error, id) => {
      // Restaurar em caso de erro
      setPendingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      // Restaurar sugestão que foi removida em caso de erro
      if (friendSuggestionsData?.friendSuggestions) {
        const suggestion = friendSuggestionsData.friendSuggestions.find(fs => fs.id === id);
        if (suggestion) {
          setLocalSuggestions(prev => [...prev, suggestion]);
        }
      }
      
      toast({
        title: "Erro ao aceitar amizade",
        description: "Não foi possível aceitar a solicitação. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Mutation para recusar amizade
  const rejectFriendMutation = useMutation<any, Error, number>({
    mutationFn: async (id: number) => {
      // Atualizar estado local imediatamente
      setPendingIds(prev => {
        const newSet = new Set(prev);
        newSet.add(id);
        return newSet;
      });
      
      // Remover da lista local
      setLocalSuggestions(prev => prev.filter(fs => fs.id !== id));
      
      return apiRequest({ 
        method: "POST", 
        url: `/api/friend-suggestions/${id}/reject` 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/friend-suggestions"] });
      toast({
        title: "Sugestão removida",
        description: "A sugestão de amizade foi removida.",
      });
    },
    onError: (error, id) => {
      // Restaurar em caso de erro
      setPendingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      // Restaurar sugestão que foi removida em caso de erro
      if (friendSuggestionsData?.friendSuggestions) {
        const suggestion = friendSuggestionsData.friendSuggestions.find(fs => fs.id === id);
        if (suggestion) {
          setLocalSuggestions(prev => [...prev, suggestion]);
        }
      }
      
      toast({
        title: "Erro ao remover sugestão",
        description: "Não foi possível remover a sugestão. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Manipuladores para aceitar/recusar amizade
  const handleAcceptFriend = (id: number) => {
    acceptFriendMutation.mutate(id);
  };

  const handleRejectFriend = (id: number) => {
    rejectFriendMutation.mutate(id);
  };

  // Determinar quantas sugestões mostrar
  const displayedSuggestions = expandedSuggestions ? localSuggestions : localSuggestions.slice(0, 3);
  const hasMoreSuggestions = localSuggestions.length > 3;

  // Trending topics
  const trendingTopics: TrendingTopic[] = trendingTopicsData?.tradingTops || [];

  return (
    <div className="hidden lg:block w-80 bg-white border-l border-gray-200 h-screen sticky top-0 overflow-y-auto">
      {/* Trading Tops Section */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">TRADING TOPS</h2>
        <div className="space-y-4">
          {isLoadingTrendingTopics ? (
            Array(4).fill(0).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 pb-3 border-b border-gray-100 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : (
            trendingTopics.map((topic) => (
              <div key={topic.id} className="flex items-center space-x-3 pb-3 border-b border-gray-100">
                <div className="relative">
                  <img
                    src={topic.avatar}
                    alt={topic.topic}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{topic.topic}</p>
                  <p className="text-xs text-gray-500">
                    Trending with <span className="text-primary">{topic.hashtag}</span>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Friend Suggestions */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">SUGESTÕES DE AMIZADE</h2>
        <div className="space-y-4">
          {isLoadingFriendSuggestions ? (
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="flex items-center space-x-3 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex space-x-2 mt-1">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            displayedSuggestions.map((friend) => (
              <div key={friend.id} className="flex items-center space-x-3">
                <img
                  src={friend.avatar}
                  alt={`${friend.name} profile`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{friend.name}</p>
                  <p className="text-xs text-gray-500">{friend.commonFriends} amigos em comum</p>
                  <div className="flex space-x-2 mt-2">
                    <button 
                      className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-md hover:bg-primary/90 transition"
                      onClick={() => handleAcceptFriend(friend.id)}
                      disabled={acceptFriendMutation.isPending}
                    >
                      {acceptFriendMutation.isPending && acceptFriendMutation.variables === friend.id ? 
                        "Adicionando..." : "Adicionar"}
                    </button>
                    <button 
                      className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-md hover:bg-gray-300 transition"
                      onClick={() => handleRejectFriend(friend.id)}
                      disabled={rejectFriendMutation.isPending}
                    >
                      {rejectFriendMutation.isPending && rejectFriendMutation.variables === friend.id ? 
                        "Removendo..." : "Remover"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {hasMoreSuggestions && (
            <button 
              onClick={() => setExpandedSuggestions(!expandedSuggestions)} 
              className="block text-sm text-primary font-medium hover:underline pt-2"
            >
              {expandedSuggestions ? "Ver menos sugestões" : "Ver todas as sugestões"}
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-6 text-xs text-gray-500">
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          <a href="#" className="hover:underline">
            Sobre
          </a>
          <a href="#" className="hover:underline">
            Ajuda
          </a>
          <a href="#" className="hover:underline">
            Termos de Uso
          </a>
          <a href="#" className="hover:underline">
            Privacidade
          </a>
          <a href="#" className="hover:underline">
            Configurações
          </a>
        </div>
        <p className="mt-4">© 2023 SocialNet. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
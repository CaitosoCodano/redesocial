import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { LoginUser, RegisterUser, User } from "@shared/schema";

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  login: UseMutationResult<{ token: string; user: User }, Error, LoginUser>;
  register: UseMutationResult<{ token: string; user: User }, Error, RegisterUser>;
  logout: UseMutationResult<void, Error, void>;
}

// Criar contexto
export const AuthContext = createContext<AuthContextType | null>(null);

// Provider de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para obter dados do usuário atual
  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
    initialData: null,
    enabled: !!localStorage.getItem("token"), // Só executa se houver token
    queryFn: async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        
        const userData = await apiRequest<User>({
          url: "/api/auth/user",
          method: "GET"
        });
        return userData;
      } catch (error) {
        // Se houver erro de autenticação, limpar token
        localStorage.removeItem("token");
        return null;
      }
    }
  });

  // Mutation para login
  const login = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      return await apiRequest<{ token: string; user: User }>({
        url: "/api/auth/login",
        method: "POST",
        body: credentials
      });
    },
    onSuccess: (data) => {
      // Armazenar token
      localStorage.setItem("token", data.token);
      // Atualizar dados do usuário
      queryClient.setQueryData(["/api/auth/user"], data.user);
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo(a) de volta, ${data.user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao fazer login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para registro
  const register = useMutation({
    mutationFn: async (userData: RegisterUser) => {
      const { confirmPassword, ...userDataToSend } = userData;
      return await apiRequest<{ token: string; user: User }>({
        url: "/api/auth/register",
        method: "POST",
        body: userDataToSend
      });
    },
    onSuccess: (data) => {
      // Armazenar token
      localStorage.setItem("token", data.token);
      // Atualizar dados do usuário
      queryClient.setQueryData(["/api/auth/user"], data.user);
      
      toast({
        title: "Conta criada com sucesso",
        description: `Bem-vindo(a), ${data.user.name}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation para logout
  const logout = useMutation({
    mutationFn: async () => {
      try {
        // Tentar fazer logout no servidor (se estiver com problemas, continua para limpar dados locais)
        await apiRequest<void>({
          url: "/api/auth/logout",
          method: "POST"
        });
      } catch (error) {
        console.error("Erro ao fazer logout no servidor:", error);
        // Não interrompe o fluxo mesmo com erro no servidor
      }
      
      // Retorna um valor para satisfazer o tipo de retorno
      return null;
    },
    onSuccess: () => {
      // Remover token
      localStorage.removeItem("token");
      // Limpar dados do usuário
      queryClient.setQueryData(["/api/auth/user"], null);
      // Invalidar queries que dependem de autenticação
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      toast({
        title: "Logout realizado com sucesso",
        description: "Você foi desconectado(a) com sucesso.",
      });
      
      // Forçar atualização da página para limpar todos os estados
      window.location.href = "/auth";
    },
    onError: (error: Error) => {
      // Ainda assim, remover token e dados do usuário
      localStorage.removeItem("token");
      queryClient.setQueryData(["/api/auth/user"], null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado, mas houve um erro na comunicação com o servidor.",
      });
      
      // Redirecionar para a página de login
      window.location.href = "/auth";
    },
  });

  // Verificar token ao montar componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      refetch();
    }
  }, [refetch, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
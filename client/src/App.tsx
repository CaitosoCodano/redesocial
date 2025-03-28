import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import ChatManager from "@/components/chat/ChatManager";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Componente de roteamento
function Router() {
  return (
    <Switch>
      <Route path="/" component={ProtectedHome} />
      <Route path="/auth" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Componente para Home protegida
function ProtectedHome() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Se estiver carregando, mostrar indicador
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Se não estiver autenticado, redirecionar para login
  if (!user) {
    setLocation("/auth");
    return null;
  }
  
  // Se estiver autenticado, mostrar a página Home
  return <Home />;
}

// Componente App principal
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

// Componente de conteúdo que usa useAuth
function AppContent() {
  const { user } = useAuth();
  
  return (
    <>
      <Router />
      {user && <ChatManager currentUserId={user.id.toString()} />}
    </>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { loginUserSchema, registerUserSchema } from '@shared/schema';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Usar o hook de autenticação
  const { user, isLoading, login, register } = useAuth();

  // Form de Login
  const loginForm = useForm<z.infer<typeof loginUserSchema>>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Form de Registro
  const registerForm = useForm<z.infer<typeof registerUserSchema>>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=128&h=128&q=80',
    },
  });

  // Redirecionar para a página principal se o usuário já estiver logado
  useEffect(() => {
    if (user) {
      setLocation('/');
    }
  }, [user, setLocation]);

  // Função para lidar com o envio do formulário de login
  const onLoginSubmit = (values: z.infer<typeof loginUserSchema>) => {
    setAuthError(null);
    login.mutate(values, {
      onError: (error) => {
        setAuthError(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    });
  };

  // Função para lidar com o envio do formulário de registro
  const onRegisterSubmit = (values: z.infer<typeof registerUserSchema>) => {
    setAuthError(null);
    register.mutate(values, {
      onError: (error) => {
        setAuthError(error.message || 'Erro ao criar conta. Tente novamente.');
      }
    });
  };

  // Se estiver carregando a autenticação, mostrar indicador de carregamento
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Social Connect</CardTitle>
          <CardDescription className="text-center">
            Entre na sua conta ou crie uma nova para se conectar com amigos do Gmail
          </CardDescription>
        </CardHeader>
        
        <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'register')} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 mx-4">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Criar Conta</TabsTrigger>
          </TabsList>
          
          {/* Tab de Login */}
          <TabsContent value="login" className="px-4 pt-2">
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="seu.email@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={login.isPending || isLoading}
                >
                  {login.isPending ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          {/* Tab de Registro */}
          <TabsContent value="register" className="px-4 pt-2">
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Gmail)</FormLabel>
                      <FormControl>
                        <Input placeholder="seu.email@gmail.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Apenas emails com domínio @gmail.com são aceitos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Mínimo 6 caracteres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirme sua senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={register.isPending || isLoading}
                >
                  {register.isPending ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex flex-col space-y-2 mt-4">
          <p className="text-xs text-center text-gray-500 px-4">
            Ao criar uma conta, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
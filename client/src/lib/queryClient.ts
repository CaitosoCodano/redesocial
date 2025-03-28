import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Tipos para requisições API
interface ApiRequestOptions {
  url: string;
  method: string;
  body?: unknown;
  headers?: Record<string, string>;
}

// Função melhorada para fazer requisições API
export async function apiRequest<T = any>({
  url,
  method,
  body,
  headers = {},
}: ApiRequestOptions): Promise<T> {
  // Obter token do localStorage
  const token = localStorage.getItem('token');

  // Adicionar cabeçalhos padrão + autenticação se disponível
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  };

  // Adicionar token de autenticação se disponível
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Fazer a requisição
  const res = await fetch(url, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });

  // Verificar erros
  await throwIfResNotOk(res);
  
  // Retornar JSON se houver conteúdo, ou objeto vazio se resposta for vazia
  if (res.status !== 204) { // No Content
    return await res.json() as T;
  }
  
  return {} as T;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Obter token do localStorage
    const token = localStorage.getItem('token');
    
    // Preparar headers com token de autenticação se disponível
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
      headers
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

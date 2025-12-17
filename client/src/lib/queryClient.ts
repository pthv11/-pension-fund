import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { authManager } from "./auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const text = await res.text();
      if (text) {
        const data = JSON.parse(text);
        errorMessage = data.message || data.error || text;
      }
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

export async function apiRequest({
  endpoint,
  method = "GET",
  data,
}: {
  endpoint: string;
  method?: string;
  data?: unknown;
}): Promise<any> {
  console.log(`API Request: ${method} ${endpoint}`, data ? { data } : '');
  
  const headers = new Headers(authManager.getAuthHeaders());
  headers.set('Accept', 'application/json; charset=utf-8');
  headers.set('Accept-Charset', 'utf-8');
  
  if (data) {
    headers.set('Content-Type', 'application/json; charset=utf-8');
  }

  console.log('Request headers:', Object.fromEntries(headers.entries()));

  try {
    const res = await fetch(endpoint, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    console.log(`Response status: ${res.status}`);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));

    await throwIfResNotOk(res);
    const text = await res.text();
    console.log('Response text:', text);
    
    if (!text) {
      console.log('Empty response received');
      return null;
    }

    try {
      const json = JSON.parse(text);
      console.log('Parsed response:', json);
      return json;
    } catch (e) {
      console.error('Error parsing response:', e);
      throw new Error('Некорректный формат ответа от сервера');
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.log(`Query request: ${queryKey[0]}`);
    
    const headers: HeadersInit = {
      ...authManager.getAuthHeaders(),
      'Accept': 'application/json; charset=utf-8',
      'Accept-Charset': 'utf-8'
    };

    try {
      const res = await fetch(queryKey[0] as string, {
        headers,
        credentials: "include",
      });

      console.log(`Query response status: ${res.status}`);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      const text = await res.text();
      
      if (!text) {
        console.log('Empty query response received');
        return null;
      }

      try {
        const json = JSON.parse(text);
        console.log('Parsed query response:', json);
        return json;
      } catch (e) {
        console.error('Error parsing query response:', e);
        throw new Error('Некорректный формат ответа от сервера');
      }
    } catch (error) {
      console.error('Query request failed:', error);
      throw error;
    }
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

import { User } from "@shared/schema";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthManager {
  private listeners: Array<(state: AuthState) => void> = [];
  private state: AuthState = {
    user: null,
    token: localStorage.getItem("auth_token"),
    isAuthenticated: false,
  };

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    const token = this.state.token;
    if (token) {
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const text = await response.text();
          if (!text) {
            throw new Error("Пустой ответ от сервера");
          }
          const data = JSON.parse(text);
          this.setState({
            user: data.user,
            token,
            isAuthenticated: true,
          });
        } else {
          this.logout();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        this.logout();
      }
    }
  }

  private setState(newState: Partial<AuthState>) {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    listener(this.state); // Immediately call with current state
    
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  getState() {
    return this.state;
  }

  async login(email: string, password: string) {
    try {
      console.log('AuthManager: Starting login process');
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      console.log('AuthManager: Login response status:', response.status);
      console.log('AuthManager: Login response headers:', Object.fromEntries(response.headers.entries()));

      const text = await response.text();
      console.log('AuthManager: Raw response:', text);

      if (!text) {
        throw new Error("Пустой ответ от сервера");
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('AuthManager: Failed to parse response:', e);
        throw new Error("Некорректный формат ответа от сервера");
      }

      if (!response.ok) {
        console.error('AuthManager: Login failed:', data);
        throw new Error(data.message || data.error || "Ошибка входа");
      }

      console.log('AuthManager: Login successful, updating state');
      localStorage.setItem("auth_token", data.token);
      this.setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      return data;
    } catch (error) {
      console.error("AuthManager: Login error:", error);
      if (error instanceof Error) {
        throw error;
      } else if (typeof error === 'string') {
        throw new Error(error);
      } else {
        throw new Error("Неизвестная ошибка при входе");
      }
    }
  }

  async register(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }) {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const text = await response.text();
      if (!text) {
        throw new Error("Пустой ответ от сервера");
      }
      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || "Ошибка регистрации");
      }

      localStorage.setItem("auth_token", data.token);
      this.setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
      });

      return data;
    } catch (error) {
      console.error("Register error:", error);
      throw new Error(error instanceof Error ? error.message : "Ошибка регистрации");
    }
  }

  logout() {
    localStorage.removeItem("auth_token");
    this.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  }

  getAuthHeaders(): HeadersInit {
    return this.state.isAuthenticated && this.state.token
      ? { 
          Authorization: `Bearer ${this.state.token}`,
          "Content-Type": "application/json"
        }
      : {};
  }
}

export const authManager = new AuthManager();

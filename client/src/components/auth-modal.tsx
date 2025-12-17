import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, registerSchema, type LoginRequest, type RegisterRequest } from "@shared/schema";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "login" | "register";
  onModeChange: (mode: "login" | "register") => void;
}

export function AuthModal({ open, onOpenChange, mode, onModeChange }: AuthModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();

  const loginForm = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  const handleLogin = async (data: LoginRequest) => {
    try {
      console.log('Attempting login with data:', { ...data, password: '[HIDDEN]' });
      await login(data.email, data.password);
      console.log('Login successful');
      
      toast({
        title: "Успешно",
        description: "Вход выполнен успешно",
      });
      onOpenChange(false);
      loginForm.reset();
    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = "Произошла ошибка при входе";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (data: RegisterRequest) => {
    try {
      await register(data);
      toast({
        title: "Успешно",
        description: "Регистрация выполнена успешно",
      });
      onOpenChange(false);
      registerForm.reset();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка",
        variant: "destructive",
      });
    }
  };

  const handleModeSwitch = (newMode: "login" | "register") => {
    onModeChange(newMode);
    loginForm.reset();
    registerForm.reset();
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {mode === "login" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Вход в систему</DialogTitle>
              <p className="text-center text-slate-600">Войдите в свой личный кабинет</p>
            </DialogHeader>
            
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  {...loginForm.register("email")}
                  className="mt-1"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="password">Пароль</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...loginForm.register("password")}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm">Запомнить меня</Label>
                </div>
                <Button variant="link" className="text-sm p-0">
                  Забыли пароль?
                </Button>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={loginForm.formState.isSubmitting}
              >
                {loginForm.formState.isSubmitting ? "Вход..." : "Войти"}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-slate-600">
                Нет аккаунта?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => handleModeSwitch("register")}
                >
                  Зарегистрироваться
                </Button>
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center">Регистрация</DialogTitle>
              <p className="text-center text-slate-600">Создайте новый аккаунт</p>
            </DialogHeader>
            
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    placeholder="Иван"
                    {...registerForm.register("firstName")}
                    className="mt-1"
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="text-sm text-red-600 mt-1">
                      {registerForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    placeholder="Иванов"
                    {...registerForm.register("lastName")}
                    className="mt-1"
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="text-sm text-red-600 mt-1">
                      {registerForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="registerEmail">Email *</Label>
                <Input
                  id="registerEmail"
                  type="email"
                  placeholder="example@email.com"
                  {...registerForm.register("email")}
                  className="mt-1"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="registerPassword">Пароль *</Label>
                <div className="relative mt-1">
                  <Input
                    id="registerPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerForm.register("password")}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Минимум 8 символов, включая цифры и буквы
                </p>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-600 mt-1">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="confirmPassword">Подтвердите пароль *</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...registerForm.register("confirmPassword")}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm leading-4">
                  Согласен с{" "}
                  <Button variant="link" className="text-sm p-0 h-auto">
                    условиями использования
                  </Button>
                  {" "}и{" "}
                  <Button variant="link" className="text-sm p-0 h-auto">
                    политикой конфиденциальности
                  </Button>
                </Label>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={registerForm.formState.isSubmitting}
              >
                {registerForm.formState.isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-slate-600">
                Уже есть аккаунт?{" "}
                <Button
                  variant="link"
                  className="p-0"
                  onClick={() => handleModeSwitch("login")}
                >
                  Войти
                </Button>
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

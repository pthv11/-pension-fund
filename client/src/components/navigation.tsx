import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { AuthModal } from "./auth-modal";

export function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const navigation = [
    { name: "Главная", href: "/" },
    { name: "О нас", href: "/about" },
    { name: "Новости", href: "/news" },
    { name: "Контакты", href: "/contact" },
    ...((isAuthenticated && !isAdmin) ? [{ name: "Личный кабинет", href: "/profile" }] : []),
    ...(isAdmin ? [
      { name: "Клиенты", href: "/clients" },
      { name: "Админ-панель", href: "/admin" }
    ] : []),
  ];

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">ПенсионныйФонд.РФ</h1>
                <p className="text-xs text-slate-500">Система управления</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    location === item.href
                      ? "text-primary font-medium border-b-2 border-primary pb-4 -mb-4"
                      : "text-slate-600 hover:text-primary"
                  } transition-colors`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="flex items-center space-x-3">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-slate-600">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="text-primary border-primary hover:bg-primary/5"
                    >
                      Выход
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleAuthClick("login")}
                      className="text-primary border-primary hover:bg-primary/5"
                    >
                      Вход
                    </Button>
                    <Button
                      onClick={() => handleAuthClick("register")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Регистрация
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl p-6">
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </Button>
            </div>
            
            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-slate-900 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="text-sm text-slate-600 pb-2">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleLogout}
                    >
                      Выход
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleAuthClick("login")}
                    >
                      Вход
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => handleAuthClick("register")}
                    >
                      Регистрация
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}

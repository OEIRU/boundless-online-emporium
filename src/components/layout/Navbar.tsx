
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  X, 
  Heart,
  LogIn,
  LogOut,
  UserCircle,
  ShieldCheck
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const cartItemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-store-purple">ВайлдСтор</h1>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex relative flex-1 mx-10 max-w-xl">
            <Input
              type="text"
              placeholder="Поиск товаров..."
              className="w-full pr-10"
            />
            <Button size="icon" variant="ghost" className="absolute right-0 top-0">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem className="font-medium text-sm text-gray-500 cursor-default">
                      Привет, {user?.firstName}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/profile" className="w-full flex items-center">
                        <UserCircle className="h-4 w-4 mr-2" />
                        Мой профиль
                      </Link>
                    </DropdownMenuItem>
                    {user?.role === 'admin' && (
                      <DropdownMenuItem>
                        <Link to="/admin" className="w-full flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          Админ-панель
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <button onClick={logout} className="w-full flex items-center">
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                      </button>
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem>
                      <Link to="/login" className="w-full flex items-center">
                        <LogIn className="h-4 w-4 mr-2" />
                        Войти
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/register" className="w-full flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Регистрация
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/admin-login" className="w-full flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2" />
                        Вход для админа
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-store-purple text-white">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-3 pb-2 animate-fade-in">
            <div className="relative mb-3">
              <Input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full pr-10"
              />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center py-2 px-3 rounded hover:bg-gray-100">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Мой профиль
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="flex items-center py-2 px-3 rounded hover:bg-gray-100">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Админ-панель
                    </Link>
                  )}
                  <button 
                    onClick={logout} 
                    className="flex items-center py-2 px-3 rounded hover:bg-gray-100 text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center py-2 px-3 rounded hover:bg-gray-100">
                    <LogIn className="h-4 w-4 mr-2" />
                    Войти
                  </Link>
                  <Link to="/register" className="flex items-center py-2 px-3 rounded hover:bg-gray-100">
                    <User className="h-4 w-4 mr-2" />
                    Регистрация
                  </Link>
                  <Link to="/admin-login" className="flex items-center py-2 px-3 rounded hover:bg-gray-100">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Вход для админа
                  </Link>
                </>
              )}
              <Link to="/wishlist" className="flex items-center py-2 px-3 rounded hover:bg-gray-100">
                <Heart className="h-4 w-4 mr-2" />
                Избранное
              </Link>
              <Link to="/cart" className="flex items-center py-2 px-3 rounded hover:bg-gray-100">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Корзина {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

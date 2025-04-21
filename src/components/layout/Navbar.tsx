
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, User, Search, Heart, ShoppingCart, LogIn, LogOut, Settings } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchBox from "@/components/search/SearchBox";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Animation: Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    // eslint-disable-next-line
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-br from-primary/90 via-primary/60 to-purple-400/80 backdrop-blur-md shadow-lg border-b border-primary/30">
      <div className="container mx-auto px-2 sm:px-6 py-2">
        <div className="flex items-center justify-between min-h-[56px]">
          {/* New Logo */}
          <Link to="/" className="flex items-center gap-2 select-none">
            <div className="rounded-full bg-white/30 shadow border border-white/20 w-10 h-10 flex items-center justify-center backdrop-blur">
              <span className="text-2xl text-primary font-bold">WS</span>
            </div>
          </Link>
          {/* SearchBar (desktop only) */}
          <div className="hidden md:flex flex-1 mx-6 max-w-xl">
            <SearchBox 
              onSearch={handleSearch} 
              placeholder="Поиск по товарам..."
            />
          </div>
          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/wishlist">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-pink-600 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="text-white hover:bg-white/10" variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem disabled className="font-semibold text-gray-700">
                      Привет, {user?.firstName}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link to="/profile" className="w-full flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Профиль
                      </Link>
                    </DropdownMenuItem>
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
                        Зарегистрироваться
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Mobile burger */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white hover:bg-white/10">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden animate-fade-in">
            <div className="my-3">
              <SearchBox
                onSearch={handleSearch}
                placeholder="Поиск по товарам..."
                compact={true}
              />
            </div>
            <div className="flex flex-col gap-1 pb-2">
              <Link to="/wishlist" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded">
                <Heart className="h-4 w-4 mr-2" />
                Избранное
              </Link>
              <Link to="/cart" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Корзина {cartItemCount > 0 && <span>({cartItemCount})</span>}
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded">
                    <User className="h-4 w-4 mr-2" />
                    Профиль
                  </Link>
                  <button 
                    onClick={logout} 
                    className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded text-left"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded">
                    <LogIn className="h-4 w-4 mr-2" />
                    Войти
                  </Link>
                  <Link to="/register" className="flex items-center px-3 py-2 text-white hover:bg-white/10 rounded">
                    <User className="h-4 w-4 mr-2" />
                    Зарегистрироваться
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


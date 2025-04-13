
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Search, 
  User, 
  Menu, 
  X, 
  Heart 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-store-purple">WildStore</h1>
          </Link>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex relative flex-1 mx-10 max-w-xl">
            <Input
              type="text"
              placeholder="Search for products..."
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
                <DropdownMenuItem>
                  <Link to="/login" className="w-full">Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/register" className="w-full">Register</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/account" className="w-full">My Account</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            
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
                placeholder="Search for products..."
                className="w-full pr-10"
              />
              <Button size="icon" variant="ghost" className="absolute right-0 top-0">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between">
              <Link to="/login" className="block py-2 px-3 rounded hover:bg-gray-100">Account</Link>
              <Link to="/wishlist" className="block py-2 px-3 rounded hover:bg-gray-100">Wishlist</Link>
              <Link to="/cart" className="block py-2 px-3 rounded hover:bg-gray-100">Cart</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

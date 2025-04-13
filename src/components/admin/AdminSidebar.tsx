
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    { name: "Дашборд", href: "/admin", icon: LayoutDashboard },
    { name: "Товары", href: "/admin/products", icon: Package },
    { name: "Заказы", href: "/admin/orders", icon: ShoppingCart },
    { name: "Настройки", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 md:bg-gray-900 md:text-white">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <h1 className="text-xl font-bold">Админ-панель</h1>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                              (item.href !== "/admin" && location.pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                    isActive 
                      ? "bg-gray-800 text-white" 
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="border-t border-gray-800 p-4">
          <Button 
            onClick={logout} 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;

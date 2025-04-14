
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminNavLink = () => {
  const { user } = useAuth();

  // Показываем ссылку только для администраторов
  if (user?.role !== 'admin') return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ShieldCheck className="h-5 w-5 text-store-purple" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Админ-панель</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AdminNavLink;

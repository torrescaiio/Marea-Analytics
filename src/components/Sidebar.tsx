import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Sidebar = () => {
  const location = useLocation();

  const links = [
    {
      title: "Dashboard",
      icon: BarChart3,
      href: "/",
    },
    {
      title: "Configurações",
      icon: Settings,
      href: "/settings",
    },
  ];

  return (
    <aside className="fixed left-0 flex flex-col h-screen bg-white border-r shadow-sm w-16">
      <nav className="flex flex-col gap-3 px-3 py-4">
        {links.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <TooltipProvider key={link.href}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    to={link.href}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-lg hover:bg-gray-100 transition-colors",
                      isActive && "bg-ocean-50 text-ocean-600 hover:bg-ocean-100"
                    )}
                  >
                    <link.icon className="w-6 h-6" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{link.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar; 
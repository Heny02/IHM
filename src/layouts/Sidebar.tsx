// components/Sidebar.tsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { LayoutDashboard, Briefcase, Users, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn("pb-12", isCollapsed ? "w-20" : "w-64")}>
      <div className="space-y-4 py-4">
        <div className="flex items-center justify-between px-3 py-2">
          {/* Logo toujours visible */}
          <img
            src="/path/to/your/logo.png" // Remplacez par le chemin réel du logo
            alt="Logo"
            className="h-8 w-auto mr-2"
          />
          
          {/* Chevron de réduction */}
          <Button
            variant="ghost"
            className="p-2 hidden sm:block" // Masque le bouton en dessous de sm
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        <div className="space-y-1 px-2">
          {/* Icône avec tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("dashboard")}
              >
                <LayoutDashboard className="h-5 w-5" />
                {!isCollapsed && <span className="ml-2">Dashboard</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent>Dashboard</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTab === "service" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("service")}
              >
                <Briefcase className="h-5 w-5" />
                {!isCollapsed && <span className="ml-2">Service</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent>Service</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={activeTab === "session" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("session")}
              >
                <Users className="h-5 w-5" />
                {!isCollapsed && <span className="ml-2">Session</span>}
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent>Session</TooltipContent>}
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

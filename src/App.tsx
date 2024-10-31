// App.tsx
import React from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "./layouts/Sidebar";
import { Navbar } from "./layouts/Navbar";
import { Dashboard } from "./pages/Dashboard";
import { Service } from "./pages/Service";
import { Session } from "./pages/Session";


const App: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("dashboard");

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "service" && <Service />}
            {activeTab === "session" && <Session />}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default App;

import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { LayoutDashboard, Beaker, Terminal, FileText, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { FounderModeToggle } from "./FounderModeToggle";

const navItems = [
  { title: "Documents", icon: FileText, url: "/dashboard" },
  { title: "Classifier Benchmark", icon: Beaker, url: "/benchmark" },
  { title: "API Playground", icon: Terminal, url: "/playground" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-slate-950">
      <SidebarHeader className="p-4 flex flex-row items-center justify-center">
        <div className="w-8 h-8 rounded bg-indigo-600 flex items-center justify-center font-black text-white shadow-xl shadow-indigo-500/20">
          D
        </div>
      </SidebarHeader>
      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    render={
                      <Link to={item.url} title={item.title}>
                        <item.icon className="w-5 h-5 text-slate-400 group-hover:text-white group-data-[active=true]:text-white" />
                        <span className="sr-only">{item.title}</span>
                      </Link>
                    }
                    className="h-10 w-10 flex items-center justify-center p-0 mx-auto rounded-lg bg-slate-900 border border-white/5 hover:bg-slate-800 transition-all group data-[active=true]:bg-indigo-600 data-[active=true]:border-indigo-500"
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:hidden">
           <FounderModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#020617] font-sans selection:bg-indigo-500/30">
        <AppSidebar />
        <main className="flex-1 overflow-auto relative bg-high-density-gradient flex flex-col">
          <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-slate-900/30 backdrop-blur-md sticky top-0 z-50">
            <div className="flex items-center gap-4">
               <div className="text-xl font-extrabold tracking-tighter text-white">DocIntel</div>
               <SidebarTrigger className="text-slate-400 hover:text-white" />
            </div>
             <div className="flex items-center gap-4">
                <FounderModeToggle />
             </div>
          </header>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

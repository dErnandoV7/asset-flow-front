"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider suppressHydrationWarning>
      <AppSidebar />
      <div className="w-full p-2">
        <SidebarTrigger className="md:hidden p-5 rounded-full border-2 border-secondary cursor-pointer mb-4 fixed " />
        {children} 
      </div>
    </SidebarProvider>
  );
}

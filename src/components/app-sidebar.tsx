"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarGroupContent, SidebarHeader, SidebarSeparator, SidebarFooter, SidebarGroupLabel } from "@/components/ui/sidebar"
import { User, Wallet, Logs, CircleDollarSign, Sun, Moon, LogOut } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { resetTokenInCookie } from "@/app/utils/cookiesUtil"

const menus = [
    { name: "Perfil", icon: User, path: "/perfil" },
    { name: "Carteria", icon: Wallet, path: "/" },
    { name: "Ativos", icon: CircleDollarSign, path: "ativos" },
    { name: "Transferências", icon: Logs, path: "transferencias" },
]

export function AppSidebar() {
    const { setTheme } = useTheme()
    const route = useRouter()

    const handleButtonLogOut = () => {
        resetTokenInCookie()
        route.push("/login")
    }

    const handleItemMenu = (path: string) => {
        if (path) route.push(path)
    }

    return (
        <Sidebar className="overflow-hidden">
            <SidebarHeader className="text-center my-3">
                <h1 className="text-2xl md:text-3xl">Asset <strong className="text-primary">Flow</strong></h1>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarMenu className="p-3 pt-6">
                    {menus && menus.map((menu, idx) => (
                        <SidebarMenuItem key={idx} className="flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors rounded-xl p-2 px-3 text-md" onClick={() => handleItemMenu(menu.path)}>
                            < menu.icon size={20} />
                            <span>{menu.name}</span>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter className="mb-5">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-md">Preferências</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors rounded-xl p-2 px-3 text-sm" onClick={() => setTheme("dark")}>
                                <Moon size={18} />
                                <span>Modo Escuro</span>
                            </SidebarMenuItem>
                            <SidebarMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors rounded-xl p-2 px-3 text-sm" onClick={() => setTheme("light")}>
                                <Sun size={18} />
                                <span>Modo Claro</span>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarMenuItem className="flex items-center gap-4 cursor-pointer hover:bg-muted transition-colors rounded-xl p-2 px-3 text-[16px]" onClick={handleButtonLogOut}>
                    <LogOut size={18} />
                    <span>Sair</span>
                </SidebarMenuItem>

            </SidebarFooter>
        </Sidebar>
    )
}
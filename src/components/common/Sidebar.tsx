"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    BookOpen,
    Clock,
    Star,
    TrendingUp,
    History,
    LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setSidebar } from "@/store/slices/appSlice";
import { ThemeSwitcher } from "./ThemeSwitcher";

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "My Learning", href: "/my-courses" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
    // { icon: Star, label: "Favorites", href: "/favorites" },
];


export function Sidebar() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const sidebarOpen = useAppSelector((state) => state.app.sidebarOpen);

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            dispatch(setSidebar(false));
        }
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-64 border-r bg-background transition-transform duration-300",
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="flex flex-col h-full overflow-y-auto p-4">
                <div className="space-y-1">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2">
                        Main Menu
                    </p>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={handleLinkClick}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="mt-auto pt-4 border-t md:hidden">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-4">
                        Appearance
                    </p>
                    <ThemeSwitcher variant="sidebar" />
                </div>
            </div>
        </aside>
    );
}

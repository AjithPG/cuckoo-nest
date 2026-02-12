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
import { useAppSelector } from "@/store/hooks";

const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: LayoutDashboard, label: "My Learning", href: "/my-courses" },
    { icon: BookOpen, label: "Courses", href: "/courses" },
    { icon: Clock, label: "History", href: "/history" },
    { icon: Star, label: "Favorites", href: "/favorites" },
];

const categories = [
    { label: "Frontend", count: 12 },
    { label: "Backend", count: 8 },
    { label: "Design", count: 5 },
    { label: "DevOps", count: 3 },
];

export function Sidebar() {
    const pathname = usePathname();
    const sidebarOpen = useAppSelector((state) => state.app.sidebarOpen);

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

                <div className="mt-8 space-y-1">
                    <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground pb-2">
                        Categories
                    </p>
                    {categories.map((cat) => (
                        <button
                            key={cat.label}
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <div className="flex items-center gap-3">
                                <TrendingUp className="h-4 w-4" />
                                {cat.label}
                            </div>
                            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{cat.count}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-auto pt-8">
                    <div className="rounded-xl border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <Star className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-xs font-bold uppercase text-muted-foreground">Pro Plan</p>
                                <p className="text-sm font-semibold">Unlimited Courses</p>
                            </div>
                        </div>
                        <p className="text-[11px] text-muted-foreground mb-4">
                            Unlock advanced features like AI-powered chapter generation.
                        </p>
                        <button className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

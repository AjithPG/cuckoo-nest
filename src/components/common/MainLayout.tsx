"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function MainLayout({ children }: { children: React.ReactNode }) {
    const sidebarOpen = useAppSelector((state) => state.app.sidebarOpen);

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <Header />
            <div className="flex">
                <Sidebar />
                <main
                    className={cn(
                        "flex-1 transition-all duration-300 min-h-[calc(100vh-64px)] p-4 md:p-8 overflow-x-hidden",
                        sidebarOpen ? "md:pl-64" : "md:pl-0"
                    )}
                >
                    <div className="mx-auto max-w-[1100px] animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

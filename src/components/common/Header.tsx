"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/appSlice";
import { RootState } from "@/store";

export function Header() {
    const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
    const themeSwitcherRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const sidebarOpen = useAppSelector((state: RootState) => state.app.sidebarOpen);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (themeSwitcherRef.current && !themeSwitcherRef.current.contains(event.target as Node)) {
                setShowThemeSwitcher(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(toggleSidebar())}
                        className="flex items-center justify-center"
                    >
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                            <Image
                                src="/Logo.png"
                                alt="Cuckoo Nest Logo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Cuckoo Nest</span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Generate Content
                    </Link>
                    <Link href="/my-courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        My Learning
                    </Link>
                </nav>

                <div className="hidden md:flex items-center gap-2 relative" ref={themeSwitcherRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
                        className={cn(showThemeSwitcher && "bg-accent")}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>

                    {showThemeSwitcher && (
                        <div className="absolute right-0 top-full mt-2 w-64">
                            <ThemeSwitcher />
                        </div>
                    )}

                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                        Login
                    </Button>
                    <Button size="sm">Get Started</Button>
                </div>
            </div>
        </header>
    );
}

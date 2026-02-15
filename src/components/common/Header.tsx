"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Settings, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleSidebar } from "@/store/slices/appSlice";
import { RootState } from "@/store";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export function Header() {
    const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const themeSwitcherRef = useRef<HTMLDivElement>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const sidebarOpen = useAppSelector((state: RootState) => state.app.sidebarOpen);
    const supabase = createClient();

    useEffect(() => {
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase, setUser]);

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

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(toggleSidebar())}
                        className="flex items-center justify-center lg:hidden"
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
                        Generate
                    </Link>
                    <Link href="/my-courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Library
                    </Link>
                </nav>

                <div className="flex items-center gap-2 relative" ref={themeSwitcherRef}>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
                        className={cn("hidden sm:flex", showThemeSwitcher && "bg-accent")}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>

                    {showThemeSwitcher && (
                        <div className="absolute right-0 top-full mt-2 w-64">
                            <ThemeSwitcher />
                        </div>
                    )}

                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="outline" size="sm">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/login?mode=signup">
                                <Button size="sm" className="hidden sm:inline-flex">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

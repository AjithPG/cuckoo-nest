"use client";

import React from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Sun, Moon, Monitor, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Theme, Mode } from "@/types/theme";

interface ThemeSwitcherProps {
    variant?: "default" | "sidebar";
}

export function ThemeSwitcher({ variant = "default" }: ThemeSwitcherProps) {
    const { theme, setTheme, mode, setMode } = useTheme();

    const themes: { name: Theme; color: string }[] = [
        { name: "blue", color: "bg-blue-500" },
        { name: "green", color: "bg-green-500" },
        { name: "purple", color: "bg-purple-500" },
    ];

    const modes: { name: Mode; icon: React.ReactNode }[] = [
        { name: "light", icon: <Sun className="h-4 w-4" /> },
        { name: "dark", icon: <Moon className="h-4 w-4" /> },
        { name: "system", icon: <Monitor className="h-4 w-4" /> },
    ];

    return (
        <div className={cn(
            "flex flex-col gap-4 p-4",
            variant === "default" && "border rounded-xl bg-card shadow-lg animate-in fade-in slide-in-from-top-2"
        )}>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Palette className="h-3 w-3" /> Brand Theme
                </label>
                <div className="flex gap-2">
                    {themes.map((t) => (
                        <button
                            key={t.name}
                            onClick={() => setTheme(t.name)}
                            className={cn(
                                "h-8 w-8 rounded-full border-2 transition-all hover:scale-110",
                                t.color,
                                theme === t.name ? "border-foreground scale-110 shadow-md" : "border-transparent"
                            )}
                            title={t.name}
                        />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    {mode === 'light' ? <Sun className="h-3 w-3" /> : mode === 'dark' ? <Moon className="h-3 w-3" /> : <Monitor className="h-3 w-3" />} Appearance
                </label>
                <div className="flex gap-1 bg-muted p-1 rounded-lg">
                    {modes.map((m) => (
                        <Button
                            key={m.name}
                            variant={mode === m.name ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setMode(m.name)}
                            className="flex-1 capitalize text-[10px] gap-1 px-2"
                        >
                            {m.icon}
                            {m.name}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme, Mode, ThemeContextType } from "@/types/theme";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("blue");
    const [mode, setModeState] = useState<Mode>("system");
    const [resolvedMode, setResolvedMode] = useState<"light" | "dark">("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme;
        const savedMode = localStorage.getItem("mode") as Mode;
        if (savedTheme) setThemeState(savedTheme);
        if (savedMode) setModeState(savedMode);
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;

        // Handle Mode
        let currentMode: "light" | "dark";
        if (mode === "system") {
            currentMode = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        } else {
            currentMode = mode;
        }

        setResolvedMode(currentMode);

        if (currentMode === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        // Handle Theme
        root.setAttribute("data-theme", theme);

        // Save to localStorage
        localStorage.setItem("theme", theme);
        localStorage.setItem("mode", mode);
    }, [theme, mode]);

    const setTheme = (t: Theme) => setThemeState(t);
    const setMode = (m: Mode) => setModeState(m);

    return (
        <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, resolvedMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

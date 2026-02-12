export type Theme = "blue" | "green" | "purple";
export type Mode = "light" | "dark" | "system";

export interface ThemeContextType {
    theme: Theme;
    mode: Mode;
    setTheme: (theme: Theme) => void;
    setMode: (mode: Mode) => void;
    resolvedMode: "light" | "dark";
}

"use client";

import React from "react";
import { Check, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ChapterCardProps {
    id: string;
    title: string;
    timestamp: string;
    completed: boolean;
    onToggle: (id: string) => void;
    onWatch?: (timestamp: string) => void;
}

export function ChapterCard({ id, title, timestamp, completed, onToggle, onWatch }: ChapterCardProps) {
    return (
        <div
            onClick={() => onToggle(id)}
            className={cn(
                "group flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md",
                completed
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border hover:bg-accent/5"
            )}
        >
            <div
                className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                    completed
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-muted-foreground/30 group-hover:border-primary/50"
                )}
            >
                <AnimatePresence>
                    {completed && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                        >
                            <Check className="h-4 w-4" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                    {timestamp}
                </span>
                <h4
                    className={cn(
                        "text-sm font-semibold truncate transition-all",
                        completed ? "text-muted-foreground line-through" : "text-foreground"
                    )}
                >
                    {title}
                </h4>
            </div>

            {onWatch && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onWatch(timestamp);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground focus:opacity-100"
                    title="Watch chapter"
                >
                    <Play className="h-4 w-4 fill-current" />
                </button>
            )}
        </div>
    );
}

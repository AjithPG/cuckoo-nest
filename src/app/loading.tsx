"use client";

import React from "react";

export default function Loading() {
    return (
        <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-6">
                <div className="relative h-16 w-16">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-lg font-bold tracking-tight">Cuckoo Nest</p>
                    <p className="text-xs text-muted-foreground animate-pulse">Organizing your learning journey...</p>
                </div>
            </div>
        </div>
    );
}

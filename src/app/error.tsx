"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RotateCcw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 p-12 text-center animate-in fade-in zoom-in-95">
            <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
                <AlertCircle className="h-10 w-10" />
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">Something went wrong</h2>
            <p className="mb-8 max-w-[400px] text-muted-foreground">
                We encountered an error while processing your request. Please try again or contact support if the problem persists.
            </p>
            <div className="flex gap-4">
                <Button variant="outline" onClick={() => window.location.reload()}>
                    Refresh Page
                </Button>
                <Button onClick={() => reset()} className="gap-2">
                    <RotateCcw className="h-4 w-4" /> Try Again
                </Button>
            </div>
        </div>
    );
}

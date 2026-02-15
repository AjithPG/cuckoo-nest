"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { MainLayout } from "@/components/common/MainLayout";
import { Github, Mail, ArrowRight, Loader2 } from "lucide-react";

function LoginContent() {
    const searchParams = useSearchParams();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        if (searchParams.get("mode") === "signup") {
            setIsSignUp(true);
        }
    }, [searchParams, setIsSignUp]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) {
                alert(error.message);
            } else {
                alert("Account created successfully! You can now log in.");
                setIsSignUp(false); // Switch to login mode
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) {
                alert(error.message);
            } else {
                const returnTo = searchParams.get("returnTo") || "/";
                window.location.href = returnTo;
            }
        }
        setIsLoading(false);
    };

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <Card className="w-full max-w-md border-2 shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-3xl font-extrabold">
                        {isSignUp ? "Create an account" : "Welcome back"}
                    </CardTitle>
                    <CardDescription>
                        {isSignUp
                            ? "Sign up to start tracking your learning progress"
                            : "Login to resume your learning journey"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-1 gap-4">
                        <Button variant="outline" onClick={handleGoogleLogin} className="gap-2 h-12 hover:bg-muted transition-colors">
                            <Github className="h-5 w-5" />
                            Continue with Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>
                    <form onSubmit={handleAuth} className="grid gap-3">
                        <div className="grid gap-2">
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-12"
                            />
                        </div>
                        <Button type="submit" className="h-12 font-bold gap-2 group" disabled={isLoading}>
                            {isLoading
                                ? (isSignUp ? "Creating account..." : "Signing in...")
                                : (isSignUp ? "Sign Up" : "Sign In")}
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </form>
                    <div className="text-center text-sm mt-2">
                        {isSignUp ? (
                            <p>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setIsSignUp(false)}
                                    className="font-bold text-primary hover:underline underline-offset-4"
                                >
                                    Log in
                                </button>
                            </p>
                        ) : (
                            <p>
                                Don't have an account?{" "}
                                <button
                                    onClick={() => setIsSignUp(true)}
                                    className="font-bold text-primary hover:underline underline-offset-4"
                                >
                                    Sign up
                                </button>
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <MainLayout>
            <Suspense fallback={
                <div className="flex min-h-[80vh] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }>
                <LoginContent />
            </Suspense>
        </MainLayout>
    );
}

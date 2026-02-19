"use client";

import { useSearchParams } from "next/navigation";
import { SignIn, SignUp } from "@clerk/nextjs";
import { MainLayout } from "@/components/common/MainLayout";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

function AuthContent() {
    const searchParams = useSearchParams();
    const isSignUp = searchParams.get("mode") === "signup";

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            {isSignUp ? (
                <SignUp
                    routing="hash"
                    signInUrl="/login"
                    forceRedirectUrl={searchParams.get("returnTo") || "/"}
                />
            ) : (
                <SignIn
                    routing="hash"
                    signUpUrl="/login?mode=signup"
                    forceRedirectUrl={searchParams.get("returnTo") || "/"}
                />
            )}
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
                <AuthContent />
            </Suspense>
        </MainLayout>
    );
}

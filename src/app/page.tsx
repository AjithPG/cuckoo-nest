"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/common/MainLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Youtube, ArrowRight, Sparkles, Play, Shield, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleGenerate = () => {
    const videoId = extractVideoId(url);
    if (!videoId) {
      alert("Please enter a valid YouTube URL");
      return;
    }

    setIsLoading(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsLoading(false);
      router.push(`/courses/${videoId}`);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12 md:py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 animate-bounce">
          <Sparkles className="h-3 w-3" />
          <span>New: AI-Powered Auto-Chaptering</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-[800px] leading-tight">
          Turn YouTube tutorials into <span className="text-primary italic">structured learning</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-[650px]">
          The most focused way to learn from long video tutorials. Paste a link and start checking off your progress.
        </p>

        <div className="w-full max-w-[700px] flex flex-col sm:flex-row gap-3 p-2 bg-card border rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="relative flex-1">
            <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Paste YouTube tutorial URL here..."
              className="pl-12 h-14 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <Button
            size="lg"
            className="h-14 px-8 gap-2 group"
            onClick={handleGenerate}
            disabled={isLoading || !url}
          >
            {isLoading ? "Analyzing..." : "Generate Checkpoints"}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-4 text-xs text-muted-foreground">
          <span>Example:</span>
          <button
            className="hover:text-primary underline"
            onClick={() => setUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
          >
            React Masterclass 2024
          </button>
          <span>•</span>
          <button className="hover:text-primary underline">Designing with Tailwind</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            {
              icon: Play,
              title: "Smart Checkpoints",
              desc: "Automatically detect chapters or create your own custom timestamps."
            },
            {
              icon: Zap,
              title: "Progress Tracking",
              desc: "Save your spot and see exactly how much you've learned."
            },
            {
              icon: Shield,
              title: "Focused Learning",
              desc: "A clean, distraction-free interface built for deep work."
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-none shadow-none hover:bg-card/80 transition-colors">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

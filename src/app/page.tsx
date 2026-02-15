"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/common/MainLayout";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { TvMinimalPlay, ArrowRight, Sparkles, Play, Shield, Zap, Loader2 } from "lucide-react";
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
    // Directly push to the course page, which now handles real ingestion via Server Actions
    router.push(`/courses/${videoId}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center py-12 md:py-24 text-center px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-6 animate-bounce">
          <Sparkles className="h-3 w-3" />
          <span>Streamlined Learning</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-[800px] leading-tight">
          Turn YouTube tutorials into <span className="text-primary italic">structured courses</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-[650px]">
          The most focused way to learn from long video tutorials. Paste a link and start tracking your progress instantly.
        </p>

        <div className="w-full max-w-[700px] flex flex-col sm:flex-row gap-3 p-2 bg-card border rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <div className="relative flex-1">
            <TvMinimalPlay className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Paste YouTube tutorial URL here..."
              className="pl-12 h-14 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <Button
            size="lg"
            className="h-14 px-8 gap-2 group min-w-[180px]"
            onClick={handleGenerate}
            disabled={isLoading || !url}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Generate Path
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
          {[
            {
              icon: Play,
              title: "AI Ingestion",
              desc: "Automatically detect chapters and metadata directly from YouTube."
            },
            {
              icon: Zap,
              title: "Cloud Persistence",
              desc: "Save your progress to Supabase and resume from any device."
            },
            {
              icon: Shield,
              title: "Clean Interface",
              desc: "A distraction-free player optimized for focused study sessions."
            }
          ].map((feature, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-none shadow-none hover:bg-card/80 transition-colors">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

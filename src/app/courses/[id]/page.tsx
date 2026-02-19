"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MainLayout } from "@/components/common/MainLayout";
import { ChapterCard } from "@/components/features/ChapterCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
    RotateCcw,
    ChevronLeft,
    Clock,
    BookOpen,
    ArrowRight,
    Sparkles,
    PlusCircle,
    TvMinimalPlay,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getCoursePreview, enrollInCourse, toggleChapterCompletion } from "@/app/actions/course";
import { createClient } from "@/lib/supabase/client";

interface Chapter {
    id: string;
    title: string;
    timestamp: string;
    completed: boolean;
    order_index: number;
}

interface DBChapter {
    id: string;
    title: string;
    timestamp: string;
    order_index: number;
}

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    youtube_id: string;
    chapters: DBChapter[];
}

import { useAuth } from "@clerk/nextjs";

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: videoId } = React.use(params);
    const [course, setCourse] = useState<Course | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [startTime, setStartTime] = useState(0);

    const { userId, getToken } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            const token = await getToken({ template: "supabase" }) ?? undefined;
            const supabase = createClient(token);

            const { course: fetchedCourse, error, isStored } = await getCoursePreview(videoId);
            if (error) {
                console.error(error);
                setIsLoading(false);
                return;
            }

            setCourse(fetchedCourse);

            // Correctly check if the user is enrolled, not just if the course exists
            let enrolled = false;
            if (userId && isStored && fetchedCourse) {
                const { data: enrollment } = await supabase
                    .from("user_courses")
                    .select("id")
                    .eq("user_id", userId)
                    .eq("course_id", fetchedCourse.id)
                    .maybeSingle();
                enrolled = !!enrollment;
            }
            setIsSaved(enrolled);

            // Fetch user progress if logged in AND course is stored
            let progressMap: Record<string, boolean> = {};
            if (userId && enrolled && fetchedCourse) {
                const { data: progressData } = await supabase
                    .from("user_progress")
                    .select("chapter_id, is_completed")
                    .eq("user_id", userId);

                progressMap = (progressData || []).reduce((acc: Record<string, boolean>, curr: { chapter_id: string; is_completed: boolean }) => {
                    acc[curr.chapter_id] = curr.is_completed;
                    return acc;
                }, {});
            }

            const mappedChapters = (fetchedCourse?.chapters || []).map((ch: DBChapter) => ({
                id: ch.id,
                title: ch.title,
                timestamp: ch.timestamp,
                completed: progressMap[ch.id] || false,
                order_index: ch.order_index
            })).sort((a, b) => a.order_index - b.order_index);

            setChapters(mappedChapters);
            setIsLoading(false);
        };

        init();
    }, [videoId, userId, getToken]);

    const toggleChapter = async (id: string) => {
        const chapter = chapters.find(c => c.id === id);
        if (!chapter) return;

        const newStatus = !chapter.completed;

        // Optimistic update for all users (guests and authenticated)
        setChapters(prev => prev.map(c => c.id === id ? { ...c, completed: newStatus } : c));

        // Only persist to DB if user is logged in AND course is saved
        if (userId && isSaved) {
            try {
                await toggleChapterCompletion(id, newStatus);
            } catch (error) {
                console.error(error);
                // Rollback on error
                setChapters(prev => prev.map(c => c.id === id ? { ...c, completed: !newStatus } : c));
            }
        }
    };

    const handleWatch = (timeStr: string) => {
        const parts = timeStr.split(":").map(Number);
        let seconds = 0;
        if (parts.length === 3) {
            seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            seconds = parts[0] * 60 + parts[1];
        }
        setStartTime(seconds);
        // Scroll to video
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const progress = useMemo(() => {
        if (chapters.length === 0) return 0;
        const completedCount = chapters.filter(c => c.completed).length;
        return Math.round((completedCount / chapters.length) * 100);
    }, [chapters]);

    const handleReset = async () => {
        if (!userId) return;

        const resetChapters = chapters.map(c => ({ ...c, completed: false }));
        setChapters(resetChapters);
        setIsSubmitted(false);

        // In a real app, you'd have a bulk reset action
        for (const ch of chapters) {
            if (ch.completed) {
                await toggleChapterCompletion(ch.id, false);
            }
        }
    };

    const handleSubmit = () => {
        if (!userId) {
            router.push(`/login?mode=signup&returnTo=/courses/${videoId}`);
            return;
        }

        if (progress < 100) {
            alert("Please complete all checkpoints before submitting!");
            return;
        }
        setIsSubmitted(true);
    };

    const handleSaveToLearning = async () => {
        if (!userId) {
            router.push(`/login?mode=signup&returnTo=/courses/${videoId}`);
            return;
        }

        setIsSaving(true);
        try {
            await enrollInCourse(videoId);
            setIsSaved(true);

            // Refresh course data to get DB IDs for chapters
            const { course: refreshedCourse } = await getCoursePreview(videoId);
            if (refreshedCourse) {
                setCourse(refreshedCourse);
                const mappedChapters = refreshedCourse.chapters.map((ch: DBChapter) => ({
                    id: ch.id,
                    title: ch.title,
                    timestamp: ch.timestamp,
                    completed: false,
                    order_index: ch.order_index
                })).sort((a, b) => a.order_index - b.order_index);
                setChapters(mappedChapters);
            }
        } catch (error: unknown) {
            const message = error instanceof Error
                ? error.message
                : (typeof error === 'object' && error !== null && 'message' in error)
                    ? (error as { message: string }).message
                    : "Failed to save course";
            alert(message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <MainLayout>
                <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse font-medium">
                        Building your course checkpoints...
                    </p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ChevronLeft className="h-4 w-4" /> Exit Course
                        </Button>
                    </Link>
                    <Button
                        variant={isSaved ? "secondary" : "outline"}
                        size="sm"
                        className="gap-2"
                        onClick={handleSaveToLearning}
                        disabled={isSaved || isSaving}
                    >
                        {isSaving ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                        ) : isSaved ? (
                            <><Sparkles className="h-4 w-4 text-primary" /> Saved to Learning</>
                        ) : (
                            <><PlusCircle className="h-4 w-4" /> Add to My Learning</>
                        )}
                    </Button>
                </div>
                {isSubmitted && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold animate-pulse">
                        <Sparkles className="h-3 w-3" /> Course Completed!
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column - Video Info */}
                <div className="lg:col-span-12 xl:col-span-7 space-y-6">
                    <div className="aspect-video w-full bg-black rounded-2xl overflow-hidden shadow-2xl relative">
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}?start=${startTime}&autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0"
                        />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            {course?.title || "Loading Course..."}
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                                <TvMinimalPlay className="h-4 w-4 text-red-500" /> YouTube Tutorial
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" /> Comprehensive
                            </div>
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="h-4 w-4" /> {chapters.length} Checkpoints
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed line-clamp-4">
                            {course?.description || "Extracting video details and chapters..."}
                        </p>
                    </div>
                </div>

                {/* Right Column - Chapters */}
                <div className="lg:col-span-12 xl:col-span-5">
                    <Card className="sticky top-24 border-none shadow-none lg:border lg:shadow-sm bg-transparent lg:bg-card">
                        <CardContent className="p-0 lg:p-6 space-y-6">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-lg">Your Progress</h3>
                                    <span className="text-sm font-bold text-primary">{progress}%</span>
                                </div>
                                <div className="relative h-2.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                        className="absolute inset-y-0 left-0 bg-primary"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2">
                                    {chapters.filter(c => c.completed).length} of {chapters.length} milestones reached
                                </p>
                            </div>

                            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
                                {chapters.map((chapter) => (
                                    <ChapterCard
                                        key={chapter.id}
                                        {...chapter}
                                        onToggle={toggleChapter}
                                        onWatch={handleWatch}
                                    />
                                ))}
                                {chapters.length === 0 && (
                                    <div className="py-8 text-center text-muted-foreground">
                                        No checkpoints detected in video description.
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex flex-col gap-3">
                                <Button
                                    className={cn(
                                        "w-full h-12 text-sm font-bold gap-2 transition-all group",
                                        progress === 100 && !isSubmitted && "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
                                    )}
                                    disabled={progress < 100 || isSubmitted}
                                    onClick={handleSubmit}
                                >
                                    {isSubmitted ? "Submitted Successfully" : "Final Submit & Complete"}
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={handleReset}>
                                    <RotateCcw className="h-3 w-3 mr-2" /> Reset Progress
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
}

"use client";

import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/common/MainLayout";
import { ChapterCard } from "@/components/features/ChapterCard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import {
    RotateCcw,
    ChevronLeft,
    Youtube,
    Clock,
    BookOpen,
    ArrowRight,
    Sparkles,
    PlusCircle,
    TvMinimalPlay
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addCourse, updateCourseProgress } from "@/store/slices/coursesSlice";
import { RootState } from "@/store";

const MOCK_CHAPTERS = [
    { id: "1", title: "Introduction & Setup", timestamp: "00:00", completed: true },
    { id: "2", title: "Project Architecture", timestamp: "05:12", completed: false },
    { id: "3", title: "Theme System Implementation", timestamp: "12:45", completed: false },
    { id: "4", title: "State Management with Redux", timestamp: "25:30", completed: false },
    { id: "5", title: "Building Reusable UI Components", timestamp: "42:15", completed: false },
    { id: "6", title: "API Integration & React Query", timestamp: "58:20", completed: false },
    { id: "7", title: "Performance Optimization", timestamp: "1:12:05", completed: false },
    { id: "8", title: "Final Deployment", timestamp: "1:30:00", completed: false },
];

export default function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id: videoId } = React.use(params);

    const [chapters, setChapters] = useState(MOCK_CHAPTERS);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const dispatch = useAppDispatch();
    const savedCourses = useAppSelector((state: RootState) => state.courses.savedCourses);


    const isSaved = savedCourses.some(c => c.id === videoId);

    const toggleChapter = (id: string) => {
        const updatedChapters = chapters.map(c =>
            c.id === id ? { ...c, completed: !c.completed } : c
        );
        setChapters(updatedChapters);

        // Sync progress with Redux if course is saved
        if (isSaved) {
            const completedCount = updatedChapters.filter(c => c.completed).length;
            const calculatedProgress = Math.round((completedCount / updatedChapters.length) * 100);
            dispatch(updateCourseProgress({
                id: videoId,
                progress: calculatedProgress,
                completedChapters: completedCount,
            }));
        }
    };

    const progress = useMemo(() => {
        const completedCount = chapters.filter(c => c.completed).length;
        return Math.round((completedCount / chapters.length) * 100);
    }, [chapters]);

    const handleReset = () => {
        const resetChapters = chapters.map(c => ({ ...c, completed: false }));
        setChapters(resetChapters);
        setIsSubmitted(false);

        if (isSaved) {
            dispatch(updateCourseProgress({
                id: videoId,
                progress: 0,
                completedChapters: 0,
            }));
        }
    };

    const handleSubmit = () => {
        if (progress < 100) {
            alert("Please complete all checkpoints before submitting!");
            return;
        }
        setIsSubmitted(true);

        // Ensure 100% progress is recorded
        if (isSaved) {
            dispatch(updateCourseProgress({
                id: videoId,
                progress: 100,
                completedChapters: chapters.length,
            }));
        }
    };

    const handleSaveToLearning = () => {
        dispatch(addCourse({
            id: videoId,
            title: "Enterprise React Architecture Masterclass 2026",
            progress: progress,
            duration: "1:45:00",
            totalChapters: chapters.length,
            completedChapters: chapters.filter(c => c.completed).length,
            addedAt: new Date().toISOString(),
        }));
    };

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
                        disabled={isSaved}
                    >
                        {isSaved ? (
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
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="absolute inset-0"
                        />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                            Enterprise React Architecture Masterclass 2026
                        </h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                                <TvMinimalPlay className="h-4 w-4 text-red-500" /> YouTube Tutorial
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" /> 1h 45m total
                            </div>
                            <div className="flex items-center gap-1.5">
                                <BookOpen className="h-4 w-4" /> 8 Checkpoints
                            </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                            In this deep-dive tutorial, we explore how to build and scale production-ready React applications using Next.js, TypeScript, and modern design system principles. Check off each section as you master the concepts.
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
                                    />
                                ))}
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

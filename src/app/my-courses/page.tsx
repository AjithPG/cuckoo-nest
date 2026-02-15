"use client";

import React from "react";
import { MainLayout } from "@/components/common/MainLayout";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Book, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { removeCourse } from "@/store/slices/coursesSlice";
import { cn } from "@/lib/utils";

export default function MyCoursesPage() {
    const savedCourses = useAppSelector((state: RootState) => state.courses.savedCourses);
    const dispatch = useAppDispatch();

    return (
        <MainLayout>
            <div className="space-y-8 max-w-[1100px] mx-auto animate-in fade-in duration-700 p-4">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center text-primary">
                        <Book className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        My Courses
                        <span className="text-muted-foreground font-normal text-2xl mt-1">
                            ({savedCourses.length})
                        </span>
                    </h1>
                </div>

                {savedCourses.length === 0 ? (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 p-12 text-center animate-in zoom-in-95">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                            <PlayCircle className="h-10 w-10" />
                        </div>
                        <h2 className="text-xl font-bold">No courses yet</h2>
                        <p className="mb-8 max-w-[300px] text-muted-foreground">
                            Paste a YouTube link on the home page to generate your first learning path.
                        </p>
                        <Link href="/">
                            <Button size="lg">Start Learning</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {savedCourses.map((course, index) => (
                                <motion.div
                                    key={course.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] bg-card/50 backdrop-blur-sm border border-border/50">
                                        <CardHeader className="p-0 border-none">
                                            <div className="aspect-[16/9] w-full bg-muted relative overflow-hidden">
                                                <img
                                                    src={`https://img.youtube.com/vi/${course.id}/maxresdefault.jpg`}
                                                    alt={course.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${course.id}/mqdefault.jpg`;
                                                    }}
                                                />
                                                {course.progress === 100 && (
                                                    <div className="absolute top-3 right-3 bg-green-600/90 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider flex items-center gap-1 shadow-lg animate-in zoom-in-75">
                                                        <Sparkles className="h-3 w-3" /> Completed
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"></div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-4">
                                            <h3 className="text-[17px] font-semibold leading-snug line-clamp-2 h-12 text-foreground/90">
                                                {course.title}
                                            </h3>

                                            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
                                                <span>{course.duration}</span>
                                                <span>•</span>
                                                <span>{course.completedChapters} / {course.totalChapters} chapters</span>
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <div className="h-[6px] w-full bg-muted/60 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${course.progress}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="h-full bg-primary"
                                                    />
                                                </div>
                                                <p className="text-[13px] text-muted-foreground/80 font-medium">
                                                    {course.progress}% complete
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3 pt-4">
                                                <Link href={`/courses/${course.id}`} className="flex-1">
                                                    <Button className={cn(
                                                        "w-full font-bold h-12 rounded-xl border-none shadow-md hover:shadow-lg transition-all active:scale-[0.98]",
                                                        course.progress === 100
                                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                                            : "bg-[#0891b2] hover:bg-[#0e7490] text-white"
                                                    )}>
                                                        {course.progress === 100 ? "Re-visit Course" : "Continue Learning"}
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors border border-border/50"
                                                    onClick={() => dispatch(removeCourse(course.id))}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

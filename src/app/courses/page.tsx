"use client";

import React, { useState, useMemo } from "react";
import { MainLayout } from "@/components/common/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Compass, Search, Filter, PlayCircle, ArrowRight, Youtube } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";

const CATEGORIES = ["All", "Frontend", "Backend", "Design", "DevOps", "AI"];

const COURSES = [
    {
        id: "H629zSxcW8k",
        title: "Complete React Tutorial - Build Modern Web Apps",
        topic: "Frontend",
        duration: "2:45:30",
        totalChapters: 12,
    },
    {
        id: "0LhB1DsszXo",
        title: "Next.js 15 Full Course: Performance & RSC",
        topic: "Frontend",
        duration: "4:20:15",
        totalChapters: 18,
    },
    {
        id: "G_kSXI4E4Ew",
        title: "Node.js & Express: Building Scalable APIs",
        topic: "Backend",
        duration: "3:12:45",
        totalChapters: 15,
    },
    {
        id: "u418zSxcW9k",
        title: "Figma to Code: Professional UI Design Systems",
        topic: "Design",
        duration: "1:55:00",
        totalChapters: 8,
    },
    {
        id: "pS-7D5XvYpY",
        title: "Docker & Kubernetes for Absolute Beginners",
        topic: "DevOps",
        duration: "5:30:00",
        totalChapters: 22,
    },
    {
        id: "zR6XN2L9E5M",
        title: "Generative AI with Python & LangChain",
        topic: "AI",
        duration: "2:10:30",
        totalChapters: 10,
    }
];

export default function CoursesCatalogPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCourses = useMemo(() => {
        return COURSES.filter(course => {
            const matchesCategory = activeCategory === "All" || course.topic === activeCategory;
            const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    return (
        <MainLayout>
            <div className="space-y-8 max-w-[1100px] mx-auto animate-in fade-in duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex items-center justify-center text-primary">
                            <Compass className="h-8 w-8" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Explore Tutorials</h1>
                            <p className="text-sm text-muted-foreground mt-1">Discover structured learning paths for your next skill.</p>
                        </div>
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tutorials..."
                            className="pl-9 bg-card/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                    <Filter className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all shrink-0 ${activeCategory === cat
                                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                                    : "bg-muted text-muted-foreground hover:bg-accent"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Listing */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((course, index) => (
                            <motion.div
                                key={course.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[24px] bg-card/50 backdrop-blur-sm border border-border/50 h-full flex flex-col">
                                    <CardHeader className="p-0 border-none">
                                        <div className="aspect-[16/9] w-full bg-muted relative overflow-hidden">
                                            <img
                                                src={`https://img.youtube.com/vi/${course.id}/mqdefault.jpg`}
                                                alt={course.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase font-bold px-2 py-1 rounded-md tracking-wider">
                                                {course.topic}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                                        <h3 className="text-[17px] font-semibold leading-snug line-clamp-2 h-12 text-foreground/90">
                                            {course.title}
                                        </h3>

                                        <div className="flex items-center gap-2 text-[13px] text-muted-foreground mt-auto">
                                            <span>{course.duration}</span>
                                            <span>•</span>
                                            <span>{course.totalChapters} chapters</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                            <Youtube className="h-3.5 w-3.5 text-red-500" />
                                            <span>YouTube Learning Track</span>
                                        </div>

                                        <div className="pt-4 mt-auto">
                                            <Link href={`/courses/${course.id}`}>
                                                <Button className="w-full bg-[#0891b2] hover:bg-[#0e7490] text-white font-bold h-12 rounded-xl border-none shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                                                    View Course
                                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredCourses.length === 0 && (
                    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card/50 p-12 text-center animate-in zoom-in-95">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                            <PlayCircle className="h-10 w-10" />
                        </div>
                        <h2 className="text-xl font-bold">No tutorials found</h2>
                        <p className="mb-8 max-w-[300px] text-muted-foreground">
                            Try adjusting your search or category filters to find what you're looking for.
                        </p>
                        <Button variant="outline" onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}>
                            Reset Filters
                        </Button>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}

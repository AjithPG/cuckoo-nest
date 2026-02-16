"use server";

import { createClient } from "@/lib/supabase/server";
import { fetchVideoDetails } from "@/services/youtube";
import { revalidatePath } from "next/cache";

// Define types for better clarity
interface Chapter {
    id: string;
    title: string;
    timestamp: string;
    order_index: number;
    course_id: string;
}

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    youtube_id: string;
    chapters: Chapter[];
}

/**
 * Fetches course details from Supabase if existed, 
 * otherwise fetches from YouTube without saving to DB.
 */
export async function getCoursePreview(youtubeId: string): Promise<{ course: Course | null; error: string | null; isStored: boolean }> {
    const supabase = await createClient();

    // 1. Check if course exists in DB
    const { data: existingCourse } = await supabase
        .from("courses")
        .select("*, chapters(*)")
        .eq("youtube_id", youtubeId)
        .single();

    if (existingCourse) {
        return { course: existingCourse as Course, error: null, isStored: true };
    }

    // 2. If not in DB, fetch from YouTube API for preview (Unstored)
    try {
        const videoDetails = await fetchVideoDetails(youtubeId);

        const previewCourse: Course = {
            id: "", // No DB ID yet
            title: videoDetails.title,
            description: videoDetails.description,
            thumbnail_url: videoDetails.thumbnailUrl,
            youtube_id: videoDetails.id,
            chapters: videoDetails.chapters.map(ch => ({
                id: "",
                title: ch.title,
                timestamp: ch.timestamp,
                order_index: ch.order,
                course_id: ""
            }))
        };

        return { course: previewCourse, error: null, isStored: false };
    } catch (error) {
        console.error("Course preview error:", error);
        return { course: null, error: error instanceof Error ? error.message : "Failed to fetch video details", isStored: false };
    }
}

/**
 * Atomically saves course, chapters, and enrolls user.
 */
export async function enrollInCourse(youtubeId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Authentication required");

    // 1. Check if already exists
    let { data: course } = await supabase
        .from("courses")
        .select("id")
        .eq("youtube_id", youtubeId)
        .single();

    if (!course) {
        // Need to fetch details to save
        const videoDetails = await fetchVideoDetails(youtubeId);

        // Insert Course
        const { data: newCourse, error: courseError } = await supabase
            .from("courses")
            .insert({
                title: videoDetails.title,
                description: videoDetails.description,
                thumbnail_url: videoDetails.thumbnailUrl,
                youtube_id: youtubeId,
            })
            .select()
            .single();

        if (courseError) {
            // If it failed because it was just inserted by someone else, try to fetch it
            const { data: retryCourse } = await supabase
                .from("courses")
                .select("id")
                .eq("youtube_id", youtubeId)
                .single();

            if (retryCourse) {
                course = retryCourse;
            } else {
                throw new Error(`Course creation failed: ${courseError.message}`);
            }
        } else if (!newCourse) {
            throw new Error("Failed to create course");
        } else {
            course = newCourse;
        }

        // Insert Chapters if it was a new course creation in this request
        if (newCourse && videoDetails.chapters.length > 0) {
            const chaptersToInsert = videoDetails.chapters.map((chap) => ({
                course_id: newCourse.id,
                title: chap.title,
                timestamp: chap.timestamp,
                order_index: chap.order,
            }));

            const { error: chapterError } = await supabase
                .from("chapters")
                .insert(chaptersToInsert);

            if (chapterError) throw new Error(`Chapter creation failed: ${chapterError.message}`);
        }
    }

    if (!course) throw new Error("Could not find or create course");

    // 2. Create Enrollment
    const { error: enrollmentError } = await supabase
        .from("user_courses")
        .upsert({
            user_id: user.id,
            course_id: course.id,
        }, { onConflict: 'user_id,course_id' });

    if (enrollmentError) throw new Error(`Enrollment failed: ${enrollmentError.message}`);

    revalidatePath(`/courses/${youtubeId}`);
    revalidatePath("/my-courses");

    return { success: true, courseId: course.id };
}

export async function toggleChapterCompletion(chapterId: string, isCompleted: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Authentication required");

    // Note: If chapterId is empty (preview mode), this will fail, 
    // but the UI should prevent clicking checkboxes in preview mode.
    const { error } = await supabase
        .from("user_progress")
        .upsert({
            user_id: user.id,
            chapter_id: chapterId,
            is_completed: isCompleted,
        }, {
            onConflict: 'user_id,chapter_id'
        });

    if (error) throw error;
    return { success: true };
}

/**
 * Unenroll user from course and delete all associated progress.
 */
export async function unenrollFromCourse(courseId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Authentication required" };

    try {
        // 1. Get all chapter IDs for this course
        const { data: chapters } = await supabase
            .from("chapters")
            .select("id")
            .eq("course_id", courseId);

        // 2. Delete enrollment record (This needs to be done first if there are foreign key constraints, 
        // or last? Usually Foreign Keys cascade or restrict. 
        // Let's assume user_progress references chapters or user_courses? 
        // user_progress ref chapters. chapters ref courses.
        // user_courses ref courses.
        // So deleting user_courses is independent of user_progress usually 
        // UNLESS user_progress depends on user_courses (unlikely).
        // BUT, better to delete progress first to be clean.

        // 2. Delete all progress records for these chapters
        if (chapters && chapters.length > 0) {
            const chapterIds = chapters.map(ch => ch.id);
            const { error: progressError } = await supabase
                .from("user_progress")
                .delete()
                .eq("user_id", user.id)
                .in("chapter_id", chapterIds);

            if (progressError) {
                console.error("Progress delete error:", progressError);
                return { success: false, error: `Progress deletion failed: ${progressError.message}` };
            }
        }

        // 3. Delete enrollment record
        const { error: enrollmentError } = await supabase
            .from("user_courses")
            .delete()
            .eq("user_id", user.id)
            .eq("course_id", courseId);

        if (enrollmentError) {
            console.error("Enrollment delete error:", enrollmentError);
            return { success: false, error: `Unenrollment failed: ${enrollmentError.message}` };
        }

        revalidatePath("/my-courses");
        return { success: true };
    } catch (error) {
        console.error("Unenrollment Server Error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "An unexpected error occurred during unenrollment"
        };
    }
}

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SavedCourse {
    id: string;
    title: string;
    thumbnail?: string;
    progress: number;
    duration: string;
    totalChapters: number;
    completedChapters: number;
    addedAt: string;
}

interface CoursesState {
    savedCourses: SavedCourse[];
}

const initialState: CoursesState = {
    savedCourses: [],
};

const coursesSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        addCourse: (state, action: PayloadAction<SavedCourse>) => {
            const exists = state.savedCourses.find(c => c.id === action.payload.id);
            if (!exists) {
                state.savedCourses.push(action.payload);
            }
        },
        removeCourse: (state, action: PayloadAction<string>) => {
            state.savedCourses = state.savedCourses.filter(c => c.id !== action.payload);
        },
        updateCourseProgress: (state, action: PayloadAction<{ id: string; progress: number; completedChapters: number }>) => {
            const course = state.savedCourses.find(c => c.id === action.payload.id);
            if (course) {
                course.progress = action.payload.progress;
                course.completedChapters = action.payload.completedChapters;
            }
        },
    },
});

export const { addCourse, removeCourse, updateCourseProgress } = coursesSlice.actions;
export default coursesSlice.reducer;

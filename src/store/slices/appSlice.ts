import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
    sidebarOpen: boolean;
    activeVideoId: string | null;
}

const initialState: AppState = {
    sidebarOpen: false,
    activeVideoId: null,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpen = !state.sidebarOpen;
        },
        setSidebar: (state, action: PayloadAction<boolean>) => {
            state.sidebarOpen = action.payload;
        },
        setActiveVideo: (state, action: PayloadAction<string | null>) => {
            state.activeVideoId = action.payload;
        },
    },
});

export const { toggleSidebar, setSidebar, setActiveVideo } = appSlice.actions;
export default appSlice.reducer;

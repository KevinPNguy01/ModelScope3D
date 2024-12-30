import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        fov: 45,
        showGrids: true,
        showAxes: true,
        showSidePanel: true
    },
    reducers: {
        setFov: (state, action: PayloadAction<number>) => {
            state.fov = action.payload;
        },
        toggleShowGrids: (state) => {
            state.showGrids = !state.showGrids;  
        },
        toggleShowAxes: (state) => {
            state.showAxes = !state.showAxes;  
        },
        toggleShowSidePanel: (state) => {
            state.showSidePanel = !state.showSidePanel;  
        }
    }
});

export const {setFov, toggleShowGrids, toggleShowAxes, toggleShowSidePanel} = settingsSlice.actions;
export default settingsSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        showGrids: true,
        showAxes: true
    },
    reducers: {
        toggleShowGrids: (state) => {
            state.showGrids = !state.showGrids;  
        },
        toggleShowAxes: (state) => {
            state.showAxes = !state.showAxes;  
        }
    }
});

export const {toggleShowGrids, toggleShowAxes} = settingsSlice.actions;
export default settingsSlice.reducer;
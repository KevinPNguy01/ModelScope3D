import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        fov: 10,
        showGrids: true,
        showAxes: true
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
        }
    }
});

export const {setFov, toggleShowGrids, toggleShowAxes} = settingsSlice.actions;
export default settingsSlice.reducer;
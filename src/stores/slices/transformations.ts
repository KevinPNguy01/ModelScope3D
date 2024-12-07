import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const transformationsSlice = createSlice({
    name: "transformations",
    initialState: {
        position: [0, 0, 0],
        scale: [0, 0, 0, 1],
        rotation: [0, 0, 0]
    },
    reducers: {
        setPosition: (state, action: PayloadAction<number[]>) => {
            state.position = action.payload;
        },
        setScale: (state, action: PayloadAction<number[]>) => {
            state.scale = action.payload;
        },
        setRotation: (state, action: PayloadAction<number[]>) => {
            state.rotation = action.payload;
        }
    }
});

export const {setPosition, setScale, setRotation} = transformationsSlice.actions;
export default transformationsSlice.reducer;
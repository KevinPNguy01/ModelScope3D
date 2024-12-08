import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const transformationsSlice = createSlice({
    name: "transformations",
    initialState: {
        position: [0, -0.25, -1.5],
        scale: [1, 1, 1, 1],
        rotation: [0, 0, 0]
    },
    reducers: {
        setPosition: (state, action: PayloadAction<{value: number, index: number}>) => {
            const {value, index} = action.payload;
            state.position[index] = value;
        },
        setScale: (state, action: PayloadAction<{value: number, index: number}>) => {
            const {value, index} = action.payload;
            state.scale[index] = value;
        },
        setRotation: (state, action: PayloadAction<{value: number, index: number}>) => {
            const {value, index} = action.payload;
            state.rotation[index] = value;
        }
    }
});

export const {setPosition, setScale, setRotation} = transformationsSlice.actions;
export default transformationsSlice.reducer;
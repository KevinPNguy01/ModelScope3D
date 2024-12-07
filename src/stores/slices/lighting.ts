import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const lightingSlice = createSlice({
    name: "lighting",
    initialState: {
        position: [0, 0, 0],
        diffuseColor: [1, 1, 1],
        specularColor: [1, 1, 1],
        power: 1,
        ambientIntensity: 0.1,
        indexOfRefraction: 0.1,
        beta: 0.5
    },
    reducers: {
        setLightPosition: (state, action: PayloadAction<{value: number, index: number}>) => {
            const {value, index} = action.payload;
            state.position[index] = value;
        },
        setDiffuseColor: (state, action: PayloadAction<{value: number, index: number}>) => {
            const {value, index} = action.payload;
            state.diffuseColor[index] = value;
        },
        setSpecularColor: (state, action: PayloadAction<{value: number, index: number}>) => {
            const {value, index} = action.payload;
            state.specularColor[index] = value;
        },
        setPower: (state, action: PayloadAction<number>) => {
            state.power = action.payload;
        },
        setAmbientIntensity: (state, action: PayloadAction<number>) => {
            state.ambientIntensity = action.payload;
        },
        setIndexOfRefraction: (state, action: PayloadAction<number>) => {
            state.indexOfRefraction = action.payload;
        },
        setBeta: (state, action: PayloadAction<number>) => {
            state.beta = action.payload;
        }
    }
});

export const {setLightPosition, setDiffuseColor, setSpecularColor, setPower, setAmbientIntensity, setIndexOfRefraction, setBeta} = lightingSlice.actions;
export default lightingSlice.reducer;
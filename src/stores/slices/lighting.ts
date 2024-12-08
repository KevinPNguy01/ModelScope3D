import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const lightingSlice = createSlice({
    name: "lighting",
    initialState: {
        material: {
            ambient: [0, 0, 0],
            diffuse: [0, 0.5, 1],
            specular: [0.5, 0.5, 0.5],
            shininess: 32.0
        },
        dirLight: {
            direction: [-.1, -.1, -.1],
            color: [0.9, 0.9, 0.9],
        },
        pointLight: {
            position: [-1, 0, -2],
            constant: 1.0,
            linear: 0.7,
            quadratic: 1.8,
            color: [1, 0.5, 0],
        }
    },
    reducers: {
        updateStructUniform: (state, action: PayloadAction<{ parentKey: "material" | "dirLight" | "pointLight", key: keyof typeof state.material | keyof typeof state.dirLight | keyof typeof state.pointLight, index: number, value: number }>) => {
            const { parentKey, key, index, value } = action.payload;
            if (parentKey === "material") {
                const k = key as keyof typeof state.material;
                if (Array.isArray(state.material[k])) {
                    state.material[k][index] = value;
                } else {
                    state.material[k as "shininess"] = value;
                }
            } else if (parentKey === "dirLight") {
                const k = key as keyof typeof state.dirLight;
                state.dirLight[k][index] = value;
            } else {
                const k = key as keyof typeof state.pointLight;
                if (Array.isArray(state.pointLight[k])) {
                    state.pointLight[k][index] = value;
                } else {
                    state.pointLight[k as "constant" | "linear" | "quadratic"] = value;
                }
            }
        }
    }
});

export const {
    updateStructUniform,
} = lightingSlice.actions;

export default lightingSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const lightingSlice = createSlice({
    name: "lighting",
    initialState: {
        material: {
            albedo: [0.75, 0.75, 0.75],
            metallic: 0.04,
            roughness: 0.2,
            ao: 0.05
        },
        dirLight: {
            direction: [-.1, -.1, -.1],
            color: [0.9, 0.9, 0.9],
        },
        pointLight: {
            position: [-1, 0, 0],
            color: [0.9, 0.9, 0.9],
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
                    state.material[k as "metallic" | "roughness" | "ao"] = value;
                }
            }
            else if (parentKey === "pointLight") {
                const k = key as keyof typeof state.pointLight;
                state.pointLight[k][index] = value;
            } else {
                const k = key as keyof typeof state.dirLight;
                state.dirLight[k][index] = value;
            }
        }
    }
});

export const {
    updateStructUniform,
} = lightingSlice.actions;

export default lightingSlice.reducer;
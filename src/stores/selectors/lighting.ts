import { RootState } from "../../app/store";

export const selectMaterial = (state: RootState) => state.lighting.material;
export const selectDirLight = (state: RootState) => state.lighting.dirLight;
export const selectPointLight = (state: RootState) => state.lighting.pointLight;
import { RootState } from "../../app/store";

export const selectLightPosition = (state: RootState) => state.lighting.position;
export const selectDiffuseColor = (state: RootState) => state.lighting.diffuseColor;
export const selectSpecularColor = (state: RootState) => state.lighting.specularColor;
export const selectPower = (state: RootState) => state.lighting.power;
export const selectAmbientIntensity = (state: RootState) => state.lighting.ambientIntensity;
export const selectIndexOfRefraction = (state: RootState) => state.lighting.indexOfRefraction;
export const selectBeta = (state: RootState) => state.lighting.beta;
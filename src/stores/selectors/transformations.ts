import { RootState } from "../../app/store";

export const selectPosition = (state: RootState) => state.transformations.position;
export const selectScale = (state: RootState) => state.transformations.scale;
export const selectRotation = (state: RootState) => state.transformations.rotation;
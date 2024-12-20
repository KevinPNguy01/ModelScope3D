import { RootState } from "../../app/store";

export const selectFov = (state: RootState) => state.settings.fov;
export const selectShowGrids = (state: RootState) => state.settings.showGrids;
export const selectShowAxes = (state: RootState) => state.settings.showAxes;
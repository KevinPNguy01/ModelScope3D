import { RootState } from "../../app/store";

export const selectShowGrids = (state: RootState) => state.settings.showGrids;
export const selectShowAxes = (state: RootState) => state.settings.showAxes;

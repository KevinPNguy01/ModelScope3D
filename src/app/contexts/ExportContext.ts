import { createContext, MutableRefObject } from "react";

export const ExportContext = createContext({
    exportScreenshot: null as unknown as MutableRefObject<boolean>,
    exportSTL: null as unknown as MutableRefObject<boolean>
});
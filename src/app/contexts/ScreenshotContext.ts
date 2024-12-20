import { createContext, MutableRefObject } from "react";

export const ScreenshotContext = createContext<MutableRefObject<boolean>>(null as unknown as MutableRefObject<boolean>);
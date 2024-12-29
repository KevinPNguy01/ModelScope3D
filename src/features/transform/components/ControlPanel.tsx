import Tab from "@mui/material/Tab/Tab";
import Tabs from "@mui/material/Tabs/Tabs";
import { useEffect, useRef, useState } from "react";
import { CameraTab } from "./CameraTab";
import { LightingTab } from "./LightingTab";
import { ModelTab } from "./ModelTab";

export function ControlPanel() {
    const panelRef = useRef<HTMLDivElement>(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const handleMouseUp = () => panelRef.current!.classList.remove("pointer-events-none")
        document.addEventListener("mouseup", handleMouseUp);
        return () => document.removeEventListener("mouseup", handleMouseUp);
    }, []);

    return (
        <div
            ref={panelRef}
            onMouseDown={() => panelRef.current!.classList.add("pointer-events-none")}
            className="text-neutral-300 flex flex-col bg-secondary px-2 select-none"
        >
            <Tabs className="px-4" value={value} onMouseDown={(e) => e.stopPropagation()} onChange={(_, val) => setValue(val)}>
                <Tab label="Model"/>
                <Tab label="Light"/>
                <Tab label="Camera"/>
            </Tabs>
            <div hidden={value !== 0}>
                <ModelTab/>
            </div>
            <div hidden={value !== 1}>
                <LightingTab/>
            </div>
            <div hidden={value !== 2}>
                <CameraTab/>
            </div>
        </div>
    );
}
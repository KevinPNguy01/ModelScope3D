import { useEffect, useRef } from "react";
import { CameraTab } from "./CameraTab";
import { LightingTab } from "./LightingTab";
import { ModelTab } from "./ModelTab";

export function ControlPanel() {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseUp = () => panelRef.current!.classList.remove("pointer-events-none")
        document.addEventListener("mouseup", handleMouseUp);
        return () => document.removeEventListener("mouseup", handleMouseUp);
    }, []);

    return (
        <div
            ref={panelRef}
            onMouseDown={() => panelRef.current!.classList.add("pointer-events-none")}
            className="text-neutral-300 flex flex-col bg-secondary p-2 select-none"
        >
            <CameraTab/>
            <br/>
            <ModelTab/>
            <br/>
            <LightingTab/>
        </div>
    );
}
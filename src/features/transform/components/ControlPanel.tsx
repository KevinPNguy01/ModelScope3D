import { useEffect, useState } from "react";
import { TransformNumberInput } from "./NumberInput";

export function ControlPanel() {
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        const handleMouseUp = () => {
            setMouseDown(false);
        }

        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        }
    });

    return (
        <div
            onMouseDown={() => setMouseDown(true)}
            className="text-neutral-300 flex flex-col bg-secondary px-2 py-1"
        >
            <span>Position</span>
            <div className={`flex gap-1 ${mouseDown ? "pointer-events-none" : ""}`}>
                <TransformNumberInput title="Position X" step={1} color="#ff0000"/>
                <TransformNumberInput title="Position Y" step={1} color="#00cc00"/>
                <TransformNumberInput title="Position Z" step={1} color="#0080ff"/>
            </div>
            <span>Scale</span>
            <div className={`flex gap-1 ${mouseDown ? "pointer-events-none" : ""}`}>
                <TransformNumberInput title="Scale X" step={1} color="#ff0000"/>
                <TransformNumberInput title="Scale Y" step={1} color="#00cc00"/>
                <TransformNumberInput title="Scale Z" step={1} color="#0080ff"/>
                <TransformNumberInput title="Scale All" step={1} color="none"/>
            </div>
            <span>Rotation</span>
            <div className={`flex gap-1 ${mouseDown ? "pointer-events-none" : ""}`}>
                <TransformNumberInput title="Rotation X" step={1} color="#ff0000"/>
                <TransformNumberInput title="Rotation Y" step={1} color="#00cc00"/>
                <TransformNumberInput title="Rotation Z" step={1} color="#0080ff"/>
            </div>
        </div>
    );
}
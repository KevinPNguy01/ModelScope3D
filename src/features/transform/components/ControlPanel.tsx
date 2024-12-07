import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { setPosition, setRotation, setScale } from "../../../stores/slices/transformations";
import { TransformNumberInput } from "./NumberInput";

export function ControlPanel() {
    const position = useSelector(selectPosition);
    const scale = useSelector(selectScale);
    const rotation = useSelector(selectRotation);
    const dispatch = useDispatch();

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseUp = () => {
            panelRef.current!.classList.remove("pointer-events-none");
        }

        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        }
    });
    console.log(123)

    return (
        <div
            ref={panelRef}
            onMouseDown={() => panelRef.current!.classList.add("pointer-events-none")}
            className="text-neutral-300 flex flex-col bg-secondary px-2 py-1"
        >
            <span>Position</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={position[0]} setValue={(val: number) => dispatch(setPosition({value: val, index: 0}))} title="Position X" step={1} color="#ff0000"/>
                <TransformNumberInput value={position[1]} setValue={(val: number) => dispatch(setPosition({value: val, index: 1}))} title="Position Y" step={1} color="#00cc00"/>
                <TransformNumberInput value={position[2]} setValue={(val: number) => dispatch(setPosition({value: val, index: 2}))} title="Position Z" step={1} color="#0080ff"/>
            </div>
            <span>Scale</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={scale[0]} setValue={(val: number) => dispatch(setScale({value: val, index: 0}))} title="Scale X" step={1} color="#ff0000"/>
                <TransformNumberInput value={scale[1]} setValue={(val: number) => dispatch(setScale({value: val, index: 1}))} title="Scale Y" step={1} color="#00cc00"/>
                <TransformNumberInput value={scale[2]} setValue={(val: number) => dispatch(setScale({value: val, index: 2}))} title="Scale Z" step={1} color="#0080ff"/>
                <TransformNumberInput value={scale[3]} setValue={(val: number) => dispatch(setScale({value: val, index: 3}))} title="Scale All" step={1} color="none"/>
            </div>
            <span>Rotation</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={rotation[0]} setValue={(val: number) => dispatch(setRotation({value: val, index: 0}))} title="Rotation X" step={1} color="#ff0000"/>
                <TransformNumberInput value={rotation[1]} setValue={(val: number) => dispatch(setRotation({value: val, index: 1}))} title="Rotation Y" step={1} color="#00cc00"/>
                <TransformNumberInput value={rotation[2]} setValue={(val: number) => dispatch(setRotation({value: val, index: 2}))} title="Rotation Z" step={1} color="#0080ff"/>
            </div>
        </div>
    );
}
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectDirLight, selectMaterial, selectPointLight } from "../../../stores/selectors/lighting";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { updateStructUniform } from "../../../stores/slices/lighting";
import { setPosition, setRotation, setScale } from "../../../stores/slices/transformations";
import { TransformNumberInput } from "./NumberInput";

export function ControlPanel() {
    const position = useSelector(selectPosition);
    const scale = useSelector(selectScale);
    const rotation = useSelector(selectRotation);
    const dispatch = useDispatch();

    const material = useSelector(selectMaterial);
    const dirLight = useSelector(selectDirLight);
    const pointLight = useSelector(selectPointLight);

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

    return (
        <div
            ref={panelRef}
            onMouseDown={() => panelRef.current!.classList.add("pointer-events-none")}
            className="text-neutral-300 flex flex-col bg-secondary p-2 select-none"
        >
            <span>Position</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={position[0]} setValue={(val: number) => dispatch(setPosition({value: val, index: 0}))} title="Position X" step={.1} color="#ff0000"/>
                <TransformNumberInput value={position[1]} setValue={(val: number) => dispatch(setPosition({value: val, index: 1}))} title="Position Y" step={.1} color="#00cc00"/>
                <TransformNumberInput value={position[2]} setValue={(val: number) => dispatch(setPosition({value: val, index: 2}))} title="Position Z" step={.1} color="#0080ff"/>
            </div>
            <span>Scale</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={scale[0]} setValue={(val: number) => dispatch(setScale({value: val, index: 0}))} title="Scale X" step={.01} color="#ff0000"/>
                <TransformNumberInput value={scale[1]} setValue={(val: number) => dispatch(setScale({value: val, index: 1}))} title="Scale Y" step={.01} color="#00cc00"/>
                <TransformNumberInput value={scale[2]} setValue={(val: number) => dispatch(setScale({value: val, index: 2}))} title="Scale Z" step={.01} color="#0080ff"/>
                <TransformNumberInput value={scale[3]} setValue={(val: number) => dispatch(setScale({value: val, index: 3}))} title="Scale All" step={.01} color="none"/>
            </div>
            <span>Rotation</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={rotation[0]} setValue={(val: number) => dispatch(setRotation({value: val, index: 0}))} title="Rotation X" step={5} color="#ff0000"/>
                <TransformNumberInput value={rotation[1]} setValue={(val: number) => dispatch(setRotation({value: val, index: 1}))} title="Rotation Y" step={5} color="#00cc00"/>
                <TransformNumberInput value={rotation[2]} setValue={(val: number) => dispatch(setRotation({value: val, index: 2}))} title="Rotation Z" step={5} color="#0080ff"/>
            </div>
            <br/>
            <span>Material Color</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={material.albedo[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "albedo", index: 0, value: val}))} title="Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={material.albedo[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "albedo", index: 1, value: val}))} title="Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={material.albedo[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "albedo", index: 2, value: val}))} title="Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <span>Material Properties</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={1-material.roughness} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "roughness", index: -1, value: 1-val}))} title="Smoothness" step={0.01} color="none"/>
                <TransformNumberInput value={material.metallic} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "metallic", index: -1, value: val}))} title="Metalness" step={0.01} color="none"/>
                <TransformNumberInput value={material.ao} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "ao", index: -1, value: val}))} title="Ambient Occlusion" step={0.01} color="none"/>
            </div>
            <br/>
            <span>Sunlight Direction</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={dirLight.direction[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "direction", index: 0, value: val}))} title="Sunlight Direction X" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={dirLight.direction[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "direction", index: 1, value: val}))} title="Sunlight Direction Y" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={dirLight.direction[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "direction", index: 2, value: val}))} title="Sunlight Direction Z" step={0.01} color="#0080ff"/>
            </div>
            <span>Sunlight Color</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={dirLight.color[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "color", index: 0, value: val}))} title="Sunlight Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={dirLight.color[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "color", index: 1, value: val}))} title="Sunlight Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={dirLight.color[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "color", index: 2, value: val}))} title="Sunlight Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <br/>
            <span>Point Light Position</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={pointLight.position[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "position", index: 0, value: val}))} title="Point Light Position X" step={0.1} color="#ff0000"/>
                <TransformNumberInput value={pointLight.position[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "position", index: 1, value: val}))} title="Point Light Position Y" step={0.1} color="#00cc00"/>
                <TransformNumberInput value={pointLight.position[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "position", index: 2, value: val}))} title="Point Light Position Z" step={0.1} color="#0080ff"/>
            </div>
            <span>Point Light Color</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={pointLight.color[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "color", index: 0, value: val}))} title="Point Light Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={pointLight.color[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "color", index: 1, value: val}))} title="Point Light Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={pointLight.color[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "color", index: 2, value: val}))} title="Point Light Blue Component" step={0.01} color="#0080ff"/>
            </div>
        </div>
    );
}
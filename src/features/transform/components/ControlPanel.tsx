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
            className="text-neutral-300 flex flex-col bg-secondary p-2"
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
            <span>Material Ambient</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={material.ambient[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "ambient", index: 0, value: val}))} title="Material Ambient Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={material.ambient[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "ambient", index: 1, value: val}))} title="Material Ambient Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={material.ambient[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "ambient", index: 2, value: val}))} title="Material Ambient Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <span>Material Diffuse</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={material.diffuse[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "diffuse", index: 0, value: val}))} title="Material Diffuse Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={material.diffuse[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "diffuse", index: 1, value: val}))} title="Material Diffuse Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={material.diffuse[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "diffuse", index: 2, value: val}))} title="Material Diffuse Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <span>Material Specular</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={material.specular[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "specular", index: 0, value: val}))} title="Material Specular Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={material.specular[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "specular", index: 1, value: val}))} title="Material Specular Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={material.specular[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "material", key: "specular", index: 2, value: val}))} title="Material Specular Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <br/>
            <span>Sunlight Direction</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={dirLight.direction[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "direction", index: 0, value: val}))} title="Sunlight Direction X" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={dirLight.direction[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "direction", index: 1, value: val}))} title="Sunlight Direction Y" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={dirLight.direction[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "direction", index: 2, value: val}))} title="Sunlight Direction Z" step={0.01} color="#0080ff"/>
            </div>
            <span>Sunlight Ambient</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={dirLight.ambient[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "ambient", index: 0, value: val}))} title="Sunlight Ambient Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={dirLight.ambient[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "ambient", index: 1, value: val}))} title="Sunlight Ambient Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={dirLight.ambient[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "ambient", index: 2, value: val}))} title="Sunlight Ambient Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <span>Sunlight Diffuse</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={dirLight.diffuse[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "diffuse", index: 0, value: val}))} title="Sunlight Diffuse Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={dirLight.diffuse[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "diffuse", index: 1, value: val}))} title="Sunlight Diffuse Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={dirLight.diffuse[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "diffuse", index: 2, value: val}))} title="Sunlight Diffuse Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <span>Sunlight Specular</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={dirLight.specular[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "specular", index: 0, value: val}))} title="Sunlight Specular Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={dirLight.specular[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "specular", index: 1, value: val}))} title="Sunlight Specular Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={dirLight.specular[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "dirLight", key: "specular", index: 2, value: val}))} title="Sunlight Specular Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <br/>
            <span>Point Light Position</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={pointLight.position[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "position", index: 0, value: val}))} title="Point Light Position X" step={0.1} color="#ff0000"/>
                <TransformNumberInput value={pointLight.position[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "position", index: 1, value: val}))} title="Point Light Position Y" step={0.1} color="#00cc00"/>
                <TransformNumberInput value={pointLight.position[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "position", index: 2, value: val}))} title="Point Light Position Z" step={0.1} color="#0080ff"/>
            </div>
            <span>Point Light Ambient</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={pointLight.ambient[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "ambient", index: 0, value: val}))} title="Point Light Ambient Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={pointLight.ambient[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "ambient", index: 1, value: val}))} title="Point Light Ambient Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={pointLight.ambient[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "ambient", index: 2, value: val}))} title="Point Light Ambient Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <span>Point Light Diffuse</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={pointLight.diffuse[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "diffuse", index: 0, value: val}))} title="Point Light Diffuse Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={pointLight.diffuse[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "diffuse", index: 1, value: val}))} title="Point Light Diffuse Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={pointLight.diffuse[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "diffuse", index: 2, value: val}))} title="Point Light Diffuse Blue Component" step={0.01} color="#0080ff"/>
            </div>
            <span>Point Light Specular</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={pointLight.specular[0]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "specular", index: 0, value: val}))} title="Point Light Specular Red Component" step={0.01} color="#ff0000"/>
                <TransformNumberInput value={pointLight.specular[1]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "specular", index: 1, value: val}))} title="Point Light Specular Green Component" step={0.01} color="#00cc00"/>
                <TransformNumberInput value={pointLight.specular[2]} setValue={(val: number) => dispatch(updateStructUniform({parentKey: "pointLight", key: "specular", index: 2, value: val}))} title="Point Light Specular Blue Component" step={0.01} color="#0080ff"/>
            </div>
        </div>
    );
}
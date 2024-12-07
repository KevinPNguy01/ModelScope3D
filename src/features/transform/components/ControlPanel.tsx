import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAmbientIntensity, selectBeta, selectDiffuseColor, selectIndexOfRefraction, selectLightPosition, selectPower, selectSpecularColor } from "../../../stores/selectors/lighting";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { setAmbientIntensity, setBeta, setDiffuseColor, setIndexOfRefraction, setLightPosition, setPower, setSpecularColor } from "../../../stores/slices/lighting";
import { setPosition, setRotation, setScale } from "../../../stores/slices/transformations";
import { TransformNumberInput } from "./NumberInput";

export function ControlPanel() {
    const position = useSelector(selectPosition);
    const scale = useSelector(selectScale);
    const rotation = useSelector(selectRotation);
    const dispatch = useDispatch();

    const lightPosition = useSelector(selectLightPosition);
    const diffuseColor = useSelector(selectDiffuseColor);
    const specularColor = useSelector(selectSpecularColor);
    const power = useSelector(selectPower);
    const ambientIntensity = useSelector(selectAmbientIntensity);
    const indexOfRefraction = useSelector(selectIndexOfRefraction);
    const beta = useSelector(selectBeta);

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
            className="text-neutral-300 flex flex-col bg-secondary px-2 py-1"
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
                <TransformNumberInput value={rotation[0]} setValue={(val: number) => dispatch(setRotation({value: val, index: 0}))} title="Rotation X" step={1} color="#ff0000"/>
                <TransformNumberInput value={rotation[1]} setValue={(val: number) => dispatch(setRotation({value: val, index: 1}))} title="Rotation Y" step={1} color="#00cc00"/>
                <TransformNumberInput value={rotation[2]} setValue={(val: number) => dispatch(setRotation({value: val, index: 2}))} title="Rotation Z" step={1} color="#0080ff"/>
            </div>
            <br/>
            <span>Light Position</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={lightPosition[0]} setValue={(val: number) => dispatch(setLightPosition({value: val, index: 0}))} title="Light Position X" step={.1} color="#ff0000"/>
                <TransformNumberInput value={lightPosition[1]} setValue={(val: number) => dispatch(setLightPosition({value: val, index: 1}))} title="Light Position Y" step={.1} color="#00cc00"/>
                <TransformNumberInput value={lightPosition[2]} setValue={(val: number) => dispatch(setLightPosition({value: val, index: 2}))} title="Light Position Z" step={.1} color="#0080ff"/>
            </div>
            <span>Diffuse Color</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={diffuseColor[0]} setValue={(val: number) => dispatch(setDiffuseColor({value: val, index: 0}))} title="Diffuse Red Component" step={.01} color="#ff0000"/>
                <TransformNumberInput value={diffuseColor[1]} setValue={(val: number) => dispatch(setDiffuseColor({value: val, index: 1}))} title="Diffuse Green Component" step={.01} color="#00cc00"/>
                <TransformNumberInput value={diffuseColor[2]} setValue={(val: number) => dispatch(setDiffuseColor({value: val, index: 2}))} title="Diffuse Blue Component" step={.01} color="#0080ff"/>
                <TransformNumberInput value={ambientIntensity} setValue={(val: number) => dispatch(setAmbientIntensity(val))} title="Diffuse Brightness" step={.01} color="none"/>
            </div>
            <span>Specular Color</span>
            <div className={`flex gap-1`}>
                <TransformNumberInput value={specularColor[0]} setValue={(val: number) => dispatch(setSpecularColor({value: val, index: 0}))} title="Specular Red Component" step={.01} color="#ff0000"/>
                <TransformNumberInput value={specularColor[1]} setValue={(val: number) => dispatch(setSpecularColor({value: val, index: 1}))} title="Specular Green Component" step={.01} color="#00cc00"/>
                <TransformNumberInput value={specularColor[2]} setValue={(val: number) => dispatch(setSpecularColor({value: val, index: 2}))} title="Specular Blue Component" step={.01} color="#0080ff"/>
                <TransformNumberInput value={power} setValue={(val: number) => dispatch(setPower(val))} title="Specular Brightness" step={.1} color="none"/>
            </div>
            <span>Index of Refraction</span>
            <TransformNumberInput value={indexOfRefraction} setValue={(val: number) => dispatch(setIndexOfRefraction(val))} title="Index Of Refraction" step={1} color="none"/>
            <span>Beta</span>
            <TransformNumberInput value={beta} setValue={(val: number) => dispatch(setBeta(val))} title="Beta" step={.01} color="none"/>
        </div>
    );
}
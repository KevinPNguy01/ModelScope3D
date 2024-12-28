import { useDispatch, useSelector } from "react-redux";
import { selectDirLight, selectPointLight } from "../../../stores/selectors/lighting";
import { updateStructUniform } from "../../../stores/slices/lighting";
import { TransformNumberInput } from "./NumberInput";

export function LightingTab() {
    const dirLight = useSelector(selectDirLight);
    const pointLight = useSelector(selectPointLight);
    const dispatch = useDispatch();

    return (
        <>
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
        </>
    );
}
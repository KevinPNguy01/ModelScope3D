import { useDispatch, useSelector } from "react-redux";
import { selectFov } from "../../../stores/selectors/settings";
import { setFov } from "../../../stores/slices/settings";
import { TransformNumberInput } from "./NumberInput";

export function CameraTab() {
    const fov = useSelector(selectFov);
    const dispatch = useDispatch();
    return (
        <>
            <span>Camera FOV</span>
            <TransformNumberInput value={fov} setValue={(val: number) => dispatch(setFov(val))} title="FOV" step={2} color="none"/>
        </>
    );
}
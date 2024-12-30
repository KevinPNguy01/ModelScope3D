import { vec3 } from "gl-matrix";
import { MutableRefObject } from "react";

export function canvasOnWheel(dist: number, setDist: (_: number) => void) {
    return (e: React.WheelEvent) => {
        // Update camera distance value 
        setDist(Math.max(0.1, dist + 0.1 * e.deltaY / Math.abs(e.deltaY)))
    }
}

export function canvasOnMouseDown(mouseStartPos: MutableRefObject<{clientX: number, clientY: number} | null>, mouseHoldType : MutableRefObject<"left" | "right" | null>) {
    return (e: React.MouseEvent) => {
        mouseStartPos.current = e;
        switch (e.buttons) {
            case 1:
                mouseHoldType.current = "left";
                break;
            case 2:
                mouseHoldType.current = "right";
                break;
        }
    };
}

export function addCanvasMouseHandlers(
    mouseStartPos: MutableRefObject<{clientX: number, clientY: number}>, mouseHoldType : MutableRefObject<"left" | "right" | null>,
    yaw: number, setYaw: (_ : number) => void, pitch: number,  setPitch: (_ : number) => void,
    cameraPos: vec3, setCameraPos: (_: vec3) => void, focalPoint: vec3, setFocalPoint: (_: vec3) => void
) {
    const handleMouseUp = canvasMouseUp(mouseHoldType);
    const handleMouseMove = canvasMouseMove(mouseStartPos, mouseHoldType, yaw, setYaw, pitch, setPitch, cameraPos, setCameraPos, focalPoint, setFocalPoint);

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);
    }
}

function canvasMouseUp(mouseHoldType: MutableRefObject<"left" | "right" | null>) {
    return () =>  {
        mouseHoldType.current = null;
    }
}

function canvasMouseMove(
    mouseStartPos: MutableRefObject<{clientX: number, clientY: number}>, mouseHoldType : MutableRefObject<"left" | "right" | null>,
    yaw: number, setYaw: (_ : number) => void, pitch: number, setPitch: (_ : number) => void,
    cameraPos: vec3, setCameraPos: (_: vec3) => void, focalPoint: vec3, setFocalPoint: (_: vec3) => void
) {
    return (e: MouseEvent) => {
        if (mouseHoldType.current === "left") {
            setYaw((yaw + 300 * (e.clientX - mouseStartPos.current.clientX) / window.innerWidth) % 360);
            setPitch(Math.max(-89.999, Math.min(89.999, pitch + 300 * (e.clientY - mouseStartPos.current.clientY) / window.innerHeight)));
        } else if (mouseHoldType.current === "right") {
            const camZ = vec3.create();
            vec3.sub(camZ, focalPoint, cameraPos);
            vec3.normalize(camZ, camZ);

            const camX = vec3.create();
            vec3.cross(camX, [0, 1, 0], camZ);
            vec3.normalize(camX, camX);

            const camY = vec3.create();
            vec3.cross(camY, camZ, camX);
            vec3.normalize(camY, camY);

            const dx = 3 * (e.clientX - mouseStartPos.current.clientX) / window.innerWidth;
            const dy = 3 * (e.clientY - mouseStartPos.current.clientY) / window.innerHeight;
            const diff = vec3.create();
            vec3.scale(camX, camX, dx);
            vec3.scale(camY, camY, dy);
            vec3.add(diff, camX, camY);

            vec3.add(cameraPos, cameraPos, diff);
            vec3.add(focalPoint, focalPoint, diff);
            setCameraPos(vec3.clone(cameraPos));
            setFocalPoint(vec3.clone(focalPoint));
        }
        mouseStartPos.current = e;
    }
}

export function addCanvasResizeHandler(canvas: MutableRefObject<HTMLCanvasElement | null>, setCanvasSize: (_: {clientWidth: number, clientHeight: number}) => void) {
    const handleResize = canvasResize(canvas, setCanvasSize);
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
    }
}

export function canvasResize(canvas: MutableRefObject<HTMLCanvasElement | null>, setCanvasSize: (_: {clientWidth: number, clientHeight: number}) => void) {
    return () => {
        if (!canvas.current || !canvas.current.parentElement) return;
        const parent = canvas.current.parentElement;
        setCanvasSize({clientWidth: parent.clientWidth, clientHeight: parent.clientHeight});
        canvas.current.width = parent.clientWidth;
        canvas.current.height = parent.clientHeight;
    };
}
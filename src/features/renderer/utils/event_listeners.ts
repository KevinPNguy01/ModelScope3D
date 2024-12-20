import { MutableRefObject } from "react";

export function canvasOnWheel(dist: number, setDist: (_: number) => void) {
    return (e: React.WheelEvent) => {
        // Update camera distance value 
        setDist(Math.max(0.1, dist + 0.1 * e.deltaY / Math.abs(e.deltaY)))
    }
}

export function canvasOnMouseDown(mouseStartPos: MutableRefObject<{clientX: number, clientY: number} | null>) {
    return (e: React.MouseEvent) => mouseStartPos.current = e;
}

export function addCanvasMouseHandlers(
    mouseStartPos: MutableRefObject<{clientX: number, clientY: number} | null>,
    yaw: number, dYaw: number, pitch: number, dPitch: number,
    setYaw: (_ : number) => void, setDYaw: (_ : number) => void, setPitch: (_ : number) => void, setDPitch: (_ : number) => void
) {
    const handleMouseUp = canvasMouseUp(mouseStartPos, yaw, dYaw, pitch, dPitch, setYaw, setDYaw, setPitch, setDPitch);
    const handleMouseMove = canvasMouseMove(mouseStartPos, setDYaw, setDPitch);

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMove);
    }
}

function canvasMouseUp(
    mouseStartPos: MutableRefObject<{clientX: number, clientY: number} | null>,
    yaw: number, dYaw: number, pitch: number, dPitch: number,
    setYaw: (_ : number) => void, setDYaw: (_ : number) => void, setPitch: (_ : number) => void, setDPitch: (_ : number) => void,
) {
    return () =>  {
        setYaw((yaw + dYaw) % 360);
        setDYaw(0);
        setPitch(Math.min(90, Math.max(-90, pitch + dPitch)));
        setDPitch(0);
        mouseStartPos.current = null;
    }
}

function canvasMouseMove(
    mouseStartPos: MutableRefObject<{clientX: number, clientY: number} | null>,
    setDYaw: (_ : number) => void, setDPitch: (_ : number) => void
) {
    return (e: MouseEvent) => {
        if (!mouseStartPos.current) return;
        setDYaw(300 * (e.clientX - mouseStartPos.current.clientX) / window.innerWidth);
        setDPitch(300 * (e.clientY - mouseStartPos.current.clientY) / window.innerHeight);
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

function canvasResize(canvas: MutableRefObject<HTMLCanvasElement | null>, setCanvasSize: (_: {clientWidth: number, clientHeight: number}) => void) {
    return () => {
        if (!canvas.current || !canvas.current.parentElement) return;
        const parent = canvas.current.parentElement;
        setCanvasSize({clientWidth: parent.clientWidth, clientHeight: parent.clientHeight});
        canvas.current.width = parent.clientWidth;
        canvas.current.height = parent.clientHeight;
    };
}
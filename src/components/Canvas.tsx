import { useEffect, useRef } from "react";

export function Canvas() {
    const canvas = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const gl = canvas.current!.getContext("webgl");
        if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
    
        gl.clearColor(0.0, 0.0, 1.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }, []);

    return (
        <canvas ref={canvas} id="gl-canvas" width="640" height="480"></canvas>
    );
}
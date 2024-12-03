import { useEffect, useRef } from "react";
import { initShaderProgram } from "../utils/shaders";
import { ProgramInfo } from "../types";
import { initBuffers } from "../utils/buffers";
import { drawScene } from "../utils/render";

export function Canvas() {
    const canvas = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        (async () => {
            const gl = canvas.current!.getContext("webgl");
            if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
        
            const shaderProgram = await initShaderProgram(gl, "vertex.vs", "fragment.fs");
            const programInfo: ProgramInfo = {
                program: shaderProgram,
                attribLocations: {
                  vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
                  colorPosition: gl.getAttribLocation(shaderProgram, "aVertexColor")
                },
                uniformLocations: {
                  projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                  modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix")
                },
              };
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            const buffers = initBuffers(gl);
            drawScene(gl, programInfo, buffers);
        })()
    }, []);

    return (
        <canvas ref={canvas} id="gl-canvas" width="640" height="480"></canvas>
    );
}
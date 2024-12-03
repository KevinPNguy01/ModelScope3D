import { useEffect, useRef } from "react";
import { initShaderProgram } from "../utils/shaders";
import { ProgramInfo } from "../types";
import { initBuffers } from "../utils/buffers";
import { drawScene } from "../utils/render";
import { loadTexture } from "../utils/textures";

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
                  colorPosition: -1,
                  textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord")
                },
                uniformLocations: {
                  projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
                  modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
                  uSampler: gl.getUniformLocation(shaderProgram, "uSampler")
                },
              };

            const buffers = initBuffers(gl);
            const texture = loadTexture(gl, "bricks.jpg");
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

            let rotation = 0;
            let deltaTime = 0;
            let then = 0;

            function render(now: number) {
              now *= 0.001;
              deltaTime = now - then;
              then = now;

              drawScene(gl!, programInfo, buffers, texture, rotation);
              rotation += deltaTime;

              requestAnimationFrame(render);
            }
            requestAnimationFrame(render);
        })()
    }, []);

    return (
        <canvas ref={canvas} id="gl-canvas" width="640" height="480"></canvas>
    );
}
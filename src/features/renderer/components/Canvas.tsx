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

            const buffers = initBuffers(gl);

			let rotation = 0;
			let deltaTime = 0;
			let then = 0;

			function render(now: number) {
				now *= 0.001;
				deltaTime = now - then;
				then = now;

				drawScene(gl!, programInfo, buffers, rotation);
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
import { useEffect, useRef } from "react";
import { ProgramInfo } from "../types";
import { loadModel } from "../utils/models";
import { drawScene } from "../utils/render";
import { initShaderProgram } from "../utils/shaders";
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
					vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
					vertexColor: -1,
					textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord")
				},
				uniformLocations: {
					modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
					projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
					normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
					uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),

					lightPos: gl.getUniformLocation(shaderProgram, "uLightPos"),
					lightPower: gl.getUniformLocation(shaderProgram, "uLightPower"),
					kd: gl.getUniformLocation(shaderProgram, "uDiffuseColor"),
					specular: gl.getUniformLocation(shaderProgram, "uSpecularColor"),
					ambient: gl.getUniformLocation(shaderProgram, "uAmbient"),
					indexOfRefraction: gl.getUniformLocation(shaderProgram, "uIOR"),
					beta: gl.getUniformLocation(shaderProgram, "uBeta")
				},
			};

			//const buffers = initBuffers(gl);
			const texture = loadTexture(gl, "diamond_ore.jpeg");
			const meshes = await loadModel(gl, "xyzrgb_dragon.obj");
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

			let rotation = 0;
			let deltaTime = 0;
			let then = 0;

			function render(now: number) {
				now *= 0.001;
				deltaTime = now - then;
				then = now;

				drawScene(gl!, programInfo, meshes, texture, rotation);
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
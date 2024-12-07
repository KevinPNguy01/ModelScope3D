import { mat4, vec3 } from "gl-matrix";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeshWithBuffers } from "webgl-obj-loader";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { ProgramInfo } from "../types";
import { mat4_inverse } from "../utils/mat4";
import { loadModel } from "../utils/models";
import { drawScene } from "../utils/render";
import { initShaderProgram } from "../utils/shaders";
import { loadTexture } from "../utils/textures";

export function Canvas() {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const [animationFrame, ] = useState({number: 0});	// Keep track of frame number to cancel in case of re-render.
	const [canceledFrame, ] = useState({number: 0});	// Keep track of frame number to cancel in case of re-render.
	const position = useSelector(selectPosition);
    const scale = useSelector(selectScale);
    const rotation = useSelector(selectRotation);
	const [meshes, setMeshes] = useState<MeshWithBuffers[]>([]);
	const [texture, setTexture] = useState<WebGLTexture>();
	const [programInfo, setProgramInfo] = useState<ProgramInfo>();

	useEffect(() => {
		(async () => {
			const gl = canvas.current!.getContext("webgl");
			if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");

			setMeshes(await loadModel(gl, "sphere.obj"));
			setTexture(loadTexture(gl, "bricks.jpg"));

			const shaderProgram = await initShaderProgram(gl, "vertex.vs", "fragment.fs");
			setProgramInfo({
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
			});
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (!programInfo) return;

			const gl = canvas.current!.getContext("webgl");
			if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
	

			const fov = (45 * Math.PI) / 180;
			const aspect =  canvas.current!.clientWidth / canvas.current!.clientHeight;
			const zNear = 0.1;
			const zFar = 1000;
			const projectionMatrix = mat4.create();
			mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

			const modelViewMatrix = mat4.create();
			const positionVec = vec3.fromValues(position[0], position[1], position[2]);
			const scaleVec = vec3.fromValues(scale[0], scale[1], scale[2]);
			const rotationVec = vec3.fromValues(rotation[0], rotation[1], rotation[2]);
			vec3.scale(rotationVec, rotationVec, Math.PI/180);
			vec3.scale(scaleVec, scaleVec, scale[3]);
			mat4.translate(modelViewMatrix, modelViewMatrix, positionVec);
			mat4.rotate(modelViewMatrix, modelViewMatrix, rotationVec[1], [0, 1, 0]);
			mat4.rotate(modelViewMatrix, modelViewMatrix, rotationVec[0], [1, 0, 0]);
			mat4.rotate(modelViewMatrix, modelViewMatrix, rotationVec[2], [0, 0, 1]);
			mat4.scale(modelViewMatrix, modelViewMatrix, scaleVec);

			const normalMatrix = mat4.create();
			mat4_inverse(modelViewMatrix, normalMatrix);
			mat4.transpose(normalMatrix, normalMatrix);

			//const buffers = initBuffers(gl);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.useProgram(programInfo.program);

			gl!.useProgram(programInfo.program);
			
			gl!.uniformMatrix4fv(
				programInfo.uniformLocations.modelViewMatrix,
				false,
				modelViewMatrix
			);
			gl!.uniformMatrix4fv(
				programInfo.uniformLocations.projectionMatrix,
				false,
				projectionMatrix
			);
			gl!.uniformMatrix4fv(
				programInfo.uniformLocations.normalMatrix,
				false,
				normalMatrix
			);
			drawScene(gl!, programInfo, meshes, texture!);
		})();

		return () => {
			cancelAnimationFrame(animationFrame.number);
		};
	}, [animationFrame, canceledFrame, meshes, position, programInfo, rotation, scale, texture]);

	return (
		<canvas ref={canvas} id="gl-canvas" width="640" height="480"></canvas>
	);
}
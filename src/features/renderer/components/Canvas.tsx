import { mat4, vec3, vec4 } from "gl-matrix";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeshWithBuffers } from "webgl-obj-loader";
import { selectDirLight, selectMaterial, selectPointLight } from "../../../stores/selectors/lighting";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { ProgramInfo } from "../types";
import { mat4_inverse } from "../utils/mat4";
import { loadModel } from "../utils/models";
import { drawScene } from "../utils/render";
import { initShaderProgram } from "../utils/shaders";
import { loadTexture } from "../utils/textures";
import { setUniforms } from "../utils/uniforms";

export function Canvas() {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const [animationFrame, ] = useState({number: 0});	// Keep track of frame number to cancel in case of re-render.
	const [canceledFrame, ] = useState({number: 0});	// Keep track of frame number to cancel in case of re-render.
	const [meshes, setMeshes] = useState<MeshWithBuffers[]>([]);
	const [texture, setTexture] = useState<WebGLTexture>();
	const [programInfo, setProgramInfo] = useState<ProgramInfo>();
	const position = useSelector(selectPosition);
    const scale = useSelector(selectScale);
    const rotation = useSelector(selectRotation);

	const material = useSelector(selectMaterial);
	const dirLight = useSelector(selectDirLight);
	const pointLight = useSelector(selectPointLight);

	useEffect(() => {
		(async () => {
			const gl = canvas.current!.getContext("webgl");
			if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");

			setMeshes(await loadModel(gl, "cat.obj"));
			setTexture(loadTexture(gl, "bricks.jpg"));

			const shaderProgram = await initShaderProgram(gl, "vertex.vs", "newFragment.fs");
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
					beta: gl.getUniformLocation(shaderProgram, "uBeta"),

					pointLight: gl.getUniformLocation(shaderProgram, "pointLight"),
					material: gl.getUniformLocation(shaderProgram, "material"),
					dirLight: gl.getUniformLocation(shaderProgram, "dirLight"),
				},
			});

			gl.useProgram(shaderProgram);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			setUniforms(gl, shaderProgram);

		})();
	}, []);

	useEffect(() => {
		const gl = canvas.current!.getContext("webgl");
		if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");

		if (programInfo === undefined) return;

		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.ambient"), material.ambient);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.diffuse"), material.diffuse);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.specular"), material.specular);

		drawScene(gl!, programInfo, meshes, texture!);
		
	}, [material.ambient, material.diffuse, material.specular, meshes, programInfo, texture]);

	useEffect(() => {
		const gl = canvas.current!.getContext("webgl");
		if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");

		if (programInfo === undefined) return;

		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "dirLight.color"), dirLight.color);

		drawScene(gl!, programInfo, meshes, texture!);
		
	}, [dirLight.color, meshes, programInfo, texture]);

	useEffect(() => {
		const gl = canvas.current!.getContext("webgl");
		if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");

		if (programInfo === undefined) return;

		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "pointLight.color"), pointLight.color);

		drawScene(gl!, programInfo, meshes, texture!);
		
	}, [pointLight.color, meshes, programInfo, texture]);

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
			
			const modelMatrix = mat4.create();
			const positionVec = vec3.fromValues(position[0], position[1], position[2]);
			const scaleVec = vec3.fromValues(scale[0], scale[1], scale[2]);
			const rotationVec = vec3.fromValues(rotation[0], rotation[1], rotation[2]);
			vec3.scale(rotationVec, rotationVec, Math.PI/180);
			vec3.scale(scaleVec, scaleVec, scale[3]);
			mat4.translate(modelMatrix, modelMatrix, positionVec);
			mat4.rotate(modelMatrix, modelMatrix, rotationVec[1], [0, 1, 0]);
			mat4.rotate(modelMatrix, modelMatrix, rotationVec[0], [1, 0, 0]);
			mat4.rotate(modelMatrix, modelMatrix, rotationVec[2], [0, 0, 1]);
			mat4.scale(modelMatrix, modelMatrix, scaleVec);

			const viewMatrix = mat4.create();
			mat4.lookAt(viewMatrix, [0, 0, 0], [0, 0, -1], [0, 1, 0]);

			const modelViewMatrix = mat4.create();
			mat4.mul(modelViewMatrix, viewMatrix, modelMatrix);

			const normalMatrix = mat4.create();
			mat4_inverse(modelViewMatrix, normalMatrix);
			mat4.transpose(normalMatrix, normalMatrix);

			const dirLightTransformed =  vec4.fromValues(dirLight.direction[0], dirLight.direction[1], dirLight.direction[2], 1);
			vec4.transformMat4(dirLightTransformed, dirLightTransformed, viewMatrix);
			gl.uniform3fv(gl.getUniformLocation(programInfo.program, "dirLight.direction"), dirLightTransformed.slice(0, 3));

			const pointLightTransformed =  vec4.fromValues(pointLight.position[0], pointLight.position[1], pointLight.position[2], 1);
			vec4.transformMat4(pointLightTransformed, pointLightTransformed, viewMatrix);
			gl.uniform3fv(gl.getUniformLocation(programInfo.program, "pointLight.position"), pointLightTransformed.slice(0, 3));

			
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
	}, [animationFrame, canceledFrame, dirLight.direction, meshes, pointLight.position, position, programInfo, rotation, scale, texture]);

	return (
		<canvas ref={canvas} id="gl-canvas" width="800" height="500"></canvas>
	);
}
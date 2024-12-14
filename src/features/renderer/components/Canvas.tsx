import { mat4, vec3, vec4 } from "gl-matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeshWithBuffers } from "webgl-obj-loader";
import { FileContext } from "../../../app/contexts/FileContext";
import { selectDirLight, selectMaterial, selectPointLight } from "../../../stores/selectors/lighting";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { ProgramInfo } from "../types";
import { mat4_inverse } from "../utils/mat4";
import { loadOBJModel, loadSTLModel } from "../utils/models";
import Mtl, { initMtlTextures, loadMtlFile, MtlWithTextures } from "../utils/mtl";
import { drawScene } from "../utils/render";
import { initShaderProgram } from "../utils/shaders";
import { setUniforms } from "../utils/uniforms";

export function Canvas() {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	const [animationFrame, ] = useState({number: 0});	// Keep track of frame number to cancel in case of re-render.
	const position = useSelector(selectPosition);
    const scale = useSelector(selectScale);
    const rotation = useSelector(selectRotation);

	const material = useSelector(selectMaterial);
	const dirLight = useSelector(selectDirLight);
	const pointLight = useSelector(selectPointLight);

	const {objFile, mtlFile, stlFile} = useContext(FileContext);
	const glRef = useRef<WebGLRenderingContext>();
	const meshesRef = useRef<MeshWithBuffers[]>([]);
	const mtlRef = useRef<MtlWithTextures>();
	const programsRef = useRef<ProgramInfo>({} as ProgramInfo);

	useEffect(() => {
		// Initialize WebGLRenderingContext
		const gl = canvas.current!.getContext("webgl");
		if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
		glRef.current = gl;
		
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

		mtlRef.current = initMtlTextures(gl, new Mtl(""));

		const shaderProgram = initShaderProgram(gl, "triangles-vertex-shader", "triangles-fragment-shader");
		programsRef.current = {
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
		};

		gl.useProgram(shaderProgram);
		setUniforms(gl, shaderProgram);
	}, [])

	useEffect(() => {(async () => {if (stlFile) meshesRef.current = await loadSTLModel(glRef.current!, stlFile)})()}, [stlFile]);
	useEffect(() => {(async () => {if (objFile) meshesRef.current = await loadOBJModel(glRef.current!, objFile)})()}, [objFile]);
	useEffect(() => {(async () => {if (mtlFile) mtlRef.current = await loadMtlFile(glRef.current!, mtlFile)})()}, [mtlFile]);

	// Start the render loop
	useEffect(() => {
		function render() {
			drawScene(glRef.current!, programsRef.current, meshesRef.current, mtlRef.current!);
			animationFrame.number = requestAnimationFrame(render);
		}
		animationFrame.number = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(animationFrame.number);
		};
	}, [animationFrame]);

	useEffect(() => {
		const gl = glRef.current!;
		const programInfo = programsRef.current;
		const mtl = mtlRef.current!;
		
		// Update default texture color
		mtl.defaultTexture = mtl.defaultTexture || gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, mtl.defaultTexture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([Math.floor(255 * material.diffuse[0]), Math.floor(255 * material.diffuse[1]), Math.floor(255 * material.diffuse[2]), 255]));
		
		// Update material uniforms
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.ambient"), material.ambient);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.diffuse"), material.diffuse);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.specular"), material.specular);

	}, [material.ambient, material.diffuse, material.specular]);

	useEffect(() => {
		const gl = glRef.current!;
		const programInfo = programsRef.current;
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "dirLight.color"), dirLight.color);
	}, [dirLight.color]);

	useEffect(() => {
		const gl = glRef.current!;
		const programInfo = programsRef.current;
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "pointLight.color"), pointLight.color);
	}, [pointLight.color]);

	const [yaw, setYaw] = useState(0);
	const [deltaYaw, setDeltaYaw] = useState(0);

	const [pitch, setPitch] = useState(0);
	const [deltaPitch, setDeltaPitch] = useState(0);

	useEffect(() => {
		const gl = glRef.current!;
		const programInfo = programsRef.current;

		const yawAngle = -Math.PI / 180 * (yaw + deltaYaw);
		const pitchAngle = Math.PI / 180 * Math.max(-90, Math.min(90, pitch + deltaPitch));
		const cameraPos = vec3.fromValues(Math.cos(pitchAngle) * Math.sin(yawAngle), Math.sin(pitchAngle), Math.cos(pitchAngle) * Math.cos(yawAngle));
		vec3.scale(cameraPos, cameraPos, 4);

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
		mat4.lookAt(viewMatrix, cameraPos, [0, 0, 0], [0, 1, 0]);

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
	}, [animationFrame, dirLight.direction, pointLight.position, position, rotation, scale, deltaYaw, yaw, pitch, deltaPitch]);

	const mouseStartPos = useRef<{clientX: number, clientY: number} | null>(null);
	
	useEffect(() => {
		const handleMouseUp = () => {
			mouseStartPos.current = null;
			setYaw(yaw + deltaYaw);
			setDeltaYaw(0);
			setPitch(pitch + deltaPitch);
			setDeltaPitch(0);
		};

		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [deltaPitch, deltaYaw, pitch, yaw]);
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (mouseStartPos.current) {
				setDeltaYaw(200 * (e.clientX - mouseStartPos.current!.clientX) / window.innerWidth);
				setDeltaPitch(200 * (e.clientY - mouseStartPos.current!.clientY) / window.innerHeight);
			}
		};

		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<canvas 
			ref={canvas} 
			id="gl-canvas" 
			width="800" 
			height="500"
			onMouseDown={(e) => {
				mouseStartPos.current = e;
			}}
		/>
	);
}
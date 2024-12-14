import { mat4, vec4 } from "gl-matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeshWithBuffers } from "webgl-obj-loader";
import { FileContext } from "../../../app/contexts/FileContext";
import { selectDirLight, selectMaterial, selectPointLight } from "../../../stores/selectors/lighting";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { ProgramInfo } from "../types";
import { loadOBJModel, loadSTLModel } from "../utils/models";
import Mtl, { initMtlTextures, loadMtlFile, MtlWithTextures } from "../utils/mtl";
import { drawScene } from "../utils/render";
import { initShaderProgram } from "../utils/shaders";
import { calculateModelMatrix, calculateNormalMatrix, calculateProjectionMatrix, calculateViewMatrix } from "../utils/transform_matrices";
import { setUniforms } from "../utils/uniforms";

export function Canvas() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
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
	const defaultTextureRef = useRef<WebGLTexture | null>(null);
	const programsRef = useRef<ProgramInfo>({} as ProgramInfo);

	// State hooks for keeping track of camera rotation
	const [yaw, setYaw] = useState(0);
	const [deltaYaw, setDeltaYaw] = useState(0);
	const [pitch, setPitch] = useState(0);
	const [deltaPitch, setDeltaPitch] = useState(0);

	// Transformation matrices
	const projectionMatrixRef = useRef(mat4.create());
	const modelMatrixRef = useRef(mat4.create());
	const viewMatrixRef = useRef(mat4.create());
	const modelViewMatrixRef = useRef(mat4.create());
	const normalMatrixRef = useRef(mat4.create());

	useEffect(() => {
		// Initialize WebGLRenderingContext
		const canvas = canvasRef.current!;
		const gl = canvas.getContext("webgl");
		if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
		glRef.current = gl;

		mtlRef.current = initMtlTextures(gl, new Mtl(""));
		defaultTextureRef.current = gl.createTexture();

		// Initialize projection matrix
		calculateProjectionMatrix(projectionMatrixRef.current, canvas, 90, 0.1, 1000);

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

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.useProgram(shaderProgram);
		setUniforms(gl, shaderProgram);
	}, [])

	// Update meshes/mtl when imported files change
	useEffect(() => {(async () => {if (stlFile) meshesRef.current = await loadSTLModel(glRef.current!, stlFile)})()}, [stlFile]);
	useEffect(() => {(async () => {if (objFile) meshesRef.current = await loadOBJModel(glRef.current!, objFile)})()}, [objFile]);
	useEffect(() => {(async () => {if (mtlFile) mtlRef.current = await loadMtlFile(glRef.current!, mtlFile)})()}, [mtlFile]);

	// Start the render loop
	useEffect(() => {
		function render() {
			drawScene(glRef.current!, programsRef.current, meshesRef.current, mtlRef.current!, defaultTextureRef.current);
			animationFrame.number = requestAnimationFrame(render);
		}
		animationFrame.number = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(animationFrame.number);
		};
	}, [animationFrame]);

	// Triggered when material properties change
	useEffect(() => {
		const gl = glRef.current!;
		const programInfo = programsRef.current;
		
		// Update default texture color
		gl.bindTexture(gl.TEXTURE_2D, defaultTextureRef.current);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([Math.floor(255 * material.diffuse[0]), Math.floor(255 * material.diffuse[1]), Math.floor(255 * material.diffuse[2]), 255]));
		
		// Update material uniforms
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.ambient"), material.ambient);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.diffuse"), material.diffuse);
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "material.specular"), material.specular);

	}, [material.ambient, material.diffuse, material.specular]);

	// Triggered when directional light changes
	useEffect(() => {
		const gl = glRef.current!;
		const programInfo = programsRef.current;

		// Transform light direction by view matrix
		const dirLightTransformed =  vec4.fromValues(dirLight.direction[0], dirLight.direction[1], dirLight.direction[2], 1);
		vec4.transformMat4(dirLightTransformed, dirLightTransformed, viewMatrixRef.current);

		// Update directional light color uniforms
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "dirLight.direction"), dirLightTransformed.slice(0, 3));
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "dirLight.color"), dirLight.color);

	}, [dirLight.direction, dirLight.color]);

	// Triggered when point light changes
	useEffect(() => {
		const gl = glRef.current!;
		const programInfo = programsRef.current;

		// Transform point light position by view matrix
		const pointLightTransformed =  vec4.fromValues(pointLight.position[0], pointLight.position[1], pointLight.position[2], 1);
		vec4.transformMat4(pointLightTransformed, pointLightTransformed, viewMatrixRef.current);

		// Update point light uniforms
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "pointLight.position"), pointLightTransformed.slice(0, 3));
		gl.uniform3fv(gl.getUniformLocation(programInfo.program, "pointLight.color"), pointLight.color);
	}, [pointLight.position, pointLight.color]);

	// Update view matrix when camera rotation changes
	useEffect(() => {
		calculateViewMatrix(viewMatrixRef.current, yaw + deltaYaw, pitch + deltaPitch, 2);
		updateModelViewAndNormalMatrices();
	}, [deltaYaw, yaw, pitch, deltaPitch]);

	// Update model matrix when model transformations change
	useEffect(() => {
		calculateModelMatrix(modelMatrixRef.current, position, scale, rotation);
		updateModelViewAndNormalMatrices();
	}, [position, scale, rotation]);

	// Update model view matrix, normal matrix, and projection matrix
	const updateModelViewAndNormalMatrices = () => {
		const gl = glRef.current!;
		const programInfo = programsRef.current;

		mat4.mul(modelViewMatrixRef.current, viewMatrixRef.current, modelMatrixRef.current);
		calculateNormalMatrix(normalMatrixRef.current, modelViewMatrixRef.current);

		// Update transform matrix uniforms
		gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelViewMatrixRef.current);
		gl.uniformMatrix4fv(programInfo.uniformLocations.normalMatrix, false, normalMatrixRef.current);
		gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrixRef.current);
	}

	const mouseStartPos = useRef<{clientX: number, clientY: number} | null>(null);

	// Add event listener for when the mouse is moved, used for computing camera rotation
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (mouseStartPos.current) {
				setDeltaYaw(200 * (e.clientX - mouseStartPos.current.clientX) / window.innerWidth);
				setDeltaPitch(200 * (e.clientY - mouseStartPos.current.clientY) / window.innerHeight);
			}
		};

		document.addEventListener("mousemove", handleMouseMove);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	// Add event listener for when the mouse button is released, used for computing camera rotation
	useEffect(() => {
		const handleMouseUp = () => {
			mouseStartPos.current = null;
			setYaw(yaw + deltaYaw);
			setPitch(pitch + deltaPitch);
			setDeltaYaw(0);
			setDeltaPitch(0);
		};

		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [deltaPitch, deltaYaw, pitch, yaw]);

	return (
		<canvas 
			ref={canvasRef} 
			id="gl-canvas" 
			width="800" 
			height="500"
			onMouseDown={(e) => {
				mouseStartPos.current = e;
			}}
		/>
	);
}
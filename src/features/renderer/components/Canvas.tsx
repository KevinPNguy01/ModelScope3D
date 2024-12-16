import { mat4, vec3, vec4 } from "gl-matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeshWithBuffers } from "webgl-obj-loader";
import { FileContext } from "../../../app/contexts/FileContext";
import { selectDirLight, selectMaterial, selectPointLight } from "../../../stores/selectors/lighting";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { ShaderProgram } from "../types/ShaderProgram";
import { GridAxisGuides } from "../utils/GridAxisGuides";
import { loadOBJModel, loadSTLModel } from "../utils/models";
import Mtl, { initMtlTextures, loadMtlFile, MtlWithTextures } from "../utils/mtl";
import { drawAxisGuides, drawGridGuides, drawScene } from "../utils/render";
import { calculateModelMatrix, calculateNormalMatrix, calculateProjectionMatrix, calculateViewMatrix } from "../utils/transform_matrices";

export function Canvas() {
	const {objFile, mtlFile, stlFile} = useContext(FileContext);

	const glRef = useRef<WebGLRenderingContext>();
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const programRef = useRef<ShaderProgram>({} as ShaderProgram);
	const lineShaderRef = useRef<ShaderProgram>({} as ShaderProgram);
	const meshesRef = useRef<MeshWithBuffers[]>([]);
	const mtlRef = useRef<MtlWithTextures>();
	const defaultTextureRef = useRef<WebGLTexture | null>(null);
	const gridAxisGuidesRef = useRef<GridAxisGuides>({} as GridAxisGuides);

	// Keep track of frame number to cancel in case of re-render.
	const [animationFrame, ] = useState({number: 0});

	// Selectors that will update model matrix
	const position = useSelector(selectPosition);
    const scale = useSelector(selectScale);
    const rotation = useSelector(selectRotation);

	// Selectors that will update their respective uniforms
	const material = useSelector(selectMaterial);
	const dirLight = useSelector(selectDirLight);
	const pointLight = useSelector(selectPointLight);

	// State hooks for keeping track of camera rotation and position
	const mouseStartPos = useRef<{clientX: number, clientY: number} | null>(null);
	const [yaw, setYaw] = useState(45);
	const [deltaYaw, setDeltaYaw] = useState(0);
	const [pitch, setPitch] = useState(30);
	const [deltaPitch, setDeltaPitch] = useState(0);
	const [dist, setDist] = useState(2);

	// Transformation matrices
	const projectionMatrixRef = useRef(mat4.create());
	const modelMatrixRef = useRef(mat4.create());
	const viewMatrixRef = useRef(mat4.create());
	const modelViewMatrixRef = useRef(mat4.create());
	const normalMatrixRef = useRef(mat4.create());
	
	// Reverse scale vector for axis guides
	const reverseScaleRef = useRef(vec3.create());

	useEffect(() => {
		// Initialize WebGLRenderingContext
		const canvas = canvasRef.current!;
		const gl = canvas.getContext("webgl");
		if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
		glRef.current = gl;

		// Initialize textures
		mtlRef.current = initMtlTextures(gl, new Mtl(""));
		defaultTextureRef.current = gl.createTexture();

		// Initialize projection matrix
		calculateProjectionMatrix(projectionMatrixRef.current, canvas, 90, 0.00001, 1000);

		// Initialize line shader program
		const lineShader = new ShaderProgram(gl, "lines-vertex-shader", "lines-fragment-shader");
		lineShaderRef.current = lineShader;
		lineShader.getAttribLocations(["aPosition", "aColor"]);
		lineShader.getUniformLocations(["uModelViewProjectionMatrix"]);
		gridAxisGuidesRef.current = new GridAxisGuides(gl, lineShader);

		// Initialize shader program
		const program = new ShaderProgram(gl, "triangles-vertex-shader", "triangles-fragment-shader");
		programRef.current = program;
		program.getAttribLocations(["aVertexPosition", "aVertexNormal", "aTextureCoord"]);
		program.getUniformLocations([
			"uModelViewMatrix", "uProjectionMatrix", "uNormalMatrix",
			"pointLight.position", "pointLight.constant", "pointLight.linear", "pointLight.quadratic", "pointLight.color",
			"material.ambient", "material.diffuse", "material.specular", "material.shininess",
			"dirLight.direction", "dirLight.color",
			"uSampler"
		]);
		program.use();

		// These uniforms might be configurable in the future, for now won't change.
		gl.uniform1f(program.uniformLocations["pointLight.constant"], 1.0);
		gl.uniform1f(program.uniformLocations["pointLight.linear"], 0.09);
		gl.uniform1f(program.uniformLocations["pointLight.quadratic"], 0.032);
		gl.uniform1f(program.uniformLocations["material.shininess"], 32.0);

		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	}, [])

	// Update meshes/mtl when imported files change
	useEffect(() => {(async () => {if (stlFile) meshesRef.current = await loadSTLModel(glRef.current!, stlFile)})()}, [stlFile]);
	useEffect(() => {(async () => {if (objFile) meshesRef.current = await loadOBJModel(glRef.current!, objFile)})()}, [objFile]);
	useEffect(() => {(async () => {if (mtlFile) mtlRef.current = await loadMtlFile(glRef.current!, mtlFile)})()}, [mtlFile]);

	// Start the render loop
	useEffect(() => {
		function render() {
			const gl = glRef.current!;

			// Clear canvas
			gl.clearColor(.235, .235, .235, 1);
			gl.clearDepth(1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.depthFunc(gl.LEQUAL);
			gl.enable(gl.DEPTH_TEST);

			// Render model
			drawScene(glRef.current!, programRef.current, meshesRef.current, mtlRef.current!, defaultTextureRef.current);

			lineShaderRef.current.use();
			const modelViewProjectionMatrix = mat4.create();

			// Render grid lines
			mat4.mul(modelViewProjectionMatrix, projectionMatrixRef.current, viewMatrixRef.current);
			glRef.current!.uniformMatrix4fv(lineShaderRef.current.uniformLocations.uModelViewProjectionMatrix, false, modelViewProjectionMatrix);
			drawGridGuides(glRef.current!, lineShaderRef.current, gridAxisGuidesRef.current);

			// Render model axis lines
			mat4.mul(modelViewProjectionMatrix, projectionMatrixRef.current, viewMatrixRef.current);
			mat4.mul(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrixRef.current);
			mat4.scale(modelViewProjectionMatrix, modelViewProjectionMatrix, reverseScaleRef.current);
			glRef.current!.uniformMatrix4fv(lineShaderRef.current.uniformLocations.uModelViewProjectionMatrix, false, modelViewProjectionMatrix);
			if (meshesRef.current.length) 
				drawAxisGuides(glRef.current!, lineShaderRef.current, gridAxisGuidesRef.current);

			programRef.current.use();
			animationFrame.number = requestAnimationFrame(render);
		}
		animationFrame.number = requestAnimationFrame(render);
		return () => cancelAnimationFrame(animationFrame.number);
	}, [animationFrame]);

	// Triggered when material properties change
	useEffect(() => {
		const gl = glRef.current!;
		const program = programRef.current;
		
		// Update default texture color
		gl.bindTexture(gl.TEXTURE_2D, defaultTextureRef.current);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([Math.floor(255 * material.diffuse[0]), Math.floor(255 * material.diffuse[1]), Math.floor(255 * material.diffuse[2]), 255]));
		
		// Update material uniforms
		gl.uniform3fv(program.uniformLocations["material.ambient"], material.ambient);
		gl.uniform3fv(program.uniformLocations["material.diffuse"], material.diffuse);
		gl.uniform3fv(program.uniformLocations["material.specular"], material.specular);

	}, [material.ambient, material.diffuse, material.specular]);

	// Triggered when directional light changes
	useEffect(() => {
		// Update directional light color uniforms
		glRef.current!.uniform3fv(programRef.current.uniformLocations["dirLight.color"], dirLight.color);
	}, [dirLight.direction, dirLight.color]);

	// Triggered when point light changes
	useEffect(() => {
		// Update point light position uniform
		glRef.current!.uniform3fv(programRef.current.uniformLocations["pointLight.color"], pointLight.color);
	}, [pointLight.position, pointLight.color]);

	// Update view matrix when camera rotation changes
	useEffect(() => {
		calculateViewMatrix(viewMatrixRef.current, yaw + deltaYaw, pitch + deltaPitch, dist);
		updateModelViewAndNormalMatrices();
	}, [deltaYaw, yaw, pitch, deltaPitch, dist]);

	// Update light direction and position when camera rotation changes
	useEffect(() => {
		// Transform point light position by view matrix
		const pointLightTransformed =  vec4.fromValues(pointLight.position[0], pointLight.position[1], pointLight.position[2], 1);
		vec4.transformMat4(pointLightTransformed, pointLightTransformed, viewMatrixRef.current);
		glRef.current!.uniform3fv(programRef.current.uniformLocations["pointLight.position"], pointLightTransformed.slice(0, 3));

		// Transform light direction by view matrix
		const dirLightTransformed = vec4.fromValues(dirLight.direction[0], dirLight.direction[1], dirLight.direction[2], 1);
		vec4.transformMat4(dirLightTransformed, dirLightTransformed, viewMatrixRef.current);
		glRef.current!.uniform3fv(programRef.current.uniformLocations["dirLight.direction"], dirLightTransformed.slice(0, 3));
	}, [deltaYaw, yaw, pitch, deltaPitch, dist, pointLight.position, dirLight.direction])

	// Update reverse scale vector when scale changes
	useEffect(() => {
		reverseScaleRef.current = vec3.fromValues(scale[0], scale[1], scale[2]);
		vec3.scale(reverseScaleRef.current, reverseScaleRef.current, scale[3]);
		vec3.scale(reverseScaleRef.current, reverseScaleRef.current, 1/dist)
		vec3.inverse(reverseScaleRef.current, reverseScaleRef.current);
	}, [scale, dist]);

	// Update model matrix when model transformations change
	useEffect(() => {
		calculateModelMatrix(modelMatrixRef.current, position, scale, rotation);
		updateModelViewAndNormalMatrices();
	}, [position, scale, rotation]);

	// Update model view matrix, normal matrix, and projection matrix
	const updateModelViewAndNormalMatrices = () => {
		const gl = glRef.current!;
		const program = programRef.current;

		mat4.mul(modelViewMatrixRef.current, viewMatrixRef.current, modelMatrixRef.current);
		calculateNormalMatrix(normalMatrixRef.current, modelViewMatrixRef.current);

		// Update transform matrix uniforms
		gl.uniformMatrix4fv(program.uniformLocations.uModelViewMatrix, false, modelViewMatrixRef.current);
		gl.uniformMatrix4fv(program.uniformLocations.uNormalMatrix, false, normalMatrixRef.current);
		gl.uniformMatrix4fv(program.uniformLocations.uProjectionMatrix, false, projectionMatrixRef.current);
	}

	// Add event listener for when the mouse is moved, used for computing camera rotation
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!mouseStartPos.current) return;
			setDeltaYaw(300 * (e.clientX - mouseStartPos.current.clientX) / window.innerWidth);
			setDeltaPitch(300 * (e.clientY - mouseStartPos.current.clientY) / window.innerHeight);
		};
		document.addEventListener("mousemove", handleMouseMove);
		return () => document.removeEventListener("mousemove", handleMouseMove);
	}, []);

	// Add event listener for when the mouse button is released, used for computing camera rotation
	useEffect(() => {
		const handleMouseUp = () => {
			mouseStartPos.current = null;
			setYaw((yaw + deltaYaw) % 360);
			setPitch(Math.max(-90, Math.min(90, pitch + deltaPitch)));
			setDeltaYaw(0);
			setDeltaPitch(0);
		};
		document.addEventListener("mouseup", handleMouseUp);
		return () => document.removeEventListener("mouseup", handleMouseUp);
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
			onWheel={(e) => {
				setDist(Math.max(0.1, dist + 0.1 * e.deltaY / Math.abs(e.deltaY)));
			}}
		/>
	);
}
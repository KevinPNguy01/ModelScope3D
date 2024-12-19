import { mat4, vec3 } from "gl-matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeshWithBuffers } from "webgl-obj-loader";
import { FileContext } from "../../../app/contexts/FileContext";
import { SceneMenu } from "../../../components/SceneMenu";
import { selectDirLight, selectMaterial, selectPointLight } from "../../../stores/selectors/lighting";
import { selectShowAxes, selectShowGrids } from "../../../stores/selectors/settings";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { GridAxisGuides } from "../types/GridAxisGuides";
import { ShaderProgram } from "../types/ShaderProgram";
import { addCanvasMouseHandlers, canvasOnMouseDown, canvasOnWheel } from "../utils/event_listeners";
import { loadModelFileFromPublic, loadOBJModel, loadSTLModel } from "../utils/models";
import Mtl, { initMtlTextures, loadMtlFile, MtlWithTextures } from "../utils/mtl";
import { drawAxisGuides, drawGridGuides, drawScene } from "../utils/render";
import { calculateProjectionMatrix } from "../utils/transform_matrices";
import { updateCameraAndView, updateDirectionalLight, updateInverseScale, updateMaterial, updateModelAndNormal, updatePointLight } from "../utils/useeffect_functions";

export function Canvas() {
	const {objFile, mtlFile, stlFile, setObjFile, setStlFile} = useContext(FileContext);

	const glRef = useRef<WebGLRenderingContext>(null as unknown as WebGLRenderingContext);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const programRef = useRef<ShaderProgram>({} as ShaderProgram);
	const lineShaderRef = useRef<ShaderProgram>({} as ShaderProgram);
	const meshesRef = useRef<MeshWithBuffers[]>([]);
	const mtlRef = useRef<MtlWithTextures>();
	const defaultTextureRef = useRef<WebGLTexture | null>(null);
	const gridAxisGuidesRef = useRef<GridAxisGuides>({} as GridAxisGuides);

	// Keep track of frame number to cancel in case of re-render.
	const animationFrame = useRef(0);

	// Selectors that will update model matrix
	const position = useSelector(selectPosition);
    const scale = useSelector(selectScale);
    const rotation = useSelector(selectRotation);

	// Selectors that will update their respective uniforms
	const material = useSelector(selectMaterial);
	const dirLight = useSelector(selectDirLight);
	const pointLight = useSelector(selectPointLight);

	// Selectors for whether to render grid/axes
	const showAxes = useSelector(selectShowAxes);
    const showGrids = useSelector(selectShowGrids);

	// State hooks for keeping track of camera rotation and position
	const mouseStartPos = useRef<{clientX: number, clientY: number} | null>(null);
	const [yaw, setYaw] = useState(45);
	const [dYaw, setDYaw] = useState(0);
	const [pitch, setPitch] = useState(30);
	const [dPitch, setDPitch] = useState(0);
	const [dist, setDist] = useState(2);

	// Transformation matrices
	const modelMatrix = useRef(mat4.create());
	const viewMatrix = useRef(mat4.create());
	const projectionMatrix = useRef(mat4.create());
	const normalMatrix = useRef(mat4.create());
	
	// Reverse scale vector for axis guides
	const inverseScale = useRef(vec3.create());

	useEffect(() => {
		// Initialize WebGLRenderingContext
		const canvas = canvasRef.current!;
		const gl = canvas.getContext("webgl");
		if (gl === null) throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.");
		glRef.current = gl;

		// Initialize default model
		(async () => {
			const file = await loadModelFileFromPublic("stanford_bunny.obj");
			if (file === null) return;
			if (file.type === "model/obj") {
				setObjFile(file);
				setStlFile(null);
			}
			else if (file.type === "model/stl") {
				setStlFile(file);
				setObjFile(null);
			}
		})();

		// Initialize textures
		mtlRef.current = initMtlTextures(gl, new Mtl(""));
		defaultTextureRef.current = gl.createTexture();

		// Initialize line shader program
		const lineShader = new ShaderProgram(gl, "lines-vertex-shader", "lines-fragment-shader");
		lineShaderRef.current = lineShader;
		lineShader.getAttribLocations(["aPosition", "aColor"]);
		lineShader.getUniformLocations(["uModelViewProjectionMatrix"]);
		gridAxisGuidesRef.current = new GridAxisGuides(gl, lineShader);

		// Initialize shader program
		const program = new ShaderProgram(gl, "pbr-vertex-shader", "pbr-fragment-shader");
		programRef.current = program;
		program.getAttribLocations(["aVertexPosition", "aVertexNormal", "aTextureCoord"]);
		program.getUniformLocations([
			"uModelMatrix", "uViewMatrix", "uProjectionMatrix", "uNormalMatrix",
			"pointLight.position", "pointLight.color",
			"material.albedo", "material.metallic", "material.roughness", "material.ao",
			"dirLight.direction", "dirLight.color",
			"sampler", "camPos",
			"metallic", "roughness", "ao"
		]);
		program.use();

		// Initialize projection matrix
		calculateProjectionMatrix(projectionMatrix.current, canvas, 90, 0.00001, 1000);
		gl.uniformMatrix4fv(program.uniformLocations.uProjectionMatrix, false, projectionMatrix.current);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	}, [setObjFile, setStlFile])

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
			drawScene(glRef.current, programRef.current, meshesRef.current, mtlRef.current!, defaultTextureRef.current);

			lineShaderRef.current.use();
			const modelViewProjectionMatrix = mat4.create();

			// Render grid lines
			if (showGrids) {
				mat4.mul(modelViewProjectionMatrix, projectionMatrix.current, viewMatrix.current);
				glRef.current!.uniformMatrix4fv(lineShaderRef.current.uniformLocations.uModelViewProjectionMatrix, false, modelViewProjectionMatrix);
				drawGridGuides(glRef.current!, lineShaderRef.current, gridAxisGuidesRef.current);
			}
			
			// Render model axis lines
			if (showAxes && meshesRef.current.length) {
				mat4.mul(modelViewProjectionMatrix, projectionMatrix.current, viewMatrix.current);
				mat4.mul(modelViewProjectionMatrix, modelViewProjectionMatrix, modelMatrix.current);
				mat4.scale(modelViewProjectionMatrix, modelViewProjectionMatrix, inverseScale.current);
				glRef.current!.uniformMatrix4fv(lineShaderRef.current.uniformLocations.uModelViewProjectionMatrix, false, modelViewProjectionMatrix);
				drawAxisGuides(glRef.current!, lineShaderRef.current, gridAxisGuidesRef.current);
			}

			programRef.current.use();
			animationFrame.current = requestAnimationFrame(render);
		}
		animationFrame.current = requestAnimationFrame(render);
		return () => cancelAnimationFrame(animationFrame.current);
	}, [showAxes, showGrids]);

	// Update meshes/mtl when imported files change
	useEffect(() => {(async () => {if (stlFile) meshesRef.current = await loadSTLModel(glRef.current, stlFile)})()}, [stlFile]);
	useEffect(() => {(async () => {if (objFile) meshesRef.current = await loadOBJModel(glRef.current, objFile)})()}, [objFile]);
	useEffect(() => {(async () => {if (mtlFile) mtlRef.current = await loadMtlFile(glRef.current, mtlFile)})()}, [mtlFile]);

	// Update uniforms when control scene parameters change
	useEffect(() => updateMaterial(glRef.current, programRef.current, material, defaultTextureRef.current), [material]);
	useEffect(() => updateDirectionalLight(glRef.current, programRef.current, dirLight), [dirLight]);
	useEffect(() => updatePointLight(glRef.current, programRef.current, pointLight), [pointLight]);
	useEffect(() => updateCameraAndView(glRef.current, programRef.current, viewMatrix.current, yaw+dYaw, pitch+dPitch, dist), [yaw, dYaw, pitch, dPitch, dist]);
	useEffect(() => updateModelAndNormal(glRef.current, programRef.current, modelMatrix.current, normalMatrix.current, position, scale, rotation), [position, scale, rotation]);
	useEffect(() => updateInverseScale(inverseScale.current, scale, dist), [scale, dist]);

	// Add mouse event listeners for the canvas
	useEffect(() => addCanvasMouseHandlers(mouseStartPos, yaw, dYaw, pitch, dPitch, setYaw, setDYaw, setPitch, setDPitch), [yaw, dYaw, pitch, dPitch]);

	return (
		<div className="relative">
			<canvas 
				ref={canvasRef} 
				id="gl-canvas" 
				width="800" 
				height="600"
				onMouseDown={canvasOnMouseDown(mouseStartPos)}
				onWheel={canvasOnWheel(dist, setDist)}
			/>
			<SceneMenu/>
		</div>
	);
}
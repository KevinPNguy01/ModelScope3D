import { mat4, vec3 } from "gl-matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeshWithBuffers } from "webgl-obj-loader";
import { FileContext } from "../../../app/contexts/FileContext";
import { SceneMenu } from "../../../components/SceneMenu";
import { selectDirLight, selectMaterial, selectPointLight } from "../../../stores/selectors/lighting";
import { selectShowAxes, selectShowGrids } from "../../../stores/selectors/settings";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { AxisLinesMesh, GridLinesMesh, LineMesh } from "../types/LineMesh";
import { ShaderProgram } from "../types/ShaderProgram";
import { addCanvasMouseHandlers, addCanvasResizeHandler, canvasOnMouseDown, canvasOnWheel } from "../utils/event_listeners";
import { loadModelFileFromPublic, loadOBJModel, loadSTLModel } from "../utils/models";
import Mtl, { initMtlTextures, loadMtlFile, MtlWithTextures } from "../utils/mtl";
import { drawLines, drawScene } from "../utils/render";
import { updateCameraAndView, updateDirectionalLight, updateInverseScale, updateMaterial, updateModelAndNormal, updatePointLight, updateProjection } from "../utils/useeffect_functions";

export function Canvas() {
	const {objFile, mtlFile, stlFile, setObjFile, setStlFile} = useContext(FileContext);

	const glRef = useRef<WebGLRenderingContext>(null as unknown as WebGLRenderingContext);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pbrShader = useRef<ShaderProgram>({} as ShaderProgram);
	const lineShader = useRef<ShaderProgram>({} as ShaderProgram);
	const meshesRef = useRef<MeshWithBuffers[]>([]);
	const mtlRef = useRef<MtlWithTextures>();
	const defaultTextureRef = useRef<WebGLTexture | null>(null);
	const gridGuides = useRef<LineMesh>({} as LineMesh);
	const axisGuides = useRef<LineMesh>({} as LineMesh);

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

	// State hook for keeping track of canvas size
	const [canvasSize, setCanvasSize] = useState({clientWidth: 800, clientHeight: 600});

	// Transformation matrices
	const modelMat = useRef(mat4.create());
	const viewMat = useRef(mat4.create());
	const projectionMat = useRef(mat4.create());
	const normalMat = useRef(mat4.create());
	
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
			const file = await loadModelFileFromPublic("fox.obj");
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
		lineShader.current = new ShaderProgram(gl, "lines-vertex-shader", "lines-fragment-shader");
		lineShader.current.getAttribLocations(["aPosition", "aColor"]);
		lineShader.current.getUniformLocations(["uModel", "uView", "uProjection", "uScale"]);
		gridGuides.current = GridLinesMesh(gl, lineShader.current);
		axisGuides.current = AxisLinesMesh(gl, lineShader.current);
		lineShader.current.use();

		// Initialize shader program
		const program = new ShaderProgram(gl, "pbr-vertex-shader", "pbr-fragment-shader");
		pbrShader.current = program;
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
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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

			drawScene(glRef.current, pbrShader.current, meshesRef.current, mtlRef.current!, defaultTextureRef.current);
			if (showGrids) drawLines(glRef.current, lineShader.current, mat4.create(), vec3.fromValues(1, 1, 1), gridGuides.current, false);
			if (showAxes && meshesRef.current.length) drawLines(glRef.current, lineShader.current, modelMat.current, inverseScale.current, axisGuides.current, true);

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
	useEffect(() => updateMaterial(glRef.current, pbrShader.current, material, defaultTextureRef.current), [material]);
	useEffect(() => updateDirectionalLight(glRef.current, pbrShader.current, dirLight), [dirLight]);
	useEffect(() => updatePointLight(glRef.current, pbrShader.current, pointLight), [pointLight]);
	useEffect(() => updateProjection(glRef.current, pbrShader.current, lineShader.current, projectionMat.current, canvasSize), [canvasSize])
	useEffect(() => updateCameraAndView(glRef.current, pbrShader.current, lineShader.current, viewMat.current, yaw+dYaw, pitch+dPitch, dist), [yaw, dYaw, pitch, dPitch, dist]);
	useEffect(() => updateModelAndNormal(glRef.current, pbrShader.current, modelMat.current, normalMat.current, position, scale, rotation), [position, scale, rotation]);
	useEffect(() => updateInverseScale(inverseScale.current, scale, dist), [scale, dist]);

	// Add event listeners for the canvas
	useEffect(() => addCanvasMouseHandlers(mouseStartPos, yaw, dYaw, pitch, dPitch, setYaw, setDYaw, setPitch, setDPitch), [yaw, dYaw, pitch, dPitch]);
	useEffect(() => addCanvasResizeHandler(canvasRef, setCanvasSize), []);

	return (
		<div className="relative flex flex-grow">
			<canvas 
				className="w-full h-full"
				ref={canvasRef} 
				id="gl-canvas" 
				width="0" 
				height="0"
				onMouseDown={canvasOnMouseDown(mouseStartPos)}
				onWheel={canvasOnWheel(dist, setDist)}
			/>
			<SceneMenu/>
		</div>
	);
}
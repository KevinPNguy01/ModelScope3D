import { mat4, vec3 } from "gl-matrix";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MeshWithBuffers } from "webgl-obj-loader";
import { ExportContext } from "../../../app/contexts/ExportContext";
import { FileContext } from "../../../app/contexts/FileContext";
import { selectDirLight, selectMaterial, selectPointLight } from "../../../stores/selectors/lighting";
import { selectFov, selectShowAxes, selectShowGrids, selectShowSidePanel } from "../../../stores/selectors/settings";
import { selectPosition, selectRotation, selectScale } from "../../../stores/selectors/transformations";
import { loadModelFileFromPublic } from "../../../utils/models/models";
import Mtl, { initMtlTextures, loadMtlFile, MtlWithTextures } from "../../../utils/models/mtl";
import { loadOBJModel } from "../../../utils/models/obj_loader";
import { loadSTLModel } from "../../../utils/models/stl_loader";
import { loadTextures } from "../../../utils/models/textures";
import { AxisLinesMesh, GridLinesMesh, LineMesh } from "../types/LineMesh";
import { ShaderProgram } from "../types/ShaderProgram";
import { addCanvasMouseHandlers, addCanvasResizeHandler, canvasOnMouseDown, canvasOnWheel, canvasResize } from "../utils/event_listeners";
import { exportAsSTL } from "../utils/export_stl";
import { drawLines, drawScene } from "../utils/render";
import { takeScreenshot } from "../utils/screenshot";
import { updateCameraAndView, updateCameraPos, updateDirectionalLight, updateInverseScale, updateMaterial, updateModelAndNormal, updatePointLight, updateProjection } from "../utils/useeffect_functions";

export function Canvas() {
	const {objFile, mtlFile, stlFile, setObjFile, setStlFile, setMtlFile, textureFiles} = useContext(FileContext);

	const glRef = useRef<WebGLRenderingContext>(null as unknown as WebGLRenderingContext);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const pbrShader = useRef<ShaderProgram>({} as ShaderProgram);
	const lineShader = useRef<ShaderProgram>({} as ShaderProgram);
	const meshesRef = useRef<MeshWithBuffers[]>([]);
	const mtlRef = useRef<MtlWithTextures>();
	const defaultTextureRef = useRef<WebGLTexture | null>(null);
	const gridGuides = useRef<LineMesh>({} as LineMesh);
	const axisGuides = useRef<LineMesh>({} as LineMesh);

	// Flag for whether to screenshot
	const {exportScreenshot, exportSTL} = useContext(ExportContext);

	// Keep track of frame number to cancel in case of re-render.
	const animationFrame = useRef(0);

	// Selector that will update projection matrix
	const fov = useSelector(selectFov);

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
	const mouseStartPos = useRef({clientX: -1, clientY: -1});
	const mouseHoldType = useRef<"left" | "right" | null>(null);
	const [cameraPos, setCameraPos] = useState(vec3.create());
	const [focalPoint, setFocalPoint] = useState(vec3.create());
	const [yaw, setYaw] = useState(-45);
	const [pitch, setPitch] = useState(30);
	const [dist, setDist] = useState(2);

	// State hook for keeping track of canvas size
	const [canvasSize, setCanvasSize] = useState({clientWidth: 800, clientHeight: 600});
	const showSidePanel = useSelector(selectShowSidePanel);

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
			const mtlFile = await loadModelFileFromPublic("fox.mtl");
			if (file === null) return;
			if (file.name.endsWith(".obj")) {
				setObjFile(file);
				setStlFile(null);
				setMtlFile(mtlFile);
			}
			else if (file.name.endsWith(".stl")) {
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
	}, [setMtlFile, setObjFile, setStlFile])

	// Start the render loop
	useEffect(() => {
		function render() {
			const gl = glRef.current!;

			// Clear canvas
			gl.clearColor(.235, .235, .235, exportScreenshot.current ? 0 : 1);
			gl.clearDepth(1);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.depthFunc(gl.LEQUAL);
			gl.enable(gl.DEPTH_TEST);

			drawScene(glRef.current, pbrShader.current, meshesRef.current, mtlRef.current!, defaultTextureRef.current);
			if (showGrids) drawLines(glRef.current, lineShader.current, mat4.create(), vec3.fromValues(1, 1, 1), gridGuides.current, false);
			if (showAxes && meshesRef.current.length) drawLines(glRef.current, lineShader.current, modelMat.current, inverseScale.current, axisGuides.current, true);

			if (exportScreenshot.current) takeScreenshot(canvasRef.current!, exportScreenshot);
			if (exportSTL.current) exportAsSTL(meshesRef.current, modelMat.current, normalMat.current, exportSTL);
			animationFrame.current = requestAnimationFrame(render);
		}
		animationFrame.current = requestAnimationFrame(render);
		return () => cancelAnimationFrame(animationFrame.current);
	}, [exportSTL, exportScreenshot, showAxes, showGrids]);

	// Update meshes/mtl when imported files change
	useEffect(() => {(async () => {if (stlFile) meshesRef.current = await loadSTLModel(glRef.current, stlFile)})()}, [stlFile]);
	useEffect(() => {(async () => {if (objFile) meshesRef.current = await loadOBJModel(glRef.current, objFile)})()}, [objFile]);
	useEffect(() => {(async () => {
		if (mtlFile) mtlRef.current = await loadMtlFile(glRef.current, mtlFile)
		loadTextures(glRef.current, textureFiles, mtlRef.current!)
	})()}, [mtlFile, textureFiles]);

	// Update uniforms when control scene parameters change
	useEffect(() => updateMaterial(glRef.current, pbrShader.current, material, defaultTextureRef.current), [material]);
	useEffect(() => updateDirectionalLight(glRef.current, pbrShader.current, dirLight), [dirLight]);
	useEffect(() => updatePointLight(glRef.current, pbrShader.current, pointLight), [pointLight]);
	useEffect(() => updateProjection(glRef.current, pbrShader.current, lineShader.current, projectionMat.current, canvasSize, fov), [canvasSize, fov])
	useEffect(() => updateCameraAndView(glRef.current, pbrShader.current, lineShader.current, viewMat.current, cameraPos, focalPoint), [cameraPos, focalPoint]);
	useEffect(() => updateModelAndNormal(glRef.current, pbrShader.current, modelMat.current, normalMat.current, position, scale, rotation), [position, scale, rotation]);
	useEffect(() => updateInverseScale(inverseScale.current, scale, dist), [scale, dist]);
	useEffect(() => updateCameraPos(setCameraPos, focalPoint, yaw, pitch, dist), [focalPoint, yaw, pitch, dist]);

	// Add event listeners for the canvas
	useEffect(() => addCanvasMouseHandlers(
		mouseStartPos, mouseHoldType, yaw, setYaw, pitch, setPitch, cameraPos, setCameraPos, focalPoint, setFocalPoint
	), [yaw, pitch, cameraPos, focalPoint]);
	useEffect(() => addCanvasResizeHandler(canvasRef, setCanvasSize), []);
	useEffect(() => canvasResize(canvasRef, setCanvasSize)(), [showSidePanel])

	return (
		<div className="relative flex flex-grow">
			<canvas 
				className="w-full h-full"
				ref={canvasRef} 
				id="gl-canvas" 
				width="0" 
				height="0"
				onMouseDown={canvasOnMouseDown(mouseStartPos, mouseHoldType)}
				onWheel={canvasOnWheel(dist, setDist)}
				onContextMenu={(e) => e.preventDefault()}
			/>
		</div>
	);
}
import { mat4, vec3 } from "gl-matrix";
import { LightingState } from "../../../stores/slices/lighting";
import { ShaderProgram } from "../types/ShaderProgram";
import { calculateCameraPosition, calculateModelMatrix, calculateNormalMatrix, calculateViewMatrix } from "./transform_matrices";

export function updateMaterial(gl: WebGLRenderingContext, program: ShaderProgram, material: LightingState["material"], texture: WebGLTexture | null) {
    program.use();

    // Update default texture color
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(material.albedo.map(num => Math.floor(255 * num)).concat([255])));
    
    // Update material uniforms
    gl.uniform3fv(program.uniformLocations["material.albedo"], material.albedo);
    gl.uniform1f(program.uniformLocations["material.metallic"], material.metallic);
    gl.uniform1f(program.uniformLocations["material.roughness"], material.roughness);
    gl.uniform1f(program.uniformLocations["material.ao"], material.ao);
}

export function updateDirectionalLight(gl: WebGLRenderingContext, program: ShaderProgram, dirLight: LightingState["dirLight"]) {
    program.use();

    // Update directional light color uniforms
    gl.uniform3fv(program.uniformLocations["dirLight.direction"], dirLight.direction);
    gl.uniform3fv(program.uniformLocations["dirLight.color"], dirLight.color);
}

export function updatePointLight(gl: WebGLRenderingContext, program: ShaderProgram, pointLight: LightingState["pointLight"]) {
    program.use();

    // Update directional light color uniforms
    gl.uniform3fv(program.uniformLocations["pointLight.position"], pointLight.position);
    gl.uniform3fv(program.uniformLocations["pointLight.color"], pointLight.color);
}

export function updateCameraAndView(gl: WebGLRenderingContext, program: ShaderProgram, viewMatrix: mat4, yaw: number, pitch: number, dist: number) {
    program.use();

    // Calculate camera position and view matrix
    const cameraPos = calculateCameraPosition(yaw, pitch , dist);
    calculateViewMatrix(viewMatrix, cameraPos);

    // Update camera position and view matrix uniforms
    gl.uniform3fv(program.uniformLocations.camPos, cameraPos);
    gl.uniformMatrix4fv(program.uniformLocations.uViewMatrix, false, viewMatrix);
}

export function updateModelAndNormal(
    gl: WebGLRenderingContext, program: ShaderProgram, modelMatrix: mat4, normalMatrix: mat4, 
    position: number[], scale: number[], rotation: number[]
) {
    program.use();

    // Calculate model matrix and normal matrix;
    calculateModelMatrix(modelMatrix, position, scale, rotation);
    calculateNormalMatrix(normalMatrix, modelMatrix);

    // Update uniforms
    gl.uniformMatrix4fv(program.uniformLocations.uModelMatrix, false, modelMatrix);
    gl.uniformMatrix4fv(program.uniformLocations.uNormalMatrix, false, normalMatrix);
}

export function updateInverseScale(inverseScale: vec3, scale: number[], dist: number,) {
    vec3.set(inverseScale, scale[0], scale[1], scale[2]);
    vec3.scale(inverseScale, inverseScale, scale[3]);
    vec3.scale(inverseScale, inverseScale, 1/dist)
    vec3.inverse(inverseScale, inverseScale);
}
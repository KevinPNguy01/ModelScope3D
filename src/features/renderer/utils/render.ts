import { mat4 } from "gl-matrix";
import { MeshWithBuffers } from "webgl-obj-loader";
import { Buffers, ProgramInfo } from "../types";
import { mat4_inverse } from "./mat4";

export function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, meshes: MeshWithBuffers[], texture: WebGLTexture, rotation: number) {
    gl.clearColor(.235, .235, .235, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const canvas = gl.canvas as HTMLCanvasElement;
    const fov = (45 * Math.PI) / 180;
    const aspect =  canvas.clientWidth / canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 1000;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fov, aspect, zNear, zFar);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0.5, -6]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, Math.PI / 8, [1, 0, 0]);
    mat4.rotate(modelViewMatrix, modelViewMatrix, rotation * 0.7, [0, 1, 0]);
    mat4.scale(modelViewMatrix, modelViewMatrix, [0.025, 0.025, 0.025]);

    const normalMatrix = mat4.create();
    mat4_inverse(modelViewMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.normalMatrix,
        false,
        normalMatrix
    );

    const lightPos = [0, 0, 0]                   // Camera-space position of the light source
    const lightPower = 10;  

    const diffuseColor = [1, 0, 0];    // Diffuse color
    const specularColor = [1.0, 1.0, 1.0];            // Default white
    const ambientIntensity = 0.0;                     // Ambient

    const indexOfRefraction = 0.1;
    const beta = 1;

    gl.uniform3fv(programInfo.uniformLocations.lightPos, lightPos);
    gl.uniform1f(programInfo.uniformLocations.lightPower, lightPower);
    gl.uniform3fv(programInfo.uniformLocations.kd, diffuseColor);
    gl.uniform3fv(programInfo.uniformLocations.specular, specularColor);
    gl.uniform1f(programInfo.uniformLocations.ambient, ambientIntensity);
    gl.uniform1f(programInfo.uniformLocations.indexOfRefraction, indexOfRefraction);
    gl.uniform1f(programInfo.uniformLocations.beta, beta);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    

    for (const mesh of meshes) {         
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexNormal, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

function setPositionAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

function setNormalAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexNormal,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}

function setColorAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexColor,
        numComponents,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

function setTextureAttribute(gl: WebGLRenderingContext, programInfo: ProgramInfo, buffers: Buffers) {
    const num = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        num,
        type,
        normalize,
        stride,
        offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
}
import { MeshWithBuffers } from "webgl-obj-loader";
import { ProgramInfo } from "../types";

export function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, meshes: MeshWithBuffers[], texture: WebGLTexture) {
    gl.clearColor(.235, .235, .235, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

    const lightPos = [0, 0, 0]                   // Camera-space position of the light source
    const lightPower = 10;  

    const diffuseColor = [0.9647058823529412, 0.8117647058823529, 0.3411764705882353];    // Diffuse color
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
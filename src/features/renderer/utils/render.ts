import { MeshWithBuffers } from "webgl-obj-loader";
import { ShaderProgram } from "../types/ShaderProgram";
import { GridAxisGuides } from "./GridAxisGuides";
import { MtlWithTextures } from "./mtl";

export function drawScene(gl: WebGLRenderingContext, program: ShaderProgram, meshes: MeshWithBuffers[], mtl: MtlWithTextures, defaultTexture: WebGLTexture | null) {
    program.use();
    gl.clearColor(.235, .235, .235, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enableVertexAttribArray(program.attribLocations.aVertexPosition);
    gl.enableVertexAttribArray(program.attribLocations.aVertexNormal);
    gl.enableVertexAttribArray(program.attribLocations.aTextureCoord);

    gl.uniform1i(program.uniformLocations.uSampler, 0);

    for (const mesh of meshes) {  
        const texture = mtl.textures.get(mesh.materialNames[0]) || defaultTexture;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vertexBuffer);
        gl.vertexAttribPointer(program.attribLocations.aVertexPosition, mesh.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.textureBuffer);
        gl.vertexAttribPointer(program.attribLocations.aTextureCoord, mesh.textureBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, mesh.normalBuffer);
        gl.vertexAttribPointer(program.attribLocations.aVertexNormal, mesh.normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
        gl.drawElements(gl.TRIANGLES, mesh.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }
}

export function drawGridAxisGuides(gl: WebGLRenderingContext, lineShader: ShaderProgram, gridAxisGuides: GridAxisGuides) {
    lineShader.use();

    gl.enableVertexAttribArray(lineShader.attribLocations.aPosition);
    gl.enableVertexAttribArray(lineShader.attribLocations.aColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, gridAxisGuides.pointsBuffer);
    gl.vertexAttribPointer(lineShader.attribLocations.aPosition, 3, gl.FLOAT, false, 0, 0);
        
    gl.bindBuffer(gl.ARRAY_BUFFER, gridAxisGuides.colorsBuffer);
    gl.vertexAttribPointer(lineShader.attribLocations.aColor, 3, gl.FLOAT, false, 0, 0);
    
    gl.drawArrays(gl.LINES, 0, 50);
}
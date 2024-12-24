import { mat4, vec3 } from "gl-matrix";
import { MeshWithBuffers } from "webgl-obj-loader";
import { MtlWithTextures } from "../../../utils/models/mtl";
import { LineMesh } from "../types/LineMesh";
import { ShaderProgram } from "../types/ShaderProgram";

export function drawScene(gl: WebGLRenderingContext, program: ShaderProgram, meshes: MeshWithBuffers[], mtl: MtlWithTextures, defaultTexture: WebGLTexture | null) {
    if (!meshes.length) return;
    program.use();

    gl.enableVertexAttribArray(program.attribLocations.aVertexPosition);
    gl.enableVertexAttribArray(program.attribLocations.aVertexNormal);
    gl.enableVertexAttribArray(program.attribLocations.aTextureCoord);

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

export function drawLines(gl: WebGLRenderingContext, lineShader: ShaderProgram, modelMat: mat4, scale: vec3, gridGuides: LineMesh, disableDepth: boolean) {
    lineShader.use();

    gl.uniformMatrix4fv(lineShader.uniformLocations.uModel, false, modelMat);
    gl.uniform3fv(lineShader.uniformLocations.uScale, scale);

    gl.enableVertexAttribArray(lineShader.attribLocations.aPosition);
    gl.enableVertexAttribArray(lineShader.attribLocations.aColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, gridGuides.pointsBuffer);
    gl.vertexAttribPointer(lineShader.attribLocations.aPosition, 3, gl.FLOAT, false, 0, 0);
        
    gl.bindBuffer(gl.ARRAY_BUFFER, gridGuides.colorBuffer);
    gl.vertexAttribPointer(lineShader.attribLocations.aColor, 3, gl.FLOAT, false, 0, 0);

    if (disableDepth) gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.LINES, 0, 100);
    gl.enable(gl.DEPTH_TEST);
}
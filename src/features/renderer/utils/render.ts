import { MeshWithBuffers } from "webgl-obj-loader";
import { ProgramInfo } from "../types";
import { MtlWithTextures } from "./mtl";

export function drawScene(gl: WebGLRenderingContext, programInfo: ProgramInfo, meshes: MeshWithBuffers[], mtl: MtlWithTextures) {
    gl.clearColor(.235, .235, .235, 1);
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);

    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    for (const mesh of meshes) {  
        const texture = mtl.textures.get(mesh.materialNames[0]) || mtl.defaultTexture;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
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
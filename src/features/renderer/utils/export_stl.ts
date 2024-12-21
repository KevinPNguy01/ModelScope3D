import { mat4, vec4 } from "gl-matrix";
import { MutableRefObject } from "react";
import { MeshWithBuffers } from "webgl-obj-loader";

export function exportAsSTL(meshes: MeshWithBuffers[], modelMat: mat4, normalMat: mat4, exportSTL: MutableRefObject<boolean>) {
    exportSTL.current = false;
    const bytes = meshesToSTLBytes(meshes, modelMat, normalMat);
    downloadSTLBytes(bytes);
}

/**
 * Converts an integer to an array of 4 bytes as little endian
 * @param num The integer to convert
 * @returns The resulting array of 4 bytes
 */
function intToLittleEndianBytes(num: number) {
    const bytes = new Uint8Array(4);
    for (let i = 0; i < 4; i++) {
        bytes[i] = num & 0xff;
        num >>= 8;
    }
    return Array.from(bytes);
}

/**
 * Converts a float to an array of 4 bytes as little endian
 * @param num The float to convert
 * @returns The resulting array of 4 bytes
 */
function floatToLittleEndianBytes(float: number) {
    const buffer = new ArrayBuffer(4); // Create a buffer of the desired size
    const view = new DataView(buffer);
    view.setFloat32(0, float, true); // Write as little-endian float32
    return Array.from(new Uint8Array(buffer)); // Convert the buffer to a byte array
}

/**
 * Converts an array of meshes to bytes in STL format.
 * @param meshes The meshes to convert
 * @param modelMat The model transformation matrix
 * @param modelMat The model normal transformation matrix
 * @returns The resulting array of bytes in STL format
 */
function meshesToSTLBytes(meshes: MeshWithBuffers[], modelMat: mat4, normalMat: mat4) {
    

    // Empty header bytes.
    const bytes = new Array(80).fill(0);

    // Sum up the number of triangles from all the meshes.
    const numOfTriangles = meshes.map(mesh => mesh.indicesPerMaterial[0].length).flat().reduce((a, b) => a+b) / 3;
    bytes.push(...intToLittleEndianBytes(numOfTriangles));

    // For every mesh
    for (const mesh of meshes) {
        // For every triangle
        for (let i = 0; i < mesh.indices.length; i += 3) {
            const i1 = mesh.indices[i] * 3;
            const i2 = mesh.indices[i+1] * 3;
            const i3 = mesh.indices[i+2] * 3;
            const normal = [0, 0, 0];

            // Calculate average normal of 3 vertices
            for (let j = 0; j < 3; ++j) {
                normal[j] += mesh.vertexNormals[i1 + j]/3;
                normal[j] += mesh.vertexNormals[i2 + j]/3;
                normal[j] += mesh.vertexNormals[i3 + j]/3;
            }

            // Transform normal by normal matrix
            const newNormal = vec4.fromValues(normal[0], normal[1], normal[2], 1);
            vec4.transformMat4(newNormal, newNormal, normalMat);
            for (const j of [0, 2, 1]) {
                bytes.push(...floatToLittleEndianBytes(newNormal[j]));
            }

            // Process each of the 12 vertices of the triangle
            for (const index of [i1, i2, i3]) {
                // Transform vertex by model matrix
                const newVertex = vec4.fromValues(mesh.vertices[index], mesh.vertices[index+1], mesh.vertices[index+2], 1);
                vec4.transformMat4(newVertex, newVertex, modelMat);
                for (const j of [0, 2, 1]) {
                    bytes.push(...floatToLittleEndianBytes(newVertex[j]));
                }
            }
            bytes.push(0, 0);
        }
    }
    return bytes;
}

/**
 * Prompts a download of the bytes as an STL file.
 * @param bytes The bytes representing the STL file contents
 */
function downloadSTLBytes(bytes: number[]) {
    const byteArray = new Uint8Array(bytes);
    const blob = new Blob([byteArray], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ModelScope_model.stl';
    a.click();
    URL.revokeObjectURL(url);
}
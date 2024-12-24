import { vec3 } from "gl-matrix";
import { Mesh, initMeshBuffers } from "webgl-obj-loader";
import { normalizeMesh, splitMesh } from "./models";

/**
 * Given a file representing an OBJ model, generate a MeshWithBuffers object for it.
 * @param gl The WebGLRenderingContext
 * @param file The OBJ file
 * @returns A MeshWithBuffers object containg the OBJ data
 */
export async function loadOBJModel(gl: WebGLRenderingContext, file: File) {
    const modelString = await file.text();

    const mesh = new Mesh(modelString);
    
    // Vectors used to calculate the normals per face
    const e1 = vec3.create();
    const e2 = vec3.create();
    const norm = vec3.create();

    // Compute the normals for each vertex by aggregating the normals of each associated face.
    const noNormals = !mesh.vertexNormals.length || isNaN(mesh.vertexNormals[0]);
    if (noNormals) mesh.vertexNormals = new Array(mesh.vertices.length).fill(0);
    for (const indices of mesh.indicesPerMaterial) {
        for (let i = 0; i < indices.length; i += 3) {
            const i1 = (indices[i]) * 3;
            const i2 = (indices[i + 1]) * 3;
            const i3 = (indices[i + 2]) * 3;
            const v1 = getVertex(mesh.vertices, i1);
            const v2 = getVertex(mesh.vertices, i2);
            const v3 = getVertex(mesh.vertices, i3);
    
            vec3.sub(e1, v2, v1);
            vec3.sub(e2, v3, v1);
      
            vec3.cross(norm, e1, e2);
            vec3.normalize(norm, norm);
    
            const idxs = [i1, i2, i3];
            for (const idx of idxs) {
                for (let j = 0; j < 3; ++j) {
                    if (noNormals)
                        mesh.vertexNormals[idx+j] += norm[j];
                }
            }
        }
    }

    // Normalize normals
    for (let i = 0; i < mesh.vertexNormals.length; i += 3) {
        const x = mesh.vertexNormals[i];
        const y = mesh.vertexNormals[i+1];
        const z = mesh.vertexNormals[i+2];
        const len = Math.sqrt(x*x + y*y + z*z);
        if (len > 0) {
            mesh.vertexNormals[i] /= len;
            mesh.vertexNormals[i+1] /= len;
            mesh.vertexNormals[i+2] /= len;
        }
    }

    return splitMesh(normalizeMesh(mesh)).map(mesh => initMeshBuffers(gl, mesh));
}

function getVertex(vertices: number[], index: number) {
    return vec3.fromValues(vertices[index], vertices[index + 1], vertices[index + 2]);
}
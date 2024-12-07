import { vec3 } from "gl-matrix";
import { initMeshBuffers, Mesh } from "webgl-obj-loader";

export async function loadModel(gl: WebGLRenderingContext, path: string) {
    const modelString = await loadModelFile(path);
    const mesh = new Mesh(modelString);
    
    const e1 = vec3.create();
    const e2 = vec3.create();
    const norm = vec3.create();

    // Keep track of minimum and maximum dimensions to normalize scale later.
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    // Compute the normals for each vertex by aggregating the normals of each associated face.
    mesh.vertexNormals = new Array(mesh.vertices.length).fill(0);
    for (const indices of mesh.indicesPerMaterial) {
        for (let i = 0; i < indices.length; i += 3) {
            const i1 = (indices[i]) * 3;
            const i2 = (indices[i + 1]) * 3;
            const i3 = (indices[i + 2]) * 3;
            const v1 = getVertex(mesh.vertices, i1);
            const v2 = getVertex(mesh.vertices, i2);
            const v3 = getVertex(mesh.vertices, i3);
    
            // Update min and max for each dimension.
            for (const v of [v1, v2, v3]) {
                for (let j = 0; j < 3; ++j) {
                    min[j] = Math.min(min[j], v[j]);
                    max[j] = Math.max(min[j], v[j]);
                }
            }
    
            vec3.sub(e1, v2, v1);
            vec3.sub(e2, v3, v1);
    
            vec3.cross(norm, e1, e2);
            vec3.normalize(norm, norm);
    
            const idxs = [i1, i2, i3];
            for (const idx of idxs) {
                for (let j = 0; j < 3; ++j) {
                    mesh.vertexNormals[idx+j] += norm[j];
                }
            }
        }
    }

    // Find the largest dimension and use to normalize the magnitude of the vertices.
    const size = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
    for (let i = 0; i < mesh.vertices.length; ++i) {
        mesh.vertices[i] /= size;
    }

    // Normalize normals.
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

    mesh.textures = [];
    for (let i = 0; i < mesh.vertices.length / 3 * 2; ++i) {
        mesh.textures.push(-1);
    }    
    return splitMesh(mesh).map(mesh => initMeshBuffers(gl, mesh));
}

function splitMesh(mesh: Mesh) {
    const meshes = [];
    for (const indices of mesh.indicesPerMaterial) {
        for (let offset = 0; offset < indices.length; offset += 65535) {
            const indexMap = new Map<number, number>();
            const partialMesh = new Mesh("");
            for (let i = 0; i < 65535 && offset + i < indices.length; ++i) {
                const idx = indices[offset+i];
                if (!indexMap.has(idx)) {
                    indexMap.set(idx, indexMap.size);
                    for (let j = 0; j < 3; ++j) {
                        partialMesh.vertices.push(mesh.vertices[idx*3+j]);
                        partialMesh.vertexNormals.push(mesh.vertexNormals[idx*3+j]);
                        if (j < 2) {
                            partialMesh.textures.push(mesh.textures[idx*2+j]);
                        }
                    }
                }
                partialMesh.indices.push(indexMap.get(idx)!);
            }
            meshes.push(partialMesh);
        }
    }
    return meshes;
}

function getVertex(vertices: number[], index: number) {
    return vec3.fromValues(vertices[index], vertices[index + 1], vertices[index + 2]);
}

const loadModelFile = async (path: string): Promise<string> => {
    try {
        const response = await fetch("./models/" + path);
        if (!response.ok) {
            throw new Error(`Failed to load model file: ${path}`);
        }
        return await response.text();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
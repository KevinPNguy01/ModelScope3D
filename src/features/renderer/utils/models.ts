import { vec3 } from "gl-matrix";
import { initMeshBuffers, Mesh } from "webgl-obj-loader";

export async function loadSTLModel(gl: WebGLRenderingContext, file: File) {
    const isBinary = await isBinarySTL(file);
    
    if (isBinary) {
        const stlBuffer = await loadBinaryStlData(file);
        const mesh = loadBinaryStl(stlBuffer);
        return splitMesh(mesh).map(mesh => initMeshBuffers(gl, mesh));
    } else {
        const stlString = await loadAsciiStlData(file);
        const mesh = loadAsciiStl(stlString);
        return splitMesh(mesh).map(mesh => initMeshBuffers(gl, mesh));
    }
}

function isBinarySTL(file: File) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const header = new Uint8Array(arrayBuffer, 0, Math.min(80, arrayBuffer.byteLength));

            const text = new TextDecoder().decode(header);
            resolve(!text.trim().startsWith("solid"));      // Ascii STL starts with "solid"
        };

        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsArrayBuffer(file);
    });
}

function loadBinaryStlData(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as ArrayBuffer)
        };

        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsArrayBuffer(file);
    });
}

function loadBinaryStl(buffer: ArrayBuffer) {
    const mesh = new Mesh("");
    mesh.indicesPerMaterial = [[]];
    const view = new DataView(buffer);
    const triangleCount = view.getUint32(80, true);

    let byteIndex = 84;
    for (let f = 0; f < triangleCount; ++f) {
        mesh.indicesPerMaterial[0].push(mesh.vertices.length/3, mesh.vertices.length/3+1, mesh.vertices.length/3+2);

        const nx = view.getFloat32(byteIndex, true);
        const ny = view.getFloat32(byteIndex+4, true);
        const nz = view.getFloat32(byteIndex+8, true);
        mesh.vertexNormals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
        byteIndex += 12;
        
        for (let i = 0; i < 9; ++i) {
            const num = view.getFloat32(byteIndex, true);
            mesh.vertices.push(num);
            byteIndex += 4;
        }
        byteIndex += 2;
    }
    
    normalizeMesh(mesh);
    return mesh;
}

function loadAsciiStlData(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            resolve(reader.result as string)
        };

        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsText(file);
    });
}

function loadAsciiStl(data: string) {
    const mesh = new Mesh("")
    mesh.indicesPerMaterial = [[]];

    data.split("\n").forEach(line => {
        const tokens = line.trim().split(" ");
        switch (tokens[0]) {
            case "solid":
                break;
            case "facet": {
                const x = Number.parseFloat(tokens[2]);
                const y = Number.parseFloat(tokens[3]);
                const z = Number.parseFloat(tokens[4]);
                mesh.vertexNormals.push(x, y, z, x, y, z, x, y, z);
                break;
            }
            case "outer": 
                break;
            case "vertex": {
                const x = Number.parseFloat(tokens[1]);
                const y = Number.parseFloat(tokens[2]);
                const z = Number.parseFloat(tokens[3]);

                mesh.indicesPerMaterial[0].push(mesh.vertices.length/3);
                mesh.vertices.push(x, y, z)
                break;
            }
            case "endloop":
                break;
            case "endfacet":
                break;
            case "endsolid":
                break;
        }
    });

    normalizeMesh(mesh);
    return mesh;
}

export async function loadOBJModel(gl: WebGLRenderingContext, file: File) {
    const modelString = await file.text();

    const mesh = new Mesh(modelString);
    
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

    normalizeMesh(mesh);
    return splitMesh(mesh).map(mesh => initMeshBuffers(gl, mesh));
}

/**
 * Normalize the given mesh by setting its maximum dimension size to 1, and centering it at the origin
 * @param mesh The mesh to normalize
 */
function normalizeMesh(mesh: Mesh) {
    // Keep track of minimum, maximum, and mean dimensions to normalize scale later
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];

    // Iterate through all the vertices to find the minimum, maximum, and mean
    for (let i = 0; i < mesh.vertices.length; i += 3) {
        const x = mesh.vertices[i], y = mesh.vertices[i+1], z = mesh.vertices[i+2];
        [x, y, z].forEach((num, i) => {
            min[i] = Math.min(min[i], num);
            max[i] = Math.max(max[i], num);
        });
    }
    const center = max.map((num, i) => (num + min[i]) / 2);

    // Find the largest dimension and use to normalize the magnitude of the vertices
    const size = Math.max(max[0] - min[0], max[1] - min[1], max[2] - min[2]);

    // Shift each coordinate by the mean in that dimension and then scale
    for (let i = 0; i < mesh.vertices.length; i += 3) {
        for (let j = 0; j < 3; ++j) {
            mesh.vertices[i+j] = (mesh.vertices[i+j] - center[j]) / size;
        }
    }
}

function splitMesh(mesh: Mesh) {
    const meshes = [];
    for (let materialIndex = 0; materialIndex < mesh.indicesPerMaterial.length; ++materialIndex) {
        const indices = mesh.indicesPerMaterial[materialIndex]
        for (let offset = 0; offset < indices.length; offset += 65535) {
            const indexMap = new Map<number, number>();
            const partialMesh = new Mesh("");
            partialMesh.materialNames = [mesh.materialNames[materialIndex]];
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
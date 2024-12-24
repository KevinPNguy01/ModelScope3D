import { Mesh } from "webgl-obj-loader";

/**
 * Loads a file from the public/models folder.
 * @param path The path of the file
 * @returns A File object representing the model or null if it doesn't exist
 */
export async function loadModelFileFromPublic(path: string) {
    const response = await fetch("./models/" + path);
    const blob = await response.blob();
    const file = new File([blob], path, { type: blob.type });
    return file.type === "model/obj" || file.type === "model/stl" ? file : null;
}

/**
 * Normalize the given mesh by setting its maximum dimension size to 1, and centering it at the origin, above y = 0
 * @param mesh The mesh to normalize
 * @returns The same mesh, but normalized
 */
export function normalizeMesh(mesh: Mesh) {
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

    // Shift each coordinate in each dimension and then scale
    for (let i = 0; i < mesh.vertices.length; i += 3) {
        mesh.vertices[i] = (mesh.vertices[i] - center[0]) / size;
        mesh.vertices[i+1] = (mesh.vertices[i+1] - min[1]) / size;
        mesh.vertices[i+2] = (mesh.vertices[i+2] - center[2]) / size;
    }

    return mesh
}

/**
 * Splits a mesh into submeshes to fit in the WebGL 16-bit indices limit.
 * @param mesh The mesh to split
 * @returns A list of the submeshes.
 */
export function splitMesh(mesh: Mesh) {
    const meshes = [];
    // Iterate through all the material groups
    for (let materialIndex = 0; materialIndex < mesh.indicesPerMaterial.length; ++materialIndex) {
        const indices = mesh.indicesPerMaterial[materialIndex];
        // Split into groups of 65535 indices
        for (let offset = 0; offset < indices.length; offset += 65535) {
            const indexMap = new Map<number, number>();
            const partialMesh = new Mesh("");
            partialMesh.materialNames = [mesh.materialNames[materialIndex]];
            // Re-index every vertex, normal, and texture coordinates for this submesh
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
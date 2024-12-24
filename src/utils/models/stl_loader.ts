import { initMeshBuffers, Mesh } from "webgl-obj-loader";
import { normalizeMesh, splitMesh } from "./models";

/**
 * Given a file representing an STL model, generate a MeshWithBuffers object for it.
 * @param gl The WebGLRenderingContext
 * @param file The STL file
 * @returns A MeshWithBuffers object containg the STL data
 */
export async function loadSTLModel(gl: WebGLRenderingContext, file: File) {
    const isBinary = !(await file.text()).startsWith("solid");
    
    if (isBinary) {
        const stlBuffer = await file.arrayBuffer();
        const mesh = loadBinaryStl(stlBuffer);
        return splitMesh(mesh).map(mesh => initMeshBuffers(gl, mesh));
    } else {
        const stlString = await file.text();
        const mesh = loadAsciiStl(stlString);
        return splitMesh(mesh).map(mesh => initMeshBuffers(gl, mesh));
    }
}

function loadBinaryStl(buffer: ArrayBuffer) {
    const mesh = new Mesh("");
    mesh.indicesPerMaterial = [[]];
    const view = new DataView(buffer);
    const triangleCount = view.getUint32(80, true);

    let byteIndex = 84;
    for (let f = 0; f < triangleCount; ++f) {
        // Add indices
        mesh.indicesPerMaterial[0].push(mesh.vertices.length/3, mesh.vertices.length/3+1, mesh.vertices.length/3+2);

        // Add normals
        const nx = view.getFloat32(byteIndex, true);
        const ny = view.getFloat32(byteIndex+8, true);
        const nz = view.getFloat32(byteIndex+4, true);
        mesh.vertexNormals.push(nx, ny, nz, nx, ny, nz, nx, ny, nz);
        byteIndex += 12;
        
        // Add vertices
        for (let i = 0; i < 3; ++i) {
            const x = view.getFloat32(byteIndex, true);
            const z = view.getFloat32(byteIndex+4, true);
            const y = view.getFloat32(byteIndex+8, true);
            mesh.vertices.push(x, y, z);
            byteIndex += 12;
        }
        byteIndex += 2;
    }
    
    normalizeMesh(mesh);
    return mesh;
}

function loadAsciiStl(data: string) {
    const mesh = new Mesh("")
    mesh.indicesPerMaterial = [[]];

    data.split("\n").forEach(line => {
        const tokens = line.trim().split(" ");
        switch (tokens[0]) {
            case "facet": {
                // Add indices
                mesh.indicesPerMaterial[0].push(mesh.vertices.length/3, mesh.vertices.length/3+1, mesh.vertices.length/3+2);

                // Add normals
                const x = Number.parseFloat(tokens[2]);
                const y = Number.parseFloat(tokens[4]);
                const z = Number.parseFloat(tokens[3]);
                mesh.vertexNormals.push(x, y, z, x, y, z, x, y, z);
                break;
            }
            case "vertex": {
                // Add vertices
                const x = Number.parseFloat(tokens[1]);
                const y = Number.parseFloat(tokens[3]);
                const z = Number.parseFloat(tokens[2]);
                mesh.vertices.push(x, y, z)
                break;
            }
        }
    });

    return normalizeMesh(mesh);
}
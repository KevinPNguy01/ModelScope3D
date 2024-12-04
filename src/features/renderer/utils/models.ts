import { initMeshBuffers, Mesh } from "webgl-obj-loader";

export async function loadModel(gl: WebGLRenderingContext, path: string) {
    const modelString = await loadModelFile(path);
    const mesh = new Mesh(modelString);
    return initMeshBuffers(gl, mesh);
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
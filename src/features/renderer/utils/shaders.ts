export async function initShaderProgram(gl: WebGLRenderingContext, vsPath: string, fsPath: string) {
    const vertexShader = await loadShader(gl, gl.VERTEX_SHADER, vsPath);
    const fragmentShader = await loadShader(gl, gl.FRAGMENT_SHADER, fsPath);

    const shaderProgram = gl.createProgram();
    if (shaderProgram === null) throw new Error("Error creating shader program");
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw new Error(`Error initializing shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    }
    return shaderProgram;
}

async function loadShader(gl: WebGLRenderingContext, type: GLenum, path: string) {
    const shader = gl.createShader(type);
    if (shader === null) throw new Error("Error creating shader");

    const source = await loadShaderFile(path);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
}

const loadShaderFile = async (path: string): Promise<string> => {
    try {
        const response = await fetch("./shaders/" + path);
        if (!response.ok) {
            throw new Error(`Failed to load shader file: ${path}`);
        }
        return await response.text();
    } catch (error) {
        console.error(error);
        throw error;
    }
};
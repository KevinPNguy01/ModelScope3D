export function initShaderProgram(gl: WebGLRenderingContext, vsName: string, fsName: string) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsName);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsName);

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

function loadShader(gl: WebGLRenderingContext, type: GLenum, name: string) {
    const shader = gl.createShader(type);
    if (shader === null) throw new Error("Error creating shader");

    const shaderSource = document.getElementById(name)?.textContent;
    if (!shaderSource) throw new Error(`Error creating shader: Couldn't find shader "${name}"`);

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        throw new Error(`Error compiling shader: ${gl.getShaderInfoLog(shader)}`);
    }
    
    return shader;
}
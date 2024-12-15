export class ShaderProgram {
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    attribLocations: Record<string, number>;
    uniformLocations: Record<string, WebGLUniformLocation | null>;

    constructor(gl: WebGLRenderingContext, vsName: string, fsName: string) {
        this.gl = gl;
        this.program = this.#createProgram(vsName, fsName);
        this.attribLocations = {};
        this.uniformLocations = {};
    }

    #createProgram(vsName: string, fsName: string) {
        const program = this.gl.createProgram();
        if (program === null) throw new Error("Error creating shader program");

        this.gl.attachShader(program, this.#loadShader(this.gl.VERTEX_SHADER, vsName));
        this.gl.attachShader(program, this.#loadShader(this.gl.FRAGMENT_SHADER, fsName));
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw new Error(`Error initializing shader program: ${this.gl.getProgramInfoLog(program)}`);
        }
        return program;
    }

    #loadShader(type: GLenum, name: string) {
        const shader = this.gl.createShader(type);
        if (shader === null) throw new Error("Error creating shader");
    
        const shaderSource = document.getElementById(name)?.textContent;
        if (!shaderSource) throw new Error(`Error creating shader: Couldn't find shader "${name}"`);
    
        this.gl.shaderSource(shader, shaderSource);
        this.gl.compileShader(shader);
    
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error(`Error compiling shader: ${this.gl.getShaderInfoLog(shader)}`);
        }
        
        return shader;
    }

    getAttribLocations(attribs: string[]) {
        for (const attrib of attribs) {
            this.attribLocations[attrib] = this.gl.getAttribLocation(this.program, attrib);
        }
    }

    getUniformLocations(uniforms: string[]) {
        for (const uniform of uniforms) {
            this.uniformLocations[uniform] = this.gl.getUniformLocation(this.program, uniform);
        }
    }

    use() {
        this.gl.useProgram(this.program);
    }
}
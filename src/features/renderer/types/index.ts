type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: {
		vertexPosition: GLint,
		colorPosition: GLint,
		textureCoord: GLint
    },
    uniformLocations: {
		projectionMatrix: WebGLUniformLocation | null,
		modelViewMatrix: WebGLUniformLocation | null,
		uSampler: WebGLUniformLocation | null
    },
};

type Buffers = {
    position: WebGLBuffer | null,
    color: WebGLBuffer | null,
    indices: WebGLBuffer | null,
    textureCoord: WebGLBuffer | null
}

export type {ProgramInfo, Buffers}
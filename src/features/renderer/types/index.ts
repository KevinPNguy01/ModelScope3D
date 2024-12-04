type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: {
		vertexPosition: GLint,
    normalPosition: GLint,
		colorPosition: GLint,
		textureCoord: GLint
    },
    uniformLocations: {
		modelViewMatrix: WebGLUniformLocation | null,
		projectionMatrix: WebGLUniformLocation | null,
		normalMatrix: WebGLUniformLocation | null,
		uSampler: WebGLUniformLocation | null,

		lightPos: WebGLUniformLocation | null,
		lightPower: WebGLUniformLocation | null,
		kd: WebGLUniformLocation | null,
		specular: WebGLUniformLocation | null,
		ambient: WebGLUniformLocation | null,
		indexOfRefraction: WebGLUniformLocation | null,
		beta: WebGLUniformLocation | null
    },
};

type Buffers = {
    position: WebGLBuffer | null,
    normal: WebGLBuffer | null,
    color: WebGLBuffer | null,
    indices: WebGLBuffer | null,
    textureCoord: WebGLBuffer | null
}

export type {ProgramInfo, Buffers}
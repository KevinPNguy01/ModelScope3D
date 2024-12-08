export type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: {
		vertexPosition: GLint,
    	vertexNormal: GLint,
		vertexColor: GLint,
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
		beta: WebGLUniformLocation | null,

		pointLight: WebGLUniformLocation | null,
		material: WebGLUniformLocation | null,
		dirLight: WebGLUniformLocation | null
    },
};
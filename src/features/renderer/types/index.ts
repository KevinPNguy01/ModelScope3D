type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: {
      vertexPosition: GLint,
      colorPosition: GLint
    },
    uniformLocations: {
      projectionMatrix: WebGLUniformLocation | null,
      modelViewMatrix: WebGLUniformLocation | null,
    },
};

type Buffers = {
    position: WebGLBuffer | null,
    color: WebGLBuffer | null
}

export type {ProgramInfo, Buffers}
type ProgramInfo = {
    program: WebGLProgram,
    attribLocations: {
      vertexPosition: GLint,
    },
    uniformLocations: {
      projectionMatrix: WebGLUniformLocation | null,
      modelViewMatrix: WebGLUniformLocation | null,
    },
};

type Buffers = {
    position: WebGLBuffer | null
}

export type {ProgramInfo, Buffers}
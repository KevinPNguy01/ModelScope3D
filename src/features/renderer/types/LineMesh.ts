import { ShaderProgram } from "./ShaderProgram";

export class LineMesh {
    pointsBuffer: WebGLBuffer | null;
    colorBuffer: WebGLBuffer | null;
    pointsCount: number;

    constructor(gl: WebGLRenderingContext, lineShader: ShaderProgram, points: number[], colors: number[]) {
        lineShader.use();

        this.pointsBuffer = gl.createBuffer();
        this.colorBuffer = gl.createBuffer();
        this.pointsCount = points.length;
        this.#initBuffers(gl, lineShader, points, colors);
    }

    #initBuffers(gl: WebGLRenderingContext, lineShader: ShaderProgram, gridPoints: number[], gridColors: number[]) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridPoints), gl.STATIC_DRAW);
        gl.vertexAttribPointer(lineShader.attribLocations.aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(lineShader.attribLocations.aPosition);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridColors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(lineShader.attribLocations.aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(lineShader.attribLocations.aColor);
    }
}

export function GridLinesMesh(gl: WebGLRenderingContext, lineShader: ShaderProgram) {
    const c = 0.05; // Color used for basic grid lines

    // X and Z axis grid lines
    const gridPoints = [-0.5, 0, -0.5, 0.5, 0, -0.5, -0.5, 0, -0.5, -0.5, 0, 0.5];
    const gridColors = [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1];

    // Inner grid lines
    for (let w = -0.4; w <= 0.5; w += 0.1) {
        gridPoints.push(w, 0, -0.5, w, 0, 0.5, -0.5, 0, w, 0.5, 0, w);
        for (let i = 0; i < 12; ++i) gridColors.push(c);
    }

    // Outer grid lines
    gridPoints.push(1.5, 0, -1.5, 1.5, 0, 1.5, -1.5, 0, 1.5, 1.5, 0, 1.5);
    for (let i = 0; i < 12; ++i) gridColors.push(c);
    for (let x = -1.5; x < 1.5; x+=1) {
        for (let z = -1.5; z < 1.5; z+=1) {
            if (x+.5 || z+.5) {
                gridPoints.push(x, 0, z, x+1, 0, z, x, 0, z, x, 0, z+1);
                for (let i = 0; i < 12; ++i) gridColors.push(c);
            }
        }
    }
    return new LineMesh(gl, lineShader, gridPoints, gridColors);
}

export function AxisLinesMesh(gl: WebGLRenderingContext, lineShader: ShaderProgram) {
    const l = 0.25;
    const axisPoints = [
        0, 0, 0,
        l, 0, 0,
        0, 0, 0,
        0, l, 0,
        0, 0, 0,
        0, 0, l
    ];
    const axisColors = [
        1, 0, 0,
        1, 0, 0,
        0, 1, 0,
        0, 1, 0,
        0, 0, 1,
        0, 0, 1
    ];
    return new LineMesh(gl, lineShader, axisPoints, axisColors);
}
import { ShaderProgram } from "../types/ShaderProgram";

export class GridAxisGuides {
    pointsBuffer: WebGLBuffer | null;
    colorsBuffer: WebGLBuffer | null;

    constructor(gl: WebGLRenderingContext, lineShader: ShaderProgram) {
        const points = [
            -1, 0, 0,
            1, 0, 0,
            0, -1, 0,
            0, 1, 0,
            0, 0, -1,
            0, 0, 1
        ];
        const colors = [
            1, 0, 0,
            1, 0, 0,
            0, 1, 0,
            0, 1, 0,
            0, 0, 1,
            0, 0, 1
        ];

        const w = 0.5;
        const c = 0.25;
        for (let i = -w; i <= w; i += 0.1) {
            points.push(
                i, -.001, -w, 
                i, -.001, w, 
                -w, -.001, i,
                w, -.001, i
            );
            colors.push(c, c, c, c, c, c, c, c, c, c, c, c);
        }

        lineShader.use();

        this.pointsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.pointsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
        gl.vertexAttribPointer(lineShader.attribLocations.aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(lineShader.attribLocations.aPosition);
        
        this.colorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(lineShader.attribLocations.aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(lineShader.attribLocations.aColor);
    }
}
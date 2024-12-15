import { ShaderProgram } from "../types/ShaderProgram";

export class GridAxisGuides {
    gridPointsBuffer: WebGLBuffer | null;
    gridColorsBuffer: WebGLBuffer | null;
    axisPointsBuffer: WebGLBuffer | null;
    axisColorsBuffer: WebGLBuffer | null;

    constructor(gl: WebGLRenderingContext, lineShader: ShaderProgram) {
        lineShader.use();

        // Data for world grid lines
        const w = 0.5;
        const c = 0.05;

        const gridPoints = [
            -w, 0, -w,
            w, 0, -w,
            -w, 0, -w,
            -w, 0, w
        ];
        const gridColors = [
            1, 0, 0,
            1, 0, 0,
            0, 0, 1,
            0, 0, 1
        ];

        for (let i = -w + 0.1; i <= w; i += 0.1) {
            gridPoints.push(
                i, 0, -w, 
                i, 0, w, 
                -w, 0, i,
                w, 0, i
            );
            gridColors.push(c, c, c, c, c, c, c, c, c, c, c, c);
        }

        this.gridPointsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gridPointsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridPoints), gl.STATIC_DRAW);
        gl.vertexAttribPointer(lineShader.attribLocations.aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(lineShader.attribLocations.aPosition);
        
        this.gridColorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gridColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(gridColors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(lineShader.attribLocations.aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(lineShader.attribLocations.aColor);

        // Data for model axis lines
        const l = 0.25;
        const axisPoints = [
            -l, 0, 0,
            l, 0, 0,
            0, -l, 0,
            0, l, 0,
            0, 0, -l,
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

        this.axisPointsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.axisPointsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axisPoints), gl.STATIC_DRAW);
        gl.vertexAttribPointer(lineShader.attribLocations.aPosition, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(lineShader.attribLocations.aPosition);
        
        this.axisColorsBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.axisColorsBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(axisColors), gl.STATIC_DRAW);
        gl.vertexAttribPointer(lineShader.attribLocations.aColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(lineShader.attribLocations.aColor);
    }
}
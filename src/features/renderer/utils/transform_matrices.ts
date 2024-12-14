import { mat4, vec3 } from "gl-matrix";
import { mat4_inverse } from "./mat4";

/**
 * Calculates the model matrix given the position, scale, and rotation vectors.
 * @param out mat4 matrix that will be written into
 * @param position 3 numbers representing position
 * @param scale 4 numbers representing scale along each axis, with the 4th number being the overall scale
 * @param rotation 3 numbers representing rotation around the x, y, and z axes
 */
export function calculateModelMatrix(out: mat4, position: number[], scale: number[], rotation: number[]) {
    mat4.identity(out);
    const positionVec = vec3.fromValues(position[0], position[1], position[2]);
    const scaleVec = vec3.fromValues(scale[0], scale[1], scale[2]);
    const rotationVec = vec3.fromValues(rotation[0], rotation[1], rotation[2]);

    vec3.scale(rotationVec, rotationVec, Math.PI/180);	// Convert to radians
    vec3.scale(scaleVec, scaleVec, scale[3]);			// Scale by overall scale factor

    // Apply scale
    mat4.scale(out, out, scaleVec);

    // Rotate by euler angles
    mat4.rotate(out, out, rotationVec[1], [0, 1, 0]);
    mat4.rotate(out, out, rotationVec[0], [1, 0, 0]);
    mat4.rotate(out, out, rotationVec[2], [0, 0, 1]);

    // Apply translation
    mat4.translate(out, out, positionVec);
}

/**
 * Calculates the view matrix for a camera looking at the origin.
 * @param out mat4 matrix that will be written into
 * @param yaw Yaw (horizontal rotation) of the camera
 * @param pitch Pitch (vertical rotation) of the camera
 * @param dist Distance from the origin
 */
export function calculateViewMatrix(out: mat4, yaw: number, pitch: number, dist: number) {
    const yawAngle = -Math.PI / 180 * yaw;
    const pitchAngle = Math.PI / 180 * Math.max(-90, Math.min(90, pitch));
    const cameraPos = vec3.fromValues(Math.cos(pitchAngle) * Math.sin(yawAngle), Math.sin(pitchAngle), Math.cos(pitchAngle) * Math.cos(yawAngle));
    vec3.scale(cameraPos, cameraPos, dist);
    mat4.lookAt(out, cameraPos, [0, 0, 0], [0, 1, 0]);
}

/**
 * Calculates the perspective projection matrix with the given bounds. The near/far clip planes correspond to a normalized device coordinate Z range of [-1, 1], which matches WebGL/OpenGL's clip volume. Passing null/undefined/no value for far will generate infinite projection matrix.
 * @param out mat4 matrix that will be written into
 * @param canvas HTMLCanvasElement for computing aspect ratio
 * @param fov Vertical field of view in degrees
 * @param near Near bound of the frustum
 * @param far Far bound of the frustum, can be null or Infinity
 */
export function calculateProjectionMatrix(out: mat4, canvas: HTMLCanvasElement, fov: number, near: number, far: number) {
    const fovy = (fov * Math.PI) / 180;
    const aspect =  canvas.clientWidth / canvas.clientHeight;
    mat4.perspective(out, fovy, aspect, near, far);
}

/**
 * Calculates the normal matrix for the given model view matrix.
 * @param out mat4 matrix that will be written into
 * @param modelViewMatrix The model view matrix to derive the normal matrix from
 */
export function calculateNormalMatrix(out: mat4, modelViewMatrix: mat4) {
    mat4_inverse(modelViewMatrix, out);
    mat4.transpose(out, out);
}
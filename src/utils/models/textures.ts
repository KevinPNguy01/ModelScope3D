import { MtlWithTextures } from "./mtl";

export function loadTextures(gl: WebGLRenderingContext, files: File[], mtl: MtlWithTextures) {
    for (const file of files) {
        const fileName = file.name;
        for (const [materialName, material] of mtl.materials.entries()) {
            if (material.diffuseMap === fileName) {
                mtl.textures.set(materialName, loadTexture(gl, file));
            }
        }
    }
}

function loadTexture(gl: WebGLRenderingContext, file: File) {
    const texture = gl.createTexture();
    if (texture === null) throw new Error("Error creating texture: " + file.name);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };
    image.src = URL.createObjectURL(file);

    return texture;
}
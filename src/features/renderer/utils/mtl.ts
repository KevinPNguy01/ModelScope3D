type Material = {
    ambient: number[]
    diffuse: number[]
    specular: number[]
    ambientMap: string
    diffuseMap: string
    specularMap: string
    defaultTexture: WebGLTexture
}

export type MtlWithTextures = Mtl & {
    textures: Map<string, WebGLTexture>
    defaultTexture: WebGLTexture
}

export async function loadMtlFile(gl: WebGLRenderingContext, file: File) {
    const mtlString = await file.text();
    const mtl = new Mtl(mtlString);
    const mtlWithTextures = initMtlTextures(gl, mtl);
    return mtlWithTextures;
}

export default class Mtl {
    materials: Map<string, Material>;

    constructor(objectData: string) {
        this.materials = new Map<string, Material>();
        let currentMaterial = null;

        for (const line of objectData.split("\n")) {
            const cleanedLine = line.split('#')[0].trim();
            if (!cleanedLine) continue;

            const parts = cleanedLine.split(/\s+/);
            const command = parts[0].toLowerCase();
            const args = parts.slice(1);

            switch (command) {
                case 'newmtl': // Define a new material
                    currentMaterial = args[0];
                    this.materials.set(currentMaterial, {} as Material);
                    break;
                case 'ka': // Ambient color
                    if (currentMaterial) {
                        this.materials.get(currentMaterial)!.ambient = args.map(parseFloat);
                    }
                    break;
                case 'kd': // Diffuse color
                    if (currentMaterial) {
                        this.materials.get(currentMaterial)!.diffuse = args.map(parseFloat);
                    }
                    break;
                case 'ks': // Specular color
                if (currentMaterial) {
                    this.materials.get(currentMaterial)!.specular = args.map(parseFloat);
                }
                break;
                case 'map_kd': // Diffuse texture map
                    if (currentMaterial) {
                        this.materials.get(currentMaterial)!.diffuseMap = args.join(' ');
                    }
                    break;
                case 'map_ka': // Ambient texture map
                    if (currentMaterial) {
                        this.materials.get(currentMaterial)!.ambientMap = args.join(' ');
                    }
                    break;
                case 'map_ks': // Specular texture map
                    if (currentMaterial) {
                        this.materials.get(currentMaterial)!.specularMap = args.join(' ');
                    }
                    break;
            }
        }
    }
}

export function initMtlTextures(gl: WebGLRenderingContext, mtl: Mtl) {
    const mtlWithTextures = mtl as MtlWithTextures;
    mtlWithTextures.textures = new Map<string, WebGLTexture>();
    
    for (const key of mtl.materials.keys()) {
        mtlWithTextures.textures.set(key, loadTexture(gl, mtl.materials.get(key)!.diffuseMap));
    }

    return mtlWithTextures;
}

function loadTexture(gl: WebGLRenderingContext, path: string) {
    const texture = gl.createTexture();
    if (texture === null) throw new Error("Error creating texture: " + path);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));

    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    };
    image.src = "./models/" + path;

    return texture;
}
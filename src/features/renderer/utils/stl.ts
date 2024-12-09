
function isBinaryStl(data: string) {
    return !data.startsWith("solid");
}

export default class Stl {
    constructor(data: string) {
        if (isBinaryStl(data)) {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(data);
            let filePos = 0;
            const header = bytes.slice(filePos, filePos + 80);
            console.log(bytes)
            filePos += 80;
            const numFacesBytes = bytes.slice(filePos, filePos + 4);
            filePos += 4;
            console.log(header)
            const numFaces = numFacesBytes[0] | (numFacesBytes[1] << 8) | (numFacesBytes[2] << 16) | (numFacesBytes[3] << 24);
            console.log(numFaces);
        } else {
            data.split("n").forEach(line => {
                console.log(line);
            });
        }
    }
}
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uNormalMatrix;      

attribute vec3 aVertexPosition;     // Vertex position in object space
attribute vec3 aVertexNormal;       // Vertex normal in object space
attribute vec2 aTextureCoord;

varying vec3 vPosition;             // Vertex position (camera space)
varying vec3 vNormal;               // Vertex normal (camera space)
varying highp vec2 vTextureCoord;

void main(void) {
    vec4 camSpacePosition = uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vPosition = vec3(camSpacePosition);

    gl_Position = uProjectionMatrix * camSpacePosition;

    vec4 camSpaceNormal = uNormalMatrix * vec4(aVertexNormal, 0.0);
    vNormal = vec3(camSpaceNormal);

    vTextureCoord = aTextureCoord;
}
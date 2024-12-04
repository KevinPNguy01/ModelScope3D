precision mediump float;

uniform vec3 uLightPos;             // Light position in camera space
uniform float uLightPower;          // Light power
uniform vec3 uDiffuseColor;         // Diffuse color
uniform vec3 uSpecularColor;        // Specular color
uniform float uBeta;                // Roughness
uniform float uIOR;                 // Index of refraction
uniform float uAmbient;             // Ambient

uniform sampler2D uSampler;

varying vec3 vPosition;             // Fragment position (camera space)
varying vec3 vNormal;               // Fragment normal (camera space)
varying highp vec2 vTextureCoord;

float angle(vec3 A, vec3 B) {
    return acos(dot(A, B) / (length(A) * length(B)));
}
float G1(vec3 v, vec3 h) {
    float theta = angle(v, normalize(vNormal));
    return 2.0 / (1.0 + sqrt(1.0 + uBeta * uBeta * pow(tan(theta), 2.0)));
}

void main(void) {
    // Dummy variable to ensure the use of all vertex attributes.
    vec4 zero = vec4(vPosition + vNormal - vPosition - vNormal, 0.0);

    // Task 4
    vec3 n_norm = normalize(vNormal);
    vec3 i = uLightPos - vPosition;
    vec3 i_norm = normalize(i);
    vec3 o_norm = -(vPosition/length(vPosition));
    float I = uLightPower / (pow((length(i)), 2.0) / 5.0 + 5.0);
    vec3 h_norm = (i_norm + o_norm) / length(i_norm + o_norm);

    vec3 diffuseColor = uDiffuseColor;
    if (vTextureCoord != vec2(-1, -1)) {
        diffuseColor = texture2D(uSampler, vTextureCoord).xyz;
    }
    gl_FragColor = vec4(uAmbient * diffuseColor, 1.0);
    if (dot(n_norm, i_norm) > 0.0) {
        float c = dot(i_norm, h_norm);
        float g = sqrt(uIOR * uIOR - 1.0 + c * c);
        float F = 0.5 * pow(g - c, 2.0) / pow(g + c, 2.0) * (1.0 + pow((c * (g + c) - 1.0) / (c * (g - c) + 1.0), 2.0));
        float theta = angle(n_norm, h_norm);
        float D = pow(uBeta, 2.0) / (3.14159 * pow(cos(theta), 4.0) * pow(uBeta * uBeta + pow(tan(theta), 2.0), 2.0));
        float G = G1(i_norm, h_norm) * G1(o_norm, h_norm);

        gl_FragColor = vec4(I * dot(n_norm, i_norm) * (diffuseColor + uSpecularColor * F * D * G / (4.0 * dot(n_norm, i_norm) * dot(n_norm, o_norm))) + diffuseColor * uAmbient, 1);
    }
}
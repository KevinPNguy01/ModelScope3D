precision mediump float;

struct Material {
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
}; 

struct DirLight {
    vec3 direction;
    vec3 color;
};

struct PointLight {    
    vec3 position;
    
    float constant;
    float linear;
    float quadratic;  

    vec3 color;
};  

uniform PointLight pointLight;
uniform Material material;
uniform DirLight dirLight;

uniform sampler2D uSampler;

varying vec3 vPosition;
varying vec3 vNormal;
varying highp vec2 vTextureCoord;

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir) {
    vec3 lightDir = normalize(-light.direction);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    float spec = pow(max(dot(normal, halfwayDir), 0.0), material.shininess);
    // combine results
    vec3 ambient  = light.color * material.ambient;
    vec3 diffuse  = light.color * diff * (texture2D(uSampler, vTextureCoord).rgb);
    vec3 specular = light.color * spec * material.specular;
    return (ambient + diffuse + specular);
}

vec3 CalcPointLight(PointLight light, vec3 normal, vec3 fragPos, vec3 viewDir) {
    vec3 lightDir = normalize(light.position - fragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    // diffuse shading
    float diff = max(dot(normal, lightDir), 0.0);
    // specular shading
    float spec = pow(max(dot(normal, halfwayDir), 0.0), material.shininess);
    // attenuation
    float distance = length(light.position - fragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    vec3 ambient  = light.color * material.ambient;
    vec3 diffuse  = light.color * diff * texture2D(uSampler, vTextureCoord).rgb;
    vec3 specular = light.color * spec * material.specular;
    ambient  *= attenuation;
    diffuse  *= attenuation;
    specular *= attenuation;
    return (ambient + diffuse + specular);
} 

void main() {
    vec3 norm = normalize(vNormal);
    vec3 viewDir = normalize(-vPosition);

    if (dot(norm, viewDir) < 0.0) {
        norm = -norm;
    }

    vec3 result = CalcDirLight(dirLight, norm, viewDir);
    result += CalcPointLight(pointLight, norm, vPosition, viewDir);    
    
    gl_FragColor = vec4(result, 1.0);
}
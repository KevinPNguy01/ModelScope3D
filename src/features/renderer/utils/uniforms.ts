export function setUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
    // Material
    const materialAmbientLoc = gl.getUniformLocation(program, "material.ambient");
    const materialDiffuseLoc = gl.getUniformLocation(program, "material.diffuse");
    const materialSpecularLoc = gl.getUniformLocation(program, "material.specular");
    const materialShininessLoc = gl.getUniformLocation(program, "material.shininess");

    // DirLight
    const dirLightDirectionLoc = gl.getUniformLocation(program, "dirLight.direction");
    const dirLightAmbientLoc = gl.getUniformLocation(program, "dirLight.ambient");
    const dirLightDiffuseLoc = gl.getUniformLocation(program, "dirLight.diffuse");
    const dirLightSpecularLoc = gl.getUniformLocation(program, "dirLight.specular");

    // PointLight
    const pointLightPositionLoc = gl.getUniformLocation(program, "pointLight.position");
    const pointLightConstantLoc = gl.getUniformLocation(program, "pointLight.constant");
    const pointLightLinearLoc = gl.getUniformLocation(program, "pointLight.linear");
    const pointLightQuadraticLoc = gl.getUniformLocation(program, "pointLight.quadratic");
    const pointLightAmbientLoc = gl.getUniformLocation(program, "pointLight.ambient");
    const pointLightDiffuseLoc = gl.getUniformLocation(program, "pointLight.diffuse");
    const pointLightSpecularLoc = gl.getUniformLocation(program, "pointLight.specular");

    // Material
    gl.uniform3fv(materialAmbientLoc, [0.2, 0.1, 0.0]);  // Example values
    gl.uniform3fv(materialDiffuseLoc, [0.8, 0.4, 0.1]);
    gl.uniform3fv(materialSpecularLoc, [1.0, 0.9, 0.8]);
    gl.uniform1f(materialShininessLoc, 32.0);

    // DirLight
    gl.uniform3fv(dirLightDirectionLoc, [-0.2, -1.0, -0.3]);
    gl.uniform3fv(dirLightAmbientLoc, [0.05, 0.05, 0.05]);
    gl.uniform3fv(dirLightDiffuseLoc, [0.4, 0.4, 0.4]);
    gl.uniform3fv(dirLightSpecularLoc, [0.5, 0.5, 0.5]);

    // PointLight
    gl.uniform3fv(pointLightPositionLoc, [1.2, 1.0, 2.0]);
    gl.uniform1f(pointLightConstantLoc, 1.0);
    gl.uniform1f(pointLightLinearLoc, 0.09);
    gl.uniform1f(pointLightQuadraticLoc, 0.032);
    gl.uniform3fv(pointLightAmbientLoc, [0.2, 0.2, 0.2]);
    gl.uniform3fv(pointLightDiffuseLoc, [0.5, 0.5, 0.5]);
    gl.uniform3fv(pointLightSpecularLoc, [1.0, 1.0, 1.0]);
}

varying vec2 vUv;

varying vec3 vNormal;

uniform float normScale;
uniform float normalizationFactor;
uniform float displacement;
uniform float timeFactor;

void main() {
    vNormal = normal;
	vUv = uv;
    float t = (timeFactor);

    float animatedNormScale = normScale + sin(t*5.0) ;

	vec4 modelViewPosition = modelViewMatrix * vec4(position + normal * normalizationFactor * (displacement + animatedNormScale) , 1.0);
    gl_Position = projectionMatrix * modelViewPosition; 
}

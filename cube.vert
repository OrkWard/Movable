attribute highp vec3 aVertexNormal;
attribute highp vec3 aVertexPosition;
attribute highp vec2 aTextureCoord;

uniform highp mat4 uNormalMatrix;
uniform highp mat4 uMVMatrix;
uniform highp mat4 uPMatrix;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
  vTextureCoord = aTextureCoord;

  // Apply lighting effect

  highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);
  highp vec3 directionalLightColor = vec3(1.0);
  highp vec3 directionalVector = normalize(vec3(1, 0, 0.5));

  highp vec4 transformedNormal = normalize(uNormalMatrix * vec4(aVertexNormal, 1.0));

  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
  vLighting = ambientLight + (directionalLightColor * directional);
}
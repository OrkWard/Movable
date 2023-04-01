attribute vec3 aVertexPosition;
// attribute vec4 aVertexColor;
attribute vec2 aTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTexCoord;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0f);
  vTexCoord = aTexCoord;
}
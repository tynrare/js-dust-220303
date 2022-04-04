precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec3 pointer;

#pragma glslify: circleImage = require('./iquilezles-circle.glsl')
#pragma glslify: raymarch = require('./iquilezles-raymarch.glsl')


void main() {
  //circleImage(gl_FragColor, gl_FragCoord.xy, resolution, pointer);
  raymarch(gl_FragColor, gl_FragCoord.xy, resolution, time);
}
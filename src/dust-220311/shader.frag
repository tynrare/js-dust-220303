precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec3 pointer;

#pragma glslify: circleImage = require('./iquilezles-circle.glsl')


void main() {
  circleImage(gl_FragColor, gl_FragCoord.xy, resolution, pointer);
  /*
  float vmin = min(resolution.y, resolution.x);
  vec2 p = (gl_FragCoord.xy - .5 * resolution) / vmin;
  float r = .5 + .5 * sin(5. * log(length(p)) - time * 1.2);
  float g = .5 + .5 * sin(5. * log(length(p)) + sin(time + 2. * p.x));  
  float b = .5 + .5 * sin(.2 + 5. * log(length(p)) + sin(time * .4 + 4. * p.y));
  gl_FragColor = vec4(r, g, b, 1.);
  */

}
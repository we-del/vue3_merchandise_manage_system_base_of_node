/**
  @description 服务于片元着色器的glsl
*/

precision lowp float;// 如果在RowShaderMaterial中需要进行精度声明


varying float vPositionY;// 接收外部暴露的vPosition变量
varying vec2 vUv;

uniform float uTime;
uniform float u_time;
#define PI 3.1415926// 定义全局变量 ，语法和c基本相同

float random (vec2 st);
vec2 rotate(vec2 uv, float rotation, vec2 mid);
float noise (in vec2 _st);

void main() {

    /**
      @description step(p1,p2) // p1 > p2 返回0  p1 < p2 返回1
                mod(p1,p2) 相当于 p1 % p2 (glsl不支持%)
    */
    //        float u = step(.6, distance(vUv, vec2(0.5)));
    //    float u =mod(atan(vUv.x - .5, vUv.y - .5)*10.0, PI);
    //    float u =smoothstep(mod(uTime,1.0), 1.0-pow(abs(vUv.x), .5))/PI;
    //    u +=1.0-pow(abs(vUv.y), .5);
    //        float u = abs(cos(uTime)-vUv.x);
//    float u = step(.8, sin(noise(vUv*10.0)*20.0));
            float u = abs(cos(uTime)-vUv.x);
    // mix 可以将两个颜色进行混合返回得为一个vec3 ，接收三个参数，第一个参数为 colorA,第二个为colorB,第三个为混合强度
    vec3 mixColor = mix(vec3(.12, .23, .57), vec3(.68, .12, .76), vUv.y);
//    if(gl_FrontFacing){
//
//        gl_FragColor = vec4(mixColor/1.5, 1.0);
//    }else{
//
//        gl_FragColor = vec4(mixColor, 1.0);
//    }
    gl_FragColor = vec4(mixColor/1.5, 1.0);
}


// 随机函数
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)))*43758.5453123);
}

// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
    cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
    cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}

// 噪声函数
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}


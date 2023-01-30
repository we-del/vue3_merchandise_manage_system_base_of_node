/**
  @description 服务于片元着色器的glsl
*/

precision mediump float;// 如果在RowShaderMaterial中需要进行精度声明
varying float vPositionY;// 接收外部暴露的vPosition变量
varying vec2 vUv;

uniform sampler2D uTexture;// 引入全局贴图


void main() {
    // 在完成片元绘制后，每个面上会出现渐变效果
    //    gl_FragColor = vec4(1,0,0, .5*vPositionY);// 得到当前绘制顶点的坐标信息，并进行三原色装配

    /**
      @description texture2D() 为一个贴图转换函数，其接收两个变量，第一个为贴图原型，第二个为当前取色向量(x,y)，
                    最终会得到该点位的颜色，然后进行对应赋值后即可将贴图呈现到页面上
    */
    vec4 textureColor = texture2D(uTexture, vUv);
    gl_FragColor = textureColor;
}


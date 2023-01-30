attribute vec3 position;// 声明从被装饰几何体中获得属性
attribute vec2 uv;// 当前顶点的二维向量
//// 全局矩阵变量
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
// 定义暴露的对象
varying vec2 vUv;
/**
  @description 变量理解
  @understand
            1.  只有顶点着色器使用的glsl文件可以获得当前装饰几何体的坐标等信息（如果使用的是普通着色器材质则不需要声明）.
                （如果使用的是未加工的着色器材质则则还需要引入）
            2.  atttribute 用于获取装饰几何体的具体信息，如position
                uniform 用于获取当前全局环境的所有信息，如矩阵信息
                varying 用于向其他着色器暴露一个当前几何体的信息(其他着色器使用varying 和对应变量名接收)
                precision ( highp(高精度) , mediump(中等精度) , lowp(低精度) ) float; 至于文件首行时，表示当前glsl编写浮点数时的精度
            3, position 为当前真实几何体的关联属性必须使用否则无法绘制出顶点图形， vec4的第四个参数表示当前绘制的几何体大小，0.1-n 数值越大绘制的图形越小
            4. 全局变量在初始化时不能赋初值，只能在main内进行赋值
            5. 在glsl服务于 ShaderMaterial时不能进行全局变量的声明(和精度声明)，只能使用varying 暴露属性，而服务于 RawShaderMaterial则需要
            6. 几何体通过Mesh撞边真实实体时，每个顶点都由顶点着色器绘制完成(注意设置充足的顶点个数，因为其只能渲染顶点的位置，如果顶点不充足则无法达到预期)
 @compare RawShaderMaterial vs ShaderMaterial  ,前者限制更加严格，数字必须是浮点数，变量在使用时需要全局声明，而后缀相当较少
            7. cpu无时无刻都在渲染每个点位，我们通过赋予一个随机的时间值就可以观察出这一点(通过sin函数以达到想要效果)
*/

/**
  @description 顶点着色器获得得相关变量
  @param  position 拿到当前几何体绘制得 x,y,z轴
  @param  uv 拿到当前几何体绘制得 x,y轴
*/
void main() {
    // 得到几何体得模型
    vec4 model = modelMatrix* vec4(position, .3);
    vUv = uv;// 得到当前二维向量点
    //    model.z+=1.0;
    // 通过该模型得 x,y,z来改变各顶点得展示位置
//    model.x-= .5;
    //    model.z+= sin(model.y);
    gl_Position = projectionMatrix*viewMatrix*model;
}
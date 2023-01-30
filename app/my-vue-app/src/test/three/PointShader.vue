<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
  Color,
  RawShaderMaterial,
  AxesHelper,
  MeshStandardMaterial,
  BufferGeometry,
  AmbientLight,
  DirectionalLight,
  DoubleSide,
  Vector3,
    Points,
  ShaderMaterial,
  TextureLoader, BufferAttribute
} from 'three'
import {World, Body, Sphere, Material, Vec3, Plane, ContactMaterial, Box} from 'cannon-es'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import SphereGeometry = ParametricGeometries.SphereGeometry;
import PlaneGeometry = ParametricGeometries.PlaneGeometry;
import basic_vertex from './shader/point/vertex.glsl'
import basic_fragColor from './shader/point/fragColor.glsl'
import TextureShader from './assets/ca.jpeg'

/**
 @description: 弄清楚three相机单位距离 和 html 视口距离的转换 ，才能完成共同展示
 @tip: 使用类的方式将每个模块进行代码块的分解方便做笔记和学习
 */

class ViewScene {
  public camera: PerspectiveCamera
  public scene: Scene
  public renderer: WebGLRenderer
  public clock: Clock

  public orbitControls: OrbitControls | undefined
  public lightEntity: Mesh | undefined
  public isUseController: boolean = false
  public isUseAxesHelper: boolean = false
  public shaderMaterial: ShaderMaterial | undefined

  constructor() {
    this.clock = new Clock();
    this.camera = new PerspectiveCamera(75, innerWidth / innerHeight);
    this.camera.position.x = 5
    this.camera.position.y = 5
    this.camera.position.z = 20
    this.scene = new Scene();

    this.scene.background = '#ace'

    this.renderer = new WebGLRenderer({
      // 渲染器背景透明，此属性通常在 h5+three.js 项目中开启，使html标签和three图像一起显示，并完成时间正常触发
      alpha: true
    });
    this.scene.add(this.camera)
    this.renderer.setSize(innerWidth, innerHeight)
  }

  public useController(): void {
    this.isUseController = true
    this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  public useAxesHelper(): void {
    this.isUseAxesHelper = true
    const axesHelper = new AxesHelper(5);

    this.scene.add(axesHelper)
  }


  /**
   @description 使用着色器定制 （点）材质装饰样式
   @merit 使装饰样式更加定制化
   @understand
   1.着色器也是材质装饰的一种，但其使用（GLSL语言）着色器语言编写，对比传统材质装饰更加具有样式定制化特点
   2. 着色器语言 gl_Xxx 表示装饰样式最终呈现的状态(如 gl_FragColor 表示该装饰样式最终的像素颜色,其中position表示拿到当前被装饰几何体的位置信息)
   @expand 着色器语言和c语言语法类似，如void main() 为入口方法，会被底层调用 ,且语言约束也和c语言相同，表达式结尾需要使用;
   */
  public useShader(): void {


    const pointGeometry = new BufferGeometry();
    const coordinate = new Float32Array([0,1,1]);
    // coordinate[0] = 1;
    // coordinate[1] = 0;
    // coordinate[2] = 1;
    pointGeometry.setAttribute('position', new BufferAttribute(coordinate, 3))
    /**
     @description 创建着色器材质装饰
     @tips 1.着色器材质即可以装饰真实几何体和点元素
           2. 真实几何实体通过Mesh构建，真实点实体通过Points构建
     */
    this.shaderMaterial = new ShaderMaterial({
      // 顶点着色器，用于绘制顶点位置 ,需要传入一个 四维向量 vec(param,param,param,param) 表示 x,y,z,a(透明度)
      // vec4(position,1) position表示被装饰几何体的原本位置，底层会结构为3哥参数，然后 gl_Position表示重新绘制位置
      // 使用此表达式即可渲染每个视口的3d真实几何体 projectionMatrix*viewMatrix*modelMatrix*vec4(position,1)
      vertexShader: basic_vertex,
      // 片元着色器，用于设置每个像素点的颜色 ,需要传入一个 四维向量 vec(param,param,param,param) 表示 r,g,b,a(透明度)

      fragmentShader: basic_fragColor,
      side: DoubleSide,
      // 可以通过uniforms配置项，向着色器内部传入全局共享属性，以此达到丰富图形展示目的
      uniforms: {
        uTime: {
          value: 0
        }
      }
    })

    // const boxRealGeometry = new PlaneGeometry(1, 1, 5, 5)
    const boxRealEntity = new Points(pointGeometry, this.shaderMaterial)
    boxRealEntity.rotateZ(1.55)
    boxRealEntity.rotateX(4.7)
    boxRealEntity.rotateY(1.55)
    this.scene.add(boxRealEntity)
  }


  public render(): void {
    let time = this.clock.getElapsedTime();

    // 将time当作全局属性传入到 着色器语言中
    this.shaderMaterial.uniforms.uTime.value = time
    this.renderer.render(this.scene, this.camera)

    // 是否环绕控制器
    if (this.isUseController && this.orbitControls instanceof OrbitControls) {
      this.orbitControls.update() // 滑动过渡必须调用的方法
      this.orbitControls.enableDamping = true // 滑动过渡
    }


    // requestAnimationFrame(this.render.bind(this)) // 底层调用了该函数，因此this指向改变了此时需要使用bind重定义this指向
    requestAnimationFrame(() => this.render()) // 两种写法达成的效果一致
  }
}


const canvas = ref<HTMLDivElement>(); // 创建了一个ref，将div标签存储到canvas中
onMounted(() => {
  const viewScene = new ViewScene();
  viewScene.useController()
  viewScene.useAxesHelper()
  viewScene.useShader()
  viewScene.render()

  canvas.value?.appendChild(viewScene.renderer.domElement)
  window.addEventListener('resize', () => {
    viewScene.camera.aspect = window.innerWidth / window.innerHeight // 更新camera的视口
    viewScene.camera.updateProjectionMatrix() // 更新摄像机投影矩阵
    viewScene.renderer.setSize(window.innerWidth, innerHeight) // 更新渲染器渲染尺寸
    viewScene.renderer.setPixelRatio(window.devicePixelRatio) // 设置像素比为当前设备的像素比
  })


})
</script>

<template>
  <div id="canvas" ref="canvas"></div>
</template>


<style lang="scss">
</style>

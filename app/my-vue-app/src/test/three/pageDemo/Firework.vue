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
  ShaderMaterial,
  sRGBEncoding,
  Points,
  ACESFilmicToneMapping,
  TextureLoader, EquirectangularReflectionMapping, BufferAttribute, CineonToneMapping
} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import PlaneGeometry = ParametricGeometries.PlaneGeometry;
import basic_vertex from '../shader/firework/vertex.glsl'
import basic_fragColor from '../shader/firework/fragColor.glsl'

// 用于加载 dhr文件
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
// 用于记载 gltf 模型文件
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

import {GUI} from 'dat.gui'

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
    this.camera.position.x = 50
    this.camera.position.y = 50
    this.camera.position.z = 50
    this.scene = new Scene();


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
    // this.orbitControls.autoRotate = true; // 开启自动旋转
    // // this.orbitControls .autoRotateSpeed = 0.5; // 设置旋转速度
    // this.orbitControls.maxPolarAngle = (Math.PI / 3) * 2; // 设置最大旋转角度
    // this.orbitControls.minPolarAngle = (Math.PI / 3) * 2; // 设置最小旋转角度
    // 设置自动移动相机，速度和角度
  }

  public useAxesHelper(): void {
    this.isUseAxesHelper = true
    const axesHelper = new AxesHelper(5);

    this.scene.add(axesHelper)
  }


  /**
   @description 使用着色器定制 材质装饰样式
   @merit 使装饰样式更加定制化
   @understand
   1.着色器也是材质装饰的一种，但其使用（GLSL语言）着色器语言编写，对比传统材质装饰更加具有样式定制化特点
   2. 着色器语言 gl_Xxx 表示装饰样式最终呈现的状态(如 gl_FragColor 表示该装饰样式最终的像素颜色,其中position表示拿到当前被装饰几何体的位置信息)
   @expand 着色器语言和c语言语法类似，如void main() 为入口方法，会被底层调用 ,且语言约束也和c语言相同，表达式结尾需要使用;
   */
  public useShader(): void {
    /**
     @description 制作孔明灯效果
     @tip vite无法处理得文件可以放到public目录下(该目录不会呗编译为js),
     然后在引入到对应得方法中即可(不要使用import引入，因为此方法引入得东西默认当作js处理，而是直接在形参中引入)
     */

        // 加载纹理图片
    const rgbeLoader = new RGBELoader(); //  创建 hdr文件加载器
    rgbeLoader.load('/hdr/2k.hdr', (hdr) => {
      hdr.mapping = EquirectangularReflectionMapping
      this.scene.background = hdr // 设置场景背景
      this.scene.environment = hdr // 环境贴图
    })
    // 以柔和得方式渲染hdr图片
    this.renderer.outputEncoding = sRGBEncoding; // 设置编码
    this.renderer.toneMapping = CineonToneMapping; // 设置渲染效果

    /**
     @description 配置自适应变量
     */
    // const param = {
    //   uScope: 1.5
    // }
    //
    // const gui = new GUI();
    // gui.add(param, 'uScope', 0, 1, .1).onChange((val) => {
    //
    //   this.shaderMaterial.uniforms.uScope.value = val;
    //   console.log(param.uScope)
    // }).name('幅度')
    //
    /**
     @description 创建着色器材质装饰
     @tips 着色器语言
     */

    const param = {
      ascend: 3,
      size: 10
    }

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
        },
        uSpeed: {
          value: param.ascend
        },
        uSize: {
          value: param.size
        }
      }
    })

    const gltfLoader = new GLTFLoader(); // 得到gltf加载器
    // 加载glb模型文件，解析完后底层会调用第二个参数，并将结果值进行传入
    // gltfLoader.load('/model/flyLight.glb', (gltf) => {
    //   // gltf是一个解析该文件后得环境对象 ，属性 scene为解析后得模型
    //   console.log(gltf)
    //   gltf.scene.position.set(Math.random() * 100, Math.random() * 100, Math.random() * 100)
    //   //  gltf.scene.children[1] 为灯体实体
    //   gltf.scene.children[1].material = this.shaderMaterial // 设置灯体得材质样式
    //   this.scene.add(gltf.scene)
    //   for (let i = 0; i < 100; i++) {
    //     const group = gltf.scene.clone(true);// 深克隆，返回一个新得gltf实体
    //
    //     // 设置随机位置然后添加到场景中
    //     group.position.set(Math.random() * 500, Math.random() * 500, Math.random() * 500)
    //     this.scene.add(group)
    //   }
    // })


    // 创建顶点

    window.addEventListener('click', () => {
      this.clock.start()
      const time = this.clock.getElapsedTime();
      const pointGeometry = new BufferGeometry();
      // 设置当前光源最后渲染位置，为了达到效果需要和动画最终位置一致
      const coordinate = new Float32Array([0, 0, 0])
      const step = new Float32Array([Math.random(), Math.random() * 2 + 10, Math.random()])
      pointGeometry.setAttribute('position', new BufferAttribute(coordinate, 3))
      pointGeometry.setAttribute('aStep', new BufferAttribute(step, 3))
      const pointRealEntity = new Points(pointGeometry, this.shaderMaterial)
      // boxRealEntity.rotateZ(1.55)
      // boxRealEntity.rotateX(4.7)
      // boxRealEntity.rotateY(1.55)
      this.scene.add(pointRealEntity)
      this.shaderMaterial.uniforms.uTime.value = time
    })


  }


  public render(): void {
    let time = this.clock.getElapsedTime();

    // 将time当作全局属性传入到 着色器语言中
    // this.shaderMaterial.uniforms.uTime.value = time
    // console.log('@time',time)
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

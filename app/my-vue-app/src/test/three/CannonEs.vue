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
  AxesHelper, MeshStandardMaterial, BufferGeometry, AmbientLight, DirectionalLight, DoubleSide, Vector3
} from 'three'
import {World, Body, Sphere, Material, Vec3, Plane, ContactMaterial, Box} from 'cannon-es'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import SphereGeometry = ParametricGeometries.SphereGeometry;
import PlaneGeometry = ParametricGeometries.PlaneGeometry;


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
  public directionalLight: DirectionalLight | undefined
  public lightEntity: Mesh | undefined
  public isUseController: boolean = false
  public isUseAxesHelper: boolean = false
  public isUseLight: boolean = false
  public physicalWord: World | undefined
  public physicalEntities: Body[] | undefined
  public realEntities: Mesh[] | undefined

  constructor() {
    this.clock = new Clock();
    this.camera = new PerspectiveCamera(75, innerWidth / innerHeight);
    this.camera.position.x = 5
    this.camera.position.y = 5
    this.camera.position.z = 20
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
  }

  public useAxesHelper(): void {
    this.isUseAxesHelper = true
    const axesHelper = new AxesHelper(5);

    this.scene.add(axesHelper)
  }

  public addMesh(): void {
    const boxGeometry = new BoxGeometry(2, 2, 2);
    const commonProps = {side: DoubleSide};
    const meshs = []
    const realBox1 = new Mesh(boxGeometry, this.isUseLight ? new MeshStandardMaterial({color: '#223e01', ...commonProps})
        : new MeshBasicMaterial({color: '#223e01'}))
    const realBox2 = new Mesh(boxGeometry, this.isUseLight ? new MeshStandardMaterial({color: '#ace', ...commonProps})
        : new MeshBasicMaterial({color: '#ace'}))
    const realBox3 = new Mesh(boxGeometry, this.isUseLight ? new MeshStandardMaterial({color: '#00ffee', ...commonProps})
        : new MeshBasicMaterial({color: '#00ffee'}))
    meshs.push(realBox1)
    meshs.push(realBox2)
    meshs.push(realBox3)
    realBox1.position.y = 0
    realBox2.position.y = -15
    realBox3.position.y = -30

    if (this.isUseLight) {
      const planeGeometry = new PlaneGeometry(10, 10, 1, 1); // 创建 几何平面

      // 添加阴影
      meshs.forEach(geometry => {
        geometry.receiveShadow = true
        geometry.castShadow = true

        const plane = new Mesh(planeGeometry, new MeshStandardMaterial({color: '#66ae23', ...commonProps}))
        plane.position.set(-5, geometry.position.y - 5, -5)
        plane.receiveShadow = true
        plane.castShadow = true
        this.scene.add(plane)
      })
    }
    this.scene.add(realBox1)
    this.scene.add(realBox2)
    this.scene.add(realBox3)
  }

  public useLight(): void {
    this.isUseLight = true
    const ambientLight = new AmbientLight('#fff', .5);
    this.directionalLight = new DirectionalLight('#fff', .5);

    // 将光源和真实几何体设置在同一平面，并添加到真实几何体里，此时移动几何体即可顺势移动光源
    this.directionalLight.position.set(10, 10, 10)
    this.lightEntity = new Mesh(new SphereGeometry(1, 20, 20), new MeshBasicMaterial({color: '#ace'}))
    this.lightEntity.position.set(10, 10, 10)
    this.lightEntity.add(this.directionalLight)
    this.scene.add(ambientLight)
    this.scene.add(this.lightEntity)

    this.directionalLight.castShadow = true // 发出的光被照的物体出现阴影
    this.renderer.shadowMap.enabled = true // 允许渲染阴影
  }

  /**
   @description： 添加物理引擎
   @understand: 1. three.js绘制的真实实体只负责展示，没有物理效果，通过cannon-es创建的物理世界，
   绘制的物理实体拥有物理特性，在通过相同规格的three真实几何体关联展示即可
   2. cannon-es绘制的物理实体拥有物理效果但无法展示，three绘制的真实实体可以展示但没有物理效果，
   因此将两者进行关联即可完成效果，也就是说一个物理实体想要展示需对应一个真实实体
   3. three中 真实实体 使用Mesh类构建(添加到scene中)，cannon-es中 物理实体 使用Body构建(添加到world中)，需要展示得物理实体则关联对应得真实实体
   4. 真实实体通过获得物理实体当前位置来展示当前物理实体受重力1影响时的移动变化
   5. 每个物理实体初始状态不同，因此只有将其摆正后，真实实体获得其位置后才能达到准确效果(如在生成一个全屏斜面时，需要对其进行反转才能变为平面)
   @trap(可能出现得bug场景):
   1. 真实实体和物理实体都需加入到对应得载体中，在进行关联后，此时物理实体受物理影响就会呈现在真实实体上(物理实体受物理影响且动画存在但无法展示，需要借助真实实体渲染)
   2. 真实实体必须有一个最小显示单元(如new SphereGeometry(1, 20, 20))
   3. 当一个物理实体得质量为0时(new Body({mass:0})),该物体无论怎么碰撞都不会移动
   */
  public usePhysical(): void {
    this.physicalWord = new World();
    this.physicalWord.gravity.set(0, -9.8, 0) // 给物理世界设置重力
    this.physicalEntities = [] // 用于收集所有真实实体
    this.realEntities = [] // 用于收集所有真实实体


    const boxShape = new Box(new Vec3(1, 1, 1)) // 物理几何体
    const sphereMaterial = new Material() // 物理几何体材质样式


    // 创建一个物理实体(球)
    const boxPhysicalEntity = new Body({
      shape: boxShape, // 物理几何体
      position: new Vec3(0, 0, 0), // 设置物理实体的位置
      mass: 1, // 物理实体的质量
      material: sphereMaterial // 物理几何体材质样式
    })

    /**
     @description 给物理实体施加一个向量力 ,第一个参数为向哪个轴施加力(改变position)，第二个参数为向哪个轴施加旋转力(改变rotate)
     */
    boxPhysicalEntity.applyForce(new Vec3(200, 0, 0), new Vec3(0, 0, 10))

    /**
     @description new Audio('url') 可以创建一个Audio实例，可以操作其的属性和方法(最终会被映射为一个audio标签)
     @bug 由于浏览器限制可能在用户进行交互后，音频文件播放才能成功，否则浏览器不允许自动播放
     在 vue环境中，不能直传入本地静态路径，而是需要vue本地先使用 import 进行引入解析
     */
    const audio = new Audio('https://vod.ruotongmusic.com/sv/5cb8e09a-179cd1c7e43/5cb8e09a-179cd1c7e43.wav');


    /**
     @description 1.给球物理实体绑定碰撞事件监听 ，当每次碰撞一个物理时，此事件就会调用
     2.底层会传入一个事件对象，body表示本体，target表示碰撞到的目标 ，contact表示此次碰撞的相关信息
     @tip e.contact.getImpactVelocityAlongNormal() 可以获得当前碰撞的强度
     */
    boxPhysicalEntity.addEventListener('collide', (e) => {

      const upspring = e.contact.getImpactVelocityAlongNormal()
      if (upspring >= 5) {
        audio.currentTime = 0
        audio.volume = upspring % 10 / 20
        audio.play() // 触发音效
      }
    })

    /**
     @description 创建一个平面物理实体(此平面为一个铺满屏幕的斜面，需要进行倾斜反转才能达到完全平面)
     @tips 创建一个物理平面时，初始状态为一个全屏斜面，此时需要使用以下属性设置
     planePhysicalEntity.quaternion.setFromAxisAngle(new Vec3(1,0,0),-Math.PI/2) 才能将斜面倾斜为平面,在配合真实实体赋予位置进行显示
     */
    const planeMaterial = new Material()
    const planePhysicalEntity = new Body({
      shape: new Plane(), // 物理几何体
      position: new Vec3(0, -5, 0), // 设置物理实体的位置
      mass: 0, // 物理实体的质量,为0不受重力影响，即在指定点位上形成不可见得物理实体(产生物理效果，但不展示，需要关联对应得真实实体或此位置就存在一个真实实体)
      material: planeMaterial // 物理几何体材质样式
    })
    // 旋转该物理平面实体(否则创建得是一个倾斜面，使球无法落在物理平面上，使用一下公式创建得就为一个物理平面) 物理平面需要使用什么真实实体承载？
    planePhysicalEntity.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2)


    console.log('@plane', planePhysicalEntity)
    /**
     @description 设置两个物理实体的材质关联，即当小球碰到平面时，会产生的摩擦力，弹力等
     */
    const sphereAndPlaneDefaultMaterial = new ContactMaterial(sphereMaterial, planeMaterial, {
      // 当小球碰到平面时的摩擦力和弹力
      friction: .1, // 设置摩擦力
      restitution: .7, // 设置弹力
    })

    // 将材质关联添加到物理时间
    this.physicalWord.addContactMaterial(sphereAndPlaneDefaultMaterial)

    // 设置物理世界默认的材质(在物理实例没有设置material时使用其)
    this.physicalWord.defaultContactMaterial = sphereAndPlaneDefaultMaterial

    // 创建真实实体
    const boxRealEntity = new Mesh(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({color: '#ace'}))

    // 单独设置平面真实实体和平面物理实体的关联关系(时它们处在相同position中，不过物理平面铺满整个屏幕)
    const planeRealEntity = new Mesh(new PlaneGeometry(20, 20, 20, 20), new MeshBasicMaterial({
      color: '#ae11fe',
      side: DoubleSide
    }))
    planeRealEntity.position.set(-10, -5, -10)

    // 添加真实实体到数组
    this.realEntities.push(boxRealEntity)

    // 添加物理实体到数组
    this.physicalEntities.push(boxPhysicalEntity)

    // 添加物理实体到物理世界
    this.physicalWord.addBody(boxPhysicalEntity)
    this.physicalWord.addBody(planePhysicalEntity)

    // 添加真实实体到相机
    this.scene.add(boxRealEntity)
    this.scene.add(planeRealEntity)

    /**
     @description 绑定window点击事件，当点击时触发生成物理实体和真实实体
     */
    window.addEventListener('click', () => {
      this.generateEntityPhysicalEffect()
    })

    /**
     @description 再范围时间内生成物理实体和真实实体
     */
    // setInterval(() => {
    //   this.generateEntityPhysicalEffect()
    // }, Math.random() * 2000)
  }

  /**
   @description 创建一个物理实体和真实实体(用于显示物理效果)
   */
  public generateEntityPhysicalEffect() {
    const boxShape = new Box(new Vec3(1, 1, 1)) // 物理几何体
    const sphereMaterial = new Material() // 物理几何体材质样式

    const randomParam = Math.random() * 10 - 5

    // 创建一个物理实体(球)
    const boxPhysicalEntity = new Body({
      shape: boxShape, // 物理几何体
      position: new Vec3(randomParam, 5, randomParam), // 设置物理实体生成的位置
      mass: 1, // 物理实体的质量
      material: sphereMaterial // 物理几何体材质样式
    })

    /**
     @description new Audio('url') 可以创建一个Audio实例，可以操作其的属性和方法(最终会被映射为一个audio标签)
     @bug 由于浏览器限制可能在用户进行交互后，音频文件播放才能成功，否则浏览器不允许自动播放
     在 vue环境中，不能直传入本地静态路径，而是需要vue本地先使用 import 进行引入解析
     */
    const audio = new Audio('https://vod.ruotongmusic.com/sv/5cb8e09a-179cd1c7e43/5cb8e09a-179cd1c7e43.wav');


    /**
     @description 1.给球物理实体绑定碰撞事件监听 ，当每次碰撞一个物理时，此事件就会调用
     2.底层会传入一个事件对象，body表示本体，target表示碰撞到的目标 ，contact表示此次碰撞的相关信息
     @tip e.contact.getImpactVelocityAlongNormal() 可以获得当前碰撞的强度
     */
    boxPhysicalEntity.addEventListener('collide', (e) => {

      const upspring = e.contact.getImpactVelocityAlongNormal()
      if (upspring >= 5) {
        audio.currentTime = 0
        audio.volume = upspring % 10 / 20
        audio.play() // 触发音效
      }
    })
// 创建真实实体
    const boxRealEntity = new Mesh(
        new BoxGeometry(1, 1, 1),
        new MeshBasicMaterial({
          color: new Color(Math.random(), Math.random(), Math.random())
        }))
    boxRealEntity.position.set(randomParam, 5, randomParam)

    // 添加真实实体到数组
    this.realEntities?.push(boxRealEntity)

    // 添加物理实体到数组
    this.physicalEntities?.push(boxPhysicalEntity)

    // 添加物理实体到物理世界
    this.physicalWord?.addBody(boxPhysicalEntity)

    // 添加真实实体到相机
    this.scene?.add(boxRealEntity)
  }

  public render(): void {
    // const time = this.clock.getElapsedTime();
    const deltaTime = this.clock.getDelta()

    this.renderer.render(this.scene, this.camera)

    // 是否环绕控制器
    if (this.isUseController && this.orbitControls instanceof OrbitControls) {
      this.orbitControls.update() // 滑动过渡必须调用的方法
      this.orbitControls.enableDamping = true // 滑动过渡
    }

    // 环形围绕的光源
    if (this.isUseLight && this.lightEntity instanceof Mesh) {
      // this.directionalLight.position.set(time, time, time)
      // this.lightEntity.position.set(Math.sin(time) * 5, 20, Math.cos(time) * 5)

    }

    // 加入物理实体
    if (this.realEntities && this.physicalEntities && this.physicalWord) {
      for (let i = 0; i < this.realEntities.length; i++) {
        // 真实实体获得当前物理实体的位置进行复刻呈现物理实体(真实实体和物理实体都是独立的单元)
        this.realEntities[i].position.copy(this.physicalEntities[i].position)
        // 真实实体复刻物理实体的旋转角度
        this.realEntities[i].quaternion.copy(this.physicalEntities[i].quaternion)

      }
      this.physicalWord.step(1 / 120, deltaTime) // 以120帧开始物理受力(1/120为120帧，1/60为60帧)
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
  viewScene.useLight()
  // viewScene.addMesh()
  viewScene.usePhysical()
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

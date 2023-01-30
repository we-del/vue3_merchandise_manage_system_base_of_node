<script lang="ts" setup>
import {onMounted, ref, unref} from 'vue'
import {
  Scene,
  PerspectiveCamera,
  Mesh,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  AxesHelper,
  TextureLoader,
  CircleGeometry,
  RepeatWrapping,
  MirroredRepeatWrapping,
  LinearFilter,
  NearestFilter,
  DoubleSide,
  BufferAttribute,
  MeshStandardMaterial,
  AmbientLight,
  DirectionalLight,
  LoadingManager, CubeTexture, CubeTextureLoader, EquirectangularReflectionMapping, SpotLight
}
  from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import SphereGeometry = ParametricGeometries.SphereGeometry;
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import PlaneGeometry = ParametricGeometries.PlaneGeometry;
import {GUI} from 'dat.gui'

const gui = new GUI();
// 环境贴图素材

// 场景
const scene = new Scene();


// 相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.x = 1
camera.position.y = 1
camera.position.z = 1


// 材质
// const sphereGeometry = new SphereGeometry(1, 10, 10); // 创建几何圆
const sphereGeometry = new SphereGeometry(1, 800, 800); // 创建几何圆

const planeGeometry = new PlaneGeometry(10, 10, 1, 1); // 创建 几何平面
// 贴图
/**
 @description: 物质常用配置项
 @compare: MeshStandardMaterial 对比 MeshBasicMaterial 前者没有默认灯光，配置更加丰富，后者有默认灯光，配置相对贫瘠
 @understand:
 1. 材质配置项相当于一个装饰器，几何体相当于被装饰对象,mesh相当于一个组合器，将其渲染到场景上
 2. 配置项中，每一个贴图所在的属性位置即定义了该贴图的职责，如透明贴图为透明的，粗糙贴图在光影环境下是粗糙的
 3. 每一个map就设置了一个贴图，多个map设置的贴图重叠在一个几何平面上(每一个几何平面都重叠一组map贴图)，通过其贴图特性呈现不同效果
 */
const meshStandardMaterial = new MeshStandardMaterial({ // 创建物质
                                                        // 在完成以下配置后为最佳的环境贴图反射效果
  color: 'pink',
  side: DoubleSide
  // metalness: 1, // 金属为1则有足够的反光度
  // roughness: 0, // 粗糙度为0则有足够的亮度
});

// 网格
const sphereMesh = new Mesh(sphereGeometry, meshStandardMaterial);
const planeMesh = new Mesh(planeGeometry, meshStandardMaterial);
planeMesh.position.set(-5, -1, -5)
// 生成坐标轴
const axesHelper = new AxesHelper(5);

/**
 @description: 设置环境光和直线光源(由于MeshStandardMaterial没有光源因此需要添加，此外其的配置更丰富)
 @compare:  DirectionalLight vs  spotLight ,前者是直线光，后者为聚光灯
 */
const light = new AmbientLight(0xfffffff, .5) // 设置环境光源
// const directionalLight = new DirectionalLight(0xfffffff, .5) // 设置直线光
const spotLight = new SpotLight(0xfffffff, .5); // 设置聚光灯
spotLight.position.set(10, 5, 5) // 设置光源位置
spotLight.intensity = 2 // 光源亮度设置


//渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)

/**
 @title: 灯光阴影
 @description: 在设置了灯光阴影后，特定的物质就可以有光影落在特定的物质上
 @effect: 产生光影效果
 @expand:
 @config:
 renderer.shadowMap.enabled = true // 渲染器渲染阴影
 spotLight.castShadow = true // 光源射出的光落在物质上时(是否)允许出现阴影
 sphereMesh.castShadow = true // 当此几何图形被照射时(是否)出现阴影(只有阴影落在允许接收阴影的物体上时阴影才能显示)
 planeMesh.receiveShadow = true // 当前几何图形(是否)允许接收阴影
 // 理论上所有物体在被照射时都存在阴影且都可以接收阴影
 @understand:
 1. 当设置了以下属性后，特定的属性被照射时会出现阴影，且只有在允许接收阴影的几何图形上才能进行显示
 2. 以下配置 true 为开启阴影 false 为关闭阴影
 */
renderer.shadowMap.enabled = true // 渲染器(是否)开启阴影渲染
renderer.physicallyCorrectLights = true // 开启物理光源
/**
  @title: spotLight 常用属性和方法
  @description: spotLight 为聚光灯，通过对其角读和距离的设置达到聚光灯效果
  @effect: 可以使用target属性来到准某个几何目标
  @property:
        near 设置阴影相机的近距离,
        far 设置阴影相机的远距离,
        target 设置聚光灯对准的目标,
        angle 设置聚光灯的角度, 最大值 Math.PI / 2
        distance 设置聚光灯影响的距离 ，取值范围 0-10
        penumbra 设置聚光灯强度比 取消范围 0-1
        decay 沿着光照距离衰减 取值范围 0-5 , 此属性在设置(  renderer.physicallyCorrectLights = true // 开启物理光源  ) 生效
  @expand:
  @understand:
  
*/
spotLight.castShadow = true // 直线光源射出的光落在物质上时(是否)允许出现阴影
spotLight.shadow.radius = 20 // 设置阴影模糊度
spotLight.shadow.mapSize.set(2048, 2048) // 设置阴影分辨率，默认为512x512
spotLight.shadow.camera.near = 0.5
spotLight.shadow.camera.far = 500
spotLight.target = sphereMesh // 设置光源对准的目标
spotLight.angle = .125 // 设置聚光灯角度
spotLight.distance = 0 // 设置聚光灯的距离
spotLight.penumbra = 0 // 设置聚光灯的距离
spotLight.decay = 0 // 设置聚光灯的距离

/**
 @description: 使用gui控制光影
 */
gui.add(spotLight, 'distance', 0, 10, .2).name('距离')
gui.add(spotLight, 'penumbra', 0, 1, .2).name('penumbra')
gui.add(spotLight, 'decay', 0, 1, .2).name('decay')

sphereMesh.castShadow = true // 当此几何图形被照射时(是否)出现阴影
planeMesh.receiveShadow = true // 当前几何图形(是否)允许接收阴影
// 增加无数个场景成员 和 一个场景监视者(相机)
scene.add(light) // 将环境光源设置到场景中
scene.add(spotLight) // 将直线光设置到场景中
scene.add(planeMesh) // 将直线光设置到场景中
scene.add(sphereMesh)
scene.add(camera)
scene.add(axesHelper)


const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true

const render = () => {
  renderer.render(scene, camera)
  orbitControls.update()
  requestAnimationFrame(render)
}
const container = ref();
onMounted(() => {
  unref(container).appendChild(renderer.domElement)
  render();


  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight // 更新camera的视口
    camera.updateProjectionMatrix() // 更新摄像机投影矩阵
    renderer.setSize(window.innerWidth, window.innerHeight) // 更新渲染器渲染尺寸
    renderer.setPixelRatio(window.devicePixelRatio) // 设置像素比为当前设备的像素比
  })
})
</script>

<template>
  <div id="show" ref="container"></div>
</template>


<style scoped lang="scss">

</style>

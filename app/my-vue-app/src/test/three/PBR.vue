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
  LoadingManager
}
  from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// 素材
import textureDoor from './assets/door/color.jpg'
import textureAlpha from './assets/door/alpha.jpg'
import textureCover from './assets/door/ambientOcclusion.jpg'
import textureHeight from './assets/door/height.jpg'
import textureRoughness from './assets/door/roughness.jpg'
import textureMetalness from './assets/door/metalness.jpg'
import textureNormal from './assets/door/normal.jpg'


// 场景
const scene = new Scene();


// 相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.x = 1
camera.position.y = 1
camera.position.z = 1


// 材质

// 贴图
/**
 @title: load方法的形参
 @description: 每一个load方法都可以传入一个 图片地址，加载完成的回调，加载进度的回调，加载错误的回调，
 它们在对应Load加载时对应的时间点会被底层调用
 @expand: 可以将这些方法封装到一个加载管理器中，在传入对应的纹理背景加载器进行集中纹理图片加载的管理 ，
 此方法对比传统Load单个管理具有如下优势
 1、 对所有load加载的图片进行统一管理
 2. 环境形参更丰富具体，知道加载的图片的各个信息和总数，适合做额外扩展
 */

// 设置加载管理器，以进行事件统一管理
const loadingManager = new LoadingManager(
    () => { // 此回调为onLoad，调用时没有接收形参
      console.log('@onLoad')
    },
    (url, curNumber, total) => { // 此回调为onProgress，调用时接收形参接收一个 url(当前加载的url), curNumber(当前正在加载第几个图片), total(需要加载的图片个数)
      console.log('@onProgress', url, curNumber, total)
      console.log(`当前加载进度为${Math.floor(curNumber / total * 100)}%`)
    },
    (url) => { // 此回调为onError，调用时接收形参接收一个url
      console.log('@onError', url)
    })

const textureLoader = new TextureLoader(loadingManager); // 纹理背景加载器 ，使用了加载管理器对所有加载图片进行监听
// 单个load加载事件管理
const texture = textureLoader.load(textureDoor, (e) => {
  console.log('@onLoad', e) // e 为加载的纹理图片对象
}, (e) => {
  console.log('@onProgress', e)
}, (e) => {
  console.log('@onError', e)
}); // 加载纹理图标，，当作背景贴图
const bgTexture = textureLoader.load(textureAlpha) // 引入一个纹理图片，当作透明贴图
const coverTexture = textureLoader.load(textureCover) // 引入一个纹理图片，当作环境遮挡贴图
const exchangeTexture = textureLoader.load(textureHeight) // 引入一个纹理图片，当作置换贴图
const roughnessTexture = textureLoader.load(textureRoughness) // 引入一个纹理图片，当作粗糙贴图
const metalnessTexture = textureLoader.load(textureMetalness) // 引入一个纹理图片，当作粗糙贴图
const normalTexture = textureLoader.load(textureNormal) // 引入一个纹理图片，当作粗糙贴图
/**
 @description: 纹理常用属性和方法
 @methods: offset  用于设置图片显示的范围，常用其下的 x y 属性进行修改，或者set方法进行统一修改
 @methods: center  用于设置图的旋转中心点，常用其下的 x y 属性进行修改，或者set方法进行统一修改
 @property: rotation  用于设置当前图标的旋转度数 PI / 4 为90°
 @property: wrapS  用于设置纹理图片的重复方式
 @property: magFilter  用于设置纹理图片的显示策略
 @property: minFilter  用于设置纹理图片的显示策略
 @tips: 引入的纹理贴图图片必须以 texture单词开头？ 不以该单词开头则报错拉
 */
// texture.offset.set(0.5,0.5) // 设置纹理图片显示的起始点位
// texture.center.set(0.1, 0.1) // 设置纹理图片旋转原点(默认为左下角)。.5 .5为中心旋转
// texture.rotation = Math.PI / 4 // 旋转纹理图片
// texture.wrapS = RepeatWrapping; // 在有限的范围中无线重复纹理图片
texture.wrapS = MirroredRepeatWrapping; // 在有限的范围中水平镜像重复纹理图片

texture.magFilter = LinearFilter; // LinearFilter(默认值) 线性过渡的方式进行图片展示
texture.minFilter = LinearFilter; // LinearFilter(默认值) 线性过渡的方式进行图片展示
// texture.magFilter = NearestFilter; // NearestFilter 使用最接近图片元素方式进行展示
// texture.minFilter = NearestFilter; // NearestFilter 使用最接近图片元素方式进行展示


const boxGeometry = new BoxGeometry(1, 1, 1, 100, 100, 100); // 创建box
const circleGeometry = new CircleGeometry(3, 3, 3);

/**
 @description: 物质常用配置项
 @compare: MeshStandardMaterial 对比 MeshBasicMaterial 前者没有默认灯光，配置更加丰富，后者有默认灯光，配置相对贫瘠
 @understand:
 1. 材质配置项相当于一个装饰器，几何体相当于被装饰对象,mesh相当于一个组合器，将其渲染到场景上
 2. 配置项中，每一个贴图所在的属性位置即定义了该贴图的职责，如透明贴图为透明的，粗糙贴图在光影环境下是粗糙的
 3. 每一个map就设置了一个贴图，多个map设置的贴图重叠在一个几何平面上(每一个几何平面都重叠一组map贴图)，通过其贴图特性呈现不同效果
 */
const meshStandardMaterial = new MeshStandardMaterial({ // 创建物质
  color: '#aaeeff', // 设置物质颜色
  map: texture, // 将纹理图片映射到几何体的每一个面上
  alphaMap: bgTexture, // 增加透明纹理贴图，此时被赋予的位置是透明的
  transparent: true, // 允许透明,同时透明纹理贴图生效
  aoMap: coverTexture, // 增加环境遮挡贴图，需要额外配置一组uv，其会与map配置项映射的贴图重合
  displacementMap: exchangeTexture, // 添加置换贴图,添加此贴图在设置对应几何图形的精密程度后可以出现高低视觉差
  displacementScale: .2,
  roughness: 1, // 设置几何体粗糙度
  roughnessMap: roughnessTexture, // 粗糙贴图，此贴图在被光源照射时，呈现出突变的粗糙度
  metalness: 1, // 设置金属程度，取值0-1，如果为1说明是金属
  metalnessMap: metalnessTexture, // 粗糙贴图，此贴图在被光源照射时，呈现出突变的粗糙度
  normalMap: normalTexture, // 法线贴图，此贴图在被光源照射时，呈现出光照折痕效果
  // opacity: .5, // 设置透明度
  // side: DoubleSide // 渲染多面，默认渲染一面(即视口正对面 FrontSize)
});

// 给该盒子添加额外的uv2属性，以适配环境遮挡贴图(那个三维图形需要透明纹理则设置以下属性)
boxGeometry.setAttribute('uv2', new BufferAttribute(boxGeometry.attributes.uv.array, 2))

// 网格
const boxMesh = new Mesh(boxGeometry, meshStandardMaterial);
// const circleMesh = new Mesh(circleGeometry, meshStandardMaterial);
// circleMesh.position.x = 1
// circleMesh.position.y = 1
// circleMesh.position.z = 1

// 生成坐标轴
const axesHelper = new AxesHelper();

/**
 @description: 设置环境光和直线光源(由于MeshStandardMaterial没有光源因此需要添加，此外其的配置更丰富)
 */
const light = new AmbientLight(0xfffffff, .5) // 设置环境光源
const linearLight = new DirectionalLight(0xfffffff, .5) // 设置直线光
linearLight.position.set(10, 5, 5) // 设置光源位置
scene.add(light) // 将环境光源设置到场景中
scene.add(linearLight) // 将直线光设置到场景中


scene.add(boxMesh)
// scene.add(circleMesh)
scene.add(camera)
scene.add(axesHelper)


//渲染器
const webGLRenderer = new WebGLRenderer();
webGLRenderer.setSize(window.innerWidth, window.innerHeight)

const orbitControls = new OrbitControls(camera, webGLRenderer.domElement);
orbitControls.enableDamping = true

const render = () => {
  webGLRenderer.render(scene, camera)
  orbitControls.update()
  requestAnimationFrame(render)
}
const container = ref();
onMounted(() => {
  unref(container).appendChild(webGLRenderer.domElement)
  render();


  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight // 更新camera的视口
    camera.updateProjectionMatrix() // 更新摄像机投影矩阵
    webGLRenderer.setSize(window.innerWidth, window.innerHeight) // 更新渲染器渲染尺寸
    webGLRenderer.setPixelRatio(window.devicePixelRatio) // 设置像素比为当前设备的像素比
  })
})
</script>

<template>
  <div id="show" ref="container"></div>
</template>


<style scoped lang="scss">

</style>

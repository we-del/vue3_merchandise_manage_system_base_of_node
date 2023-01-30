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
  LoadingManager, CubeTexture, CubeTextureLoader, EquirectangularReflectionMapping
}
  from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import SphereGeometry = ParametricGeometries.SphereGeometry;
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";


// 环境贴图素材
import px from './assets/environmentMaps/1/px.jpg'
import nx from './assets/environmentMaps/1/nx.jpg'
import py from './assets/environmentMaps/1/py.jpg'
import ny from './assets/environmentMaps/1/ny.jpg'
import pz from './assets/environmentMaps/1/pz.jpg'
import nz from './assets/environmentMaps/1/nz.jpg'
// import hdr_c from './assets/hdr/012.jpg'

// 场景
const scene = new Scene();


// 相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.x = 1
camera.position.y = 1
camera.position.z = 1


// 材质
const sphereGeometry = new SphereGeometry(1, 400, 400);


/**
 @title: DHR图片载入
 @description: dhr时拥有高环境渲染比的一个图片，根据不同的环境渲染不同的亮度
 */
const rgbeLoader = new RGBELoader();
// rgbeLoader.load(hdr_c,(texture,b) => {
//   console.log('@texture',texture,b)
//   texture.mapping = EquirectangularReflectionMapping
//   scene.background = texture
//   scene.environment = texture
// })
// rgbeLoader.load
rgbeLoader.loadAsync('/012.hdr').then(texture => {
  console.log('@texture', texture)
  texture.mapping = EquirectangularReflectionMapping
  scene.background = texture
})

// 贴图

/**
 @title: cube纹理加载器使用
 @description:  cube纹理加载器可以一次加载6张(面)图片，来达到全景效果
 @compare: cube纹理加载器 对比 纹理加载器
 cube纹理加载会将引入的图片通过material配置即昂每个贴图附着在几何图形的周围，(如6个贴图每个几何面上都层叠1张，并赋予样式)
 而普通纹理加载器添加的图片通过material配置后会将所有贴图覆在每个几何面上进行展示(如6个贴图每个几何面上都层叠贴6张，并赋予样式)
 */
const cubeTextureLoader = new CubeTextureLoader(); // 引入cube贴图加载器
const cubeTexture = cubeTextureLoader.load([ // 设置6面贴图，将作为环境贴图使用
  px, nx, py, ny, pz, nz
]);
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
  metalness: 1, // 金属为1则有足够的反光度
  roughness: 0, // 粗糙度为0则有足够的亮度
  envMap: cubeTexture // 将6面贴图当作环境贴图使用，此时该装饰几何体在切换视角时，显示不同的环境角度
});

// 网格
const boxMesh = new Mesh(sphereGeometry, meshStandardMaterial);

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
scene.background = cubeTexture // 将环境贴图设置为场景背景
scene.environment = cubeTexture // 将环境贴图设置为场景环境，以达到最佳效果

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

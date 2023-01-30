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
  LinearFilter, NearestFilter, DoubleSide, BufferAttribute
}
  from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import TextureImg from '@/assets/texture.png'
import TextureCover from '@/assets/cover.png'
import TextureBg from '@/assets/logo.png'

// 场景
const scene = new Scene();


// 相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.x = 1
camera.position.y = 1
camera.position.z = 1


// 材质
const textureLoader = new TextureLoader(); // 纹理背景加载器
const texture = textureLoader.load(TextureImg); // 加载纹理图标，，当作背景贴图
const bgTexture = textureLoader.load(TextureBg) // 引入一个纹理图片，当作透明贴图
const coverTexture = textureLoader.load(TextureCover) // 引入一个纹理图片，当作环境遮挡贴图
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
texture.center.set(0.1, 0.1) // 设置纹理图片旋转原点(默认为左下角)。.5 .5为中心旋转
texture.rotation = Math.PI / 4 // 旋转纹理图片
// texture.wrapS = RepeatWrapping; // 在有限的范围中无线重复纹理图片
texture.wrapS = MirroredRepeatWrapping; // 在有限的范围中水平镜像重复纹理图片

texture.magFilter = LinearFilter; // LinearFilter(默认值) 线性过渡的方式进行图片展示
texture.minFilter = LinearFilter; // LinearFilter(默认值) 线性过渡的方式进行图片展示
// texture.magFilter = NearestFilter; // NearestFilter 使用最接近图片元素方式进行展示
// texture.minFilter = NearestFilter; // NearestFilter 使用最接近图片元素方式进行展示


const boxGeometry = new BoxGeometry(1, 1, 1); // 创建box
const circleGeometry = new CircleGeometry(3, 3, 3);

/**
  @description: 物质常用配置项
*/
const meshBasicMaterial = new MeshBasicMaterial({ // 创建物质
  color: '#aaeeff', // 设置物质颜色
  map: texture, // 将纹理图片映射到物质中
  alphaMap: bgTexture , // 增加透明纹理
  aoMap: coverTexture, // 增加环境遮挡贴图，需要额外配置一组uv
  transparent: true, // 允许透明
  opacity: .9, // 设置透明度
  side: DoubleSide // 渲染多面，默认渲染一面(即视口正对面 FrontSize)
});

// 给该盒子添加额外的uv2属性，以适配环境遮挡贴图(那个三维图形需要透明纹理则设置以下属性)
boxGeometry.setAttribute('uv2', new BufferAttribute(boxGeometry.attributes.uv.array, 2))

console.log('@texture', texture)
// 网格
const boxMesh = new Mesh(boxGeometry, meshBasicMaterial);
const circleMesh = new Mesh(circleGeometry, meshBasicMaterial);
circleMesh.position.x = 1
circleMesh.position.y = 1
circleMesh.position.z = 1
const axesHelper = new AxesHelper();
scene.add(boxMesh)
scene.add(circleMesh)
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
    console.log('@innerWidth', innerWidth)
    console.log('@innerHeight', innerHeight)
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

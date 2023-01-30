<script lang="ts" setup>
import {onMounted, ref, unref} from 'vue'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
    Clock,
  PointsMaterial, Points, TextureLoader, AdditiveBlending, BufferGeometry, BufferAttribute
}
  from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import SphereGeometry = ParametricGeometries.SphereGeometry;
import {GUI} from 'dat.gui'
import pointImg from './assets/particles/9.png'

const gui = new GUI();
// 环境贴图素材

// 场景
const scene = new Scene();


// 相机
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight);

camera.position.x = 1
camera.position.y = 1
camera.position.z = 1


// 引入贴图
const textureLoader = new TextureLoader();
const mapTexture = textureLoader.load(pointImg);

/**
 @title: 创建一个最基础的粒子效果
 @description:  创建了一个粒子球体
 @effect: 出现粒子效果的球体
 @understand:

 */
// const sphereGeometry = new SphereGeometry(1, 50, 50); // 创建几何圆

    

/**
  @title: 使用自定义几何创建星空效果
  @description: 根据Float32Array创建一个数组(想要多少个点位就创建多长的索引然后乘3（因为要代表xyz）)
  @expand:
  @understand:
  
*/    
const bufferGeometry = new BufferGeometry(); // 创建一个自定义的几何
const star = new Float32Array(200 * 3);   // 创建另一个600个索引的数组，表达式200个点位(x,y,z算一个点位)
const colors = new Float32Array(200 * 3); // 给每个点位匹配一个color

for (let i = 0; i < star.length; i++) {
  star[i] = Math.random() * 10 - 5  // 随机生成每个点位的xyz位置
  colors[i] = Math.random() //  随机生成每个点位的颜色(0-1,就表示0-255，3个表示一个颜色)
}

// 将数据传入，并设置对应属性（相当于设置key-val,val必须是一个BufferAttribute的实例）
bufferGeometry.setAttribute('position', new BufferAttribute(star, 3))
bufferGeometry.setAttribute('color', new BufferAttribute(colors, 3))
console.log('@bufferGeometry',bufferGeometry)
/**
 @description: pointsMaterial会对每个粒子接待你进行装饰
 @tips: 当map背景贴图和alphaMap透明贴图为同一张时，也可以达到效果
 */
const pointsMaterial = new PointsMaterial({
  // color: 'pink', // 设置颜色
  size: .3,  // 设置 粒子的大小  number 0 - 0.1 最佳
  sizeAttenuation: true, // 粒子尺寸衰减  true （粒子颜色较深）| false(例子颜色较浅)
  map: mapTexture, // 给粒子载入背景贴图
  alphaMap: mapTexture, // 载入透明贴图
  transparent: true, // 使用了此配置项透明贴图才能生效
  depthWrite: false, // 允许被遮挡的粒子显示
  vertexColors: true, // 使用顶点颜色(使用每个节点对应颜色，只有开启此熟悉颜色才会生效)
  // blending: AdditiveBlending // 改变遮挡时的显示策略

}); // 创建例子点阵装饰器

const pointsSphere = new Points(bufferGeometry, pointsMaterial); // 开始装饰，创建一个粒子效果的几何圆


// 网格
// 生成坐标轴
const axesHelper = new AxesHelper(5);


const container = ref();
//渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)

scene.add(pointsSphere)
scene.add(camera)
scene.add(axesHelper)


const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true // 滑动过渡

const clock = new Clock(); 

const render = () => {

  const time = clock.getElapsedTime();
  console.log('@time',time)
  if(time>5) clock.start()
  pointsSphere.position.y = time * .3;
  renderer.render(scene, camera)
  orbitControls.update() // 更新滑动过渡
  requestAnimationFrame(render)
}


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

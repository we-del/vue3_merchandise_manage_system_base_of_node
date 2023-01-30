<script lang="ts" setup>
/**
 @description: 此时无法正确的使用three.js在vue中
 */
import {ref, reactive, unref, onMounted} from "vue"
import * as THREE from "three"
import {gsap} from 'gsap'
import {GUI} from 'dat.gui'

// 引入轨道控制器
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const canvas = ref()
// 场景 相机 网格 材质 渲染

/**
 @objects: 场景(scene) 相机(camera) 网格(mesh)
 @description: 以上三个实例对象都有 position,scale,rotation,
 receiveShadow,quaternion,renderOrder,up,visible属性或方法
 @property position
     此属性可以移动对应实例对象，移动的参照物为当前坐标轴，有x,y,z三个选项
 @property scale
     此属性可以放大或缩小对应实例对象，缩小或方法的范围为当前实例物体，有x,y,z三个选项
 @property rotation
     此属性可以将对应实例对象按照当前坐标系进行旋转，有x,y,z三个选项，x延x轴旋转，y延y轴旋转,z延z轴旋转
 */


// 创建场景
const scene = new THREE.Scene()
/**
 @description:  创建相机, 可以通过设置其的position属性来改变其查看场景的视口范围
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight) // 设置初始高度和相机视口
camera.position.x = 5
camera.position.y = 5
camera.position.z = 5


// 创建材质
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMaterial = new THREE.MeshBasicMaterial({color: "pink"})


/**
 @description:  创建网格 , 可以通过设置其的position属性来改变其管理物质在坐标轴上的位置
 */
const mesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
/**
 @description:  添加视图的平面坐标器(轴，此轴永远为屏幕的中心点), 蓝色为z轴，绿色为y轴，红色为x轴
 */
const axesHelper = new THREE.AxesHelper();
// axesHelper.position.x=5
// axesHelper.position.y=5
// axesHelper.position.z=5
const clock = new THREE.Clock()
console.log(clock)
// 创建渲染器
// unref可以快速得到refImpl 对象的value属性 , 如果不是则不做处理
const renderer = new THREE.WebGLRenderer()
scene.add(camera) // 添加相机进行监听
scene.add(mesh) // 添加网进行展示
scene.add(axesHelper) // 添加坐标系

renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染尺寸
console.log('@camera', camera)
console.log('@mesh', mesh)


// gsap基本使用
const animate1 = gsap.to(mesh.position, {
  x: 5, // 控制mesh.position(第一个形参的x属性)的x值 ，底层会去看对象的属性值在第一个形参中是否存在？存在就操作其的值，否则操作底层的值
  duration: 5, // 一次动画持续时间
  ease: 'powerl.inOut', // 动画执行的方法
  // repeat: -1, // 是否重复执行 ， 如果为 -1表示重复执行
  // yoyo: true, // 是否来回重复执行动画(动画方法为 去回去回，如果为false则动画为去)
  delay: 1, // 动画延时时间
  onComplete: () => console.log('我要完成旋转了'), // 完成动画时调用(动画结束时)
  onStart: () => console.log('我要开始旋转了') // 开始动画时调用
})


/**
 @description: OrbitControls 的用法
 @utility: 将camara和 renderer.domElement 添加为轨道视口，其在移动页面时，会触发视角的变化
 @tips: 此轨道视口需要配合 requestAnimationFrame 内置js函数使用，因为其只能改变视口但无法重绘，而此方法可以每秒重绘60次

 */
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true // 设置阻尼(即视口滑动收尾延迟效果，使收尾时更具有真实性)，需要配合orbitControls的update方法使用


/**
 @description: gui负责渲染一个手动操作界面，
 @methods: add addColor  addFolder
 @invoke: add 当使用了add方法后即创建了一个可手动操作项,并返回了该实例，我们可以调用对应的方法来完成对应的操作,
 如调用name则为该项设置一个name(标题), 调用onChange(改变时触发)和onFinishChange(改变完成时触发)则挂载了一个事件,它们都接收一个参数表示当前处在的状态(值)
 @invoke: addColor 当使用了addColor方法后拿到配置项，并创建了一个可手动操作项(创建一个颜色操作面板可以手动改变颜色),返回了该实例，
 我们可以调用对应的方法来完成对应的操作,如调用name则为该项设置一个name(标题),调用onChange(改变时触发)和onFinishChange(改变完成时触发)则挂载了一个事件,它们都接收一个参数表示当前处在的状态(值)
 @invoke: addFolder 当使用了addFolder方法后会创建了一个实例(目录相当于目录),此时可以调用该实例的add,addColor,addFolder新增新的选项行
 我们可以调用对应的方法来完成对应的操作,如调用name则为该项设置一个name(标题),调用onChange(改变时触发)和onFinishChange(改变完成时触发)则挂载了一个事件,它们都接收一个参数表示当前处在的状态(值)
 @tips: 每创建一个 GUI实例就是一个gui控制器
 */
const gui = new GUI()
// 添加行，改变时物体沿着x轴滑动
gui.add(mesh.position, 'x', 0, 5, 0.2)
    .onChange((val: any) => console.log('x轴发生了改变' + val))
    .onFinishChange((val: any) => console.log('x轴变换完成了' + val)).name('x')

// 添加行，改变时物体沿着y轴滑动
gui.add(mesh.position, 'y', 0, 5, 0.2).name('y')

// 添加颜色选择器，配合change事件可以达到动态控制颜色目的
gui.addColor({color: '#ace'}, 'color').onChange((curColor: any) => cubeMaterial.color.set(curColor)).name('当前颜色')
// 创建了一个目录行，第一个形参为该目录名
const folder = gui.addFolder("我来使用文件夹")
// 向目录中添加了阿一个操作(当带年纪时触发)
folder.add({fn: () => console.log('我被使用了')},'fn').name('函数in folder')
// 向目录中添加了阿一个操作(为一个boolean值，底层会映射为一个复选框)
folder.add(mesh, 'visible').name('visible in folder')


function render(time: any) {
  renderer.render(scene, camera) // 渲染场景和相机
  orbitControls.update(); // 配合环绕控制器开启阻尼(滑动收尾过渡)


  /**
   @function: requestAnimationFrame
   @description:  js内置函数 其每次都会进行一次render函数调用，然后重启开启一个新的动画帧(1s调用当前屏幕分辨率的次数，如果屏幕为90hz则1s调用90次，如果为144hz则为144次)
   @compare: 对比定时器提高了渲染效率和重绘重排
   @params time requestAnimationFrame底层调用render时会传入一个形参，表示当前调用该函数的时间点
   @tips: 类似于1s会调用60次的递归(重新渲染画面)，无限延生，可以使用  cancelAnimationFrame 关闭调用
   */
  requestAnimationFrame(render)
}

console.log('@cubeGeometry',cubeGeometry)
onMounted(() => {
  render(null);
  // render.domElement最终会渲染一个canvas然后使用appendChild添加到虚拟dom中
  unref(canvas)?.appendChild(renderer.domElement)
  window.addEventListener('click', () => {
    animate1.pause(); // 暂停animate1的动画
  })
  window.addEventListener('dblclick', () => {
    animate1.resume(); // 继续animate1的动画
  })


  // 开启全屏 与 关闭
  window.addEventListener('dblclick', () => {
    console.log(document.fullscreenElement)
    const isFullScreen = document.fullscreenElement;
    if (!isFullScreen) {
      renderer.domElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  })


  // 自适应渲染图标
  window.addEventListener('resize', () => {
    /**
     @description: 每次浏览器的屏幕发生变化时，对应的相机视口和渲染尺寸也应该发生变化，以达到自适应效果
     */

    camera.aspect = window.innerWidth / window.innerHeight // 更新camera的视口
    camera.updateProjectionMatrix() // 更新摄像机投影矩阵
    renderer.setSize(window.innerWidth, window.innerHeight) // 更新渲染器渲染尺寸
    renderer.setPixelRatio(window.devicePixelRatio) // 设置像素比为当前设备的像素比
  })
})


</script>

<template>
  <div ref="canvas"></div>
</template>



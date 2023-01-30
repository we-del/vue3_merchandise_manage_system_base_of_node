<script lang="ts" setup>
import {onMounted, ref, unref} from 'vue'
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AxesHelper,
  Clock,
  PointsMaterial,
  Points,
  TextureLoader,
  AdditiveBlending,
  BufferGeometry,
  BufferAttribute,
  BoxGeometry,
  MeshBasicMaterial, Mesh, Raycaster, Vector2
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

const boxGeometry = new BoxGeometry(1,1,1);
const materialWhite = new MeshBasicMaterial({wireframe:true});
const materialRed = new MeshBasicMaterial({color:'pink'});

// 用于收集所有生成的真实几何体
const cubeArr = []
for (let i = -5; i <=5; i++) {
  for (let j = -5; j <5; j++) {
    for (let k = -5; k < 5; k++) {
      const mesh = new Mesh(boxGeometry,materialWhite);
      mesh.position.set(i,j,k)
      scene.add(mesh)
      cubeArr.push(mesh)
    }
  }
}


/**
  @title: 创建投射光线对象
  @description: 用于监视当前移动到的几何体位置
  @methods: intersectObjects() 对多个真实几何体进行光线投射
  @effect: 可以发出光线并收集受影响的真实几何体
  @expand:
  @understand:

*/
const raycaster = new Raycaster();

/**
  @description: 收集二维信息位置，此练习用于收集当前排屏幕位于哪一个几何体
*/
const vector2 = new Vector2();
console.log('@vector',vector2)

// 生成坐标轴
const axesHelper = new AxesHelper(5);


const container = ref();
//渲染器
const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)

scene.add(camera)
scene.add(axesHelper)


const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true // 滑动过渡

const clock = new Clock();

const render = () => {

  const time = clock.getElapsedTime();
  // console.log('@time',time)
  if(time>5) clock.start()
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

  /**
    @description: 用于监听当前鼠标位置，记录位于的真实几何体位置
  */
  window.addEventListener('mousemove',(e)=>{
    // 得到触摸的坐标位置的几何体数值
    vector2.x = (e.clientX/innerWidth)* 2-1
    vector2.y = -((e.clientY/innerHeight)* 2-1)
    raycaster.setFromCamera(vector2,camera) // 对鼠标坐标和相机位置进行投射光线

    // 对当前鼠标位置的真实几何体进行光线穿透，该方法返回该穿透光线影响的真实几何体个数
    const effectCubes = raycaster.intersectObjects(cubeArr); // 得到当前光线影响的真实几何体（数组）
    effectCubes.forEach((cube)=> cube.object.material = materialRed) // 对当前射线影响的几何体进行控制(修改了它们的材质)
  });
})
</script>

<template>
  <div id="show" ref="container"></div>
</template>


<style scoped lang="scss">

</style>

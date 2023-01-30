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
  AxesHelper, MeshStandardMaterial, BufferGeometry
} from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {ParametricGeometries} from "three/examples/jsm/geometries/ParametricGeometries";
import SphereGeometry = ParametricGeometries.SphereGeometry;


/**
 @description: 弄清楚three相机单位距离 和 html 视口距离的转换 ，才能完成共同展示
 */

class ViewScene {
  public camera: PerspectiveCamera
  public scene: Scene
  public renderer: WebGLRenderer
  public clock: Clock

  constructor() {
    this.clock = new Clock();
    this.camera = new PerspectiveCamera(75, innerWidth / innerHeight);
    this.camera.position.x = 1
    this.camera.position.y = 1
    this.camera.position.z = 10
    this.scene = new Scene();

    const realBox1 = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial({color: '#223e01'}))
    const realBox2 = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial({color: '#ace'}))
    const realBox3 = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial({color: '#00ffee'}))
    realBox1.position.y = 0
    realBox2.position.y = -15
    realBox3.position.y = -30
    this.scene.add(realBox1)
    this.scene.add(realBox2)
    this.scene.add(realBox3)
    this.renderer = new WebGLRenderer({
      // 渲染器背景透明，此属性通常在 h5+three.js 项目中开启，使html标签和three图像一起显示，并完成时间正常触发
      alpha: true
    });

    this.scene.add(this.camera)
    this.renderer.setSize(innerWidth, innerHeight)


  }

  add(geometry: BufferGeometry, material: MeshStandardMaterial) {
    // 将几何体和材质进行组合生成真实几何体
    this.scene.add(new Mesh(geometry, material))
  }

  render() {
    // this.renderer.setSize(window.innerWidth, crollY) // 更新渲染器渲染尺寸
    const time = this.clock.getElapsedTime();


    this.renderer.render(this.scene, this.camera)
    this.camera.position.y = -(scrollY / 60)
    // orbitControls.update()
    requestAnimationFrame(this.render.bind(this)) // 底层调用了该函数，因此this指向改变了此时需要使用bind重定义this指向
  }
}


const canvas = ref<HTMLDivElement>(); // 创建了一个ref，将div标签存储到canvas中
onMounted(() => {
  const viewScene = new ViewScene();
  console.log(new BoxGeometry(1, 1, 1), new SphereGeometry(1, 1, 1))
  console.log(new MeshBasicMaterial(), new MeshStandardMaterial())
  viewScene.render()
  canvas.value?.appendChild(viewScene.renderer.domElement)
  window.addEventListener('resize', () => {
    viewScene.camera.aspect = window.innerWidth / window.innerHeight // 更新camera的视口
    viewScene.camera.updateProjectionMatrix() // 更新摄像机投影矩阵
    viewScene.renderer.setSize(window.innerWidth, scrollY) // 更新渲染器渲染尺寸
    viewScene.renderer.setPixelRatio(window.devicePixelRatio) // 设置像素比为当前设备的像素比
  })
})
</script>

<template>
  <div id="canvas" ref="canvas"></div>
  <div class="page page0">
    <h1>Ray投射光线</h1>
    <h3>THREE.Raycaster实现3d交互效果</h3>
  </div>
  <div class="page page1">
    <h1>THREE.BufferGeometry！</h1>
    <h3>应用打造酷炫的三角形</h3>
  </div>
  <div class="page page2">
    <h1>活泼点光源</h1>
    <h3>点光源围绕照亮小球</h3>
  </div>
</template>


<style lang="scss">
#canvas {
  position: fixed;
  top: 0;
  left: 0;
}

body {
  background-color: #193334;
}

.page {
  height: 100vh;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;

}

.page > h1 {
  font-size: 34px;
}

body, html {
  background-color: #19343b;
}
</style>

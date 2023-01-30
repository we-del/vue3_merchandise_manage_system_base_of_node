/* 
 * 2022/9/28 14:07
 * author: xxx
 * @description:
 */


export default [
    {
        name: "ThreeHello",
        path: "/threeHello",
        // component: () => import("@/test/three/Hello.vue")
        component: () => import("@/test/three/ThreeHello.vue")
    },
    {
        name: "Texture",
        path: "/texture",
        component: () => import("@/test/three/Texture.vue")
    },
    {
        name: "PBR",
        path: "/pbr",
        component: () => import("@/test/three/PBR.vue")
    },
    {
        name: "DHR",
        path: "/dhr",
        component: () => import("@/test/three/DHR.vue")
    },
    {
        name: "Shadow",
        path: "/shadow",
        component: () => import("@/test/three/Shadow.vue")
    },
    {
        name: "PointLight",
        path: "/point-light",
        // component: () => import("@/test/three/Hello.vue")
        component: () => import("@/test/three/PointLight.vue")
    },
    {
        name: "Point",
        path: "/point",
        component: () => import("@/test/three/Point.vue")
    },

    {
        name: "Touch",
        path: "/touch",
        component: () => import("@/test/three/TouchThree.vue")
    },
    {
        name: "Three_h5",
        path: "/h5",
        component: () => import("@/test/three/pageDemo/Demo.vue")
    },
    {
        name: "Copy",
        path: "/copy",
        component: () => import("@/test/three/pageDemo/Copy.vue")
    },
    {
        name: "Physical",
        path: "/physical",
        component: () => import("@/test/three/pageDemo/PhysicalDemo.vue")
    },
    {
        name: "Cannon",
        path: "/cannon",
        component: () => import("@/test/three/CannonEs.vue")
    },
    {
        name: "Shader",
        path: "/shader",
        component: () => import("@/test/three/Shader.vue")
    },
    {
        name: "Lamp",
        path: "/lamp",
        component: () => import("@/test/three/pageDemo/Lamp.vue")
    },
    {
        name: "Water",
        path: "/water",
        component: () => import("@/test/three/pageDemo/Water.vue")
    },
    {
        name: "PointShader",
        path: "/pointShader",
        component: () => import("@/test/three/PointShader.vue")
    },
    {
        name: "Firework",
        path: "/firework",
        component: () => import("@/test/three/pageDemo/Firework.vue")
    },

]
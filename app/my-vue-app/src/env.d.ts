/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component


}

// 声明了 *.glsl 文件 ，此时编译不报错
declare module '*.glsl' {
  // import type { DefineComponent } from 'vue'
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  // const component: DefineComponent<{}, {}, any>
  // export default component

  const sty:any
  export default sty

}

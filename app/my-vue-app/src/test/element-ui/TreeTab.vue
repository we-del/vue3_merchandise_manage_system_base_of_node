<template>
  <el-tree
      :data="data"
      show-checkbox
      @check-change="test"
  />
</template>

<script lang="ts" setup>

function test(a: any, b: any, c: any, d: any) {
  console.log(a, b, c, d);
}

const data = [
  {
    id: 1,
    label: 'Level one 1',
    value:'/home',
    children: [
      {
        id: 4,
        label: 'Level two 1-1',

        value:'/generic',
        children: [
          {
            id: 9,

            value:'/interface',
            label: 'Level three 1-1-1',
          },
          {
            id: 10,

            value:'/enum',
            label: 'Level three 1-1-2',
          },
        ],
      },
    ],
  },
]
</script>

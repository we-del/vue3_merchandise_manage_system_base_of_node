/* 
 * 2022/7/3 14:29
 * author: xxx
 * @description:
 */
// @ts-ignore
import BaseForm from "@/test/element-form/BaseForm.vue";
import Menu from "@/test/Menu.vue";
import Echarts from "@/test/echarts/HelloWorld.vue";
import Radar from "@/test/echarts/Radar.vue";
import ChinaMap from "@/test/echarts/ChinaMap.vue";
import SvgFont from "@/test/SvgFont.vue";
import Table from "@/test/element-ui/Table.vue";
import PaginationAddTable from "@/test/element-ui/PaginationAddTable.vue";
import TestProvide from "@/test/provideAndInject/TestProvide.vue";
import TestRole from "@/test/router/CopyRole.vue";
import TestTree from "@/test/element-ui/TreeTab.vue";
import Upload from "@/test/element-ui/Upload.vue";
import ConnectJava from "@/test/java_connect/ConnectJava.vue";
import UpdatePeople from "@/test/java_connect/UpdatePeople.vue";

export default [
    {
        name: "baseForm",
        path: "/base-form",
        component: BaseForm
    },
    {
        name: "menu",
        path: "/menu",
        component: Menu,
    },
    {
        name: "echarts",
        path: "/charts",
        component: Echarts,
    },
    {
        name: "radar",
        path: "/radar",
        component: Radar,
    },
    {
        name: "china-map",
        path: "/china-map",
        component: ChinaMap,
    },
    {
        name: "svg-font",
        path: "/svg-font",
        component: SvgFont,
    },
    {
        name: "table",
        path: "/table",
        component: Table,
    },
    {
        name: "PaginationAddTable",
        path: "/PaginationAddTable",
        component: PaginationAddTable
    },
    {
        name: "testProvide",
        path: "/provide",
        component: TestProvide
    },
    {
        name: "TestRole",
        path: "/role",
        component: TestRole
    },
    {
        name: "TestTree",
        path: "/tree",
        component: TestTree
    },
    {
        name: "Upload",
        path: "/upload",
        component: Upload
    },
    {
        name: "ConnectJava",
        path: "/connectJava",
        component: ConnectJava
    },
    {
        name: "UpdatePeople",
        path: "/updatePeople",
        component: UpdatePeople
    },
]
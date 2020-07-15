/* Layout */
import Layout from "@/layout";

//与侧边栏菜单对应
let asyncRoutes = [
  {
    path: "/",
    redirect: "/home",
    component: Layout,
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home"),
        meta: { title: "我的主页", icon: "message" },
      },
    ],
  },
  {
    path: "/system",
    component: Layout,
    meta: { title: "系统管理", icon: "form" },
    children: [
      {
        path: "sys-department",
        name: "sys-department",
        component: () => import("@/views/system/sys-department"),
        meta: { title: "部门管理" },
      },
      {
        path: "sys-role",
        name: "sys-role",
        component: () => import("@/views/system/sys-role"),
        meta: { title: "角色管理" },
      },
    ],
  },
  {
    path: "/template",
    component: Layout,
    // hidden:true,
    children:[
      {
        path:"",
        component: () => import("@/views/template"),
        meta: { title: "演示页面", icon: "example" },
      }
    ]
  },
  {
    path: "/single",
    component: () => import("@/views/single"),
    meta: { title: "独立页面", icon: "education" },
  }
];

export default asyncRoutes;

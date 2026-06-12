const Menus = [
  {
    path: "login",
    name: "login",
    meta: { title: "登录", isAuth: false },
    component: () => import("@/views/Login/login.vue"),
  },
  {
    path: "home",
    name: "home",
    meta: { title: "首页", isAuth: false },
    component: () => import("@/views/home.vue"),
  },
  {
    path: "org",
    name: "Org",
    meta: { title: "机构管理", isAuth: true },
    component: () => import("@/views/Home/components/System/Org.vue"),
  },
  {
    path: "role",
    name: "Role",
    meta: { title: "角色管理", isAuth: true },
    component: () => import("@/views/Home/components/System/Role.vue"),
  },
  {
    path: "user",
    name: "User",
    meta: { title: "用户管理", isAuth: true },
    component: () => import("@/views/Home/components/System/User.vue"),
  },
  {
    path: "menu",
    name: "Menu",
    meta: { title: "菜单管理", isAuth: true },
    component: () => import("@/views/Home/components/System/Menu.vue"),
  },
  {
    path: "dict",
    name: "Dict",
    meta: { title: "字典管理", isAuth: true },
    component: () => import("@/views/Home/components/System/Dict.vue"),
  },
  {
    path: "task",
    name: "Task",
    meta: { title: "定时任务", isAuth: true },
    component: () => import("@/views/Home/components/System/Task.vue"),
  },
  {
    path: "version",
    name: "Version",
    meta: { title: "版本管理", isAuth: true },
    component: () => import("@/views/Home/components/System/Version.vue"),
  },
  {
    path: "content",
    name: "Content",
    meta: { title: "内容管理", isAuth: true },
    component: () => import("@/views/Home/components/System/Content.vue"),
  },
  {
    path: "log",
    name: "Log",
    meta: { title: "日志管理", isAuth: true },
    component: () => import("@/views/Home/components/System/Log.vue"),
  },
  {
    path: "EntryandExit",
    name: "EntryandExit",
    meta: { title: "出入库记录", isAuth: true },
    component: () =>
      import("@/views/Home/components/quipment/EntryandExit.vue"),
  },
  {
    path: "Storageentry",
    name: "Storageentry",
    meta: { title: "设备入库", isAuth: true },
    component: () =>
      import("@/views/Home/components/quipment/Storageentry.vue"),
  },
  {
    path: "QStorageentry",
    name: "QStorageentry",
    meta: { title: "入库", isAuth: true },
    component: () =>
      import("@/views/Home/components/quipment/QStorageentry.vue"),
  },
  {
    path: "BStorageentry:bachid?",
    name: "BStorageentry",
    meta: { title: "编辑入库", isAuth: true },
    component: () =>
      import("@/views/Home/components/quipment/BStorageentry.vue"),
  },
  {
    path: "Type",
    name: "Type",
    meta: { title: "设备类型", isAuth: true },
    component: () => import("@/views/Home/components/quipment/Type/Type.vue"),
  },
  {
    path: "Inboundandoutboundrecords",
    name: "Inboundandoutboundrecords",
    meta: { title: "设备库存", isAuth: true },
    component: () =>
      import("@/views/Home/components/quipment/Inboundandoutboundrecords.vue"),
  },
  {
    path: "Xtorageentry",
    name: "Xtorageentry",
    meta: { title: "设备详情", isAuth: true },
    component: () =>
      import("@/views/Home/components/quipment/Xtorageentry.vue"),
  },
  {
    path: "appUserManagement",
    name: "appUserManagement",
    meta: { title: "APP用户管理", isAuth: true },
    component: () =>
      import("@/views/Home/components/UserManagement/appUserManagement.vue"),
  },
  {
    path: "doctor",
    name: "doctor",
    meta: { title: "医生健康报告", isAuth: true },
    component: () =>
      import("@/views/Home/components/UserManagement/doctor.vue"),
  },
  {
    path: "nurse",
    name: "nurse",
    meta: { title: "护士健康报告", isAuth: true },
    component: () => import("@/views/Home/components/UserManagement/nurse.vue"),
  },
  {
    path: "DeviceUserManagement",
    name: "DeviceUserManagement",
    meta: { title: "用户管理", isAuth: true },
    component: () =>
      import("@/views/Home/components/UserManagement/DeviceUserManagement.vue"),
  },
  {
    path: "PersonCenter",
    name: "PersonCenter",
    meta: { title: "个人中心", isAuth: true },
    component: () => import("@/views/PersonCenter/index.vue"),
  },
  // 其他子路由配置...
];

export default Menus;

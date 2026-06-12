import Vue from "vue";
import Router from "vue-router";
import Layout from "@/views/Home/index.vue";

Vue.use(Router);

// 创建路由实例
const router = new Router({
  routes: [
    {
      path: "/",
      component: Layout, // 使用布局组件
      redirect: "/login", // 默认重定向
      children: [
        {
          path: "login",
          name: "login",
          meta: { title: "登录" },
          component: () => import("@/views/Home/Login/login.vue"),
        },

        {
          path: "home",
          name: "home",
          meta: { title: "首页" },
          component: () => import("@/views/home.vue"),
        },
        {
          path: "org",
          name: "Org",
          meta: { title: "机构管理" },
          component: () => import("@/views/Home/components/System/Org.vue"),
        },
        {
          path: "role",
          name: "Role",
          meta: { title: "角色管理" },
          component: () => import("@/views/Home/components/System/Role.vue"),
        },
        {
          path: "user",
          name: "User",
          meta: { title: "用户管理" },
          component: () => import("@/views/Home/components/System/User.vue"),
        },
        {
          path: "menu",
          name: "Menu",
          meta: { title: "菜单管理" },
          component: () => import("@/views/Home/components/System/Menu.vue"),
        },
        {
          path: "dict",
          name: "Dict",
          meta: { title: "字典管理" },
          component: () => import("@/views/Home/components/System/Dict.vue"),
        },
        {
          path: "task",
          name: "Task",
          meta: { title: "定时任务" },
          component: () => import("@/views/Home/components/System/Task.vue"),
        },
        {
          path: "version",
          name: "Version",
          meta: { title: "版本管理" },
          component: () => import("@/views/Home/components/System/Version.vue"),
        },
        {
          path: "content",
          name: "Content",
          meta: { title: "内容管理" },
          component: () => import("@/views/Home/components/System/Content.vue"),
        },
        {
          path: "log",
          name: "Log",
          meta: { title: "日志管理" },
          component: () => import("@/views/Home/components/System/Log.vue"),
        },
        {
          path: "EntryandExit",
          name: "EntryandExit",
          meta: { title: "出入库记录" },
          component: () =>
            import("@/views/Home/components/quipment/EntryandExit.vue"),
        },
        {
          path: "Storageentry",
          name: "Storageentry",
          meta: { title: "设备入库" },
          component: () =>
            import("@/views/Home/components/quipment/Storageentry.vue"),
        },
        {
          path: "QStorageentry",
          name: "QStorageentry",
          meta: { title: "新增入库" },
          component: () =>
            import("@/views/Home/components/quipment/QStorageentry.vue"),
        },
        {
          path: "BStorageentry:bachid?",
          name: "BStorageentry",
          meta: { title: "设备编辑" },
          component: () =>
            import("@/views/Home/components/quipment/BStorageentry.vue"),
        },
        {
          path: "Type",
          name: "Type",
          meta: { title: "设备类型" },
          component: () =>
            import("@/views/Home/components/quipment/Type/Type.vue"),
        },
        {
          path: "Inboundandoutboundrecords",
          name: "Inboundandoutboundrecords",
          meta: { title: "设备库存" },
          component: () =>
            import(
              "@/views/Home/components/quipment/Inboundandoutboundrecords.vue"
            ),
        },

        {
          path: "Xtorageentry",
          name: "Xtorageentry",
          meta: { title: "设备出库" },
          component: () =>
            import("@/views/Home/components/quipment/Xtorageentry.vue"),
        },
        {
          path: "TestingItems",
          name: "TestingItems",
          meta: { title: "设备检测项目" },
          component: () =>
            import(
              "@/views/Home/components/quipment/TestingItems/TestingItems.vue"
            ),
        },
        {
          path: "Equipment",
          name: "Equipment",
          meta: { title: "设备配置" },
          component: () =>
            import("@/views/Home/components/quipment/Equipment/Equipment.vue"),
        },
        {
          path: "CreateEquipment",
          name: "CreateEquipment",
          meta: { title: "设备管理新增" },
          component: () =>
            import(
              "@/views/Home/components/quipment/Equipment/CreateEquipment.vue"
            ),
        },
        {
          path: "EditEquipment",
          name: "EditEquipment",
          meta: { title: "设备管理编辑" },
          component: () =>
            import(
              "@/views/Home/components/quipment/Equipment/EditEquipment.vue"
            ),
        },
        {
          path: "doctor",
          name: "doctor",
          meta: { title: "医生健康报告" },
          component: () =>
            import("@/views/Home/components/UserManagement/doctor.vue"),
        },

        {
          path: "doctoradd",
          name: "doctoradd",
          meta: { title: "医生资质新增" },
          component: () =>
            import("@/views/Home/components/UserManagement/doctoradd.vue"),
        },
        {
          path: "binddevices",
          name: "binddevices",
          meta: { title: "设备绑定查询" },
          component: () =>
            import("@/views/Home/components/UserManagement/binddevices.vue"),
        },
        {
          path: "Warning",
          name: "Warning",
          meta: { title: "预警事件处理" },
          component: () =>
            import("@/views/Home/components/UserManagement/Warning.vue"),
        },

        {
          path: "doctorcheck",
          name: "doctorcheck",
          meta: { title: "医生资质审批" },
          component: () =>
            import("@/views/Home/components/UserManagement/doctorcheck.vue"),
        },
        {
          path: "nurse",
          name: "nurse",
          meta: { title: "护士健康报告" },
          component: () =>
            import("@/views/Home/components/UserManagement/nurse.vue"),
        },
        {
          path: "appUserManagement",
          name: "appUserManagement",
          meta: { title: "用户管理" },
          component: () =>
            import(
              "@/views/Home/components/UserManagement/appUserManagement.vue"
            ),
        },
        {
          path: "devicebind",
          name: "devicebind",
          meta: { title: "设备绑定解绑" },
          component: () =>
            import("@/views/Home/components/UserManagement/devicebind.vue"),
        },
        {
          path: "institutional",
          name: "institutional",
          meta: { title: "机构健康报告" },
          component: () =>
            import("@/views/Home/components/UserManagement/institutional.vue"),
        },
        {
          path: "PersonCenter",
          name: "PersonCenter",
          meta: { title: "个人中心" },
          component: () => import("@/views/PersonCenter/index.vue"),
        },
        {
          path: "valueaddedservices",
          name: "valueaddedservices",
          meta: { title: "增值服务" },
          component: () =>
            import(
              "@/views/Home/components/valueaddedservices/valueaddedservices.vue"
            ),
        },
        ,
        {
          path: "medicalExamimport",
          name: "medicalExamimport",
          meta: { title: "检测信息导入" },
          component: () =>
            import(
              "@/views/Home/components/UserManagement/medicalExamimport.vue"
            ),
        },
        {
          path: "medicalExamQry",
          name: "medicalExamQry",
          meta: { title: "检测信息搜索" },
          component: () =>
            import("@/views/Home/components/UserManagement/medicalExamQry.vue"),
        },
        {
          path: "datadashboard",
          name: "datadashboard",
          meta: { title: "机构驾驶舱" },
          component: () =>
            import("@/views/Home/components/datadashboard/datadashboard.vue"),
        },

        // ===== 新增菜单路由 =====
        {
          path: "operation-overview",
          name: "OperationOverview",
          meta: { title: "运营总览" },
          component: () =>
            import("@/views/Home/components/operation/OperationOverview.vue"),
        },
        {
          path: "ai-model",
          name: "AiModel",
          meta: { title: "AI模型" },
          component: () =>
            import("@/views/Home/components/aimodel/AiModel.vue"),
        },
        // 商業運營
        {
          path: "mall-management",
          name: "MallManagement",
          meta: { title: "商城管理" },
          component: () =>
            import("@/views/Home/components/business/MallManagement.vue"),
        },
        {
          path: "points-members",
          name: "PointsMembers",
          meta: { title: "積分與會員" },
          component: () =>
            import("@/views/Home/components/business/PointsMembers.vue"),
        },
        {
          path: "payment-management",
          name: "PaymentManagement",
          meta: { title: "支付管理" },
          component: () =>
            import("@/views/Home/components/business/PaymentManagement.vue"),
        },
        {
          path: "service-provider",
          name: "ServiceProvider",
          meta: { title: "服務提供商" },
          component: () =>
            import("@/views/Home/components/business/ServiceProvider.vue"),
        },
        // 內容 & 系統
        {
          path: "content-cms",
          name: "ContentCMS",
          meta: { title: "內容管理 CMS" },
          component: () =>
            import("@/views/Home/components/contentsystem/ContentCMS.vue"),
        },
        {
          path: "permission-management",
          name: "PermissionManagement",
          meta: { title: "權限管理" },
          component: () =>
            import("@/views/Home/components/contentsystem/PermissionManagement.vue"),
        },
        {
          path: "system-setting",
          name: "SystemSetting",
          meta: { title: "系統設置" },
          component: () =>
            import("@/views/Home/components/contentsystem/SystemSetting.vue"),
        },
        {
          path: "warning-rule",
          name: "WarningRule",
          meta: { title: "预警规则" },
          component: () =>
            import("@/views/Home/components/contentsystem/WarningRule.vue"),
        },
        // 健康師
        {
          path: "hc-workbench",
          name: "HcWorkbench",
          meta: { title: "工作台首頁" },
          component: () =>
            import("@/views/Home/components/healthcoach/Workbench.vue"),
        },
        {
          path: "hc-customer-list",
          name: "HcCustomerList",
          meta: { title: "客戶列表" },
          component: () =>
            import("@/views/Home/components/healthcoach/CustomerList.vue"),
        },
        {
          path: "hc-customer-detail",
          name: "HcCustomerDetail",
          meta: { title: "客戶詳情" },
          component: () =>
            import("@/views/Home/components/healthcoach/CustomerDetail.vue"),
        },
        {
          path: "hc-health-warning",
          name: "HcHealthWarning",
          meta: { title: "健康預警" },
          component: () =>
            import("@/views/Home/components/healthcoach/HealthWarning.vue"),
        },
        {
          path: "hc-followup",
          name: "HcFollowUp",
          meta: { title: "随訪管理" },
          component: () =>
            import("@/views/Home/components/healthcoach/FollowUp.vue"),
        },
        {
          path: "hc-health-plan",
          name: "HcHealthPlan",
          meta: { title: "健康計劃" },
          component: () =>
            import("@/views/Home/components/healthcoach/HealthPlan.vue"),
        },
        {
          path: "hc-consultation",
          name: "HcConsultation",
          meta: { title: "問診管理" },
          component: () =>
            import("@/views/Home/components/healthcoach/Consultation.vue"),
        },
        {
          path: "hc-message",
          name: "HcMessageCenter",
          meta: { title: "消息中心" },
          component: () =>
            import("@/views/Home/components/healthcoach/MessageCenter.vue"),
        },
        {
          path: "hc-interpretation",
          name: "HcPlateInterpretation",
          meta: { title: "手板結果解讀" },
          component: () =>
            import("@/views/Home/components/healthcoach/PlateInterpretation.vue"),
        },
        {
          path: "hc-recommend",
          name: "HcProductRecommend",
          meta: { title: "商品推薦" },
          component: () =>
            import("@/views/Home/components/healthcoach/ProductRecommend.vue"),
        },
        {
          path: "hc-performance",
          name: "HcMyPerformance",
          meta: { title: "我的績效" },
          component: () =>
            import("@/views/Home/components/healthcoach/MyPerformance.vue"),
        },

        // 其他子路由配置...
      ],
    },
  ],
});

/**
 * 确保面包屑历史记录中包含首页
 * @param {Array} history 当前的历史记录数组
 * @returns {Array} 处理后的历史记录
 */
function ensureHomeInHistory(history) {
  const hasHome = history.some((item) => item.isHome);
  if (!hasHome) {
    history.unshift({
      title: "首页",
      fullPath: "/home",
      isHome: true,
      timestamp: 0,
    });
  }
  return history;
}

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === "/login") {
    sessionStorage.removeItem("breadcrumbHistory");
    next();
    return;
  }

  const token = sessionStorage.getItem("orgName");
  if (!token && to.path !== "/login") {
    next("/login");
    return;
  }

  // 白名单路由（不需要权限验证）
  const whiteList = [
    "/login",
    "/home",
    // 新增菜单（无需权限验证）
    "/operation-overview",
    "/ai-model",
    "/mall-management",
    "/points-members",
    "/payment-management",
    "/service-provider",
    "/content-cms",
    "/permission-management",
    "/system-setting",
    "/warning-rule",
    "/hc-workbench",
    "/hc-customer-list",
    "/hc-customer-detail",
    "/hc-health-warning",
    "/hc-followup",
    "/hc-health-plan",
    "/hc-consultation",
    "/hc-message",
    "/hc-interpretation",
    "/hc-recommend",
    "/hc-performance",
  ];
  if (whiteList.includes(to.path)) {
    let history = JSON.parse(
      sessionStorage.getItem("breadcrumbHistory") || "[]",
    );
    history = ensureHomeInHistory(history);
    sessionStorage.setItem("breadcrumbHistory", JSON.stringify(history));
    next();
    return;
  }

  // 从sessionStorage获取权限列表
  const permissions = JSON.parse(sessionStorage.getItem("permissions") || "[]");

  // 检查当前路由是否在权限列表中
  if (permissions.includes(to.path)) {
    // 权限验证通过，记录面包屑
    let history = JSON.parse(
      sessionStorage.getItem("breadcrumbHistory") || "[]",
    );

    if (to.path !== "/home" && to.path !== "/login") {
      const existingIndex = history.findIndex((item) => item.name === to.name);

      if (existingIndex !== -1) {
        history[existingIndex] = {
          fullPath: to.fullPath,
          name: to.name,
          title: to.meta?.title || "未命名",
          timestamp: Date.now(),
        };
      } else {
        history.push({
          fullPath: to.fullPath,
          name: to.name,
          title: to.meta?.title || "未命名",
          timestamp: Date.now(),
        });
      }

      // 去重并保留最新30条
      const uniqueMap = new Map();
      history.forEach((item) => uniqueMap.set(item.name, item));
      history = Array.from(uniqueMap.values())
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 30);
    }

    // 确保首页存在并保存
    history = ensureHomeInHistory(history);
    sessionStorage.setItem("breadcrumbHistory", JSON.stringify(history));
    next();
  } else {
    // 无权限访问，跳转到首页
    let history = JSON.parse(
      sessionStorage.getItem("breadcrumbHistory") || "[]",
    );
    history = ensureHomeInHistory(history);
    sessionStorage.setItem("breadcrumbHistory", JSON.stringify(history));

    // 提示无权限（需要你实现消息提示组件）
    Vue.prototype.$message && Vue.prototype.$message.error("无权限访问该页面");
  }
});

export default router;

<template>
  <div class="common-layout">
    <el-container>
      <el-header style="height: 110px;width: 100%;background-color: #089BAB;  margin: 0;  padding: 0;display: flex;">
        <div class="logo">樂創业务中台</div>
        <div
          style="width:calc(100% - 200px);height: 110px;background: #FFFFFF;border-radius: 0px 0px 0px 0px;display: flex;justify-content: space-between;">
          <div class="input">
          </div>
          <div style="line-height: 85px;display: flex;height: 85px;padding-top: 40px;">
            <div @click="quanping" class="button-aa" :style="fullscreenButtonStyle"></div>
            <el-button class="button-a">
              <i class="el-icon-office-building"></i>
            </el-button>
            <div style="display: flex;">
              <div
                style="width: 32px;height: 32px;border-radius: 50%;border: 1px solid black;margin-left: 10px;margin-right: 10px;">
              </div>
              <div class="user">当前机构：{{ nickname }}</div>
              <div class="user">登录人：{{ username }}</div>
              <el-dropdown @command="handleCommand" trigger="click">
                <el-button style="margin-right: 20px;" class="button-a">
                  <i class="el-icon-arrow-down"></i>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">
                      <i class="el-icon-user"></i>
                      <span style="margin-left: 8px;">个人中心</span>
                    </el-dropdown-item>
                    <el-dropdown-item command="logout" divided>
                      <i class="el-icon-switch-button"></i>
                      <span style="margin-left: 8px;">退出登录</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu style="overflow: hidden;" class="el-menu-vertical" router unique-opened>
            <!-- 动态生成菜单 -->
            <!-- 将 key 移动到实际的 el-submenu 和 el-menu-item 上 -->
            <template v-for="menu in filteredMenus">
              <!-- 有子菜单的渲染为 submenu -->
              <el-submenu v-if="menu.children && menu.children.length > 0" :index="menu.index" :key="menu.index">
                <template #title>
                  <i :class="menu.icon"></i>
                  <span class="aaa">{{ menu.title }}</span>
                </template>
                <!-- 循环渲染二级菜单 -->
                <el-menu-item v-for="child in menu.children" :key="child.index" :index="child.index">
                  <span class="aa">{{ child.title }}</span>
                </el-menu-item>
              </el-submenu>

              <!-- 没有子菜单的渲染为普通菜单项 -->
              <el-menu-item v-else :index="menu.index" :key="menu.index" :disabled="menu.disabled">
                <i :class="menu.icon"></i>
                <span class="aaa">{{ menu.title }}</span>
              </el-menu-item>
            </template>
          </el-menu>
        </el-aside>
        <el-main style="overflow: hidden ">
          <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import img666 from '../../assets/666.png';
import img777 from '../../assets/777.png';

export default {
  data() {
    return {
      isFullscreen: false,
      normalScreenIcon: img666,
      fullScreenIcon: img777,
      username: sessionStorage.getItem('userName'),
      nickname: sessionStorage.getItem('orgName'),
      userPermissions: [],
      // 完整的菜单配置（包含所有可能的菜单项）
      allMenus: [
        // ===== 新增菜单（纳入权限过滤，运营总览永远在第一个）=====
        { index: "/operation-overview", title: "运营总览", icon: "el-icon-menu" },
        { index: "/ai-model", title: "AI模型", icon: "el-icon-menu" },
        {
          index: "business-operation",
          title: "商業運營",
          icon: "el-icon-menu",
          children: [
            { index: "/mall-management", title: "商城管理" },
            { index: "/points-members", title: "積分與會員" },
            { index: "/payment-management", title: "支付管理" },
            { index: "/service-provider", title: "服務提供商" },
          ],
        },
        {
          index: "content-system",
          title: "內容 & 系統",
          icon: "el-icon-menu",
          children: [
            { index: "/content-cms", title: "內容管理 CMS" },
            { index: "/permission-management", title: "權限管理" },
            { index: "/system-setting", title: "系統設置" },
            { index: "/warning-rule", title: "预警规则" },
          ],
        },
        {
          index: "health-coach",
          title: "健康師",
          icon: "el-icon-menu",
          children: [
            { index: "/hc-workbench", title: "工作台首頁" },
            { index: "/hc-customer-list", title: "客戶列表" },
            { index: "/hc-customer-detail", title: "客戶詳情" },
            { index: "/hc-health-warning", title: "健康預警" },
            { index: "/hc-followup", title: "随訪管理" },
            { index: "/hc-health-plan", title: "健康計劃" },
            { index: "/hc-consultation", title: "問診管理" },
            { index: "/hc-message", title: "消息中心" },
            { index: "/hc-interpretation", title: "手板結果解讀" },
            { index: "/hc-recommend", title: "商品推薦" },
            { index: "/hc-performance", title: "我的績效" },
          ],
        },
        { index: "/nutritionist", title: "营养师", icon: "el-icon-menu", disabled: true },
        // ===== 原有菜单 =====

        {
          index: "system",
          title: "系统管理",
          icon: "el-icon-setting",
          children: [
            { index: "/org", title: "机构管理" },
            { index: "/role", title: "角色管理" },
            { index: "/user", title: "用户管理" },
            { index: "/menu", title: "菜单管理" },
            { index: "/dict", title: "字典管理" },
            { index: "/task", title: "定时任务" },
            { index: "/version", title: "版本管理" },
            { index: "/content", title: "内容管理" },
            { index: "/log", title: "日志管理" }
          ]
        },
        {
          index: "equipment",
          title: "设备管理",
          icon: "el-icon-suitcase-1",
          children: [
            { index: "/Type", title: "设备类型" },
            { index: "/testingitems", title: "设备检测项目" },
            // { index: "/equipmentlist", title: "设备列表" },
            { index: "/Storageentry", title: "设备入库" },
            { index: "/Inboundandoutboundrecords", title: "设备库存" },
            { index: "/EntryandExit", title: "设备出入记录" },
            { index: "/Equipment", title: "设备配置" },
            { index: "/Xtorageentry", title: "设备出库" },
            { index: "/QStorageentry", title: "新增入库" },
            { index: "/BStorageentry", title: "设备编辑" },



          ]
        },
        {
          index: "userCenter",
          title: "用户中心",
          icon: "el-icon-user-solid",
          children: [
            { index: "/appUserManagement", title: "用户管理" },
            { index: "/doctor", title: "医生健康报告" },
            { index: "/nurse", title: "护士健康报告" },
            { index: "/institutional", title: "机构健康报告" },
            { index: "/doctoradd", title: "医生资质新增" },
            { index: "/doctorcheck", title: "医生资质审批" },
            { index: "/medicalExamimport", title: "检测信息导入" },
            { index: "/medicalExamQry", title: "检测信息搜索" },
            { index: "/devicebind", title: "设备绑定解绑" },
            { index: "/binddevices", title: "设备绑定查询" },
            { index: "/Warning", title: "预警事件处理" },

            // "/medicalExamQry", "/medicalExamimport",
          ]
        },
        {
          index: "valueaddedservices",
          title: "配置管理",
          icon: "el-icon-s-help",
          children: [
            { index: "/valueaddedservices", title: "增值服务" },
          ]
        },
        {
          index: "datadashboard",
          title: "驾驶舱",
          icon: "el-icon-s-data",
          children: [
            { index: "/datadashboard", title: "驾驶舱" },

          ]
        },


      ]
    };
  },
  computed: {

    fullscreenButtonStyle() {
      return {
        backgroundImage: `url(${this.isFullscreen ? this.fullScreenIcon : this.normalScreenIcon})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      };
    },

    // 从sessionStorage获取权限列表
    permissions() {
      return JSON.parse(sessionStorage.getItem('permissions') || "[]");
    },

    // 过滤后的菜单（根据用户权限）
    filteredMenus() {
      return this.allMenus
        .map(menu => {
          // 处理有子菜单的情况
          if (menu.children) {
            const filteredChildren = menu.children.filter(child =>
              this.permissions.includes(child.index)
            );

            // 如果有权限的子菜单不为空，则保留该菜单组
            if (filteredChildren.length > 0) {
              return { ...menu, children: filteredChildren };
            }
            return null;
          }
          // 处理无子菜单的情况
          else {
            if (this.permissions.includes(menu.index)) {
              return menu;
            }
            return null;
          }
        })
        .filter(menu => menu !== null); // 过滤掉没有权限的菜单
    }
  },
  mounted() {
    // 添加全屏状态变化监听
    document.addEventListener('fullscreenchange', this.checkFullscreen);
    document.addEventListener('webkitfullscreenchange', this.checkFullscreen);
    document.addEventListener('mozfullscreenchange', this.checkFullscreen);
    document.addEventListener('MSFullscreenChange', this.checkFullscreen);
    this.handlequanxi()
  },
  beforeUnmount() {
    // 移除事件监听
    document.removeEventListener('fullscreenchange', this.checkFullscreen);
    document.removeEventListener('webkitfullscreenchange', this.checkFullscreen);
    document.removeEventListener('mozfullscreenchange', this.checkFullscreen);
    document.removeEventListener('MSFullscreenChange', this.checkFullscreen);
  },
  methods: {

    handlequanxi() {
      const quxni = JSON.parse(sessionStorage.getItem('permissions') || "[]");

      this.userPermissionsr = quxni.includes("/PersonCenter");

    }
    ,
    checkFullscreen() {
      this.isFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    },
    quanping() {
      if (!this.isFullscreen) {
        this.enterFullscreen();
      } else {
        this.exitFullscreen();
      }
    },
    enterFullscreen() {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
      this.isFullscreen = true;
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      this.isFullscreen = false;
    },
    handleCommand(command) {
      if (command === 'profile') {
        // 跳转到个人中心页面
        this.$router.push('/PersonCenter');
      } else if (command === 'logout') {
        // 清除本地缓存
        localStorage.clear();
        sessionStorage.clear();
        sessionStorage.removeItem('breadcrumbHistory');
        // 跳转到登录页面
        this.$router.push('/login');
      }
    }
  }
}
</script>


<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.common-layout {
  width: 100%;
  height: 100%;
  /* overflow: auto; */
  background-color: #f5f7fa;

}

.el-container {
  height: 100%;
}

.el-aside {
  background-color: #FFFFFF;
  height: 100%;
  border-right: 1px solid #eef0f2;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.02);
}

.el-main {
  height: 100%;
}

.jj {
  font-style: 20px;
  float: right;
  margin-right: 150px;
}

.hh {
  margin-top: 25px;
  float: right;
}

.button-a {
  border: 0;
  height: 32px;
  width: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

}

.button-aa {
  border: 0;
  height: 22px;
  width: 22px;
  margin-top: 4px;
  margin-right: 13px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 移除原background属性 */
}

.button-a i {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.user {
  width: 170px;
  height: 12px;
  font-family: PingFang SC Regular, PingFang SC Regular;
  font-weight: 400;
  font-size: 12px;
  color: #121A2D;
  line-height: 12px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-top: 10px;
  margin-left: 10px;
}

.input {
  width: 280px;
  height: 32px;
  /* background: rgba(8, 155, 171, 0.1608); */
  border-radius: 10px 10px 10px 10px;
  margin-top: 27px;
  margin-left: 20px;
  /* background-color: #089BAB; */
}

.logo {
  width: 200px;
  height: 110px;
  background-color: #089BAB;
  text-align: center;
  line-height: 110px;
  color: aliceblue;
  font-family: YouSheBiaoTiHei, YouSheBiaoTiHei;
  font-weight: 400;
  font-size: 24px;
  color: #FFFFFF;
  font-style: normal;
  text-transform: none;
}

.shouye {
  height: 200px;
  width: 100%;
  background-color: #fff;
}

.aaa {
  color: inherit !important;
  width: auto;
  height: 16px;
  font-family: PingFang SC Regular;
  font-weight: inherit;
  font-size: 14px;
  line-height: 16px;
  text-align: left;
  margin-left: 6px;
  white-space: nowrap;
}

.aa {
  width: 120px;
  height: 16px;
  font-family: PingFang SC Regular, PingFang SC Regular;
  font-weight: inherit;
  font-size: 14px;
  color: inherit;
  line-height: 46px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  margin-left: 10px;
}

/* 核心菜单样式修改 */
.el-menu {
  border-right: none !important;
  background-color: transparent !important;
}

/* 顶级（无子级）菜单项样式 */
.el-menu-vertical > .el-menu-item {
  width: 184px !important;
  height: 52px !important;
  line-height: 52px !important;
  border-radius: 10px !important;
  color: #4b5563 !important;
  margin: 4px 8px !important;
  box-sizing: border-box !important;
  transition: all 0.3s;
}

.el-menu-vertical > .el-menu-item i {
  color: inherit !important;
}

.el-menu-vertical > .el-menu-item:hover {
  background: #f1fafb !important;
  color: #089BAB !important;
}

.el-menu-vertical > .el-menu-item.is-active {
  background: #e3f5f7 !important;
  color: #089BAB !important;
  font-weight: 600;
}

.el-menu-vertical > .el-menu-item.is-disabled {
  opacity: 1 !important;
  color: #9ca3af !important;
  cursor: not-allowed;
}

/* 一级菜单项样式 */
.el-submenu__title {
  width: 184px !important;
  height: 52px !important;
  line-height: 52px !important;
  background: transparent !important;
  border-radius: 10px !important;
  color: #4b5563 !important;
  margin: 4px 8px !important;
  box-sizing: border-box !important;
  transition: all 0.3s;
}

/* 默认箭头向右 */
.el-submenu__title .el-submenu__icon-arrow {
  transform: rotate(0deg) !important;
  transition: transform 0.3s;
}

/* 展开时箭头向下 */
.el-submenu.is-opened .el-submenu__title .el-submenu__icon-arrow {
  transform: rotate(270deg) !important;

}

.el-icon-arrow-down:before {
  font-size: 14px;
  font-weight: bold;

}

/* 一级菜单图标颜色 */
.el-submenu__title i {
  color: inherit !important;
}

/* 一级菜单悬停背景色 */
.el-submenu__title:hover {
  background: #f1fafb !important;
  color: #089BAB !important;
}

.el-submenu .el-menu-item {
  min-width: 200px;
}

.el-submenu .el-menu--inline {
  background-color: transparent !important;
  padding-left: 0 !important;
}

.el-submenu .el-menu--inline .el-menu-item {
  width: 176px !important;
  height: 46px !important;
  line-height: 46px !important;
  background: transparent !important;
  color: #6b7280 !important;
  margin: 2px 8px 2px 16px !important;
  border-radius: 8px !important;
  box-sizing: border-box !important;
  display: flex;
  justify-content: center;
  position: relative;
  text-align: left;
}

/* 二级菜单悬停效果 */
.el-submenu .el-menu--inline .el-menu-item:hover {
  background: #f1fafb !important;
  color: #089BAB !important;
}

/* 当前选中的二级菜单 */
.el-submenu .el-menu--inline .el-menu-item.is-active {
  background: #e3f5f7 !important;
  color: #089BAB !important;
  font-weight: 600;
}

/* 选中状态左侧指示条 */
.el-submenu .el-menu--inline .el-menu-item.is-active::before {
  content: "";
  position: absolute;
  left: 6px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #089BAB;
  border-radius: 2px;
}

/* 调整菜单项文字位置 */
.el-submenu .el-menu--inline .el-menu-item span {
  margin-left: 8px;
  /* 增加文字左侧间距 */
}

.app-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.menu-container {
  width: 200px;
  height: 100vh;
  flex-shrink: 0;
  overflow-y: auto;
  background-color: #089BAB;
  padding: 10px 0;
}

.content-container {
  flex: 1;
  overflow-y: auto;
  background: #f0f2f5;
}

/* 菜单栏滚动条美化 */
.menu-container::-webkit-scrollbar {
  width: 6px;
}

.menu-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 下拉菜单样式 */
.el-dropdown-menu {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 0;
  position: absolute !important;
  top: 80px !important;

}

.el-dropdown-menu__item {

  padding: 6px 16px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  margin: 0;
}

.el-dropdown-menu__item:hover {
  background-color: #f5f7fa;
  color: #409eff;
}

.el-dropdown-menu__item--divided:before {
  height: 0;
  margin: 0;
}

.el-dropdown-menu__item.is-divided {
  border-top: 1px solid #e4e7ed;
}
</style>

<template>
  <div class="responsive-scale-wrapper">
    <div class="responsive-scale-container" ref="scaleContainerRef">
      <div class="equipmentBox" :class="{ fullscreen: isFullscreen }">
        <div class="form-box">
          <div class="logo-box"></div>
          <div class="form-detail">
            <el-input v-model="form.userName" class="input-c" size="large" placeholder="请输入用户名称">
              <template slot="prefix">
                <i style="margin-top: 13px; margin-left: 6px" class="el-icon-user"></i>
              </template>
            </el-input>
            <el-input v-model="form.passWord" class="input-c" size="large" :type="passWordType" placeholder="请输入账号密码">
              <template slot="prefix">
                <i style="margin-top: 13px; margin-left: 6px" class="el-icon-lock"></i>
              </template>
              <template slot="suffix">
                <i style="margin-top: 3px" class="el-input__icon"
                  :class="isCheckPass ? 'el-icon-open' : 'el-icon-turn-off'" @click="onCheckPass"></i>
              </template>
            </el-input>
            <el-input v-model="form.checkCode" class="input-c input-code" size="large" placeholder="验证码">
              <template slot="prefix">
                <i style="margin-top: 13px; margin-left: 6px" class="el-icon-mobile-phone"></i>
              </template>
              <template slot="suffix">
                <div class="checkcode-c" @click="onClickCheckCode">{{ randomNumA }} + {{ randomNumB }} = ?</div>
              </template>
            </el-input>
            <el-button type="primary" @click="onSubmit" class="button-c" size="large"> 登录 </el-button>
          </div>
        </div>
        <div class="footer-box">©2025 陕ICP备2025063613号-1</div>
      </div>
    </div>
  </div>
</template>
<script>
import { login } from "../../../api/login";
export default {
  data() {
    return {
      form: {
        userName: "",
        passWord: "",
        checkCode: "",
      },
      isCheckPass: false,
      passWordType: "password",
      randomNumA: Math.floor(Math.random() * 10),
      randomNumB: Math.floor(Math.random() * 10),
      scaleRatio: 1,
      isFullscreen: false,
    };
  },
  computed: {
    checkCodeResult() {
      return this.randomNumA + this.randomNumB;
    },
  },
  methods: {
    onCheckPass() {
      this.isCheckPass = !this.isCheckPass;
      this.passWordType = this.isCheckPass ? "text" : "password";
    },
    onClickCheckCode() {
      this.randomNumA = Math.floor(Math.random() * 10);
      this.randomNumB = Math.floor(Math.random() * 10);
    },
    onSubmit() {
      if (!this.form.userName || !this.form.passWord || !this.form.checkCode) {
        this.$message.error("请填写完整信息");
        return;
      }
      if (Number(this.form.checkCode) !== this.checkCodeResult) {
        this.$message.error("验证码错误请重新输入");
        this.onClickCheckCode();
        return;
      }
      this.isLogin({
        nickName: this.form.userName,
        passWord: this.form.passWord,
        userType: 0,
      });
    },
    async isLogin(data) {
      try {
        sessionStorage.setItem("loginuserName", this.form.userName);
        const res = await login(data);
        if (res.data.message === "success") {
          sessionStorage.setItem("orgId", res.data.userInfo.orgId);
          sessionStorage.setItem("userName", this.form.userName);
          sessionStorage.setItem("orgName", res.data.userInfo.orgName);
          sessionStorage.setItem("mainOrg", res.data.userInfo.mainOrg);
          sessionStorage.setItem("userId", res.data.userInfo.userId);
          sessionStorage.setItem("token", res.token);
          sessionStorage.setItem("roleName", res.data.roleType);
          const permissions = res.data.rightInfo.map((item) => `/${item.menuPath}`);
          sessionStorage.setItem("permissions", JSON.stringify(permissions));
          sessionStorage.setItem(
            "breadcrumbHistory",
            JSON.stringify([
              {
                title: "首页",
                fullPath: "/home",
                isHome: true,
              },
            ])
          );
          this.$router.push("/home");
        } else {
          this.$message.warning(res.data.message);
        }
      } catch (error) {
        console.error(error);
        this.$message.error("登录失败");
      }
    },
    calculateScaleRatio() {
      const DESIGN_BASE_WIDTH = 1920;
      return window.innerWidth / DESIGN_BASE_WIDTH;
    },
    applyScaleTransform() {
      this.scaleRatio = this.calculateScaleRatio();
      if (this.$refs.scaleContainerRef) {
        this.$refs.scaleContainerRef.style.transform = `scale(${this.scaleRatio})`;
      }
    },
    handleWindowResize() {
      this.applyScaleTransform();
    },
  },
  mounted() {
    this.applyScaleTransform();
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  },
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.responsive-scale-wrapper {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
}

.responsive-scale-container {
  width: 1920px;
  height: 1080px;
  transform-origin: 0 0;
  transition: transform 0.3s ease;
}

.equipmentBox {
  width: 100%;
  height: 100%;
  background: url("../../../assets/login/bgc.png") no-repeat;
  background-size: cover;
  position: relative;

  .logo-box {
    height: 200px;
    width: 500px;
    position: absolute;
    top: 17.1%;
    left: 50%;
    transform: translateX(-50%);
    background: url("../../../assets/login/111.png") no-repeat center;
    background-size: contain;
  }

  .form-box {
    width: 30%;
    min-width: 448px;
    height: 71%;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 60px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 10%;
    padding: 40px;
  }

  .form-detail {
    width: 100%;
    height: 100%;
    margin-top: 350px;
  }

  .footer-box {
    position: absolute;
    width: 100%;
    text-align: center;
    color: rgba(255, 255, 255, 0.73);
    bottom: 20px;
    font-size: 14px;
  }

  .input-c {
    margin: 20px 0;
  }

  .button-c {
    width: 100%;
    height: 50px;
    margin-top: 20px;
    background-color: #089bab;
    color: #fff;
    border: none;
    border-radius: 8px;
  }

  .checkcode-c {
    background-color: #e6f5f6;
    width: 100px;
    height: 100%;
    border-radius: 10px;
    position: absolute;
    right: -8px;

    border: 1px solid #089bab;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &.fullscreen {
    z-index: 9999;
  }
}
</style>

<template>
    <div class="person-center">
        <div class="container">
            <!-- 左侧个人信息 -->
            <div class="left-panel">
                <div class="panel-header">
                    <h3>个人信息</h3>
                </div>
                <div class="profile-section">
                    <div class="avatar-container">
                        <img style="width: 80px;height: 80px;border-radius: 50%;" src="../../assets/656.png" alt="">
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="el-icon-user"></i>
                            <span>用户名称</span>
                        </div>
                        <div class="info-value">{{ basicForm.username }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="el-icon-phone"></i>
                            <span>手机号码</span>
                        </div>
                        <div class="info-value">1891380359</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="el-icon-user-solid"></i>
                            <span>所属角色</span>
                        </div>
                        <div class="info-value">{{ basicForm.userType }}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">
                            <i class="el-icon-date"></i>
                            <span>创建日期</span>
                        </div>
                        <div class="info-value">2025-09-09 12:00:01</div>
                    </div>
                </div>
            </div>
            <!-- 右侧内容区域 -->
            <div class="right-panels">
                <div class="panel-header">
                    <h3>基本资料</h3>
                </div>
                <div class="tab-container">
                    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
                        <el-tab-pane style="margin-top: 0;" label="基本资料" name="basic">
                            <div class="form-container">
                                <el-form :model="basicForm" label-width="100px" class="basic-form">
                                    <el-form-item label="用户昵称" required>
                                        <el-input v-model="basicForm.username" placeholder="superAdmin"></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机号码" required>
                                        <el-input v-model="basicForm.phone" placeholder="12452627262"></el-input>
                                    </el-form-item>
                                    <el-form-item label="性别">
                                        <el-radio-group v-model="basicForm.gender">
                                            <el-radio label="male">男</el-radio>
                                            <el-radio label="female">女</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="选择用户">
                                        <el-radio-group v-model="basicForm.userType">
                                            <el-radio label="device">设备用户</el-radio>
                                            <el-radio label="organization">机构用户</el-radio>
                                            <el-radio label="app">APP用户</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" class="save-btn">保存</el-button>
                                        <el-button class="cancel-btn">关闭</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="修改密码" name="password">
                            <div class="form-container">
                                <el-form :model="passwordForm" label-width="100px" class="password-form">
                                    <el-form-item required label="旧密码">
                                        <el-input v-model="passwordForm.oldPassword" type="password"
                                            placeholder="请输入旧密码" show-password>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item required label="新密码">
                                        <el-input v-model="passwordForm.newPassword" type="password"
                                            placeholder="请输入新密码" show-password>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item required label="确认密码">
                                        <el-input v-model="passwordForm.confirmPassword" type="password"
                                            placeholder="请确认新密码" show-password>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item style="margin-top: 0;">
                                        <el-button type="primary" class="save-btn">保存</el-button>
                                        <el-button class="cancel-btn">关闭</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PersonCenter',
    data() {
        return {
            activeTab: 'basic',
            basicForm: {
                username: sessionStorage.getItem('userName'),
                phone: '12452627262',
                gender: 'female',
                userType: sessionStorage.getItem('roleName'),
            },
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },

        }
    },

    mounted() {

    },
    methods: {

        handleTabClick(tab) {
            this.activeTab = tab.name;
        }
    }
}
</script>

<style scoped>
.person-center {
    background-color: #f5f5f5;
    min-height: 100vh;
    padding: 20px;
}

.container {
    display: flex;
    margin: 0 auto;
    gap: 20px;
}

.left-panel {
    width: 400px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    height: fit-content;
}

.profile-section {
    text-align: center;
}

.avatar-container {
    margin-bottom: 30px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
    border-bottom: none;
}

.info-label {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 14px;
}

.info-label i {
    margin-right: 8px;
    font-size: 16px;
}

.info-value {
    color: #333;
    font-size: 14px;
    font-weight: 500;
}

.right-panel {
    width: 600px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    padding-bottom: 0;
    padding-top: 18px;
}

.right-panels {
    width: 600px;
    height: 402px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    padding-bottom: 0;
    padding-top: 18px;
}

.panel-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f0f0f0;
}

.panel-header h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
    font-weight: 500;
}

.tab-container {
    margin-top: 20px;
}

.form-container {
    padding: 20px 0;
}

.basic-form,
.password-form {
    max-width: 500px;
}

.save-btn {
    background-color: #20b2aa;
    border-color: #20b2aa;
    padding: 8px 20px;
}

.save-btn:hover {
    background-color: #1a9a92;
    border-color: #1a9a92;
}

.cancel-btn {
    background-color: #f0ad4e;
    border-color: #f0ad4e;
    color: white;
    padding: 8px 20px;
    margin-left: 10px;
}

.cancel-btn:hover {
    background-color: #ec971f;
    border-color: #ec971f;
}

/* Element UI 样式覆盖 */
::v-deep .el-tabs__active-bar {
    background-color: #20b2aa;
}

::v-deep .el-tabs__item.is-active {
    color: #20b2aa;
}

::v-deep .el-tabs__item:hover {
    color: #20b2aa;
}

::v-deep .el-radio__input.is-checked .el-radio__inner {
    background-color: #20b2aa;
    border-color: #20b2aa;
}

::v-deep .el-radio__input.is-checked+.el-radio__label {
    color: #20b2aa;
}

::v-deep .el-form-item {
    margin-bottom: 15px;
}
</style>
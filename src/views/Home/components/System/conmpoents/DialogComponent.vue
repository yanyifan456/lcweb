<template>
    <div>
        <el-dialog :title="title" :visible.sync="internalVisible" :width="width" :before-close="handleClose"
            custom-class="custom-dialog-container">
            <template #title>
                <div class="dialog-title">{{ title }}</div>
            </template>

            <div class="dialog-content-container">
                <div class="dialog-content">
                    <slot name="content"></slot>
                </div>

                <div class="dialog-button-bar">
                    <el-button class="buttoni" size="medium" @click="handleCancel">取 消</el-button>
                    <el-button class="buttons" type="primary" size="medium" @click="handleConfirm">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'Dialogdle',
    props: {
        title: String,
        width: {
            type: String,
            default: '800px'
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            internalVisible: this.value
        }
    },
    watch: {
        value(newVal) {
            this.internalVisible = newVal
        },
        internalVisible(newVal) {
            this.$emit('input', newVal)
        }
    },
    methods: {
        handleClose(done) {
            this.handleCancel()
            done()
        },
        handleConfirm() {
            this.$emit('confirm')
            this.internalVisible = false
        },
        handleCancel() {
            this.$emit('cancel')
            this.internalVisible = false
        }
    }
}
</script>

<style scoped>
/* 原有按钮样式保持不变 */
.buttoni {
    width: 120px;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #089BAB;
    color: #089BAB;
}

.buttons {
    width: 120px;
    height: 40px;
    background: linear-gradient(231deg, #16C0C0 0%, #089BAB 100%);
    border-radius: 10px 10px 10px 10px;
    color: #fff;
}

.dialog-title {
    width: 780px;
    height: 80px;
    background: #FFFFFF;
    border-radius: 20px 20px 20px 20px;
    font-family: PingFang SC Regular, PingFang SC Regular;
    font-weight: 400;
    font-size: 18px;
    color: #121A2D;
    line-height: 80px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    text-align: center;
    border-bottom: 1px solid #F0F2F7;
}

.dialog-title .el-dialog__headerbtn {
    font-size: 30px;
    line-height: 80px;
}

.dialog-button-bar {
    margin: auto;
    margin-bottom: 20px;
}

/* 内容区域高度自适应 */
.dialog-content-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.dialog-content {
    flex: 1;
    overflow: auto;
    padding: 0 10px;
}
</style>

<style>
/* 全局样式 - 对话框容器 */
.custom-dialog-container {
    width: 800px !important;
    height: 824px !important;
    background: #FFFFFF !important;
    border-radius: 20px !important;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

/* 对话框内容区域 */
.custom-dialog-container .el-dialog__body {
    flex: 1;
    padding: 0;
    overflow: hidden;
}
</style>
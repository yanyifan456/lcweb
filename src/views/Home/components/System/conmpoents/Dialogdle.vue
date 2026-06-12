<template>
    <div>
        <el-dialog style="border-radius: 20px 20px 20px 20px;" :title="title" :visible.sync="internalVisible"
            :width="width" :before-close="handleClose">
            <template #title>
                <div class="dialog-title">{{ title }}</div>
            </template>

            <div class="dialog-content-container">

                请再次确认是否删除此机构？

            </div>
            <div class="dialog-button-bar">
                <el-button class="buttoni" size="medium" @click="handleCancel">取 消</el-button>
                <el-button class="buttons" type="primary" size="medium" @click="handleConfirm">确 定</el-button>
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
            default: '600px'
        },
        // Vue 2 需要这样写value接收
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
            this.$emit('input', newVal) // Vue 2使用input事件
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
/* 保持原有样式不变 */
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

.custom-dialog {

    height: 280px;
    background: #FFFFFF;
    border-radius: 20px !important;
}

.el-dialog {
    width: 600px;
    height: 280px;
    background: #FFFFFF;
    border-radius: 20px 20px 20px 20px;
}

.dialog-title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;

}

.dialog-content-container {
    display: flex;
    flex-direction: column;
    height: 180px;
    padding: 0 20px;
    text-align: center;
    line-height: 180px;

}

.dialog-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
}

.dialog-button-bar {

    text-align: right;
    background: #fff;
    position: sticky;
    bottom: 0;
    margin: auto;
    margin-top: 30px;
    text-align: center;
}

.el-dialog__body {
    height: 280px;
}

:deep(.custom-dialog .el-dialog__header) {
    padding: 35px 20px;
    border-bottom: 1px solid #EBEEF5;
}

:deep(.custom-dialog .el-dialog__body) {
    padding: 0;
    height: 280px;
}
</style>
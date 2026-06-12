<template>
    <div>
        <el-dialog :title="title" :visible.sync="internalVisible" :width="width" custom-class="custom-dialog"
            :before-close="handleClose">
            <template #title>
                <div class="dialog-title">{{ title }}</div>
            </template>

            <div class="dialog-content-container">
                <div class="dialog-content">
                    <slot name="content"></slot>
                </div>

                <div class="dialog-button-bar">
                    <el-button size="medium" @click="handleCancel">取 消</el-button>
                    <el-button type="primary" size="medium" @click="handleConfirm">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'DialogComponent',
    props: {
        title: {
            type: String,
            default: '新建'
        },
        visible: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: '800px'
        }
    },
    data() {
        return {
            internalVisible: this.visible
        }
    },
    watch: {
        visible(newVal) {
            this.internalVisible = newVal
        },
        internalVisible(newVal) {
            this.$emit('update:visible', newVal)
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
.custom-dialog {
    height: 824px;
    background: #FFFFFF;
    border-radius: 20px !important;
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
    height: calc(100% - 54px);
    padding: 0 20px;
}

.dialog-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
}

.dialog-button-bar {
    border-top: 1px solid #EBEEF5;
    text-align: right;
    background: #fff;
    position: sticky;
    bottom: 0;
    margin: auto;
    margin-top: 30px;
}

:deep(.custom-dialog .el-dialog__header) {
    padding: 35px 20px;
    border-bottom: 1px solid #EBEEF5;
}

:deep(.custom-dialog .el-dialog__body) {
    padding: 0;
    height: calc(100% - 54px);
}
</style>
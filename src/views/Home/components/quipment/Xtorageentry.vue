<template>
    <div class="device-entry-container">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <div class="title-bar"></div>
                <h2 class="page-title">设备详情</h2>
            </div>
            <div class="header-right">
                <el-button class="back-btn" @click="goBack">
                    <i class="el-icon-back"></i>
                    返回上一级
                </el-button>
            </div>
        </div>

        <!-- 基本信息 -->
        <div class="form-container">
            <el-form :model="deviceForm" label-width="120px">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="硬件版本：">
                            <el-input v-model="deviceForm.hardwareVersion" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备名称：">
                            <el-input v-model="deviceForm.deviceName" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="设备品牌：">
                            <el-input v-model="deviceForm.deviceBrand" disabled />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="设备类型：">
                            <el-input v-model="deviceForm.deviceType" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="设备供应商：">
                            <el-input v-model="deviceForm.deviceSupplier" disabled />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="设备型号：">
                            <el-input v-model="deviceForm.deviceModel" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="批次号：">
                            <el-input v-model="deviceForm.batchNumber" disabled />
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="入库数量：">
                            <el-input v-model="deviceForm.quantity" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <!-- 设备属性 -->
        <div class="section-container">
            <div class="section-header">
                <div class="title-bar"></div>
                <h3 class="section-title">设备属性</h3>
            </div>
            <div class="table-container">
                <el-table :data="deviceProperties" border style="width: 100%"
                    :header-cell-style="{ background: '#f8f9fa', color: '#333' }">
                    <el-table-column prop="serialNumber" label="序号" width="80" align="center" />

                    <el-table-column prop="deviceNumber" label="设备编号" align="center" />

                    <el-table-column prop="sn" label="SN" align="center" />

                    <el-table-column v-if="deviceForm.deviceName === 'AI智能医疗检测仪'" prop="macAddress" label="MAC地址"
                        align="center" />
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DeviceDetail',
    data() {
        return {
            deviceForm: {
                deviceName: '',
                deviceType: '',
                deviceBrand: '',
                deviceModel: '',
                deviceSupplier: '',
                quantity: 0,
                batchNumber: '',
                hardwareVersion: ''
            },
            deviceProperties: []
        }
    },
    mounted() {
        if (this.$route.query.rowData) {
            const rowData = JSON.parse(this.$route.query.rowData)
            this.deviceForm = {
                deviceName: rowData.deviceName || '',
                deviceType: rowData.deviceType || '',
                deviceBrand: rowData.deviceBrand || '',
                deviceModel: rowData.deviceModel || '',
                deviceSupplier: rowData.deviceSupplier || '',
                quantity: rowData.quantity || 1,
                batchNumber: rowData.batchNumber || '',
                hardwareVersion: rowData.hardwareVersion || '',
                macAddress: rowData.macAddress || ''
            }

            this.deviceProperties = [
                {
                    serialNumber: 1,
                    deviceNumber: rowData.deviceId || '',
                    sn: rowData.deviceSn || '',
                    mac: rowData.mac || '',
                    macAddress: rowData.macAddress || ''
                }
            ]
        }
    },
    methods: {
        goBack() {
            this.$router.go(-1)
        }
    }
}
</script>

<style scoped>
/* 保持原有无边框样式 */
.table-input /deep/ .el-input__inner {
    border: none !important;
    text-align: center;
    transition: background-color 0.3s;
    /* 添加过渡动画 */
}

.el-table /deep/ .el-table__body tr:hover>td {
    background-color: transparent !important;
}

/* 移除固定列的悬停背景色 */
.el-table /deep/ .el-table__fixed .el-table__body tr:hover>td {
    background-color: transparent !important;
}

/* 移除固定列右侧阴影（可选） */
.el-table /deep/ .el-table__fixed-right::before,
.el-table /deep/ .el-table__fixed::before {
    height: 0 !important;
}

/* 移除当前行高亮（如果需要） */
.el-table /deep/ .el-table__body tr.current-row>td {
    background-color: transparent !important;
}

.device-entry-container {
    padding: 20px;
    background-color: #f0f2f5;

}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.header-left {
    display: flex;
    align-items: center;
}

.title-bar {
    width: 4px;
    height: 24px;
    background: #089BAB;
    border-radius: 10px;
    margin-right: 10px;
}

.page-title {
    font-size: 18px;
    font-weight: 500;
    color: #121A2D;
    margin: 0;
}

.back-btn {
    background: #f0f0f0;
    border: 1px solid #ddd;
    color: #666;
    border-radius: 6px;
    padding: 8px 16px;
}

.back-btn:hover {
    background: #e0e0e0;
    border-color: #ccc;
}

.form-container {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    /* Added subtle shadow */
}

.section-container {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    /* Added subtle shadow */
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.section-title {
    font-size: 16px;
    font-weight: 500;
    color: #121A2D;
    margin: 0;
}

.section-actions {
    margin-left: auto;
    display: flex;
    gap: 10px;
}

.add-btn {
    background-color: #089BAB;
    border-color: #089BAB;
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 6px;
}

.delete-btn {
    background: #E1E6E6;
    border-color: #E1E6E6;
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 6px;
    color: #666;
    /* Ensure text color is visible */
}

.table-container {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    overflow: hidden;
}

.required-mark {
    color: #f56c6c;
    margin-right: 4px;
}

.empty-state {
    text-align: center;
    padding: 40px;
    color: #999;
}

/* 表单样式调整 */
.el-form-item .el-form-item__label {
    color: #333;
    font-weight: 400;
}

.el-form-item .el-form-item__label::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}

.el-input .el-input__inner,
.el-select .el-input__inner {
    border: 1px solid rgba(8, 155, 171, 0.4);
    border-radius: 8px;
    height: 40px;
}

.el-input .el-input__inner:focus,
.el-select .el-input__inner:focus {
    border-color: #089BAB;
}

.el-table .el-table__header-wrapper {
    border-radius: 8px 8px 0 0;
}

.el-table .el-table__body-wrapper {
    border-radius: 0 0 8px 8px;
}
</style>

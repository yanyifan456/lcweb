<template>
    <div class="device-entry-container">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <div class="title-bar"></div>
                <h2 class="page-title">入库设备</h2>
            </div>
            <div class="header-right">
                <el-button class="back-btn" @click="goBack">
                    <i class="el-icon-back"></i>
                    返回上一级
                </el-button>
            </div>
        </div>
        <!-- 主表单区域 -->
        <div class="form-container">
            <el-form :model="deviceForm" :rules="rules" ref="deviceForm" label-width="120px">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="设备名称：" prop="deviceName" required>
                            <el-select v-model="deviceForm.deviceName" placeholder="请选择" style="width: 100%" clearable
                                @change="handleDeviceNameChange">
                                <el-option v-for="(name, index) in deviceNameOptions" :key="index" :label="name"
                                    :value="name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备类型：" prop="deviceType" required>
                            <el-input v-model="deviceForm.deviceType" placeholder="请先选择设备名称" readonly disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="设备品牌：" prop="deviceBrand" required>
                            <el-input v-model="deviceForm.deviceBrand" placeholder="请先选择设备品牌" readonly disabled>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备型号：" prop="deviceModel" required>
                            <el-select v-model="deviceForm.deviceModel" placeholder="请选择" style="width: 100%" clearable
                                :disabled="!deviceForm.deviceName">
                                <el-option v-for="item in devicexinghao" :key="item.typeId" :label="item.typeName"
                                    :value="item.typeName" />
                            </el-select>
                        </el-form-item>

                    </el-col>
                </el-row>

                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="设备供应商：" prop="deviceSupplier" required>
                            <el-input v-model="deviceForm.deviceSupplier" placeholder="请输入" clearable
                                :disabled="!deviceForm.deviceName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入库数量：">
                            <el-input v-model="deviceForm.quantity" placeholder="自动计算" readonly disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <!-- 设备属性区域 -->
        <div class="section-container">
            <div class="section-header">
                <div class="title-bar"></div>
                <h3 class="section-title">设备属性</h3>
                <div class="section-actions">
                    <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="addDeviceProperty"
                        :disabled="!deviceForm.deviceName">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" class="delete-btn" @click="deleteDeviceProperty"
                        :disabled="!deviceForm.deviceName || selectedProperties.length === 0">
                    </el-button>
                </div>
            </div>

            <div class="table-container">
                <el-table :data="deviceProperties" style="width: 100%" border
                    :header-cell-style="{ background: '#f8f9fa', color: '#333', fontWeight: '500' }"
                    @selection-change="handlePropertySelectionChange" :disabled="!deviceForm.deviceName">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="serialNumber" label="序号" width="100" align="center"></el-table-column>

                    <el-table-column label="设备编号" prop="deviceNumber" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.deviceNumber" class="table-input" placeholder="请输入"
                                size="small" :disabled="!deviceForm.deviceName">
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column label="SN" prop="sn" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.sn" class="table-input" placeholder="请输入" size="small"
                                :disabled="!deviceForm.deviceName">
                            </el-input>
                        </template>
                    </el-table-column>

                    <el-table-column v-if="deviceForm.deviceName === 'AI智能医疗检测仪'" label="MAC地址" prop="mac"
                        align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.mac" class="table-input" placeholder="请输入MAC地址" size="small"
                                :disabled="deviceForm.deviceName !== 'AI智能医疗检测仪'">
                            </el-input>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div style="width: 100%;display: flex;justify-content: center;margin-top: 30px;">
            <button @click="goquxiao" style="
                    width: 120px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid #089BAB;
                    background-color: #fff;
                    color: #089BAB;
                    margin-right: 30px;
                    cursor: pointer;
                ">
                取消
            </button>
            <button style="
                    width: 120px;
                    height: 40px;
                    background: linear-gradient(231deg, #16C0C0 0%, #089BAB 100%);
                    border-radius: 10px;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                " @click="submitForm">
                确定
            </button>
        </div>
    </div>
</template>

<script>
import { getLinkage, addgetlist, selectdevicetype } from '../../../../api/Equipmentstorage.js'
export default {
    name: 'DeviceEntry',
    data() {
        return {
            deviceForm: {
                deviceName: '',
                deviceType: '',
                deviceBrand: '',
                deviceModel: '',
                deviceSupplier: '',
                quantity: 1,
                batchNumber: '172877777777',
                hardwareVersion: '',
                macAddress: ""
            },
            devicexinghao: [],
            deviceNameOptions: [],
            rules: {
                deviceName: [{ required: true, message: '请选择设备名称', trigger: 'change' }],
                deviceType: [{ required: true, message: '设备类型不能为空', trigger: 'change' }],
                deviceBrand: [{ required: true, message: '设备品牌不能为空', trigger: 'change' }],
                deviceModel: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
                deviceSupplier: [{ required: true, message: '请输入设备供应商', trigger: 'blur' }],
                hardwareVersion: [{ required: true, message: '请输入硬件版本', trigger: 'blur' }]
            },
            deviceProperties: [
                { serialNumber: 1, deviceNumber: '', sn: '', mac: '' }
            ],
            selectedProperties: [],
            typeAndBrandLoading: false
        }
    },
    watch: {
        deviceProperties: {
            handler(newVal) {
                this.deviceForm.quantity = newVal.length;
            },
            deep: true
        }
    },
    created() {
        this.getLinkageOptions();
        this.xinghao();
    },
    methods: {
        async xinghao() {
            const res = await selectdevicetype({
                pageSize: 10,
                pageNum: 1
            });
            if (res.code === "200") {
                this.devicexinghao = res.data.records;
            } else {
                this.$message.error('获取设备名称失败');
            }
        },
        handleDeviceNameChange(value) {
            if (!value) {
                this.resetFormFields();
                return;
            }
            this.getTypeAndBrandByDevice(value);
        },
        getTypeAndBrandByDevice(deviceName) {
            this.typeAndBrandLoading = true;
            getLinkage({ deviceName }).then(res => {
                if (res.code === "200") {
                    this.deviceForm.deviceType = res.data.typeName?.[0] || '未知类型';
                    this.deviceForm.deviceBrand = res.data.deviceBrand?.[0] || '未知品牌';
                } else {
                    this.$message.error('获取设备类型和品牌失败');
                    this.deviceForm.deviceType = '获取失败';
                    this.deviceForm.deviceBrand = '获取失败';
                }
            }).catch(() => {
                this.$message.error('获取设备类型和品牌失败');
                this.deviceForm.deviceType = '请求失败';
                this.deviceForm.deviceBrand = '请求失败';
            }).finally(() => {
                this.typeAndBrandLoading = false;
            });
        },
        getLinkageOptions() {
            getLinkage({}).then(res => {
                if (res.code === "200") {
                    this.deviceNameOptions = Array.isArray(res.data.deviceName) ? res.data.deviceName
                        : res.data.deviceName ? [res.data.deviceName] : [];
                } else {
                    this.$message.error('获取设备名称选项失败');
                    this.deviceNameOptions = ['智能手表', '智能手机', '平板电脑', 'AI智能医疗检测仪'];
                }
            }).catch(() => {
                this.$message.error('获取设备名称选项失败');
                this.deviceNameOptions = ['智能手表', '智能手机', '平板电脑', 'AI智能医疗检测仪'];
            });
        },
        addDeviceProperty() {
            const newProperty = {
                serialNumber: this.deviceProperties.length + 1,
                deviceNumber: '',
                sn: '',
                mac: ''
            };
            this.deviceProperties.push(newProperty);
        },
        deleteDeviceProperty() {
            if (!this.selectedProperties.length) {
                this.$message.warning('请选择要删除的设备属性');
                return;
            }
            const indexes = this.selectedProperties
                .map(item => this.deviceProperties.findIndex(prop => prop.serialNumber === item.serialNumber))
                .sort((a, b) => b - a);

            indexes.forEach(index => {
                if (index > -1) this.deviceProperties.splice(index, 1);
            });

            this.deviceProperties.forEach((item, index) => item.serialNumber = index + 1);
            this.selectedProperties = [];
            this.$message.success('删除成功');
        },
        handlePropertySelectionChange(selection) {
            this.selectedProperties = selection;
        },
        goBack() {
            this.$router.go(-1);
        },
        goquxiao() {
            this.$router.go(-1);
        },
        generateBatchId() {
            const date = new Date();
            const pad = (n) => String(n).padStart(2, '0');
            const randomNum = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
            return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}${randomNum}`;
        },
        submitForm() {
            this.$refs.deviceForm.validate(valid => {
                if (!valid) {
                    this.$message.error('请完善必填信息');
                    return;
                }
                if (!this.deviceProperties.length) {
                    this.$message.error('请至少添加一条设备属性');
                    return;
                }
                const invalid = this.deviceProperties.filter(p => !p.deviceNumber || !p.sn || (this.deviceForm.deviceName === 'AI智能医疗检测仪' && !p.mac));
                if (invalid.length) {
                    this.$message.error('请填写完整的设备编号、SN和MAC');
                    return;
                }

                const requestData = {
                    batchId: this.generateBatchId(),
                    deviceName: this.deviceForm.deviceName,
                    deviceSupply: this.deviceForm.deviceSupplier,
                    deviceVesion: this.deviceForm.hardwareVersion,
                    createBy: sessionStorage.getItem('userName'),
                    stockType: '1',
                    deviceModel: this.deviceForm.deviceModel,
                    deviceIds: this.deviceProperties.map(p => ({
                        deviceId: p.deviceNumber,
                        deviceSn: p.sn,
                        macAddress: p.mac,

                    }))
                };

                addgetlist(requestData).then(res => {
                    if (res.code === '200') {
                        this.$message.success(res.msg || '设备入库成功');
                        this.$router.go(-1);
                    } else {
                        this.$message.error(res.msg || '提交失败');
                    }
                }).catch(() => {
                    this.$message.error('提交失败，请重试');
                });
            });
        },
        resetFormFields() {
            this.deviceForm.deviceType = '';
            this.deviceForm.deviceBrand = '';
            this.deviceForm.deviceModel = '';
            this.deviceForm.deviceSupplier = '';
            this.deviceForm.hardwareVersion = '';
            this.deviceProperties = [{ serialNumber: 1, deviceNumber: '', sn: '', mac: '' }];
        }
    }
}
</script>

<style scoped>
/* 新增对话框标题栏样式 */
.dialog-header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    position: relative;
    background-color: #fff;
    border-bottom: 1px solid #CCC;
}

.dialog-title {
    font-size: 16px;
    font-weight: 500;
    color: black;
}

.close-icon {
    font-size: 25px;
    cursor: pointer;
    color: black;
}

/* 调整内容区域高度 */
.delete-confirm-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    padding: 0 20px;
}

.warning-icon {
    font-size: 24px;
    color: #E6A23C;
    margin-right: 15px;
}

.confirm-text {
    font-size: 16px;
    font-weight: 500;
    color: #121A2D;
}

.dialog-footer {
    display: flex;
    justify-content: center;
    padding: 10px 20px 20px;
}

.cancel-btn {
    width: 120px;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
    border: 1px solid #888C96;
}

.confirm-btn {
    width: 120px;
    height: 40px;
    background: linear-gradient(231deg, #16C0C0 0%, #089BAB 100%);
    border-radius: 10px 10px 10px 10px;
    margin-left: 30px;
    color: white;
    border: none;
}

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
    height: calc(100vh - 250px);
    overflow: auto;
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
}

.section-container {
    background: white;
    border-radius: 20px;
    padding: 30px;
    margin-bottom: 30px;
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
}

.table-container {
    border: 1px solid #ebeef5;
    border-radius: 8px;

    /* Add these two lines below */
    height: auto;
    /* Adjust this value as needed to control visible rows */
    overflow-y: auto;
    /* Enable vertical scrolling when content overflows */
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

/* Styles for disabled inputs */
.el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa !important;
    border-color: #e4e7ed !important;
    color: #c0c4cc !important;
    cursor: not-allowed !important;
}

.el-table .el-table__header-wrapper {
    border-radius: 8px 8px 0 0;
}

.el-table .el-table__body-wrapper {
    border-radius: 0 0 8px 8px;
}
</style>
<style>
/* 全局样式用于自定义对话框 */
.custom-dialog {
    border-radius: 20px !important;
    overflow: hidden;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    margin: 0 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.custom-dialog .el-dialog__header {
    padding: 0 !important;
    background: linear-gradient(231deg, #16C0C0 0%, #089BAB 100%);
    color: white;
    border-radius: 20px 20px 0 0;
}

.custom-dialog .el-dialog__body {
    padding: 0 !important;
}

.custom-dialog .el-dialog__footer {
    padding: 0 !important;
}
</style>

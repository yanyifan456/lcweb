<template>
    <div class="device-entry-container">
        <!-- 页面头部 -->
        <div class="page-header">
            <div class="header-left">
                <div class="title-bar"></div>
                <h2 class="page-title">入库编辑</h2>
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
            <el-form :model="deviceForm" ref="deviceForm" label-width="120px">
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="设备名称：">
                            <el-input v-model="deviceForm.deviceName" placeholder="请输入设备名称" readonly
                                disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备类型：">
                            <el-input v-model="deviceForm.deviceType" placeholder="请输入设备类型" readonly
                                disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="设备品牌：">
                            <el-input v-model="deviceForm.deviceBrand" placeholder="请输入设备品牌" readonly
                                disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="设备型号：">
                            <el-input v-model="deviceForm.deviceModel" placeholder="请输入设备型号" readonly
                                disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="设备供应商：">
                            <el-input v-model="deviceForm.deviceSupplier" placeholder="请输入设备供应商" readonly
                                disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="入库数量：">
                            <el-input v-model="deviceForm.quantity" placeholder="请输入,最少为1" readonly disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span="12">
                        <el-form-item label="硬件版本：">
                            <el-input v-model="deviceForm.hardwareVersion" placeholder="请输入硬件版本" readonly
                                disabled></el-input>
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
                    <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="addDeviceProperty">
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" class="delete-btn" @click="deleteDeviceProperty">
                    </el-button>
                </div>
            </div>
            <div class="table-container">
                <el-table :data="deviceProperties" style="width: 100%" border
                    :header-cell-style="{ background: '#f8f9fa', color: '#333', fontWeight: '500' }"
                    @selection-change="handlePropertySelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="serialNumber" label="序号" width="100" align="center"></el-table-column>
                    <el-table-column label="设备编号" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.deviceNumber" class="table-input" placeholder="请输入"
                                size="small">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="SN" align="center">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.sn" class="table-input" placeholder="请输入" size="small">
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 修改后的确认删除弹窗 -->
        <el-dialog :visible="deleteConfirmVisible" width="600px" :show-close="false" custom-class="custom-dialog"
            :modal="true" center>
            <!-- 添加标题栏 -->
            <div class="dialog-header" slot="title">
                <span class="dialog-title">删除设备编号</span>
                <i class="el-icon-close close-icon" @click="deleteConfirmVisible = false"></i>
            </div>
            <div class="delete-confirm-content">
                <i class="el-icon-warning warning-icon"></i>
                <span class="confirm-text">请在次确认是否删除选中的设备编号！</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteConfirmVisible = false" class="cancel-btn">取消</el-button>
                <el-button type="primary" @click="confirmDelete" class="confirm-btn">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible="deleteConfirmVisibles" width="600px" :show-close="false" custom-class="custom-dialog"
            :modal="true" center>
            <!-- 添加标题栏 -->
            <div class="dialog-header" slot="title">
                <span class="dialog-title">删除设备编号</span>
                <i class="el-icon-close close-icon"></i>
            </div>
            <div class="delete-confirm-content">
                <i class="el-icon-warning warning-icon"></i>
                <span class="confirm-text">当前有设备编号已出库，无法删除!</span>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="deleteConfirmVisibles = false" class="cancel-btn">取消</el-button>
                <el-button type="primary" @click="deleteConfirmVisibles = false" class="confirm-btn">确定</el-button>
            </div>
        </el-dialog>
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
import { getlistb, getlistbj, getLinkage, getdelets } from '../../../../api/Equipmentstorage.js'
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
                quantity: '',
                batchNumber: '',
                hardwareVersion: ''
            },
            rules: {}, // Rules are no longer needed for disabled fields
            deviceProperties: [
                {
                    serialNumber: 1,
                    deviceNumber: '',
                    sn: '',
                    stockId: null // Added stockId to store it from initial fetch
                }
            ],
            projectDetections: [],
            selectedProperties: [],
            deleteConfirmVisible: false,
            deleteConfirmVisibles: false,
        }
    },
    methods: {
        async getlist() {
            const batchId = this.$router.history.current.query.bachid;
            const params = {
                batchId: batchId
            }
            try {
                const res = await getlistb(params);
                if (res.code === "200" && res.data) {
                    // Map API response to deviceForm
                    this.deviceForm.deviceName = res.data.deviceName || '';
                    this.deviceForm.deviceModel = res.data.deviceModel || '';
                    this.deviceForm.deviceSupplier = res.data.deviceSupply || '';
                    this.deviceForm.hardwareVersion = res.data.deviceVesion || '';
                    this.deviceForm.batchNumber = res.data.batchId || '';

                    // Fetch deviceType and deviceBrand using getLinkage
                    if (this.deviceForm.deviceName) {
                        const linkageRes = await getLinkage({ deviceName: this.deviceForm.deviceName });
                        if (linkageRes.code === "200" && linkageRes.data) {
                            this.deviceForm.deviceType = linkageRes.data.typeName?.[0] || '';
                            this.deviceForm.deviceBrand = linkageRes.data.deviceBrand?.[0] || '';
                        } else {
                            console.warn('Failed to fetch device type and brand from getLinkage:', linkageRes.msg);
                        }
                    }

                    // Populate deviceProperties table
                    if (res.data.deviceIds && Array.isArray(res.data.deviceIds)) {
                        this.deviceProperties = res.data.deviceIds.map((item, index) => ({
                            serialNumber: index + 1,
                            deviceNumber: item.deviceId,
                            sn: item.deviceSn,
                            stockId: item.stockId || null // Store stockId
                        }));
                        this.deviceForm.quantity = this.deviceProperties.length; // Set quantity based on deviceIds length
                    } else {
                        this.deviceProperties = []; // Clear if no deviceIds
                        this.deviceForm.quantity = 0;
                    }

                } else {
                    this.$message.error(res.msg || '获取数据失败');
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                this.$message.error('获取数据失败，请检查网络或服务器');
            }
        },
        goBack() {
            this.$router.go(-1)
        },
        addDeviceProperty() {
            const newProperty = {
                serialNumber: this.deviceProperties.length + 1,
                deviceNumber: '',
                sn: '',
                stockId: '' // Initialize stockId for new entries
            }
            this.deviceProperties.push(newProperty)
        },
        deleteDeviceProperty() {
            if (this.selectedProperties.length === 0) {
                this.$message.warning('请选择要删除的设备属性');
                return;
            }
            this.deleteConfirmVisible = true;
        },
        goquxiao() {
            this.$router.go(-1);
        },
        async confirmDelete() {
            try {
                // 1. 收集需要删除的stockIds
                const stockIds = this.selectedProperties.map(item => item.stockId);

                // 2. 构造请求参数
                const params = {
                    batchId: this.deviceForm.batchNumber, // 从表单数据获取批次号
                    stockIds: stockIds.filter(Boolean) // 过滤掉可能存在的空值
                };

                // 3. 调用删除接口
                const res = await getdelets(params);

                if (res.code === "200") {
                    if (res.data.undeletableList.length === 0) {
                        this.$message.success('删除成功');

                        // 4. 前端删除对应行（两种方式任选其一）
                        // 方式一：直接过滤已删除项
                        this.deviceProperties = this.deviceProperties.filter(
                            item => !this.selectedProperties.some(selected => selected.serialNumber === item.serialNumber)
                        );

                        // 方式二：重新加载数据（推荐，保持数据一致性）
                        // await this.getlist();

                        // 5. 重置选中状态
                        this.selectedProperties = [];
                        this.deleteConfirmVisible = false;

                        // 6. 重新计算序号
                        this.deviceProperties.forEach((item, index) => {
                            item.serialNumber = index + 1;
                        });
                    } else {
                        this.deleteConfirmVisible = false;
                        this.deleteConfirmVisibles = true
                    }

                } else {
                    this.$message.error(res.msg || '删除失败');
                }
            } catch (error) {
                console.error('删除失败:', error);
                this.$message.error('删除失败，请检查网络或服务器');
            }
        },
        handlePropertySelectionChange(selection) {
            this.selectedProperties = selection
        },
        async submitForm() {
            // Only validate the deviceProperties as the main form fields are now readonly/disabled.
            const invalidProperties = this.deviceProperties.filter(prop => !prop.deviceNumber || !prop.sn);
            if (invalidProperties.length > 0) {
                this.$message.error('设备编号和SN不能为空');
                return;
            }

            // Dynamically generate createTime
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const createTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

            const payload = {
                deviceName: this.deviceForm.deviceName,
                deviceSupply: this.deviceForm.deviceSupplier,
                batchId: this.deviceForm.batchNumber,
                deviceVesion: this.deviceForm.hardwareVersion,
                createBy: "admin002", // Hardcoded as per example
                createTime: createTime, // Dynamically generated
                stockType: "1", // Hardcoded as per example
                deviceModel: this.deviceForm.deviceModel,
                deviceIds: this.deviceProperties.map(prop => ({
                    stockId: prop.stockId, // Include stockId
                    deviceId: prop.deviceNumber,
                    deviceSn: prop.sn
                }))
            };
            try {
                const res = await getlistbj(payload);
                if (res.code === "200") {
                    this.$message.success('提交成功');
                    // Optionally navigate back or refresh data after successful submission
                    // this.$router.go(-1);
                } else {
                    this.$message.error(res.msg || '提交失败');
                }
            } catch (error) {
                console.error('提交失败:', error);
                this.$message.error('提交失败，请检查网络或服务器');
            }
        }
    },
    created() {
        this.getlist()
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

/* Removed the required asterisk for disabled fields */
/* .el-form-item .el-form-item__label::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
} */

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

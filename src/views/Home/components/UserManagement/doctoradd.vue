<template>
    <div class="boxbig" ref="container">
        <!-- 筛选查询区域 -->
        <div style="width: 500px;height: 30px;display: flex;">
            <div class="box-a"></div>
            <div class="box-b">筛选查询</div>
        </div>
        <div class="box-c">
            <!-- 第一行：机构选择 -->
            <div class="filter-row">

                <div class="filter-item">
                    <span class="filter-label">医生名称：</span>
                    <el-input v-model="filterForm.deviceName" placeholder="请输入" class="filter-input"></el-input>
                </div>
                <div class="filter-item">
                    <span class="filter-label">电话号码</span>
                    <el-input v-model="filterForm.warehouseNumber" placeholder="请输入" class="filter-input"></el-input>
                </div>
                <div class="filter-item">
                    <span class="filter-label">服务类型：</span>
                    <el-select v-model="filterForm.batchNumber" placeholder="请选择医生职称" style="width: 100%">
                        <el-option v-for="item in doctorTitleList" :key="item.value" :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="filter-buttons">
                    <el-button class="reset-btn" @click="handleReset">重置</el-button>
                    <el-button class="query-btn" @click="handleQuery">查询</el-button>
                </div>
            </div>
        </div>
        <!-- 增值服务标题和操作按钮 -->
        <div style="width: 100%;height: 40px;display: flex;margin-top: 30px;justify-content: space-between;">
            <div style="display: flex;">
                <div class="box-aa"></div>
                <div class="box-cc">医生资质审核</div>
            </div>
            <div style="display: flex;">
                <el-button class="add-btn"
                    v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                    @click="handleAdd" icon="el-icon-plus">新增</el-button>
            </div>
        </div>
        <!-- 数据表格 -->
        <el-table :data="tabedata" border style="width: 100%;border-radius: 20px 20px 0px 0px;margin-top: 30px;"
            :header-cell-style="{
                height: '60px',
                background: 'rgba(136, 140, 150, 0.07)',
                borderRadius: '0px 0px 0px 0px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333'
            }" :cell-style="{ fontSize: '14px', color: '#666' }" :row-style="{ height: '60px' }">

            <el-table-column type="index" label="序号" width="80px" align="center" :index="getIndex">
            </el-table-column>
            <el-table-column prop="doctorId" label="医生ID" align="center">
            </el-table-column>
            <el-table-column prop="doctorName" label="医生名称" align="center">
            </el-table-column>
            <el-table-column prop="doctorQuality" label="医生资质" align="center">
            </el-table-column>
            <el-table-column prop="telPhone" label="电话号码" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="doctorProfession" label="医生职称" align="center">
            </el-table-column>
            <el-table-column prop="price" label="问诊费用" align="center">
            </el-table-column>
            <el-table-column prop="checkTag" label="审核状态" align="center">
                <template slot-scope="scope">
                    <!-- 状态标签样式 -->
                    <el-tag :type="statusTagType[scope.row.checkTag]" effect="dark"
                        style="width: 80px; text-align: center;">
                        {{ statusText[scope.row.checkTag] }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                class="aasd" fixed="right" style="margin-top: 0;" label=" 操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="action-btn edit-btn"
                        @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <div style="display: flex;float: right;margin-top: 30px;align-items: center;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
                </el-pagination>
            </div>
        </div>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px" class="service-dialog">
            <el-form :model="serviceForm" :rules="serviceRules" ref="serviceForm" label-width="135px">
                <el-form-item label="医生名称" prop="serviceType">
                    <!-- 编辑时禁用医生名称字段 -->
                    <el-input v-model="serviceForm.serviceType" placeholder="请输入医生名称" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="医生手机号" prop="serviceName">
                    <!-- 编辑时禁用医生手机号字段 -->
                    <el-input v-model="serviceForm.serviceName" placeholder="请输入医生手机号" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="医生资质证书编号" prop="serviceDetail">
                    <!-- 编辑时禁用医生资质字段，修正字段映射 -->
                    <el-input v-model="serviceForm.serviceDetail" placeholder="请输入医生资质证书编号"
                        :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item label="医生职称" prop="serviceUnit">
                    <!-- 改为下拉框选择医生职称 -->
                    <el-select v-model="serviceForm.serviceUnit" placeholder="请选择医生职称" style="width: 100%">
                        <el-option v-for="item in doctorTitleList" :key="item.value" :label="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问诊费用" prop="servicePrice">
                    <!-- 修正字段映射 -->
                    <el-input v-model="serviceForm.servicePrice" placeholder="请输入问诊费用"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="dialogVisible = false">取消</el-button>
                <el-button class="confirm-btn" @click="handleSubmit">确定</el-button>
            </div>
        </el-dialog>
        <!-- 删除确认弹出框 -->
        <el-dialog title="删除确认" :visible.sync="deleteDialogVisible" width="700px" class="delete-dialog">
            <div style="text-align: center; padding: 20px;">
                <i class="el-icon-warning" style="font-size: 48px; color: #f56c6c; margin-bottom: 20px;"></i>
                <p style="font-size: 16px; color: #333; margin-bottom: 20px;">确定要删除这个医生吗？</p>
                <p style="font-size: 14px; color: #666;">删除后将无法恢复</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="deleteDialogVisible = false">取消</el-button>
                <el-button class="confirm-btn" @click="confirmDelete">确定删除</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getlist, getaddlist, getdellist, getupdatelist, getunitlist, getyishenglist } from '../../../../api/doctorcheck';
export default {
    name: 'DeviceWarehouse',
    mounted() {
        this.getTableData();
        this.getDoctorTitleList();
    },
    data() {
        return {
            filterForm: {
                deviceName: '',
                warehouseNumber: '',
                batchNumber: '',
                startDate: '',
                endDate: ''
            },
            statusText: {
                0: '待审核',
                1: '审核通过',
                2: '审核未通过'
            },
            statusTagType: {
                0: 'info',    // 蓝色
                1: 'success', // 绿色
                2: 'danger'   // 红色
            },
            tabedata: [],
            pageSize: 10,
            currentPage: 1,
            totalItems: 0,
            selectedOrgId: '',
            unitlist: [],
            // 弹出框相关数据
            dialogVisible: false,
            deleteDialogVisible: false,
            dialogTitle: '新增服务',
            isEdit: false,
            currentEditId: null,
            deleteId: null,
            userauth: sessionStorage.getItem('roleName'),
            // 表单数据 - 添加服务单位字段
            serviceForm: {
                serviceType: '',
                serviceName: '',
                servicePrice: '',
                serviceUnit: '', // 新增服务单位字段
                serviceDetail: '',
                orgId: ''
            },

            doctorTitleList: [],

            // 表单验证规则 - 添加服务单位验证
            serviceRules: {
                serviceType: [
                    { required: true, message: '请输入医生名称', trigger: 'blur' }
                ],
                serviceName: [
                    { required: true, message: '请输入医生手机号', trigger: 'blur' },
                    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
                ],
                serviceUnit: [
                    { required: true, message: '请选择医生职称', trigger: 'change' }
                ],
                serviceDetail: [
                    { required: true, message: '请输入医生资质', trigger: 'blur' }
                ],
                servicePrice: [
                    { required: true, message: '请输入问诊费用', trigger: 'blur' },
                    { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入正确的费用格式', trigger: 'blur' }
                ],
            }
        }
    },
    methods: {
        getIndex(index) {
            return (this.currentPage - 1) * this.pageSize + index + 1;
        },

        //查看
        async getTableData() {
            const params = {
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                doctorName: this.filterForm.deviceName,
                doctorProfession: this.filterForm.batchNumber,
                telPhone: this.filterForm.warehouseNumber,

            }

            try {
                const res = await getlist(params)
                if (res.code === '200' && res.data) {
                    const allData = res.data.records || [];
                    this.tabedata = allData.filter(item => item.status !== "0");
                    this.totalItems = res.data.total || 0;
                }
            } catch (error) {
                console.error('获取数据失败：', error);
                this.$message.error('获取数据失败');
            }
        },
        //单位
        async getunitlist() {
            const res = await getunitlist()

            if (res.code === '200' && res.data) {
                this.unitlist = res.data

            }


        },
        //分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getTableData();
        },

        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableData();
        },

        //重置
        handleReset() {
            this.filterForm.deviceName = ''
            this.filterForm.warehouseNumber = ''
            this.filterForm.batchNumber = ''
            this.tabedata = [];
            this.getTableData()
        },

        //查询
        handleQuery() {

            this.getTableData();

        },

        // 新增服务 - 添加服务单位字段初始化
        handleAdd() {
            this.dialogTitle = '新增医生';
            this.isEdit = false;
            this.currentEditId = null;
            this.serviceForm = {
                serviceType: '',
                serviceName: '',
                servicePrice: '',
                serviceUnit: '',
                serviceDetail: '',
                orgId: this.selectedOrgId
            };
            this.dialogVisible = true;
        },

        handleEdit(row) {
            this.dialogTitle = '编辑医生';
            this.isEdit = true;
            this.currentEditId = row.doctorId;

            this.serviceForm = {
                serviceType: row.doctorName || '',        // 医生名称
                serviceName: row.telPhone || '',          // 医生手机号
                servicePrice: row.price || '',            // 问诊费用
                serviceUnit: row.doctorProfession || '',  // 医生职称
                serviceDetail: row.doctorQuality || '',   // 医生资质
                doctorId: row.doctorId

            };
            this.dialogVisible = true;
        },

        // 删除服务
        handleDelete(row) {
            this.deleteId = row.doctorId;
            this.deleteDialogVisible = true;
        },

        //  确认删除
        async confirmDelete() {
            try {
                const params = {
                    doctorId: this.deleteId
                };

                const res = await getdellist(params);

                if (res.code === '200') {
                    this.$message.success('删除成功');
                    this.deleteDialogVisible = false;
                    this.getTableData(); // 刷新列表
                } else {
                    this.$message.error(res.message || '删除失败');
                }
            } catch (error) {
                console.error('删除失败：', error);
                this.$message.error('删除失败');
            }
        },

        async getDoctorTitleList() {
            try {
                const res = await getyishenglist();
                if (res.code === '200') {
                    this.doctorTitleList = res.data || [];
                }
            } catch (error) {
                console.error('获取医生职称列表失败：', error);
            }
        },

        async handleSubmit() {
            this.$refs.serviceForm.validate(async (valid) => {
                if (valid) {
                    try {
                        const submitData = {

                            doctorProfession: this.serviceForm.serviceUnit,
                            price: this.serviceForm.servicePrice,
                        };
                        const submitDatas = {

                            doctorProfession: this.serviceForm.serviceUnit,
                            price: this.serviceForm.servicePrice,
                            telPhone: this.serviceForm.serviceName,
                            doctorQuality: this.serviceForm.serviceDetail,
                            doctorName: this.serviceForm.serviceType,

                        };

                        if (this.isEdit) {
                            submitData.doctorId = this.currentEditId;
                        }

                        let res;
                        if (this.isEdit) {
                            res = await getupdatelist(submitData);
                        } else {
                            res = await getaddlist(submitDatas);
                        }

                        if (res.code === '200') {
                            if (!this.isEdit) {
                                if (res.data === '未查询到此用户!!') {
                                    this.$message.error('未查询到此用户，请检查用户信息');
                                    return;
                                } else if (res.data === '用户已存在!!') {
                                    this.$message.error('用户已存在，请勿重复添加');
                                    return;
                                } else if (res.data === '添加成功') {
                                    this.$message.success('新增成功');
                                } else {
                                    this.$message.success('新增成功');
                                }
                            } else {
                                this.$message.success('编辑成功');
                            }

                            this.dialogVisible = false;
                            this.getTableData();
                        } else {
                            this.$message.error(res.msg || (this.isEdit ? '编辑失败' : '新增失败'));
                        }
                    } catch (error) {
                        console.error('操作失败：', error);
                        this.$message.error(this.isEdit ? '编辑失败' : '新增失败');
                    }
                }
            });
        }
    }
}
</script>

<style scoped>
/* 新增弹出框样式 */
.service-dialog /deep/ .el-dialog {
    border-radius: 20px !important;
    background: #FFFFFF;
}

.service-dialog /deep/ .el-dialog__header {
    text-align: center;
    padding: 30px 30px 20px;
    border-bottom: 1px solid #f0f0f0;
}

.service-dialog /deep/ .el-dialog__title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.service-dialog /deep/ .el-dialog__body {
    padding: 30px;
}

.delete-dialog /deep/ .el-dialog {
    border-radius: 20px !important;
    background: #FFFFFF;
}

.delete-dialog /deep/ .el-dialog__header {
    text-align: center;
    padding: 30px 30px 20px;
    border-bottom: 1px solid #f0f0f0;
}

.delete-dialog /deep/ .el-dialog__title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

/* 筛选图标样式 */
.filter-icon {
    margin-left: 5px;
    font-size: 14px;
    color: #c0c4cc;
    cursor: pointer;
    transition: color 0.3s;
}

.filter-icon:hover {
    color: #089BAB;
}

.filter-icon.active {
    color: #089BAB;
}

/* 自定义筛选弹出框样式 */
.custom-filter-popover {
    position: fixed;
    z-index: 2000;
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 15px;
    min-width: 200px;
}

.filter-popover-content {
    display: flex;
    flex-direction: column;
}

.el-table /deep/ .el-table__fixed-right::before,
.el-table /deep/ .el-table__fixed::before {
    background-color: transparent !important;
    box-shadow: none !important;
}

.el-table /deep/ .el-table__body tr.current-row>td {
    background-color: transparent !important;
}

.el-table /deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
    background-color: transparent !important;
}

.aasd {
    background-color: transparent !important;
}

.boxbig {
    background-color: #f5f7fa;
    height: 100%;
    overflow: auto;
    position: relative;
    height: calc(100vh - 200px);
}

.box-a {
    width: 4px;
    height: 24px;
    background: #089BAB;
    border-radius: 10px;
    margin-top: 3px;
}

.box-b {
    font-family: PingFang SC Bold, PingFang SC Bold;
    font-weight: 500;
    font-size: 18px;
    color: #121A2D;
    line-height: 30px;
    margin-left: 10px;
}

.box-aa {
    width: 4px;
    height: 24px;
    background: #089BAB;
    border-radius: 10px;
    margin-top: 8px;
}

.box-cc {
    font-family: PingFang SC Bold, PingFang SC Bold;
    font-weight: 500;
    font-size: 18px;
    color: #121A2D;
    line-height: 40px;
    margin-left: 10px;
}

.box-c {
    width: 100%;
    background: #FFFFFF;
    border-radius: 20px;
    margin-top: 20px;
    padding-top: 30px;
    padding-bottom: 30px;
}

.filter-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.filter-row:last-child {
    margin-bottom: 0;
}

.filter-item {
    display: flex;
    align-items: center;
    margin-left: 30px;
}

.filter-label {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    margin-right: 20px;
}

.filter-input {
    width: 232px;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
}

.filter-input .el-input__inner {
    border: 1px solid rgba(8, 155, 171, 0.4);
    border-radius: 8px;
    height: 36px;
}

.filter-input .el-input__inner:focus {
    border-color: #089BAB;
}

.date-picker-container {
    display: flex;
    gap: 10px;
}

.date-picker {
    width: 232px;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
}

.date-picker .el-input__inner {
    border: 1px solid rgba(8, 155, 171, 0.4);
    border-radius: 8px;
    height: 36px;
}

.date-picker .el-input__inner:focus {
    border-color: #089BAB;
}

.filter-buttons {
    margin-left: auto;
    margin-right: 20px;
    display: flex;
    gap: 10px;
}

.reset-btn {
    background: rgba(136, 140, 150, 0.1608);
    border: 1px solid #ddd;
    color: #666;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
}

.query-btn {
    background-color: #16C0C0;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
}

.query-btn:hover {
    background-color: #089BAB;
}

.import-btn,
.template-btn {
    background: transparent;
    border: 1px solid rgba(8, 155, 171, 0.4);
    color: #089BAB;
    margin-right: 15px;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 14px;
    width: 100px;
    height: 40px;
}

.add-btn {
    width: 100px;
    height: 40px;
    background-color: #089BAB;
    color: white;
    border: none;
    margin-right: 15px;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 14px;
}

.add-btn:hover {
    background-color: #067a87;
}

.button-a {
    border: 1px solid #ddd;
    height: 36px;
    width: 36px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    background: white;
    border-radius: 6px;
}

.button-a i {
    font-size: 16px;
    color: #666;
}

.button-a:hover {
    border-color: #089BAB;
}

.button-a:hover i {
    color: #089BAB;
}

.action-btn {
    padding: 0;
    margin: 0 5px;
    font-size: 14px;
}

.edit-btn {
    color: #089BAB;
}

.detail-btn {
    color: #16C0C0;
}

.block {
    width: 100%;
    margin-top: 20px;
}

.custom-pagination {
    background: #EFF7F8;
    border-radius: 8px;
    padding: 10px 15px;
}

.custom-pagination .btn-prev,
.custom-pagination .btn-next,
.custom-pagination .el-pager li {
    background: transparent;
    border: none;
    color: #666;
    font-size: 14px;
}

.custom-pagination .el-pager li.active {
    color: #089BAB;
    font-weight: 500;
}

.custom-pagination .btn-prev:hover,
.custom-pagination .btn-next:hover,
.custom-pagination .el-pager li:hover {
    color: #089BAB;
}

.el-table .el-table__header-wrapper {
    border-radius: 20px 20px 0 0;
}

.el-table .el-table__body-wrapper {
    border-radius: 0 0 20px 20px;
}

.el-table .el-table__row:hover>td {
    background-color: #f8f9fa;
}

.device-detail-dialog /deep/ .el-dialog {
    width: 800px !important;
    height: 665px !important;
    background: #FFFFFF;
    border-radius: 20px !important;
    margin-top: 5vh !important;
}

.device-detail-dialog /deep/ .el-dialog__header {
    text-align: center;
    padding: 30px 30px 20px;
    border-bottom: 1px solid #f0f0f0;
}

.device-detail-dialog /deep/ .el-dialog__title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.device-detail-dialog /deep/ .el-dialog__body {
    padding: 0;
    height: calc(665px - 120px);
    overflow: hidden;
}

.detail-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px 30px;
}

.detail-content .el-table {
    flex: 1;
    margin-bottom: 20px;
}

.detail-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 30px 0;
    margin-top: auto;
}

.pagination-info {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
}

.pagination-controls {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
}

.page-btn {
    padding: 5px 8px;
    border: 1px solid #ddd;
    background: white;
    color: #666;
}

.page-btn:hover:not(:disabled) {
    border-color: #089BAB;
    color: #089BAB;
}

.page-btn:disabled {
    color: #ccc;
    border-color: #eee;
    cursor: not-allowed;
}

.detail-content .el-table /deep/ .el-table__body-wrapper {
    max-height: 400px;
    overflow-y: auto;
}

/* 设备导入弹出框样式 */
.import-dialog /deep/ .el-dialog {
    border-radius: 20px !important;
    background: #FFFFFF;
}

.import-dialog /deep/ .el-dialog__header {
    text-align: center;
    padding: 30px 30px 20px;
    border-bottom: 1px solid #f0f0f0;
}

.import-dialog /deep/ .el-dialog__title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.import-dialog /deep/ .el-dialog__body {
    padding: 30px;
}

.import-form-container {
    width: 100%;
}

.import-form {
    width: 100%;
}

.form-row {
    display: flex;
    margin-bottom: 24px;
    gap: 30px;
}

.form-item {
    flex: 1;
    display: flex;
    align-items: center;
}

.form-item-full {
    width: 100%;
    display: flex;
    align-items: center;
}

.form-label {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    margin-right: 12px;
    min-width: 100px;
    text-align: left;
}

.form-label.required::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}

.form-input {
    flex: 1;
    height: 40px;
}

.form-input-full {
    flex: 1;
    height: 40px;
}

.form-input /deep/ .el-input__inner,
.form-input-full /deep/ .el-input__inner {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    height: 38px;
    font-size: 14px;
    color: #606266;
}

.form-input /deep/ .el-input__inner::placeholder,
.form-input-full /deep/ .el-input__inner::placeholder {
    color: #c0c4cc;
    font-size: 14px;
}

.form-input /deep/ .el-input__inner:focus,
.form-input-full /deep/ .el-input__inner:focus {
    border-color: #089BAB;
}

.location-selects {
    display: flex;
    gap: 15px;
    flex: 1;
}

.location-select {
    flex: 1;
    height: 40px;
}

.location-select /deep/ .el-input__inner {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    height: 38px;
    font-size: 14px;
    color: #606266;
}

.location-select /deep/ .el-input__inner:focus {
    border-color: #089BAB;
}

.latitude-container {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.location-icon {
    position: absolute;
    right: 12px;
    font-size: 16px;
    color: #c0c4cc;
    cursor: pointer;
}

.location-icon:hover {
    color: #089BAB;
}

.status-radio {
    display: flex;
    gap: 30px;
}

.status-radio /deep/ .el-radio__label {
    font-size: 14px;
    color: #606266;
}

.status-radio /deep/ .el-radio__input.is-checked .el-radio__inner {
    border-color: #089BAB;
    background: #089BAB;
}

.status-radio /deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #089BAB;
}

.dialog-footer {
    text-align: center;
    padding: 20px 0;
}

.cancel-btn {
    background: rgba(136, 140, 150, 0.1608);
    border: 1px solid #ddd;
    color: #666;
    padding: 10px 30px;
    border-radius: 8px;
    font-size: 14px;
    margin-right: 20px;
}

.confirm-btn {
    background-color: #16C0C0;
    color: white;
    border: none;
    padding: 10px 30px;
    border-radius: 8px;
    font-size: 14px;
}

.confirm-btn:hover {
    background-color: #089BAB;
}
</style>

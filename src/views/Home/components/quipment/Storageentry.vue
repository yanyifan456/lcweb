<template>
    <div class="boxbig" ref="container">
        <!-- 筛选查询区域 -->
        <div style="width: 500px;height: 30px;display: flex;">
            <div class="box-a"></div>
            <div class="box-b">筛选查询</div>
        </div>
        <div class="box-c">
            <!-- 第一行：设备名称、入库单号、批次号 -->
            <div class="filter-row">
                <div class="filter-item">
                    <span class="filter-label">设备名称：</span>
                    <el-input v-model="filterForm.deviceName" placeholder="请输入" class="filter-input"></el-input>
                </div>
                <div class="filter-item">
                    <span class="filter-label" style="margin-left: 27px;">时间：</span>
                    <div class="date-picker-container">
                        <el-date-picker v-model="filterForm.startDate" type="date" placeholder="开始日期"
                            class="date-picker" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            :picker-options="startDatePickerOptions" @change="handleStartDateChange">
                        </el-date-picker>
                        <el-date-picker v-model="filterForm.endDate" type="date" placeholder="结束日期" class="date-picker"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="endDatePickerOptions"
                            :class="{ 'date-error': dateError }">
                        </el-date-picker>
                        <!-- 错误提示 -->
                        <div v-if="dateError" class="date-error-tip">
                            <i class="el-icon-warning"></i> 结束日期必须大于等于开始日期
                        </div>
                    </div>
                </div>
                <div class="filter-buttons">
                    <el-button class="reset-btn" @click="handleReset">重置</el-button>
                    <el-button class="query-btn" @click="handleQuery">查询</el-button>
                </div>
            </div>
        </div>
        <!-- 设备入库标题和操作按钮 -->
        <div style="width: 100%;height: 40px;display: flex;margin-top: 30px;justify-content: space-between;">
            <div style="display: flex;">
                <div class="box-aa"></div>
                <div class="box-cc">设备入库</div>
            </div>
            <div v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                style="display: flex;">
                <!-- 恢复设备导入按钮 -->
                <el-button class="import-btn" @click="handleImport">批量导入</el-button>
                <el-button class="template-btn" @click="handlexiazai">下载模板</el-button>
                <el-button class="add-btn" @click="handleAdd" icon="el-icon-plus">新增入库</el-button>
                <!-- <el-button @click="shuaxinlist" class="button-a">
                    <i class="el-icon-refresh-left"></i>
                </el-button>
                <el-button class="button-a">
                    <i class="el-icon-s-tools"></i>
                </el-button>
                <el-button class="button-a">
                    <i class="el-icon-setting"></i>
                </el-button> -->
            </div>
        </div>
        <!-- 数据表格 -->
        <el-table :data="filteredTableData" border
            style="width: 100%;border-radius: 20px 20px 0px 0px;margin-top: 30px;" :header-cell-style="{
                height: '60px',
                background: 'rgba(136, 140, 150, 0.07)',
                borderRadius: '0px 0px 0px 0px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333'
            }" :cell-style="{ fontSize: '14px', color: '#666' }" :row-style="{ height: '60px' }">
            <el-table-column class="aasd" fixed="left" prop="id" label="序号" width="60" align="center">
            </el-table-column>
            <!-- <el-table-column prop="warehouseNumber" label="入库单号" width="120" align="center">
                <template slot="header">
                    <div style="display: flex; align-items: center; justify-content: center; position: relative;">
                        <span>入库单号</span>
                        <i class="el-icon-search filter-icon" :class="{ 'active': warehouseNumberSearch }"
                            @click.stop="toggleFilter('warehouse', $event)"></i>
                    </div>
                </template>
</el-table-column> -->
            <el-table-column prop="deviceName" :show-overflow-tooltip="true" label="设备名称" align="center">
            </el-table-column>
            <el-table-column prop="deviceType" label="设备类型" align="center">
            </el-table-column>
            <el-table-column prop="deviceBrand" label="设备品牌" align="center">
            </el-table-column>
            <el-table-column prop="deviceSupplier" label="设备供应商" align="center">
            </el-table-column>
            <el-table-column prop="batchNumber" label="批次号" align="center" show-overflow-tooltip>
                <template slot="header">
                    <div style="display: flex; align-items: center; justify-content: center; position: relative;">
                        <span>批次号</span>
                        <i class="el-icon-search filter-icon" :class="{ 'active': batchNumberSearch }"
                            @click.stop="toggleFilter('batch', $event)"></i>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="deviceModel" label="设备型号" align="center">
            </el-table-column>
            <el-table-column prop="hardwareVersion" label="硬件版本" align="center">
            </el-table-column>
            <el-table-column prop="quantity" label="数量" align="center">
            </el-table-column>
            <el-table-column prop="entryPerson" label="入库人" align="center">
            </el-table-column>
            <el-table-column prop="entryTime" style="background-color: #666;" label="入库时间" align="center">
            </el-table-column>
            <el-table-column class="aasd" fixed="right" style="margin-top: 0;" label=" 操作" width="140" align="center">
                <template slot-scope="scope">
                    <el-button v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                        type="text" size="small" class="action-btn edit-btn"
                        @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="handleDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 自定义筛选弹出框 -->
        <div v-show="filterPopoverVisible" class="custom-filter-popover" :style="popoverStyle" @click.stop
            ref="filterPopover">
            <div class="filter-popover-content">
                <el-input v-model="currentSearchTemp" :placeholder="`请输入${filterType === 'warehouse' ? '入库单号' : '批次号'}`"
                    size="small" style="margin-bottom: 10px;"></el-input>
                <div style="text-align: center;">
                    <el-button size="mini" @click="resetFilter">重置</el-button>
                    <el-button size="mini" type="primary" @click="applyFilter">筛选</el-button>
                </div>
            </div>
        </div>
        <!-- 分页 -->
        <div class="block">
            <div style="display: flex;float: right;margin-top: 30px;align-items: center;">

                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
                </el-pagination>
            </div>
        </div>
        <!-- 设备详情弹出框 (恢复原功能) -->
        <el-dialog title="设备详情" :visible.sync="dialogVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" class="device-detail-dialog">
            <div class="detail-content">
                <el-table :data="deviceDetailList" style="width: 100%" :header-cell-style="{
                    background: '#f8f9fa',
                    color: '#333',
                    fontWeight: '500',
                    fontSize: '14px',
                    height: '50px',
                    textAlign: 'center'
                }" :cell-style="{
                    fontSize: '14px',
                    color: '#666',
                    textAlign: 'center',
                    height: '50px'
                }" :row-style="{ height: '50px' }">
                    <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
                    <el-table-column prop="deviceNumber" label="设备编号（IMEI）" align="center"></el-table-column>
                    <el-table-column prop="sn" label="SN" align="center"></el-table-column>
                    <el-table-column prop="batchNumber" show-overflow-tooltip label="批次号"
                        align="center"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="detail-pagination">
                    <div class="pagination-info">
                        <span>共计{{ detailTotal }}条</span>
                        <el-select v-model="detailPageSize" size="small"
                            style="width: 120px; margin-left: 10px;margin-right: 10px;"
                            @change="handleDetailSizeChange">
                            <el-option label="10条/页" value="10"></el-option>
                            <el-option label="20条/页" value="20"></el-option>
                            <el-option label="50条/页" value="50"></el-option>
                        </el-select>
                    </div>
                    <div class="pagination-controls">
                        <el-button style="height: 32px;" size="small" :disabled="detailCurrentPage === 1"
                            @click="handleDetailPageChange(detailCurrentPage - 1)" class="page-btn">
                            <i class="el-icon-arrow-left"></i>
                        </el-button>
                        <el-input v-model="detailCurrentPage" size="small" style="width: 50px; margin: 0 10px;"
                            @keyup.enter.native="handleJumpPage"></el-input>
                        <el-button style="height: 32px;" size="small"
                            :disabled="detailCurrentPage >= Math.ceil(detailTotal / detailPageSize)"
                            @click="handleDetailPageChange(detailCurrentPage + 1)" class="page-btn">
                            <i class="el-icon-arrow-right"></i>
                        </el-button>
                        <span style="margin-left: 10px;">前往</span>
                        <el-input size="small" style="width: 50px; margin-left: 10px;" v-model="jumpPage"
                            @keyup.enter.native="handleJumpPage"></el-input>
                        <span style="margin-left: 10px;">页</span>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 设备导入弹出框 (独立弹框) -->
        <el-dialog title="设备导入" :visible.sync="importDialogVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" class="import-dialog" width="680px">
            <div class="import-form-container">
                <el-form :model="importForm" :rules="importRules" ref="importForm" label-width="120px">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="设备名称：" prop="deviceName" required>
                                <el-select v-model="importForm.deviceName" placeholder="请选择" style="width: 100%"
                                    clearable @change="handleImportDeviceNameChange">
                                    <el-option v-for="(name, index) in deviceNameOptions" :key="index" :label="name"
                                        :value="name">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备类型：" prop="deviceType" required>
                                <el-input v-model="importForm.deviceType" placeholder="请先选择设备名称" readonly disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="设备品牌：" prop="deviceBrand" required>
                                <el-input v-model="importForm.deviceBrand" placeholder="请先选择设备名称" readonly disabled>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="设备型号：" prop="deviceModel" required>
                                <el-select v-model="importForm.deviceModel" placeholder="请选择" style="width: 100%"
                                    clearable :disabled="!importForm.deviceName">
                                    <el-option label="Watch GT 3" value="watch_gt3"></el-option>
                                    <el-option label="Watch GT 2" value="watch_gt2"></el-option>
                                    <el-option label="Band 7" value="band7"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="设备供应商：" prop="deviceSupplier" required>
                                <el-input v-model="importForm.deviceSupplier" placeholder="请输入" clearable
                                    :disabled="!importForm.deviceName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="硬件版本：" prop="hardwareVersion" required>
                                <el-input v-model="importForm.hardwareVersion" placeholder="请输入" clearable
                                    :disabled="!importForm.deviceName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item label="上传文件：" prop="fileList" required>
                                <el-upload class="upload-demo" action="#" :on-change="handleFileChange"
                                    :on-remove="handleFileRemove" :before-upload="beforeFileUpload"
                                    :file-list="importForm.fileList" :auto-upload="false" accept=".xlsx" :limit="1"
                                    :on-exceed="handleExceed">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且只能上传一个文件</div>
                                </el-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="handleImportCancel">取消</el-button>
                <el-button class="confirm-btn" @click="handleImportConfirm" :loading="uploading">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getList, getdetail, getLinkage } from '../../../../api/Equipmentstorage.js'
import * as XLSX from 'xlsx'; // 引入xlsx库
import axios from 'axios'; // 引入axios

export default {
    name: 'DeviceWarehouse',
    data() {
        return {
            filterForm: {
                deviceName: '',
                warehouseNumber: '',
                batchNumber: '',
                startDate: '',
                endDate: ''
            },
            userauth: sessionStorage.getItem('roleName'),

            dateError: false, // 日期错误状态
            startDatePickerOptions: {
                disabledDate: (time) => {
                    // 限制开始日期不能晚于结束日期（包括当天）
                    if (this.filterForm.endDate) {
                        return time.getTime() > new Date(this.filterForm.endDate).getTime();
                    }
                    return false;
                }
            },
            endDatePickerOptions: {
                disabledDate: (time) => {
                    // 限制结束日期不能早于开始日期（包括当天）
                    if (this.filterForm.startDate) {
                        return time.getTime() < new Date(this.filterForm.startDate).getTime() - 86400000;
                    }
                    return false;
                }
            },
            currentPage: 1,
            pageSize: 10, // 每页显示5条数据
            totalItems: 0, // 总条数，从后端获取
            tableData: [], // 存储当前页的表格数据 (已映射)
            rawTableData: [], // 存储从API获取的原始数据
            dialogVisible: false, // 用于设备详情弹框
            currentDevice: null,
            deviceDetailList: [],
            detailCurrentPage: 1,
            detailPageSize: 10,
            detailTotal: 0,
            currentBatchId: '',
            jumpPage: '',
            // 筛选相关数据
            warehouseNumberSearch: '',
            batchNumberSearch: '',
            currentSearchTemp: '', // 用于临时存储弹出框中的搜索值
            filterPopoverVisible: false,
            filterType: '', // 'warehouse' 或 'batch'
            popoverStyle: {
                top: '0px',
                left: '0px'
            },
            // 设备导入相关数据
            importDialogVisible: false, // 用于设备导入弹框
            importForm: {
                deviceName: '',
                deviceType: '',
                deviceBrand: '',
                deviceModel: '',
                deviceSupplier: '',
                // quantity: 0, // 导入时数量根据文件内容计算，但此字段不发送给API
                hardwareVersion: '',
                fileList: [], // 将 fileList 移动到 importForm 中
            },
            importRules: {
                deviceName: [
                    { required: true, message: '请选择设备名称', trigger: 'change' }
                ],
                deviceType: [
                    { required: true, message: '设备类型不能为空', trigger: 'change' }
                ],
                deviceBrand: [
                    { required: true, message: '设备品牌不能为空', trigger: 'change' }
                ],
                deviceModel: [
                    { required: true, message: '请选择设备型号', trigger: 'change' }
                ],
                deviceSupplier: [
                    { required: true, message: '请输入设备供应商', trigger: 'blur' }
                ],
                hardwareVersion: [
                    { required: true, message: '请输入硬件版本', trigger: 'blur' }
                ],
                fileList: [
                    { validator: this.validateFileList, trigger: 'change' }
                ]
            },
            deviceNameOptions: [], // 设备名称选项
            typeAndBrandLoading: false,
            // fileList: [], // 移除根层级的 fileList
            uploadedDeviceData: [], // 从上传文件中解析出的设备数据 (用于内部逻辑，不直接发送给API)
            uploading: false, // 控制上传按钮的loading状态
        }
    },
    computed: {
        // 综合筛选方法，现在是一个计算属性
        filteredTableData() {
            let filtered = [...this.tableData]; // 从当前页数据开始筛选

            // 入库单号筛选
            if (this.warehouseNumberSearch) {
                filtered = filtered.filter(item =>
                    item.warehouseNumber.toLowerCase().includes(this.warehouseNumberSearch.toLowerCase())
                );
            }

            // 批次号筛选
            if (this.batchNumberSearch) {
                filtered = filtered.filter(item =>
                    item.batchNumber.toLowerCase().includes(this.batchNumberSearch.toLowerCase())
                );
            }
            return filtered;
        },
    },
    watch: {
        // 监听结束日期变化
        'filterForm.endDate'(newVal) {
            if (this.filterForm.startDate && newVal) {
                const start = new Date(this.filterForm.startDate);
                const end = new Date(newVal);
                // 如果结束日期早于开始日期，标记错误
                this.dateError = end < start; // 这里用 < 而不是 <=，因为当天是允许的
            } else {
                this.dateError = false;
            }
        }
    },
    mounted() {
        // 添加全局点击事件监听，用于关闭弹出框
        document.addEventListener('click', this.closeFilterPopover);
        this.getTableData(); // 页面加载时获取初始数据
        this.getLinkageOptions(); // 获取设备名称选项
    },
    beforeDestroy() {
        // 移除事件监听
        document.removeEventListener('click', this.closeFilterPopover);
    },
    methods: {
        // 映射API响应数据到表格所需格式
        mapApiResponseToTableData(records) {
            return records.map((record, index) => ({
                id: (this.currentPage - 1) * this.pageSize + index + 1, // 生成序号
                warehouseNumber: record.warehouseNumber || 'N/A', // 假设API可能返回此字段，或需要根据业务逻辑生成
                deviceName: record.deviceName,
                deviceType: record.deviceType || 'N/A',
                deviceBrand: record.deviceBrand || 'N/A',
                deviceSupplier: record.deviceSupply, // 映射 deviceSupply
                batchNumber: record.batchId, // 映射 batchId
                deviceModel: record.deviceModel || 'N/A',
                hardwareVersion: record.deviceVesion || 'N/A', // 映射 deviceVesion
                quantity: record.deviceCount,
                entryPerson: record.createBy,
                entryTime: record.createTime, // 映射 createTime
                bachid: record.batchId // 用于详情查询
            }));
        },
        // 获取列表数据
        async getTableData() {
            const params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                deviceName: this.filterForm.deviceName,
                startTime: this.filterForm.startDate,
                endTime: this.filterForm.endDate
            };

            try {
                // 获取客户端IP（示例使用固定值）
                const ip = '127.0.0.1'; // 替换为实际获取IP的逻辑

                const res = await getList(params);

                if (res.code === "200" && res.data && res.data.records) {
                    this.rawTableData = res.data.records;
                    this.tableData = this.mapApiResponseToTableData(res.data.records);
                    this.totalItems = res.data.total || 0;
                } else {
                    this.tableData = [];
                    this.totalItems = 0;
                    this.$message.error(res.msg || '获取数据失败或数据为空');
                }
            } catch (error) {
                this.tableData = [];
                this.totalItems = 0;
                console.error("Error fetching data:", error);
                this.$message.error('获取数据失败，请检查网络或服务器');
            }
        },
        handleReset() {
            this.filterForm = {
                deviceName: '',
                startDate: '',
                endDate: ''
            };
            this.dateError = false;
            this.currentPage = 1;
            this.getTableData();
        },
        handleQuery() {
            // 检查日期范围
            if (this.filterForm.startDate && this.filterForm.endDate) {
                const start = new Date(this.filterForm.startDate);
                const end = new Date(this.filterForm.endDate);
                // 修改为 > 而非 >=，允许结束日期等于开始日期
                if (start > end) {
                    this.dateError = true;
                    this.$message.error('结束日期必须大于或等于开始日期');
                    return;
                }
            }
            this.dateError = false;
            this.currentPage = 1;
            this.getTableData();
        },
        handleEdit(row) {

            // 使用路由跳转并传递参数
            this.$router.push({
                path: '/BStorageentry',
                query: {
                    bachid: row.bachid
                }
            });
        },
        // 恢复 handleDetail 为设备详情功能
        async handleDetail(row) {
            this.currentBatchId = row.bachid;
            this.dialogVisible = true; // 打开设备详情弹框
            await this.fetchDetailData();
        },
        // 恢复 fetchDetailData
        async fetchDetailData() {
            try {
                const res = await getdetail({
                    batchId: this.currentBatchId,
                    pageSize: this.detailPageSize,
                    pageNum: this.detailCurrentPage
                });

                if (res.code === "200" && res.data && res.data.records) {
                    this.deviceDetailList = res.data.records.map(item => ({
                        deviceName: item.deviceName,
                        deviceNumber: item.deviceId,
                        sn: item.deviceSn,
                        batchNumber: this.currentBatchId
                    }));
                    this.detailTotal = res.data.total || 0;
                } else {
                    this.deviceDetailList = [];
                    this.detailTotal = 0;
                    this.$message.error(res.msg || '获取详情数据失败或数据为空');
                }
            } catch (error) {
                this.deviceDetailList = [];
                this.detailTotal = 0;
                console.error('获取详情失败:', error);
                this.$message.error('获取详情失败，请重试');
            }
        },
        // 恢复 handleDetailSizeChange
        handleDetailSizeChange(val) {
            this.detailPageSize = val;
            this.detailCurrentPage = 1;
            this.fetchDetailData();
        },
        // 恢复 handleDetailPageChange
        handleDetailPageChange(page) {
            const totalPages = Math.ceil(this.detailTotal / this.detailPageSize);
            if (page < 1) {
                this.detailCurrentPage = 1;
            } else if (page > totalPages) {
                this.detailCurrentPage = totalPages;
            } else {
                this.detailCurrentPage = page;
            }
            this.fetchDetailData();
        },
        // 恢复 handleJumpPage
        handleJumpPage() {
            const page = parseInt(this.jumpPage);
            const totalPages = Math.ceil(this.detailTotal / this.detailPageSize);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                this.detailCurrentPage = page;
                this.fetchDetailData();
            } else {
                this.$message.warning(`请输入1到${totalPages}之间的页码`);
            }
            this.jumpPage = '';
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.currentPage = 1  // 重置到第一页
            this.getTableData()
        },
        handlePageChange(page) {
            this.currentPage = page;
            this.getTableData(); // 切换页码时获取新页的数据
        },
        handleAdd() {
            this.$router.push('/QStorageentry');
        },
        // 恢复 handleImport 为设备导入功能
        handleImport() {
            this.importDialogVisible = true; // 打开设备导入弹框
            this.resetImportForm(); // 重置导入表单
            this.getLinkageOptions(); // 确保设备名称选项是最新的
        },
        handleImportCancel() {
            this.importDialogVisible = false; // 关闭导入弹框
            this.resetImportForm();
        },
        generateBatchId() {
            const timestamp = Date.now().toString(36); // 转换为36进制缩短长度
            const randomStr = Math.random().toString(36).substr(2, 8); // 取8位随机字符
            return `${timestamp}-${randomStr}`;
        },
        async handleImportConfirm() {
            this.$refs.importForm.validate(async (valid) => {
                if (valid) {
                    // 验证 fileList 是否为空
                    if (this.importForm.fileList.length === 0) {
                        this.$message.error('请上传设备数据文件');
                        return;
                    }

                    this.uploading = true;
                    try {
                        const formData = new FormData();
                        formData.append('file', this.importForm.fileList[0].raw); // 从 importForm.fileList 获取文件

                        // 构建 paramList 数组
                        const paramList = [
                            this.importForm.deviceName,
                            this.importForm.deviceSupplier,
                            this.importForm.hardwareVersion,
                            '1', // stockType 固定值
                            sessionStorage.getItem('userName'), // createBy 固定值
                            this.importForm.deviceModel,
                            this.generateBatchId()
                        ];
                        // 将 paramList 数组作为 JSON 字符串添加到 FormData
                        formData.append('paramList', paramList[0]);
                        formData.append('paramList', paramList[1]);

                        formData.append('paramList', paramList[2]);

                        formData.append('paramList', paramList[3]);

                        formData.append('paramList', paramList[4]);

                        formData.append('paramList', paramList[5]);

                        formData.append('paramList', paramList[6]);





                        for (let pair of formData.entries()) {
                            console.log(pair[0] + ', ' + pair[1]);
                        }

                        // 直接使用 axios.post 调用接口，确保 URL 完整且正确
                        const res = await axios.post('/api/devicestock/importstockexcel', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data' // 确保设置正确的Content-Type
                            }
                        });


                        if (res.data.code === '200') {
                            // 优先处理特定错误（如Excel内容为空）
                            if (res.data.data.errorMsg === 'Excel内容为空!') {
                                this.$message.warning('Excel内容为空，请完善内容!');
                            }
                            // 处理业务错误（如部分设备重复）
                            else if (res.data.msg === '部分设备重复，未导入') {
                                this.$message.error(res.data.msg);
                            }
                            // 其他成功场景
                            else {
                                this.$message.success('设备导入成功!');
                            }

                            // 公共逻辑（关闭弹窗、重置表单、刷新表格）
                            this.importDialogVisible = false;
                            this.resetImportForm();
                            this.getTableData();

                        } else {
                            // 处理非200状态码（如400、500等）
                            this.$message.error(res.data.msg || '导入失败');
                        }
                    } catch (error) {
                        console.error('导入失败:', error);
                        this.$message.error('导入失败，请重试');
                    } finally {
                        this.uploading = false;
                    }
                } else {
                    this.$message.error('请完善表单必填信息');
                    return false;
                }
            });
        },
        resetImportForm() {
            this.importForm = {
                deviceName: '',
                deviceType: '',
                deviceBrand: '',
                deviceModel: '',
                deviceSupplier: '',
                hardwareVersion: '',
                fileList: [] // 重置 importForm.fileList
            };
            this.uploadedDeviceData = [];
            // 重置表单验证状态
            if (this.$refs.importForm) {
                this.$refs.importForm.resetFields();
            }
        },
        // 设备名称选择改变时，获取设备类型和品牌 (现在只用于导入表单)
        handleImportDeviceNameChange(value) {
            if (!value) {
                this.importForm.deviceType = '';
                this.importForm.deviceBrand = '';
                this.importForm.deviceModel = '';
                this.importForm.deviceSupplier = '';
                this.importForm.hardwareVersion = '';
                return;
            }
            this.getTypeAndBrandByDevice(value, true);
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getTableData()
        },

        // 获取设备类型和品牌 (复用逻辑，增加一个参数区分是主表单还是导入表单)
        getTypeAndBrandByDevice(deviceName, isImportForm = false) {
            this.typeAndBrandLoading = true;
            getLinkage({ deviceName: deviceName }).then(res => {
                if (res.code === "200" && res.data) {
                    if (isImportForm) {
                        this.importForm.deviceType = res.data.typeName?.[0] || '未知类型';
                        this.importForm.deviceBrand = res.data.deviceBrand?.[0] || '未知品牌';
                    }
                } else {
                    this.$message.error('获取设备类型和品牌失败');
                    if (isImportForm) {
                        this.importForm.deviceType = '获取失败';
                        this.importForm.deviceBrand = '获取失败';
                    }
                }
            }).catch(error => {
                console.error('获取设备类型和品牌失败:', error);
                this.$message.error('获取设备类型和品牌失败');
                if (isImportForm) {
                    this.importForm.deviceType = '请求失败';
                    this.importForm.deviceBrand = '请求失败';
                }
            }).finally(() => {
                this.typeAndBrandLoading = false;
            });
        },
        // 获取设备名称选项 (现在只用于导入表单)
        getLinkageOptions() {
            getLinkage({}).then(res => {
                if (res.code === "200" && res.data && res.data.deviceName) {
                    this.deviceNameOptions = Array.isArray(res.data.deviceName)
                        ? res.data.deviceName
                        : [res.data.deviceName];
                } else {
                    this.$message.error('获取设备名称选项失败');
                    this.deviceNameOptions = ['智能手表', '智能手机', '平板电脑']; // 备用数据
                }
            }).catch(error => {
                console.error('获取设备名称选项失败:', error);
                this.$message.error('获取设备名称选项失败');
                this.deviceNameOptions = ['智能手表', '智能手机', '平板电脑']; // 备用数据
            });
        },
        // 开始日期变化时更新结束日期的可选范围
        handleStartDateChange() {
            this.dateError = false;
            // 如果开始日期晚于当前结束日期，清空结束日期（可选）
            if (this.filterForm.startDate && this.filterForm.endDate) {
                const start = new Date(this.filterForm.startDate);
                const end = new Date(this.filterForm.endDate);
                if (start > end) {
                    this.filterForm.endDate = '';
                }
            }
        },       // 文件上传相关方法
        handleFileChange(file, fileList) {
            this.importForm.fileList = fileList.slice(-1); // 确保只保留一个文件，并更新到 importForm.fileList
            if (file.status === 'ready') {
                // 即使不发送uploadedDeviceData，也可以解析文件来更新quantity或进行前端校验
                this.parseExcelFile(file.raw);
            }
            // 触发文件列表的验证
            this.$refs.importForm.validateField('fileList');
        },
        handleFileRemove(file, fileList) {
            this.importForm.fileList = []; // 清空 importForm.fileList
            this.uploadedDeviceData = [];
            // 触发文件列表的验证
            this.$refs.importForm.validateField('fileList');
        },
        beforeFileUpload(file) {
            // 根据用户要求，移除所有文件类型和大小的限制
            // `accept=".xlsx"` on `el-upload` will handle client-side filtering.
            return true;
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        parseExcelFile(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json = XLSX.utils.sheet_to_json(worksheet);
                // 假设Excel文件有 '设备ID' 和 '设备SN号' 两列
                this.uploadedDeviceData = json.map(row => ({
                    deviceNumber: row['设备ID'], // 确保这里与Excel表头一致
                    sn: row['设备SN号'] // 确保这里与Excel表头一致
                })).filter(item => item.deviceNumber && item.sn); // 过滤掉空行

                if (this.uploadedDeviceData.length === 0) {
                    this.$message.warning('文件中未找到有效的设备编号和SN数据，请检查文件格式。');
                }
            };
            reader.readAsArrayBuffer(file);
        },
        validateFileList(rule, value, callback) {
            if (value && value.length > 0) {
                callback();
            } else {
                callback(new Error('请上传文件'));
            }
        },
        // 自定义筛选弹出框方法
        toggleFilter(type, event) {
            // 如果点击的是当前已打开的筛选器，则关闭
            if (this.filterPopoverVisible && this.filterType === type) {
                this.filterPopoverVisible = false;
                return;
            }

            this.filterType = type;
            // 设置临时值
            if (type === 'warehouse') {
                this.currentSearchTemp = this.warehouseNumberSearch;
            } else {
                this.currentSearchTemp = this.batchNumberSearch;
            }
            // 计算位置
            this.calculatePopoverPosition(event);
            // 显示弹出框
            this.filterPopoverVisible = true;
        },
        calculatePopoverPosition(event) {
            // 获取点击位置
            const clickX = event.clientX;
            const clickY = event.clientY;
            // 设置弹出框位置，稍微偏移避免遮挡
            this.popoverStyle = {
                top: `${clickY + 10}px`,
                left: `${clickX - 100}px`
            };
        },
        handlexiazai() {
            window.open('http://8.136.114.144:8090/devicestock/stock/template/download');
        },
        closeFilterPopover(event) {
            // 检查点击事件是否发生在弹出框内部或触发器上
            const filterIcons = document.querySelectorAll('.filter-icon');
            let isClickOnFilterIcon = false;
            filterIcons.forEach(icon => {
                if (icon.contains(event.target)) {
                    isClickOnFilterIcon = true;
                }
            });

            if (this.filterPopoverVisible && this.$refs.filterPopover && !this.$refs.filterPopover.contains(event.target) && !isClickOnFilterIcon) {
                this.filterPopoverVisible = false;
            }
        },
        applyFilter() {
            if (this.filterType === 'warehouse') {
                this.warehouseNumberSearch = this.currentSearchTemp;
            } else {
                this.batchNumberSearch = this.currentSearchTemp;
            }
            // 筛选逻辑现在由 computed 属性 filteredTableData 自动处理
            this.filterPopoverVisible = false;
        },
        resetFilter() {
            this.currentSearchTemp = '';
            if (this.filterType === 'warehouse') {
                this.warehouseNumberSearch = '';
            } else {
                this.batchNumberSearch = '';
            }
            // 筛选逻辑现在由 computed 属性 filteredTableData 自动处理
            this.filterPopoverVisible = false;
        },
        shuaxinlist() {


            // 清空顶部查询表单的条件
            this.filterForm = {
                deviceName: '',
                startDate: '',
                endDate: ''
            };
            // 清空表头筛选条件
            this.warehouseNumberSearch = '';
            this.batchNumberSearch = '';
            // 重置当前页码为第一页
            this.currentPage = 1;
            // 重新获取数据（此时会使用空的查询条件）
            this.getTableData();
        }
    },
}
</script>
<style scoped>
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

/* 原有样式保持不变 */
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

.date-error .el-input__inner {
    border-color: #f56c6c !important;
}

.date-error-tip {
    position: absolute;
    bottom: -25px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    color: #f56c6c;
    white-space: nowrap;
    background: #fff;
    padding: 2px 8px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.date-error-tip i {
    margin-right: 4px;
}

.date-picker-container {
    display: flex;
    gap: 10px;
    position: relative;
    /* 为错误提示定位 */
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
    /* background-color: red; */
    border-radius: 4px;
    padding: 5px;
}

/* 如果需要修改按钮的颜色 */
.custom-pagination .btn-prev,
.custom-pagination .btn-next,
.custom-pagination .number {
    background-color: darkred;
    /* 调整按钮颜色，更深的红色 */
    color: white;
    /* 文字白色 */
    border-color: rgb(114, 106, 106);
}

.custom-pagination .btn-prev:hover,
.custom-pagination .btn-next:hover,
.custom-pagination .number:hover,
.custom-pagination .number.active {
    background-color: #ff4d4d;
    /* 悬停/选中时的亮红色 */
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

/* 设备详情弹出框样式 */
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
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 20px;
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
    width: 680px !important;
    /* 保持宽度 */
    height: auto !important;
    /* 调整高度以适应内容 */
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
    overflow: auto;
    /* 允许内容滚动 */
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

.el-table--enable-row-hover .el-table__body tr:hover>td {
    background-color: transparent !important;
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

.el-form-item__label {
    /* 针对el-form-item的label样式 */
    color: #333;
    font-weight: 400;
}

.el-form-item__label::before {
    /* 针对el-form-item的required星号 */
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
.form-input-full /deep/ .el-input__inner,
.el-select .el-input__inner {
    /* 统一输入框和选择框的样式 */
    border: 1px solid rgba(8, 155, 171, 0.4);
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
.form-input-full /deep/ .el-input__inner:focus,
.el-select .el-input__inner:focus {
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

/* Upload component specific styles */
.upload-demo {
    width: 100%;
}

.el-upload__tip {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
</style>

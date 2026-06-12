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
                    <span class="filter-label">用户名称：</span>
                    <el-input v-model="filterForm.deviceName" placeholder="请输入" class="filter-input"></el-input>
                </div>
                <div class="filter-item">
                    <span class="filter-label" style="margin-left: 27px;">时间：</span>
                    <div class="date-picker-container">
                        <el-date-picker v-model="filterForm.startDate" type="date" placeholder="开始日期---结束日期"
                            class="date-picker" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
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
                <div class="box-cc log-tab" :class="{ 'active-tab': activeLogTab === 'login' }"
                    @click="switchLogTab('login')">登录日志</div>
                <div class="box-cc log-tab" :class="{ 'active-tab': activeLogTab === 'operation' }"
                    @click="switchLogTab('operation')">操作日志</div>


            </div>
            <div style="display: flex;">

                <el-button class="button-a">
                    <i class="el-icon-refresh-left"></i>
                </el-button>
                <el-button class="button-a">
                    <i class="el-icon-s-tools"></i>
                </el-button>
                <el-button class="button-a">
                    <i class="el-icon-setting"></i>
                </el-button>
            </div>
        </div>
        <!-- 数据表格 -->
        <el-table v-if="activeLogTab === 'login'" :data="loginLogData">
            <!-- 登录日志专用列 -->
            <el-table-column prop="loginTime" label="登录时间" align="center"></el-table-column>
            <el-table-column prop="userAccount" label="用户账号" align="center"></el-table-column>
            <el-table-column prop="ipAddress" label="IP地址" align="center"></el-table-column>
        </el-table>

        <el-table v-if="activeLogTab === 'operation'" :data="operationLogData">
            <!-- 操作日志专用列 -->
            <el-table-column prop="operationTime" label="操作时间" align="center"></el-table-column>
            <el-table-column prop="operationContent" label="操作内容" align="center"></el-table-column>
            <el-table-column prop="operator" label="操作人" align="center"></el-table-column>
        </el-table>

        <!-- 自定义筛选弹出框 -->
        <div v-show="filterPopoverVisible" class="custom-filter-popover" :style="popoverStyle" @click.stop>
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
                <div style="font-size: 12px;line-height: 29px;margin-right: 30px;color: #666;">共计{{
                    filteredTableData.length }}条
                </div>
                <el-pagination class="custom-pagination" layout="prev, pager, next" :total="filteredTableData.length"
                    :page-size="10" :current-page="currentPage" @current-change="handlePageChange" />
            </div>
        </div>

        <!-- 设备详情弹出框 -->
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
                    <el-table-column prop="batchNumber" label="批次号" align="center"></el-table-column>
                    <el-table-column prop="deviceNumber" label="设备编号（IMEI）" align="center"></el-table-column>
                    <el-table-column prop="sn" label="SN" align="center"></el-table-column>
                </el-table>
                <!-- 分页 -->
                <div class="detail-pagination">
                    <div class="pagination-info">
                        <span>共计100条</span>
                        <el-select v-model="detailPageSize" size="small"
                            style="width: 120px; margin-left: 10px;margin-right: 10px;">
                            <el-option label="10条/页" value="10"></el-option>
                            <el-option label="20条/页" value="20"></el-option>
                            <el-option label="50条/页" value="50"></el-option>
                        </el-select>
                    </div>
                    <div class="pagination-controls">
                        <el-button style="height: 32px;" size="small" :disabled="detailCurrentPage === 1"
                            @click="detailCurrentPage--" class="page-btn">
                            <i class="el-icon-arrow-left"></i>
                        </el-button>
                        <el-input v-model="detailCurrentPage" size="small" style="width: 50px; margin: 0 10px;"
                            @change="handleDetailPageChange"></el-input>
                        <el-button style="height: 32px;" size="small" :disabled="detailCurrentPage >= detailTotalPages"
                            @click="detailCurrentPage++" class="page-btn">
                            <i class="el-icon-arrow-right"></i>
                        </el-button>
                        <span style="margin-left: 10px;">前往</span>
                        <el-input size="small" style="width: 50px; margin-left: 10px;" v-model="jumpPage"
                            @keyup.enter="handleJumpPage"></el-input>
                        <span style="margin-left: 10px;">页</span>
                    </div>
                </div>
            </div>
        </el-dialog>


    </div>
</template>

<script>
import moduleName from '../../../../assets/adress.json'
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
            activeLogTab: 'login',
            currentPage: 1,
            loginLogData: [
                {
                    loginTime: '2024-03-15 09:00:00',
                    userAccount: 'admin',
                    ipAddress: '116.62.88.37:18082'
                },
                // 更多登录日志数据...
            ],
            operationLogData: [
                {
                    operationTime: '2024-03-15 10:00:00',
                    operationContent: '新增设备入库记录',
                    operator: 'admin'
                },
                // 更多操作日志数据...
            ],
            dialogVisible: false,
            currentDevice: null,

            detailCurrentPage: 1,
            detailPageSize: '10',
            detailTotalPages: 10,
            jumpPage: '',
            // 设备导入相关数据
            importDialogVisible: false,
            importForm: {
                organizationName: '',
                organizationShortName: '',
                organizationType: '',
                parentOrganization: '',
                organizationLeader: '',
                leaderPhone: '',
                firstServicePerson: '',
                firstServicePhone: '',
                province: '',
                city: '',
                county: '',
                organizationAddress: '',
                longitude: '',
                latitude: '',
                status: 1
            },

            provinces: moduleName,
            cities: [],
            counties: [],
            deviceDetailList: [],
            tableData: [],
            // 筛选相关数据
            warehouseNumberSearch: '',
            batchNumberSearch: '',
            warehouseNumberSearchTemp: '',
            batchNumberSearchTemp: '',
            filteredTableData: [],
            originalTableData: [],
            // 自定义弹出框相关数据
            filterPopoverVisible: false,
            filterType: '', // 'warehouse' 或 'batch'
            currentSearchTemp: '',
            popoverStyle: {
                top: '0px',
                left: '0px'
            }
        }
    },
    mounted() {
        this.originalTableData = [...this.tableData];
        this.filteredTableData = [...this.tableData];

        // 添加全局点击事件监听
        document.addEventListener('click', this.closeFilterPopover);
    },
    beforeDestroy() {
        // 移除事件监听
        document.removeEventListener('click', this.closeFilterPopover);
    },
    methods: {
        switchLogTab(tab) {
            this.activeLogTab = tab
            // 如果需要加载数据可以在这里调用API
            // if(tab === 'login') this.fetchLoginLogs()
            // if(tab === 'operation') this.fetchOperationLogs()
        },
        handleReset() {
            this.filterForm = {
                deviceName: '',
                warehouseNumber: '',
                batchNumber: '',
                startDate: '',
                endDate: ''
            }
        },
        handleQuery() {

        },
        handleEdit(row) {

            this.$router.push('/BStorageentry');
        },
        handleDetail(row) {
            this.currentDevice = row;
            this.dialogVisible = true;
        },
        handlePageChange(page) {
            this.currentPage = page
        },
        handleDetailPageChange(page) {
            if (page < 1) {
                this.detailCurrentPage = 1;
            } else if (page > this.detailTotalPages) {
                this.detailCurrentPage = this.detailTotalPages;
            }
        },
        handleJumpPage() {
            const page = parseInt(this.jumpPage);
            if (page >= 1 && page <= this.detailTotalPages) {
                this.detailCurrentPage = page;
                this.jumpPage = '';
            }
        },
        // 设备导入相关方法

        handleImportCancel() {
            this.importDialogVisible = false;
            this.resetImportForm();
        },
        handleImportConfirm() {
            // 表单验证
            if (!this.validateImportForm()) {
                return;
            }


            // 模拟提交成功
            this.$message.success('机构信息保存成功！');
            this.importDialogVisible = false;
            this.resetImportForm();
        },
        resetImportForm() {
            this.importForm = {
                organizationName: '',
                organizationShortName: '',
                organizationType: '',
                parentOrganization: '',
                organizationLeader: '',
                leaderPhone: '',
                firstServicePerson: '',
                firstServicePhone: '',
                province: '',
                city: '',
                county: '',
                organizationAddress: '',
                longitude: '',
                latitude: '',
                status: 1
            };
            this.cities = [];
            this.counties = [];
        },
        handleProvinceChange(value) {
            this.importForm.city = '';
            this.importForm.county = '';
            this.counties = [];

            // 找到选中省份的城市列表
            const selectedProvince = this.provinces.find(p => p.province === value);
            this.cities = selectedProvince ? selectedProvince.citys : [];
        },
        handleCityChange(value) {
            this.importForm.county = '';

            // 找到选中城市的区域列表
            const selectedCity = this.cities.find(c => c.city === value);
            this.counties = selectedCity ? selectedCity.areas : [];
        },
        // 自定义筛选弹出框方法
        toggleFilter(type, event) {
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

        closeFilterPopover() {
            this.filterPopoverVisible = false;
        },

        applyFilter() {
            if (this.filterType === 'warehouse') {
                this.warehouseNumberSearch = this.currentSearchTemp;
            } else {
                this.batchNumberSearch = this.currentSearchTemp;
            }

            this.filterTableData();
            this.filterPopoverVisible = false;
        },

        resetFilter() {
            this.currentSearchTemp = ''
        },

        // 综合筛选方法
        filterTableData() {
            let filtered = [...this.originalTableData];

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

            this.filteredTableData = filtered;
        },
        // 添加表单验证方法
        validateImportForm() {
            const form = this.importForm;

            // 必填字段验证
            if (!form.organizationName) {
                this.$message.error('请输入机构名称');
                return false;
            }

            if (form.organizationName.length > 15) {
                this.$message.error('机构名称不能超过15个字符');
                return false;
            }

            if (!form.organizationShortName) {
                this.$message.error('请输入机构简称');
                return false;
            }

            if (form.organizationShortName.length < 7 || form.organizationShortName.length > 15) {
                this.$message.error('机构简称应为7-15个字符');
                return false;
            }

            if (!form.organizationType) {
                this.$message.error('请选择机构类型');
                return false;
            }

            if (!form.organizationLeader) {
                this.$message.error('请输入机构负责人');
                return false;
            }

            if (!form.leaderPhone) {
                this.$message.error('请输入负责人电话');
                return false;
            }

            // 电话号码格式验证
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(form.leaderPhone)) {
                this.$message.error('请输入正确的手机号码');
                return false;
            }

            if (!form.firstServicePerson) {
                this.$message.error('请输入第一服务人');
                return false;
            }

            if (!form.firstServicePhone) {
                this.$message.error('请输入第一服务人员电话');
                return false;
            }

            if (!phoneRegex.test(form.firstServicePhone)) {
                this.$message.error('请输入正确的第一服务人员电话');
                return false;
            }

            if (!form.province) {
                this.$message.error('请选择省份');
                return false;
            }

            if (!form.city) {
                this.$message.error('请选择城市');
                return false;
            }

            if (!form.county) {
                this.$message.error('请选择县区');
                return false;
            }

            if (!form.organizationAddress) {
                this.$message.error('请输入机构地址');
                return false;
            }

            // 经纬度格式验证（如果填写了的话）
            if (form.longitude && (isNaN(form.longitude) || form.longitude < -180 || form.longitude > 180)) {
                this.$message.error('请输入正确的经度（-180到180之间）');
                return false;
            }

            if (form.latitude && (isNaN(form.latitude) || form.latitude < -90 || form.latitude > 90)) {
                this.$message.error('请输入正确的纬度（-90到90之间）');
                return false;
            }

            return true;
        },
    }
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
.el-table /deep/ .el-table__body tr:hover>td {
    background-color: transparent !important;
}

.el-table /deep/ .el-table__fixed .el-table__body tr:hover>td,
.el-table /deep/ .el-table__fixed-right .el-table__body tr:hover>td {
    background-color: transparent !important;
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
    padding: 20px;
    background-color: #f5f7fa;
    position: relative;
    /* 为自定义弹出框提供定位上下文 */
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
    width: 100px;
    height: 40px;
    background: rgba(8, 155, 171, 0.6588);
    box-shadow: 0px 0px 8px 0px rgba(8, 155, 171, 0.1608);
    border-radius: 20px 20px 20px 20px;
    text-align: center;
    line-height: 40px;
    color: whitesmoke;
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

.log-tab {
    cursor: pointer;
    transition: all 0.3s;
    padding: 0 15px;
}

.log-tab:hover {
    color: #089BAB;
}

.active-tab {
    color: #089BAB;
    font-weight: bold;
    position: relative;
}

.active-tab::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: #089BAB;
}

/* 调整原有表格样式 */
.el-table {
    margin-top: 20px !important;
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
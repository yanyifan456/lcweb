<template>
    <div class="boxbig" ref="container">
        <!-- 筛选查询区域  -->
        <div style="width: 500px;height: 30px;display: flex;">
            <div class="box-a"></div>
            <div class="box-b">筛选查询</div>
        </div>
        <div class="box-c">
            <!-- 第一行：设备名称、入库单号、批次号  -->
            <div class="filter-row">
                <div class="filter-item">
                    <span class="filter-label">操作类型:</span>
                    <el-select v-model="filterForm.operationType" placeholder="请选择操作类型" class="filter-input" clearable
                        filterable style="width: 232px">
                        <el-option v-for="(item, index) in operationOptions" :key="index" :label="item" :value="item" />
                    </el-select>
                </div>
                <div class="filter-item">
                    <span class="filter-label" style="margin-left: 27px;">时间：</span>
                    <div class="date-picker-container">
                        <!-- <el-date-picker v-model="filterForm.startDate" type="date" placeholder="开始日期"
                            format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker> -->
                        <el-date-picker v-model="filterForm.startDate" type="datetimerange" class="date-picker"
                            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" />
                    </div>
                </div>
                <div class="filter-buttons">
                    <el-button class="reset-btn" @click="handleReset">重置</el-button>
                    <el-button class="query-btn" @click="handleQuery">查询</el-button>
                </div>
            </div>
        </div>
        <!-- 设备入库标题和操作按钮  -->
        <div style="width: 100%;height: 40px;display: flex;margin-top: 30px;justify-content: space-between;">
            <div style="display: flex;">
                <div class="box-aa"></div>
                <div class="box-cc">设备出入库记录</div>
            </div>
            <div style="display: flex;">
                <!-- <el-button class="button-a">
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
        <!-- 数据表格  -->
        <el-table :data="tableData" border style="width: 100%;border-radius: 20px 20px 0px 0px;margin-top: 30px;"
            :header-cell-style="{
                height: '60px',
                background: 'rgba(136, 140, 150, 0.07)',
                borderRadius: '0px 0px 0px 0px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333'
            }" :cell-style="{ fontSize: '14px', color: '#666' }" :row-style="{ height: '60px' }"">
            <!-- <el-table-column class=" aasd" fixed="left" prop="id" label="序号" width="60" align="center">
            </el-table-column> -->
            <el-table-column type="index" label="序号" width="80" align="center" :index="(index) => {
                return (currentPage - 1) * 10 + index + 1
            }" fixed="left" />
            <el-table-column prop="logId" label="日志流水" align="center">
            </el-table-column>
            <el-table-column prop="method" label="请求方式" align="center">
            </el-table-column>
            <el-table-column prop="operIp" label="请求IP" align="center">
            </el-table-column>
            <el-table-column prop="operName" label="操作人" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="operUrl" label="请求地址" align="center">
            </el-table-column>
            <el-table-column prop="reqIp" label="请求服务器IP" align="center">
            </el-table-column>
            <el-table-column prop="timeConsum" label="请求服务时长" align="center">
            </el-table-column>
            <el-table-column class="aasd" fixed="right" style="margin-top: 0;" label=" 操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="handleDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页  -->
        <div class="block">
            <div style="display: flex;float: right;margin-top: 30px;align-items: center;">

                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
                </el-pagination>
            </div>
        </div>
        <!-- 设备详情弹出框  -->
        <el-dialog title="操作详情" :visible.sync="dialogVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" class="device-detail-dialog" width="80%">
            <div class="detail-content" v-if="detailData">
                <!-- 基本信息  -->
                <div class="detail-section">
                    <h3>基本信息</h3>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">操作ID:</span>
                                <span class="value">{{ detailData.logId }}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">操作类型:</span>
                                <span class="value">{{ detailData.title }}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">请求方式:</span>
                                <span class="value">{{ detailData.method }}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">操作人:</span>
                                <span class="value">{{ detailData.operName || '未知' }}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">操作IP:</span>
                                <span class="value">{{ detailData.operIp }}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">操作时间:</span>
                                <span class="value">{{ detailData.createTime }}</span>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">请求地址:</span>
                                <span class="value">{{ detailData.operUrl }}</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">耗时:</span>
                                <span class="value">{{ detailData.timeConsum }}ms</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="detail-item">
                                <span class="label">机构:</span>
                                <span class="value">{{ detailData.orgName || '无' }}</span>
                            </div>
                        </el-col>
                    </el-row>
                </div>

                <!-- 请求参数  -->
                <div class="detail-section">
                    <h3>请求参数</h3>
                    <div class="json-container">
                        <div class="json-header">
                            <span>结构化参数:</span>
                            <el-button size="mini"
                                @click="copyToClipboard(JSON.stringify(detailData.structuredParam, null, 2))">复制</el-button>
                        </div>
                        <pre class="json-content">{{ formatJson(detailData.structuredParam) }}</pre>
                    </div>
                    <div class="json-container">
                        <div class="json-header">
                            <span>原始参数:</span>
                            <el-button size="mini" @click="copyToClipboard(detailData.rawParam)">复制</el-button>
                        </div>
                        <pre class="json-content raw-content">{{ detailData.rawParam }}</pre>
                    </div>
                </div>

                <!-- 响应结果  -->
                <div class="detail-section">
                    <h3>响应结果</h3>
                    <div class="json-container">
                        <div class="json-header">
                            <span>结构化结果:</span>
                            <el-button size="mini"
                                @click="copyToClipboard(JSON.stringify(detailData.structuredResult, null, 2))">复制</el-button>
                        </div>
                        <pre class="json-content">{{ formatJson(detailData.structuredResult) }}</pre>
                    </div>
                    <div class="json-container">
                        <div class="json-header">
                            <span>原始结果:</span>
                            <el-button size="mini" @click="copyToClipboard(detailData.rawResult)">复制</el-button>
                        </div>
                        <pre class="json-content raw-content">{{ detailData.rawResult }}</pre>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moduleName from '../../../../assets/adress.json'
import { Logdescription, Loglist, Logdetails } from '../../../../api/Inboundandoutboundrecords.js'
export default {
    name: 'DeviceWarehouse',
    data() {
        return {
            filterForm: {
                deviceName: '',
                warehouseNumber: '',
                batchNumber: '',
                startDate: '',
                endDate: '',
                operationType: ''
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },
            pageSize: 10,
            currentPage: 1,
            operationOptions: [],
            tableData: [],
            total: 0,
            totalItems: 0,
            dialogVisible: false,
            currentDevice: null,
            detailData: null,
            deviceDetailList: [],
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
            userauth: sessionStorage.getItem('roleName'),

            provinces: moduleName,
            cities: [],
            counties: [],
            // 筛选相关数据
            warehouseNumberSearch: '',
            batchNumberSearch: '',
            warehouseNumberSearchTemp: '',
            batchNumberSearchTemp: '',
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
        this.gettitle()
        this.getTableData()
        this.originalTableData = [...this.tableData];
        // 添加全局点击事件监听
        document.addEventListener('click', this.closeFilterPopover);
    },
    beforeDestroy() {
        // 移除事件监听
        document.removeEventListener('click', this.closeFilterPopover);
    },
    methods: {
        async gettitle() {
            const res = await Logdescription({})
            this.operationOptions = res.data.titleName || []
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.currentPage = 1  // 重置到第一页
            this.getTableData()
        },

        // 当前页码变化
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getTableData()
        },
        async getTableData() {
            const params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                title: this.filterForm.operationType,
                startTime: "",
                endTime: ""
            }
            const res = await Loglist(params)
            this.total = res.data.total
            this.tableData = res.data.records;
            this.totalItems = res.data.total || 0;

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
        async handleQuery() {
            // 转换日期格式
            const [startTime, endTime] = this.filterForm.startDate || [];
            const params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                title: this.filterForm.operationType,
                startTime: startTime || '',
                endTime: endTime || ''
            };
            const res = await Loglist(params);
            this.total = res.data.total;
            this.tableData = res.data.records;
        },
        formatDate(date) {
            if (!date) return '';
            return this.$moment(date).format('YYYY-MM-DD HH:mm:ss');
        },
        async handleDetail(row) {
            const loading = this.$loading({
                lock: true,
                text: '加载详情中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            // 调用详情API
            const res = await Logdetails({ logId: row.logId });

            if (res.code === "200") {
                this.detailData = res.data;
                this.currentDevice = row;
                this.dialogVisible = true;
            } else {
                this.$message.error('获取详情失败');
            }

            loading.close();
        },
        formatJson(data) {
            if (!data) return '';
            try {
                return JSON.stringify(data, null, 2);
            } catch (e) {
                return String(data);
            }
        },
        copyToClipboard(text) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    this.$message.success('已复制到剪贴板');
                }).catch(() => {
                    this.fallbackCopyTextToClipboard(text);
                });
            } else {
                this.fallbackCopyTextToClipboard(text);
            }
        },
        fallbackCopyTextToClipboard(text) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand('copy');
                this.$message.success('已复制到剪贴板');
            } catch (err) {
                this.$message.error('复制失败');
            }
            document.body.removeChild(textArea);
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
        handleImportCancel() {
            this.importDialogVisible = false;
            this.resetImportForm();
        },
        handleImportConfirm() {
            // 表单验证
            if (!this.validateImportForm()) {
                return;
            }
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

/* 添加详情弹窗样式 */
.detail-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #089BAB;
}

.detail-section h3 {
    margin: 0 0 20px 0;
    color: #089BAB;
    font-size: 16px;
    font-weight: 600;
}

.detail-item {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.detail-item .label {
    font-weight: 500;
    color: #333;
    min-width: 100px;
    margin-right: 10px;
}

.detail-item .value {
    color: #666;
    word-break: break-all;
}

.json-container {
    margin-bottom: 20px;
    border: 1px solid #e4e7ed;
    border-radius: 6px;
    overflow: hidden;
}

.json-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    background: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 500;
    color: #333;
}

.json-content {
    padding: 15px;
    margin: 0;
    background: #fff;
    color: #333;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    line-height: 1.5;
    max-height: 300px;
    overflow-y: auto;
    white-space: pre-wrap;
    word-break: break-all;
}

.raw-content {
    background: #f8f9fa;
    color: #666;
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
    border-radius: 20px !important;
    background: #FFFFFF;
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
    padding: 30px;
    max-height: 70vh;
    overflow-y: auto;
}

.detail-content {
    width: 100%;
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

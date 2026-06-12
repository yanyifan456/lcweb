<template>
    <div class="boxbig" ref="container">
        <!-- 筛选查询区域 -->
        <div style="width: 500px;height: 30px;display: flex;">
            <div class="box-a"></div>
            <div class="box-b">筛选查询</div>
        </div>
        <div class="box-c">
            <!-- 第一行：设备名称、入库类型 -->
            <div class="filter-row">
                <div class="filter-item">
                    <span class="filter-label">入库名称：</span>

                    <el-select v-model="deviceForm.deviceName" placeholder="请选择" style="width: 100%" clearable
                        @change="handleDeviceNameChange" @clear="handleDeviceNameChange('')">
                        <el-option v-for="(name, index) in deviceNameOptions" :key="index" :label="name"
                            :value="name" />
                    </el-select>
                </div>
                <div class="filter-item">
                    <span class="filter-label">入库类型：</span>
                    <!-- <el-input v-model="filterForm.stockType" placeholder="请输入" class="filter-input"></el-input> -->
                    <!-- 选择框 -->
                    <el-select v-model="filterForm.stockType" placeholder="请选择" class="filter-select">
                        <el-option label="采买入库" value="1"></el-option>
                        <el-option label="重新划拨入库" value="2"></el-option>
                    </el-select>
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
                <div class="box-cc">设备库存</div>
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
        <el-table :data="tableData" border style="width: 100%;border-radius: 20px 20px 0px 0px;margin-top: 30px;"
            :header-cell-style="{
                height: '60px',
                background: 'rgba(136, 140, 150, 0.07)',
                borderRadius: '0px 0px 0px 0px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333'
            }" :cell-style="{ fontSize: '14px', color: '#666' }" :row-style="{ height: '60px' }">
            <el-table-column class="aasd" fixed="left" prop="id" label="序号" width="60" align="center">
            </el-table-column>
            <el-table-column prop="deviceName" label="设备名称" align="center">
            </el-table-column>
            <el-table-column prop="deviceType" label="设备类型" align="center">
            </el-table-column>
            <el-table-column prop="deviceBrand" label="设备品牌" align="center">
            </el-table-column>
            <el-table-column prop="deviceSupplier" label="设备供应商" align="center">
            </el-table-column>
            <el-table-column prop="batchNumber" :show-overflow-tooltip="true" label="批次号" align="center">
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
            <el-table-column prop="quantity" label="设备编号" :show-overflow-tooltip="true" align="center">
            </el-table-column>
            <el-table-column prop="entryPerson" label="入库类型" align="center">
            </el-table-column>
            <el-table-column prop="entryTime" style="background-color: #666;" label="入库时间" align="center">
            </el-table-column>

            <el-table-column v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                class="aasd" fixed="right" style="margin-top: 0;" label=" 操作" width="140" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="action-btn edit-btn"
                        @click="handleDetail(scope.row)">出库</el-button>
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="handleEdit(scope.row)">详情</el-button>
                </template>
            </el-table-column>
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

                <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
                    :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
                </el-pagination>
            </div>
        </div>
        <!-- 设备详情弹出框 -->
        <el-dialog title="出库设备划拨绑定" :visible.sync="dialogVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" class="device-detail-dialog" width="600px">
            <div class="tree-container">
                <el-tree :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[2, 3]"
                    :default-checked-keys="[]" :props="defaultProps" @check="handleCheck" ref="tree">
                </el-tree>
                <!-- <orgselect></orgselect> -->
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="dialogVisible = false">取消</el-button>
                <el-button class="confirm-btn" @click="handleConfirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import moduleName from '../../../../assets/adress.json'
import orgselect from '../../../comounts/orgselect.vue'
import { getLinkage } from '../../../../api/Equipmentstorage.js'
import { getlist, getjigou, outstock } from '../../../../api/Equipmentinventory.js'
export default {
    name: 'DeviceWarehouse',
    components: { orgselect },
    data() {
        return {
            filterForm: {
                deviceName: '',
                stockType: '',
                batchNumber: '',
                startDate: '',
                endDate: ''
            },
            userauth: sessionStorage.getItem('roleName'),
            deviceNameOptions: [],
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            tableData: [],
            dialogVisible: false,
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
            },
            // 树形数据相关
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'node'
            },
            // 当前选中的设备
            currentDevice: null,
            deviceForm: {
                deviceName: '',
                deviceType: '',
                deviceBrand: '',
                deviceModel: '',
                deviceSupplier: '',
                quantity: 1, // 默认1条
                batchNumber: '172877777777',
                hardwareVersion: ''
            },
            typeAndBrandLoading: false
        }
    },
    mounted() {
        this.originalTableData = [...this.tableData];
        // this.filteredTableData = [...this.tableData];
        // 添加全局点击事件监听
        document.addEventListener('click', this.closeFilterPopover);
        this.gettableData();
        this.getlistjigu();
    },
    beforeDestroy() {
        // 移除事件监听
        document.removeEventListener('click', this.closeFilterPopover);
    },
    methods: {
        handleDeviceNameChange(value) {
            if (!value) {
                this.deviceForm.deviceType = '';
                this.deviceForm.deviceBrand = '';
                this.deviceForm.deviceModel = '';
                this.deviceForm.deviceSupplier = '';
                this.deviceForm.hardwareVersion = '';
                return;
            }
        },
        getLinkageOptions() {
            getLinkage({}).then(res => {
                if (res.code === "200") {
                    this.deviceNameOptions = Array.isArray(res.data.deviceName)
                        ? res.data.deviceName
                        : res.data.deviceName ? [res.data.deviceName] : [];
                } else {
                    this.$message.error('获取设备名称选项失败');
                    this.deviceNameOptions = ['智能手表', '智能手机', '平板电脑'];
                }
            }).catch(error => {
                console.error('获取设备名称选项失败:', error);
                this.$message.error('获取设备名称选项失败');
                this.deviceNameOptions = ['智能手表', '智能手机', '平板电脑'];
            });
        },
        resetFormFields() {
            this.deviceForm.deviceType = '';
            this.deviceForm.deviceBrand = '';
            this.deviceForm.deviceModel = '';
            this.deviceForm.deviceSupplier = '';
            this.deviceForm.hardwareVersion = '';
            this.deviceProperties = [{
                serialNumber: 1,
                deviceNumber: '',
                sn: ''
            }];
        },
        async getlistjigu() {
            const res = await getjigou({});
            if (res.code === '200' && res.data && res.data.orgtree) {
                this.treeData = res.data.orgtree;
            }
        },
        handleOrgSelect(selectedNode) {
            this.filterForm.selectedOrgId = selectedNode.orgId;
            this.filterForm.selectedOrgName = selectedNode.node;
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.currentPage = 1  // 重置到第一页
            this.gettableData()
        },
        handlePageChange(page) {
            this.currentPage = page;
            this.gettableData(); // 切换页码时获取新页的数据
        },
        async gettableData() {
            const params = {
                deviceName: this.deviceForm.deviceName,
                deviceSupply: "",
                batchId: "",
                deviceVersion: "",
                createBy: "",
                createTime: "",
                startTime: "",
                endTime: "",
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                stockType: this.filterForm.stockType || ""
            }
            const res = await getlist(params);
            this.tableData = this.mapApiResponseToTableData(res.data.records);
            this.totalItems = res.data.total;
        },
        mapApiResponseToTableData(records) {
            return records.map((record, index) => ({
                id: (this.currentPage - 1) * this.pageSize + index + 1, // 生成序号
                warehouseNumber: record.warehouseNumber || 'N/A', // 假设API可能返回此字段，或需要根据业务逻辑生成
                deviceName: record.deviceName,
                deviceType: record.deviceTypeName || 'N/A',
                deviceBrand: record.deviceBrand || 'N/A',
                deviceSupplier: record.deviceSupply, // 映射 deviceSupply
                batchNumber: record.batchId, // 映射 batchId
                deviceModel: record.deviceModel || 'N/A',
                hardwareVersion: record.deviceVesion || 'N/A', // 映射 deviceVesion
                quantity: record.deviceId,
                entryPerson: record.stockType,
                entryTime: record.createTime, // 映射 createTime
                bachid: record.batchId,// 用于详情查询
                deviceId: record.deviceId,
                deviceSn: record.deviceSn,
                stockId: record.stockId || record.id, // 添加stockId字段
                macAddress: record.macAddress,
            }));
        },
        handleReset() {

            this.filterForm = {
                deviceName: '',
                stockType: '',
                batchNumber: '',
                startDate: '',
                endDate: '',
                pageSize: this.pageSize,
                pageNum: this.currentPage,
            }
            this.gettableData(); // 重置后重新获取数据
        },
        handleQuery() {

            this.gettableData(); // 执行查询
            this.filterTableData()
        },
        handleEdit(row) {
            this.$router.push({
                path: '/Xtorageentry',
                query: {
                    rowData: JSON.stringify(row) // 将对象转为JSON字符串
                }
            });
        },
        handleDetail(row) {
            this.currentDevice = row;
            this.dialogVisible = true;
        },
        async handleConfirm() {
            // 获取选中的节点
            const checkedNodes = this.$refs.tree ? this.$refs.tree.getCheckedNodes() : [];



            if (checkedNodes.length === 0) {
                this.$message.warning('请选择出库机构');
                return;
            }

            // 获取选中的机构ID
            const selectedOrg = checkedNodes.length
                ? checkedNodes[checkedNodes.length - 1]
                : null;
            // 由于互斥逻辑，只会有一个选中的节点

            try {
                const params = {
                    outBoundOrg: selectedOrg.orgId,
                    updateBy: sessionStorage.getItem('userName'),
                    deviceIds: [
                        {
                            stockId: this.currentDevice.stockId
                        }
                    ]
                };
                const res = await outstock(params);

                if (res.code === '200') {
                    this.$message.success('出库成功');
                    this.dialogVisible = false;
                    // 重新获取数据
                    this.gettableData();
                } else {
                    this.$message.error(res.msg || '出库失败');
                }
            } catch (error) {
                console.error('出库失败：', error);
                this.$message.error('出库失败');
            }
        },

        confirmDelete() {
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
        // 修改后的树形控件选择逻辑
        handleCheck(currentNode, checkedStatus) {
            const tree = this.$refs.tree;

            if (!tree) return;

            // 清除所有选中状态
            this.clearAllChecked(tree);

            // 如果当前操作是选中，则只选中当前节点
            if (checkedStatus.checkedNodes.length > 0) {
                tree.setChecked(currentNode.id, true);
            }
        },

        // 清除所有节点的选中状态
        clearAllChecked(tree) {
            const allNodes = tree.store.nodesMap;
            Object.keys(allNodes).forEach(nodeId => {
                tree.setChecked(nodeId, false);
            });
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
            // this.filteredTableData = filtered;
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
    },
    computed: {
        // 综合筛选方法，现在是一个计算属性
        filteredTableData() {
            let filtered = [...this.tableData]; // 从当前页数据开始筛选

            // 设备名称筛选
            if (this.filterForm.deviceName) {
                filtered = filtered.filter(item =>
                    item.deviceName.toLowerCase().includes(this.filterForm.deviceName.toLowerCase())
                );
            }

            // 入库类型筛选
            if (this.filterForm.stockType) {
                filtered = filtered.filter(item =>
                    item.entryPerson.toLowerCase().includes(this.filterForm.stockType.toLowerCase())
                );
            }

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


    created() {
        this.getLinkageOptions();
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

.filters-input {
    width: 382px;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
}

.filter-input .el-input__inner {
    border: 1px solid rgba(15, 15, 15, 0.4);
    border-radius: 20px;
    height: 36px;
}

.filters-input .el-input__inner {
    border: 1px solid rgba(11, 141, 130, 0.4);
    border-radius: 20px;
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
    border: 1px solid rgba(18, 26, 27, 0.4);
    border-radius: 15px;
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
    width: 600px !important;
    background: #FFFFFF;
    border-radius: 20px !important;
    margin-top: 15vh !important;
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
    padding: 20px 30px;
    max-height: 400px;
    overflow-y: auto;
}

.tree-container {
    min-height: 200px;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 15px;
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

.detail-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 40px 0px;
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
    border: 1px solid #111113;
    border-radius: 15px;
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
    border: 1px solid #0f0f0f;
    border-radius: 15px;
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
</style>

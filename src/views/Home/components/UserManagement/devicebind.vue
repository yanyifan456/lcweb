<template>
    <div class="boxbig">
        <!-- Main Content -->
        <div class="main-content">
            <!-- 筛选查询区域 -->
            <div class="section-header">
                <div class="section-title-indicator"></div>
                <div class="section-title">筛选查询</div>
            </div>
            <div class="filter-area">
                <div class="filter-row">
                    <div class="filter-item" style="margin-left: 30px;">
                        <span class="filter-label">选择机构:</span>
                        <orgselect :key="orgSelectKey" style="width: 232px;" @node-selected="handleOrgSelect" />
                    </div>
                    <div class="filter-item" style="margin-left: 30px;">
                        <span class="filter-label">用户名称：</span>
                        <el-input v-model="filterForm.userName" placeholder="请输入" class="filter-input" />
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">用户手机号：</span>
                        <el-input v-model="filterForm.serialNumber" placeholder="请输入" class="filter-input" />
                    </div>
                    <div class="filter-buttons" style="margin-right: 30px;">
                        <el-button @click="handleReset">重置</el-button>
                        <el-button type="primary" @click="handleQuery">查询</el-button>
                    </div>
                </div>
            </div>
            <!-- 用户列表 -->
            <div class="section-header-with-actions">
                <div class="section-title-group">
                    <div class="section-title-indicator"></div>
                    <div class="section-title">用户列表</div>
                </div>
            </div>

            <!-- 数据表格 -->
            <div class="data-table-container">
                <el-table :data="tableData" border style="width: 100%;border-radius: 20px 20px 0 0;" :header-cell-style="{
                    height: '60px',
                    background: 'rgba(136, 140, 150, 0.07)',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333'
                }" :cell-style="{ fontSize: '14px', color: '#666' }" :row-style="{ height: '60px' }">
                    <el-table-column prop="userName" label="用户名称" align="center" />
                    <el-table-column :show-overflow-tooltip="true" prop="userId" label="用户标识" align="center">
                        <template slot-scope="scope">
                            <span class="userId-cell" @click="handleViewDetails(scope.row)">
                                {{ scope.row.userId }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" align="center" />
                    <el-table-column prop="serialNumber" label="手机号码" align="center" />
                    <el-table-column prop="height" label="身高(cm)" align="center" />
                    <el-table-column prop="weight" label="体重(kg)" align="center" />
                    <el-table-column prop="waistline" label="腰围(cm)" align="center" />
                    <el-table-column prop="birthDay" label="出生日期" align="center" />
                    <el-table-column prop="age" label="年龄" align="center" />
                    <el-table-column prop="address" label="地址" align="center" />
                    <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建时间" align="center" />
                    <el-table-column width="160" label="设备编号" align="center">
                        <template #default="scope">
                            <el-input v-model="scope.row.deviceId" size="small" clearable placeholder="请输入设备编号"
                                style="min-width: 220px;" />
                        </template>
                    </el-table-column>
                    <el-table-column v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                        label="操作" align="center">
                        <template #default="scope">
                            <!-- 已绑定的（接口返回的 deviceId 才算） -->
                            <el-button v-if="scope.row.isBound" type="text" class="action-text"
                                @click="handleUnbind(scope.row)">
                                解绑
                            </el-button>
                            <!-- 未绑定 或者 用户自己输入的 -->
                            <el-button v-else type="text" class="action-text" @click="handleBind(scope.row)">
                                绑定
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="filterForm.pageNum" :page-sizes="[10, 50, 100, 200]" :page-size="filterForm.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalItems" />
            </div>
        </div>
        <!-- 用户历史设备弹出框 -->
        <el-dialog title="用户绑定历史" :visible.sync="historyDeviceDialogVisible" width="800px" :close-on-click-modal="false"
            center custom-class="rounded-dialog" class="device-detail-dialog">
            <div class="history-device-content">
                <div class="history-item" v-for="(item, index) in historyDeviceData" :key="index">
                    <div class="history-date">
                        <span class="date-label">绑定时间：</span>
                        <span class="date-value">{{ item.bindTime }}</span>
                    </div>
                    <div class="device-info-grid">
                        <div class="device-info-item">
                            <span class="info-label">设备名称：</span>
                            <span class="info-value">{{ item.deviceName }}</span>
                        </div>
                        <div class="device-info-item">
                            <span class="info-label">设备类型：</span>
                            <span class="info-value">{{ item.deviceType }}</span>
                        </div>
                        <div class="device-info-item">
                            <span class="info-label">设备编号：</span>
                            <span class="info-value">{{ item.deviceNumber }}</span>
                        </div>
                    </div>
                    <div class="history-divider" v-if="index < historyDeviceData.length - 1"></div>
                </div>
            </div>
        </el-dialog>
        <!-- 绑定 -->
        <el-dialog title="确认绑定" :visible.sync="bindDialogVisible" width="400px" :close-on-click-modal="false" center
            class="custom-bind-dialog">
            <div style="text-align:center;font-size:16px;padding: 20px 0;">
                确定要绑定该设备吗？
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="bindDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBind">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import orgselect from '../../../comounts/orgselect.vue'
import { getrelationship, getuserinfo, getbinddevice, getdevicebind, getdeviceun } from '../../../../api/deviceuser'

export default {
    name: 'DeviceWarehouse',
    components: { orgselect },
    data() {
        return {
            filterForm: {
                userName: '',
                serialNumber: '',
                physicalStatus: '',
                pageSize: 10,
                pageNum: 1,
                orgId: ''
            },
            aa: [],
            userauth: sessionStorage.getItem('roleName'),
            bindDialogVisible: false, // 控制绑定确认弹窗
            bindRow: null, // 当前需要绑定的行数据
            orgSelectKey: 0,
            totalItems: 0,
            relationshipOptions: [],
            tableData: [],
            currentViewData: {},
            historyDeviceDialogVisible: false,
            historyDeviceData: [],
            userDetailMap: {
                userName: { label: '用户名称', field: 'userName' },
                sex: { label: '成员性别', field: 'sex' },
                birthDay: { label: '出生日期', field: 'birthDay' },
                age: { label: '年龄', field: 'age' },
                height: { label: '身高', field: 'height' },
                weight: { label: '体重', field: 'weight' },
                serialNumber: { label: '手机号码', field: 'serialNumber' },
                emergencyContactName: { label: '紧急联系人姓名', field: 'emergencyContactName' },
                emergencyContactPhone: { label: '紧急联系人电话', field: 'emergencyContactPhone' },
                emergencyContactRelation: { label: '紧急联系人关系', field: 'emergencyContactRelation' },
                waistline: { label: '腰围', field: 'waistline' },
                address: { label: '居住地址', field: 'address' },
                personnelCategory: { label: '人员类别', field: 'personnelCategory' },
                maritalStatus: { label: '婚姻状况', field: 'maritalStatus' },
                livingSituation: { label: '居住情况', field: 'livingSituation' },
                bodyStatus: { label: '身体状况', field: 'bodyStatus' },
                medicalHistoryType: { label: '疾病史类型', field: 'medicalHistoryType' }
            }
        }
    },
    methods: {
        handleUnbind(row) {
            this.$confirm('您确定要解绑该设备吗？', '提示', {
                type: 'warning'
            }).then(async () => {
                try {
                    const payload = {
                        userId: row.userId,
                        deviceId: row.deviceId
                    }
                    const res = await getdeviceun(payload)
                    if (res.code === '200') {
                        this.$message.success('解绑成功')
                        // 刷新表格，确保最新状态
                        this.getLoginLog()
                    } else {
                        this.$message.error(res.msg || '解绑失败')
                    }
                } catch (err) {
                    this.$message.error('解绑失败，请稍后再试')
                    console.error('解绑失败:', err)
                }
            }).catch(() => { })
        },
        handleBind(row) {
            if (!row.deviceId) {
                this.$message.warning('请输入设备编号后再绑定')
                return
            }
            this.bindRow = row
            this.bindDialogVisible = true
        },
        async confirmBind() {
            if (!this.bindRow) return

            const payload = {
                userId: this.bindRow.userId,
                deviceId: this.bindRow.deviceId,
                height: this.bindRow.height,
                userName: this.bindRow.userName,
                sex: this.bindRow.sex,
                weight: this.bindRow.weight,
                birthDay: this.bindRow.birthDay,
                address: this.bindRow.address,
                age: this.bindRow.age

            }
            try {
                const res = await getdevicebind(payload)
                if (res.code === '200') {
                    this.$message.success('绑定成功')
                    this.bindDialogVisible = false
                    this.getLoginLog() // 刷新表格
                } else {
                    this.$message.error(res.msg || '绑定失败')
                }
            } catch (err) {
                // console.error('绑定失败:', err)
                throw err
            }
        },
        calculateAge(birthDate) {
            if (!birthDate) return ''
            const birth = new Date(birthDate)
            const today = new Date()
            let age = today.getFullYear() - birth.getFullYear()
            const monthDiff = today.getMonth() - birth.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--
            }
            return age
        },
        handleSizeChange(newSize) {
            this.filterForm.pageSize = newSize
            this.filterForm.pageNum = 1
            this.getLoginLog()
        },
        handleCurrentChange(newPage) {
            this.filterForm.pageNum = newPage
            this.getLoginLog()
        },
        handleOrgSelect(selectedNode) {
            this.aa = selectedNode.orgIds;
            this.getLoginLog();
            this.filterForm.pageNum = 1;   // 切换机构时回到第一页
            // 自动请求接口
        },
        async getLoginLog() {
            const params = {
                pageNum: this.filterForm.pageNum,
                pageSize: this.filterForm.pageSize,
                serialNumber: this.filterForm.serialNumber,
                orgList: this.aa,
                userName: this.filterForm.userName
            }
            const res = await getbinddevice(params)
            this.totalItems = res.data.total || 0
            // 保证每行数据都有 deviceId 字段
            this.tableData = (res.data.data || []).map(item => ({
                ...item,
                age: this.calculateAge(item.birthDay),
                deviceId: item.deviceId || '',       // 确保有 deviceId 字段
                isBound: !!item.deviceId             // 如果接口返回了 deviceId，就算已绑定
            }))

        }
        ,
        async getrelationshis() {
            try {
                const res = await getrelationship({ compId: 'RELATION_SHIP_TYPE' })
                if (res.code === '200') {
                    this.relationshipOptions = res.data.map(item => ({ value: item, label: item }))
                }
            } catch (error) {
                console.error('获取关系失败:', error)
            }
        },
        handleReset() {
            this.filterForm = { userName: '', serialNumber: '', physicalStatus: '', pageSize: 10, pageNum: 1, orgId: [] }
            this.orgSelectKey += 1
            this.totalItems = 0
        },

        calculateAge(birthDate) {
            if (!birthDate) return '';
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        },
        async handleQuery() {
            this.filterForm.pageNum = 1
            await this.getLoginLog()
        },
        handleViewDetails(row) {
            this.currentViewData = { ...row }
            this.dialogVisible = true
            getuserinfo({ userId: row.userId }).then(res => {
                res.data.age = this.calculateAge(res.data.userInfo.birthDay)
                this.currentViewData = res.data
            })
        },
        handleUserHistoryDevice() {
            this.historyDeviceDialogVisible = true
        }
    },
    mounted() {
        this.getrelationshis()
        // this.getLoginLog()
    }
}
</script>

<style scoped>
.userId-cell {
    color: #089BAB;
    cursor: pointer;
    /* text-decoration: underline; */
}

.userId-cell:hover {
    color: #067a87;
}

/* Base layout */
.boxbig {
    background-color: #f5f7fa;
    height: 100%;
    overflow: auto;
    position: relative;
    height: calc(100vh - 200px);
}

/* Sidebar Styles */
.sidebar {
    width: 240px;
    background: #FFFFFF;
    border-radius: 20px;
    padding: 20px 0;
    margin-right: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    /* Set height to match main-content */
    display: flex;
    flex-direction: column;
    height: 700px;
}

.sidebar-title {
    font-weight: 500;
    font-size: 18px;
    color: #121A2D;
    padding: 0 20px 20px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 10px;
}

.sidebar-item {
    padding: 12px 20px;
    font-size: 14px;
    height: 40px;
    color: #666;
    cursor: pointer;
    transition: background-color 0.2s;
    line-height: 40px;
}

.sidebar-item:hover {
    background-color: rgba(8, 155, 171, 0.05);
}

.sidebar-item.active {
    background: rgba(8, 155, 171, 0.1412);
    color: #089BAB;
    font-weight: 500;
}

/* Main Content Area */
.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* Section Header Styles (for "筛选查询" and "设备用户") */
.section-header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
}

.section-title-indicator {
    width: 4px;
    height: 24px;
    background: #089BAB;
    border-radius: 10px;
    margin-top: 3px;
}

.section-title {
    font-weight: 500;
    font-size: 18px;
    color: #121A2D;
    line-height: 30px;
    margin-left: 10px;
}

/* Filter Area Styles */
.filter-area {
    width: 100%;
    background: #FFFFFF;
    border-radius: 20px;
    padding-top: 30px;
    padding-bottom: 30px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.filter-row {
    display: flex;
    align-items: center;
    gap: 30px;
    flex-wrap: wrap;
}

.filter-item {
    display: flex;
    align-items: center;
}

.filter-label {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    margin-right: 10px;
}

.filter-input,
.filter-select {
    width: 232px;
}

.filter-buttons {
    margin-left: auto;
    display: flex;
    gap: 10px;
}

/* Section Header with Actions Styles */
.section-header-with-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 40px;
    margin-top: 10px;
}

.section-title-group {
    display: flex;
    align-items: center;
}

.section-title-group .section-title-indicator {
    margin-top: 8px;
}

.section-title-group .section-title {
    line-height: 40px;
}

.action-buttons {
    display: flex;
    gap: 15px;
}

/* Data Table Styles */
.data-table-container {
    width: 100%;
    background: #FFFFFF;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

/* Pagination Styles */
.pagination-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 20px;
    gap: 30px;
}

.pagination-info {
    font-size: 12px;
    color: #666;
}

/* Dialog Body Styles */
.dialog-body {
    padding: 20px 0;
}

/* View Detail Dialog Specific Styles */
.detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px 30px;
    margin-bottom: 20px;
}

.detail-item {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
}

.detail-label {
    white-space: nowrap;
    margin-right: 10px;
    color: #333;
    min-width: 120px;
    text-align: right;
}

.detail-label.required::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}

.detail-value {
    flex: 1;
    color: #666;
}

.section-header-small {
    display: flex;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 10px;
}

.section-header-small .section-title-indicator {
    height: 18px;
    margin-top: 0;
}

.section-header-small .section-title {
    font-size: 16px;
    line-height: 1;
}

/* History Device Dialog Styles */
.history-device-content {
    max-height: 500px;
    overflow-y: auto;
}

.history-item {
    padding: 20px 0;
}

.history-date {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.date-label {
    font-size: 14px;
    color: #089BAB;
    font-weight: 500;
    min-width: 80px;
}

.date-value {
    font-size: 14px;
    color: #333;
}

.device-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px 30px;
    padding-left: 80px;
}

.device-info-item {
    display: flex;
    align-items: center;
    font-size: 14px;
}

.info-label {
    color: #666;
    min-width: 80px;
    text-align: right;
    margin-right: 10px;
}

.info-value {
    color: #333;
    flex: 1;
}

.history-divider {
    height: 1px;
    background-color: #f0f0f0;
    margin: 20px 0;
}

/* Edit Form Styles */
.edit-form {
    padding: 10px 0;
}

.form-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.form-label {
    font-size: 14px;
    color: #333;
    white-space: nowrap;
    min-width: 120px;
    text-align: right;
    margin-right: 10px;
}

.form-label.required::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}

/* Utility classes for spacing */
.mt-4 {
    margin-top: 1rem;
}

.mt-6 {
    margin-top: 1.5rem;
}

.ml-auto {
    margin-left: auto;
}

.ml-2 {
    margin-left: 0.5rem;
}

/* Element UI Custom Styles */
.el-form-item__label {
    text-align: right !important;
    padding-right: 12px !important;
}

.el-table th {
    background-color: rgba(8, 155, 171, 0.1412) !important;
}

.el-button--primary {
    background-color: #089BAB;
    border-color: #089BAB;
}

.el-button--primary:hover {
    background-color: #067a87;
    border-color: #067a87;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #089BAB;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #089BAB;
}

/* Action text color */
.action-text {
    color: #089BAB !important;
}

/* 加圆角 */
:deep(.custom-bind-dialog .el-dialog) {
    border-radius: 20px;
    overflow: hidden;
    /* 防止内容溢出破坏圆角 */
}
</style>

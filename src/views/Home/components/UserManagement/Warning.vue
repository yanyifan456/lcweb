<template>
    <div class="boxbig" ref="container">
        <!-- 筛选查询区域 -->
        <div style="width: 500px;height: 30px;display: flex;">
            <div class="box-a"></div>
            <div class="box-b">筛选查询</div>
        </div>
        <div class="box-c">
            <!-- 第一行：机构 + 时间 -->
            <div class="filter-row">
                <div class="filter-item">
                    <span class="filter-label">选择机构：</span>
                    <jigou style="width: 300px;" ref="jigouRef" @node-selected="handleOrgSelected" />
                </div>
                <div class="filter-item">
                    <span class="filter-label">时间范围：</span>
                    <el-date-picker v-model="dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd" class="filter-input" @change="handleDateChange" />
                </div>
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
            <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
            <el-table-column prop="deviceId" label="设备ID" align="center"></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop="content" label="事件内容" align="center"></el-table-column>
            <el-table-column label="事件等级" align="center">
                <template slot-scope="scope">
                    <span :type="scope.row.level === 'urgent' ? 'danger' : 'info'" size="mini">
                        {{ scope.row.level === 'urgent' ? '紧急' : '正常' }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="eventType" label="事件类型 " align="center"></el-table-column>
            <el-table-column label="是否已读" align="center">
                <template slot-scope="scope">
                    <span>
                        {{ scope.row.readFlag === '1' ? '已读' : '未读' }}
                    </span>
                </template>

            </el-table-column>
            <el-table-column prop="numberValue" label="告警数值" align="center"></el-table-column>
            <el-table-column label="是否处理" align="center">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.operateFlag === '1' ? 'success' : 'danger'" size="mini">
                        {{ scope.row.operateFlag === '1' ? '已处理' : '未处理' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column fixed="operateTime" prop="处理时间" label="检验人" align="center"></el-table-column>
            <el-table-column fixed="address" prop="SOS地址" label="检验人" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="200"
                v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))">
                <template slot-scope="scope">
                    <!-- 添加详情按钮点击事件 -->
                    <el-button type="text" class="action-text" @click="handleDetail(scope.row)">详情</el-button>
                    <!-- 根据operateFlag显示不同状态的处理按钮，未处理红色可点击，已处理绿色不可点击 -->
                    <el-button v-if="scope.row.operateFlag === '0'" type="text" class="action-text-danger"
                        @click="handleOperate(scope.row)">
                        未处理
                    </el-button>
                    <el-button v-else type="text" class="action-text-success" disabled>
                        已处理
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 添加分页组件 -->
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <!-- 添加详情弹窗，展示完整的事件信息 -->
        <el-dialog title="事件详情" :visible.sync="detailDialogVisible" width="600px">
            <div v-if="detailData" class="detail-content">
                <el-form label-width="120px">
                    <el-form-item label="事件ID：">
                        <span>{{ detailData.eventId }}</span>
                    </el-form-item>
                    <el-form-item label="用户姓名：">
                        <span>{{ detailData.userName }}</span>
                    </el-form-item>
                    <el-form-item label="用户ID：">
                        <span>{{ detailData.userId }}</span>
                    </el-form-item>
                    <el-form-item label="设备ID：">
                        <span>{{ detailData.deviceId }}</span>
                    </el-form-item>
                    <el-form-item label="事件等级：">
                        <el-tag :type="detailData.level === 'urgent' ? 'danger' : 'info'" size="mini">
                            {{ detailData.level === 'urgent' ? '紧急' : '正常' }}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="事件类型：">
                        <span>{{ detailData.eventType }}</span>
                    </el-form-item>
                    <el-form-item label="事件内容：">
                        <span>{{ detailData.content }}</span>
                    </el-form-item>
                    <el-form-item label="告警数值：">
                        <span>{{ detailData.numberValue || '-' }}</span>
                    </el-form-item>
                    <el-form-item label="是否已读：">
                        <span>{{ detailData.readFlag === '1' ? '未读' : '已读' }}</span>
                    </el-form-item>
                    <el-form-item label="是否处理：">
                        <el-tag :type="detailData.operateFlag === '0' ? 'danger' : 'success'" size="mini">
                            {{ detailData.operateFlag === '1' ? '已处理' : '未处理' }}
                        </el-tag>
                    </el-form-item>
                    <el-form-item label="创建时间：">
                        <span>{{ detailData.createTime }}</span>
                    </el-form-item>
                    <el-form-item label="处理时间：">
                        <span>{{ detailData.operateTime || '-' }}</span>
                    </el-form-item>
                    <el-form-item label="SOS地址：">
                        <span>{{ detailData.address || '-' }}</span>
                    </el-form-item>
                    <el-form-item label="经度：" v-if="detailData.lng">
                        <span>{{ detailData.lng }}</span>
                    </el-form-item>
                    <el-form-item label="纬度：" v-if="detailData.lat">
                        <span>{{ detailData.lat }}</span>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailDialogVisible = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { list, detail, update } from '@/api/warning'
import jigou from '../../../comounts/orgselectcopy.vue'
export default {
    name: 'Warning',
    components: { jigou },
    data() {
        return {
            tabedata: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            orgId: '',
            dateRange: ['', ''],
            startTime: '',
            endTime: '',
            detailDialogVisible: false,
            detailData: null,
            userauth: sessionStorage.getItem('roleName'),

        }
    },
    methods: {
        handleDateChange(val) {
            if (val && val.length === 2) {
                this.startTime = val[0]
                this.endTime = val[1]
            } else {
                this.startTime = ''
                this.endTime = ''
            }
            this.pageNum = 1
            this.getTableData()
        },
        async getTableData() {
            let params = {
                pageSize: this.pageSize,
                pageNum: this.pageNum,
                orgId: this.orgId,
                startTime: this.startTime,
                endTime: this.endTime
            }
            let res = await list(params)
            this.tabedata = res.data.data
            this.total = res.data.total || res.data.data.length


        },

        async handleDetail(row) {
            try {
                const res = await detail({ eventId: row.eventId })
                if (res.code === '200') {
                    this.detailData = res.data.data
                    this.detailDialogVisible = true
                } else {
                    this.$message.error(res.msg || '获取详情失败')
                }
            } catch (error) {
                this.$message.error('获取详情失败')
                console.error(error)
            }
        },

        async handleOperate(row) {
            try {
                this.$confirm('确认标记为已处理？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    const res = await update({ eventId: row.eventId })
                    if (res.code === '200') {
                        this.$message.success(res.data.message || '处理成功')
                        // 刷新列表
                        this.getTableData()
                    } else {
                        this.$message.error(res.msg || '处理失败')
                    }
                }).catch(() => {
                    this.$message.info('已取消')
                })
            } catch (error) {
                this.$message.error('操作失败')
                console.error(error)
            }
        },

        handleSizeChange(val) {
            this.pageSize = val
            this.pageNum = 1
            this.getTableData()
        },

        handleCurrentChange(val) {
            this.pageNum = val
            this.getTableData()
        },

        handleOrgSelected(node) {
            this.orgId = node.orgId
            this.pageNum = 1
            this.getTableData()
        }
    },

}
</script>


<style scoped>
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
    font-weight: 500;
    font-size: 18px;
    color: #121A2D;
    line-height: 30px;
    margin-left: 10px;
}

.box-c {
    width: 100%;
    background: #FFFFFF;
    border-radius: 20px;
    margin-top: 20px;
    padding: 30px 0;
}

.filter-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.filter-item {
    display: flex;
    align-items: center;
    margin-left: 20px;
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
    border-radius: 10px;
}

.filter-input .el-input__inner {
    border: 1px solid rgba(8, 155, 171, 0.4);
    border-radius: 8px;
    height: 36px;
}

.filter-input .el-input__inner:focus {
    border-color: #089BAB;
}

.filter-buttons {
    margin-left: auto;
    margin-right: 20px;
    display: flex;
    gap: 10px;
}

.reset-btn {
    background: rgba(136, 140, 150, 0.16);
    border: 1px solid #ddd;
    color: #666;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
}

.reset-btns {
    background: white;
    height: 45px;
    border: 1px solid #ddd;
    color: #666;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
}

.query-btn {
    background-color: #089BAB;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
}

.query-btn:hover {
    background-color: #089BAB;
}

.aasd {
    background-color: transparent !important;
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

.filter-input {
    width: 232px;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
}

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

.action-text {
    color: #089BAB !important;
}

/* 添加已处理和未处理按钮样式 */
.action-text-success {
    color: #67C23A !important;
    cursor: not-allowed !important;
}

.action-text-danger {
    color: #F56C6C !important;
}

/* 添加分页容器样式 */
.pagination-container {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
    background: #FFFFFF;
    border-radius: 0 0 20px 20px;
}

/* 添加详情弹窗内容样式 */
.detail-content {
    max-height: 500px;
    overflow-y: auto;
}

.detail-content .el-form-item {
    margin-bottom: 15px;
}

.detail-content .el-form-item__label {
    color: #666;
    font-weight: 500;
}

.detail-content .el-form-item__content {
    color: #333;
}
</style>

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
                    <span class="filter-label">选择机构：</span>
                    <jigou style="width: 300px;" ref="jigouRef" @node-selected="handleOrgSelected"></jigou>
                </div>
                <!-- 用户名称 -->
                <div class="filter-item" style="margin-left: 30px;">
                    <span class="filter-label">检测日期</span>
                    <el-date-picker v-model="filterForm.date" type="date" placeholder="选择日期" style="width: 200px;"
                        value-format="yyyy-MM-dd" />


                </div>
                <div class="filter-item" style="margin-left: 30px;">
                    <span class="filter-label">导入日期</span>
                    <el-date-picker v-model="filterForm.daoru" type="date" placeholder="选择日期" style="width: 200px;"
                        value-format="yyyy-MM-dd" />


                </div>
                <div class="filter-buttons">
                    <el-button class="reset-btn" @click="handleReset">重置</el-button>
                    <el-button class="query-btn" @click="handleQuery">查询</el-button>
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
            <template #empty>
                <el-empty description="暂无数据"></el-empty>
            </template>
            <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center"></el-table-column>
            <!-- <el-table-column prop="age" label="年龄" align="center"></el-table-column> -->
            <el-table-column prop="spectype" label="标本类型" align="center"></el-table-column>
            <el-table-column prop="specCode" label=" 代码" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="projectName" label="检验项目 " align="center"></el-table-column>
            <el-table-column prop="result" label="结果 " align="center"></el-table-column>
            <el-table-column prop="referenceValue" label="参考值" align="center"></el-table-column>
            <el-table-column prop="unit" label="单位" align="center"></el-table-column>
            <el-table-column prop="inspectTime" label="检验日期" align="center"></el-table-column>
            <el-table-column fixed="right" prop="inspectStaff" label="检验人" align="center"></el-table-column>
        </el-table>
        <div style="margin-top: 20px; text-align: right;">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="totalItems" />
        </div>
    </div>
</template>
<script>
import jigou from '../../../comounts/orgselectcopy.vue'
import { getlist } from '../../../../api/medicalExamQry'

export default {
    name: 'DeviceWarehouse',
    components: { jigou },
    data() {
        return {
            filterForm: {
                date: '',
                daoru: ""
            },
            tabedata: [],
            currentEditId: null,
            deleteId: null,
            selectedOrgId: null,
            serviceForm: {},
            currentPage: 1,
            pageSize: 10,
            totalItems: 0
        }
    },
    methods: {
        handleOrgSelected(orgData) {
            this.selectedOrgId = orgData.orgId;
        },
        handleReset() {
            this.filterForm.date = '';
            this.filterForm.daoru = '';
            this.selectedOrgId = '';
            this.tabedata = [];
            this.$refs.jigouRef.reset();

            // ✅ 重置分页
            this.currentPage = 1;
            this.pageSize = 10;
            this.totalItems = 0;
        }
        ,
        handleQuery() {
            if (this.selectedOrgId) {
                this.currentPage = 1; // 查询时重置到第一页
                this.getTableData();
            } else {
                this.$message.warning('请先选择机构');
            }
        },
        async getTableData() {
            const res = await getlist({
                orgId: this.selectedOrgId,
                inspectTime: this.filterForm.date,
                createTime: this.filterForm.daoru,
                currentPage: this.currentPage,
                pageSize: this.pageSize
            });
            if (res.code === '200') {
                this.tabedata = res.data.data;
                this.totalItems = res.data.total; // ✅ 接口里返回的总数
            }
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.currentPage = 1; // 改变每页大小后回到第一页
            this.getTableData();
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.getTableData();
        },
    }
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
</style>

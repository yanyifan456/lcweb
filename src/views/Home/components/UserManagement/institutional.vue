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
          <div class="filter-item">
            <span class="filter-label">选择机构:</span>
            <orgselects :key="orgSelectKey" style="width: 232px" @node-selected="handleOrgSelect" />
          </div>

          <!-- 新增检测类型 -->
          <div class="filter-item">
            <span class="filter-label">检测类型：</span>
            <el-select v-model="filterForm.type" placeholder="请选择" class="filter-select">
              <el-option label="AI检测" value="cvd"></el-option>
              <el-option label="心电检测" value="ecg"></el-option>
            </el-select>
          </div>

          <!-- 新增检测日期 -->
          <div class="filter-item">
            <span class="filter-label">检测日期：</span>
            <el-date-picker v-model="time" type="daterange" align="right" unlink-panels start-placeholder="开始日期"
              end-placeholder="结束日期" :picker-options="pickerOptions" class="filter-input" @change="handleDateChange" />
          </div>
          <div class="filter-buttons" style="margin-right: 30px">
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
        <el-table :data="tableData" border style="width: 100%; border-radius: 20px 20px 0 0" :header-cell-style="{
          height: '60px',
          background: 'rgba(136, 140, 150, 0.07)',
          fontSize: '14px',
          fontWeight: '500',
          color: '#333',
        }" :cell-style="{ fontSize: '14px', color: '#666' }" :row-style="{ height: '60px' }">
          <!-- 只保留需要的字段：手机号、用户名、年龄、性别、体重、检测日期 -->
          <el-table-column prop="userName" label="用户名" align="center" />
          <el-table-column prop="serialNumber" label="手机号" align="center" />
          <el-table-column prop="age" label="年龄" align="center" />
          <el-table-column prop="sex" label="性别" align="center" />
          <el-table-column prop="weight" label="体重(kg)" align="center" />
          <el-table-column prop="orgName" label="所属机构" align="center" />
          <el-table-column prop="detectType" label="报告类型" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.detectType == 'cvd'"> AI检测 </el-tag>
              <el-tag v-else type="info"> 心电检测 </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="flag" label="报告状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.flag == 0" type="danger"> 未生成 </el-tag>
              <el-tag v-else-if="scope.row.flag == 1" type="info"> 生成中 </el-tag>
              <el-tag v-else type="success"> 已生成 </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="createTime" label="检测日期" align="center" />
          <!-- 操作列改为生成报告和下载报告 -->
          <el-table-column label="操作" align="center" width="180"
            v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))">
            <template #default="scope">
              <el-button type="text" v-if="scope.row.flag == 0" class="action-text"
                @click="handleGenerateReport(scope.row)">
                生成报告
              </el-button>
              <!-- <el-button type="text" v-else-if="scope.row.flag == 1" class="action-text"> 正在生成中 </el-button>
              <el-button type="text" v-else class="action-text"> 查看详情 </el-button> -->

              <el-button type="text" v-if="scope.row.flag == 2" class="action-text"
                @click="handleDownloadReport(scope.row)">
                下载报告
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
  </div>
</template>
<script>
import orgselects from "../../../comounts/orgselects.vue";
import { getbinddevice } from "../../../../api/deviceuser";
import dayjs from "dayjs";
import {
  getList,
  generateDayReport,
  generateEcgDayReport,
  downloadEcgReport,
  downloadCvdReport,
} from "../../../../api/orgReport";

export default {
  name: "DeviceWarehouse",
  components: { orgselects },
  data() {
    return {
      filterForm: {
        pageSize: 10,
        currentPage: 1,
        orgId: "",
        mainOrg: sessionStorage.getItem("mainOrg"),
        startTime: "",
        endTime: "",
        type: "",
      },
      time: "",
      orgSelectKey: 0,
      totalItems: 0,
      tableData: [],
      userauth: sessionStorage.getItem('roleName'),

      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  methods: {
    calculateAge(birthDate) {
      if (!birthDate) return "";
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    },
    handleSizeChange(newSize) {
      this.filterForm.pageSize = newSize;
      this.filterForm.currentPage = 1;
      //   this.getLoginLog();
      this.getData();
    },
    handleCurrentChange(newPage) {
      this.filterForm.currentPage = newPage;
      this.getData();
      //   this.getLoginLog();
    },
    async getLoginLog() {
      return;
      if (!this.filterForm.orgId) {
        this.$message.warning("请先选择机构");
        return;
      }

      const params = {
        pageNum: this.filterForm.pageNum,
        pageSize: this.filterForm.pageSize,
        serialNumber: this.filterForm.serialNumber,
        orgId: this.filterForm.orgId,
        userName: this.filterForm.userName,
        testDate: this.filterForm.testDate,
        testType: this.filterForm.testType,
      };
      const res = await getbinddevice(params);
      this.totalItems = res.data.total || 0;
      // 保证每行数据都有 deviceId 字段
      this.tableData = (res.data.data || []).map((item) => ({
        ...item,
        age: this.calculateAge(item.birthDay),
        deviceId: item.deviceId || "", // 确保有 deviceId 字段
        isBound: !!item.deviceId, // 如果接口返回了 deviceId，就算已绑定
      }));
    },
    async getrelationshis() {
      try {
        const res = await getrelationship({ compId: "RELATION_SHIP_TYPE" });
        if (res.code === "200") {
          this.relationshipOptions = res.data.map((item) => ({ value: item, label: item }));
        }
      } catch (error) {
        console.error("获取关系失败:", error);
      }
    },
    handleReset() {
      this.filterForm = {
        pageSize: 10,
        currentPage: 1,
        orgId: "",
        mainOrg: sessionStorage.getItem("mainOrg"),
        startTime: "",
        endTime: "",
        type: "",
      };
      this.orgSelectKey += 1;
      this.totalItems = 0;
    },
    handleOrgSelect(selectedNode) {

      this.filterForm.orgId = selectedNode.orgId;
      this.filterForm.pageNum = 1; // 切换机构时回到第一页
      this.getLoginLog(); // 自动请求接口
    },
    async handleQuery() {
      this.filterForm.pageNum = 1;
      if (!this.filterForm.orgId) {
        this.$message.warning("请先选择机构");
        return;
      }
      if (!this.filterForm.startTime) {
        this.$message.warning("请选择时间");
        return;
      }
      if (!this.filterForm.type) {
        this.$message.warning("请选择类型");
        return;
      }


      this.getData();
      return;
      await this.getLoginLog();
    },

    handleUserHistoryDevice() {
      this.historyDeviceDialogVisible = true;
    },
    handleGenerateReport(row) {
      this.$confirm("确定要生成报告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 判断报告类型 调用不同类型
          if (row.detectType == "cvd") {
            this.generateReport(row.id);
          } else {
            this.createEcgReport(row.id);
          }
        })
        .catch(() => { });
    },
    handleDownloadReport(row) {
      this.$confirm("确定要下载报告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (row.detectType == "cvd") {
            window.location.href = `http://116.62.88.37:18080/apphealth/report/download?id=${row.id}`;
          } else {
            window.location.href = `http://116.62.88.37:18080/apphealth/ecgreport/download?id=${row.id}`;
          }
        })
        .catch(() => { });
    },
    confirmBind() { },

    handleDateChange(val) {
      if (Array.isArray(val) && val.length === 2) {
        this.filterForm.startTime = dayjs(val[0]).format("YYYY-MM-DD");
        this.filterForm.endTime = dayjs(val[1]).format("YYYY-MM-DD");
      } else {
        this.filterForm.startTime = "";
        this.filterForm.endTime = "";
      }

    },
    // 获取数据
    async getData() {

      const params = {
        mainOrg: this.filterForm.orgId,
        startTime: this.filterForm.startTime,
        endTime: this.filterForm.endTime,
        detectType: this.filterForm.type,
        currentPage: this.filterForm.currentPage,
        pageSize: this.filterForm.pageSize,
      };

      try {
        const res = await getList(params);

        if (res.code == 200) {
          this.totalItems = res.data.total;
          this.tableData = res.data.records;
        }
      } catch (error) {

      } finally {
      }
    },
    // 生成cvd报告
    async generateReport(id) {
      const params = {
        feinggerSourceId: id,
      };
      try {
        const res = await generateDayReport(params);

        if (res.code == 200) {
          this.getData();
        }
      } catch (error) {

      } finally {
        // this.getData();
      }
    },
    // 生成ecg报告
    async createEcgReport(id) {
      const params = {
        feinggerSourceId: id,
      };
      try {
        const res = await generateEcgDayReport(params);

        if (res.code == 200) {
          this.getData();
        }
      } catch (error) {

      } finally {
      }
    },
    // 下载ecg报告
    async downloadEcg(id) {
      try {
        const res = await downloadEcgReport(id);

        if (res.code == 200) {
          return;
          this.getData();
        }
      } catch (error) {

      } finally {
      }
    },
    // 下载cvd报告
    async downloadCvd(id) {
      try {
        const res = await downloadCvdReport(id);

        if (res.code == 200) {
          return;
          this.getData();
        }
      } catch (error) {

      } finally {
      }
    },
  },
  mounted() {
    // this.getrelationshis();
    // this.getLoginLog();
  },
};
</script>

<style scoped>
.userId-cell {
  color: #089bab;
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
  background: #ffffff;
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
  color: #121a2d;
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
  color: #089bab;
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
  background: #089bab;
  border-radius: 10px;
  margin-top: 3px;
}

.section-title {
  font-weight: 500;
  font-size: 18px;
  color: #121a2d;
  line-height: 30px;
  margin-left: 10px;
}

/* Filter Area Styles */
.filter-area {
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  padding-left: 20px;
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
  background: #ffffff;
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
  content: "*";
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
  color: #089bab;
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
  content: "*";
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
  background-color: #089bab;
  border-color: #089bab;
}

.el-button--primary:hover {
  background-color: #067a87;
  border-color: #067a87;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #089bab;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #089bab;
}

/* Action text color */
.action-text {
  color: #089bab !important;
}

/* 加圆角 */
:deep(.custom-bind-dialog .el-dialog) {
  border-radius: 20px;
  overflow: hidden;
  /* 防止内容溢出破坏圆角 */
}
</style>

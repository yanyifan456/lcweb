<template>
  <div class="boxbig" ref="container">
    <!-- 筛选查询区域 -->
    <div style="width: 500px; height: 30px; display: flex">
      <div class="box-a"></div>
      <div class="box-b">筛选查询</div>
    </div>
    <div class="box-c">
      <!-- 第一行：设备类型、状态 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">设备类型：</span>
          <el-input v-model="typeValue" placeholder="请输入" class="filter-input"></el-input>
        </div>
        <div class="filter-item">
          <span class="filter-label" style="margin-left: 27px">状态：</span>
          <el-select v-model="typeStatus" placeholder="请选择">
            <el-option v-for="item in typeStatusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="filter-buttons">
          <el-button class="reset-btn" @click="handleReset">重置</el-button>
          <el-button class="query-btn" @click="handleQuery">查询</el-button>
        </div>
      </div>
    </div>
    <!-- 设备类型标题和操作按钮 -->
    <div style="
        width: 100%;
        height: 40px;
        display: flex;
        margin-top: 30px;
        justify-content: space-between;
      ">
      <div style="display: flex">
        <div class="box-aa"></div>
        <div class="box-cc">设备类型</div>
      </div>
      <div v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))" style="display: flex">
        <el-button class="add-btn" @click="handleAdd" icon="el-icon-plus">
          新建
        </el-button>
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

      <el-table-column prop="typeName" label="设备类型" align="center">
      </el-table-column>
      <el-table-column prop="typeRemark" label="备注" align="center">
      </el-table-column>
      <el-table-column prop="typeFlag" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeFlag == "1" ? "启用" : "未启用" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createBy" label="创建人" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))" class="aasd"
        fixed="right" style="margin-top: 0" label=" 操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small" class="action-btn edit-btn" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" class="action-btn detail-btn"
            @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block">
      <div style="
          display: flex;
          float: right;
          margin-top: 30px;
          align-items: center;
        ">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems">
        </el-pagination>
      </div>
    </div>
    <createDeviceType :dialogValue="dialogValue" :title="title" :onDialog="onDialog" :actionType="actionType"
      :row="row" />

    <!-- 删除弹窗 -->
    <el-dialog title="删除" :visible.sync="delDialog" :close-on-click-modal="false" :close-on-press-escape="false"
      class="import-dialog" width="500px">
      <div style="font-size: 16px" v-if="!isDel">
        <i class="el-icon-warning" style="color: orange"></i>
        请再次确认是否删除此设备类型！
      </div>
      <div style="font-size: 16px" v-if="isDel">
        该设备类型下有设备，请先删除设备！
      </div>

      <div slot="footer" class="dialog-footer" v-if="!isDel">
        <el-button class="cancel-btn" @click="onDelCancel"> 取消 </el-button>
        <el-button class="confirm-btn" @click="onDelConfirm"> 确认 </el-button>
      </div>
      <div slot="footer" class="dialog-footer" v-if="isDel">
        <el-button class="confirm-btn" @click="onKnow"> 知道了 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, deleteDeviceType } from "@/api/deviceType";
import CreateDeviceType from "./CreateDeviceType.vue";
export default {
  name: "Type",
  components: {
    CreateDeviceType,
  },
  data() {
    return {
      // 查询相关
      typeValue: "",
      typeStatus: "",
      typeStatusList: [
        {
          label: "启用",
          value: "1",
        },
        {
          label: "未启用",
          value: "2",
        },
      ],
      pageSize: 10,
      currentPage: 1,
      totalItems: 0,
      tableData: [],
      userauth: sessionStorage.getItem('roleName'),



      // 弹窗
      dialogValue: false,
      title: "",
      actionType: "",
      row: {},

      // 删除弹窗
      delDialog: false,
      delId: "",
      delName: "",
      isDel: false,
    };
  },
  methods: {
    handleReset() {
      this.typeValue = "";
      this.typeStatus = "";
      this.getData({
        typeName: "",
        typeFlag: "",
        pageSize: 5,
        pageNum: 1,
      });
    },
    handleQuery() {

      const params = {
        typeName: this.typeValue,
        typeFlag: this.typeStatus,
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      };
      this.getData(params);
      // 执行查询逻辑
    },
    handleAdd() {
      // this.$router.push("/QStorageentry");
      this.dialogValue = true;
      this.actionType = "add";
      this.title = "新建";

    },
    handleEdit(row) {

      this.dialogValue = true;
      this.title = "编辑";
      this.actionType = "edit";
      this.row = row;
      // this.$router.push("/BStorageentry");
    },
    onDialog(val) {

      this.dialogValue = val;
      this.getData({
        typeName: "",
        typeFlag: "",
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      });
    },

    // 删除
    handleDelete(row) {

      this.delDialog = true;
      this.delId = row.typeId;
      this.delName = row.typeName;
      // this.currentDevice = row;
      // this.dialogVisible = true;
    },
    async onDelConfirm() {
      try {
        const res = await deleteDeviceType({
          typeId: this.delId,
          typeName: this.delName,
        });
        if (res.msg == "error") {
          this.isDel = true;

        } else if (res.msg == "success") {
          this.$message.success("删除成功");
          this.getData({
            typeName: "",
            typeFlag: "",
            pageSize: this.pageSize,
            pageNum: this.currentPage,
          });
          this.delDialog = false;
          this.isDel = false;

        }
        return;
      } catch (error) { }
    },
    onDelCancel() {
      this.delDialog = false;
    },
    onKnow() {
      this.delDialog = false;
      this.isDel = false;
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.currentPage = 1  // 重置到第一页
      this.getData({
        typeName: "",
        typeFlag: "",
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      });
    },

    // 当前页码变化
    handleCurrentChange(newPage) {
      this.currentPage = newPage
      this.getData({
        typeName: "",
        typeFlag: "",
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      });
    },
    handlePageChange() { },

    /**
     * 查看设备类型
     * @param {Object} params - 查询参数
     * @returns {Promise<Object>} - 获取到的数据
     */
    async getData(params) {
      try {
        const res = await getList(params);
        // 添加id列
        res.data.records.forEach((item, index) => {
          item.id = index + 1;
        });
        this.tableData = res.data.records;
        this.totalItems = res.data.total;

      } catch (error) {
        throw error;
      }
    },
  },
  created() {
    this.getData({
      typeName: "",
      typeFlag: "",
      pageSize: this.pageSize,
      pageNum: this.currentPage,
    });
  },
};
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
  color: #089bab;
}

.filter-icon.active {
  color: #089bab;
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
  background: #089bab;
  border-radius: 10px;
  margin-top: 3px;
}

.box-b {
  font-family: PingFang SC Bold, PingFang SC Bold;
  font-weight: 500;
  font-size: 18px;
  color: #121a2d;
  line-height: 30px;
  margin-left: 10px;
}

.box-aa {
  width: 4px;
  height: 24px;
  background: #089bab;
  border-radius: 10px;
  margin-top: 8px;
}

.box-cc {
  font-family: PingFang SC Bold, PingFang SC Bold;
  font-weight: 500;
  font-size: 18px;
  color: #121a2d;
  line-height: 40px;
  margin-left: 10px;
}

.box-c {
  width: 100%;
  background: #ffffff;
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
  border-color: #089bab;
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
  border-color: #089bab;
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
  background-color: #16c0c0;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-size: 14px;
}

.query-btn:hover {
  background-color: #089bab;
}

.import-btn,
.template-btn {
  background: transparent;
  border: 1px solid rgba(8, 155, 171, 0.4);
  color: #089bab;
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
  background-color: #089bab;
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
  border-color: #089bab;
}

.button-a:hover i {
  color: #089bab;
}

.action-btn {
  padding: 0;
  margin: 0 5px;
  font-size: 14px;
}

.edit-btn {
  color: #089bab;
}

.detail-btn {
  color: #16c0c0;
}

.block {
  width: 100%;
  margin-top: 20px;
}

.custom-pagination {
  background: #eff7f8;
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
  color: #089bab;
  font-weight: 500;
}

.custom-pagination .btn-prev:hover,
.custom-pagination .btn-next:hover,
.custom-pagination .el-pager li:hover {
  color: #089bab;
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
  background: #ffffff;
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
  border-color: #089bab;
  color: #089bab;
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

/* 设备删除弹出框样式 */
.import-dialog /deep/ .el-dialog {
  border-radius: 20px !important;
  background: #ffffff;
}

.import-dialog /deep/ .el-dialog__header {
  text-align: left;
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
  content: "*";
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
  border-color: #089bab;
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
  border-color: #089bab;
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
  color: #089bab;
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
  border-color: #089bab;
  background: #089bab;
}

.status-radio /deep/ .el-radio__input.is-checked+.el-radio__label {
  color: #089bab;
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
  background-color: #16c0c0;
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 8px;
  font-size: 14px;
}

.confirm-btn:hover {
  background-color: #089bab;
}
</style>

<template>
  <div class="boxbig" ref="container">
    <!-- 筛选查询区域 -->
    <div style="width: 500px; height: 30px; display: flex">
      <div class="box-a"></div>
      <div class="box-b">筛选查询</div>
    </div>
    <div class="box-c">
      <!-- 第一行：项目名称 -->
      <div class="filter-row">
        <div class="filter-item">
          <span class="filter-label">项目名称：</span>
          <el-input v-model="projectValue" placeholder="请输入" class="filter-input"></el-input>
        </div>
        <div class="filter-buttons">
          <el-button class="reset-btn" @click="handleReset">重置</el-button>
          <el-button class="query-btn" @click="handleQuery">查询</el-button>
        </div>
      </div>
    </div>
    <div style="
        width: 100%;
        height: 40px;
        display: flex;
        margin-top: 30px;
        justify-content: space-between;
      ">
      <div style="display: flex">
        <div class="box-aa"></div>
        <div class="box-cc">设备检查项目</div>
      </div>
      <div style="display: flex">
        <!-- <el-button class="add-btn" @click="handleAdd" icon="el-icon-plus">
          新建
        </el-button> -->
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
    <el-table :data="tableData" style="width: 100%;border-radius: 20px 20px 0px 0px;margin-top: 30px;"
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

      <el-table-column prop="itemName" label="项目名称" align="center">
      </el-table-column>
      <el-table-column prop="itemNo" label="项目检测编号" align="center">
      </el-table-column>
      <el-table-column prop="itemParam" label="参考参数" align="center" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="itemRemark" label="备注" align="center">
      </el-table-column>

      <el-table-column prop="updateTime" label="更新时间" align="center">
      </el-table-column>
      <el-table-column prop="createBy" label="操作人" align="center">
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
          :page-sizes="[10, 50, 100, 200]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalItems">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getDeviceProject } from "@/api/deviceType";
export default {
  name: "TestingItems",
  data() {
    return {
      projectValue: "",
      tableData: [],

      pageNum: 1,
      pageSize: 10,
      totalItems: 0,
    };
  },
  methods: {
    /**
     * 重置按钮
     */
    handleReset() {
      this.projectValue = "";
      const params = {
        itemName: this.projectValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.getData(params);
    },
    /**
     * 查询按钮
     */
    handleQuery() {

      const params = {
        itemName: this.projectValue,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      this.getData(params);
    },

    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.pageNum = 1  // 重置到第一页
      this.getData({
        itemName: "",
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      });
    },

    // 当前页码变化
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getData({
        itemName: "",
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      });
    },

    // 接口=====⬇

    /**
     * 获取数据
     */
    async getData(params) {
      try {
        const res = await getDeviceProject(params);
        res.data.records.forEach((item, index) => {
          item.id = index + 1;
        });
        this.tableData = res.data.records;
        this.totalItems = res.data.total;

      } catch (error) { }
    },
  },
  created() {
    this.getData({
      itemName: "",
      pageSize: this.pageSize,
      pageNum: this.pageNum,
    });
  },
};
</script>
<style scoped>
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

.box-c {
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  margin-top: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
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
</style>

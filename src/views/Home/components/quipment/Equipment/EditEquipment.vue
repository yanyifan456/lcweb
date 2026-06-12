<template>
  <div class="device-entry-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <div class="title-bar"></div>
        <h2 class="page-title">编辑设备</h2>
      </div>
      <div class="header-right">
        <el-button class="back-btn" @click="goBack">
          <i class="el-icon-back"></i>
          返回上一级
        </el-button>
      </div>
    </div>
    <!-- 主表单区域 -->
    <div class="form-container">
      <el-form :model="deviceForm" :rules="rules" ref="deviceForm" label-width="120px">
        <el-row :gutter="40">
          <el-col :span="8">
            <el-form-item label="设备名称：" prop="deviceName" required style="margin-bottom: 0">
              <!-- 添加 disabled 属性 -->
              <el-input v-model="deviceForm.deviceName" placeholder="请输入" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备类型：" prop="deviceType" required style="margin-bottom: 0">
              <!-- 添加 disabled 属性 -->
              <el-select v-model="deviceForm.deviceType" placeholder="请选择" disabled>
                <el-option v-for="item in deviceTypeList" :key="item.typeId" :label="item.typeName"
                  :value="item.typeId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="设备品牌：" prop="deviceBrand" required style="margin-bottom: 0">
              <!-- 添加 disabled 属性 -->
              <el-select v-model="deviceForm.deviceBrand" placeholder="请选择" disabled>
                <el-option v-for="item in deviceBrandList" :label="item.deviceBrand"
                  :value="item.deviceBrand"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 设备属性区域 -->
    <div class="section-container">
      <div class="section-header">
        <div class="title-bar"></div>
        <h3 class="section-title">检测项目</h3>
        <div class="section-actions">
          <el-button type="primary" icon="el-icon-plus" class="add-btn" @click="addDeviceProperty">
            添加项目
          </el-button>
          <el-button type="danger" icon="el-icon-delete" class="delete-btn" @click="deleteDeviceProperty"
            :disabled="deviceProperties.length === 0">
          </el-button>
        </div>
      </div>

      <div class="table-container">
        <el-table :data="deviceProperties" style="width: 100%" border :header-cell-style="{
          background: '#f8f9fa',
          color: '#333',
          fontWeight: '500',
        }" @selection-change="handlePropertySelectionChange">
          <!-- 添加选择列 -->
          <el-table-column type="selection" width="55" align="center"></el-table-column>

          <!-- 添加序号列 -->
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>

          <el-table-column prop="itemName" label="项目名称" align="center"></el-table-column>
          <el-table-column prop="itemNo" label="项目检测编号" align="center"></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="status-box">
      <el-form ref="statusForm" :model="statusForm" label-width="80px">
        <el-form-item label="状态" required style="margin-bottom: 0">
          <el-radio-group v-model="statusForm.status" class="status-radio">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="status-box" style="height: 200px">
      <el-form ref="statusForm" :model="statusForm" label-width="80px">
        <el-form-item label="备注" style="margin-bottom: 0">
          <el-input v-model="statusForm.remark" class="status-radio" placeholder="描述长度50字以内" type="textarea" rows="6"
            cols="50" maxlength="50">
          </el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 底部按钮 -->
    <div style="
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 30px;
      ">
      <button @click="goquxiao" style="
          width: 120px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid #089bab;
          background-color: #fff;
          color: #089bab;
          margin-right: 30px;
          cursor: pointer;
        ">
        取消
      </button>
      <button style="
          width: 120px;
          height: 40px;
          background: linear-gradient(231deg, #16c0c0 0%, #089bab 100%);
          border-radius: 10px;
          color: #fff;
          border: none;
          cursor: pointer;
        " @click="submitForm">
        确定
      </button>
    </div>
    <!-- 添加项目弹窗 -->
    <el-dialog title="添加项目" :visible.sync="createDialog" width="40%">
      <el-form :model="createProjectForm" :rules="createProjectFormRules" ref="createProjectForm" label-width="120px">
        <el-form-item label="选择项目名称" prop="deviceProject" required style="margin-bottom: 0">
          <el-select v-model="createProjectForm.deviceProject" placeholder="请选择">
            <el-option v-for="item in deviceProjectList" :key="item.itemId" :label="item.itemName" :value="item.itemId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createDialog = false" class="cancel-btn">
          取 消
        </el-button>
        <el-button type="primary" @click="onConfirm" class="confirm-btn">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getDeviceProject, } from "@/api/deviceType.js";
import { createDeviceManage, getDeviceManage, editDeviceManage } from "@/api/deviceManage.js";
export default {
  name: "DeviceEntry",
  data() {
    return {
      createDialog: false,
      formData: {},
      deviceForm: {
        deviceName: "",
        deviceType: "",
        deviceBrand: "",
      },
      createProjectForm: {
        deviceProject: "",
      },
      statusForm: {
        status: 1,
        remark: "",
      },
      deviceProjectList: [],
      deviceTypeList: [],
      deviceBrandList: [],
      deviceNameOptions: [],
      rules: {
        deviceName: [
          { required: true, message: "设备名称不能为空", trigger: "blur" },
        ],
        deviceType: [
          { required: true, message: "设备类型不能为空", trigger: "change" },
        ],
        deviceBrand: [
          { required: true, message: "设备品牌不能为空", trigger: "change" },
        ],
      },
      createProjectFormRules: {
        deviceProject: [
          { required: true, message: "项目名称不能为空", trigger: "change" },
        ],
      },
      // deviceProperties: [
      //   {
      //     serialNumber: 1,
      //     deviceNumber: "",
      //     sn: "",
      //   },
      // ],
      deviceProperties: [],
      projectDetections: [],
      selectedProperties: [],
      typeAndBrandLoading: false,
    };
  },
  // 修改后的 mounted 钩子
  mounted() {
    if (this.$route.query.deviceData) {
      this.formData = JSON.parse(this.$route.query.deviceData);


      // 映射主表单数据
      this.deviceForm = {
        deviceName: this.formData.deviceName,
        deviceType: this.formData.deviceType,
        deviceBrand: this.formData.deviceBrand,
      };

      // 映射状态和备注
      this.statusForm = {
        status: this.formData.deviceFlag || 1,
        remark: this.formData.remark || ""
      };

      // 转换 matchedItems 到表格数据结构
      this.deviceProperties = this.formData.matchedItems.map(item => ({
        itemId: item.itemId,        // 保留原始ID用于提交
        itemName: item.itemName,    // 项目名称
        itemNo: item.itemNo,        // 项目检测编号
        itemParam: item.itemParam   // 备注内容
      }));
    }
  },
  watch: {},
  methods: {
    handleDeviceNameChange(value) {
      if (!value) {
        this.resetFormFields();
        return;
      }
      this.getTypeAndBrandByDevice(value);
    },
    getTypeAndBrandByDevice(deviceName) {
      this.typeAndBrandLoading = true;
      getLinkage({ deviceName: deviceName })
        .then((res) => {
          if (res.code === "200") {
            this.deviceForm.deviceType = res.data.typeName?.[0] || "未知类型";
            this.deviceForm.deviceBrand =
              res.data.deviceBrand?.[0] || "未知品牌";
          } else {
            this.$message.error("获取设备类型和品牌失败");
            this.deviceForm.deviceType = "获取失败";
            this.deviceForm.deviceBrand = "获取失败";
          }
        })
        .catch((error) => {
          console.error("获取设备类型和品牌失败:", error);
          this.$message.error("获取设备类型和品牌失败");
          this.deviceForm.deviceType = "请求失败";
          this.deviceForm.deviceBrand = "请求失败";
        })
        .finally(() => {
          this.typeAndBrandLoading = false;
        });
    },
    getLinkageOptions() {
      getLinkage({})
        .then((res) => {
          if (res.code === "200") {
            this.deviceNameOptions = Array.isArray(res.data.deviceName)
              ? res.data.deviceName
              : res.data.deviceName
                ? [res.data.deviceName]
                : [];
          } else {
            this.$message.error("获取设备名称选项失败");
            this.deviceNameOptions = ["智能手表", "智能手机", "平板电脑"];
          }
        })
        .catch((error) => {
          console.error("获取设备名称选项失败:", error);
          this.$message.error("获取设备名称选项失败");
          this.deviceNameOptions = ["智能手表", "智能手机", "平板电脑"];
        });
    },
    goBack() {
      this.$router.push("/Equipment");
    },
    goquxiao() {
      this.$router.push("/Equipment");
    },
    addDeviceProperty() {
      this.createDialog = true;
    },
    // 列表删除按钮
    deleteDeviceProperty() {
      if (this.selectedProperties.length === 0) {
        this.$message.warning("请选择要删除的检测项目");
        return;
      }
      // 删除this.deviceProperties 中 this.selectedProperties 对应的数据
      this.deviceProperties = this.deviceProperties.filter(
        (item) => !this.selectedProperties.includes(item)
      );
    },
    handlePropertySelectionChange(selection, row) {
      // deviceProperties;
      this.selectedProperties = selection;
    },
    // 修改后的提交方法
    submitForm() {
      this.$refs.deviceForm.validate((valid) => {
        if (!valid) {
          this.$message.error("请完善必填信息");
          return;
        }
        const deviceItem = this.deviceProperties
          .filter(item => typeof item.itemId !== 'undefined') // 过滤掉非数据项
          .map(item => item.itemId)
          .join(',');

        // 构造提交参数（注意字段对应）
        const params = {
          deviceName: this.deviceForm.deviceName,
          deviceType: this.deviceForm.deviceType,
          deviceBrand: this.deviceForm.deviceBrand,
          deviceItem: deviceItem,
          deviceFlag: this.statusForm.status,
          remark: this.statusForm.remark,
        };



        editDeviceManage(params)
          .then((res) => {
            if (res.code === "200" && res.msg === "success") {
              this.$message.success("设备信息更新成功！");
              this.$router.push("/Equipment");


            } else {

              this.$message.error("设备信息更新失败！");
            }

          })
      });
    },
    // 重置表单字段
    resetFormFields() {
      this.deviceForm.deviceType = "";
      this.deviceForm.deviceBrand = "";
      this.deviceForm.deviceModel = "";
      this.deviceForm.deviceSupplier = "";
      this.deviceForm.hardwareVersion = "";
      this.deviceProperties = [];
    },

    // 新增检测项目
    onConfirm() {
      this.$refs.createProjectForm.validate(async (valid) => {
        if (valid) {
          const data = this.deviceProjectList.filter(
            (item) => item.itemId == this.createProjectForm.deviceProject
          );
          // 不能重复选
          if (
            this.deviceProperties.some((item) => item.itemId == data[0].itemId)
          ) {
            this.$message.error("请勿重复选择");
            return;
          }
          this.deviceProperties.push(...data);
          this.createDialog = false;
        } else {
          this.$message.error("项目名称不能为空");
        }
      });
    },

    // ====================================接口===================

    /**
     * 获取设备类型列表
     */
    async getTypelist() {
      try {
        const res = await getList({});
        if (res.code == 200) {
          this.deviceTypeList = res.data.records;
        } else {
          this.$message.error(res.message);
        }
      } catch (error) {

      }
    },

    /**
     * 获取设备品牌列表
     */

    async getBrandList() {
      try {
        const res = await getDeviceManage({});
        if (res.code == 200) {
          res.data.records.forEach((item) => {
            const brand = {
              deviceBrand: item.deviceBrand,
            };
            this.deviceBrandList.push(brand);
          });

        } else {
          this.$message.error("获取设备品牌列表失败");
        }
      } catch (error) {

      }
    },

    /**
     * 获取检测项目列表
     */
    async getProjectList() {
      try {
        const res = await getDeviceProject({});
        if (res.code == 200) {

          res.data.records.forEach((item) => {
            item.selectCheck = false;
          });
          this.deviceProjectList = res.data.records;
        } else {
          this.$message.error("获取检测项目列表失败");
        }
      } catch (error) {

      }
    },

    /**
     * 新增设备管理
     */

    async addDeviceManage(data) {
      try {
        const res = await createDeviceManage(data);
        if (res.code == 200) {
          this.$message.success("添加设备管理成功");
          this.$router.push("/Equipment");
        } else {
          this.$message.error("添加设备管理失败");
        }
      } catch (error) {

      }
    },
  },
  created() {
    this.getTypelist();
    this.getBrandList();
    this.getProjectList();
    // this.getLinkageOptions();
  },
};
</script>
<style scoped>
.status-box {
  background-color: #fff;
  height: 100px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  align-self: center;
  margin-bottom: 20px;
}

.el-input__inner:focus {
  border-color: #089bab;
  background-color: #089bab;
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

/* 样式保持不变 */
.table-input /deep/ .el-input__inner {
  border: none !important;
  text-align: center;
  transition: background-color 0.3s;
}

.el-table /deep/ .el-table__body tr:hover>td {
  background-color: transparent !important;
}

.el-table /deep/ .el-table__fixed .el-table__body tr:hover>td {
  background-color: transparent !important;
}

.el-table /deep/ .el-table__fixed-right::before,
.el-table /deep/ .el-table__fixed::before {
  height: 0 !important;
}

.el-table /deep/ .el-table__body tr.current-row>td {
  background-color: transparent !important;
}

.device-entry-container {
  background-color: #f5f7fa;
  height: 100%;
  overflow: auto;
  position: relative;
  height: calc(100vh - 200px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-left {
  display: flex;
  align-items: center;
}

.title-bar {
  width: 4px;
  height: 24px;
  background: #089bab;
  border-radius: 10px;
  margin-right: 10px;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #121a2d;
  margin: 0;
}

.back-btn {
  background: #f0f0f0;
  border: 1px solid #ddd;
  color: #666;
  border-radius: 6px;
  padding: 8px 16px;
}

.back-btn:hover {
  background: #e0e0e0;
  border-color: #ccc;
}

.form-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.section-container {
  background: white;
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #121a2d;
  margin: 0;
}

.section-actions {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.add-btn {
  background-color: #089bab;
  border-color: #089bab;
  width: 100px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
}

.delete-btn {
  background: #089bab;
  border-color: #e1e6e6;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
}

.table-container {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.required-mark {
  color: #f56c6c;
  margin-right: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.el-form-item .el-form-item__label {
  color: #333;
  font-weight: 400;
}

.el-form-item .el-form-item__label::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}

.el-input .el-input__inner,
.el-select .el-input__inner {
  border: 1px solid rgba(8, 155, 171, 0.4);
  border-radius: 8px;
  height: 40px;
}

.el-input .el-input__inner:focus,
.el-select .el-input__inner:focus {
  border-color: #089bab;
}

.el-table .el-table__header-wrapper {
  border-radius: 8px 8px 0 0;
}

.el-table .el-table__body-wrapper {
  border-radius: 0 0 8px 8px;
}

.el-input.is-disabled .el-input__inner,
.el-select.is-disabled .el-input__inner {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #606266;
  cursor: not-allowed;
}

.el-button.is-disabled {
  background-color: #f5f7fa;
  border-color: #e4e7ed;
  color: #c0c4cc;
  cursor: not-allowed;
}
</style>

<template>
  <div>
    <!-- 设备类型新增编辑弹出框 -->
    <el-dialog :title="title" :visible.sync="dialog" :close-on-click-modal="false" :close-on-press-escape="false"
      class="import-dialog">
      <div class="import-form-container">
        <el-form :model="formData" label-width="0px" ref="form" class="import-form">
          <!-- 第一行：机构名称、机构简称 -->
          <div class="form-row">
            <div class="form-item">
              <label class="form-label required">设备类型:</label>
              <el-input v-model="formData.typeName" placeholder="请输入" class="form-input"></el-input>
            </div>
            <div class="form-item"></div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label required">设备图片:</label>
              <el-upload style="width: 80px; height: 80px" :http-request="customUpload" :show-file-list="false">
                <div style="
                    width: 80px;
                    height: 80px;
                    border-radius: 10px;
                    background-color: #eff7f8;
                    text-align: center;
                    line-height: 80px;
                    font-size: 30px;
                  ">
                  <i class="el-icon-plus"></i>
                </div>
              </el-upload>
            </div>
          </div>

          <div class="form-row">
            <div class="form-item-full">
              <label class="form-label required">状态:</label>
              <el-radio-group v-model="formData.flag" class="status-radio">
                <el-radio label="1">正常</el-radio>
                <el-radio label="2">停用</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="form-row">
            <div class="form-item">
              <label class="form-label">备注:</label>
              <el-input v-model="formData.remark" placeholder="描述长度50字以内" class="form-input" type="textarea"></el-input>
            </div>
          </div>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button class="cancel-btn" @click="handleImportCancel">
          取消
        </el-button>
        <el-button class="confirm-btn" @click="handleImportConfirm">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addDeviceType, editDeviceType } from "@/api/deviceType";

export default {
  name: "createDeviceType",
  props: {
    dialogValue: {
      type: Boolean,
      default: false,
    },
    onDialog: {
      type: Function,
      default: () => { },
    },
    title: {
      type: String,
      default: "新建",
    },
    actionType: {
      type: String,
      default: "add",
    },
    row: {
      type: Object,
      default: {},
    },
  },

  data() {
    return {
      dialog: false,
      formData: {
        typeName: "",
        typePic: "",
        flag: "1",
        remark: "",
      },
      rowId: "",
      createBy: "admin",
    };
  },

  watch: {
    dialog(val) {
      if (!val) {
        this.onDialog(val);
      }
    },
    dialogValue(val) {
      if (val) {
        this.dialog = val;
      }
    },
    row: function (val) {

      this.formData.flag = val.typeFlag;
      this.formData.typeName = val.typeName;
      this.formData.typePic = val.devicePhoto;
      this.formData.remark = val.typeRemark;
      this.rowId = val.typeId;
      this.createBy = val.createBy;
    },
  },

  methods: {
    // 表单处理方法
    handleImportCancel() {
      this.dialog = false;

    },

    async handleImportConfirm() {
      // 表单验证
      if (!this.validateForm()) {
        return;
      }

      // 准备提交数据
      const params = {
        typeName: this.formData.typeName,
        typeRemark: this.formData.remark,
        typeFlag: this.formData.flag,
        createBy: this.createBy,
        devicePhoto: this.formData.typePic,
      };

      if (this.actionType == "add") {
        try {
          const res = await addDeviceType(params);

          this.dialog = false;
          this.$message.success("创建成功");
        } catch (error) {
          console.error("提交失败", error);
          this.$message.error("创建失败");
        }
      }
      if (this.actionType == "edit") {
        const params = {
          typeName: this.formData.typeName,
          typeRemark: this.formData.remark,
          typeFlag: this.formData.flag,
          createBy: this.createBy,
          devicePhoto: this.formData.typePic,
          typeId: this.rowId,
        };


        // return;
        try {
          const res = await editDeviceType(params);

          this.dialog = false;
          this.$message.success("修改成功");
        } catch (error) {
          console.error("提交失败", error);
          this.$message.error("修改失败");
        }
      }
    },

    // 表单验证方法
    validateForm() {
      const form = this.formData;

      if (!form.typeName) {
        this.$message.error("请输入设备类型名称");
        return false;
      }

      if (!form.typePic) {
        this.$message.error("请上传设备图片");
        return false;
      }

      // 其他验证规则...
      return true;
    },

    // 文件上传相关方法
    customUpload(options) {
      return new Promise((resolve) => {
        this.getBase64(options.file)
          .then((base64) => {
            this.formData.typePic = base64;
            this.$message.success("图片上传成功");
            resolve();
          })
          .catch((error) => {
            this.$message.error("图片上传失败");
            console.error(error);
            resolve();
          });
      });
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        // 验证文件类型
        if (!file.type.match("image.*")) {
          reject(new Error("请选择图片文件"));
          return;
        }

        // 限制文件大小 (例如2MB)
        if (file.size > 2 * 1024 * 1024) {
          reject(new Error("图片大小不能超过2MB"));
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    // 其他方法
    handleProvinceChange(value) {
      // 处理省份变化
    },

    handleCityChange(value) {
      // 处理城市变化
    },
  },
};
</script>
<style scoped>
/* 设备导入弹出框样式 */
.import-dialog /deep/ .el-dialog {
  border-radius: 20px !important;
  background: #ffffff;
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

.el-table--enable-row-hover .el-table__body tr:hover>td {
  background-color: transparent !important;
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
  width: 100px;
  height: 40px;
}

.el-upload-list--picture-card .el-upload-list__item {
  width: 80px;
  height: 80px;
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

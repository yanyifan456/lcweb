<template>
    <div class="boxbig" ref="container">
        <!-- 筛选查询区域 -->
        <div style="width: 500px; height: 30px; display: flex">
            <div class="box-a"></div>
            <div class="box-b">筛选查询</div>
        </div>
        <div class="box-c">
            <!-- 第一行：机构选择 -->
            <div class="filter-row">
                <div class="filter-item">
                    <span class="filter-label">选择机构：</span>
                    <jigou ref="jigouRef" @node-selected="handleOrgSelected"></jigou>
                </div>
                <div class="filter-item">
                    <span class="filter-label">服务名称：</span>
                    <el-input v-model="filterForm.deviceName" placeholder="请输入" class="filter-input"></el-input>
                </div>
                <div class="filter-item">
                    <span class="filter-label">服务类型：</span>
                    <!-- <el-input v-model="filterForm.warehouseNumber" placeholder="请输入" class="filter-input"></el-input> -->
                    <el-tooltip v-if="!selectedOrgId" content="请先选择机构" placement="top">
                        <div>
                            <el-select v-model="filterForm.warehouseNumber" placeholder="请选择服务类型" style="width: 100%"
                                :disabled="!selectedOrgId">
                                <el-option v-for="(item, index) in serviceTypeOptions" :key="index" :label="item.value"
                                    :value="item.value" />
                            </el-select>
                        </div>
                    </el-tooltip>

                    <el-select v-else v-model="filterForm.warehouseNumber" placeholder="请选择服务类型" style="width: 100%">
                        <el-option v-for="(item, index) in serviceTypeOptions" :key="index" :label="item.value"
                            :value="item.value" />
                    </el-select>
                </div>
                <div class="filter-buttons">
                    <el-button class="reset-btn" @click="handleReset">重置</el-button>
                    <el-button class="query-btn" @click="handleQuery">查询</el-button>
                </div>
            </div>
        </div>

        <!-- 增值服务标题和操作按钮 -->
        <div style="
        width: 100%;
        height: 40px;
        display: flex;
        margin-top: 30px;
        justify-content: space-between;
      ">
            <div style="display: flex">
                <div class="box-aa"></div>
                <div class="box-cc">增值服务</div>
            </div>
            <div style="display: flex">
                <el-button class="add-btn" type="primary" icon="el-icon-plus"
                    v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                    @click="xiazaimoban">下载模版</el-button>
                <el-button class="add-btn" type="primary" icon="el-icon-plus"
                    v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                    @click="daorunmoban">批量导入</el-button>
                <el-button class="add-btn" @click="handleAdd" icon="el-icon-plus"
                    v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))">新增服务</el-button>
            </div>
        </div>

        <!-- 数据表格 -->
        <el-table :data="tabedata" border style="width: 100%; border-radius: 20px 20px 0px 0px; margin-top: 30px"
            :header-cell-style="{
                height: '60px',
                background: 'rgba(136, 140, 150, 0.07)',
                borderRadius: '0px 0px 0px 0px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
            }" :cell-style="{ fontSize: '14px', color: '#666' }" :row-style="{ height: '60px' }">
            <template #empty>
                <el-empty description="请先选择机构"></el-empty>
            </template>
            <el-table-column type="index" label="序号" width="80px" align="center" :index="getIndex">
            </el-table-column>
            <el-table-column prop="orgName" label="机构名称" align="center">
            </el-table-column>
            <el-table-column prop="serviceType" label="服务类型" align="center">
            </el-table-column>
            <el-table-column prop="serviceName" label="服务名称" align="center">
            </el-table-column>
            <el-table-column prop="servicePrice" label="服务价格" align="center">
            </el-table-column>
            <el-table-column prop="serviceUnit" label="服务单位" align="center">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="serviceDetail" label="服务详情" align="center">
            </el-table-column>
            <el-table-column class="aasd" fixed="right" style="margin-top: 0" label=" 操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="action-btn edit-btn"
                        @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <div style="
          display: flex;
          float: right;
          margin-top: 30px;
          align-items: center;
        ">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
                </el-pagination>
            </div>
        </div>

        <!-- 新增/编辑弹出框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px" class="service-dialog">
            <el-form :model="serviceForm" :rules="serviceRules" ref="serviceForm" label-width="100px">
                <el-form-item label="服务类型" prop="serviceType">
                    <el-select v-model="serviceForm.serviceType" placeholder="请选择服务类型" style="width: 100%">
                        <el-option v-for="(item, index) in serviceTypeOptions" :key="index" :label="item.value"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="服务名称" prop="serviceName">
                    <el-input v-model="serviceForm.serviceName" placeholder="请输入服务名称"></el-input>
                </el-form-item>
                <el-form-item label="服务价格" prop="servicePrice">
                    <el-input type="number" min="0" v-model="serviceForm.servicePrice" placeholder="请输入服务价格"></el-input>
                </el-form-item>
                <!-- 修改服务单位选择 -->
                <el-form-item label="服务单位" prop="serviceUnit">
                    <el-select v-model="serviceForm.serviceUnit" placeholder="请选择或输入服务单位" style="width: 100%" filterable
                        allow-create @change="handleUnitChange" @click.stop>
                        <el-option v-for="unit in unitlist" :key="unit.value" :label="unit.value" :value="unit.value">
                            <template #default>
                                <span>{{ unit.value }}</span>
                                <el-icon name="close" style="float: right;margin-top: 10px; cursor: pointer;"
                                    @click.native.stop="handleRemoveUnit(unit)"></el-icon>
                            </template>
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="服务详情" prop="serviceDetail">
                    <el-input type="textarea" v-model="serviceForm.serviceDetail" placeholder="请输入服务详情"
                        :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="dialogVisible = false">取消</el-button>
                <el-button class="confirm-btn" @click="handleSubmit">确定</el-button>
            </div>
        </el-dialog>

        <!-- 删除确认弹出框 -->
        <el-dialog title="删除确认" :visible.sync="deleteDialogVisible" width="700px" class="delete-dialog">
            <div style="text-align: center; padding: 20px">
                <i class="el-icon-warning" style="font-size: 48px; color: #f56c6c; margin-bottom: 20px"></i>
                <p style="font-size: 16px; color: #333; margin-bottom: 20px">
                    确定要删除这条服务记录吗？
                </p>
                <p style="font-size: 14px; color: #666">删除后将无法恢复</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="deleteDialogVisible = false">取消</el-button>
                <el-button class="confirm-btn" @click="confirmDelete">确定删除</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量导入" :visible.sync="importExcelDialogVisible" width="500px" @close="handleImportExcelCancel">
            <el-upload class="upload-demo" ref="upload" drag action="#" :limit="1" :auto-upload="false"
                :before-upload="beforeExcelUpload" :on-change="handleExcelChange" :file-list="excelFileList"
                accept=".xls,.xlsx">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将 Excel 文件拖到此处，或 <em>点击上传</em>
                </div>
                <div slot="tip" class="el-upload__tip">
                    只能上传 Excel 文件（.xls, .xlsx），且仅限 1 个
                </div>
            </el-upload>

            <span slot="footer" class="dialog-footer">
                <el-button @click="handleImportExcelCancel">取 消</el-button>
                <el-button style="background-color: #089bab" type="primary" @click="handleImportExcelConfirm">确
                    定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { watch } from "vue";
import jigou from "../../../comounts/orgselectcopy.vue";
import {
    getlist,
    getaddlist,
    getdellist,
    getupdatelist,
    getunitlist,
    getdanwei,
    getservicetype,
} from "../../../../api/valueaddedservices";
import request from "@/utils/request";

export default {
    name: "DeviceWarehouse",
    components: {
        jigou,
    },
    data() {
        return {
            filterForm: {
                deviceName: "",
                warehouseNumber: "",
                batchNumber: "",
                startDate: "",
                endDate: "",
            },
            importExcelDialogVisible: false, // 控制导入Excel弹框
            importExcelDialogVisible: false, // 控制导入Excel弹框
            excelFileList: [], // 选中的文件列表
            selectedExcelFile: null, // 存储上传的文件
            tabedata: [],
            pageSize: 10,
            currentPage: 1,
            totalItems: 0,
            selectedOrgId: "",
            unitlist: [],
            serviceTypeOptions: [],
            // 弹出框相关数据
            dialogVisible: false,
            deleteDialogVisible: false,
            dialogTitle: "新增服务",
            isEdit: false,
            currentEditId: null,
            deleteId: null,
            userauth: sessionStorage.getItem("roleName"),
            // 表单数据 - 添加服务单位字段
            serviceForm: {
                serviceType: "",
                serviceName: "",
                servicePrice: "",
                serviceUnit: "", // 新增服务单位字段
                serviceDetail: "",
                orgId: "",
            },
            // 表单验证规则 - 添加服务单位验证
            serviceRules: {
                serviceType: [
                    { required: true, message: "请输入服务类型", trigger: "blur" },
                ],
                serviceName: [
                    { required: true, message: "请输入服务名称", trigger: "blur" },
                ],
                servicePrice: [
                    { required: true, message: "请输入服务价格", trigger: "blur" },
                ],
                serviceUnit: [
                    { required: true, message: "请选择服务单位", trigger: "change" },
                ],
            },
        };
    },
    watch: {
        dialogVisible(newVal) {
            if (newVal) {

                this.getunitlist();
                this.getfuwuleix();
            }
        },
    },

    methods: {
        async handleRemoveUnit(unit) {
            // 这里可以执行移除该单位的操作，比如更新 `unitlist` 或其他相关操作


            try {
                const index = this.unitlist.findIndex(item => item.value === unit.value);

                if (index !== -1) {
                    // 使用 splice 删除元素
                    this.unitlist.splice(index, 1);

                } else {

                }
                const asd = this.unitlist
                const res = await getdanwei({
                    serviceUnit: asd,
                    orgId: this.selectedOrgId
                });
                if (res.code === '200' && res.msg === 'success') {
                    // 添加成功后，更新本地单位列表
                    this.getunitlist()
                    this.$message.success('新单位删除成功');
                    this.serviceForm.serviceUnit = ''
                } else {
                    this.$message.error(res.message || '删除单位失败');
                }
            } catch (error) {
                console.error('删除单位失败：', error);
                this.$message.error('删除单位失败');
            }
        },
        xiazaimoban() {
            window.open("http://8.136.114.144:8090/mid/download/batchservice");
        },

        daorunmoban() {
            this.importExcelDialogVisible = true;
        },

        // 选择文件时触发
        handleExcelChange(file, fileList) {
            this.excelFileList = fileList.slice(-1); // 只保留最后一个
            this.selectedExcelFile = file.raw;
        },

        // 上传前校验
        beforeExcelUpload(file) {
            const isExcel =
                file.type ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                file.type === "application/vnd.ms-excel";
            if (!isExcel) {
                this.$message.error("只能上传 Excel 文件（.xls, .xlsx）");
            }
            return isExcel;
        },

        // 点击确定上传
        async handleImportExcelConfirm() {
            if (!this.selectedExcelFile) {
                this.$message.warning("请先选择 Excel 文件！");
                return;
            }
            if (!this.selectedOrgId) {
                this.$message.warning("请先选择机构！");
                return;
            }

            const formData = new FormData();
            // 后端要求 orgId 是字符串，如果是数组取第一个
            formData.append("orgId", this.selectedOrgId);
            formData.append("file", this.selectedExcelFile);
            request
                .post("/api/mid/upload/batchaddvalservice", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((res) => {
                    if (res.code === "200" && res.data.message === "批量新增服务完成") {
                        this.$message.success("批量新增服务完成");
                        this.importExcelDialogVisible = false;
                        this.excelFileList = [];
                        this.selectedExcelFile = null;
                        this.getTableData();
                    } else {
                        this.$message.error(res.data.message || "导入失败！");
                    }
                })
                .catch((err) => {
                    console.error(err);
                    this.$message.error("批量新增服务失败");
                });
        },

        // 取消按钮
        handleImportExcelCancel() {
            this.importExcelDialogVisible = false;
            this.excelFileList = [];
            this.selectedExcelFile = null;
        },
        getIndex(index) {
            return (this.currentPage - 1) * this.pageSize + index + 1;
        },
        handleOrgSelected(orgData) {
            this.selectedOrgId = orgData.orgId;
            this.currentPage = 1; // 重置到第一页
            this.getTableData();
        },
        async getfuwuleix() {
            (sessionStorage.getItem("roleName"));
            const roleName = sessionStorage.getItem("roleName");

            const params = {};
            // if (roleName !== '超级管理员') {
            // }
            params.orgId = this.selectedOrgId;

            const res = await getservicetype(params);
            if (res.code === "200") {
                this.serviceTypeOptions = res.data;
            }
        },

        //查看
        async getTableData() {
            if (!this.selectedOrgId) {
                this.$message.warning('请先选择机构');
                return;
            }
            const params = {
                orgId: this.selectedOrgId,
                pageSize: this.pageSize,
                pageNum: this.currentPage,
                serviceName: this.filterForm.deviceName,
                serviceType: this.filterForm.warehouseNumber,
            }
            try {
                const res = await getlist(params)

                if (res.code === '200' && res.data) {
                    this.tabedata = res.data.records || [];
                    this.totalItems = res.data.total || 0;
                }
            } catch (error) {
                console.error('获取数据失败：', error);
                this.$message.error('获取数据失败');
            }
        },
        //单位
        async getunitlist() {


            const params = {
                orgId: this.selectedOrgId,

            }


            const res = await getunitlist(params);

            if (res.code === '200' && res.data) {
                this.unitlist = res.data;
            }

        },

        // 处理单位变化
        async handleUnitChange(value) {
            // 检查是否是新输入的单位（不在现有列表中）
            const existingUnit = this.unitlist.find(unit => unit.value === value);
            if (!existingUnit && value) {

                // 调用接口添加新单位
                try {
                    const newUnitData = {
                        brand: "增值服务单位",
                        value: value
                    };
                    this.unitlist.push(newUnitData)


                    const res = await getdanwei({
                        serviceUnit: this.unitlist,
                        orgId: this.selectedOrgId
                    });
                    if (res.code === '200' && res.msg === 'success') {
                        // 添加成功后，更新本地单位列表
                        this.getunitlist()
                        this.$message.success('新单位添加成功');
                    } else {
                        this.$message.error(res.message || '添加单位失败');
                    }
                } catch (error) {
                    console.error('添加单位失败：', error);
                    this.$message.error('添加单位失败');
                }
            }
        },
        //分页
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            this.getTableData();
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableData();
        },
        //重置
        handleReset() {
            this.filterForm.deviceName = ''
            this.filterForm.warehouseNumber = ''
            this.selectedOrgId = '';
            this.tabedata = [];
            this.totalItems = 0;
            this.$refs.jigouRef.reset();
        },
        //查询
        handleQuery() {
            if (this.selectedOrgId) {
                this.currentPage = 1;
                this.getTableData();
            } else {
                this.$message.warning('请先选择机构');
            }
        },
        // 新增服务 - 添加服务单位字段初始化
        handleAdd() {
            if (!this.selectedOrgId) {
                this.$message.warning('请先选择机构');
                return;
            }
            this.dialogTitle = '新增服务';
            this.isEdit = false;
            this.currentEditId = null;
            this.serviceForm = {
                serviceType: '',
                serviceName: '',
                servicePrice: '',
                serviceUnit: '', // 初始化服务单位
                serviceDetail: '',
                orgId: this.selectedOrgId
            };
            this.dialogVisible = true;
        },
        // 编辑服务 - 处理服务单位字段
        handleEdit(row) {
            this.dialogTitle = '编辑服务';
            this.isEdit = true;
            this.currentEditId = row.id;
            // 从servicePrice中分离价格和单位
            let price = row.servicePrice;

            this.serviceForm = {
                serviceType: row.serviceType,
                serviceName: row.serviceName,
                servicePrice: row.servicePrice, // 只保留价格部分
                serviceUnit: row.serviceUnit, // 设置单位
                serviceDetail: row.serviceDetail,
                orgId: row.orgId,
                id: row.id
            };
            this.dialogVisible = true;
        },
        // 删除服务
        handleDelete(row) {
            this.deleteId = row.id;
            this.deleteDialogVisible = true;
        },
        // 确认删除
        async confirmDelete() {
            try {
                const params = {
                    id: this.deleteId
                };
                const res = await getdellist(params);
                if (res.code === '200') {
                    this.$message.success('删除成功');
                    this.deleteDialogVisible = false;
                    this.getTableData(); // 刷新列表
                } else {
                    this.$message.error(res.message || '删除失败');
                }
            } catch (error) {
                console.error('删除失败：', error);
                this.$message.error('删除失败');
            }
        },
        // 提交表单 - 拼接价格和单位
        async handleSubmit() {


            if (this.serviceForm.servicePrice <= 0) {
                this.$message.warning('服务价格需要大于0');
                return;
            }
            this.$refs.serviceForm.validate(async (valid) => {
                if (valid) {
                    try {
                        // 拼接价格和单位
                        const submitData = {
                            ...this.serviceForm,

                        };


                        let res;
                        if (this.isEdit) {
                            // 编辑
                            res = await getupdatelist(submitData);
                            if (res.code === '200') {
                                this.$message.success(res.data);
                            } else {
                                this.$message.error(res.data || '编辑失败');
                            }
                        } else {
                            // 新增
                            const { id, ...addParams } = submitData;
                            res = await getaddlist(addParams);

                            if (res.code === '200') {
                                if (res.data === '添加成功') {
                                    this.dialogVisible = false;
                                    this.getTableData(); // 刷新列表
                                } else {
                                    this.$message.error(res.data);

                                }
                            } else {
                                this.$message.error(res.data || '新增失败');
                            }

                        }

                        // if (res.code === '200') {
                        //     this.$message.success(this.isEdit ? '编辑成功' : '新增成功');
                        this.dialogVisible = false;
                        this.getTableData(); // 刷新列表
                        // } else {
                        //     this.$message.error(res.message || (this.isEdit ? '编辑失败' : '新增失败'));
                        // }
                    } catch (error) {
                        console.error('操作失败：', error);
                        this.$message.error(this.isEdit ? '编辑失败' : '新增失败');
                    }
                }
            });
        }
    }
}
</script>

<style scoped>
/* 新增弹出框样式 */
.service-dialog /deep/ .el-dialog {
    border-radius: 20px !important;
    background: #ffffff;
}

.service-dialog /deep/ .el-dialog__header {
    text-align: center;
    padding: 30px 30px 20px;
    border-bottom: 1px solid #f0f0f0;
}

.service-dialog /deep/ .el-dialog__title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

.service-dialog /deep/ .el-dialog__body {
    padding: 30px;
}

.delete-dialog /deep/ .el-dialog {
    border-radius: 20px !important;
    background: #ffffff;
}

.delete-dialog /deep/ .el-dialog__header {
    text-align: center;
    padding: 30px 30px 20px;
    border-bottom: 1px solid #f0f0f0;
}

.delete-dialog /deep/ .el-dialog__title {
    font-size: 18px;
    font-weight: 500;
    color: #333;
}

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

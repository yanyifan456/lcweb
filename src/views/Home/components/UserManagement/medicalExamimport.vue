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
                <!-- 文件上传 -->

                <div class="filter-item">
                    <!-- <span class="filter-label">下载模版：</span> -->

                    <!-- <a style="" href="http://116.62.88.37:18082/mid/download/template">下载模板</a> -->
                </div>
                <div style="margin-left: 100px;" class="filter-item">
                    <span v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                        class="filter-label">文件上传：</span>
                    <el-upload class="upload-demo" :action="'#'" :auto-upload="false" :limit="1" accept=".xls,.xlsx"
                        :file-list="fileList" :on-change="handleFileChange" ref="uploadRef" :show-file-list="false">
                        <div style="display: flex;">
                            <el-button
                                v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                                style="background-color: #089BAB;border-radius: 10px;" type="primary">选择 Excel
                                文件</el-button>
                            <!-- 文件名显示在按钮右边 -->
                            <!-- 文件名显示和删除按钮 -->
                            <div v-if="fileList.length" style="display: flex; align-items: center; margin-left: 10px;">
                                <span
                                    style="max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    {{ fileList[0].name }}
                                </span>
                                <el-button type="text" style="color: red; margin-left: 5px;margin-top: 5px;"
                                    @click.stop="removeFile">
                                    <i class="el-icon-delete"></i>
                                </el-button>
                            </div>
                        </div>
                    </el-upload>
                    <!-- <el-button style="margin-left: 20px;" class="query-btn" @click="handleqeudings">确定</el-button> -->
                </div>
                <div class="filter-buttons">
                    <el-button class="query-btn"
                        v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                        @click="shancghuan">上传病例</el-button>
                    <el-button class="query-btn"
                        v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                        @click="handlexiazai">下载导入模板</el-button>
                    <el-button class="reset-btn" @click="handleReset">重置</el-button>
                    <el-button class="query-btn" @click="handleqeudings">确定</el-button>
                </div>
            </div>
        </div>
        <el-dialog title="上传病例" :visible.sync="dialogVisible" width="500px">
            <!-- 上传图片 -->
            <el-upload class="upload-demo" action="" list-type="picture-card" :file-list="imgFileList" accept="image/*"
                :http-request="customUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveImg"
                :on-change="handleImgChange">
                <i class="el-icon-plus"></i>
            </el-upload>


            <!-- 图片预览大图 -->
            <el-dialog :visible.sync="dialogImageVisible">
                <img width="100%" :src="dialogImageUrl" alt="预览" />
            </el-dialog>

            <!-- 底部按钮 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitCase">确 定</el-button>
            </span>
        </el-dialog>

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
                <el-empty description="请先选择机构后上传文件查询"></el-empty>
            </template>
            <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
            <el-table-column prop="sex" label="性别" align="center"></el-table-column>
            <!-- <el-table-column prop="age" label="年龄" align="center"></el-table-column> -->
            <el-table-column prop="spectype" label="标本类型" align="center"></el-table-column>
            <el-table-column prop="specCode" label=" 代码" align="center"></el-table-column>
            <el-table-column prop="projectName" label="检验项目 " align="center"></el-table-column>
            <el-table-column prop="result" label="结果 " align="center"></el-table-column>
            <el-table-column prop="referenceValue" label="参考值" align="center"></el-table-column>
            <el-table-column prop="unit" label="单位" align="center"></el-table-column>
            <el-table-column prop="inspectTime" label="检验日期" align="center"></el-table-column>
            <el-table-column fixed="right" prop="inspectStaff" label="检验人" align="center"></el-table-column>
        </el-table>
    </div>
</template>
<script>
import jigou from '../../../comounts/orgselectcopy.vue'
import request from "@/utils/request";


export default {
    name: 'DeviceWarehouse',
    components: { jigou },
    data() {
        return {
            filterForm: {
                startTime: '',
                endTime: '',
                isValid: '',
            },
            userauth: sessionStorage.getItem('roleName'),

            tabedata: [],
            currentEditId: null,
            deleteId: null,
            selectedOrgId: null,
            serviceForm: {},
            fileList: [],
            dialogVisible: false,
            imgFileList: [],
            dialogImageUrl: '',
            dialogImageVisible: false
        }
    },
    methods: {
        shancghuan() {
            this.dialogVisible = true;
        },
        // 预览图片
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogImageVisible = true;
        },
        // 删除图片
        handleRemoveImg(file, fileList) {
            this.imgFileList = fileList;
        },
        // 文件变化
        handleImgChange(file, fileList) {
            this.imgFileList = fileList;
        },
        customUpload(request) {
            const formData = new FormData();
            formData.append("files", request.file); // 单文件上传

        },
        // 提交上传
        submitCase() {
            if (!this.imgFileList.length) {

                this.$message.warning('请先选择图片');
                return;
            }
            this.dialogVisible = false;

            this.$message.success('上传成功');

            return;
            const formData = new FormData();
            formData.append("orgId", this.selectedOrgId || "");
            this.imgFileList.forEach(f => {
                formData.append("files", f.raw || f);
            });

            request.post('/api/mid/user/uploadCase', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => {
                if (res.code === '200') {
                    this.$message.success('上传成功');
                    this.dialogVisible = false;
                    this.imgFileList = [];
                } else {
                    this.$message.error(res.message || '上传失败');
                }
            }).catch(err => {
                console.error(err);
                this.$message.error('上传出错');
            });
        },
        handleqeudings() {


            if (!this.selectedOrgId) {
                this.$message.warning('请先选择机构');
                return;
            }

            if (!this.fileList.length) {
                this.$message.warning('请先选择文件');
                return;
            }

            const formData = new FormData();
            formData.append('file', this.fileList[0].raw || this.fileList[0]); // el-upload file 对象可能是 raw
            formData.append('orgId', this.selectedOrgId);

            request.post('/api/mid/user/importMedicalExam', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                if (res.code === '200' && res.data.data !== undefined) {
                    // this.$message.success(res.data.message);

                    this.tabedata = res.data.data;
                    this.getTableData(); // 上传后刷新表格
                } else {
                    this.$message.error(res.data.message || '上传失败');
                }
            }).catch(err => {
                console.error(err);
                this.$message.error('上传出错');
            });
        },
        handleOrgSelected(orgData) {
            this.selectedOrgId = orgData.orgId;
            this.getTableData();
        },
        handleReset() {
            this.filterForm.startTime = '';
            this.filterForm.endTime = '';
            this.selectedOrgId = '';
            this.tabedata = [];
            this.$refs.jigouRef.reset();
        },
        handlexiazai() {
            window.open('http://8.136.114.144:8090/mid/download/template');
        },

        handleQuery() {
            if (this.selectedOrgId || this.tabedata.length) {
                this.getTableData();
            } else {
                this.$message.warning('请先选择机构或上传文件');
            }
        },
        removeFile() {
            this.fileList = [];
            this.$refs.uploadRef.clearFiles(); // 清空 el-upload 内部文件列表
        },

        // 修改 handleFileChange，只保留最新文件
        handleFileChange(file, fileList) {
            const latestFile = fileList.slice(-1)[0];
            this.fileList = latestFile ? [{ ...latestFile }] : [];
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
</style>

<template>
    <div class="boxbig">
        <div class="main-content">
            <!-- 筛选查询区域 -->
            <div class="section-header">
                <div class="section-title-indicator"></div>
                <div class="section-title">筛选查询</div>
            </div>
            <div class="filter-area">
                <div class="filter-row">
                    <div class="filter-item">
                        <span class="filter-label" style="margin-left: 20px;">选择机构:</span>
                        <orgselect :key="orgSelectKey" style="width: 232px;" @node-selected="handleOrgSelect">
                        </orgselect>
                    </div>
                    <div class="filter-item" style="margin-left: 10px;">
                        <span class="filter-label">用户名称：</span>
                        <el-input v-model="filterForm.userName" placeholder="请输入" class="filter-input" />
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">用户手机号：</span>
                        <el-input v-model="filterForm.serialNumber" placeholder="请输入" class="filter-input" />
                        <!-- <input type="number" v-model="filterForm.userPhone"> -->
                    </div>
                    <div class="filter-item">
                        <span class="filter-label">用户类型：</span>
                        <el-select v-model="filterForm.physicalStatus" placeholder="请选择" class="filter-select">
                            <el-option value="" label="请选择"></el-option>
                            <el-option value="0" label="设备用户"></el-option>
                            <el-option value="1" label="机构用户"></el-option>
                            <el-option value="2" label="中台用户"></el-option>
                        </el-select>
                    </div>
                    <div class="filter-buttons" style="margin-right: 30px;">
                        <el-button @click="handleReset">重置</el-button>
                        <el-button type="primary" @click="handleQuery">查询</el-button>
                    </div>
                </div>
            </div>
            <!-- 设备用户标题和操作按钮 -->
            <div class="section-header-with-actions">
                <div class="section-title-group">
                    <div class="section-title-indicator"></div>
                    <div class="section-title">用户列表</div>
                </div>
                <div v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                    class="action-buttons">
                    <el-button type="primary" icon="el-icon-plus" @click="xiazaimoban">下载模版</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="daorunmoban">批量导入</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="handleNewUser">新建</el-button>

                </div>
            </div>
            <!-- 数据表格 -->
            <div class="data-table-container">
                <el-table :data="tableData" border style="width: 100%;border-radius: 20px 20px 0px 0px;"
                    :header-cell-style="{
                        height: '60px',
                        background: 'rgba(136, 140, 150, 0.07)',
                        borderRadius: '0px 0px 0px 0px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#333'
                    }" :cell-style="{ fontSize: '14px', color: '#666' }" :row-style="{ height: '60px' }">
                    <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
                    <el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>

                    <el-table-column :show-overflow-tooltip="true" prop="userId" label="用户标识" align="center">
                        <template slot-scope="scope">
                            <span class="userId-cell" @click="handleViewDetails(scope.row)">
                                {{ scope.row.userId }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" align="center"></el-table-column>
                    <el-table-column prop="serialNumber" label="手机号码" align="center"></el-table-column>
                    <el-table-column prop="height" label="身高(cm)" align="center"></el-table-column>
                    <el-table-column prop="weight" label="体重(kg)" align="center"></el-table-column>
                    <el-table-column prop="waistline" label="腰围(cm)" align="center"></el-table-column>
                    <el-table-column prop="birthDay" label="出生日期" align="center"></el-table-column>
                    <el-table-column prop="age" label="年龄" align="center"></el-table-column>
                    <el-table-column v-if="userauth && (userauth.includes('superAdmin') || userauth.includes('admin'))"
                        label="操作" align="center" width="200">
                        <template slot-scope="scope">
                            <!-- <el-button type="text" class="action-text"
                                @click="handleViewDetails(scope.row)">查看</el-button> -->
                            <el-button type="text" class="action-text" @click="handleEdit(scope.row)">编辑</el-button>

                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 分页 -->
            <div class="pagination-container">
                <!-- 修改分页部分模板 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="filterForm.currentPage" :page-sizes="[10, 50, 100, 200]"
                    :page-size="filterForm.pageSize" layout="total, sizes, prev, pager, next, jumper"
                    :total="totalItems">
                </el-pagination>
            </div>
        </div>
        <!-- 查看弹出框 -->
        <el-dialog title="查看" :visible.sync="dialogVisible" width="800px" :close-on-click-modal="false" center
            custom-class="rounded-dialog" class="device-detail-dialog">
            <div class="dialog-body">
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">用户名称：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.userName }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">成员性别：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.sex }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">身份证号：</span>
                        <span class="detail-value">{{ }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">出生日期：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.birthDay }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">年龄：</span>
                        <span class="detail-value">{{ currentViewData?.age }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">身高：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.height }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">体重：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.weight }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">手机号码：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.serialNumber }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">紧急联系人姓名：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.emName }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">紧急联系人电话：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.emContel }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">紧急联系人关系：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.emergencyContactRelation }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">腰围：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.waistline }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">居住地址：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.address }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">人员类别：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.personnelCategory }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">婚姻状况：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.maritalStatus }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">居住情况：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.livingSituation }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label required">身体状况：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.bodyStatus }}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">疾病史类型：</span>
                        <span class="detail-value">{{ currentViewData?.userInfo?.medicalHistoryType }}</span>
                    </div>
                </div>
                <div class="section-header-small mt-6">
                    <div class="section-title-indicator"></div>
                    <div class="section-title">设备信息</div>
                    <el-button type="text" class="ml-auto action-text"
                        @click="handleUserHistoryDevice">用户历史设备</el-button>
                </div>
                <el-table :data="currentViewData.deviceList" style="width: 100%" class="mt-4">
                    <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
                    <el-table-column prop="deviceType" label="设备类型" align="center"></el-table-column>
                    <el-table-column prop="deviceId" label="设备编号" align="center"></el-table-column>
                    <el-table-column prop="deviceMac" label="MAC地址" align="center"></el-table-column>
                </el-table>
                <div class="section-header-small mt-6">
                    <div class="section-title-indicator"></div>
                    <div class="section-title">关联APP用户信息</div>
                </div>
                <el-table :data="currentViewData.relFamliy" style="width: 100%" class="mt-4">
                    <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
                    <el-table-column prop="serialNumber" label="手机号码" align="center"></el-table-column>
                    <el-table-column prop="relType" label="关系" align="center"></el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 新建弹出框 -->
        <el-dialog title="新建" :visible.sync="importDialogVisible" width="800px" :close-on-click-modal="false" center
            custom-class="rounded-dialog" class="device-detail-dialog">
            <el-form :model="newForm" label-width="150px" class="import-form" :rules="newFormRules" ref="newFormRef">
                <!-- 在新建弹出框的表单中添加以下两个表单项 -->
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="用户类型：" required>
                            <el-select v-model="newForm.userType" placeholder="请选择" style="width: 100%">
                                <el-option value="1" label="设备用户"></el-option>
                                <el-option value="0" label="机构用户"></el-option>
                                <!-- <el-option value="3" label="中台用户"></el-option> -->
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="newForm.userType === '0'">
                        <el-form-item label="选择机构：" required>
                            <orgselects style="width: 100%;" @node-selected="handleNewOrgSelect"></orgselects>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="用户名称：" required>
                            <el-input v-model="newForm.userName" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="成员性别：" required>
                            <el-select v-model="newForm.memberGender" placeholder="请选择" style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="男" label="男"></el-option>
                                <el-option value="女" label="女"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <!-- <el-col :span="12">
                        <el-form-item label="身份证号：">
                            <el-input v-model="newForm.idNumber" placeholder="请输入"></el-input>
                        </el-form-item>
                    </el-col> -->
                    <el-col :span="12">
                        <el-form-item label="疾病史类型：">
                            <el-select v-model="newForm.medicalHistoryType" placeholder="请选择" style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="无疾病" label="无疾病"></el-option>
                                <el-option value="高血压" label="高血压"></el-option>
                                <el-option value="糖尿病" label="糖尿病"></el-option>
                                <el-option value="心脏病" label="心脏病"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="出生日期：" required>
                            <el-date-picker v-model="newForm.birthDate" type="date" placeholder="请选择日期"
                                style="width: 100%" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="用户昵称：" required>
                            <el-input v-model="newForm.nickName" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="身高：" required>
                            <el-input v-model="newForm.height" placeholder="请输入 (CM)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item prop="weight" label="体重：">
                            <el-input v-model="newForm.weight" placeholder="请输入 (KG)"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机号码：" required>
                            <el-input v-model="newForm.mobileNumber" placeholder="请输入电话号码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="紧急联系人姓名：" required>
                            <el-input v-model="newForm.emName" placeholder="请输入姓名"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="紧急联系人电话：" required>
                            <el-input v-model="newForm.emContel" placeholder="请输入电话号码"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="紧急联系人关系：" required>
                            <el-select v-model="newForm.emergencyContactRelation" placeholder="请选择" size="medium"
                                style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option v-for="item in relationshipOptions" :key="item.value" :value="item.value"
                                    :label="item.label">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="腰围：" prop="waistline" required>
                            <el-input v-model="newForm.waistline" placeholder="请输入腰围 (CM)"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="居住地址：" required>
                            <el-input v-model="newForm.residentialAddress" placeholder="请输入居住地址"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="人员类别：">
                            <el-select v-model="newForm.personnelCategory" placeholder="请选择" style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="居民" label="居民"></el-option>
                                <el-option value="员工" label="员工"></el-option>
                                <el-option value="其他" label="其他"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="婚姻状况：">
                            <el-select v-model="newForm.maritalStatus" placeholder="请选择" style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="未婚" label="未婚"></el-option>
                                <el-option value="已婚" label="已婚"></el-option>
                                <el-option value="离异" label="离异"></el-option>
                                <el-option value="丧偶" label="丧偶"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="居住情况：">
                            <el-select v-model="newForm.livingSituation" placeholder="请选择" style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="独居" label="独居"></el-option>
                                <el-option value="与家人同住" label="与家人同住"></el-option>
                                <el-option value="集体宿舍" label="集体宿舍"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="身体状况：" required>
                            <el-select v-model="newForm.bodyStatus" placeholder="请选择" style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="良好" label="良好"></el-option>
                                <el-option value="轻度失能" label="轻度失能"></el-option>
                                <el-option value="重度失能" label="重度失能"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="年龄：">
                            <el-input v-model="newForm.age" placeholder="请选择" disabled></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button style="
                    width: 120px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid #089BAB;
                    background-color: #fff;
                    color: #089BAB;
                    margin-right: 30px;
                    cursor: pointer;
                " @click="handleImportCancel">取消</el-button>
                <el-button style="
                    width: 120px;
                    height: 40px;
                    background: linear-gradient(231deg, #16C0C0 0%, #089BAB 100%);
                    border-radius: 10px;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                " type="primary" @click="handleImportConfirm">确认</el-button>
            </div>
        </el-dialog>
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
        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editDialogVisible" width="800px" :close-on-click-modal="false" center
            custom-class="rounded-dialog" class="device-detail-dialog">
            <div class="edit-form">
                <el-row :gutter="30">
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label required">用户名称：</label>
                            <el-input disabled v-model="editForm.userName" placeholder="请输入姓名" size="medium"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label required">成员性别：</label>
                            <el-input disabled v-model="editForm.sex" placeholder="请输入姓名" size="medium"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <!-- <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">身份证号：</label>
                            <el-input v-model="editForm.idNumber" placeholder="请输入" size="medium"></el-input>
                        </div>
                    </el-col> -->
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">用户昵称：</label>
                            <el-input v-model="editForm.nickName" placeholder="请输入" size="medium"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label required">出生日期：</label>
                            <el-input v-model="editForm.birthDay" disabled placeholder="请输入" size="medium"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">年龄：</label>
                            <el-input v-model="editForm.age" placeholder="请选择" disabled></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label required">身高：</label>
                            <el-input v-model="editForm.height" placeholder="请输入 (CM)" size="medium"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label required">体重：</label>
                            <el-input v-model="editForm.weight" placeholder="请输入 (KG)" size="medium"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label required">手机号码：</label>
                            <el-input v-model="editForm.serialNumber" placeholder="请输入电话号码" size="medium"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">紧急联系人姓名：</label>
                            <el-input v-model="editForm.emName" placeholder="请输入姓名" size="medium"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label ">紧急联系人电话：</label>
                            <el-input v-model="editForm.emContel" placeholder="请输入电话号码" size="medium"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">紧急联系人关系：</label>
                            <el-select v-model="editForm.emergencyContactRelation" placeholder="请选择" size="medium"
                                style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option v-for="item in relationshipOptions" :key="item.value" :value="item.value"
                                    :label="item.label">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label required">腰围：</label>
                            <el-input v-model="editForm.waistline" placeholder="请输入腰围 (CM)" size="medium"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label" required>居住地址：</label>
                            <el-input v-model="editForm.address" placeholder="请输入地址" size="medium"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">人员类别：</label>
                            <el-select v-model="editForm.personnelCategory" placeholder="请选择" size="medium"
                                style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="居民" label="居民"></el-option>
                                <el-option value="员工" label="员工"></el-option>
                                <el-option value="其他" label="其他"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">婚姻状况：</label>
                            <el-select v-model="editForm.maritalStatus" placeholder="请选择" size="medium"
                                style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="未婚" label="未婚"></el-option>
                                <el-option value="已婚" label="已婚"></el-option>
                                <el-option value="离异" label="离异"></el-option>
                                <el-option value="丧偶" label="丧偶"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">居住情况：</label>
                            <el-select v-model="editForm.livingSituation" placeholder="请选择" size="medium"
                                style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="独居" label="独居"></el-option>
                                <el-option value="与家人同住" label="与家人同住"></el-option>
                                <el-option value="集体宿舍" label="集体宿舍"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label required">身体状况：</label>
                            <el-select v-model="editForm.bodyStatus" placeholder="请选择" size="medium"
                                style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="良好" label="良好"></el-option>
                                <el-option value="轻度失能" label="轻度失能"></el-option>
                                <el-option value="重度失能" label="重度失能"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="form-item">
                            <label class="form-label">疾病史类型：</label>
                            <el-select v-model="editForm.medicalHistoryType" placeholder="请选择" size="medium"
                                style="width: 100%">
                                <el-option value="" label="请选择"></el-option>
                                <el-option value="无疾病" label="无疾病"></el-option>
                                <el-option value="高血压" label="高血压"></el-option>
                                <el-option value="糖尿病" label="糖尿病"></el-option>
                                <el-option value="心脏病" label="心脏病"></el-option>
                            </el-select>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button style="
                    width: 120px;
                    height: 40px;
                    border-radius: 10px;
                    border: 1px solid #089BAB;
                    background-color: #fff;
                    color: #089BAB;
                    margin-right: 30px;
                    cursor: pointer;
                " @click="handleEditCancel">取消</el-button>
                <el-button style="
                    width: 120px;
                    height: 40px;
                    background: linear-gradient(231deg, #16C0C0 0%, #089BAB 100%);
                    border-radius: 10px;
                    color: #fff;
                    border: none;
                    cursor: pointer;
                " type="primary" @click="handleEditConfirm">确认</el-button>
            </div>
        </el-dialog>
        <!-- 导入模版弹框 -->
        <el-dialog title="批量导入" :visible.sync="importExcelDialogVisible" width="500px" @close="handleImportExcelCancel">
            <el-upload class="upload-demo" ref="upload" drag action="#" :limit="1" :auto-upload="false"
                :before-upload="beforeExcelUpload" :on-change="handleExcelChange" :file-list="excelFileList"
                accept=".xls,.xlsx">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将 Excel 文件拖到此处，或 <em>点击上传</em></div>
                <div slot="tip" class="el-upload__tip">只能上传 Excel 文件（.xls, .xlsx），且仅限 1 个</div>
            </el-upload>


            <span slot="footer" class="dialog-footer">
                <el-button @click="handleImportExcelCancel">取 消</el-button>
                <el-button type="primary" @click="handleImportExcelConfirm">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import orgselect from '../../../comounts/orgselect.vue'
import orgselects from '../../../comounts/orgselects.vue'

import { getrelationship, adduser, getuserlist, getuserinfo, edituser } from '../../../../api/deviceuser'
import jigou from '../../../comounts/orgselectcopy.vue'
import axios from 'axios';
import request from "@/utils/request";

export default {
    name: 'DeviceWarehouse',
    components: { orgselect, jigou, orgselects },
    data() {
        return {
            filterForm: {
                userName: '',
                serialNumber: '',
                physicalStatus: '',
                pageSize: 10,    // 添加分页参数
                currentPage: 1   // 添加分页参数
            },
            orgSelectKey: 0,
            total: 0,
            newFormRules: {
                userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
                memberGender: [{ required: true, message: '请选择成员性别', trigger: 'change' }],
                birthDate: [{ required: true, message: '请选择出生日期', trigger: 'change' }],
                height: [{ required: true, message: '请输入身高', trigger: 'blur' }],
                mobileNumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
                emName: [{ required: true, message: '请输入紧急联系人姓名', trigger: 'blur' }],
                emContel: [{ required: true, message: '请输入紧急联系人电话', trigger: 'blur' }],
                emergencyContactRelation: [{ required: true, message: '请选择紧急联系人关系', trigger: 'change' }],
                waistline: [{ required: true, message: '请输入腰围', trigger: 'blur' }], // 新增腰围验证
                bodyStatus: [{ required: true, message: '请选择身体状况', trigger: 'change' }],
                userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
                nickName: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
                residentialAddress: [{ required: true, message: '请填写居住地址', trigger: 'change' }],


            },
            totalItems: 0, // 总条数，从后端获取
            relationshipOptions: [],
            tableData: [],
            dialogVisible: false, // Controls "查看" dialog
            currentViewData: {}, // Data for the "查看" dialog
            importDialogVisible: false, // Controls "新建" dialog
            historyDeviceDialogVisible: false, // Controls "用户历史设备" dialog
            editDialogVisible: false,
            isSubmitting: false,
            newForm: {
                userName: '',
                memberGender: '',
                idNumber: '',
                birthDate: '',
                age: '',
                height: '',
                weight: '',
                mobileNumber: '',
                emName: '',
                emContel: '',
                emergencyContactRelation: '',
                waistline: '',
                residentialAddress: '',
                personnelCategory: '',
                maritalStatus: '',
                livingSituation: '',
                bodyStatus: '',
                medicalHistoryType: '',
                selectedOrg: null, // 存储选择的机构
                userType: '',
                nickName: ''
            },
            userauth: sessionStorage.getItem('roleName'),

            editForm: { // Data for the "编辑" dialog
                userName: '',
                memberGender: '',
                idNumber: '',
                birthDate: '',
                age: '',
                height: '',
                weight: '',
                mobileNumber: '',
                emName: '',
                emContel: '',
                emergencyContactRelation: '',
                waistline: '',
                residentialAddress: '',
                personnelCategory: '',
                maritalStatus: '',
                livingSituation: '',
                bodyStatus: '',
                medicalHistoryType: '',
                nickName: ''
            },
            historyDeviceData: [
            ],
            cities: [],
            counties: [],
            importExcelDialogVisible: false, // 控制导入Excel弹框
            excelFileList: [], // 选中的文件列表
            selectedExcelFile: null, // 存储上传的文件
        };
    },
    methods: {
        handleNewOrgSelect(selectedNode) {
            this.newForm.selectedOrg = selectedNode;
        },
        xiazaimoban() {
            window.open('http://8.136.114.144:8090/mid/download/batchuser');
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
            // if (!this.filterForm.orglist || this.filterForm.orglist.length === 0) {
            //     this.$message.warning("请先选择机构！");
            //     return;
            // }
            const formData = new FormData();
            // 后端要求 orgId 是字符串，如果是数组取第一个
            formData.append("orgId", this.filterForm.orglist[0]);
            formData.append("file", this.selectedExcelFile);
            // try {
            //     const res = await request.post('/api/mid/user/uploadCase', formData,
            // {
            //     headers: { "Content-Type": "multipart/form-data" },
            // }
            //     );
            //     if (res.data.code === "200") {
            //         this.$message.success("导入成功！");
            //         this.importExcelDialogVisible = false;
            //         this.excelFileList = [];
            //         this.selectedExcelFile = null;
            //         this.getLoginLog(); // 刷新列表
            //     } else {
            //         this.$message.error(res.data.msg || "导入失败！");
            //     }
            // } catch (err) {
            //     console.error("导入失败:", err);
            //     this.$message.error("导入失败，请重试！");
            // }
            request.post('/api/mid/upload/batchbinduser', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(res => {
                if (res.code === "200" && res.data.message === '批量注册完成') {
                    this.$message.success("导入成功！");
                    this.importExcelDialogVisible = false;
                    this.excelFileList = [];
                    this.selectedExcelFile = null;
                    this.getLoginLog(); // 刷新列表
                } else {
                    this.$message.error(res.data.message || "导入失败！");
                }
            }).catch(err => {
                console.error(err);
                this.$message.error('上传出错');
            });
        },

        // 取消按钮
        handleImportExcelCancel() {
            this.importExcelDialogVisible = false;
            this.excelFileList = [];
            this.selectedExcelFile = null;
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
        handleSizeChange(newSize) {


            this.filterForm.pageSize = newSize
            this.currentPage = 1  // 重置到第一页
            this.getLoginLog()
        },

        // 当前页码变化
        handleCurrentChange(newPage) {

            this.filterForm.currentPage = newPage
            this.getLoginLog()
        },
        async getLoginLog() {


            const res = await getuserlist({
                pageSize: this.filterForm.pageSize,
                currentPage: this.filterForm.currentPage,
                userName: this.filterForm.userName,
                serialNumber: this.filterForm.serialNumber,
                userType: this.filterForm.physicalStatus,
                orgList: this.filterForm.orglist
            });
            this.totalItems = res.data.total || 0;

            this.tableData = res.data.data.map(user => {
                user.age = this.calculateAge(user.birthDay);

                return user;
            });


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
        async getrelationshis() {
            const params = {
                compId: "RELATION_SHIP_TYPE",
            };
            try {
                const res = await getrelationship(params);
                if (res.code === "200") {
                    // 将接口返回的关系数据赋值给 relationshipOptions
                    this.relationshipOptions = res.data.map(item => ({
                        value: item,
                        label: item
                    }));
                    // 如果需要在编辑表单中也使用这些选项，可以这样处理：
                    // 确保编辑表单中的 emergencyContactRelation 字段与这些选项匹配
                    if (this.editForm.emergencyContactRelation &&
                        !this.relationshipOptions.some(opt => opt.value === this.editForm.emergencyContactRelation)) {
                        // 如果当前编辑表单中的关系值不在新获取的选项中，可以重置或保留
                        // 这里选择保留原值（但显示可能会不一致）
                    }
                } else {
                    this.$message.error('获取关系失败');
                    // 使用默认选项作为回退
                    this.relationshipOptions = [
                        { value: "父子", label: "父子" },
                        { value: "母子", label: "母子" },
                        { value: "夫妻", label: "夫妻" },
                        { value: "朋友", label: "朋友" },
                        { value: "其他", label: "其他" }
                    ];
                }
            } catch (error) {
                console.error('获取关系失败:', error);
                this.$message.error('获取关系失败');
            }
        },
        handleReset() {
            this.filterForm = {
                userName: '',
                serialNumber: '',
                physicalStatus: '',
                pageSize: this.filterForm.pageSize,
                currentPage: 1
            };

            // 通过改变key强制重新渲染orgselect组件
            this.orgSelectKey += 1;

            this.filterForm.orglist = [];


            this.total = 0;
            // this.getLoginLog();
        },
        handleOrgSelect(selectedNode) {

            this.filterForm.orglist = selectedNode.orgIds;


            // Reset to first page and automatically query
            this.filterForm.currentPage = 1;
            this.getLoginLog();
        },
        async handleQuery() {
            // 重置到第一页
            this.filterForm.currentPage = 1;
            await this.getLoginLog();
        },
        handleViewDetails(row) {
            this.currentViewData = { ...row }; // Copy row data to currentViewData
            this.dialogVisible = true;

            const params = {
                userId: row.userId
            }
            getuserinfo(params)
                .then(res => {
                    res.data.age = this.calculateAge(res.data.userInfo.birthDay);

                    this.currentViewData = res.data;

                })
        },
        handleEdit(row) {
            this.editForm = {
                ...row,
                memberGender: row.sex, // 确保性别字段映射正确
                birthDay: row.birthDay, // 确保日期字段正确
                serialNumber: row.serialNumber // 确保手机号字段正确
            };

            // 确保年龄字段显示计算值（如果原始数据中有出生日期）
            if (this.editForm.birthDate) {
                this.editForm.age = this.calculateAge(this.editForm.birthDate);
            }
            this.editDialogVisible = true;
            // 添加出生日期监听
            this.$watch('editForm.birthDate', (newVal) => {
                if (newVal) {
                    this.editForm.age = this.calculateAge(newVal);
                } else {
                    this.editForm.age = '';
                }
            });
        },

        handlePageChange(page) {
            this.filterForm.currentPage = page;
            this.getLoginLog();
        },
        handleNewUser() {
            this.importDialogVisible = true;
            this.resetNewForm(); // Reset the new form for "新建"
            this.$watch('newForm.birthDate', (newVal) => {
                if (newVal) {
                    this.newForm.age = this.calculateAge(newVal);
                } else {
                    this.newForm.age = '';
                }
            });
        },
        handleImportCancel() {
            this.importDialogVisible = false;
            this.resetNewForm();
        },
        handleImportConfirm() {
            if (this.isSubmitting) return; // 防重复点击
            this.isSubmitting = true;      // 点击后立即禁用按钮

            // 表单验证
            const requiredFields = {
                userName: '用户名称',
                memberGender: '成员性别',
                birthDate: '出生日期',
                height: '身高',
                mobileNumber: '手机号码',
                emName: '紧急联系人姓名',
                emContel: '紧急联系人电话',
                emergencyContactRelation: '紧急联系人关系',
                waistline: '腰围',
                bodyStatus: '身体状况',
                userType: '用户类型',
                nickName: '用户昵称',
                residentialAddress: "居住地址"
            };

            for (const [field, name] of Object.entries(requiredFields)) {
                if (!this.newForm[field]) {
                    this.$message.error(`请填写${name}`);
                    this.isSubmitting = false; // 验证失败恢复按钮
                    return;
                }
            }

            if (this.newForm.userType === '0' && !this.newForm.selectedOrg) {
                this.$message.error('请选择机构');
                this.isSubmitting = false;
                return;
            }

            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(this.newForm.mobileNumber)) {
                this.$message.error('请输入正确的手机号码');
                this.isSubmitting = false;
                return;
            }
            if (!phoneRegex.test(this.newForm.emContel)) {
                this.$message.error('请输入正确的紧急联系人电话');
                this.isSubmitting = false;
                return;
            }

            if (this.newForm.birthDate) {
                this.newForm.age = this.calculateAge(this.newForm.birthDate);
            }

            // 构造参数
            const params = {
                userName: this.newForm.userName,
                password: "",
                serialNumber: this.newForm.mobileNumber,
                age: this.newForm.age,
                weight: this.newForm.weight,
                height: this.newForm.height,
                userType: 0,
                nickName: this.newForm.userName,
                sex: this.newForm.memberGender,
                birthDay: this.newForm.birthDate,
                waistline: this.newForm.waistline,
                emContel: this.newForm.emContel,
                emName: this.newForm.emName,
                emergencyContactRelation: this.newForm.emergencyContactRelation,
                address: this.newForm.residentialAddress,
                maritalStatus: this.newForm.maritalStatus,
                livingSituation: this.newForm.livingSituation,
                personnelCategory: this.newForm.personnelCategory,
                medicalHistoryType: this.newForm.medicalHistoryType,
                bodyStatus: this.newForm.bodyStatus,
                orgId: this.newForm.selectedOrg?.orgId || '',
                userType: parseInt(this.newForm.userType) || 0,
                nickName: this.newForm.userName,
            };

            adduser(params)
                .then((result) => {
                    if (result.code === "200") {
                        if (result.data === '用户已存在') {
                            this.$message.error('用户已存在！');
                            this.isSubmitting = false; // 恢复按钮
                            return;
                        }
                        this.$message.success('用户信息保存成功！');
                        this.importDialogVisible = false;
                        this.resetNewForm();
                        this.getLoginLog();
                    } else {
                        this.$message.error('用户信息保存失败！');
                        this.isSubmitting = false; // 恢复按钮
                    }
                })
                .catch((error) => {
                    console.error("请求失败:", error);
                    this.$message.error('用户信息保存失败，请重试！');
                    this.isSubmitting = false; // 恢复按钮
                });
        },
        handleImportCancel() {
            this.importDialogVisible = false;
            this.isSubmitting = false; // 关闭弹窗也恢复按钮
        },
        handleEditCancel() {
            this.editDialogVisible = false;
        },
        handleEditConfirm() {
            if (!this.validateEditForm()) {
                return;
            }

            // 提交前确保年龄是最新的
            if (this.editForm.birthDate) {
                this.editForm.age = this.calculateAge(this.editForm.birthDate);
            }
            const params =
            {
                userId: this.editForm.userId,
                height: this.editForm.height,
                birthDay: this.editForm.birthDay,
                address: this.editForm.address,
                serialNumber: this.editForm.serialNumber,
                nickName: this.editForm.nickName,
                sex: this.editForm.sex,
                weight: this.editForm.weight,
                userName: this.editForm.userName,
                waistline: this.editForm.waistline,
                allergicHistory: [],
                anamnesis: [],
                nickName: this.editForm.nickName,
                emContel: this.editForm.emContel,
                emName: this.editForm.emName,

            };

            edituser(params).then((res) => {
                if (res.code === "200") {
                    if (res.msg === "success") {
                        this.$message.success('用户信息更新成功！');
                        this.editDialogVisible = false;
                        this.getLoginLog();
                    }
                }
            })
        },
        handleUserHistoryDevice() {
            this.historyDeviceDialogVisible = true;
        },
        resetNewForm() {
            this.newForm = {
                userName: '',
                memberGender: '',
                idNumber: '',
                birthDate: '',
                age: '',
                height: '',
                weight: '',
                mobileNumber: '',
                emName: '',
                emContel: '',
                emergencyContactRelation: '',
                waistline: '',
                residentialAddress: '',
                personnelCategory: '',
                maritalStatus: '',
                livingSituation: '',
                bodyStatus: '',
                medicalHistoryType: '',
                selectedOrg: null,
                userType: '',
            };
            // 添加出生日期监听
            this.$watch('newForm.birthDate', (newVal) => {
                if (newVal) {
                    this.newForm.age = this.calculateAge(newVal);
                } else {
                    this.newForm.age = '';
                }
            });
        },
        validateNewForm() {
            const requiredFields = [
                'userName', 'memberGender', 'birthDate', 'height', 'mobileNumber',
                'emName', 'emContel', 'emergencyContactRelation',
                'bodyStatus',
            ];
            for (const field of requiredFields) {
                if (!this.newForm[field]) {
                    this.$message.error(`请填写所有必填项: ${field}`);
                    return false;
                }
            }
            return true;
        },
        validateEditForm() {
            const requiredFields = {
                userName: '用户名称',
                sex: '成员性别',
                birthDay: '出生日期',
                height: '身高',
                weight: '体重',
                serialNumber: '手机号码',
                waistline: '腰围', // 新增腰围字段
            };

            for (const [field, name] of Object.entries(requiredFields)) {
                if (!this.editForm[field]) {
                    this.$message.error(`${name}不能为空`);
                    return false;
                }
            }

            // 验证手机号码格式
            // const phoneRegex = /^1[3-9]\d{9}$/;
            // if (!phoneRegex.test(this.editForm.mobileNumber)) {
            //     this.$message.error('手机号码格式不正确');
            //     return false;
            // }

            return true;
        },

        handleProvinceChange(value) {

            this.cities = [];
            this.counties = [];
            const selectedProvince = this.provinces.find(p => p.province === value);
            this.cities = selectedProvince ? selectedProvince.citys : [];
        },
        handleCityChange(value) {

            this.counties = [];
            const selectedCity = this.cities.find(c => c.city === value);
            this.counties = selectedCity ? selectedCity.areas : [];
        },
    },
    mounted() {
        this.getrelationshis()

    },
};
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

/* Dialog styles */
.device-detail-dialog /deep/ .el-dialog {
    border-radius: 20px !important;
    overflow: hidden;
}

:deep(.el-dialog__header) {
    text-align: center;
    padding: 20px 0;
    border-bottom: 1px solid #f0f0f0;
}

:deep(.el-dialog__title) {
    font-size: 18px;
    font-weight: 500;
}

:deep(.el-dialog__body) {
    padding: 20px 30px;
}

:deep(.el-dialog__footer) {
    padding: 15px 0;
    text-align: center;
    border-top: 1px solid #f0f0f0;
}
</style>

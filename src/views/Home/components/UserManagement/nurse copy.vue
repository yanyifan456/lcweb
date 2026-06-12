<template>
    <div class="boxbig" ref="container">
        <!-- 筛选查询区域 -->
        <div style="width: 500px;height: 30px;display: flex;">
            <div class="box-a"></div>
            <div class="box-b">筛选查询</div>
        </div>
        <div class="box-c">
            <!-- 第一行：设备名称、入库单号、批次号 -->
            <div class="filter-row">
                <div class="filter-item">
                    <span class="filter-label">家庭护士</span>
                    <el-select v-model="filterForm.familyDoctor" placeholder="请选择护士" class="filter-input">
                        <el-option v-for="item in doctorOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>


                <div class="filter-item">
                    <span class="filter-label">报告人手机号</span>
                    <el-input v-model="filterForm.serialNumber" placeholder="请输入手机号" class="filter-input"></el-input>
                </div>
                <div class="filter-item">
                    <span class="filter-label" style="margin-left: 27px;">报告时间：</span>
                    <div class="date-picker-container">
                        <el-date-picker v-model="filterForm.createTime" type="date" placeholder="请选择日期"
                            class="date-picker" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                </div>
                <div class="filter-buttons">
                    <el-button class="reset-btn" @click="handleReset">重置</el-button>
                    <el-button class="query-btn" @click="handleQuery">查询</el-button>
                </div>
            </div>
        </div>
        <!-- 设备入库标题和操作按钮 -->
        <div style="width: 100%;height: 40px;display: flex;margin-top: 30px;justify-content: space-between;">
            <div style="display: flex;">
                <div class="box-aa"></div>
                <div class="box-cc">健康报告</div>
            </div>
            <!-- <div style="display: flex;">
                <el-button class="button-a">
                    <i class="el-icon-refresh-left"></i>
                </el-button>
                <el-button class="button-a">
                    <i class="el-icon-s-tools"></i>
                </el-button>
                <el-button class="button-a">
                    <i class="el-icon-setting"></i>
                </el-button>
            </div> -->
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
            <template #empty>
                <el-empty description="请先选择护士"></el-empty>
            </template>
            <el-table-column :show-overflow-tooltip="true" fixed="left" prop="reportId" label="报告ID" align="center">
            </el-table-column>
            <el-table-column prop="userName" label="报告人姓名" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="报告时间" align="center">
            </el-table-column>
            <el-table-column prop="sendTime" label="下发报告时间" align="center">
                <template slot-scope="scope">
                    {{ scope.row.sendTime.slice(0, 19) }}
                </template>
            </el-table-column>
            <el-table-column prop="doctorName" label="医生名称" align="center">
            </el-table-column>
            <el-table-column prop="nurseTime" label="确认时间" align="center">
            </el-table-column>
            <el-table-column prop="" label="医嘱确认" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="yizhuquren(scope.row)">医嘱确认</el-button>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="deviceSupplier" label="医嘱" width="315" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="healthyizhu(scope.row)">医嘱填写</el-button>
                </template>
</el-table-column> -->
            <el-table-column prop="" label="体检报告" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="healthpots(scope.row)">报告详情</el-button>
                </template>
            </el-table-column>

            <el-table-column class="aasd" fixed="right" style="margin-top: 0;" label=" 操作" width="250" align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="handleDetail(scope.row)">详情</el-button>
                    <el-button type="text" size="small" class="action-btn detail-btn"
                        @click="dayinyizhuzxd(scope.row)">打印医嘱执行单</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
            <div style="display: flex;float: right;margin-top: 30px;align-items: center;">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10, 50, 100, 200]" :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="totalItems">
                </el-pagination>
            </div>
        </div>
        <!-- 设备详情弹出框 -->
        <el-dialog title="详情" :visible.sync="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false"
            class="device-detail-dialog">
            <div class="detail-content">
                <el-table :data="detailTableData" style="width: 100%" :header-cell-style="{
                    background: '#f8f9fa',
                    color: '#333',
                    fontWeight: '500',
                    fontSize: '14px',
                    height: '50px',
                    textAlign: 'center'
                }" :cell-style="{
                    fontSize: '14px',
                    color: '#666',
                    textAlign: 'center',
                    height: '50px'
                }" :row-style="{ height: '50px' }">
                    <el-table-column prop="userName" label="报告人姓名" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="报告时间" align="center"></el-table-column>
                    <el-table-column prop="doctorName" label="医生名称" align="center"></el-table-column>
                    <el-table-column label="医嘱" align="center">
                        <template slot-scope="scope">
                            <el-tooltip placement="top" popper-class="html-tooltip" :disabled="!scope.row.nurseAdvice">
                                <!-- Tooltip 内容：显示所有医嘱（通过 formatAdviceHtml 生成） -->
                                <div slot="content" v-html="formatAdviceHtml(scope.row.nurseAdvice)"></div>

                                <!-- 表格单元格：仅显示第一条医嘱 -->
                                <div class="advice-cell">
                                    <div v-if="parseAdvice(scope.row.nurseAdvice).length > 0" class="advice-item">
                                        {{ parseAdvice(scope.row.nurseAdvice)[0].value }} - ￥{{
                                            parseAdvice(scope.row.nurseAdvice)[0].label }}...
                                    </div>
                                    <span v-else>--</span>
                                </div>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 删除分页部分 -->
            </div>
        </el-dialog>
        <el-dialog title="" :visible.sync="dialogVisibles" :close-on-click-modal="false" :close-on-press-escape="false"
            class="yizhu-dialog" width="60%">
            <div class="yizhu-content" id="reportContents">

                <div class="table-title">{{ ro }}机构医嘱执行单</div>


                <table class="styled-table info-table">
                    <tr>
                        <td class="info-cell">姓名：{{ ekk.userName }}</td>
                        <td class="info-cell">性别：{{ ekk.sex }}</td>
                        <td class="info-cell">年龄：{{ ekk.age }}</td>
                    </tr>
                    <tr>
                        <td class="info-cell">报告生成时间:{{ ekk.createTime }}</td>
                        <td class="info-cell">
                            报告下发时间:{{ ekk.sendTime ? ekk.sendTime.slice(0, 19) : '暂无数据' }}
                        </td>

                        <td class="info-cell">报告下发医生姓名：{{ ekk.doctorName }}</td>
                    </tr>
                </table>


                <div class="yizhu-list">
                    <el-table ref="adviceTable" @selection-change="" :data="asdsq" style="width: 100%; margin-top: 0;"
                        border>

                        <el-table-column prop="value" label="服务名称" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.value }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="times" label="服务次数" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.times }}次
                            </template>
                        </el-table-column>
                        <el-table-column prop="label" label="金额" width="120" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.label !== '0'">
                                    ¥{{ scope.row.label }}
                                </span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="executeTime" label="执行时间" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.executeTime }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="nurseName" label="护士签名" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.nurseName }}
                            </template>
                        </el-table-column>
                    </el-table>

                </div>


                <table class="styled-table footer-table">
                    <tr>
                        <td colspan="4" class="total-label">总金额</td>
                        <td>{{ ekk.totalfee }}</td>
                    </tr>
                    <tr>
                        <td colspan="4" class="total-label">医生签名</td>
                        <td></td>

                    </tr>
                </table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="dayinsssss">打印</el-button>
                <el-button class="cancel-btn" @click="dialogVisibles = false">取消</el-button>


            </div>
        </el-dialog>

        <!-- 医嘱选择弹出框 -->
        <el-dialog title="医嘱确认" :visible.sync="yizhuDialogVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" class="yizhu-dialog" width="60%">
            <div class="yizhu-content">
                <div class="yizhu-header">
                    <h3>请确认医嘱服务</h3>

                </div>
                <div class="yizhu-list">
                    <el-table ref="adviceTable" @selection-change="handleSelectionChange" :data="adviceList"
                        style="width: 100%" border>

                        <!-- 复选框列 -->
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <!-- 服务名称 -->
                        <el-table-column prop="value" label="服务名称" align="center">
                            <template slot-scope="scope">
                                <span placement="top" effect="dark">
                                    <span>{{ scope.row.value }}</span>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="times" label="服务次数" align="center">
                            <template slot-scope="scope">
                                {{ scope.row.times }}次
                                <!-- <input v-model.number="scope.row.times" type="number" min="0" class="times-input" />
                                <span class="unit">次</span> -->
                            </template>
                        </el-table-column>

                        <el-table-column prop="label" label="价格" width="120" align="center">
                            <template slot-scope="scope">
                                <span v-if="scope.row.label !== '0'">
                                    ¥{{ scope.row.label }}
                                </span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="yizhuDialogVisible = false">取消</el-button>
                <el-button class="confirm-btn" @click="confirmYizhu">确认选择</el-button>
            </div>
        </el-dialog>
        <!-- 健康报告详情弹出框 -->
        <el-dialog title="健康报告详情" :visible.sync="healthReportDialogVisible" :close-on-click-modal="false"
            :close-on-press-escape="false" class="health-report-dialog" width="80%" top="5vh">
            <div class="health-report-content" id="reportContent">
                <div style="text-align: center;font-size: 30px;font-weight: bold;margin-bottom: 150px;"> {{
                    currentHealthReport.userName }}的健康报告 </div>
                <!-- 医嘱信息显示 -->
                <div style="width: 100%; text-align: center; margin: 20px 0;">
                    <!-- 图片设置为块级元素并居中 -->
                    <img style="display: block; margin: 0 auto; max-width: 80%;" src="../../../../assets/111.png"
                        alt="报告图片">
                </div>
                <div
                    style="text-align: center;margin-top: 150px;margin-bottom: 10px;font-size: 20px;font-weight: bold;">
                    樂創
                </div>
                <div style="text-align: center;margin-bottom: 10px;font-size: 20px;font-weight: bold;">
                    RUOGU
                </div>
                <div
                    style="text-align: center; margin-bottom: 20px; font-size: 20px; font-weight: bold; margin-top: 200px;">
                    报告时间： {{ currentHealthReport.createTime }}
                </div>
                <div v-html="healthpt" class="reportBox"></div>
                <!-- 替换原来的 <div>医嘱</div> -->
                <div style="margin-top: 50px;">
                    <!-- <div style="font-weight: bold; font-size: 16px; cursor: pointer; color: #089BAB;margin-bottom: 5px;"
                        @click="healthyizhu(currentHealthReport)">医嘱:(点击填写医嘱)</div> -->

                    <!-- Added select all checkbox -->
                    <div
                        style="margin-bottom: 15px; display: flex; align-items: center; font-size: 14px; font-weight: bold;">
                        <span>全选:</span>
                        <el-checkbox v-model="selectAll" @change="handleSelectAll" label="" size="large"
                            style="margin-left: 10px;" />
                    </div>

                    <div style="margin-bottom: 20px; display: flex; font-size: 14px; width: 100%;"
                        v-for="(yizhu, index) in patientYizhu" :key="index">
                        <div>
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ yizhu.serviceName
                            }}&nbsp;&nbsp;&nbsp;
                                <span v-if="yizhu.servicePrice !== '0'">¥<span style="font-weight: bold;">{{
                                    yizhu.servicePrice
                                        }}</span></span>
                                <span
                                    style="font-weight: bold;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                                        yizhu.times }}次</span>
                            </span>
                        </div>
                        <!-- Hidden individual checkbox selection state but kept functionality -->
                        <div style="margin-left: auto;">
                            确认 <el-checkbox v-model="yizhu.selected" @change="handleIndividualChange" label=""
                                size="large" :show-label="false" />
                        </div>
                    </div>
                </div>
                <div
                    style="display: flex;justify-content: flex-end; align-items: flex-start;margin-top: 100px;margin-bottom: 20px;">
                    家庭医生签名 :
                    <div style="width: 80px;height: 16px;border-bottom: 1px solid black;">
                    </div>

                </div>
                <div style="display: flex;justify-content: flex-end; align-items: flex-start;margin-right: 30px;">
                    报告时间&nbsp;:{{
                        currentHealthReport.createTime }}</div>

            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="cancel-btn" @click="healthReportDialogVisible = false">关闭</el-button>
                <el-button class="export-btn" @click="exportReport">导出报告</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import { addgetlist, getlistb, getdoctor, getdoctorlist, getdoctorlists, getnurselist } from '../../../../api/healthreport.js'
import { marked } from "marked"
import html2canvas from "html2canvas";
import { Message } from 'element-ui';

import jsPDF from "jspdf"
export default {
    name: 'DeviceWarehouse',
    data() {
        return {
            filterForm: {
                deviceName: '',
                createTime: '',
                serialNumber: '',
                familyDoctor: ''
            },
            services: [
                {
                    serviceName: "服务1",
                    serviceCount: 2,
                    amount: 100,
                    executionTime: "2025-10-10 10:00",
                    nurseSign: "张三"
                },
                {
                    serviceName: "服务2",
                    serviceCount: 1,
                    amount: 50,
                    executionTime: "2025-10-10 12:00",
                    nurseSign: "李四"
                }
            ],
            totalAmount: 150,
            selectAll: false,
            selectedPatientYizhu: [],
            adviceList: [],
            healthpt: '',
            ekk: {},
            doctorOptions: [],
            detailTableData: [],
            dialogVisible: false,
            dialogVisibles: false,
            ro: sessionStorage.getItem('orgName'),
            healthReportDialogVisible: false,
            yizhuDialogVisible: false,
            currentHealthReport: {},
            currentPatient: {},
            yizhuOptions: [],
            selectedYizhu: [],
            patientYizhu: [], // 存储患者的医嘱信息
            currentPage: 1,
            pageSize: 10,
            totalItems: 0,
            tableData: [],
            asdsq: [],
            detailCurrentPage: 1,
            detailPageSize: '10',
            detailTotalPages: 10,
            jumpPage: '',
            // 设备导入相关数据
            importDialogVisible: false,
            importForm: {
                organizationName: '',
                organizationShortName: '',
                organizationType: '',
                parentOrganization: '',
                organizationLeader: '',
                leaderPhone: '',
                firstServicePerson: '',
                firstServicePhone: '',
                province: '',
                city: '',
                county: '',
                organizationAddress: '',
                longitude: '',
                latitude: '',
                status: 1
            },
            total: 0,
            // 筛选相关数据
            warehouseNumberSearch: '',
            batchNumberSearch: '',
            warehouseNumberSearchTemp: '',
            batchNumberSearchTemp: '',
            filteredTableData: [],
            originalTableData: [],
            // 自定义弹出框相关数据
            filterPopoverVisible: false,
            filterType: '', // 'warehouse' 或 'batch'
            currentSearchTemp: '',
            popoverStyle: {
                top: '0px',
                left: '0px'
            }
        }
    },

    methods: {
        handleSelectAll() {
            this.patientYizhu.forEach(yizhu => {
                yizhu.selected = this.selectAll;
            });
        },

        handleIndividualChange() {
            const allSelected = this.patientYizhu.every(yizhu => yizhu.selected);
            const noneSelected = this.patientYizhu.every(yizhu => !yizhu.selected);

            if (allSelected) {
                this.selectAll = true;
            } else if (noneSelected) {
                this.selectAll = false;
            } else {
                this.selectAll = false; // Indeterminate state, set to false
            }
        },
        // 医嘱确认
        async yizhuquren(row) {
            this.currentPatient = row;


            try {
                if (typeof row.advice === 'string') {
                    this.adviceList = JSON.parse(row.advice);


                } else if (Array.isArray(row.advice)) {
                    this.adviceList = row.advice;


                }
            } catch (e) {
                console.error("解析 nurseAdvice 失败:", e);
                this.adviceList = [];
            }

            this.yizhuDialogVisible = true;

            // 等待表格渲染完毕再全选
            this.$nextTick(() => {
                this.adviceList.forEach(item => {
                    this.$refs.adviceTable.toggleRowSelection(item, true);
                });
                // 同步 selectedYizhu
                this.selectedYizhu = [...this.adviceList];
            });
        },


        async getTableData() {
            try {
                // 1. 获取必要的会话存储数据
                const mainOrg = sessionStorage.getItem('mainOrg');
                const userId = sessionStorage.getItem('userId');
                const roleName = sessionStorage.getItem('roleName');

                // 2. 动态构建请求参数
                const requestParams = {
                    profession: "护士"
                };

                // 3. 根据角色类型决定传递的参数
                if (roleName === '超级管理员') {

                } else if (roleName === '普通用户') {
                    // 普通用户只传递自己的 userId
                    requestParams.userId = userId;
                    requestParams.mainOrg = mainOrg;


                } else {
                    // 其他非超级管理员角色传递 mainOrg
                    requestParams.mainOrg = mainOrg;

                }

                // 4. 发起请求
                const res = await getdoctorlists(requestParams);

                // 5. 处理响应数据
                if (res?.code === "200" && Array.isArray(res.data?.data)) {
                    this.doctorOptions = res.data.data.map(doctor => ({
                        label: doctor.userName,
                        value: doctor.userId
                    }));
                } else {
                    console.warn('获取医生列表失败', res);
                    this.doctorOptions = []; // 设置默认空数组
                }
            } catch (error) {
                // 6. 错误处理
                console.error('获取医生数据异常:', error);
                this.doctorOptions = [];
                // 可选：显示用户提示 this.$message.error('医生数据加载失败');
            }
        },
        exportReport() {
            this.$nextTick(() => {
                const element = document.getElementById('reportContent');
                if (!element) return;
                const loading = this.$loading({
                    lock: true,
                    text: '正在生成报告...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                const images = element.querySelectorAll('img');
                const loadPromises = Array.from(images).map(img => {
                    return new Promise(resolve => {
                        if (img.complete) resolve();
                        else img.onload = resolve;
                    });
                });

                Promise.all(loadPromises).then(() => {
                    const options = {
                        scale: 5,
                        useCORS: true,
                        logging: true,
                        backgroundColor: '#FFFFFF'
                    };

                    html2canvas(element, options).then(canvas => {
                        const pdf = new jsPDF('p', 'mm', 'a4');
                        const imgWidth = 190;
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        const pageHeight = 277;
                        let position = 0;
                        const lineHeight = 37;
                        let totalPages = 0;

                        // 计算总页数
                        let tempPos = 0;
                        while (tempPos < imgHeight) {
                            let h = Math.min(pageHeight, imgHeight - tempPos);
                            if (h % lineHeight !== 0 && tempPos + h < imgHeight) {
                                h = Math.floor(h / lineHeight) * lineHeight;
                            }
                            tempPos += h;
                            totalPages++;
                        }

                        // 重置位置，开始生成每一页
                        position = 0;
                        for (let page = 0; page < totalPages; page++) {
                            let startY = position;
                            let pageImgHeight = Math.min(pageHeight, imgHeight - position);

                            if (pageImgHeight % lineHeight !== 0 && position + pageImgHeight < imgHeight) {
                                pageImgHeight = Math.floor(pageImgHeight / lineHeight) * lineHeight;
                            }

                            const pageCanvas = document.createElement('canvas');
                            pageCanvas.width = canvas.width;
                            pageCanvas.height = (pageImgHeight * canvas.width) / imgWidth;
                            const ctx = pageCanvas.getContext('2d');
                            ctx.drawImage(
                                canvas,
                                0, startY * canvas.width / imgWidth,
                                canvas.width, pageCanvas.height,
                                0, 0,
                                pageCanvas.width, pageCanvas.height
                            );

                            const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0);

                            // 设置默认字体（Helvetica 支持数字）
                            pdf.setFont('helvetica', 'normal');
                            pdf.setFontSize(10);

                            // === 页眉和页脚内容完全一致 ===
                            const pageText = `${page + 1}`; // 统一内容

                            // 页眉（顶部居中）
                            // pdf.text(pageText, 105, 8, { align: 'center' });

                            // 页脚（底部居中）
                            pdf.text(pageText, 105, 295, { align: 'center' });

                            pdf.addImage(pageImgData, 'JPEG', 10, 15, imgWidth, pageImgHeight * 0.95);

                            if (page < totalPages - 1) {
                                pdf.addPage();
                            }

                            position += pageImgHeight;
                        }

                        // 下载文件
                        const fileName = `${this.currentHealthReport.userName}_健康报告_${this.formatDate(new Date())}.pdf`;
                        pdf.save(fileName);
                        loading.close();
                        this.$message.success(`报告导出成功，共 ${totalPages} 页`);
                    }).catch(err => {
                        console.error('导出失败:', err);
                        loading.close();
                        this.$message.error('报告导出失败');
                    });
                });
            });
        },
        dayinsssss() {
            // 显示加载提示
            const loading = this.$loading({
                text: '正在导出 PDF，请稍候...', // 提示文字
                background: 'rgba(0, 0, 0, 0.7)', // 背景透明度
            });

            const content = document.getElementById('reportContents');  // 获取需要导出的内容

            // 使用 html2canvas 截取内容为图片
            html2canvas(content, {
                scale: 5, // 提高截图的分辨率
                useCORS: true, // 处理外部图片的跨域问题
            }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a5'); // 设置纸张尺寸为 A5
                const imgWidth = 148.5; // A5 纸张宽度，单位为毫米
                const imgHeight = (canvas.height * imgWidth) / canvas.width; // 根据比例调整高度

                // 将图片添加到 PDF 中
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

                // 如果图片的高度超过了 A5 纸张的高度（210mm），则添加新页面
                if (imgHeight > 210) { // 210mm 是 A5 纸张的高度
                    let remainingHeight = imgHeight - 210;
                    let yOffset = 210;

                    // 添加新页面，直到图片内容全部显示完
                    while (remainingHeight > 0) {
                        pdf.addPage(); // 添加新页面
                        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, remainingHeight);
                        remainingHeight -= 210;
                        yOffset = 0; // 重置 yOffset
                    }
                }

                // 生成文件名，包含用户名和生成时间
                const fileName = `${this.ekk.userName}_${this.ekk.createTime}.pdf`;
                pdf.save(fileName); // 保存 PDF 文件

                // 导出完成后，关闭加载提示
                loading.close();
            }).catch(() => {
                // 如果发生错误，关闭加载提示并显示错误信息
                loading.close();
                this.$message.error('导出失败，请重试！');
            });
        },

        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}${month}${day}`;
        },

        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.currentPage = 1  // 重置到第一页
            this.getList()
        },

        // 当前页码变化
        handleCurrentChange(newPage) {
            this.currentPage = newPage
            this.getList()
        },
        async getList() {

            if (this.filterForm.familyDoctor === '' && this.filterForm.serialNumber === '' && this.filterForm.createTime === '') {
                // Vue.prototype.$message && Vue.prototype.$message.error("请先选择机构");
                Message.closeAll()
                Message.warning({
                    message: "请先选择护士",
                    duration: 2000,
                    type: "warning"
                })
                return
            } else {
                const params = {
                    nurseId: this.filterForm.familyDoctor,  // 使用选中的家庭医生的 userId
                    currentPage: this.currentPage,
                    pageSize: this.pageSize,
                    serialNumber: this.filterForm.serialNumber,
                    createTime: this.filterForm.createTime
                };

                const res = await addgetlist(params);
                if (res.code === "200" && res.data.message === "没有健康报告信息") {
                    this.tableData = [];
                    this.total = '';
                } else if (res.code === "200") {
                    this.tableData = res.data.data;
                    this.totalItems = res.data.total || 0;

                }
            }

        },
        handleReset() {
            this.filterForm = {
                deviceName: '',
                warehouseNumber: '',
                batchNumber: '',
                startDate: '',
                endDate: '',
                familyDoctor: '',
                serialNumber: '',
                createTime: ''
            }
            this.currentPage = 1;
            this.tableData = []
        },
        handleQuery() {

            this.getList()

        },
        handleEdit(row) {

            this.$router.push('/BStorageentry');
        },
        handleDetail(row) {
            this.detailTableData = [row];
            this.dialogVisible = true;
        },
        dayinyizhuzxd(row) {
            this.ekk = row;
            this.asdsq = JSON.parse(this.ekk.advice);
            this.dialogVisibles = true;
        },
        parseAdvice(adviceStr) {
            if (!adviceStr) return [];
            try {
                // 如果 adviceStr 是 JSON 字符串（如 "[{"value":"阿司匹林","label":"10"}]"）
                if (typeof adviceStr === 'string' && adviceStr.startsWith('[')) {
                    return JSON.parse(adviceStr);
                }
                // 如果 adviceStr 已经是数组（如后端直接返回数组）
                return Array.isArray(adviceStr) ? adviceStr : [];
            } catch (e) {
                console.error("解析医嘱失败:", e);
                return [];
            }
        },
        // 医嘱填写
        healthyizhu(row) {
            this.currentPatient = row;
            this.selectedYizhu = [];
            this.yizhuDialogVisible = true;

            // 解析当前行的advice字段
            let adviceList = [];
            try {
                adviceList = JSON.parse(row.advice);
            } catch (e) {
                console.error("解析advice失败:", e);
                adviceList = Array.isArray(row.advice) ? row.advice : [];
            }

            // 匹配并勾选医嘱选项
            this.$nextTick(() => {
                adviceList.forEach(item => {
                    const matchedItem = this.yizhuOptions.find(option =>
                        option.serviceName === item.value
                    );

                    if (matchedItem && !this.selectedYizhu.includes(matchedItem)) {
                        this.selectedYizhu.push(matchedItem);
                    }
                });
            });
        },

        async confirmYizhu() {

            const invalidItem = this.selectedYizhu.find(item => !item.times || item.times <= 0);
            if (invalidItem) {
                this.$message.warning(`增值服务次数至少1次`);
                return;
            }
            // 构造参数（直接使用选中的医嘱数据）
            const params = {
                doctorId: this.currentPatient.doctorId,
                reportId: this.currentPatient.reportId,
                nurseId: this.currentPatient.nurseId,
                nurseAdvice: JSON.stringify(
                    this.selectedYizhu.map(item => ({
                        value: item.value,    // 服务名称字段
                        label: item.label,
                        times: item.times,   // 服务价格字段
                    }))
                )
            };
            // 发送请求
            try {
                const res = await getdoctorlist(params);
                if (res.code === "200") {
                    this.$message.success("确认成功");
                    this.getList(); // 刷新表格数据                                     
                }
            } catch (error) {
                this.$message.error("确认失败");
            }
            this.yizhuDialogVisible = false;
        },
        handleSelectionChange(selection) {
            this.selectedYizhu = selection; // 更新选中的医嘱数据
        },
        async healthpots(row) {
            this.getList()
            this.currentHealthReport = {
                ...row,
                createTime: row.createTime ? row.createTime.split(' ')[0] : null, // 格式：YYYY-MM-DD
            };
            this.healthReportDialogVisible = true;
            // 解析 advice 字段（如果是 JSON 字符串）
            let adviceList = [];
            if (row.nurseAdvice) {
                try {
                    // 尝试解析 JSON 字符串
                    adviceList = JSON.parse(row.nurseAdvice);
                } catch (e) {
                    console.error("解析 advice 失败:", e);
                    // 如果不是 JSON 字符串，可能是数组格式（如 "[{...}]" 已被解析）
                    adviceList = Array.isArray(row.nurseAdvice) ? row.nurseAdvice : [];

                }
            }
            // 获取报告内容
            const res = await getlistb({ id: row.id });
            this.healthpt = res.data.report;

            // 渲染 Markdown
            marked.setOptions({
                gfm: true,
                breaks: true,
                smartLists: true,
                smartypants: false
            });

            try {
                this.healthpt = marked.parse(res.data.report);
                this.healthpt = this.healthpt.replace(/<hr>/g, "");
            } catch (e) {
                console.error("Markdown 转换失败:", e);
            }
            // 将医嘱数据存储到 patientYizhu（假设这是用于显示医嘱的变量）
            this.patientYizhu = adviceList.map(item => ({
                serviceName: item.value,  // 显示 value 作为服务名称
                servicePrice: item.label, // 显示 label 作为价格
                times: item.times,
                selected: false
            }));
        },
        downloadReport() {
            // 下载报告逻辑
            this.$message.success('报告下载成功！');
        },
        handlePageChange(page) {
            this.currentPage = page;
            this.getList();
        },
        handleAdd() {
            this.$router.push('/QStorageentry');
        },
        handleDetailPageChange(page) {
            if (page < 1) {
                this.detailCurrentPage = 1;
            } else if (page > this.detailTotalPages) {
                this.detailCurrentPage = this.detailTotalPages;
            }
        },
        handleJumpPage() {
            const page = parseInt(this.jumpPage);
            if (page >= 1 && page <= this.detailTotalPages) {
                this.detailCurrentPage = page;
                this.jumpPage = '';
            }
        },
        // 设备导入相关方法
        handleImport() {
            this.importDialogVisible = true;
        },
        handleImportCancel() {
            this.importDialogVisible = false;
            this.resetImportForm();
        },
        handleImportConfirm() {
            // 表单验证
            if (!this.validateImportForm()) {
                return;
            }
            // 模拟提交成功
            this.$message.success('机构信息保存成功！');
            this.importDialogVisible = false;
            this.resetImportForm();
        },
        resetImportForm() {
            this.importForm = {
                organizationName: '',
                organizationShortName: '',
                organizationType: '',
                parentOrganization: '',
                organizationLeader: '',
                leaderPhone: '',
                firstServicePerson: '',
                firstServicePhone: '',
                province: '',
                city: '',
                county: '',
                organizationAddress: '',
                longitude: '',
                latitude: '',
                status: 1
            };
            this.cities = [];
            this.counties = [];
        },
        handleProvinceChange(value) {
            this.importForm.city = '';
            this.importForm.county = '';
            this.counties = [];
            // 找到选中省份的城市列表
            const selectedProvince = this.provinces.find(p => p.province === value);
            this.cities = selectedProvince ? selectedProvince.citys : [];
        },
        handleCityChange(value) {
            this.importForm.county = '';
            // 找到选中城市的区域列表
            const selectedCity = this.cities.find(c => c.city === value);
            this.counties = selectedCity ? selectedCity.areas : [];
        },
        calculatePopoverPosition(event) {
            // 获取点击位置
            const clickX = event.clientX;
            const clickY = event.clientY;
            // 设置弹出框位置，稍微偏移避免遮挡
            this.popoverStyle = {
                top: `${clickY + 10}px`,
                left: `${clickX - 100}px`
            };
        },
        formatAdviceHtml(advice) {
            if (!advice) return '';
            const adviceList = this.parseAdvice(advice);
            return adviceList.map(item => `${item.value}${item.label} - ￥ ${item.times} 次`).join('<br>');
        },
        closeFilterPopover() {
            this.filterPopoverVisible = false;
        },
        applyFilter() {
            if (this.filterType === 'warehouse') {
                this.warehouseNumberSearch = this.currentSearchTemp;
            } else {
                this.batchNumberSearch = this.currentSearchTemp;
            }
            this.filterTableData();
            this.filterPopoverVisible = false;
        },
        resetFilter() {
            this.currentSearchTemp = ''
        },
    },
    mounted() {

        if (this.patientYizhu) {
            this.patientYizhu.forEach(yizhu => {
                if (!yizhu.hasOwnProperty('selected')) {
                    this.$set(yizhu, 'selected', false);
                }
            });
        }
        this.getTableData()
    },
    watch: {
        // 监听 familyDoctor 变化
        'filterForm.familyDoctor'(newValue) {
            if (newValue) {
                // 当选择了一个医生时，调用 getList 获取相关数据
                this.getList();
            }
        }
    },
}
</script>

<style scoped>
/* 报告内容容器 */
.times-input {
    width: 60px;
    height: 25px;
    border: 1px solid #ccc;
    border-radius: 5px;
    text-align: center;
    margin-right: 5px;
}

.unit {
    font-size: 14px;
    color: #666;
}

#reportContent {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background: white;
    padding: 20px;
}

/* 避免在这些元素内部断页 */
.page-break-inside-avoid {
    page-break-inside: avoid;
}

/* 在这些元素前强制分页 */
.page-break-before {
    page-break-before: always;
}

/* 避免在段落内部断页 */
p {
    page-break-inside: avoid;
    orphans: 3;
    /* 至少保留3行 */
    widows: 3;
    /* 至少保留3行 */
}

/* 表格、图表等块级元素避免断开 */
table,
img,
.chart-container,
.section {
    page-break-inside: avoid;
    page-break-after: auto;
    page-break-before: auto;
}

/* 防止分页截断关键内容 */
.section {
    page-break-inside: avoid;
    margin-bottom: 30px;
}

h1 {
    text-align: center;
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
    color: #089BAB;
}

.filter-icon.active {
    color: #089BAB;
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

/* 医嘱选择弹出框样式 */
.yizhu-dialog /deep/ .el-dialog {
    width: 800px !important;
    border-radius: 20px !important;
    background: #FFFFFF;
}

.yizhu-dialog /deep/ .el-dialog__header {
    text-align: center;
    padding: 30px 30px 20px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #089BAB 0%, #16C0C0 100%);
    color: white;
    border-radius: 20px 20px 0 0;

}

.yizhu-dialog /deep/ .el-dialog__title {
    font-size: 20px;
    font-weight: 600;
    color: white;
}

.yizhu-dialog /deep/ .el-dialog__body {
    padding: 30px;
    max-height: 60vh;
    overflow-y: auto;
}

.yizhu-content {
    width: 100%;
    /* 两列布局 */
    /* display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px; */



}

.yizhu-header {
    margin-bottom: 30px;
    text-align: center;
}

.yizhu-header h3 {
    font-size: 18px;
    font-weight: 600;
    color: #089BAB;
    margin: 0 0 10px 0;
}

.yizhu-header p {
    font-size: 14px;
    color: #666;
    margin: 0;
}

.yizhu-list {
    /* display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 15px; */
}

.yizhu-item {
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 15px;
    transition: all 0.3s;
    background: #fafafa;
    margin-bottom: 20px;

}

.yizhu-item:hover {
    border-color: #089BAB;
    background: #f0f9ff;
    box-shadow: 0 2px 8px rgba(8, 155, 171, 0.1);
}

.yizhu-checkbox {
    width: 100%;
}

.yizhu-checkbox /deep/ .el-checkbox__label {
    width: 300px;
    padding-left: 10px;
}

.yizhu-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.service-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    flex: 1;
}

.service-price {
    font-size: 16px;
    font-weight: 600;
    color: #089BAB;
}

.service-type {
    font-size: 12px;
    color: #999;
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
}

/* 医嘱显示区域样式 */
.yizhu-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    border-left: 4px solid #089BAB;
}

.yizhu-title {
    font-size: 18px;
    font-weight: 600;
    color: #089BAB;
    margin: 0 0 20px 0;
}

.yizhu-display {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
}

.yizhu-card {
    background: white;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.yizhu-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.yizhu-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
}

.yizhu-price {
    font-size: 16px;
    font-weight: 600;
    color: #089BAB;
}

.yizhu-detail {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
    margin-bottom: 8px;
}

.yizhu-type {
    font-size: 12px;
    color: #999;
    background: #f0f0f0;
    padding: 2px 8px;
    border-radius: 4px;
    display: inline-block;
}

/* 健康报告弹出框样式 */
.health-report-dialog /deep/ .el-dialog {
    width: 900px !important;
    border-radius: 20px !important;
    background: #FFFFFF;
    max-height: 90vh;
    overflow: hidden;
}

.health-report-dialog /deep/ .el-dialog__header {
    text-align: center;
    padding: 30px 30px 20px;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(135deg, #089BAB 0%, #16C0C0 100%);
    color: white;
    border-radius: 20px 20px 0 0;
}

.health-report-dialog /deep/ .el-dialog__title {
    font-size: 20px;
    font-weight: 600;
    color: white;
}

.health-report-dialog /deep/ .el-dialog__body {
    padding: 0;
    max-height: 70vh;
    overflow-y: auto;
}

.health-report-content {
    padding: 30px;
}

.report-header {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #f0f0f0;
}

.report-header h2 {
    font-size: 24px;
    font-weight: 600;
    color: #089BAB;
    margin: 0 0 15px 0;
    text-align: center;
}

.report-meta {
    display: flex;
    justify-content: center;
    gap: 30px;
    font-size: 14px;
    color: #666;
}

.report-body {
    line-height: 1.8;
    font-size: 15px;
    color: #333;
}

.report-body /deep/ .report-title {
    font-size: 20px;
    font-weight: 600;
    color: #089BAB;
    margin: 25px 0 15px 0;
    padding-left: 15px;
    border-left: 4px solid #089BAB;
}

.report-body /deep/ .report-subtitle {
    font-size: 16px;
    font-weight: 500;
    color: #16C0C0;
    margin: 20px 0 10px 0;
}

.report-body /deep/ .report-list {
    margin: 15px 0;
    padding-left: 20px;
}

.report-body /deep/ .report-list-item {
    margin: 8px 0;
    line-height: 1.6;
}

.report-body /deep/ strong {
    color: #089BAB;
    font-weight: 600;
}

.report-body /deep/ p {
    margin: 15px 0;
    text-align: justify;
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
    /* 为自定义弹出框提供定位上下文 */
}

.box-a {
    width: 4px;
    height: 24px;
    background: #089BAB;
    border-radius: 10px;
    margin-top: 3px;
}

.box-b {
    font-family: PingFang SC Bold, PingFang SC Bold;
    font-weight: 500;
    font-size: 18px;
    color: #121A2D;
    line-height: 30px;
    margin-left: 10px;
}

.box-aa {
    width: 4px;
    height: 24px;
    background: #089BAB;
    border-radius: 10px;
    margin-top: 8px;
}

.box-cc {
    font-family: PingFang SC Bold, PingFang SC Bold;
    font-weight: 500;
    font-size: 18px;
    color: #121A2D;
    line-height: 40px;
    margin-left: 10px;
}

.box-c {
    width: 100%;
    background: #FFFFFF;
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
    border-color: #089BAB;
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
    border-color: #089BAB;
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
    background-color: #16C0C0;
    color: white;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
}

.query-btn:hover {
    background-color: #089BAB;
}

.import-btn,
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

.add-btn {
    width: 100px;
    height: 40px;
    background-color: #089BAB;
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
    border-color: #089BAB;
}

.button-a:hover i {
    color: #089BAB;
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

.block {
    width: 100%;
    margin-top: 20px;
}

.custom-pagination {
    background: #EFF7F8;
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
    color: #089BAB;
    font-weight: 500;
}

.custom-pagination .btn-prev:hover,
.custom-pagination .btn-next:hover,
.custom-pagination .el-pager li:hover {
    color: #089BAB;
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
    background: #FFFFFF;
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
    border-color: #089BAB;
    color: #089BAB;
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
    background: #FFFFFF;
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
    content: '*';
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
    border-color: #089BAB;
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
    border-color: #089BAB;
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
    color: #089BAB;
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
    border-color: #089BAB;
    background: #089BAB;
}

.status-radio /deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #089BAB;
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
    background-color: #16C0C0;
    color: white;
    border: none;
    padding: 10px 30px;
    border-radius: 8px;
    font-size: 14px;
}

.confirm-btn:hover {
    background-color: #089BAB;
}

/* 在组件的 <style> 中添加 */
.reportBox strong:first-of-type {
    display: none;
}

.reportBox strong:first-child {
    display: none;
}

.html-tooltip {
    max-width: 500px;
}

.styled-table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
    table-layout: fixed;
}

.styled-table th,
.styled-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    word-wrap: break-word;
}

.styled-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.styled-table td {
    background-color: #fff;
}

.table-title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    background-color: #f2f2f2;
    padding: 10px;
    color: #333;
    border: 1px solid #ddd;
    margin-bottom: 0;
}

/* 患者信息表格 - 去除间距 */
.info-table {
    margin-top: 0;
    margin-bottom: 0;
}

.info-cell {
    padding: 6px 8px;
    text-align: left;
    background-color: #fff;
}

/* 服务列表 - 去除上边距 */
.yizhu-list {
    margin-top: 0;
    padding-top: 0;
}

/* 底部表格 - 去除间距 */
.footer-table {
    margin-top: 0;
}

.total-label {
    font-weight: bold;
    text-align: right;
    padding-right: 10px;
}

.doctor-signature {
    text-align: left;
    font-style: italic;
    padding-left: 10px;
    padding-top: 10px;
}

/* 去除dialog内容区域的默认padding */
.yizhu-content {
    padding: 0;
}
</style>

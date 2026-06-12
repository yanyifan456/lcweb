<template>
    <div class="boxbig">
        <div style="width: 500px;height: 30px;display: flex;">
            <div class="box-a"></div>
            <div class="box-b">筛选查询</div>
        </div>
        <div class="box-c">
            <div class="a">
                <div class="box-d">机构名称：</div>
                <div><el-input style="width: 100%;" placeholder="请输入"></el-input></div>
            </div>
            <div class="a">
                <div class="box-d">机构类型：</div>
                <div><el-input placeholder="请输入"></el-input></div>
            </div>
            <div class="a">
                <div class="box-d">状态:</div>
                <div><el-input placeholder="请输入"></el-input></div>
            </div>
            <el-button
                style="display: flex; align-items: center; justify-content: center; width: 3.3%; padding: 0;height: 36%;">重置</el-button>
            <el-button
                style="display: flex; align-items: center; justify-content: center; width: 3.3%; padding: 0;height: 36%;background-color: #16C0C0;color: aliceblue;">查询</el-button>


        </div>
        <div style="width: 100%;;height: 40px;display: flex;margin-top: 30px;justify-content: space-between;">
            <div style="display: flex;">
                <div class="box-aa"></div>
                <div class="box-cc">机构管理</div>
            </div>
            <div style="display: flex;">
                <el-button type="primary" icon="el-icon-plus"
                    style="background-color: #089BAB;color: aliceblue;line-height: 20px;" @click="ff">新建</el-button>
                <el-button class="button-a" style="margin-left: 30px;">
                    <i class="el-icon-refresh-left"></i>
                </el-button>
                <el-button class="button-a" style="margin-left: 30px;">
                    <i class="el-icon-d-caret"></i>
                </el-button>
                <el-button class="button-a" style="margin-left: 30px;">
                    <i class="el-icon-s-tools"></i>
                </el-button>
            </div>
        </div>
        <el-table :data="tableData" style="width: 100%;border-radius: 20px 20px 0px 0px;margin-top: 30px;"
            :header-cell-style="{
                height: '80px',
                background: 'rgba(8, 155, 171, 0.1412)',
                borderRadius: '0px 0px 0px 0px',
                border: 'none'
            }" :cell-style="{ border: 'none' }" :row-style="{ height: '80px' }">

            <el-table-column fixed prop="date" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="name" label="机构名称" width="100">
            </el-table-column>
            <el-table-column prop="province" label="上级机构" width="100">
            </el-table-column>
            <el-table-column prop="city" label="机构负责人" width="100">
            </el-table-column>
            <el-table-column prop="address" label="负责人电话" width="194">
            </el-table-column>
            <el-table-column prop="zip" label="机构地址" width="300">

            </el-table-column>
            <el-table-column prop="zip1" label="第一服务电话" width="150">

            </el-table-column>
            <el-table-column prop="zip2" label="状态" width="100">

            </el-table-column>
            <el-table-column prop="zip3" label="创建人" width="100">

            </el-table-column>
            <el-table-column prop="zip4" label="创建时间" width="220">

            </el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template slot-scope="scope">
                    <el-button type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" @click="Dialogdles = true">删除</el-button>

                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <div style="display: flex;float: right;margin-top: 50px;">
                <div style="font-size: 12px;line-height: 29px;margin-right: 50px;">共计100条</div>
                <template>
                    <el-pagination class="custom-pagination" layout="prev, pager, next" :total="1000" />
                </template>
            </div>
        </div>
        <DialogComponent v-model:visible="dialogVisible" width="800" title="新建" @confirm="handleConfirm"
            @cancel="handleCancel">
            <template #content>
                <div>
                    <!-- 这里放实际表单内容 -->666655
                </div>
            </template>
        </DialogComponent>
        <!-- 使用正确的变量名 Dialogdles（以's'结尾） -->
        <Dialogdle style="    border-radius: 20px;" v-model:visible="Dialogdles" title="删除机构" message="这是一段信息"
            @confirm="handleDialogConfirm" @cancel="handleDialogCancel" />
    </div>
</template>
<script>
import DialogComponent from './conmpoents/DialogComponent.vue'

import Dialogdle from './conmpoents/Dialogdle.vue'

export default {
    name: 'Org',
    components: {
        DialogComponent, Dialogdle
    },

    data() {
        return {
            dialogVisible: false,
            Dialogdles: false,
            formInline: {
                user: '',
                region: ''
            },
            tableData: [{
                date: '1',
                name: '西京医院',
                province: '医疗机构',
                city: '王收益',
                address: '133652112456',
                zip: '西安市新城区长了西路127 号',
                zip1: '133652182456',
                zip2: '正常',
                zip3: 'admin',
                zip4: '2025-07-01 12：00：21',

            }, {
                date: '1',
                name: '西京医院',
                province: '医疗机构',
                city: '王收益',
                address: '133652112456',
                zip: '西安市新城区长了西路127 号',
                zip1: '133652182456',
                zip2: '正常',
                zip3: 'admin',
                zip4: '2025-07-01 12：00：21',

            }, {
                date: '1',
                name: '西京医院',
                province: '医疗机构',
                city: '王收益',
                address: '133652112456',
                zip: '西安市新城区长了西路127 号',
                zip1: '133652182456',
                zip2: '正常',
                zip3: 'admin',
                zip4: '2025-07-01 12：00：21',

            }, {
                date: '1',
                name: '西京医院',
                province: '医疗机构',
                city: '王收益',
                address: '133652112456',
                zip: '西安市新城区长了西路127 号',
                zip1: '133652182456',
                zip2: '正常',
                zip3: 'admin',
                zip4: '2025-07-01 12：00：21',

            }],
            year: 2023,
            month: 7,
            day: 1,
        }
    },
    methods: {
        handleConfirm() {

            this.dialogVisible = false
        },
        handleCancel() {

            this.dialogVisible = false
        },
        handleDialogConfirm() {

            this.Dialogdles = false // 使用正确变量名
        },
        handleDialogCancel() {

            this.Dialogdles = false // 使用正确变量名
        },
        ff() {
            this.dialogVisible = true

        },

        getMondayOfWeek(year, month, day) {
            // 注意：JavaScript 的月份是 0-11（0=一月，11=十二月）
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay(); // 0=周日, 1=周一, ..., 6=周六

            // 计算与周一的差值（如果是周一，差值为0）
            const daysToMonday = (dayOfWeek + 6) % 7;

            // 计算周一的日期
            const monday = new Date(date);
            monday.setDate(date.getDate() - daysToMonday);

            return monday;
        },

    }
}
</script>
<style scoped>
.el-pagination {
    background: #EFF7F8 !important;
    border: none !important;
}

.el-pagination .btn-prev,
.el-pagination .btn-next,
.el-pagination .number {
    background: transparent !important;
    border: none !important;
}

.block {
    width: 100%;

}

.button-a {

    border: 0;
    height: 40px;
    width: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 30px;
    padding: 0 !important;
}

.button-a i {
    width: 100%;
    /* 图标宽度占满按钮 */
    height: 100%;
    /* 图标高度占满按钮 */
    display: flex;
    /* 使用 flex 布局 */
    align-items: center;
    /* 垂直居中 */
    justify-content: center;
    /* 水平居中 */
    font-size: 20px;
    /* 调整图标大小（可选） */
}

.a {
    width: 28%;
    display: flex;
    align-items: center;
    margin-left: 20px;
    /* justify-content: space-between; */
}

.box-aa {
    width: 4px;
    height: 24px;
    background: #089BAB;
    border-radius: 10px 10px 10px 10px;
    margin-top: 9px
}

.box-a {
    width: 4px;
    height: 24px;
    background: #089BAB;
    border-radius: 10px 10px 10px 10px;
}

.box-b {
    width: 72px;
    height: 18px;
    font-family: PingFang SC Bold, PingFang SC Bold;
    font-weight: 400;
    font-size: 18px;
    color: #121A2D;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-left: 10px;
}

.box-cc {
    width: 72px;
    height: 18px;
    font-family: PingFang SC Bold, PingFang SC Bold;
    font-weight: 400;
    font-size: 18px;
    color: #121A2D;
    line-height: 40px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-left: 10px;
}

.box-c {
    width: 100%;
    height: 110px;
    background: #FFFFFF;
    border-radius: 20px 20px 20px 20px;
    margin-top: 20px;
    display: flex;
    align-items: center;
}

.box-d {
    width: 20%;
    height: 14px;
    font-family: PingFang SC Bold, PingFang SC Bold;
    font-weight: 400;
    font-size: 14px;
    color: #121A2D;
    line-height: 14px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-right: 20px;
}

.box-e {
    width: 60%;
    height: 40px;
    border-radius: 10px 10px 10px 10px;
    border: 1px solid rgba(8, 155, 171, 0.4);
    width: 18%;
}
</style>
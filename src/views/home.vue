<template>
    <div class="dashboard-container">
        <div class="section">
            <h2 class="section-title">功能管理</h2>
            <div class="feature-grid">
                <div class="feature-card" @click="golll">
                    <div class="icon-wrapper bg-green">
                        <img class="icon" src="../assets/img/15.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">驾驶舱</h3>
                        <p class="card-subtitle">总览全局 数据统计</p>
                    </div>
                </div>
                <div class="feature-card" @click="goj" v-if="hasPermission('/appUserManagement')">
                    <div class="icon-wrapper bg-orange-light">
                        <img class="icon" src="../assets/img/6.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">用户管理</h3>
                        <p class="card-subtitle">堂控与提 提表为辅</p>
                    </div>
                </div>
                <div class="feature-card" @click="gol" v-if="hasPermission('/nurse')">
                    <div class="icon-wrapper bg-blue">
                        <img class="icon" src="../assets/img/10.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">护士健康报告</h3>
                        <p class="card-subtitle">知行合一 安康相伴</p>
                    </div>
                </div>
                <div class="feature-card" @click="gom" v-if="hasPermission('/doctorcheck')">
                    <div class="icon-wrapper bg-orange">
                        <img class="icon" src="../assets/img/11.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">医生资质审批</h3>
                        <p class="card-subtitle">审批批准 合规确签</p>
                    </div>
                </div>
                <div class="feature-card" @click="gok" v-if="hasPermission('/doctor')">
                    <div class="icon-wrapper bg-blue">
                        <img class="icon" src="../assets/img/9.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">医生健康报告</h3>
                        <p class="card-subtitle">指标平衡 总小部署</p>
                    </div>
                </div>
                <div class="feature-card" @click="goi" v-if="hasPermission('/institutional')">
                    <div class="icon-wrapper bg-green">
                        <img class="icon" src="../assets/img/7.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">机构健康报告</h3>
                        <p class="card-subtitle">健康评估 数据把握</p>
                    </div>
                </div>
                <div class="feature-card" @click="goa" v-if="hasPermission('/Inboundandoutboundrecords')">
                    <div class="icon-wrapper bg-orange">
                        <img class="icon" src="../assets/img/2.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">设备库存</h3>
                        <p class="card-subtitle">动态追踪 智仓管理</p>
                    </div>
                </div>
                <div class="feature-card" @click="gob" v-if="hasPermission('/Storageentry')">
                    <div class="icon-wrapper bg-teal">
                        <img class="icon" src="../assets/img/3.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">设备入库</h3>
                        <p class="card-subtitle">严谨入库 高效管理</p>
                    </div>
                </div>
                <div class="feature-card" @click="goc" v-if="hasPermission('/Xtorageentry')">
                    <div class="icon-wrapper bg-coral">
                        <img class="icon" src="../assets/img/4.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">设备出库</h3>
                        <p class="card-subtitle">精准匹配 安全出库</p>
                    </div>
                </div>
                <div class="feature-card" @click="god" v-if="hasPermission('/EntryandExit')">
                    <div class="icon-wrapper bg-blue">
                        <img class="icon" src="../assets/img/5.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">设备出入库记录</h3>
                        <p class="card-subtitle">入库登记 出库档案</p>
                    </div>
                </div>
                <div class="feature-card" @click="gog" v-if="hasPermission('/medicalExamimport')">
                    <div class="icon-wrapper bg-coral">
                        <img class="icon" src="../assets/img/8.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">检测信息导入</h3>
                        <p class="card-subtitle">精准检验 安全归档</p>
                    </div>
                </div>
                <div class="feature-card" @click="gon" v-if="hasPermission('/devicebind')">
                    <div class="icon-wrapper bg-teal">
                        <img class="icon" src="../assets/img/12.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">设备绑定解绑</h3>
                        <p class="card-subtitle">一键绑定 安全解绑</p>
                    </div>
                </div>
                <div class="feature-card" @click="goo" v-if="hasPermission('/valueaddedservices')">
                    <div class="icon-wrapper bg-orange-light">
                        <img class="icon" src="../assets/img/13.png" alt="">
                    </div>
                    <div class="card-content">
                        <h3 class="card-title">增值服务</h3>
                        <p class="card-subtitle">现值延伸 增税模验</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="section">
            <h2 class="section-title">数据统计</h2>
            <div class="stats-grid">
                <div class="stats-card">
                    <div class="stats-content">
                        <div class="stats-label">设备总量</div>
                        <div class="stats-value">{{ device.allDevice || 0 }}</div>
                    </div>
                </div>
                <div class="stats-card">
                    <div ref="onlineChart" class="mini-chart"></div>
                    <div class="stats-content">
                        <div class="stats-label">在线设备</div>
                        <div class="stats-value">{{ device.inLine || 0 }}</div>
                    </div>
                </div>
                <div class="stats-card">
                    <div ref="offlineChart" class="mini-chart"></div>
                    <div class="stats-content">
                        <div class="stats-label">离线设备</div>
                        <div class="stats-value">{{ device.outLine || 0 }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section">
            <h2 class="section-title">既往病史</h2>
            <div class="chart-container">
                <div ref="bingshiChart" style="width: 100%; height: 400px;"></div>
            </div>
        </div>
    </div>
</template>
<script>
import { getdeviceun, getddd } from '@/api/login'
import * as echarts from 'echarts'
export default {
    name: 'Dashboard',
    data() {
        return {
            loading: true,
            pipei: sessionStorage.getItem('permissions'),
            permissionList: [], // 添加权限数组
            device: {},
            bingshi: {},
            onlineChartInstance: null,
            offlineChartInstance: null,
            bingshiChartInstance: null,

        }
    },
    methods: {
        hasPermission(route) {
            return Array.isArray(this.permissionList) && this.permissionList.includes(route)
        }
        ,
        initDeviceCharts() {
            this.initOnlineChart()
            this.initOfflineChart()
        },
        initOnlineChart() {
            if (!this.$refs.onlineChart) return

            if (this.onlineChartInstance) {
                this.onlineChartInstance.dispose()
            }
            this.onlineChartInstance = echarts.init(this.$refs.onlineChart)
            const total = this.device.allDevice || 1
            const online = this.device.inLine || 0
            const percentage = ((online / total) * 100).toFixed(0)
            const option = {
                series: [
                    {
                        type: 'pie',
                        radius: ['70%', '90%'],
                        center: ['50%', '50%'],
                        startAngle: 90,
                        silent: true,
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {
                                value: online,
                                itemStyle: {
                                    color: '#17a2b8'
                                }
                            },
                            {
                                value: total - online,
                                itemStyle: {
                                    color: '#e8e8e8'
                                }
                            }
                        ]
                    }
                ]
            }
            this.onlineChartInstance.setOption(option)
        },
        initOfflineChart() {
            if (!this.$refs.offlineChart) return

            if (this.offlineChartInstance) {
                this.offlineChartInstance.dispose()
            }
            this.offlineChartInstance = echarts.init(this.$refs.offlineChart)
            const total = this.device.allDevice || 1
            const offline = this.device.outLine || 0
            const percentage = ((offline / total) * 100).toFixed(0)
            const option = {
                series: [
                    {
                        type: 'pie',
                        radius: ['70%', '90%'],
                        center: ['50%', '50%'],
                        startAngle: 90,
                        silent: true,
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {
                                value: offline,
                                itemStyle: {
                                    color: '#ff9f43'
                                }
                            },
                            {
                                value: total - offline,
                                itemStyle: {
                                    color: '#e8e8e8'
                                }
                            }
                        ]
                    }
                ]
            }
            this.offlineChartInstance.setOption(option)
        },
        initBingshiChart() {

            if (!this.$refs.bingshiChart) {

                return
            }
            if (this.bingshiChartInstance) {
                this.bingshiChartInstance.dispose()
            }
            this.bingshiChartInstance = echarts.init(this.$refs.bingshiChart)
            const xList = this.bingshi.data?.xList || []
            const yList = this.bingshi.data?.yList || []

            const option = {
                title: {
                    text: '既往病史统计',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 600
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: '{b}<br/>人数: {c}人'
                },
                grid: {
                    left: '8%',
                    right: '6%',
                    bottom: '3%',
                    top: '80',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: xList,
                    axisLabel: {
                        interval: 0,
                        rotate: 0,
                        fontSize: 16
                    },
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '人数',
                    minInterval: 1,
                    axisLabel: {
                        formatter: '{value}人'
                    }
                },
                series: [
                    {
                        name: '患病人数',
                        type: 'bar',
                        barWidth: '50%',
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#17a2b8' },
                                { offset: 1, color: '#0d8a9e' }
                            ]),
                            borderRadius: [4, 4, 0, 0]
                        },
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}人'
                        },
                        data: yList
                    }
                ]
            }
            this.bingshiChartInstance.setOption(option)

        },
        getddds() {
            getddd({
                orgId: sessionStorage.getItem('orgId'),
            }).then(res => {
                this.bingshi = res

                this.$nextTick(() => {
                    this.initBingshiChart()
                })
            }).catch(err => {

            })
        },
        getdeviceuns() {
            getdeviceun({
                orgId: sessionStorage.getItem('orgId'),
            }).then(res => {
                this.device = res.data

                this.$nextTick(() => {
                    this.initDeviceCharts()
                })
            }).catch(err => {

            })
        },
        goa() {
            this.$router.push('/Inboundandoutboundrecords');
        },
        gob() {
            this.$router.push('/Storageentry');
        },
        goc() {
            this.$router.push('/Xtorageentry');
        },
        god() {
            this.$router.push('/EntryandExit');
        },
        goj() {
            this.$router.push('/appUserManagement');
        },
        goi() {
            this.$router.push('/institutional');
        },
        gog() {
            this.$router.push('/medicalExamimport');
        },
        gok() {
            this.$router.push('/doctor');
        },
        gol() {
            this.$router.push('/nurse');
        },
        gom() {
            this.$router.push('/doctorcheck');
        },
        gon() {
            this.$router.push('/devicebind');
        },
        goo() {
            this.$router.push('/valueaddedservices');
        },
        golll() {
            console.log(sessionStorage.getItem('roleName'));
            if (sessionStorage.getItem('roleName') == 'superAdmin') {
                this.$router.push('/datadashboard');
            } else {
                const orgId = sessionStorage.getItem('orgId');
                const orgName = sessionStorage.getItem('orgName');

                // 组装 query 参数
                const query = new URLSearchParams({
                    orgId: orgId,
                    orgName: orgName
                }).toString();

                // 打开新页面
                const baseUrl = import.meta.env.VITE_APP_BASE_URL

                console.log(baseUrl);

                window.open(`${baseUrl}/greendist/#/home?${query}`);

                // window.open(`http://192.168.100.19:333/greendist/#/home?${query}`);
            }
        }
    },
    mounted() {
        if (!this.$route.query.reloaded) {
            // 添加刷新标记并重载页面
            this.$router.replace({
                path: this.$route.path,
                query: { ...this.$route.query, reloaded: '1' }
            });
            window.location.reload();
        } else {
            // 移除刷新标记（避免历史记录堆积）
            const query = { ...this.$route.query };
            delete query.reloaded;
            this.$router.replace({
                path: this.$route.path,
                query
            });

            // 关闭加载状态
            setTimeout(() => {
                this.loading = false;
            }, 300);
        }
        try {
            const permissionsStr = sessionStorage.getItem('permissions')
            this.permissionList = permissionsStr ? JSON.parse(permissionsStr) : []

        } catch (error) {

            this.permissionList = []
        }
        this.getdeviceuns()
        this.getddds()
    },
    beforeDestroy() {
        this.loading = false;
        if (this.onlineChartInstance) {
            this.onlineChartInstance.dispose()
        }
        if (this.offlineChartInstance) {
            this.offlineChartInstance.dispose()
        }
        if (this.bingshiChartInstance) {
            this.bingshiChartInstance.dispose()
        }
    }
}
</script>
<style scoped>
.dashboard-container {
    background-color: #f5f7fa;
    height: 100%;
    overflow: auto;
    position: relative;
    height: calc(100vh - 200px);
}

.section {
    margin-bottom: 32px;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
}

.feature-card {
    height: 80px;
    background: white;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    cursor: pointer;
}

.feature-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.icon-wrapper {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.icon {
    width: 48px;
    height: 48px;
}

.bg-orange {
    background: linear-gradient(135deg, #ffb366 0%, #ff9933 100%);
}

.bg-teal {
    background: linear-gradient(135deg, #4dd4d4 0%, #17a2b8 100%);
}

.bg-coral {
    background: linear-gradient(135deg, #ff8f7a 0%, #ff6b52 100%);
}

.bg-blue {
    background: linear-gradient(135deg, #66a3ff 0%, #4d8fff 100%);
}

.bg-green {
    background: linear-gradient(135deg, #66d9a8 0%, #4dbe8f 100%);
}

.bg-purple {
    background: linear-gradient(135deg, #9d8fff 0%, #7d6fff 100%);
}

.bg-orange-light {
    background: linear-gradient(135deg, #ffb380 0%, #ff9f5c 100%);
}

.card-content {
    flex: 1;
    min-width: 0;
}

.card-title {
    font-size: 15px;
    font-weight: 600;
    color: #333;
    margin: 0 0 4px 0;
}

.card-subtitle {
    font-size: 12px;
    color: #999;
    margin: 0;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}

.stats-card {
    background: white;
    border-radius: 8px;
    padding: 30px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 20px;
    min-height: 100px;
}

.mini-chart {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
}

.stats-content {
    flex: 1;
}

.stats-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
}

.stats-value {
    font-size: 32px;
    font-weight: 600;
    color: #333;
}

.chart-container {
    background: white;
    border-radius: 8px;
    padding: 32px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
}

@media (max-width: 1400px) {
    .feature-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .stats-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 1024px) {
    .feature-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 640px) {
    .feature-grid {
        grid-template-columns: 1fr;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
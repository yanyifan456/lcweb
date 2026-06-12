<template>
  <div class="oo-container">
    <!-- 紧急预警横幅 -->
    <div class="oo-alert">
      <span class="oo-alert-icon">🔔</span>
      <span class="oo-alert-strong">緊急預警：</span>
      <span class="oo-alert-text">用户 #8821 心率異常 168 bpm，已觸發緊急通知。</span>
      <a class="oo-alert-link" href="javascript:;">查看詳情 →</a>
    </div>

    <!-- 顶部 KPI 卡片 -->
    <div class="oo-stats">
      <div class="oo-stat-card">
        <div class="oo-stat-icon ic-blue">
          <i class="el-icon-user-solid"></i>
        </div>
        <div class="oo-stat-label">今日活躍用户 (DAU)</div>
        <div class="oo-stat-value">12,847</div>
        <div class="oo-stat-foot">較昨日 <span class="up">↗ +2万</span></div>
      </div>
      <div class="oo-stat-card">
        <div class="oo-stat-icon ic-yellow">
          <i class="el-icon-coin"></i>
        </div>
        <div class="oo-stat-label">本月收入 (HKD)</div>
        <div class="oo-stat-value">12,847</div>
        <div class="oo-stat-foot">較上月 <span class="up">↗ +2万</span></div>
      </div>
      <div class="oo-stat-card">
        <div class="oo-stat-icon ic-cyan">
          <i class="el-icon-cloudy"></i>
        </div>
        <div class="oo-stat-label">設備連接數</div>
        <div class="oo-stat-value">12,847</div>
        <div class="oo-stat-foot">較上週 <span class="up">↗ +20</span></div>
      </div>
      <div class="oo-stat-card">
        <div class="oo-stat-icon ic-red">
          <i class="el-icon-warning"></i>
        </div>
        <div class="oo-stat-label">待處理預警</div>
        <div class="oo-stat-value">12,847</div>
        <div class="oo-stat-foot">較上週 <span class="up">↗ +20</span></div>
      </div>
    </div>

    <!-- 中部图表行 -->
    <div class="oo-row oo-row-mid">
      <!-- 用户增长趋势 -->
      <div class="oo-card oo-card-grow">
        <div class="oo-card-head">
          <div>
            <div class="oo-card-title">用户增長趨勢（近30天）</div>
            <div class="oo-card-sub">DAU / MAU 每日數據</div>
          </div>
          <div class="oo-head-right">
            <span class="oo-legend"><i class="dot dot-orange"></i>DAU</span>
            <span class="oo-legend"><i class="dot dot-cyan"></i>MAU</span>
            <span class="oo-select">近90天 <i class="el-icon-arrow-down"></i></span>
          </div>
        </div>
        <div ref="growthChart" class="oo-chart oo-chart-line"></div>
      </div>

      <!-- 收入构成 -->
      <div class="oo-card oo-card-income">
        <div class="oo-card-head">
          <div>
            <div class="oo-card-title">收入構成（本月）</div>
            <div class="oo-card-sub">各業務佔比分析</div>
          </div>
          <span class="oo-export">導出 <i class="el-icon-upload2"></i></span>
        </div>
        <div class="oo-income-body">
          <div ref="incomeChart" class="oo-chart oo-chart-donut"></div>
          <div class="oo-income-legend">
            <div class="oo-income-item">
              <span><i class="dot dot-cyan"></i>訂閱收入</span><b class="t-cyan">30%</b>
            </div>
            <div class="oo-income-item">
              <span><i class="dot dot-green"></i>商城銷售</span><b class="t-green">10%</b>
            </div>
            <div class="oo-income-item">
              <span><i class="dot dot-blue"></i>問診服務</span><b class="t-blue">20%</b>
            </div>
            <div class="oo-income-item">
              <span><i class="dot dot-orange"></i>硬件銷售</span><b class="t-orange">20%</b>
            </div>
          </div>
        </div>
      </div>

      <!-- 设备连接分布 -->
      <div class="oo-card oo-card-device">
        <div class="oo-card-head">
          <div class="oo-card-title">設備連接分佈</div>
        </div>
        <div class="oo-device-list">
          <div class="oo-device-item" v-for="(d, i) in devices" :key="i">
            <div class="oo-device-top">
              <span class="oo-device-name">{{ d.name }}</span>
              <span class="oo-device-pct">{{ d.value }}%</span>
            </div>
            <div class="oo-device-bar">
              <div class="oo-device-fill" :style="{ width: d.value + '%', background: d.color }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部行 -->
    <div class="oo-row oo-row-bottom">
      <!-- 付费转化漏斗 -->
      <div class="oo-card oo-card-funnel">
        <div class="oo-card-head">
          <div>
            <div class="oo-card-title">付費轉化漏斗（本月）</div>
            <div class="oo-card-sub">免費試用 → 付費訂閱 轉化分析</div>
          </div>
        </div>
        <div class="oo-funnel">
          <div class="oo-funnel-col" v-for="(f, i) in funnel" :key="i">
            <div class="oo-funnel-caption">{{ f.label }}</div>
            <div class="oo-funnel-bar" :style="{ height: f.height + 'px', background: f.color }">
              <span class="oo-funnel-val">{{ f.value }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 最新健康预警 -->
      <div class="oo-card oo-card-warn">
        <div class="oo-card-head">
          <div class="oo-card-title">最新健康預警</div>
          <span class="oo-btn-outline">查看全部</span>
        </div>
        <div class="oo-warn-list">
          <div class="oo-warn-item lv-danger">
            <div class="oo-warn-title">緊急 — 用户 #8821</div>
            <div class="oo-warn-desc">心率異常 168 bpm · 2分鐘前</div>
          </div>
          <div class="oo-warn-item lv-warning">
            <div class="oo-warn-title">警告 — 用户 #5532</div>
            <div class="oo-warn-desc">血氧偏低 SpO₂ 91% · 15分鐘前</div>
          </div>
          <div class="oo-warn-item lv-info">
            <div class="oo-warn-title">關注 — 用户 #2219</div>
            <div class="oo-warn-desc">睡眠質量連續3天偏低 · 1小時前</div>
          </div>
        </div>
      </div>

      <!-- 今日业务快报 -->
      <div class="oo-card oo-card-report">
        <div class="oo-card-head">
          <div class="oo-card-title">今日業務快報</div>
        </div>
        <div class="oo-report-list">
          <div class="oo-report-item">
            <span>新增用户</span><b class="t-green">+287</b>
          </div>
          <div class="oo-report-item">
            <span>付費轉化</span><b class="t-cyan">287人</b>
          </div>
          <div class="oo-report-item">
            <span>完成問診</span><b class="t-cyan">287次</b>
          </div>
          <div class="oo-report-item">
            <span>手板掃描</span><b class="t-cyan">287次</b>
          </div>
          <div class="oo-report-item">
            <span>商城訂單</span><b class="t-cyan">287单</b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'OperationOverview',
  data() {
    return {
      growthChartInstance: null,
      incomeChartInstance: null,
      devices: [
        { name: 'Smart Ring Pro', value: 30, color: '#3b82f6' },
        { name: '智能無屏手環', value: 30, color: '#22c55e' },
        { name: 'AI智能臂帶', value: 30, color: '#06b6d4' },
        { name: '健康檢測手板', value: 30, color: '#f97316' },
        { name: '胸口貼', value: 30, color: '#0ea5e9' },
      ],
      funnel: [
        { label: 'APP下载', value: 48900, height: 150, color: '#0e7490' },
        { label: '完成注册', value: 32100, height: 130, color: '#3b82f6' },
        { label: '完成注册', value: 16789, height: 110, color: '#60a5fa' },
        { label: '付費訂閱', value: 16789, height: 90, color: '#22c55e' },
        { label: '年費升級', value: 16789, height: 75, color: '#f59e0b' },
      ],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initGrowthChart()
      this.initIncomeChart()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.growthChartInstance) this.growthChartInstance.dispose()
    if (this.incomeChartInstance) this.incomeChartInstance.dispose()
  },
  methods: {
    handleResize() {
      if (this.growthChartInstance) this.growthChartInstance.resize()
      if (this.incomeChartInstance) this.incomeChartInstance.resize()
    },
    initGrowthChart() {
      if (!this.$refs.growthChart) return
      this.growthChartInstance = echarts.init(this.$refs.growthChart)
      const months = ['1月1日', '2月1日', '3月1日', '4月1日', '5月1日', '6月1日', '7月1日', '8月1日', '9月1日', '10月1日', '11月1日', '12月1日']
      const dau = [300, 600, 480, 520, 460, 500, 540, 520, 560, 540, 580, 600]
      const mau = [200, 400, 360, 380, 350, 380, 400, 390, 410, 400, 420, 440]
      this.growthChartInstance.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            let s = params[0].axisValue + '<br/>'
            params.forEach(p => {
              s += p.marker + p.seriesName + '  ' + p.data + '<br/>'
            })
            return s
          }
        },
        grid: { left: 40, right: 20, top: 20, bottom: 30 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: months,
          axisLine: { lineStyle: { color: '#e5e7eb' } },
          axisLabel: { color: '#9ca3af', fontSize: 11 },
          axisTick: { show: false },
        },
        yAxis: {
          type: 'value',
          max: 800,
          splitNumber: 4,
          axisLabel: { color: '#9ca3af', fontSize: 11 },
          splitLine: { lineStyle: { color: '#f1f5f9' } },
        },
        series: [
          {
            name: 'DAU',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: dau,
            lineStyle: { color: '#f59e0b', width: 2 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(245,158,11,0.25)' },
                { offset: 1, color: 'rgba(245,158,11,0.02)' },
              ])
            },
          },
          {
            name: 'MAU',
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: mau,
            lineStyle: { color: '#06b6d4', width: 2 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(6,182,212,0.2)' },
                { offset: 1, color: 'rgba(6,182,212,0.02)' },
              ])
            },
          },
        ],
      })
    },
    initIncomeChart() {
      if (!this.$refs.incomeChart) return
      this.incomeChartInstance = echarts.init(this.$refs.incomeChart)
      this.incomeChartInstance.setOption({
        series: [
          {
            type: 'pie',
            radius: ['62%', '85%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            label: { show: false },
            labelLine: { show: false },
            data: [
              { value: 30, itemStyle: { color: '#06b6d4' } },
              { value: 20, itemStyle: { color: '#f59e0b' } },
              { value: 20, itemStyle: { color: '#3b82f6' } },
              { value: 10, itemStyle: { color: '#22c55e' } },
            ],
          },
        ],
        graphic: {
          type: 'text',
          left: 'center',
          top: 'center',
          style: { text: '100%', fontSize: 26, fontWeight: 700, fill: '#1f2937' },
        },
      })
    },
  },
}
</script>

<style scoped>
.oo-container {
  height: calc(100vh - 160px);
  overflow: auto;
  background-color: #f5f7fa;
  padding: 4px;
}

/* 预警横幅 */
.oo-alert {
  background: #fdecec;
  border-radius: 10px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 16px;
}
.oo-alert-icon { margin-right: 8px; }
.oo-alert-strong { color: #ef4444; font-weight: 700; }
.oo-alert-text { color: #b91c1c; }
.oo-alert-link { color: #2563eb; margin-left: 6px; text-decoration: none; }

/* KPI 卡片 */
.oo-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}
.oo-stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: relative;
}
.oo-stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  margin-bottom: 14px;
}
.ic-blue { background: #3b82f6; }
.ic-yellow { background: #f59e0b; }
.ic-cyan { background: #06b6d4; }
.ic-red { background: #ef4444; }
.oo-stat-label { font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.oo-stat-value { font-size: 30px; font-weight: 700; color: #111827; margin-bottom: 10px; }
.oo-stat-foot { font-size: 12px; color: #9ca3af; }
.oo-stat-foot .up { color: #ef4444; margin-left: 4px; }

/* 行布局 */
.oo-row {
  display: grid;
  gap: 16px;
  margin-bottom: 16px;
}
.oo-row-mid { grid-template-columns: 2fr 1.2fr 1fr; }
.oo-row-bottom { grid-template-columns: 2fr 1.2fr 1fr; }

.oo-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.oo-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}
.oo-card-title { font-size: 15px; font-weight: 700; color: #111827; }
.oo-card-sub { font-size: 12px; color: #9ca3af; margin-top: 4px; }
.oo-head-right { display: flex; align-items: center; gap: 14px; }
.oo-legend { font-size: 12px; color: #6b7280; display: flex; align-items: center; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
.dot-orange { background: #f59e0b; }
.dot-cyan { background: #06b6d4; }
.dot-green { background: #22c55e; }
.dot-blue { background: #3b82f6; }
.oo-select {
  font-size: 12px;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 8px;
}
.oo-export, .oo-btn-outline {
  font-size: 12px;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 10px;
  cursor: pointer;
}

/* 图表 */
.oo-chart-line { width: 100%; height: 230px; }
.oo-income-body { display: flex; align-items: center; gap: 10px; }
.oo-chart-donut { width: 150px; height: 170px; flex-shrink: 0; }
.oo-income-legend { flex: 1; }
.oo-income-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #4b5563;
  padding: 8px 0;
}
.oo-income-item span { display: flex; align-items: center; }
.t-cyan { color: #06b6d4; }
.t-green { color: #22c55e; }
.t-blue { color: #3b82f6; }
.t-orange { color: #f59e0b; }

/* 设备连接分布 */
.oo-device-item { margin-bottom: 16px; }
.oo-device-top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 6px;
}
.oo-device-pct { color: #9ca3af; }
.oo-device-bar { width: 100%; height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.oo-device-fill { height: 100%; border-radius: 3px; }

/* 漏斗 */
.oo-funnel {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 230px;
  padding-top: 20px;
}
.oo-funnel-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.oo-funnel-caption { font-size: 12px; color: #6b7280; margin-bottom: 10px; }
.oo-funnel-bar {
  width: 72%;
  border-radius: 6px 6px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.oo-funnel-val { color: #fff; font-size: 14px; font-weight: 600; }

/* 健康预警列表 */
.oo-warn-item {
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 12px;
}
.lv-danger { background: #fdecec; }
.lv-warning { background: #fef6e7; }
.lv-info { background: #eef4fd; }
.oo-warn-title { font-size: 13px; font-weight: 700; margin-bottom: 4px; }
.lv-danger .oo-warn-title { color: #ef4444; }
.lv-warning .oo-warn-title { color: #f59e0b; }
.lv-info .oo-warn-title { color: #3b82f6; }
.oo-warn-desc { font-size: 12px; color: #6b7280; }

/* 业务快报 */
.oo-report-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #4b5563;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
}
.oo-report-item:last-child { border-bottom: none; }
.oo-report-item b { font-size: 14px; }
</style>

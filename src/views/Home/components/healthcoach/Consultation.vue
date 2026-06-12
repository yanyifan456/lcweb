<template>
  <div class="page-placeholder">
    <div class="ph-card">
      <i class="el-icon-first-aid-kit ph-icon"></i>
      <h2 class="ph-title">問診管理</h2>
      <p class="ph-desc">该模块正在建设中，敬请期待。</p>
    </div>
  </div>
</template>

<script>
export default { name: 'HcConsultation' }
</script>

<style scoped>
.page-placeholder { height: calc(100vh - 160px); display: flex; align-items: center; justify-content: center; background-color: #f5f7fa; }
.ph-card { background: #fff; border-radius: 12px; padding: 60px 80px; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.ph-icon { font-size: 56px; color: #06b6d4; margin-bottom: 16px; }
.ph-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 8px 0; }
.ph-desc { font-size: 14px; color: #9ca3af; margin: 0; }
</style>

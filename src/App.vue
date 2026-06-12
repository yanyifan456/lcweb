<template>

  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  created() {
    // 页面加载时恢复历史记录
    try {
      const stored = sessionStorage.getItem("breadcrumbHistory");
      if (stored) {
        const history = JSON.parse(stored);
        sessionStorage.setItem("breadcrumbHistory", JSON.stringify(history));
      }
    } catch (e) {
      console.error("恢复历史记录失败:", e);
    }
  }
}
</script>
<style>
* {
  padding: 0;
  margin: 0;
  list-style: none;
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;

}
</style>
    <template>
        <div class="history-breadcrumb">
            <el-breadcrumb separator="">

                <el-breadcrumb-item style="margin-right: 10px;" class="history-item"
                    :class="{ 'active-item': $route.name === 'home' }">
                    <div class="breadcrumb-wrapper">
                        <span @click="gohome" class="breadcrumb-text">首页</span>
                    </div>
                </el-breadcrumb-item>
                <el-breadcrumb-item v-for="(item, index) in dynamicBreadcrumbs" :key="item.fullPath"
                    style="margin-right: 10px;" class="history-item" :class="{ 'active-item': item.isActive }">
                    <div class="breadcrumb-wrapper" @click.stop="goToPath(item.fullPath)">
                        <span class="breadcrumb-text">{{ item.title }}</span>
                        <div class="delete-wrapper" @click.stop="deleteHistory(item)">
                            <i class="el-icon-close delete-icon"></i>
                        </div>
                    </div>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </template>
<script>
export default {
    data() {
        return {
            localBreadcrumbs: []
        }
    },
    computed: {
        dynamicBreadcrumbs() {
            return this.localBreadcrumbs
                .filter(item => !item.isHome)
                .map(item => ({
                    ...item,
                    isActive: item.name === this.$route.name
                }))
                .reverse(); // 新增 reverse() 反转数组顺序
        }
    },
    watch: {
        '$route'(to) {
            this.loadFromStorage();
        }
    },
    created() {
        this.loadFromStorage();
    },
    methods: {
        isSameRoute(path1, path2) {
            const getPathWithoutQuery = (path) => path.split('?')[0];
            return getPathWithoutQuery(path1) === getPathWithoutQuery(path2);
        },
        loadFromStorage() {
            try {
                const stored = sessionStorage.getItem('breadcrumbHistory');
                this.localBreadcrumbs = stored ? JSON.parse(stored) : [];
            } catch (e) {
                console.error('加载历史记录失败:', e);
                this.localBreadcrumbs = [];
            }
        },
        gohome() {
            this.$router.push('/home')
        },
        goToPath(path) {
            if (this.$route.fullPath !== path) {
                this.$router.push(path);
            }
        },
        deleteHistory(item) {
            try {
                // 获取原始历史记录
                let history = JSON.parse(sessionStorage.getItem('breadcrumbHistory') || '[]');

                // 找到当前页面在数组中的索引
                const currentIndex = history.findIndex(h => h.name === item.name);

                // 删除当前页面
                const newHistory = history.filter(h => h.name !== item.name);
                sessionStorage.setItem('breadcrumbHistory', JSON.stringify(newHistory));
                this.localBreadcrumbs = newHistory;

                // 如果删除的是当前页面
                if (currentIndex !== -1 && this.$route.name === item.name) {
                    let target = null;

                    if (currentIndex < history.length - 1) {
                        // 下一条记录
                        target = history[currentIndex + 1];
                    } else if (newHistory.length > 0) {
                        // 没有下一条，跳转剩余最后一条
                        target = newHistory[newHistory.length - 1];
                    }

                    if (target) {
                        this.$router.push(target.fullPath);
                    } else {
                        // 没有历史记录，跳转首页
                        this.$router.push('/home');
                    }
                }
            } catch (error) {
                console.error('删除失败:', error);
                this.$message.error('删除失败，请稍后重试');
            }
        }




    }
}
</script>
<style scoped>
/* 修复后的样式 */
.delete-icon {
    color: #888C96 !important;
    /* 修正颜色值 */
    font-size: 14px;
    transition: all 0.2s;
    /* 添加过渡效果 */
}

/* 非激活状态悬停效果 */
.delete-wrapper:not(.disabled):hover .delete-icon {
    color: #F56C6C !important;
    /* 红色 */
    transform: scale(1.2);
}

/* 激活状态下的删除按钮 */
.active-item .delete-icon {
    color: rgba(255, 255, 255, 0.5) !important;
    /* 半透明白色 */

}

/* 禁用状态 */


.delete-wrapper.disabled {
    cursor: not-allowed;
    opacity: 0.6;
}



/* 原有其他样式保持不变 */
.home-item .breadcrumb-wrapper {
    background: #089BAB !important;
    border-color: #089BAB !important;
}

.home-item .breadcrumb-text {
    color: #fff !important;
    font-weight: 500;
}

.home-item .delete-wrapper {
    display: none !important;
}

.breadcrumb-wrapper {
    display: flex;
    align-items: center;
    height: 38px;
    padding: 0 12px;
    background: #FBFBFB;
    border: 1px solid rgba(136, 140, 150, 0.2);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s;
}



.delete-wrapper {
    margin-left: 8px;
    padding: 2px;
    border-radius: 50%;
    transition: all 0.3s;
}

.active-item .breadcrumb-wrapper {
    background: #089BAB;
    border-color: #089BAB;
}

.active-item .breadcrumb-text {
    color: #fff;
}
</style>
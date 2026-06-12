<template>
    <div class="tree-container">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" @click.native="toggleTree" ref="inputRef"></el-input>

        <el-tree v-if="showTree" class="filter-tree" :data="data" show-checkbox node-key="id"
            :default-expanded-keys="[2, 3]" :default-checked-keys="[]" :props="defaultProps"
            @click.native.stop></el-tree>
    </div>
</template>

<script>
import { getjigou } from '../../../../api/deviceuser.js'
export default {
    data() {
        return {
            filterText: '',
            showTree: false, // 控制树显示
            data: [],
            defaultProps: {
                children: 'children',
                label: 'node'
            }
        };
    },
    mounted() {
        // 添加全局点击监听
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeDestroy() {
        // 移除全局监听
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        async getlistjigu() {
            const res = await getjigou({});
            if (res.code === '200' && res.data && res.data.orgtree) {
                this.data = res.data.orgtree;
            }
        },
        toggleTree() {
            this.showTree = !this.showTree;
        },
        // 点击外部区域关闭树
        handleClickOutside(e) {
            if (!this.$refs.inputRef.$el.contains(e.target) &&
                !this.$refs.tree.$el.contains(e.target)) {
                this.showTree = false;
            }
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    mounted() {

        this.getlistjigu();
    },
};
</script>

<style scoped>
.tree-container {
    position: relative;
    width: 300px;
    /* 根据输入框宽度调整 */
}

.filter-tree {
    position: absolute;
    z-index: 2000;
    width: 100%;
    margin-top: 5px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
}

/* 调整树节点样式 */
.el-tree {
    max-height: 300px;
    overflow-y: auto;
}

/* 输入框聚焦样式 */
.el-input /deep/ .el-input__inner:focus {
    border-color: #089BAB;
}
</style>
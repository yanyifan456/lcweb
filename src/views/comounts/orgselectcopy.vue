<template>
    <div class="tree-container">
        <el-input style="width: 250px;" placeholder="点击输入框进行选择" v-model="filterText" @click.native="handleInputClick"
            ref="inputRef" readonly :disabled="isDisabled" />

        <!-- v-show 保证 tree ref 可用 -->
        <el-tree ref="tree" v-show="showTree" class="filter-tree" :data="data" node-key="id" :props="defaultProps"
            @node-click="handleNodeClick" highlight-current :expand-on-click-node="false">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span :class="{
                    'leaf-node': isLeaf(data),
                    'selectable-node': isSelectable(data) && !isDisabled,
                    'disabled-node': isDisabled
                }">
                    {{ node.label }}
                </span>
            </span>
        </el-tree>
    </div>
</template>

<script>
import { getjigou } from '@/api/deviceuser'

export default {
    data() {
        return {
            filterText: '',
            showTree: false,
            data: [],
            defaultProps: { children: 'children', label: 'node' },
            selectedNode: null,
            roleName: ''
        }
    },
    computed: {
        isDisabled() {
            const roleName = sessionStorage.getItem('roleName') || ''
            // 只要是 superAdmin 或 admin 就不禁用
            return !(roleName.includes('superAdmin') || roleName.includes('admin'))
        }


    },
    mounted() {
        this.roleName = sessionStorage.getItem('roleName') || ''
        document.addEventListener('click', this.handleClickOutside)
        this.getlistjigu()
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside)
    },
    methods: {
        handleInputClick() {
            if (!this.isDisabled) {
                this.toggleTree()
            }
        },
        isSelectable(data) {
            return !data.children || data.children.length === 0
        },
        isLeaf(data) {
            return !data.children || data.children.length === 0
        },

        async getlistjigu() {
            try {
                const mainOrg = sessionStorage.getItem('mainOrg')
                const params = {}
                if (this.roleName !== 'superAdmin') {
                    params.mainOrg = mainOrg
                }

                const res = await getjigou(params)
                const orgTree = res?.data?.orgtree

                if (res?.code === '200' && orgTree) {
                    this.data = orgTree
                    this.$nextTick(() => this.setDefaultOrgFromStorage())
                } else {
                    this.data = []
                }
            } catch (e) {
                console.error('获取机构失败', e)
                this.data = []
            }
        },

        setDefaultOrgFromStorage() {
            const orgId = sessionStorage.getItem('orgId')
            if (!orgId) return

            const tree = this.$refs.tree
            if (!tree) return

            const targetNode = this.findNodeByOrgId(this.data, orgId)
            if (!targetNode) return

            tree.setCurrentKey(targetNode.id)
            this.selectedNode = targetNode
            this.filterText = targetNode.node

            this.$emit('node-selected', {
                orgId: targetNode.orgId,
                node: targetNode.node
            })
        },

        findNodeByOrgId(treeData, orgId) {
            for (const node of treeData) {
                if (String(node.orgId) === String(orgId)) return node
                if (node.children?.length) {
                    const res = this.findNodeByOrgId(node.children, orgId)
                    if (res) return res
                }
            }
            return null
        },

        handleNodeClick(data) {
            if (this.isDisabled) return // 🚫 非超级管理员不可点击节点

            if (this.selectedNode) this.$refs.tree.setCurrentKey(null)

            this.$refs.tree.setCurrentKey(data.id)
            this.selectedNode = data
            this.filterText = data.node
            this.showTree = false

            this.$emit('node-selected', {
                orgId: data.orgId,
                node: data.node
            })
        },


        toggleTree() {
            if (this.isDisabled) return
            this.showTree = !this.showTree
            if (this.showTree && this.selectedNode) {
                this.$nextTick(() => {
                    this.$refs.tree.setCurrentKey(this.selectedNode.id)
                })
            }
        },

        handleClickOutside(event) {
            if (!this.$el.contains(event.target)) {
                this.showTree = false
            }
        }
    }
}
</script>

<style scoped>
.tree-container {
    position: relative;
    width: 300px;
}

.filter-tree {
    position: absolute;
    z-index: 2000;
    width: 100%;
    margin-top: 5px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
}

.custom-tree-node {
    cursor: default;
    font-size: 14px;
    color: #999;
}

.selectable-node {
    cursor: pointer;
    color: #333;
}

.disabled-node {
    color: #bbb;
    cursor: not-allowed;
}

.el-tree-node.is-current>.el-tree-node__content {
    background-color: #e6f7ff !important;
}

/* 输入框禁用状态 */
.el-input__inner[disabled] {
    background-color: #f5f7fa;
    cursor: not-allowed;
}
</style>

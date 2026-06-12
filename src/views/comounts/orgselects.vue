<template>
    <div class="tree-container">
        <el-input placeholder="点击输入框进行选择" v-model="filterText" @click.native="toggleTree" ref="inputRef" readonly
            :disabled="isDisabled" />

        <el-tree style="position: absolute; position: absolute;
    z-index: 2000;
    width: 100%;
    margin-top: 5px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background: white;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;" ref="tree" v-show="showTree" :data="data" show-checkbox node-key="id" :props="defaultProps"
            :highlight-current="true" @check="handleCheck" />
    </div>
</template>

<script>
import { getjigou } from '@/api/deviceuser'

export default {
    name: 'OrgTreeSelect',
    data() {
        return {
            filterText: '',
            showTree: false,
            data: [],
            defaultProps: { children: 'children', label: 'node' },
            lastSelectedNode: null,
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

            tree.setCheckedKeys(this.getAllNodeIds(targetNode))

            const orgIds = this.collectOrgIds(targetNode)
            this.filterText = targetNode.node
            this.lastSelectedNode = { node: targetNode, orgIds }

            this.$emit('node-selected', {
                orgId: targetNode.orgId,
                orgIds,
                node: targetNode.node
            })
        },

        handleCheck(currentNode) {
            if (this.isDisabled) return

            const tree = this.$refs.tree
            if (!tree) return

            tree.setCheckedKeys(this.getAllNodeIds(currentNode))
            const orgIds = this.collectOrgIds(currentNode)

            this.lastSelectedNode = { node: currentNode, orgIds }
            this.filterText = currentNode.node
            this.showTree = false

            this.$emit('node-selected', {
                orgId: currentNode.orgId,
                orgIds,
                node: currentNode.node
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

        getAllNodeIds(node) {
            let ids = [node.id]
            if (node.children?.length) {
                node.children.forEach(c => (ids = ids.concat(this.getAllNodeIds(c))))
            }
            return ids
        },

        collectOrgIds(node) {
            let ids = [node.orgId]
            if (node.children?.length) {
                node.children.forEach(c => (ids = ids.concat(this.collectOrgIds(c))))
            }
            return ids
        },

        toggleTree() {
            if (this.isDisabled) return
            this.showTree = !this.showTree
        },

        handleClickOutside(e) {
            if (!this.$el.contains(e.target)) {
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
    background: #fff;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    max-height: 300px;
    overflow-y: auto;
}

/* 输入框置灰，仅视觉效果 */
.el-input__inner[disabled] {
    background-color: #f5f7fa;
    cursor: not-allowed;
}
</style>

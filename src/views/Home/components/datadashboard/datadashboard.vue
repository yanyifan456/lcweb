<template>
    <div style="height: 100%;">
        <div style="width: 100%;height: 85%;overflow: scroll;">
            <div class="aa">选择机构</div>
            <div class="tree-container">
                <div v-for="value in flatDatas" :key="value.id">
                    <div class="bb">
                        <img style="position: absolute;width: 64px;height: 64px;top: 35px;left: 45px;"
                            src="../../../../assets/img/14.png" alt="">
                        <el-button @click="godaping(value.orgId, value.node)" style="border: 0;font-size: 18px;">
                            {{ value.node.length > 9 ? value.node.slice(0, 9) +
                                '...' : value.node
                            }}</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getjigou } from '@/api/deviceuser'
export default {
    name: 'datadashboard',
    data() {
        return {
            datas: [],      // 原始树形数据
            flatDatas: []   // 扁平化后的数据
        }
    },
    mounted() {
        this.getlistjigu()
    },
    methods: {
        async getlistjigu() {
            const res = await getjigou({})
            const tree = res.data.orgtree || []
            // 1️⃣ 原始树
            this.datas = tree
            // 2️⃣ 扁平化
            this.flatDatas = this.flattenTree(tree)
        },
        // ✅ 树 → 扁平（保留 parentId）
        flattenTree(tree, parentId = null, result = []) {
            tree.forEach(item => {
                const { children, ...rest } = item
                result.push({
                    ...rest,
                    parentId
                })
                if (children && children.length) {
                    this.flattenTree(children, item.id, result)
                }
            })
            return result
        },
        godaping(id, node) {
            // 组装 query 参数
            const query = new URLSearchParams({
                orgId: id,
                orgName: node
            }).toString();
            // 打开新页面
            const baseUrl = import.meta.env.VITE_APP_BASE_URL

            console.log(baseUrl);

            window.open(`${baseUrl}/greendist/#/home?${query}`);
            // window.open(`http://192.168.100.19:333/#/home?${query}`);
        },
    }
}
</script>
<style scoped>
.aa {
    width: 96px;
    height: 24px;
    font-family: SegoeUIBlack, SegoeUIBlack;
    font-weight: 400;
    font-size: 24px;
    color: #121A2D;
    line-height: 24px;
    text-align: left;
    font-style: normal;
    text-transform: none;
    margin-bottom: 30px;
}

.bb {
    width: 382px;
    height: 140px;
    background: #FFFFFF;
    box-shadow: 0px 3px 12px 0px rgba(0, 0, 0, 0.0392);
    border-radius: 10px 10px 10px 10px;
    padding-left: 120px;
    line-height: 140px;
    position: relative;
}

.tree-container {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;

}
</style>

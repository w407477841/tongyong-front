<template>
	<div :style="height">
		<TreeGrid ref="treegrid" :columns="columns" :tree-structure="true" :data-source="dataSource" @setShow="setShow" style="overflow-y:scroll;max-height:92%;"></TreeGrid>
	</div>
</template>

<script>
import TreeGrid from "./treeTable/vue/TreeGrid.vue";
import { selectTreeOperation } from "@/views/system/api/systemApi.js";
export default {
    name: "hello",
    data() {
        return {
            columns: [
                { text: "名称", dataIndex: "name" },
                { text: "图标", dataIndex: "icon" },
                { text: "权限字符", dataIndex: "permission" },
                { text: "内部排序", dataIndex: "sort" }
            ],
            dataSource: [],
            height : ''
        };
    },
    methods: {
        getList() {
            let para = {};
            selectTreeOperation(para).then(res => {
                this.dataSource = res.data;
            });
        },
        setShow : function(data) {
            this.getList();
        },
        setHeight : function() {
            this.height = "height:" + (window.innerHeight - 34) + "px";
        }
    },
    components: {
        TreeGrid
    },
    mounted() {
        this.setHeight();
        this.getList();
    }
};
</script>
<style scoped>
</style>
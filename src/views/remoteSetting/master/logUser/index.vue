<!--
 * @Author: hjy
 * @CreateTime: 2018-10-17 10:30:40
 * @Desc: 日志发送人员配置
-->
<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <topButton :operationPrex="operationPrex" @clickInsert="handleInsert" @clickUpdate="handleUpdate" @clickDelate="handleDelete" check="callTimes=1" :sels="sels"></topButton>
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%"  highlight-current-row @selection-change="listSelectionChange"  header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <!-- <el-table-column label="设备类型" prop="deviceType" :formatter="typeTransform"  show-overflow-tooltip ></el-table-column> -->
                    <el-table-column label="发送用户" prop="userNames" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
                        <template slot-scope="scope">
                            <rightButton :operationPrex="operationPrex" @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row" :disDelete="scope.row.callTimes>'0'?true:false"></rightButton>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!--<div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>-->
        </div>
        <detailsDialog v-if="visible" :visible.sync="visible" @close="closeDialog" :routeType="detailsType" :detailsId="detailsId"></detailsDialog>
    </div>
</template>
<script>
    import {getListApi,deleteTargetSetWater,deleteInfoApi} from "@/views/remoteSetting/api/logUser.js";
    import detailsDialog from "./details";
    export default {
        components: {
            detailsDialog
        },
        data() {
            return {
                operationPrex: "logUser:index",
                listData: [],
                isDangerous: "",
                keyword: "",
                pageIndex: 1,
                pageSizes: [10, 20, 30],
                pageSize: 10,
                pageTotal: 0,
                sels: [],
                visible: false,
                detailsType: null,
                detailsId: null
            };
        },
        computed: {
            params() {
                let param = {
                    key: this.keyword,
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize
                };
                return param;
            }
        },
        mounted() {
            this.getListData();
        },
        methods: {
            //条件查询
            handleSearch() {
                //this.pageIndex = 1;
                this.getListData();
            },
            //加载列表
            getListData() {
                getListApi(this.params).then(res => {
                    this.listData = res.data.list;
                    this.pageTotal = res.data.total;
                });
            },
            //显示条数改变
            handleSizeChange(val) {
                this.pageSize = val;
                this.handleSearch();
            },
            //页码跳转
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.handleSearch();
            },
            //新增
            handleInsert() {
                this.visible = true;
                this.detailsType = "insert";
                this.detailsId = null;
            },
            handleView(row) {
                this.visible = true;
                this.detailsType = "view";
                this.detailsId = row.id;
            },
            //更新
            handleUpdate(row) {
                this.visible = true;
                this.detailsType = "update";
                this.detailsId = row.id;
            },
            //删除方法
            handleDelete(sels) {
                let params = { ids: sels.map(item => item.id) };
                this.$confirm("确认删除选中记录吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    deleteInfoApi(params).then(res => {
                        this.$message({
                            message: res.message,
                            type: res.success ? "success" : "error"
                        });
                        this.handleSearch();
                    });
                });
            },
            //删除时验证是否选中
            listSelectionChange(sels) {
                this.sels = sels;
            },
            //关闭模态框
            closeDialog() {
                this.visible = false;
                this.handleSearch();
            },
            typeTransform(row) {
                if (row.deviceType === 1) {
                    return "塔吊";
                } else if (row.deviceType === 2) {
                    return "升降机";
                } else if (row.deviceType === 3){
                    return "扬尘";
                }else{
                    return "未知";
                }
            },
        }
    };
</script>


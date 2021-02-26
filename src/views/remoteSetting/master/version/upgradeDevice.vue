<template>
    <el-dialog width="80%" :title="title" :visible.sync="upgradeDevice"   :close-on-click-modal="false" append-to-body>
        <div class="details-container">
            <div class="container-box condition-box">
                <div class="conditionBar">
                    <el-form :inline="true" class="condition-form">
                        <el-form-item>
                            <el-input size="mini" placeholder="设备号/工程名称" v-model="keyword" clearable class="toolbar-search"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search" @click="handleSearch">查询</el-button>
                            <el-button class="" type="primary" size="mini"
                                       icon="" @click="handleSearchUpgrade">升级</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="container-box list-box">
                <div class="table-box">
                    <el-table size="small" :data="listData" style="width: 100%"  highlight-current-row
                              @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
                        <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                        <el-table-column type="index" :width="indexWidth"></el-table-column>
                        <el-table-column label="设备号" prop="deviceNo"></el-table-column>
                        <el-table-column label="工程名称" prop="projectName" show-overflow-tooltip></el-table-column>
                        <el-table-column label="当前版本号" prop="firmwareVersion" show-overflow-tooltip></el-table-column>
                        <el-table-column label="上次升级时间" prop="commandUpgradeTime" :formatter="handleDate"></el-table-column>
                        <!--<el-table-column label="升级状态" prop=""></el-table-column>-->
                    </el-table>
                </div>
                <div class="pagination-box">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                                   :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import {getDeviceListData,handleSearchUpgradeApi } from "../../api/version.js";
    import moment from 'moment';
    export default {
        components: {},
        data() {
            return {
                listData: [],
                isDangerous: "",
                keyword: "",
                pageIndex: 1,
                pageSizes: [10, 20, 30],
                pageSize: 10,
                pageTotal: 0,
                sels: [],
                upgradeIdValue:'',
                title: '设备升级',
                upgradeTypeValue:'',
                upgradeDevice: false
            };
        },
        props: {
            //dialog模式
            visible: {
                type: Boolean,
                default: function() {
                    return true;
                }
            },
            upgradeId: {
                type: Number || String,
                default: function() {
                    return null;
                }
            },
            upgradeType: {
               /* type: Number || String,*/
                default: function() {
                    return null;
                }
            },
        },
        watch: {
            //dialog模式
            upgradeId: {
                handler: function(val, oldVal) {
                    this.upgradeIdValue=val;
                    this.edit = true;
                },
                immediate: true
            },
            upgradeType: {
                handler: function(val, oldVal) {
                    this.upgradeTypeValue=val;
                    this.edit = true;
                },
                immediate: true
            },
            visible: {
                handler: function(val, oldVal) {
                    this.upgradeDevice = val;
                },
                immediate: true
            },
            upgradeDevice(val) {
                if (!val) {
                    this.$emit('close', {});
                }
            }
        },
        computed: {
            params() {
                let param = {
                    key: this.keyword,
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    type:this.upgradeTypeValue,
                    body: {

                    }
                };
                return param;
            },
        },
        mounted() {
            this.getListData();
        },
        methods: {
            //页面搜索
            handleSearch() {
                //this.pageIndex = 1;
                this.getListData();

            },
            //条件搜索
            handleSearchButton(){
                this.pageIndex = 1;
                this.getListData();
            } ,
            //获取数据列表
            getListData() {
                getDeviceListData(this.params).then(res => {
                    this.listData = res.data.list;
                    this.pageTotal = res.data.total;
                });
            },
            //升级设备
            handleSearchUpgrade() {
                let ids = '';
                for (var i = 0; i < this.sels.length; i++) {
                    ids += this.sels[i].id + ',';
                }
                if(ids===""){
                    this.$message({message: '未选中任何数据', type: 'error'});
                    return;
                }
                this.$confirm('确认升级选中设备吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    handleSearchUpgradeApi({deviceIds: ids,upgradeId:this.upgradeIdValue}).then(res => {
                        this.upgradeDevice=false;
                        this.handleSearch();
                        this.$message({
                            message: res.message,
                            type: res.success ? "success" : "error"
                        });
                        ids="";
                    });
                });

            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.handleSearch();
            },
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.handleSearch();
            },
            listSelectionChange(sels) {
                this.sels = sels;
            },
            //日期格式变换
            handleDate(row, column, cellValue, index) {
                if (cellValue) {
                    return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    return '';
                }
            },
        }
    };
</script>

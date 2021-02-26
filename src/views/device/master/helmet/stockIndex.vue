<!--
 * @Author: hujingyun
 * @CreateTime: 2018-09-08 22:31:23
 * @Desc: 安全帽库存主页面
-->
<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item>
                        <el-input size="mini" placeholder="请输入IMEI编号" v-model="keyword" clearable
                                  class="toolbar-search"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search"
                                   @click="handleSearchButton">查询
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="validateOperation('putStock')" class="updateBtn" type="primary" size="mini"
                                   icon="el-icon-storage" @click="handlePutStock">入库
                        </el-button>
                        <el-upload
                                :action="fileUploadUrl"
                                :headers="headers"
                                name="file"
                                :on-error="uploadError"
                                :on-success="uploadSuccess"
                                :show-file-list="false"
                                accept=".xlsx,.xls"   style="display: inline-block; margin-left: 10px;margin-right: 10px; ">
                            <el-button type="primary" v-if="validateOperation('putStock')"
                                       class="updateBtn" size="mini" icon="el-icon-storage">批量入库</el-button>
                        </el-upload>
                        <el-button v-if="validateOperation('outStock')" class="updateBtn" type="success"  size="mini"
                                   icon="el-icon-theLibrary" :disabled="disabledStatus" @click="handleOutStock">批量出库
                        </el-button>
                        <el-button v-if="validateOperation('delete')" class="updateBtn" type="danger"  size="mini"
                                   icon="el-icon-delete" :disabled="disabledStatus" @click="handleDelete">批量删除
                        </el-button>
                        <el-button v-if="validateOperation('templateExport')" class="updateBtn" type="primary" size="mini"
                                   icon="el-icon-download" @click="handleTemplateExport">模板下载
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="container-box list-box">
            <div class="table-box">
                <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row
                          @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
                    <el-table-column type="selection" :width="selectionWidth"></el-table-column>
                    <el-table-column type="index" :width="indexWidth"></el-table-column>
                    <el-table-column label="IMEI编号" prop="deviceNo" show-overflow-tooltip></el-table-column>
                    <el-table-column label="库存状态" prop="status" :formatter="handleStatus"></el-table-column>
                    <el-table-column label="创建日期" prop="createTime" :formatter="handleDate"></el-table-column>
                    <el-table-column label="创建人" prop="createUserName"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button v-if="validateOperation('outStock')" type="success" plain size="small"
                                       icon="el-icon-theLibrary" :disabled="scope.row.status===1?true:false"
                                       @click="handleOutOneStock(scope.row)">出库
                            </el-button>
                            <el-button v-if="validateOperation('delete')" type="danger" plain size="small"
                                       icon="el-icon-delete" :disabled="scope.row.status===1?true:false"
                                       @click="handleOneDelete(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                               :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
        </div>

        <handlePutStockDialog v-if="putVisible" :visible.sync="putVisible" @close="closeDialog"></handlePutStockDialog>
        <handleOutStockDialog v-if="outVisible" :visible.sync="outVisible" @close="closeDialog"
                              :detailsIds="detailsImeis"></handleOutStockDialog>

    </div>
</template>

<script>
    import {
        deleteStockApi,
        getStockListApi,
    } from "../../api/helmet.js";
    import {url} from '@/axios/base.js'
    import handlePutStockDialog from "./stockPutDialog.vue";
    import handleOutStockDialog from "./stockOutDialog.vue";
    import moment from "moment";

    export default {
        components: {
            handlePutStockDialog,
            handleOutStockDialog,
        },
        data() {
            return {
                operationPrex: "helmet:device:stock",
                headers:{"Authorization":sessionStorage.getItem('auth')},
                fileUploadUrl: url+"/device/helmetStock/fileUpload" ,
                listData: [],
                keyword: "",
                pageIndex: 1,
                pageSizes: [10, 20, 30],
                pageSize: 10,
                pageTotal: 0,
                sels: [],
                disabledStatus: true,
                putVisible: false,
                outVisible: false,
                detailsImeis: null,
                ids: [],
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
            this.handleSearch();
        },
        methods: {
            //默认查询
            handleSearch() {
                this.getListData();
            },
            handleSearchButton() {
                this.pageIndex = 1;
                this.getListData();
            },
            //查询一览
            getListData() {
                getStockListApi(this.params).then(res => {
                    this.listData = res.data.list;
                    this.pageTotal = res.data.total;
                });
            },
            //条数变更
            handleSizeChange(val) {
                this.pageSize = val;
                this.getListData();
            },
            //页数变更
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getListData();
            },

            //选中的行数据
            listSelectionChange(sels) {
                this.disabledStatus = true;
                this.sels = sels;
                this.detailsImeis = "";
                this.ids = [];
                let imeis = "";
                let statusFlag = false;
                if (sels.length === 0) {
                    statusFlag = true;
                }
                for (let i = 0; i < sels.length; i++) {
                    if (i === 0) {
                        imeis += (this.sels[i].deviceNo);
                    } else {
                        imeis += ("," + this.sels[i].deviceNo);
                    }
                    if (sels[i].status === 1) {
                        statusFlag = true;
                    }
                    this.ids.push(this.sels[i].id);
                }
                this.detailsImeis = imeis;
                this.disabledStatus = statusFlag;
            },
            //库存状态
            handleStatus(row) {
                return row.status === 0 ? "未出库" : "已出库";
            },
            //单个删除
            handleOneDelete(row) {
                this.ids.push(row.id);
                this.handleDelete();
            },
            //删除
            handleDelete() {
                let params = {ids: this.ids};
                this.$confirm("确认删除选中记录吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    deleteStockApi(params).then(res => {
                        this.$message({
                            message: res.message,
                            type: res.success ? "success" : "error"
                        });
                        this.handleSearch();
                    });
                });
            },
            //跳转入库
            handlePutStock() {
                this.putVisible = true;
            },
            //单个跳转出库
            handleOutOneStock(row) {
                this.detailsImeis = row.deviceNo + "";
                this.outVisible = true;
            },
            //批量跳转出库
            handleOutStock() {
                this.outVisible = true;
            },
            //模板下载
            handleTemplateExport() {
                //const dialogImageUrl = "http://ssqd.jsxywg.cn/smartsite_resource/helmet_stock_template.xlsx";
                const dialogImageUrl = "/static/helmet_stock_template.xlsx";
                window.location.href= dialogImageUrl;
            },
            //关闭弹窗
            closeDialog() {
                this.outVisible = false;
                this.putVisible = false;
                this.pageIndex = 1;
                this.pageSize = 10;
                this.handleSearch();
            },
            // 上传成功后的回调
            uploadSuccess(response) {
                if(response.success===false){
                    this.$message({message: response.message, type: "error"});
                }else{
                    this.handleSearch();
                    this.$message({message: response.message, type: "success"});
                }
            },
            // 上传错误
            uploadError(response) {
                this.open("500", "文件导入异常！");
            },
            //日期格式转换
            handleDate(row, column, cellValue, index) {
                if (cellValue) {
                    return moment(cellValue).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    return "";
                }
            },
        }
    };
</script>

<style lang="scss" scoped>
</style>

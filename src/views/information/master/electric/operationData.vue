<template>
    <div class="app-container list-container">
        <div class="container-box condition-box">
            <div class="conditionBar">
                <el-form :inline="true" class="condition-form">
                    <el-form-item label="">
                        <el-select v-model="checkTime" placeholder="查询时间" size="mini" @change="chooseShortcutDate">
                            <el-option v-for="item in checkTimeList" :label="item.label" :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-date-picker v-model="beginTime" :disabled="dateShow" type="date" placeholder="选择日期"
                        :picker-options="beginPicker"   value-format="yyyy-MM-dd" size="mini"></el-date-picker>
                        <i>-</i>
                        <el-date-picker v-model="endTime" :disabled="dateShow" type="date" placeholder="选择日期"
                          :picker-options="endPicker"   value-format="yyyy-MM-dd" size="mini"></el-date-picker>
                    </el-form-item>
                    <!-- <el-form-item label="">
                        <el-select v-model="status" placeholder="状态" clearable size="mini">
                            <el-option v-for="item in selectStatus" :label="item.label" :value="item.value"
                                       :key="item.value"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button class="searchBtn" type="primary" size="mini" icon="el-icon-search"
                                   @click="handleSearchButton">查询
                        </el-button>
                        <el-button size="mini" @click="handleCancel">取 消</el-button>
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
                    <el-table-column label="运行时间" prop="deviceTime" width="135px">
                        <template slot-scope="scope">
                        {{moment(scope.row.deviceTime).format('YYYY-MM-DD HH:mm:ss')}}
                        </template>
                    </el-table-column>
                    <el-table-column label="当前电量（千瓦时）" prop="currentDegree"></el-table-column>
                    <el-table-column label="真实电量（千瓦时）" prop="actualDegree"></el-table-column>
                    <!-- <el-table-column label="设备状态" prop="status" :formatter="deviceStatusCheck"></el-table-column> -->
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize"
                               :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
            </div>
            <!--<div class="details-footer" style="text-align: right;">
                <el-button size="mini" @click="handleCancel">取 消</el-button>
            </div>-->
        </div>
    </div>
</template>

<script>
import { geoperationDataListApi } from "@/views/information/api/electric.js";

export default {
  data() {
    return {
      listData: [],
      isDangerous: "",
      keyword: "",
      checkTime: "",
      isOnline: null,
      projectId: null,
      monitorId: null,
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      status: null,
      detailsType: null,
      selectStatus: [{ label: "离线", value: 0 }, { label: "在线", value: 1 }],
      checkTimeList: [
        { label: "7天内", value: 1 },
        { label: "15天内", value: 2 },
        { label: "30天内", value: 3 },
        { label: "自定义", value: 4 }
      ],
      beginTime: "",
      endTime: "",
      edit: false,
      dateShow: true
    };
  },
  computed: {
    params() {
      let param = {
        key: this.keyword,
        pageNum: this.pageIndex,
        pageSize: this.pageSize,
        body: {
          beginTime: this.beginTime,
          endTime: this.endTime,
          status: this.status,
          monitorId: this.monitorId
        }
      };
      return param;
    },
    beginPicker() {
      let endTime = this.endTime;
      return {
        disabledDate(time) {
          return time.getTime() > new Date(endTime);
        }
      };
    },
    endPicker() {
      let beginTime = this.$moment(this.beginTime);
      return {
        disabledDate(time) {
          return time.getTime() < new Date(beginTime);
        }
      };
    }
  },
  mounted() {
    //接收父页面传来的值
    this.monitorId = this.$route.query.id;
    this.getListData();
  },
  methods: {
    //页面搜索
    handleSearch() {
      //this.pageIndex = 1;
      this.getListData();
    },
    //条件搜索
    handleSearchButton() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取数据列表
    getListData() {
      geoperationDataListApi(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = res.data.total;
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
    //取消
    handleCancel() {
      this.$router.back(-1);
    },
    //选择查询条件时改变日期选择器的可用性
    chooseShortcutDate() {
      if (this.checkTime == 1) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format("YYYY-MM-DD"));
        this.endTime = new Date();
        this.beginTime = new Date(begin.setDate(begin.getDate() - 7));
      } else if (this.checkTime == 2) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format("YYYY-MM-DD"));
        this.endTime = new Date();
        this.beginTime = new Date(begin.setDate(begin.getDate() - 15));
      } else if (this.checkTime == 3) {
        this.dateShow = true;
        let begin = new Date(this.$moment(new Date()).format("YYYY-MM-DD"));
        this.endTime = new Date();
        this.beginTime = new Date(begin.setDate(begin.getDate() - 30));
      } else if (this.checkTime == 4) {
        this.dateShow = false;
      }
    },
    //设备状态
    deviceStatusCheck(row) {
      if (row.status === 0) {
        return "离线";
      } else if (row.status === 1) {
        return "在线";
      } else {
        return "未知";
      }
    }
  }
};
</script>

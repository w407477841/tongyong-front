<!--
 * @Description: 设备在线统计
 * @Author: zhangzhenya
 * @Date: 2019-06-18 09:20:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-06-29 17:00:50
 -->

<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item>
            <el-date-picker
              v-model="daterange"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :clearable="false"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-select size="mini" v-model="type" filterable placeholder="区分" @change="typeChange">
              <el-option
                v-for="item in typeList"
                :label="item.label"
                :value="item.value"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
            <el-button
              class="searchBtn"
              type="primary"
              size="mini"
              icon="el-icon-download"
              @click="handleDown"
            >导出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table
          size="small"
          :data="listData"
          style="width: 100%"
          height="100%"
          highlight-current-row
          @selection-change="listSelectionChange"
          header-row-class-name="xyTableHeader"
        >
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="日期" prop="workDate" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column
            v-if="type == 2"
            label="工程名称"
            prop="projectName"
            min-width="150"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="在线数量" prop="onlineNumber"></el-table-column>
          <el-table-column label="总数量" prop="count"></el-table-column>
          <el-table-column label="在线率(%)" prop="onlineRate"></el-table-column>
        </el-table>
      </div>
      <!-- <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :total="pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div> -->
    </div>
  </div>
</template>

<script>
import { selectIsOnline, createURL } from "@/views/crane/api/craneReport.js";

export default {
  name: "crane-online",
  data() {
    return {
      projectId: "",
      pageIndex: 1, //
      typeList: [
        {
          value: "2",
          label: "按项目"
        },
        {
          value: "1",
          label: "按设备"
        }
      ],
      type: "1",
      listData: [],
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      //时间
      daterange: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近十五天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 15);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  mounted() {
    let startTime = this.$moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    let endTime = this.$moment().format("YYYY-MM-DD");
    this.daterange = [startTime, endTime];
    this.handleSearch();
  },
  methods: {
    handleDown() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        startTime: `${startTime}%2000:00:00`,
        endTime: `${endTime}%2023:59:59`,
        type: this.type
      };
      window.location.href = createURL(
        "/craneData/api/selectIsOnlineExcel",
        params
      );
    },
    typeChange(){
      this.handleSearch();
    },
    //查询
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    //获取数据
    getListData() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`,
        body: {
          projectId: this.projectId,
          type: this.type
        }
      };
      selectIsOnline(params).then(res => {
        this.listData = res.data || [];
        // this.pageTotal = res.data.total;
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
    listSelectionChange(sels) {
      this.sels = sels;
    }
  }
};
</script>
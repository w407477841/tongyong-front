<!--
 * @Description: 工作等级统计
 * @Author: pangyu
 * @Date: 2019-06-17 17:46:19
 * @LastEditors: pangyu
 * @LastEditTime: 2019-07-17 20:49:20
 -->

<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form" size="mini">
          <el-form-item>
            <el-select v-model="projectId" filterable clearable placeholder="工程名称">
              <el-option
                v-for="item in projectList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="keyWord" clearable placeholder="塔机/黑匣子编号"></el-input>
          </el-form-item>
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
            <el-button
              class="searchBtn"
              type="primary"
              icon="el-icon-search"
              @click="handleSearch"
            >查询</el-button>
            <el-button class="searchBtn" type="primary" icon="el-icon-download" @click="handleDown">导出</el-button>
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
          <el-table-column label="工程名称" prop="projectName" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="塔机编号" prop="craneNo" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="黑匣子编号" prop="deviceNo" min-width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="规格型号" prop="specification"></el-table-column>
          <el-table-column label="吊重起始时间" prop="workDate" min-width="140"></el-table-column>
          <el-table-column label="吊重次数" prop="liftFrequency"></el-table-column>
          <el-table-column label="超载次数" prop="overloadFrequency"></el-table-column>
          <el-table-column label="超载率(%)" prop="overloadRate"></el-table-column>
          <el-table-column
            label="月使用频率(次/月)"
            min-width="120"
            prop="frequencyMonth"
          ></el-table-column>
          <el-table-column width="110">
            <template slot="header">
              <div class="promptHeader">
                <span>使用等级</span>
                <el-popover width="320" trigger="hover">
                  <div class="promptMain">
                    <div class="promptMain">按塔机使用寿命20年计算，按国标GB13752-2017规定，塔机使用情况有五钟：</div>
                    <div>
                      <span class="s1">
                        U
                        <sub>1</sub>
                      </span>
                      <span class="s2">
                        1.60 × 10
                        <sup>4</sup>~3.20 × 10
                        <sup>4</sup>
                      </span>
                      <span class="s3">很少使用</span>
                    </div>
                    <div>
                      <span class="s1">
                        U
                        <sub>2</sub>
                      </span>
                      <span class="s2">
                        3.20 × 10
                        <sup>4</sup>~6.30 × 10
                        <sup>4</sup>
                      </span>
                      <span class="s3">很少使用</span>
                    </div>
                    <div>
                      <span class="s1">
                        U
                        <sub>3</sub>
                      </span>
                      <span class="s2">
                        6.30 × 10
                        <sup>4</sup>~1.25 × 10
                        <sup>5</sup>
                      </span>
                      <span class="s3">很少使用</span>
                    </div>
                    <div>
                      <span class="s1">
                        U
                        <sub>4</sub>
                      </span>
                      <span class="s2">
                        1.25 × 10
                        <sup>5</sup>~2.50 × 10
                        <sup>5</sup>
                      </span>
                      <span class="s3">不频繁使用</span>
                    </div>
                    <div>
                      <span class="s1">
                        U
                        <sub>5</sub>
                      </span>
                      <span class="s2">
                        2.50 × 10
                        <sup>5</sup>~5.00 × 10
                        <sup>5</sup>
                      </span>
                      <span class="s3">中等频繁使用</span>
                    </div>
                  </div>
                  <i class="el-icon-tishi" slot="reference"></i>
                </el-popover>
              </div>
            </template>
            <template slot-scope="scope">{{scope.row.$level}}</template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          :total="pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getProjectListApi } from "@/views/device/api/crane.js";
import { selectWorkGrade, createURL } from "@/views/crane/api/craneReport.js";

export default {
  name: "crane-level",
  data() {
    return {
      keyWord: "",
      projectId: "",
      projectList: [],
      listData: [],
      pageIndex: 1,
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
    this.getProjectList();
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
        projectId: this.projectId,
        keyWord: this.keyWord
      };
      window.location.href = createURL(
        "/craneData/api/getWorkGradeExcel",
        params
      );
    },
    getProjectList() {
      getProjectListApi({}).then(res => {
        this.projectList = res.data;
      });
    },
    handleSearch() {
      this.pageIndex = 1;
      this.getListData();
    },
    getListData() {
      let [startTime, endTime] = this.daterange || ["", ""];
      let params = {
        pageSize: this.pageSize,
        pageNum: this.pageIndex,
        startTime: `${startTime} 00:00:00`,
        endTime: `${endTime} 23:59:59`,
        body: {
          projectId: this.projectId,
          keyWord: this.keyWord
        }
      };
      selectWorkGrade(params).then(res => {
        let diff = this.$moment(endTime).diff(this.$moment(startTime), "days")+1;
        this.listData = (res.data.list || []).map(item => {
          item.overloadRate = item.liftFrequency>0?(item.overloadFrequency/item.liftFrequency*100).toFixed(2):0;
          item.frequencyMonth = (item.liftFrequency / diff * 30).toFixed(2);
          let val = item.frequencyMonth * 12 * 20;
          let $level = "很少使用";
          if (val <= 3.2 * 10000) {
            $level = "很少使用";
          } else if (val <= 6.3 * 10000) {
            $level = "很少使用";
          } else if (val <= 1.25 * 100000) {
            $level = "很少使用";
          } else if (val <= 2.5 * 100000) {
            $level = "不频繁使用";
          } else if (val <= 5 * 100000) {
            $level = "中等频繁使用";
          }
          return {
            $level: $level,
            ...item
          };
        });
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
    listSelectionChange(sels) {
      this.sels = sels;
    }
  }
};
</script>
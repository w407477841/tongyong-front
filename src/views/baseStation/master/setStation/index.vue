<template>
  <div class="app-container list-container">
    <div class="container-box condition-box">
      <el-autocomplete
        class="baseStation__input"
        v-model="projectName"
        :fetch-suggestions="querySearch"
        placeholder="请搜索项目"
        @select="handleSelect"
      ></el-autocomplete>
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
          <el-table-column label="工程名称" :show-overflow-tooltip="true" prop="projectName"></el-table-column>
          <el-table-column label="设备名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
          <el-table-column label="黑匣子编号" :show-overflow-tooltip="true" prop="deviceNo"></el-table-column>
          <el-table-column label="制造厂家" prop="manufactor"></el-table-column>
          <el-table-column label="规格型号" prop="specification"></el-table-column>
          <el-table-column label="GPRS" prop="gprs"></el-table-column>
          <el-table-column label="每秒耗电量(千瓦时)" prop="dissipation" width="130px"></el-table-column>
          <el-table-column label="位置" prop="placePoint" width="150px"></el-table-column>
          <el-table-column label="在线状态" prop="isOnline" :formatter="handleSIsOnline"></el-table-column>
          <el-table-column label="状态" prop="status" :formatter="handleStatus"></el-table-column>
          <el-table-column label="采集器编号" prop="collecterNo"></el-table-column>
          <el-table-column label="采集器状态" prop="isOnlineCollecter" :formatter="handleSIsOnline"></el-table-column>
          <el-table-column label="互感系数" prop="ratio"></el-table-column>
          <el-table-column label="创建日期" prop="createTime" :formatter="handleDate" width="90px"></el-table-column>
          <el-table-column label="创建人" prop="createUserName" :width="userWidth"></el-table-column>
          <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
            <template slot-scope="scope">
              <rightButton
                :operationPrex="operationPrex"
                :disUpdate="scope.row.status=='1'?true:false"
                :disDelete="scope.row.status=='1'?true:false"
                @clickView="handleView"
                @clickUpdate="handleUpdate"
                @clickDelate="handleDelete"
                :row="scope.row"
              ></rightButton>
            </template>
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
    <detailsDialog
      v-if="visible"
      :visible.sync="visible"
      @close="closeDialog"
      :activeCode="activeCode"
      :routeType="detailsType"
      :detailsId="detailsId"
    ></detailsDialog>
  </div>
</template>

<script>
import { getMapsByProjectIdApi, getProjectsApi } from "../../api/setting.js";
export default {
  data() {
    return {
      keyword: "",
      projectName: "",
      projectId: "",
      projectNames: []
    };
  },
  methods: {
    //获取项目
    getProjects() {
      getProjectsApi().then(res => {
        this.projectNames = [];
        res.forEach(el => {
          this.projectNames.push({
            value: el.name,
            address: el.address,
            id: el.id
          });
        });
      });
    },
    querySearch(queryString, cb) {
      var projectNames = this.projectNames;
      var results = queryString
        ? projectNames.filter(this.createFilter(queryString))
        : projectNames;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return projectName => {
        return (
          projectName.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      this.projectId = item.id;
      this.getMapsByProjectId(item.id);
    },
    //默认查询
    // handleSearch() {
    //   this.getListData();
    // },
    getMapsByProjectId(id) {
      getMapsByProjectIdApi({
        projectId: id
      }).then(res => {
      });
    }
  },
  mounted() {
    this.getProjects();
  }
};
</script>

<style lang="scss">
</style>

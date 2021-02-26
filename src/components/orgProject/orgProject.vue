<template>
  <div class="list-container">
    <div class="container-box list-box">
      <div class="table-box">
        <el-row>
          <el-col :span="8">
            <el-tree
              :default-expand-all="true"
              ref="tree"
              :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
            ></el-tree>
          </el-col>
          <el-col :span="16">
            <el-table
              size="small"
              ref="table"
              :data="listData"
              style="width: 100%"
              @row-click="getRow"
              highlight-current-row
              header-row-class-name="xyTableHeader"
            >
              <el-table-column type="index" :width="indexWidth"></el-table-column>
              <el-table-column label="工程名称" :show-overflow-tooltip="true" prop="name"></el-table-column>
              <el-table-column label="状态" prop="status" :formatter="getStatus"></el-table-column>
              <el-table-column label="项目类别" prop="type" :formatter="getType"></el-table-column>
              <el-table-column label="项目区域" prop="positionName"></el-table-column>
              <el-table-column
                label="开工日期"
                prop="beginDate"
                :width="dateWidth"
                :formatter="dateChange"
              ></el-table-column>
              <el-table-column label="建设单位" :show-overflow-tooltip="true" prop="constructionUnit"></el-table-column>
              <el-table-column label="施工单位" prop="builderName"></el-table-column>
              <el-table-column label="项目经理" prop="manager"></el-table-column>
              <el-table-column
                label="创建日期"
                :width="dateWidth"
                prop="createTime"
                :formatter="changeDate"
              ></el-table-column>
              <el-table-column label="创建人" :width="userWidth" prop="createUserName"></el-table-column>
            </el-table>
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
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="details-footer" style="text-align:right;margin-right:100px;">
      <el-button size="small" @click="handleCancel">取 消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">保 存</el-button>
    </div>
  </div>
</template>

<script>
import {
  selectOrganizationInfo,
  getPorject
} from "@/views/api/equipmentApi.js";
export default {
  data() {
    return {
      listData: [],
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      data: [],
      defaultProps: {
        label: "name",
        children: "children"
      },
      orgId: "",
      rowData: ""
    };
  },
  computed: {
    params() {
      let param = {
        body: {
          orgId: this.orgId
        },
        pageNum: this.pageIndex,
        pageSize: this.pageSize
      };
      return param;
    }
  },
  mounted() {
    this.getOrgTree();
    this.getListData();
  },
  methods: {
    //查询list列表
    getOrgTree() {
      selectOrganizationInfo({}).then(res => {
        this.data = res.data;
      });
    },
    getListData() {
      getPorject(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
      });
    },
    handleCancel: function() {
      this.$emit("setShow", { sign: "关闭组织工程" });
    },
    handleSubmit: function() {
      this.$emit("setShow", { sign: "关闭组织工程", data: this.rowData });
    },
    handleNodeClick: function(node) {
      this.orgId = node.id;
      this.getListData();
    },
    //状态格式化
    getType: function(row) {
      if (row.type == 1) {
        return "房建";
      } else if (row.type == 2) {
        return "市政";
      }
    },
    getStatus: function(row) {
      if (row.status == 0) {
        return "未审批";
      } else if (row.status == 1) {
        return "已审批";
      } else {
        return "";
      }
    },
    //日期格式化
    changeDate: function(row) {
      let date = row.createTime;
      return this.$moment(date).format("YYYY-MM-DD");
    },
    //日期格式化
    dateChange: function(row) {
      let date = row.beginDate;
      return this.$moment(date).format("YYYY-MM-DD");
    },
    //改变页面显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //改变页数
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    getRow: function(row) {
      this.rowData = row;
    }
  }
};
</script>

<style>
</style>

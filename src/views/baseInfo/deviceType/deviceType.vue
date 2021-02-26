<template>

  <div class="app-container list-container">
    <div class="container-box condition-box">
      <div class="conditionBar">
        <el-form :inline="true" class="condition-form">
          <topButton @clickInsert="handleInsert" @clickDelate="handleDelete" :sels="sels" :operationPrex="operationPrex" check="callTimes=1"></topButton>
        </el-form>
      </div>
    </div>

    <div class="container-box list-box">
      <div class="table-box">
        <el-table size="small" :data="listData" style="width: 100%" height="100%" highlight-current-row @selection-change="listSelectionChange" header-row-class-name="xyTableHeader">
          <el-table-column type="selection" :width="selectionWidth"></el-table-column>
          <el-table-column type="index" :width="indexWidth"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="备注" :show-overflow-tooltip="true" prop="comments"></el-table-column>
          <el-table-column label="创建日期" :width="dateWidth" prop="createTime" :formatter="changeDate"></el-table-column>
          <el-table-column label="创建人" :width="userWidth" prop="createUserName"></el-table-column>
          <el-table-column label="操作" :width="operateWidth" align="center" fixed="right">
            <template slot-scope="scope">
              <rightButton @clickView="handleView" @clickUpdate="handleUpdate" @clickDelate="handleDelete" :row="scope.row" :operationPrex="operationPrex" :disDelete="scope.row.callTimes>0?true:false"></rightButton>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="pageSizes" :page-size="pageSize" :total="pageTotal" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <el-dialog :title="this.title" :visible.sync="deviceDetailVisible" :close-on-click-modal="false" width="50%" v-if="deviceDetailVisible">
      <device-type-detail @setShow="setShow" :edit="this.edit" :openType="this.openType" :id="this.id"></device-type-detail>
    </el-dialog>
  </div>
</template>

<script>
import {getDeviceType,deleteDeviceTypes} from '@/views/api/equipmentApi.js';
import DeviceTypeDetail from './deviceTypeDetail';

export default {
  data() {
    return {
      listData: [],
      isDangerous: '',
      keyword: '',
      pageIndex: 1,
      pageSizes: [10, 20, 30],
      pageSize: 10,
      pageTotal: 0,
      sels: [],
      title : '',
      deviceDetailVisible : false,
      edit : false,
      openType : '',
      id : '',
      operationPrex : 'project:device'
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
      this.pageIndex = 1;
      this.getListData();
    },
    //获取列表
    getListData() {
      getDeviceType(this.params).then(res => {
        this.listData = res.data.list;
        this.pageTotal = Number(res.data.total);
        if (this.pageTotal == 0 && this.pageIndex > 1) {
          this.pageIndex--;
          this.getListData();
        }
      });
    },
    //切换页面显示条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.getListData();
    },
    //切换页数
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getListData();
    },
    //勾选复选框给sels赋值
    listSelectionChange(sels) {
      this.sels = sels;
    },
    //删除
    handleDelete(sels) {
      this.$confirm("确认删除选中记录吗？","提示", {type: "warning"}).then(() => {
        let ids = sels.map(item => item.id);
        let para = {
          ids : ids
        };
        deleteDeviceTypes(para).then((res) => {
          if(res.code == 200) {
            this.$message({
              type : 'success',
              message : res.message
            });
            this.getListData();
          }
        });
      });
    },
    //点击查看按钮弹出详情页
    handleView(row) {
      this.edit = true;
      this.title = "查看";
      this.deviceDetailVisible = true;
      this.openType = "view";
      this.id = row.id;
    },
    //点击编辑按钮弹出详情页
    handleUpdate(row) {
      this.edit = false;
      this.title = "编辑";
      this.deviceDetailVisible = true;
      this.openType = "update";
      this.id = row.id;
    },
    //点击新增按钮弹出详情页
    handleInsert() {
      this.edit = false;
      this.title = "新增";
      this.deviceDetailVisible = true;
      this.openType = "insert";
    },
    //时间格式化
    changeDate : function(row) {
      let date = row.createTime;
      return this.$moment(date).format('YYYY-MM-DD');
    },
    //子组件向父组件传值
    setShow : function(data) {
      if(data.sign == '关闭设备类型信息') {
        this.deviceDetailVisible = false;
        this.getListData();
      }
    }
  },
  components : {
    DeviceTypeDetail
  }
};
</script>

<style lang="scss" scoped>
</style>

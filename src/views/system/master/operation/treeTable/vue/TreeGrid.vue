<template>
    <section>
        <el-table v-loading="listLoading" size="small" :data="data" border :highlight-current-row="true" style="width: 100%;" :row-style="showTr">

            <el-table-column prop="name" label="类别名称" width="200" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="spaceIconShow(0)" v-for="(space, levelIndex) in scope.row._level" :key="levelIndex" class="ms-tree-space"></span>
                    <button class="button is-outlined is-primary is-small" v-if="toggleIconShow(0,scope.row)" @click="toggle(scope.$index)">
                        <i v-if="!scope.row._expanded" class="el-icon-arrow-right" aria-hidden="true"></i>
                        <i v-if="scope.row._expanded" class="el-icon-arrow-down" aria-hidden="true"></i>
                    </button>
                    <button class="button is-outlined is-primary is-small" v-if="!toggleIconShow(0,scope.row)">
                    </button>
                    <span class="ms-tree-space"></span>
                    {{scope.row['name']}}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" mini-width="100" :formatter="flagShow"></el-table-column>
            <el-table-column prop="status" label="状态" :show-overflow-tooltip="true" mini-width="0" v-if="false"></el-table-column>
            <el-table-column prop="level" label="深度" :show-overflow-tooltip="true" mini-width="80" :formatter="deepShow"></el-table-column>
            <el-table-column prop="url" label="链接地址" :show-overflow-tooltip="true" width="150"></el-table-column>
            <el-table-column prop="permission" label="权限字符" :show-overflow-tooltip="true" width="250"></el-table-column>
            <el-table-column prop="comments" label="描述" :show-overflow-tooltip="true" width="0" v-if="false"></el-table-column>
            <el-table-column prop="parentId" label="上级Id" width="0" v-if="false"></el-table-column>
            <el-table-column prop="id" label="id" width="0" v-if="false"></el-table-column>
            <el-table-column label="操作" v-if="treeType === 'normal'" width="340" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <el-button type="success" size="small" plain icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button icon="el-icon-delete" plain size="small" type="danger" @click="handleDel(scope.$index, scope.row)">
                        删除
                    </el-button>
                    <el-button type="primary" size="small" plain icon="el-icon-plus" v-if="(scope.row.level <= 3 &amp;&amp; scope.row.type==0) || (scope.row.level<=2 &amp;&amp; scope.row.type==1) || (scope.row.level<=2 &amp;&amp; scope.row.type==2)" @click="handleAdd(scope.$index, scope.row)">
                        新增下级节点
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false" width="50%">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="类型" prop="type">
                    <template>
                        <el-radio :disabled="true" v-model="addForm.type" label="0">PC端菜单</el-radio>
                        <el-radio :disabled="true" v-model="addForm.type" label="1">APP端菜单</el-radio>
                        <el-radio :disabled="true" v-model="addForm.type" label="2">WEB端菜单</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="editForm.name" :maxlength="40" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限字符" prop="permission">
                    <el-input v-model="editForm.permission" :maxlength="100" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接地址" prop="url">
                    <el-input v-model="editForm.url" :maxlength="100" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="comments">
                    <el-input type="textarea" v-model="editForm.comments" :maxlength="200" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="深度标识" prop="level" v-show="false">
                    <el-input v-model="editForm.level" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父节点" prop="parentId" v-show="false">
                    <el-input v-model="editForm.parentId" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editcancel">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false" width="50%">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="类型" prop="type">
                    <template>
                        <el-radio :disabled="true" v-model="addForm.type" label="0">PC端菜单</el-radio>
                        <el-radio :disabled="true" v-model="addForm.type" label="1">APP端菜单</el-radio>
                        <el-radio :disabled="true" v-model="addForm.type" label="2">WEB端菜单</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="资源类型" prop="sourceType" v-if="sourceShow">
                    <el-select v-model="addForm.sourceType" placeholder="资源类型" :clearable="true">
                        <el-option v-for="item in sourceTypeList" :label="item.label" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称" prop="name">
                    <el-input v-model="addForm.name" :maxlength="40" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限字符" prop="permission">
                    <el-input v-model="addForm.permission" :maxlength="100" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="链接地址" prop="url">
                    <el-input v-model="addForm.url" :maxlength="100" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="comments">
                    <el-input type="textarea" v-model="addForm.comments" :maxlength="200" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="深度标识" prop="level" v-show="false">
                    <el-input v-model="addForm.level" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父节点" prop="parentId" v-show="false">
                    <el-input v-model="addForm.parentId" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addcancel">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>
<script>
import Utils from "../utils/index.js";
import {
    selectTreeOperation,
    getOperationById,
    insertOperation,
    updateOperation,
    deleteOperations
} from "@/views/system/api/systemApi.js";

//  import Vue from 'vue'
export default {
    name: "tree-grid",
    props: {
        // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
        treeStructure: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 这是相应的字段展示
        columns: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 这是数据源
        dataSource: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
        requestUrl: {
            type: String,
            default: function() {
                return "";
            }
        },
        // 这个是是否展示操作列
        treeType: {
            type: String,
            default: function() {
                return "normal";
            }
        },
        // 是否默认展开所有树
        defaultExpandAll: {
            type: Boolean,
            default: function() {
                return false;
            }
        }
    },
    data() {
        return {
            openTlg: "", //选择器从哪里打开  add  edit
            clickIcon: "", //点击的icon
            openIcon: false, //是否打开icon选择器
            showIcon: false, //是否显示选择icon
            editFormVisible: false, //编辑界面是否显示
            editLoading: false,
            listLoading: false,
            editFormRules: {
                permission: [
                    {
                        required: true,
                        message: "请输入权限字符",
                        trigger: "blur"
                    }
                ],
                name: [
                    { required: true, message: "请输入名称", trigger: "blur" }
                ]
                //soSort: [{required: true, message: '请输入本层序号', trigger: 'blur' }]
            },
            //编辑界面数据
            editForm: {
                name: "",
                permission: "",
                url: "",
                commonts: "",
                level: 1,
                type: 0,
                parentId: 0,
                sourceType : ""
            },
            addFormVisible: false, //新增界面是否显示
            addLoading: false,
            addFormRules: {
                permission: [
                    {
                        required: true,
                        message: "请输入权限字符",
                        trigger: "change"
                    }
                ],
                name: [
                    { required: true, message: "请输入名称", trigger: "change" }
                ]
            },
            //新增界面数据
            addForm: {
                name: "",
                permission: "",
                url: "",
                commonts: "",
                level: 1,
                type: 0,
                parentId: 0,
                sourceType : ""
            },
            sourceTypeList : [
                {value : 1,label : '模块'},
                {value : 2,label : '页面'}
            ],
            sourceShow : false
        };
    },
    computed: {
        // 格式化数据源
        data: function() {
            let me = this;
            if (me.treeStructure) {
                let data = Utils.MSDataTransfer.treeToArray(
                    me.dataSource,
                    null,
                    null,
                    me.defaultExpandAll
                );
                return data;
            }
            return me.dataSource;
        },
        addParams() {
            let param = {
                body: this.addForm
            };
            return param;
        }
    },
    methods: {
        addcancel() {
            this.$confirm("新增内容将不被保存，是否确认取消？", "提示", {
                type: "warning"
            }).then(() => {
                this.addFormVisible = false;
            });
        },
        editcancel() {
            this.$confirm("修改内容将不被保存，是否确认取消？", "提示", {
                type: "warning"
            }).then(() => {
                this.editFormVisible = false;
            });
        },
        //删除
        handleDel: function(index, row) {
            this.$confirm("确认删除选中记录吗?", "提示", {
                type: "warning"
            })
                .then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let ids = [];
                    function pushId(obj) {
                        ids.push(obj.id);
                        if (obj.children) {
                            obj.children.forEach(el => {
                                pushId(el);
                            });
                        }
                    }
                    pushId(row);
                    let para = { ids: ids };
                    deleteOperations(para).then(res => {
                        this.listLoading = false;
                        if (res.code == 200) {
                            this.$message({
                                message: res.message,
                                type: "success"
                            });
                            this.$emit("setShow",{sign : "关闭详情"});
                        } else {
                            this.$message({
                                message: res.message,
                                type: "error"
                            });
                        }
                    });
                })
                .catch(() => {});
        },
        //显示编辑界面
        handleEdit: function(index, row) {
            this.addForm.type = row.type;
            this.editFormVisible = true;
            let para = { id: row.id };
            //NProgress.start();
            getOperationById(para).then(res => {
                this.editFormVisible = true;
                this.editForm = res.data;
            });
        },
        //编辑
        editSubmit: function() {
            this.$refs.editForm.validate(valid => {
                if (valid) {
                    this.$confirm("确认保存吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        this.editLoading = true;
                        let para = {
                            body : Object.assign({}, this.editForm)
                        };
                        para.children = [];
                        para._parent = null;
                        updateOperation(para).then(res => {
                            this.editLoading = false;
                            if (res.code == 200) {
                                this.$message({
                                    message: res.message,
                                    type: "success"
                                });
                                this.$refs["editForm"].resetFields();
                                this.editFormVisible = false;
                                this.$emit("setShow",{sign : "关闭详情"});
                            }else {
                               this.$message({
                                    message: res.message,
                                    type: "error"
                                }); 
                            }
                        });
                    });
                }
            });
        },
        //显示新增界面
        handleAdd: function(index, row) {
            this.addForm.type = row.type;
            this.addFormVisible = true;
            if ((row.level == 1 && row.type != 1) || row.level == 0) {
                this.showIcon = true;
            } else {
                this.showIcon = false;
            }
            if (row.level == 2 && row.type == 2) {
                row.level = parseInt(row.level) + 1;
            }
            if(row.level == 2) {
                this.sourceShow = true;
            }else {
                this.sourceShow = false;
            }
            this.addForm = {
                parentId: row.id,
                level: parseInt(row.level) + 1,
                type: row.type
            };
        },
        //新增
        addSubmit: function() {
            if(this.addForm.sourceType != '' && this.addForm.sourceType != undefined) {
                this.addForm.level = this.addForm.sourceType + 1;
            }
            this.$refs.addForm.validate(valid => {
                if (valid) {
                    this.$confirm("确认保存吗？", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }).then(() => {
                        let method = insertOperation(this.addParams);
                        method.then((res) => {
                            if(res.code == 200) {
                                this.$message({
                                    type : 'success',
                                    message : res.message
                                });
                                this.$refs["addForm"].resetFields();
                                this.addFormVisible = false;
                                this.$emit('setShow',{sign : "关闭详情"});
                            }else {
                                this.$message({
                                    message: res.message,
                                    type: "error"
                                }); 
                            }
                        });
                    });
                }
            });
        },
        deepShow(row, column) {
            let s = "";
            switch (row.level) {
                case 1:
                    s = "主菜单";
                    break;
                case 2:
                    s = "模块菜单";
                    break;
                case 3:
                    s = "功能菜单";
                    break;
                case 4:
                    s = "动作";
                    break;
                default:
                    s = "分类";
                    break;
            }
            return s;
        },
        flagShow(row, column) {
            if (row.type == 0) {
                return "PC端菜单";
            }
            if (row.type == 1) {
                return "APP端菜单";
            }
            if (row.type == 2) {
                return "WEB端菜单";
            }
        },

        // 显示行 （element-ui升级版本后bug修改）
        showTr: function(row, index) {
            let show = row.row._parent ? row.row._parent._expanded : true;
            row._show = show;
            return show ? "" : "display:none;";
        },
        // 展开下级
        toggle: function(trIndex) {
            let me = this;
            let record = me.data[trIndex];
            record._expanded = !record._expanded;
            if (
                !record._expanded &&
                record.children &&
                record.children.length > 0
            ) {
                this.closeOpen(record);
            }
        },
        closeOpen: function(record) {
            //判断是否存在子集
            if (
                !record._expanded &&
                record.children &&
                record.children.length > 0
            ) {
                for (let i = 0; i < record.children.length; i++) {
                    let rchild = record.children[i];
                    rchild._expanded = false;
                    this.closeOpen(rchild);
                }
            }
        },
        // 显示层级关系的空格和图标
        spaceIconShow(index) {
            let me = this;
            if (me.treeStructure && index === 0) {
                return true;
            }
            return false;
        },
        // 点击展开和关闭的时候，图标的切换
        toggleIconShow(index, record) {
            let me = this;
            if (
                me.treeStructure &&
                index === 0 &&
                record.children &&
                record.children.length > 0
            ) {
                return true;
            }
            return false;
        }
    }
};
</script>
<style scoped>
.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: "Glyphicons Halflings";
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
}
.ms-tree-space::before {
    content: "";
}
table td {
    line-height: 26px;
}
</style>
<style scoped lang="scss">
.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: "Glyphicons Halflings";
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    font-size: 1px;
    width: 5px;
    height: 5px;
}
.ms-tree-space::before {
    content: "";
}
table {
    td {
        line-height: 26px;
        .button {
            border: none;
            background: transparent;
            outline: none;
        }
        .alignRight {
            display: inline-block;
            width: 100%;
            text-align: right;
        }
    }
}
</style>

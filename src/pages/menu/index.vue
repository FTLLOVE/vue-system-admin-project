<template>
  <div class="container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="菜单名称">
        <el-input v-model="searchForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" clearable>
          <el-option label="正常" value="1"></el-option>
          <el-option label="失效" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch" size="mini">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" icon="el-icon-refresh" @click="handleReset" size="mini">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" icon="el-icon-plus" @click="handleShowDialog" size="mini">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
       :data="menuList"
       tooltip-effect="dark"
       row-key="id"
       :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="菜单名称" prop="name"></el-table-column>
      <el-table-column label="图标" prop="icon"></el-table-column>
      <el-table-column label="排序" prop="sort"></el-table-column>
      <el-table-column label="路径" prop="url"></el-table-column>
      <el-table-column label="是否可见">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.status === 1">可见</el-tag>
          <el-tag type="danger" v-else>不可见</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="create_time"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
             size="mini"
             plain
             type="primary"
             @click="handleRoleEdit(scope.$index, scope.row)"
          >编辑
          </el-button>
          <el-button
             size="mini"
             plain
             type="danger"
             v-show="scope.row.status === 1"
             @click="handleStatus(scope.$index, scope.row)"
          >删除
          </el-button>
          <el-button
             size="mini"
             plain
             type="warning"
             v-show="scope.row.status === 0"
             @click="handleStatus(scope.$index, scope.row)"
          >恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增&编辑模态框 -->
    <el-dialog :title="title" :visible.sync="isVisible" @close="handleCancel">
      <el-form :model="form" label-width="100px" :rules="rules" ref="refForm">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="pid">
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" class="input-wrapper"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <div class="input-wrapper">
            <el-radio v-model="form.status" label="1">正常</el-radio>
            <el-radio v-model="form.status" label="0">失效</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="菜单权限" prop="menuIds">
          <el-tree
             :data="menuList"
             show-checkbox
             node-key="id"
             :props="defaultProps"
             :default-checked-keys="form.menuIds"
             ref="tree"
             highlight-current
          ></el-tree>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注信息" type="textarea" style="width: 70%"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchMenuList,
  fetchAddMenu,
  fetchUpdateMenuStatus,
  fetchUpdateMenu,
  fetchMenuDetail
}
  from '@/api/menu'
// import TreeSelect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: "menuC",
  data() {
    return {
      menuList: [],
      searchForm: {
        name: "",
        status: "",
        page: 0,
        size: 10
      },
      form: {
        pid: '',
        name: '',
        icon: '',
        sort: '',
        status: '1',
        url: '',
        remark: ''
      },
      isVisible: false,
      title: '',
      rules: {
        pid: [
          {required: true, message: '父菜单不能为空', trigger: true}
        ],
        name: [
          {required: true, message: '菜单名称不能为空', trigger: true}
        ],
        icon: [
          {required: true, message: '图标不能为空', trigger: true}
        ],
        url: [
          {required: true, message: '路径不能为空', trigger: true}
        ]
      }
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // 获取菜单列表
    async getMenuList() {
      await fetchMenuList(this.searchForm)
         .then(res => {
           if (res.code === 200 && res.data) {
             this.menuList = res.data
           } else {
             this.menuList = []
           }
         })
    },
    // 获取菜单详情
    async getMenuDetail(id) {
      await fetchMenuDetail({id})
         .then(res => {
           if (res.code === 200) {
             this.form = res.data
           } else {
             this.$message.error(res.message)
           }
         })
    },
    // 搜索
    handleSearch() {
      this.searchForm.page = 0
      this.getMenuList()
    },
    // 重置
    handleReset() {
      this.searchForm = {
        name: '',
        status: '',
        page: 0,
        size: 10
      }
      this.getMenuList()
    },
    // 新增弹框
    handleShowDialog() {
      this.scene = "add";
      this.title = "新增菜单";
      this.isVisible = true;
    },
    // 编辑
    handleRoleEdit(index, row) {
    },
    // 更新菜单状态
    handleStatus(index, row) {
      this.$confirm(
         `确定${row.status === 0 ? "恢复" : "删除"}菜单名称是: ${row.username} ?`,
         "提示"
      )
         .then(async () => {
           await fetchUpdateMenuStatus({
             id: row.id,
             status: row.status === 0 ? 1 : 0,
           }).then((res) => {
             if (res.code === 200) {
               this.getMenuList();
               this.$message.success(
                  `${row.status === 0 ? "恢复成功" : "删除成功"}`
               );
             } else {
               this.$message.error(
                  `${row.status === 0 ? "恢复失败" : "恢复成功"}`
               );
             }
           });
         })
         .catch(() => {
         });
    },
    // 取消
    handleCancel() {
      this.isVisible = false
      this.$refs['refForm'].resetFields()
    }
  },
}
</script>

<style scoped>
</style>

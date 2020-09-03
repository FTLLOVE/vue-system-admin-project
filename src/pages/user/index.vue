<template>
  <div class="container">
    <el-row>
      <el-col :span="4">
        <el-tree
          class="filter-tree"
          :data="treeData"
          default-expand-all
          ref="tree"
          :props="defaultProps"
          @node-click="handleDepartmentClick"
        ></el-tree>
      </el-col>
      <el-col :span="20">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="searchForm.telephone" clearable></el-input>
          </el-form-item>

          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder clearable>
              <el-option label="有效" value="1"></el-option>
              <el-option label="无效" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch" size="mini">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="warning" icon="el-icon-refresh" @click="handleReset" size="mini">重置</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="success" icon="el-icon-plus" @click="handleAdd" size="mini">新增</el-button>
          </el-form-item>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="userList"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="username" label="用户名" width="80"></el-table-column>
          <el-table-column prop="telephone" label="手机号" width="100"></el-table-column>
          <el-table-column label="性别">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.sex === 0" type="danger">未知</el-tag>
              <el-tag v-else-if="scope.row.sex === 1">男</el-tag>
              <el-tag v-else type="info">女</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="department.department_name" label="部门"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="120"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" type="danger">无效</el-tag>
              <el-tag v-else type="success">有效</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="160"></el-table-column>
          <el-table-column prop="update_time" label="更新时间" width="160"></el-table-column>
          <el-table-column label="操作" width="220">
            <template>
              <el-button size="mini" plain type="primary">编辑</el-button>
              <el-button size="mini" plain type="danger">删除</el-button>
              <el-button size="mini" plain type="warning">重置</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="searchForm.page"
            :page-size="searchForm.size"
            layout="total, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { fetchUserList } from "../../api/user";
import { fetchDepartmentList } from "../../api/department";
export default {
  name: "user",
  data() {
    return {
      userList: [],
      total: 0,
      searchForm: {
        username: "",
        telephone: "",
        department_id: "",
        status: "",
        page: 0,
        size: 10,
      },
      treeData: [
        {
          id: 0,
          department_name: "舜启网络科技",
          children: [],
        },
      ],
      defaultProps: {
        label: "department_name",
        children: "children",
      },
      addForm: {
        username: "",
        department_id: 0,
        telephone: "",
        email: "",
        sex: 0,
        remark: "",
        status: 1,
        nickname: "",
        post_id: 0,
        roleIds: [],
      },
      updateForm: {
        id: 1,
        username: "张三",
        department_id: 1,
        telephone: "15850791686",
        email: "111@qq.com",
        sex: 1,
        remark: "",
        password: "",
        status: 1,
        nickname: "",
        post_id: 1,
        roleIds: [1, 2, 3],
      },
    };
  },
  created() {
    this.getUserList();
    this.getDepartmentList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      await fetchUserList(this.searchForm).then((res) => {
        if (res.code === 200 && res.data.data && res.data.data.length !== 0) {
          this.userList = res.data.data;
          this.total = res.data.total;
        } else {
          this.userList = [];
          this.total = 0;
        }
      });
    },
    // 搜索
    handleSearch() {
      this.page = 0;
      this.getUserList();
    },
    // 重置
    handleReset() {
      this.searchForm = {
        username: "",
        telephone: "",
        department_id: "",
        status: "",
        page: 0,
        size: 10,
      };
      this.getUserList();
    },
    // 页码变化
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getUserList();
    },
    // 复选框
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 选择项变化
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取部门列表
    async getDepartmentList() {
      await fetchDepartmentList().then((res) => {
        if (res.code === 200 && res.data.data && res.data.data.length !== 0) {
          let children = [];
          res.data.data.forEach((el) => {
            let o = {
              id: el.id,
              department_name: el.department_name,
            };
            children.push(o);
          });
          this.treeData[0].children = children;
        }
      });
    },
    // 部门搜索
    handleDepartmentClick(data, node, app) {
      if (data.id === 0) {
        this.searchForm.department_id = "";
        this.getUserList();
      } else {
        this.searchForm.department_id = data.id;
        this.getUserList();
      }
    },
    handleAdd() {
      console.log("add");
    },
  },
};
</script>

<style scoped>
</style>
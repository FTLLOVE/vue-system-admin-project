<template>
  <div class="container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="角色名称">
        <el-input v-model="searchForm.name" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.status" placeholder clearable>
          <el-option label="正常" value="1"></el-option>
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
        <el-button type="success" icon="el-icon-plus" @click="handleShowDialog" size="mini">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="roleList" tooltip-effect="dark">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="角色名称" width="80"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0" type="danger">失效</el-tag>
          <el-tag v-else type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="160"></el-table-column>
      <el-table-column prop="update_time" label="更新时间" width="160"></el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            @click="handleRoleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            v-show="scope.row.status === 1 ? true : false"
            @click="handleRoleStatus(scope.$index, scope.row)"
          >删除</el-button>
          <el-button
            size="mini"
            plain
            type="warning"
            v-show="scope.row.status === 0 ? true : false"
            @click="handleRoleStatus(scope.$index, scope.row)"
          >恢复</el-button>
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
  </div>
</template>

<script>
import {
  fetchRoleList,
  fetchAddRole,
  fetchUpdateRole,
  fetchRoleDetail,
  fetchUpdateRoleStatus,
} from "../../api/role";
import { fetchMenuList } from "../../api/menu";
export default {
  name: "role",
  data() {
    return {
      searchForm: {
        name: "",
        status: "",
        page: 0,
        size: 10,
      },
      roleList: [],
      total: 0,
      scene: "",
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      await fetchRoleList(this.searchForm).then((res) => {
        if (res.code === 200 && res.data.data && res.data.data.length !== 0) {
          this.roleList = res.data.data;
          this.total = res.data.total;
        } else {
          this.roleList = [];
          this.total = 0;
        }
      });
    },
    // 搜索
    handleSearch() {
      this.searchForm.page = 0;
      this.getRoleList();
    },
    // 重置
    handleReset() {
      this.searchForm = {
        name: "",
        status: "",
        page: 0,
        size: 10,
      };
      this.getRoleList();
    },
    // 页码变化
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getRoleList();
    },
    // 新增弹框
    handleShowDialog() {},
    // 编辑角色
    async handleRoleEdit(index, row) {
      await fetchRoleDetail({
        id: row.id,
      }).then((res) => {
        console.log(res);
      });
    },
    // 更新角色状态
    handleRoleStatus(index, row) {
      this.$confirm(
        `确定${row.status === 0 ? "恢复" : "删除"}角色名是: ${row.name} ?`,
        "提示"
      )
        .then(async () => {
          await fetchUpdateRoleStatus({
            id: row.id,
            status: row.status === 0 ? 1 : 0,
          }).then((res) => {
            if (res.code === 200) {
              this.getRoleList();
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
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
</style>
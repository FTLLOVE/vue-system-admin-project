<template>
  <div class="container">
    <el-form :model="searchForm" :inline="true">
      <el-form-item label="角色名称">
        <el-input v-model="searchForm.department_name" clearable></el-input>
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
    <el-table :data="departmentList">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="department_name" label="部门名称"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column prop="update_time" label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              plain
              type="primary"
              @click="handleEdit(scope.$index, scope.row)"
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
    <div class="pagination">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="searchForm.page"
          :page-size="searchForm.size"
          layout="total, prev, pager, next, jumper"
          :total="total"
      ></el-pagination>
    </div>

    <!-- 新增&编辑模态框 -->
    <el-dialog :title="title" :visible.sync="isVisible" @close="handleCancel">
      <el-form :model="form" label-width="100px" :rules="rules" ref="refForm">
        <el-form-item label="部门名称" prop="department_name">
          <el-input v-model="form.department_name" class="input-wrapper"/>
        </el-form-item>
        <el-form-item label="部门排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0" :max="10"></el-input-number>
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
  fetchDepartmentList,
  fetchDepartmentDetail,
  fetchAddDepartment,
  fetchUpdateDepartmentStatus,
  fetchUpdateDepartment,
} from "@/api/department";

export default {
  name: "department",
  data() {
    return {
      searchForm: {
        department_name: "",
        status: "",
        page: 0,
        size: 10,
      },
      departmentList: [],
      total: 0,
      form: {
        department_name: "",
        sort: 0,
      },
      isVisible: false,
      rules: {
        department_name: [
          {required: true, message: "部门名称不能为空", trigger: "blur"},
        ],
      },
      title: "",
      scene: "",
    };
  },
  created() {
    this.getDepartmentList();
  },
  methods: {
    // 获取部门列表
    async getDepartmentList() {
      await fetchDepartmentList(this.searchForm).then((res) => {
        if (res.code === 200 && res.data.data && res.data.data.length !== 0) {
          this.departmentList = res.data.data;
          this.total = res.data.total;
        } else {
          this.total = 0;
        }
      });
    },
    // 搜索
    handleSearch() {
      this.searchForm.page = 0;
      this.getDepartmentList();
    },
    // 重置
    handleReset() {
      this.searchForm = {
        department_name: "",
        status: "",
        page: 0,
        size: 10,
      };
      this.getDepartmentList();
    },
    // 新增弹框
    handleShowDialog() {
      this.scene = "add";
      this.title = "新增部门";
      this.isVisible = true;
    },
    // 编辑
    handleEdit(index, row) {
      this.scene = "edit";
      this.title = "编辑部门";
      this.isVisible = true;
      this.getDepartmentDetail(row.id);
      this.form.id = row.id;
    },
    // 获取部门详情
    async getDepartmentDetail(id) {
      await fetchDepartmentDetail({id}).then((res) => {
        if (res.code === 200) {
          this.form = res.data;
        }
      });
    },
    // 更新状态
    handleStatus(index, row) {
      this.$confirm(
          `确定${row.status === 0 ? "恢复" : "删除"}部门名称是: ${
              row.department_name
          } ?`,
          "提示"
      )
          .then(async () => {
            await fetchUpdateDepartmentStatus({
              id: row.id,
              status: row.status === 0 ? 1 : 0,
            }).then((res) => {
              if (res.code === 200) {
                this.getDepartmentList();
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
            this.$message.error(res.message);
          });
    },
    // 页码变化
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getDepartmentList();
    },
    // 取消
    handleCancel() {
      this.isVisible = false;
      this.$refs["refForm"].resetFields();
    },
    // 提交
    handleSubmit() {
      this.$refs["refForm"].validate((valid) => {
        if (valid) {
          this.params = {
            department_name: this.form.department_name,
            sort: this.form.sort,
          };
          // 新增部门
          if (this.scene === "add") {
            fetchAddDepartment(this.params).then((res) => {
              if (res.code === 200) {
                this.$message.success("新增成功");
                this.isVisible = false;
                this.$refs["refForm"].resetFields();
                this.getDepartmentList();
              } else {
                this.$message.error(res.message);
              }
            });
          } else {
            // 更新部门
            this.params.id = this.form.id;
            fetchUpdateDepartment(this.params).then((res) => {
              if (res.code === 200) {
                this.$message.success("更新成功");
                this.isVisible = false;
                this.$refs["refForm"].resetFields();
                this.getRoleList();
              } else {
                this.$message.error(res.message);
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
</style>

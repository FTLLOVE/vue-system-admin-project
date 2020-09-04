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
              <el-tag v-if="scope.row.sex === 1">男</el-tag>
              <el-tag v-else-if="scope.row.sex === 2" type="danger">女</el-tag>
              <el-tag v-else type="warning">未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="department.department_name" label="部门"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" type="danger">失效</el-tag>
              <el-tag v-else type="success">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="160"></el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                type="primary"
                @click="handleUserEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                @click="handleUserDelete(scope.$index, scope.row)"
              >删除</el-button>
              <el-button
                size="mini"
                plain
                type="warning"
                @click="handleResetPwd(scope.$index, scope.row)"
              >重置</el-button>
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

    <!-- 新增&编辑模态框 -->
    <el-dialog :title="title" :visible.sync="isVisible" @close="handleCancel">
      <el-form :model="form" label-width="100px" :rules="rules" ref="refForm" :inline="true">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" class="input-wrapper" />
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="form.telephone" class="input-wrapper" />
        </el-form-item>
        <el-form-item
          label="密码"
          v-show="this.scene ==='add' ? true : false"
          prop="password"
          :rules="this.scene === 'add' ? [{required: true, message: '密码不能为空', trigger: 'blur'}] :rules.password"
        >
          <el-input v-model="form.password" class="input-wrapper" type="password" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="form.sex" class="input-wrapper">
            <el-option label="未知" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department_id">
          <el-select v-model="form.department_id" class="input-wrapper">
            <el-option
              v-for="el in departmentList"
              :label="el.department_name"
              :value="el.id"
              :key="el.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="post_id">
          <el-select v-model="form.post_id" class="input-wrapper">
            <el-option v-for="el in postList" :label="el.post_name" :value="el.id" :key="el.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" class="input-wrapper" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <div class="input-wrapper">
            <el-radio v-model="form.status" label="1">正常</el-radio>
            <el-radio v-model="form.status" label="0">失效</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" class="input-wrapper" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="form.roles" class="input-wrapper" multiple>
            <el-option v-for="el in roleList" :label="el.name" :value="el.id" :key="el.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 3}"
            placeholder="请输入内容"
            v-model="form.remark"
            maxlength="100"
            show-word-limit
            style="width: 100%"
          ></el-input>
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
  fetchUserList,
  fetchAddUser,
  fetchDeleteUser,
  fetchUpdateUser,
  fetchUserDetail,
  fetchResetPassword,
} from "../../api/user";
import { fetchDepartmentList } from "../../api/department";
import { fetchRoleList } from "../../api/role";
import { fetchPostList } from "../../api/post";
export default {
  name: "user",
  inject: ["reload"],

  data() {
    return {
      userList: [],
      departmentList: [],
      roleList: [],
      postList: [],
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
      form: {
        username: "",
        department_id: "",
        telephone: "",
        email: "",
        sex: "",
        remark: "",
        status: "1",
        nickname: "",
        post_id: "",
        roles: [],
        password: "",
      },
      isVisible: false,
      title: "",
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        telephone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { min: 11, max: 11, message: "手机号不合法", trigger: "blur" },
        ],
        department_id: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        post_id: [
          { required: true, message: "岗位不能为空", trigger: "change" },
        ],
        email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }],
        sex: [{ required: true, message: "性别不能为空", trigger: "change" }],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],
        password: [
          { required: false, message: "状态不能为空", trigger: "blur" },
        ],
      },
      scene: "",
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
    // 获取用户详情
    async getUserDetail(id) {
      await fetchUserDetail({ id }).then((res) => {
        if (res.code === 200) {
          this.form = res.data;
          this.form.status = res.data.status.toString();
          this.form.sex = res.data.sex.toString();
          // 修改角色数组
          let newRoles = [];

          this.form.roles &&
            this.form.roles.forEach((el) => {
              newRoles.push(el.id);
            });

          this.form.roles = newRoles;
          console.log(this.form);
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
          this.departmentList = res.data.data;
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
      this.searchForm.department_id = data.id === 0 ? "" : data.id;
      this.searchForm.page = 1;
      this.getUserList();
    },
    // 获取角色列表
    async getRoleList() {
      await fetchRoleList().then((res) => {
        if (res.code === 200 && res.data.data && res.data.data.length !== 0) {
          this.roleList = res.data.data;
        }
      });
    },
    // 获取岗位列表
    async getPostList() {
      await fetchPostList().then((res) => {
        if (res.code === 200 && res.data.data && res.data.data.length !== 0) {
          this.postList = res.data.data;
        }
      });
    },
    // 新增
    async handleShowDialog() {
      this.title = "新增用户";
      this.scene = "add";
      this.isVisible = true;
      await this.getRoleList();
      await this.getPostList();
    },
    // 编辑
    async handleUserEdit(index, row) {
      this.title = "编辑用户";
      this.scene = "edit";
      this.isVisible = true;
      await this.getRoleList();
      await this.getPostList();
      await this.getUserDetail(row.id);
    },
    // 删除用户
    handleUserDelete(index, row) {
      this.$confirm(`确定要删除用户名是: ${row.username} ?`, "提示")
        .then(async () => {
          await fetchDeleteUser({
            id: row.id,
            status: 0,
          }).then((res) => {
            if (res.code === 200) {
              this.getUserList();
              this.$message.success(`删除成功`);
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {});
    },
    // 提交按钮
    handleSubmit() {
      this.$refs["refForm"].validate((valid) => {
        if (valid) {
          // 新增用户
          if (this.scene === "add") {
            fetchAddUser(this.form).then((res) => {
              if (res.code === 200) {
                this.$message.success("新增成功");
                this.isVisible = false;
                this.$refs["refForm"].resetFields();
                this.getUserList();
              } else {
                this.$message.error(res.message);
                return;
              }
            });
          } else {
            // 编辑保存用户
            fetchUpdateUser(this.form).then((res) => {
              if (res.code === 200) {
                this.$message.success("更新成功");
                this.isVisible = false;
                this.$refs["refForm"].resetFields();
                this.getUserList();
              } else {
                this.$message.error(res.message);
                return;
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    // 取消，关闭
    handleCancel() {
      this.isVisible = false;
      this.$refs["refForm"].resetFields();
    },
    // 重置密码
    handleResetPwd(index, row) {
      this.$prompt("请输入新密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputErrorMessage: "新密码不能为空",
        inputValidator: (val) => {
          if (!val) {
            return "新密码不能为空";
          }
        },
      })
        .then(async ({ value }) => {
          if (!value) {
            this.$message.error("新密码不能为空");
            return false;
          } else {
            await fetchResetPassword({
              id: row.id,
              password: value,
            }).then((res) => {
              if (res.code === 200) {
                this.$message.success("重置成功");
              }
            });
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
</style>
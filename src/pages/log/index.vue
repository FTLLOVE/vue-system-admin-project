<template>
  <div class="container">
    <el-form :inline="true" :model="searchForm">
      <el-form-item label="登录地点">
        <el-input v-model="searchForm.location" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch" size="mini">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" icon="el-icon-refresh" @click="handleReset" size="mini">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="multipleTable" :data="logList" tooltip-effect="dark">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="ip" label="IP"></el-table-column>
      <el-table-column prop="location" label="登录地点"></el-table-column>
      <el-table-column prop="create_time" label="创建时间"></el-table-column>
      <el-table-column prop="update_time" label="更新时间"></el-table-column>
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
import { fetchLogList } from "../../api/log";
export default {
  name: "login-log",
  data() {
    return {
      logList: [],
      total: 0,
      searchForm: {
        location: "",
        page: 0,
        size: 10,
      },
    };
  },
  created() {
    this.getLogList();
  },
  methods: {
    // 获取日志列表
    async getLogList() {
      await fetchLogList(this.searchForm).then((res) => {
        if (res.code === 200 && res.data.data && res.data.data.length !== 0) {
          this.logList = res.data.data;
          this.total = res.data.total;
        } else {
          this.logList = [];
          this.total = 0;
        }
      });
    },
    // 搜索
    handleSearch() {
      this.searchForm.page = 0;
      this.getLogList();
    },
    // 重置
    handleReset() {
      this.searchForm = {
        location: "",
        page: 0,
        size: 10,
      };
      this.getLogList();
    },
    // 页码切换
    handleCurrentChange(val) {
      this.searchForm.page = val;
      this.getLogList();
    },
  },
};
</script>

<style scoped>
</style>
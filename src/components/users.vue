<template>
  <!-- el-card小容器 可以理解为是div -->
  <el-card class="box">
    <!-- 面包屑 -->
    <!--
      首页
      用户管理
      用户列表
    -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框 -->
    <el-row class="searchBox">
      <el-col>
        <el-input
          @clear="getAllUsers()"
          clearable
          class="searchInput"
          placeholder="请输入内容"
          v-model="query"
        >
          <el-button @click="searchUser()" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="primary" @click="showDiaAddUser()">添加用户</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <!-- tableData是[{date:?,name:?,address:?}]
    el-table-column控制列
      label控制的是表头
      prop的值控制的是该列中每一行单元格的内容

    -->
    <!--
      id: 500
      username: "admin"
      email: "adsfad@qq.com"
      mobile: "12345678"
      create_time: 1486720211

      mg_state: true
      role_name: "主管"
    -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>

      <!-- 过滤器fmtdate
        1. v-bind:
        2. {{create_time|fmtdate}}
      -->
      <!-- 1. 思路 直接给prop赋值 不行 -->
      <!-- <el-table-column prop="create_time | fmtdate" label="创建日期" width="200"></el-table-column> -->
      <!-- 2. 思路  可以实现效果 但是error-->
      <!-- <el-table-column prop="create_time" label="创建日期" width="200">
        {{create_time|fmtdate}}
      </el-table-column>-->
      <!-- 3.
      前提: 单元格内容不是prop的值,
      3.1 给单元格内容外层加template
      3.2 给template设置slot-scope
      3.3 slot-scope的值 自动绑定为外层数据el-table :data="list"
      3.4 在template内部通过list.row 自动取出数组list中每个对象
      3.5 list.row.属性create_time
      注意: row是固定写法

      -->
      <el-table-column label="创建日期" width="200">
        <template slot-scope="scope">
          <!-- 内层 list.row 表示的是list的每个对象-->
          {{scope.row.create_time|fmtdate}}
        </template>
      </el-table-column>

      <el-table-column label="用户状态" width="120">
        <!-- 前提: 单元格内容是一个组件, 不是porp的值 -->
        <template slot-scope="scope">
          <!-- 内容 -->
          <el-switch
            @change="changeState(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button
            @click="showDiaEditUser(scope.row)"
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showMsgBox(scope.row)"
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            plain
          ></el-button>
          <el-button
            @click="showDiaSetRole(scope.row)"
            type="success"
            icon="el-icon-check"
            circle
            size="mini"
            plain
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 - 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 - 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 - 角色 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="formdata" label-position="left" label-width="80px">
        <el-form-item label="用户名">{{currUsername}}</el-form-item>
        <el-form-item label="角色">
          <!-- select+option
          v-model : 绑定表单元素
          1. input type="text"
          2. 其他表单元素(select+option)
          -->
          <!-- 特性
           1 . 默认显示请选择: 当v-model绑定的值和option的value值一样->显示label的值

           > 目的: 不希望显示请选择->希望显示对应的角色,比如主管->label->需要控制value

           希望显示的是主管(30) -> label主管->value等于30

           2. 当通过页面操作->当选中某个label,此时,v-model绑定的数据值 = 被选中的label的value值
          -->
          {{selectVal}}
          <el-select v-model="selectVal" placeholder="请选择角色名称">
            <el-option label="请选择" :value="-1"></el-option>
            <!-- 其余5个option是动态生成的 v-for-->
            <!-- 角色[30,31,34,39,40] -->
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="(item,i) in roles"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 搜索关键字
      query: "",
      // 分页功能->前提:接口必须支持分页->通过在接口url参数中类似page的参数名
      pagenum: 1,
      pagesize: 2,
      total: -1,

      list: [],
      // 对话框
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      // userId:-1,
      // 表单数据
      formdata: {
        // username	用户名称	不能为空
        // password	用户密码	不能为空
        // email	邮箱	可以为空
        // mobile	手机号	可以为空
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 下拉框使用的数据
      selectVal: -1,

      // 保存角色的数据
      roles: [],
      currUsername: "",
      // 要的是用户的id<-要用户<-
      currUserId: -1
    };
  },
  // ?
  // mounted(){}
  created() {
    this.getTableData();
  },
  methods: {
    // 分配角色 - 发送请求
    async setRole() {
      // 发送请求
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        // rid角色id
        rid: this.selectVal
      });
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleRole = false;
        this.$message.success(msg);
      }
    },
    // 分配角色 - 显示对话框
    async showDiaSetRole(user) {
      // console.log(user);

      // this.formdata = user;
      this.currUserId = user.id;

      this.currUsername = user.username;
      this.dialogFormVisibleRole = true;
      // 获取所有角色名称(5个)
      const res = await this.$http.get(`roles`);
      // console.log(res);
      const {
        meta: { msg, status },
        data
      } = res.data;
      if (status === 200) {
        this.roles = data;
        console.log(this.roles);
      }

      // 获取当前用户的角色id
      const res2 = await this.$http.get(`users/${user.id}`);
      console.log(res2);
      // const {
      //   meta: { msg2, status2 },
      //   data2
      // } = res2.data;
      // if (status2 === 200) {

      // 所有角色5个[每个角色有自己的id]
      // 用户信息中也有rid 角色rid
      //
      this.selectVal = res2.data.data.rid;
      // }
    },
    // 修改用户状态
    async changeState(user) {
      // console.log(user);

      // users/:uId/state/:type
      // uid->用户id
      // type->用户状态
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
      // console.log(res);
      const {
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.$message.success(msg);
      }
    },
    // 编辑 - 发送请求
    async editUser() {
      // 发送请求
      // id- >当前用户id -> 数据 -> 1.data中没有 2.方法没有合适的实参
      // 使用this.formdata 必须保证数据有值
      const res = await this.$http.put(
        `users/${this.formdata.id}`,
        this.formdata
      );
      // console.log(res);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false;
        // 更新表格
        this.getTableData();
      }
    },
    // 编辑- 显示对话框
    showDiaEditUser(user) {
      this.formdata = user;

      this.dialogFormVisibleEdit = true;
    },
    // 删除 - 弹出确认框 confirm
    showMsgBox(user) {
      // console.log(user);

      this.$confirm("是否把我删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送请求
          // :id -> 用户的id -> 数据来源?
          const res = await this.$http.delete(`users/${user.id}`);
          // console.log(res);
          const {
            meta: { msg, status }
          } = res.data;
          if (status === 200) {
            // 提示框
            this.$message.success(msg);
            // 更新表格
            this.pagenum = 1;
            this.getTableData();
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    // 添加用户 - 发送请求
    async addUser() {
      // 获取表单数据 发送请求
      const res = await this.$http.post(`users`, this.formdata);
      // console.log(res);

      // 关闭对话框
      this.dialogFormVisibleAdd = false;

      // 更新表格
      this.getTableData();
    },
    // 添加用户 - 显示对话框
    showDiaAddUser() {
      // 清空
      // this.formdata.username = "";
      this.formdata = {};
      this.dialogFormVisibleAdd = true;
    },
    // 清空时获取所有用户
    getAllUsers() {
      // 此时 query查询参数已经是''

      this.getTableData();
    },
    // 搜索用户
    searchUser() {
      // 输入框组件->在组件文本清空时->做一些事儿
      // query数据默认 ''
      this.pagenum = 1;
      this.getTableData();
    },
    // 分页相关的方法
    // 每页2条-> 每页4条 -> 按照4条发送请求

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagenum = 1;
      this.pagesize = val;
      this.getTableData();
    },
    // 当前1页 -> 点击2页 -> 获取第二页数据
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      // 根据新页码发送请求
      this.pagenum = val;
      this.getTableData();
    },
    async getTableData() {
      // query	查询参数	可以为空
      // pagenum	当前页码	不能为空
      // pagesize	每页显示条数	不能为空
      // 设置发送请求时的请求头-> axios库 ->找axios中有没有可以设置headers头部的API->看axios文档
      // const AUTH_TOKEN = localStorage.getItem('token');
      // // console.log(AUTH_TOKEN);
      // this.$http.defaults.headers.common["Authorization"]=AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        data,
        meta: { status, msg }
      } = res.data;
      if (status === 200) {
        this.total = data.total;
        this.list = data.users;
        // console.log(this.list);
      }
    }
  }
};
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>

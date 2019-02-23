<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <!-- 按钮 -->
    <el-button class="btn" type="primary">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 行列 -->
          <el-row class="level1" v-for="(item1,i) in scope.row.children" :key="item1.id">
            <el-col :span="4">
              <!-- 一级 -->
              <el-tag @close="deleRights(scope.row,item1)" type="danger" closable>
                {{item1.authName}}
              </el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="level2" v-for="(item2,i) in item1.children" :key="item2.id">
                <el-col :span="4">
                  <!-- 二级 -->
                  <el-tag @close="deleRights(scope.row,item2)" type="success" closable>
                    {{item2.authName}}
                  </el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <!-- 三级 -->
                  <el-tag @close="deleRights(scope.row,item3)" v-for="(item3,i) in item2.children" :key="item3.id" type="warning" closable>{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 用户没有权限处理效果 -->
          <el-row v-if="scope.row.children.length===0">
            <el-col>
              <span>未分配权限</span>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="160"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="200"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="200"></el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click="showDiaSetRights(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框-分配权限 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
      <!-- node-key：每个节点唯一标识，值来源于treedata中的key名 -->
      <el-tree ref="treeDom" :data="treedata" show-checkbox node-key="id" default-expand-all :default-checked-keys="arrCheck" :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      roles: [],
      dialogFormVisible: false,
      // 树形结构绑定的数据
      treedata: [],
      // 默认展开的数据[被展开节点的id]
      // arrExpand:[],
      // 默认选中的数据[被选中节点的id]
      arrCheck: [],
      // 配置选项
      defaultProps: {
        // label和children值（字符串）来源于树形结构绑定数据treedata中的key名，比如："label""
        label: "authName",
        children: "children"
      },
      currRoleId:-1
    };
  },
  created() {
    this.getRoles();
  },
  methods: {
    // 点×取消权限
    async deleRights(role, rights) {
      // console.log(role,rights);
      // roleId -> 角色id <- 角色
      // rithtId -> 权限id <- 权限
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      );
      // console.log(res);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        // 提示
        this.$message.success(msg);
        // 更新
        // this.getRoles();
        // 只更新当前角色的权限
        // console.log(data);
        role.children = data;
      }
    },
    // 打开√对话框
    async showDiaSetRights(role) {
      // this.currRoleId = role.id;
      // 获取所有的权限
      const res = await this.$http.get(`rights/tree`);
      // console.log(res);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.treedata = data; // treedata是所有的节点id

        // console.log(this.treedata);
        // const temp = [];
        // 预演->
        // this.treedata.forEach(item1=>{
        //   temp.push(item1.id);
        //   item1.children.forEach(item2=>{
        //     temp.push(item2.id);
        //     item2.children.forEach(item3=>{
        //       temp.push(item3.id);
        //     });
        //   });
        // });
        // console.log(temp);
        // this.arrExpand = temp;
        // 取出每一层节点的id -> arrExpand

        // 默认选中-> 全选节点+半选节点 ->arrCheck[全选节点id+半选节点id]
        // 获取树形结构中全选id->操作第三方组件->el-tree->组件API(attr和方法)----方法
        // getCheckedKeys
        // ?.getHalfCheckedNodes()-> 找？->该方法属于组件标签的方法el-tree的方法
        // eg:
        // document.getElementById("main").js方法()  // 把页面的标签标签变成一个dom元素
        // document.getElementById("tree")  --> 不行
        // 在js中调用组件标签的js方法 -> ref操作dom
        // 1.给要操作的页面元素el-tree设置ref="值"
        // 2.在js中通过this.$refs.ref的值.js方法
        // (把el-tree变成DOM元素的结果).getCheckedKeys();
        // this.$refs.treeDom.js方法
        // console.log(this.$refs);

        // 获取当前角色选中的节点id
        // console.log(this.$refs);
        // const arr1 = this.$refs.treeDom.getCheckedKeys();
        // console.log(arr1);

        // 获取树形结构中半选id
        // const arr2 = this.$refs.treeDom.getHalfCheckedNodes();
        // ES6展开操作运算符
        // this.arrCheck = [...arr1,...arr2];
        // console.log(this.arrCheck);
     
      }

       // 获取当前角色的权限
      const temp = [];
      role.children.forEach(item1 => {
        // temp.push(item1.id);
        item1.children.forEach(item2 => {
          // temp.push(item2.id);
          item2.children.forEach(item3 => {
            temp.push(item3.id);
          });
        });
      });
      // console.log(temp);
      this.arrCheck = temp;

      // role.children
      // const res2 = await this.$http.get(`roles`); // 文档角色列表
      // console.log(res2.data.data);

      this.dialogFormVisible = true;
    },
    // 获取角色
    async getRoles() {
      const res = await this.$http.get(`roles`);
      // console.log(res);
      this.roles = res.data.data;
      // console.log(this.roles);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
.level2 {
  margin-bottom: 10px;
}
</style>
// // 行列布局->for嵌套
// // 问题：请在控制台输出以下代码
//   *
//  * * 
// * * *
// // for 嵌套->外层3次 里层5次
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加
          </el-button>
          <el-input placeholder="请输入雇员姓名进行查找" style='width: 300px; margin-left:50px;'  v-model="searchkey" clearable v-on:keyup.enter.native="search">
            <el-button slot="append"  icon="el-icon-search" @click="search" ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <!-- <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          <span v-text="scope.row.userId"> </span>
        </template>
      </el-table-column> -->
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column align="center" prop="content" label="姓名" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.username}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="电话号码" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.phone}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="功能权限" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.roleName}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="数据权限" style="width: 100px;">
        <template slot-scope="scope"> <span>{{finddata(scope.row.employerin_d)}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="创建时间" style="width: 100px;">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="更新时间" style="width: 100px;">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageRow"
      :total="totalCount"
      :page-sizes="[5, 10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- create -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogCreateFormVisible">
      <el-form class="selectbox" :model="tempArticle" :rules="rules" ref="tempArticle" 
          label-position="left" label-width="100px" style='width: 300px; margin-left:50px;'>
        <el-form-item label="姓名" prop="username">
          <el-input type="text" v-model="tempArticle.username">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="tempArticle.password">
          </el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input type="text" v-model="tempArticle.phone">
          </el-input>
        </el-form-item>
        <el-form-item label="功能权限">
          <!-- <el-input type="text" v-model="tempArticle.employerin_f">
          </el-input> -->
           <select name="public-choice" v-model="tempArticle.employerin_f" style="width: 200px">                                        
              <option :value="role.roleId" v-for="role in ro_list" :key="role.roleId">{{role.roleName}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="数据权限">
          <!-- <el-input type="text" v-model="tempArticle.employerin_d">
          </el-input> -->
         <select name="public-choice" v-model="tempArticle.employerin_d" style="width: 200px">                                        
              <option :value="da_ro.id" v-for="da_ro in data_role" :key="da_ro.id">{{da_ro.name}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input type="text" v-model="tempArticle.idcard">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false">取 消</el-button>
        <el-button  type="success" @click="createArticle">创 建</el-button>
      </div>
    </el-dialog>
    <!-- xiugai -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="selectbox" :model="tempArticle" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="姓名" prop="username">
          <el-input type="text" v-model="tempArticle.username">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="text" v-model="tempArticle.password">
          </el-input>
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input type="text" v-model="tempArticle.phone">
          </el-input>
        </el-form-item>
        <el-form-item label="功能权限">
          <!-- <el-input type="text" v-model="tempArticle.employerin_f">
          </el-input> -->
          <select name="public-choice" v-model="tempArticle.employerin_f" style="width: 200px">                                        
              <option :value="role.roleId" v-for="role in ro_list" :key="role.roleId">{{role.roleName}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="数据权限">
          <!-- <el-input type="text" v-model="tempArticle.employerin_d">
          </el-input> -->
          <select name="public-choice" v-model="tempArticle.employerin_d" style="width: 200px">                                        
              <option :value="da_ro.id" v-for="da_ro in data_role" :key="da_ro.id">{{da_ro.name}}</option>                                    
          </select>
        </el-form-item>
        <!-- <el-form-item label="是否删除">
          <el-input type="text" v-model="tempArticle.deleteStatus">
          </el-input>
        </el-form-item> -->
        <!-- <el-form-item label="工作人员id">
          <el-input type="text" v-model="tempArticle.userId">
          </el-input>
        </el-form-item> -->
        <el-form-item label="身份证号">
          <el-input type="text" v-model="tempArticle.idcard">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="deleteUser">删 除</el-button>
        <el-button type="success" @click="updateArticle">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        searchkey:'',
        beforsearch:[],
        aftersearch:[],
        search_status: 0,
        ro_totalCount: 0,
        ro_list: [],
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        dialogCreateFormVisible: false,
        textMap: {
          update: '编辑',
          create: '编辑'
        },
        tempArticle: {
          id: "",
          content: ""
        },
        rules: {
          username: [
            { required: true, trigger: "blur", message: "请输入用户名" },
            { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入空格等特殊符号' } 
          ],
          password: [
            { required: true, trigger: "blur", message: "请输入密码" },
            { min: 6,  trigger: "blur", message: "请输入不少于6个字符" },
          ],
        },
        data_role:[
          {name:"超级权限",id:1},
          {name:"普通用户",id:2}
        ]
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        // if (!this.hasPerm('article:list')) {
        //   return
        // }
        this.listLoading = true;
        this.listQuery.id=Cookies.get("id")
        this.listQuery.employerin_d=Cookies.get("userId")
        // console.log("this.listQuery",this.listQuery)
        this.api({
          url: "/user/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          
          if(this.search_status==0){
            // console.log("data",data)
            this.listLoading = false;
            this.list = data.list;
            // this.list.reverse()
            // console.log("list[0]",this.list[0])
            this.totalCount = data.totalCount;
          }
          else{
            this.listLoading = false;
            let temp_list=[];
            for(let i=(this.listQuery.pageNum-1)*this.listQuery.pageRow;i<this.aftersearch.length&&i<this.listQuery.pageRow;i++)
              temp_list.push(this.aftersearch[i])
            // console.log("temp_list",temp_list)
            this.list = temp_list;
          }
          
        })
        this.api({
          url: "/user/listRole",
          method: "get",
        }).then(data => {
          this.ro_list = data.list;
          console.log("ro_list",data)
          this.ro_totalCount = data.totalCount;
        })
        this.api({//全部查询
          url: "/user/queryList ",
          method: "get",
        }).then(data => {
          this.total_list=data.list
      });
      },
      finddata(da_id){ 
        for(let i=0;i<this.data_role.length;i++){
          if(this.data_role[i].id==da_id)
          return this.data_role[i].name
        }
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageRow = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      handleFilter() {
        //改变了查询条件,从第一页开始查询
        this.listQuery.pageNum = 1
        this.getList()
      },
      // getIndex($index) {
      //   //表格序号
      //   return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      // },
      showCreate() {
        //显示新增对话框
        this.tempArticle={};
        this.dialogStatus = "create"
        this.dialogCreateFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempArticle= this.list[$index];
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createArticle() {
        //保存新工作人员
        this.api({
          url: "/user/addUser",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      updateArticle() {
        //修改
        this.api({
          url: "/user/updateUser",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      deleteUser() {
        // console.log(this.tempArticle)
        //删除
        this.tempArticle.deleteStatus=0
        this.api({
          url: "/user/updateUser",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      search(){
        console.log('this.searchkey-->',this.searchkey);
        this.totalCount=0;
         if(this.searchkey!=''){
           //this.list=this.firstdata;
           console.log(this.list);
           this.search_status=1;
           this.aftersearch=[];
           this.beforsearch = this.total_list;
           for(let i=0;i<this.beforsearch.length;i++){
             let name=this.beforsearch[i].username
             if(name&&name.includes(this.searchkey)){
               this.aftersearch.push(this.beforsearch[i]);
               this.totalCount+=1;
             }
           }
           this.getList();
         }else{
           this.search_status=0
           this.getList();
         }
      },
    }
  }
</script>
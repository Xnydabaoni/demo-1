<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加
          </el-button>
          <el-input placeholder="请输入权限名称进行查找" style='width: 300px; margin-left:50px;'  v-model="searchkey" clearable v-on:keyup.enter.native="search">
          <el-button slot="append"  icon="el-icon-search" @click="search" ></el-button>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <!-- <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="scope.row.id"> </span>
        </template>
      </el-table-column> -->
      <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
      <el-table-column align="center" prop="content" label="角色" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.roleName}}</span></template>
      </el-table-column>
            <el-table-column align="center" prop="content" label="权限" style="width: 100px;">
        <template slot-scope="scope"> <span>{{showrole(scope.row.menus)}}</span></template>
      </el-table-column>
      <!-- <el-table-column align="center" label="创建时间" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <!-- <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">下载</el-button> -->
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
      <el-form class="small-space" :model="tempRole" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="角色">
          <el-input type="text" v-model="tempper.roleName">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="权限" >
          <el-input type="text" v-model="tempRole.levela"></el-input>
        </el-form-item> -->
      </el-form>
      <li v-for="(item,index) in role_list" :key="index" style='width: 300px; margin-left:50px;'>
　　　　<input type="checkbox" v-model="temppermissions" :value="item.id">
　　　　<span>{{item.name}}</span>
　　   </li>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createArticle">创 建</el-button>
      </div>
    </el-dialog>
    <!-- xiugai -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempRole" label-position="left" label-width="100px"
        style='width: 300px; margin-left:50px;'>
        <!-- <el-form-item label="编号">
          <el-input type="text" v-model="tempRole.id">
          </el-input>
        </el-form-item> -->
        <el-form-item label="角色">
          <el-input type="text" v-model="tempRole.roleName">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="权限">
          <el-input type="text" v-model="tempRole.levela">
          </el-input>
        </el-form-item> -->
        <!-- <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item> -->
      </el-form>
      <li v-for="(item,index) in role_list" :key="index" style='width: 300px; margin-left:50px;'>
　　　　<input type="checkbox" v-model="temppermissions" :value="item.id">
　　　　<span>{{item.name}}</span>
　　   </li>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus!='create'" @click="deleteUser">删 除</el-button>
        <!-- <el-button v-if="dialogStatus!='create'" @click="upload">上 传</el-button> -->
        <el-button v-if="dialogStatus!='create'" type="success" @click="updateArticle">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        searchkey:'',
        beforsearch:[],
        aftersearch:[],
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
        tempRole: {
          id: "",
          content: ""
        },
        temppermissions:[],
        tempper:{
          roleId:"",
          roleName:"",
          permissions:[]
        },
        role_list:[
          {id:102 ,name:"权限管理"},
          {id:101 ,name:"工作人员"},
          {id:401 ,name:"申报政府"},
          {id:201 ,name:"政策管理"},
          {id:301 ,name:"申请人"},
          {id:501 ,name:"入库项目"},
          {id:601 ,name:"申报项目"},
          {id:701 ,name:"两院院士"},
          {id:801 ,name:"驻外合作机构"},
          {id:901 ,name:"学会会员"}
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
        this.api({
          url: "/user/listRole",
          method: "get",
          params: this.listQuery
        }).then(data => {
          console.log("listRole",data)
          this.listLoading = false;
          this.list = data.list;
          // console.log("s",this.list[0].menus[0])
          this.totalCount = data.totalCount;
        })
      },
      showrole(me){
        let s=""
        for(let i=0;i<me.length;i++){
          s= s +me[i].menuName+" "
        }
        return s;
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
        this.temppermissions=[];
        this.tempRole.content = "";
        this.tempper.roleName=""
        this.tempper.permissions=""
        this.dialogStatus = "create"
        this.dialogCreateFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempRole= this.list[$index];
        this.temppermissions=[];
        // console.log("this.tempRole",this.tempRole["menus"][0])
        for(let i=0;i<this.tempRole["menus"].length;i++){
          for(let j=0;j<this.role_list.length;j++){
            if(this.tempRole["menus"][i].menuName==this.role_list[j].name)
              this.temppermissions.push(this.role_list[j].id)
          }
        }
        console.log("temppermissions",this.temppermissions)
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createArticle() {
        //保存新工作人员
        this.tempper.permissions=this.temppermissions
        // console.log("tempper",this.tempper)
        this.api({
          url: "/user/addRole",
          method: "post",
          data: this.tempper
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      updateArticle() {
        //修改文章
        this.tempper.roleName=this.tempRole.roleName
        this.tempper.roleId=this.tempRole.roleId
        this.tempper.permissions=this.temppermissions
        this.api({
          url: "/user/updateRole",
          method: "post",
          data: this.tempper
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      deleteUser() {
        //修改文章
        this.api({
          url: "/user/deleteRole",
          method: "post",
          data: this.tempRole
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      // upload(){
      //   //上传文件
      //   let files=document.querySelector("#fileInput").files;
      //   if(files.length>0){
      //     let file=files[0];
      //   }
      // },
      search(){
        console.log('this.searchkey-->',this.searchkey);
         if(this.searchkey!=''){
           //this.list=this.firstdata;
           console.log(this.list);
           this.aftersearch=[];
           this.beforsearch=this.list;
           for(let i=0;i<this.beforsearch.length;i++){
             let name=this.beforsearch[i].roleName
             if(name&&name.includes(this.searchkey)){
               this.aftersearch.push(this.beforsearch[i]);
               this.totalCount=1;
             }
           }
          this.list=this.aftersearch;
         }else{
           this.getList();
         }
      },
    }
  }
</script>
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加
          </el-button>
          <el-input placeholder="请输入机构名称进行查找" style='width: 300px; margin-left:50px;'  v-model="searchkey" clearable v-on:keyup.enter.native="search">
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
            
      <el-table-column align="center" prop="content" label="机构名称" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.part_name}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="机构地址" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.part_address}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="联系人" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.link_name}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="联系人电话" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.link_phone}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="联系人手机" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.link_mobile}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="联系人邮箱" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.link_email}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="联系人微信" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.link_weixin}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="机构介绍" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.part_desc}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="负责人" style="width: 100px;">
        <template slot-scope="scope"> <span>{{find_employerin(scope.row.employerin_id)}}</span></template>
      </el-table-column>
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
      <el-form class="selectbox" :model="tempArticle" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'>
        <!-- <el-form-item label="序号">
          <el-input type="text" v-model="tempArticle.id">
          </el-input>
        </el-form-item> -->
        <el-form-item label="机构名称">
          <el-input type="text" v-model="tempArticle.part_name">
          </el-input>
        </el-form-item>
        <el-form-item label="机构地址">
          <el-input type="text" v-model="tempArticle.part_address">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input type="text" v-model="tempArticle.link_name">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input type="text" v-model="tempArticle.link_phone">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人手机">
          <el-input type="text" v-model="tempArticle.link_mobile">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人邮箱">
          <el-input type="text" v-model="tempArticle.link_email">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人微信">
          <el-input type="text" v-model="tempArticle.link_weixin">
          </el-input>
        </el-form-item>
        <el-form-item label="机构介绍">
          <el-input type="text" v-model="tempArticle.part_desc">
          </el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <!-- <el-input type="text" v-model="tempArticle.employerin_id">
          </el-input> -->
          <select name="public-choice" v-model="tempArticle.employerin_id" style="width: 200px">                                        
              <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId" >{{employerin.username}}</option>                                    
          </select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createArticle">创 建</el-button>
      </div>
    </el-dialog>
    <!-- xiugai -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="selectbox" :model="tempArticle" label-position="left" label-width="100px"
        style='width: 300px; margin-left:50px;'>
        <!-- <el-form-item label="序号">
          <el-input type="text" v-model="tempArticle.id">
          </el-input>
        </el-form-item> -->
        
        <el-form-item label="机构名称">
          <el-input type="text" v-model="tempArticle.part_name">
          </el-input>
        </el-form-item>
        <el-form-item label="机构地址">
          <el-input type="text" v-model="tempArticle.part_address">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input type="text" v-model="tempArticle.link_name">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人电话">
          <el-input type="text" v-model="tempArticle.link_phone">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人手机">
          <el-input type="text" v-model="tempArticle.link_mobile">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人邮箱">
          <el-input type="text" v-model="tempArticle.link_email">
          </el-input>
        </el-form-item>
        <el-form-item label="联系人微信">
          <el-input type="text" v-model="tempArticle.link_weixin">
          </el-input>
        </el-form-item>
        <el-form-item label="机构介绍">
          <el-input type="text" v-model="tempArticle.part_desc">
          </el-input>
        </el-form-item>
        <el-form-item label="负责人">
          <!-- <el-input type="text" v-model="tempArticle.employerin_id">
          </el-input> -->
          <select name="public-choice" v-model="tempArticle.employerin_id" style="width: 200px">                                        
              <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId" >{{employerin.username}}</option>                                    
          </select>
        </el-form-item>
        <!-- <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item> -->
      </el-form>
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
import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        searchkey:'',
        beforsearch:[],
        aftersearch:[],
        em_totalCount: 0,
        em_list: [],
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
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        //查询列表
        if (!this.hasPerm('article:list')) {
          return
        }this.listQuery.emp_now_id=Cookies.get("id")
        this.listQuery.employerin_d=Cookies.get("userId")
        this.listLoading = true;
        this.api({
          url: "/Cooperation/query",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.totalCount;
        })
        this.api({
        url: "/user/queryList",
        method: "get",
      }).then(data => {
        // console.log("em_list",data)
        this.em_list = data.list;
        this.em_totalCount = data.totalCount
        // console.log("em_totalCount",this.em_totalCount)
      })
      },
      find_employerin(em_id){
      // for(let i=0;i<this.em_totalCount;i++){
      for(let i=0;i<this.em_list.length;i++){
        // console.log(i)
          if(this.em_list[i].userId == em_id){
            // console.log("em_list[i]",this.em_list[i])
            return this.em_list[i].username;
          }   
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
          url: "/Cooperation/add",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      updateArticle() {
        //修改文章
        this.api({
          url: "/Cooperation/update",
          method: "post",
          data: this.tempArticle
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      deleteUser() {
        //修改文章
        this.api({
          url: "/Cooperation/delete",
          method: "post",
          data: {...this.tempArticle,deleteStatus:0}
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
             let name=this.beforsearch[i].part_name
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
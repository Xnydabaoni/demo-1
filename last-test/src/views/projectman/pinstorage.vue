<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <!-- <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加</el-button> -->
          <el-input placeholder="请输入搜索内容" style="width: 400px;" v-model="searchkey" clearable v-on:keyup.enter.native="search">
                        <el-button slot="append"  icon="el-icon-search" @click="search" ></el-button>
          </el-input>
          
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <!-- <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope"><span v-text="scope.row.id"> </span></template>
      </el-table-column> -->
      <el-table-column align="center" prop="content" label="序号" style="width: 150px">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="content" label="所属领域" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.area}}</span></template>
      </el-table-column> -->
      <el-table-column align="center" prop="content" label="学历" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.degree}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="职称" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.levela}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="项目名称" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.project_name}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="项目概述" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.gaishu}}</span></template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="content" label="项目资料路径" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.ziliaolujing}}</span></template>
      </el-table-column> -->
      <el-table-column align="center" prop="content" label="申请人姓名" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.person_name}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="政策标题" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.zhengce_title}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="政府名称" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.gov_name}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="手机" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.mobile}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="办公电话" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.phone}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="邮箱" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.mail}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="所在大学" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.school}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="是否海外人才" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.outa}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="企业名" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.companya}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="备注信息" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.desc_str}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="首次联系人" style="width: 100px;">
        <template slot-scope="scope"> <span>{{find_employerin(scope.row.emp_one_id)}}</span></template>
      </el-table-column>
      <el-table-column align="center" prop="content" label="目前负责人" style="width: 100px;">
        <template slot-scope="scope"> <span>{{find_employerin(scope.row.emp_now_id)}}</span></template>
      </el-table-column>
      <!-- <el-table-column align="center" label="录入时间" width="170">
        <template slot-scope="scope"> <span>{{scope.row.createTime}}</span></template>
      </el-table-column> -->
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="primary" icon="edit" @click="showdeclare(scope.$index)">申报</el-button>
          <el-button type="primary" icon="edit" @click="showdownload(scope.$index)">下载</el-button>
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
      <el-form class="selectbox" :model="tempProject" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'>
        <!-- <el-form-item label="所属领域">
          <el-input type="text" v-model="tempProject.area">
          </el-input>
        </el-form-item> -->
        <el-form-item label="学历">
          <el-input type="text" v-model="tempProject.degree">
          </el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input type="text" v-model="tempProject.levela">
          </el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input type="text" v-model="tempProject.project_name">
          </el-input>
        </el-form-item>
        <el-form-item label="项目概述">
          <el-input type="text" v-model="tempProject.gaishu">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="项目资料路径">
          <el-input type="text" v-model="tempProject.ziliaolujing">
          </el-input>
        </el-form-item> -->
        <el-form-item label="申请人姓名">
          <el-input type="text" v-model="tempProject.person_name">
          </el-input>
        </el-form-item>
        <el-form-item label="政策标题">
          <el-input type="text" v-model="tempProject.zhengce_title">
          </el-input>
        </el-form-item>
        <el-form-item label="政府名称">
          <el-input type="text" v-model="tempProject.gov_name">
          </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="tempProject.mobile">
          </el-input>
        </el-form-item>
        <el-form-item label="办公电话">
          <el-input type="text" v-model="tempProject.phone">
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="tempProject.mail">
          </el-input>
        </el-form-item>
        <el-form-item label="所在大学">
          <el-input type="text" v-model="tempProject.school">
          </el-input>
        </el-form-item>
        <el-form-item label="是否海外人才">
          <el-input type="text" v-model="tempProject.outa">
          </el-input>
        </el-form-item>
        <el-form-item label="企业名">
          <el-input type="text" v-model="tempProject.companya">
          </el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="textarea" :rows="5" style="width: 400px" v-model="tempProject.desc_str">
          </el-input>
        </el-form-item>
        <el-form-item label="首次联系人">
          <el-input type="text" v-model="emp_one_name">
          </el-input>
        </el-form-item>
        <el-form-item label="目前负责人">
          <el-input type="text" v-model="tempProject.emp_now_id">
          </el-input>
        </el-form-item>
        <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createProject">创 建</el-button>
      </div>
    </el-dialog>
    <!-- xiugai -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="selectbox" :model="tempProject" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'>
        <!-- <el-form-item label="所属领域">
          <el-input type="text" v-model="tempProject.area">
          </el-input>
        </el-form-item> -->
        <el-form-item label="学历">
          <el-input type="text" v-model="tempProject.degree">
          </el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input type="text" v-model="tempProject.levela">
          </el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input type="text" v-model="tempProject.project_name">
          </el-input>
        </el-form-item>
        <el-form-item label="项目概述">
          <el-input type="text" v-model="tempProject.gaishu">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="项目资料路径">
          <el-input type="text" v-model="tempProject.ziliaolujing">
          </el-input>
        </el-form-item> -->
        <!-- <el-form-item label="申请人姓名">
          <el-input type="text" v-model="tempProject.person_name">
          </el-input>
        </el-form-item> -->
        <el-form-item label="政策标题">
          <!-- <el-input type="text" v-model="tempProject.zhengce_title"> </el-input> -->
          <select name="public-choice" v-model="tempProject.zhengce_id" style="width: 200px">                                        
              <option :value="polic.id" v-for="polic in po_list" :key="polic.id">{{polic.zhengce_title}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="政府名称">
          <!-- <el-input type="text" v-model="tempProject.gov_name"> </el-input> -->
          <select name="public-choice" v-model="tempProject.govment_id" style="width: 200px">                                        
              <option :value="gover.id" v-for="gover in go_list" :key="gover.id">{{gover.gov_name}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="tempProject.mobile">
          </el-input>
        </el-form-item>
        <el-form-item label="办公电话">
          <el-input type="text" v-model="tempProject.phone">
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="tempProject.mail">
          </el-input>
        </el-form-item>
        <el-form-item label="所在大学">
          <el-input type="text" v-model="tempProject.school">
          </el-input>
        </el-form-item>
        <el-form-item label="是否海外人才">
          <el-input type="text" v-model="tempProject.outa">
          </el-input>
        </el-form-item>
        <el-form-item label="企业名">
          <el-input type="text" v-model="tempProject.companya">
          </el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="textarea" :rows="5" style="width: 400px" v-model="tempProject.desc_str">
          </el-input>
        </el-form-item>
        <el-form-item label="首次联系人">
          <!-- <el-input type="text" v-model="emp_one_name">
          </el-input> -->
          <select name="public-choice" v-model="tempProject.emp_one_id" style="width: 200px">                                        
            <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId" >{{employerin.username}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="目前负责人">
          <!-- <el-input type="text" v-model="tempProject.emp_now_id">
          </el-input> -->
          <select name="public-choice" v-model="tempProject.emp_now_id" style="width: 200px">                                        
            <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId" >{{employerin.username}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="文件">
          <input type="file" id="fileInput" />(大小不超过100M)
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus='create'" @click="deleteProject">删 除</el-button>
        <!-- <el-button @click="upload">上 传</el-button> -->
        <el-button v-if="dialogStatus='create'" type="primary" @click="updateProject">修 改</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogdeclareFormVisible">
      <el-form class="selectbox" :model="tempProject" label-position="left" label-width="100px"
               style='width: 300px; margin-left:50px;'>
        <!-- <el-form-item label="所属领域">
          <el-input type="text" v-model="tempProject.area">
          </el-input>
        </el-form-item> -->
        <el-form-item label="学历">
          <el-input type="text" v-model="tempProject.degree">
          </el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input type="text" v-model="tempProject.levela">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="申报人类型">
          <el-input type="text" v-model="tempProject.proposer_type">
          </el-input>
        </el-form-item> -->
        <el-form-item label="项目名称">
          <el-input type="text" v-model="tempProject.project_name">
          </el-input>
        </el-form-item>
        <el-form-item label="项目概述">
          <el-input type="text" v-model="tempProject.gaishu">
          </el-input>
        </el-form-item>
        <!-- <el-form-item label="项目资料路径">
          <el-input type="text" v-model="tempProject.ziliaolujing">
          </el-input>
        </el-form-item> -->
        <el-form-item label="申请人姓名">
          <el-input type="text" v-model="tempProject.person_name">
          </el-input>
        </el-form-item>
        <el-form-item label="政策标题">
          <el-input type="text" disabled="true" v-model="tempProject.zhengce_title">
          </el-input>
        </el-form-item>
        <el-form-item label="政府名称">
          <el-input type="text" disabled="true" v-model="tempProject.gov_name">
          </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="tempProject.mobile">
          </el-input>
        </el-form-item>
        <el-form-item label="办公电话">
          <el-input type="text" v-model="tempProject.phone">
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="tempProject.mail">
          </el-input>
        </el-form-item>
        <el-form-item label="所在大学">
          <el-input type="text" v-model="tempProject.school">
          </el-input>
        </el-form-item>
        <el-form-item label="是否海外人才">
          <el-input type="text" v-model="tempProject.outa">
          </el-input>
        </el-form-item>
        <el-form-item label="企业名">
          <el-input type="text" v-model="tempProject.companya">
          </el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="textarea" :rows="5" style="width: 400px" v-model="tempProject.desc_str">
          </el-input>
        </el-form-item>
        <el-form-item label="首次成功人">
          <!-- <el-input type="text" v-model="emp_success_name">
          </el-input> -->
          <select name="public-choice" v-model="tempProject.emp_success_id" style="width: 200px">                                        
              <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId">{{employerin.username}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="目前负责人">
          <!-- <el-input type="text" v-model="tempProject.emp_now_id"> </el-input> -->
          <select name="public-choice" v-model="tempProject.emp_now_id" style="width: 200px">                                        
              <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId">{{employerin.username}}</option>                                    
          </select>
        </el-form-item>
        <!-- <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogdeclareFormVisible = false">取 消</el-button>
        <el-button @click="declare">申 报</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogshowdownloadFormVisible">
      <el-table
        :data="download_list"
        v-loading.body="download_listLoading"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
      >
      <el-table-column align="center" prop="content" label="序号" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.id}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="文件名" style="width: 100px;">
        <template slot-scope="scope"> <span>{{scope.row.fileName}}</span></template>
      </el-table-column>
      <el-table-column align="center" label="管理" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="download(scope.$index)">下载</el-button>
        </template>
      </el-table-column>
      </el-table>
      <el-button
        type="primary"
        icon="edit"
        @click="dialogshowdownloadFormVisible = false"
        >取消</el-button>
    </el-dialog>
  </div>
  
</template>
<script>
import Cookies from 'js-cookie'
  export default {
    data() {
      return {
        now_id: 0,
        emp_one_name:"",
        emp_success_name:"",
        searchkey:'',
        search_status: 0,
        beforsearch:[],
        aftersearch:[],
        em_totalCount: 0,
        em_list: [],
        go_totalCount: 0,
        go_list: [],
        po_totalCount: 0,
        po_list: [],
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        total_list:[],//所有数据
        download_list:[],
        listLoading: false,//数据加载等待动画
        download_listLoading: false,
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        dialogCreateFormVisible: false,
        dialogdeclareFormVisible:false,
        dialogshowdownloadFormVisible:false,
        textMap: {
          update: '编辑',
          create: '编辑'
        },
        tempProject: {
          id: "",
          content: ""
        },
        tempDownload:{
          id:""
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
        }
        this.listQuery.emp_now_id=Cookies.get("id")
        this.listQuery.employerin_d=Cookies.get("userId")
        this.listLoading = true;
        this.api({
          url: "/inboundProject/query",
          method: "get",
          params: this.listQuery
        }).then(data => {
           if(this.search_status==0){
            // console.log("search_s",this.search_status)
            this.listLoading = false;
            this.list = data.list;
            // this.list.reverse()
            // console.log("list[0]",this.list[0])
            this.totalCount = data.totalCount;
          }
          else{
            this.listLoading = false;
            let temp_list=[];
            for(let i=(this.listQuery.pageNum-1)*this.listQuery.pageRow;i<this.aftersearch.length&&i<(this.listQuery.pageNum-1)*this.listQuery.pageRow+this.listQuery.pageRow;i++)
              temp_list.push(this.aftersearch[i])
            // console.log("temp_list",temp_list)
            this.list = temp_list;
          }
        })
      this.api({
        url: "/user/queryList",
        method: "get",
      }).then(data => {
        this.em_list = data.list;
        this.em_totalCount = data.totalCount
        // console.log("em_list",em_list[0])
        for(let i=0;i<this.em_totalCount;i++){
        // console.log(this.em_list[i].username)
        if(this.em_list[i].username==Cookies.get('username')){
          // console.log(this.em_list[i].userId)
          this.now_id=this.em_list[i].userId
          return;
        }
      }
      })
      this.api({
          url: "/policy/queryList",
          method: "get",
        }).then(data => {
          // console.log("polic",data)
          this.po_list = data.list;
          this.po_totalCount = data.totalCount
        })
        this.api({
          url: "/government/queryList",
          method: "get",
        }).then(data => {
          // console.log("gov",data)
          this.go_list = data.list;
          this.go_totalCount = data.totalCount
        })
        this.api({//全部查询
          url: "/inboundProject/queryList ",
          method: "get",
        }).then(data => {
          this.total_list=data.list
      });
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
    //   upload() {
    //   //上传文件
    //   let files = document.querySelector("#fileInput").files;
    //   // console.log("files", files);
    //   var formData = new FormData()
    //   if (files.length > 0) {
    //     // let file = files[0];
    //     formData.append( 'multipartFile',files[0])
    //     //  console.log(file)
    //     this.api({
    //       url: '/inboundProject/upload' ,
    //       method: 'post',
	  // 	    headers: {
	  //         'Content-Type': 'multipart/form-data'
	  //       },
	  // 	    data: formData,
    //     }).then(() =>{
    //     // console.log("上传")
    //     })
    //   }
    // },
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
      getIndex($index) {
        //表格序号
        return this.totalCount-((this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index);
      },
      showCreate() {
        //显示新增对话框
        this.tempProject={};
        this.dialogStatus = "create"
        this.dialogCreateFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempProject= this.list[$index];
        // console.log("this.tempProject",this.tempProject)
        // this.tempProject.emp_now_id
        // this.emp_one_name=this.find_employerin(this.tempProject.emp_one_id)
        // console.log("temp",this.tempProject)
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      showdownload($index) {
      if ($index != undefined) {
        this.tempProject = this.list[$index];
      }
      //console.log(this.tempProject)
      this.tempDownload.id = this.tempProject.id;
      this.tempDownload.module="1"
      this.dialogshowdownloadFormVisible = true;
      if (!this.hasPerm("article:list")) {
        return;
      }
      this.download_listLoading = true;
      console.log(this.trace_id)
      this.api({
        url: "/inboundProject/queryFiles"+ "?module="+ "1",
        method: "post",
        data: this.tempDownload,
        //params: this.listQuery
      }).then((data) => {
        //console.log("data",data)
        //console.log("id",this.tempProject.id)
        this.download_listLoading = false;
        console.log("download_list",data.list)
        this.download_list = data.list;
        //console.log("list",this.download_listlist);
        //this.totalCount = data.totalCount;
        //console.log(this.totalCount);
      });
    },
      createProject() {
        //保存新文章
        this.api({
          url: "/inboundProject/add",
          method: "post",
          data: this.tempProject
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
        let files = document.querySelector("#fileInput").files;
      // console.log("files", files);
      var formData = new FormData()
      if (files.length > 0) {
        // let file = files[0];
        formData.append( 'multipartFile',files[0])

        //  console.log(file)
        this.api({
          url: '/inboundProject/upload' + "?project_id="+ this.tempProject.id,

          method: 'post',
	  	    headers: {
	          'Content-Type': 'multipart/form-data'
	        },
	  	    data: formData,
        }).then(() =>{
        // console.log("上传")
        })
      }
      },
      updateProject() {
        //修改文章
        // console.log("tempp",this.tempProject)
        this.api({
          url: "/inboundProject/update",
          method: "post",
          data: this.tempProject
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
        let files = document.querySelector("#fileInput").files;
      // console.log("files", files);
      // console.log("this.tempProject",this.tempProject)
      var formData = new FormData()
      if (files.length > 0 ) {
        // let file = files[0];
        console.log("files[0].size/1024/1024",files[0].size/1024/1024)
        if(files[0].size/1024/1024 >100){
          this.$message.error("文件大小超过100M");
          return;
        }
        formData.append( 'multipartFile',files[0])
        // console.log("formData",files[0].size)
        //  console.log(file)
        this.api({
          url: '/inboundProject/upload' + "?module="+ "1" + "&project_id="+ this.tempProject.id,
          method: 'post',
	  	    headers: {
	          'Content-Type': 'multipart/form-data'
	        },
	  	    data: formData,
        }).then(() =>{
        // console.log("上传")
        })
      }
      },
      deleteProject() {
        //修改文章
        this.api({
          url: "/inboundProject/delete",
          method: "post",
          data: {...this.tempProject,deleteStatus:0}
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
          this.dialogCreateFormVisible=false
        })
      },
      search(){
         //搜索
         
      console.log("this.searchkey-->", this.searchkey);
      this.totalCount=0;
      if (this.searchkey != "") {
        //this.list=this.firstdata;
        //console.log(this.list);
        this.search_status=1;
        this.aftersearch = [];
        this.beforsearch = this.list;
        // console.log(this.beforsearch)
        for (let i = 0; i < this.beforsearch.length; i++) {
          let are = this.beforsearch[i].area;
          let deg = this.beforsearch[i].degree;
          let lev = this.beforsearch[i].levela;
          let pro_name = this.beforsearch[i].project_name;
          let gas = this.beforsearch[i].gaishu;
          let per_name = this.beforsearch[i].person_name;
          // console.log(per_name && per_name.includes(this.searchkey))
          let zc_title = this.beforsearch[i].zhengce_title;
          let go_name = this.beforsearch[i].gov_name
          let mob = this.beforsearch[i].mobile
          let pho = this.beforsearch[i].phone
          let mai = this.beforsearch[i].mail
          let sch = this.beforsearch[i].school
          let out = this.beforsearch[i].outa
          let com = this.beforsearch[i].companya
          let des = this.beforsearch[i].desc_str
          let emp_o_name = this.find_employerin(this.beforsearch[i].emp_one_id)
          // console.log("emp_id",emp_id)
          // console.log(typeof(emp_id))
          let emp_n_name = this.find_employerin(this.beforsearch[i].emp_now_id)
          // console.log(typeof(lev))
          // console.log(mob.includes(this.searchkey))
          // console.log(pho.includes(this.searchkey))
          //console.log(name.includes(this.searchkey),type.includes(this.searchkey_type))
          if (are.includes(this.searchkey) || deg.includes(this.searchkey) || lev.includes(this.searchkey) || mob.includes(this.searchkey) 
          || pho.includes(this.searchkey) || mai.includes(this.searchkey) || com.includes(this.searchkey) || sch.includes(this.searchkey) 
          || out.includes(this.searchkey) || des.includes(this.searchkey) || pro_name.includes(this.searchkey) || gas.includes(this.searchkey) 
          || (per_name && per_name.includes(this.searchkey)) || zc_title.includes(this.searchkey) || go_name.includes(this.searchkey) || emp_o_name.includes(this.searchkey)
          || emp_n_name.includes(this.searchkey)) {
            this.aftersearch.push(this.beforsearch[i]);
            this.totalCount += 1;
          }
          this.aftersearch.reverse();
        }
        this.getList();
        // let temp_list=[];
        // for(let i=(this.listQuery.pageNum-1)*this.listQuery.pageRow;i<this.beforsearch.length&&i<this.listQuery.pageRow;i++)
        //   temp_list.push(this.aftersearch[i])
        // this.list = temp_list;
      } else {
        this.search_status=0
        this.getList();
      }
    },
      showdeclare($index){
        this.tempProject= this.list[$index];
        this.tempProject.emp_success_id=this.now_id
        // this.emp_success_name=this.find_employerin(this.tempProject.emp_success_id)
        // this.tempProject.emp_success_id=this.tempProject.emp_now_id 
        this.dialogdeclareFormVisible=true;
        // console.log("tempProject",this.tempProject)
        // console.log("content",this.tempProject.id)
        
      },
      declare(){
        console.log("tempProject",this.tempProject)
        this.api({
          url: "/inboundProject/declareProject",
          method: "post",
          data: this.tempProject
        }).then(() => {
          this.getList();
          this.dialogdeclareFormVisible=false;
        })
      //   let files = document.querySelector("#fileInput").files;
      // // console.log("files", files);
      // var formData = new FormData()
      // if (files.length > 0) {
      //   // let file = files[0];
      //   formData.append( 'multipartFile',files[0])

      //   //  console.log(file)
      //   this.api({
      //     url: '/inboundProject/upload' + "?project_id="+ this.tempProject.id,
      //     method: 'post',
	  	//     headers: {
	    //       'Content-Type': 'multipart/form-data'
	    //     },
	  	//     data: formData,
      //   }).then(() =>{
      //   // console.log("上传")
      //   })
      // }
      },
      download($index) {
      var fileDownload=require('js-file-download')
      // var formData = new FormData()
      // formData.append('id',this.list[$index].file_id)

      // formData.append('id','10')
      // console.log("id",this.list[$index].file_id)
      // console.log("formdata",formData)
      // console.log("formdata_id",formData.get("id"))
      this.axios({
        method: 'get',
        url: "/api/inboundProject/download" + "?module="+ "1" +"&id="+ this.download_list[$index].id,
        responseType: 'blob', 
        headers: {
	        'Content-Type': 'multipart/form-data'
	      },
        //params: formData
      }).then(res => {

        console.log(res)
        let contentDisposition = res.headers['content-disposition'];
        console.log(contentDisposition)
        // console.log(contentDisposition.substring(contentDisposition.indexOf('=')+1))
        let fileName = window.decodeURI(contentDisposition.substring(contentDisposition.indexOf('=')+1));
        console.log('fileName=' + fileName);
        // let content = res.headers['content-disposition'].split(';') // 从响应头中拿到文件名
        // let fileName = content[1].split('=')[1] // 从响应头中拿到文件名
        // console.log(fileName)
        fileDownload(res.data, fileName);
      })
    },
    }
  }
</script>
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('article:add')">添加 </el-button>
          <el-input
            placeholder="请输入搜索内容"
            style="width: 400px;"
            v-model="searchkey"
            clearable
            v-on:keyup.enter.native="search"
          >
          <el-button
              slot="append"
              icon="el-icon-search"
              @click="search"
            ></el-button>
          </el-input>
          <!-- <el-input
            placeholder="请输入类型"
            style="width: 250px;"
            v-model="searchkey_type"
            clearable
            v-on:keyup.enter.native="search"
          >
          </el-input> -->
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="list"
      :row-style="{height:'0px'}"
      :cell-style="{padding:'0px'}"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column
        align="center"
        prop="content"
        label="序号"
        style="width: 150px"
      >
      <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="项目名称"
        style="width: 150px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.project_name }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="类型"
        style="width: 200px"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.person_type == '1'">{{ "企业" }}</span>
          <span v-if="scope.row.person_type == '2'">{{ "人才" }}</span>
          <span v-if="scope.row.person_type == '3'">{{ "团队" }}</span>
          <span v-if="scope.row.person_type == '4'">{{ "融资" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="申报人"
        style="width: 75px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.person_name }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="手机"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.mobile }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="办公电话"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="公司"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.companya }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="邮箱"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.mail }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="所在大学"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.school }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="是否海外人才"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.outa }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="负责人"
        style="width: 100px"
      >
         <template slot-scope="scope">
          <span>{{ find_employerin(scope.row.employerin_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="当前状态"
        style="width: 100px"
      >
         <template slot-scope="scope">
          <span v-if="scope.row.status == '1'">{{ "待联系" }}</span>
          <span v-if="scope.row.status == '2'">{{ "联系中" }}</span>
          <span v-if="scope.row.status == '3'">{{ "意向合作" }}</span>
          <span v-if="scope.row.status == '4'">{{ "不合作" }}</span>
          <span v-if="scope.row.status == '5'">{{ "已入库" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="备注消息"
        width="200"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.desc_str }}</span></template
        >
      </el-table-column>
      <!-- <el-table-column align="center" label="录入时间" width="170">
        <template slot-scope="scope"
          ><span>{{ scope.row.insert_time }}</span></template
        >
      </el-table-column> -->
      <el-table-column
        align="center"
        label="管理"
        width="200"
        v-if="hasPerm('article:update')"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="edit"
            @click="showUpdate(scope.$index)"
            >修改</el-button
          >
          <el-button type="primary" icon="edit" @click="showtrace(scope.$index)"
            >进度</el-button
          >
          <br />
          <br />
          <!-- <el-button type="primary" icon="edit" @click="download(scope.$index)"
            >下载</el-button
          > -->
          <el-button
            type="primary"
            icon="edit"
            @click="showpinstorage(scope.$index)"
            >入库</el-button
          >
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
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- create -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogCreateFormVisible"
      conten
    >
      <el-form
        class="selectbox"
        :model="tempProject"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left: 50px"
      >
        <el-form-item label="项目名称">
          <el-input type="text" v-model="tempProject.project_name"> </el-input>
        </el-form-item>
        <el-form-item label="类型">
          <!-- <el-input type="text" v-model="tempProject.person_type"> </el-input> -->
          <select v-model="tempProject.person_type" style="width: 200px">
            <option value="1">企业</option>
            <option value="2">人才</option>
            <option value="3">团队</option>
            <option value="4">融资</option>
          </select>
        </el-form-item>
        <el-form-item label="申报人">
          <el-input type="text" v-model="tempProject.person_name"> </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="tempProject.mobile"> </el-input>
        </el-form-item>
        <el-form-item label="办公电话">
          <el-input type="text" v-model="tempProject.phone"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="tempProject.mail"> </el-input>
        </el-form-item>
        <el-form-item label="公司">
          <el-input type="text" v-model="tempProject.companya"> </el-input>
        </el-form-item>
        <el-form-item label="所在大学">
          <el-input type="text" v-model="tempProject.school"> </el-input>
        </el-form-item>
        <el-form-item label="是否海外人才">
          <!-- <el-input type="text" v-model="tempProject.outa"> </el-input> -->
          <select v-model="tempProject.outa" style="width: 200px">
            <option value="是">是</option>
            <option value="否">否</option>
          </select>
        </el-form-item>
        <!-- <el-form-item label="负责人">
          <el-input type="text" v-model="tempProject.employerin_id"> </el-input>
        </el-form-item> -->
        <el-form-item label="当前状态">
          <!-- <el-input type="text" v-model="tempProject.status"> </el-input> -->
          <select v-model="tempProject.status" style="width: 200px">
            <option value="1">待联系</option>
            <option value="2">联系中</option>
            <option value="3">意向合作</option>
            <option value="4">不合作</option>
          </select>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="textarea" :rows="5" style="width: 400px" v-model="tempProject.desc_str"> </el-input>
        </el-form-item>
        <!-- <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false">取 消</el-button>
        <el-button type="success" @click="createProject">创 建</el-button>
      </div>
    </el-dialog>
    <!-- xiugai -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        class="selectbox"
        :model="tempProject"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left: 50px"
      >
        <el-form-item label="项目名称">
          <el-input type="text" v-model="tempProject.project_name"> </el-input>
        </el-form-item>
        <el-form-item label="类型">
          <!-- <el-input type="text" v-model="tempProject.person_type"> </el-input> -->
          <select v-model="tempProject.person_type" style="width: 200px">
            <option value="1">企业</option>
            <option value="2">人才</option>
            <option value="3">团队</option>
            <option value="4">融资</option>
          </select>
        </el-form-item>
        <el-form-item label="申报人">
          <el-input type="text" v-model="tempProject.person_name"> </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="tempProject.mobile"> </el-input>
        </el-form-item>
        <el-form-item label="办公电话">
          <el-input type="text" v-model="tempProject.phone"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="tempProject.mail"> </el-input>
        </el-form-item>
        <el-form-item label="公司">
          <el-input type="text" v-model="tempProject.companya"> </el-input>
        </el-form-item>
        <el-form-item label="所在大学">
          <el-input type="text" v-model="tempProject.school"> </el-input>
        </el-form-item>
        <el-form-item label="是否海外人才">
          <!-- <el-input type="text" v-model="tempProject.outa"> </el-input> -->
          <select v-model="tempProject.outa" style="width: 200px">
            <option value="是">是</option>
            <option value="否">否</option>
          </select>
        </el-form-item>
        <el-form-item label="负责人">
          <!-- <el-input type="text" v-model="employer_name"> </el-input> -->
          <select name="public-choice" v-model="tempProject.employerin_id" style="width: 200px">                                        
              <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId" >{{employerin.username}}</option>                                    
          </select>
        </el-form-item>
         <!-- <el-form-item label="当前状态">
          <select v-model="tempProject.status" style="width: 200px">
            <option value="1">待联系</option>
            <option value="2">联系中</option>
            <option value="3">意向合作</option>
            <option value="4">不合作</option>
          </select>
        </el-form-item> -->
        <el-form-item label="备注信息">
          <el-input type="textarea" :rows="5" style="width: 400px" v-model="tempProject.desc_str"> </el-input>
        </el-form-item>
        <!-- <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button @click="deleteProject">删 除</el-button>
        <!-- <el-button @click="upload">上 传</el-button> -->
        <el-button @click="updateProject" >修 改</el-button>
      </div>
    </el-dialog>
    
    <!--  jindu -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogTraceFormVisible">
      <el-table
        :data="progress_list"
        v-loading.body="progress_listLoading"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          prop="link_time"
          label="联系时间"
          style="width: 100px"
        ></el-table-column>
        <el-table-column
          prop="link_state"
          label="申请状态"
          style="width: 100px"
        ><template slot-scope="scope">
          <span v-if="scope.row.link_state == '1'">{{ "待联系" }}</span>
          <span v-if="scope.row.link_state == '2'">{{ "联系中" }}</span>
          <span v-if="scope.row.link_state == '3'">{{ "意向合作" }}</span>
          <span v-if="scope.row.link_state == '4'">{{ "不合作" }}</span>
          <span v-if="scope.row.link_state == '5'">{{ "已入库" }}</span>
        </template>
        </el-table-column>
        <el-table-column
          prop="link_desc"
          label="联系描述"
          rows="5" style="width: 400px"
        ></el-table-column>
      </el-table>
      <el-button type="primary" icon="edit" @click="showaddTrace()"
        >添加</el-button
      >
      <el-button
        type="primary"
        icon="edit"
        @click="dialogTraceFormVisible = false"
        >取消</el-button
      >
      <!-- tianjiajindu -->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogaddTraceFormVisible"
        append-to-body="true"
      >
        <el-form
          class="selectbox"
          :model="tempTrace"
          label-position="left"
          label-width="100px"
          style="width: 300px; margin-left: 50px"
        >
          <el-form-item label="申请状态">
            <!-- <el-input type="text" v-model="tempTrace.link_state"> </el-input> -->
            <select v-model="tempTrace.link_state" style="width: 200px">
            <option value="1">待联系</option>
            <option value="2">联系中</option>
            <option value="3">意向合作</option>
            <option value="4">不合作</option>
          </select>
          </el-form-item>
          <el-form-item label="联系描述">
            <el-input type="textarea" :rows="5" style="width: 400px" v-model="tempTrace.link_desc"> </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogaddTraceFormVisible = false"
            >取 消</el-button
          >
          <el-button type="success" @click="addTrace">确 定</el-button>
        </div>
      </el-dialog>
    </el-dialog>
    <!-- pinstorage -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogpinstorageFormVisible"
    >
      <el-form
        class="selectbox"
        :model="tempProject"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left: 50px"
      >
        <!-- <el-form-item label="所属领域">
          <el-input type="text" v-model="tempProject.area"> </el-input>
        </el-form-item> -->
        <el-form-item label="学历">
          <el-input type="text" v-model="tempProject.degree"> </el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input type="text" v-model="tempProject.levela"> </el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input type="text" v-model="tempProject.project_name"> </el-input>
        </el-form-item>
        <el-form-item label="项目概述">
          <el-input type="text" v-model="tempProject.gaishu"> </el-input>
        </el-form-item>
        <!-- <el-form-item label="项目资料路径">
          <el-input type="text" v-model="tempProject.ziliaolujing"> </el-input>
        </el-form-item> -->
        <!-- <el-form-item label="申请人id">
          <el-input type="text" v-model="tempProject.id"> </el-input  >
        </el-form-item> -->
        <el-form-item label="政策标题">
          <!-- <el-input type="text" v-model="tempProject.zhengce_id"> </el-input> -->
          <select name="public-choice" v-model="tempProject.zhengce_id" style="width: 200px">                                        
              <option :value="polic.id" v-for="polic in po_list" :key="polic.id">{{polic.zhengce_title}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="政府名称">
          <!-- <el-input type="text" v-model="tempProject.govment_id"> </el-input> -->
          <select name="public-choice" v-model="tempProject.govment_id" style="width: 200px">                                        
              <option :value="gover.id" v-for="gover in go_list" :key="gover.id" >{{gover.gov_name}}</option>                                    
          </select>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="tempProject.mobile"> </el-input>
        </el-form-item>
        <el-form-item label="办公电话">
          <el-input type="text" v-model="tempProject.phone"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="tempProject.mail"> </el-input>
        </el-form-item>
        <el-form-item label="所在大学">
          <el-input type="text" v-model="tempProject.school"> </el-input>
        </el-form-item>
        <el-form-item label="是否海外人才">
          <el-input type="text" v-model="tempProject.outa"> </el-input>
        </el-form-item>
        <el-form-item label="企业名">
          <el-input type="text" v-model="tempProject.companya"> </el-input>
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input type="textarea" :rows="5" style="width: 400px" v-model="tempProject.desc_str"> </el-input>
        </el-form-item>
        <el-form-item label="所在大学">
          <el-input type="text" v-model="tempProject.school"> </el-input>
        </el-form-item>
        <el-form-item label="首次联系人">
          <!-- <el-input type="text" v-model="emp_one_name"> </el-input> -->
        <select disabled="true" name="public-choice" v-model="tempProject.emp_one_id" style="width: 200px">                                        
              <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId" >{{employerin.username}}</option>                                    
          </select>
          </el-form-item> 
        <el-form-item label="目前负责人">
          <!-- <el-input type="text" v-model="tempProject.emp_now_id"> </el-input> -->
          <select disabled="true" name="public-choice" v-model="tempProject.emp_now_id" style="width: 200px">                                        
              <option :value="employerin.userId" v-for="employerin in em_list" :key="employerin.userId" >{{employerin.username}}</option>                                    
          </select>
        </el-form-item>
         <!-- <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogpinstorageFormVisible = false"
          >取 消</el-button
        >
        <el-button type="success" @click="pinstorage">入 库</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  data() {
    return {
      now_id: 0,
      employer_name:"",
      emp_one_name:"",
      searchkey: "",
      // searchkey_type:"",
      search_status: 0,
      beforsearch: [],
      aftersearch: [],
      em_totalCount: 0,
      em_list: [],
      go_totalCount: 0,
      go_list: [],
      po_totalCount: 0,
      po_list: [],
      totalCount: 0, //分页组件--数据总条数
      list: [], //表格的数据
      total_list:[],//所有数据
      progress_list: [], //进度表
      listLoading: false, //数据加载等待动画
      progress_listLoading: false,
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10, //每页条数
        name: "",
      },
      dialogStatus: "create",
      dialogFormVisible: false,
      dialogCreateFormVisible: false,
      dialogTraceFormVisible: false,
      dialogpinstorageFormVisible: false,
      dialogaddTraceFormVisible: false,
      textMap: {
        update: "编辑",
        create: "编辑",
      },
      trace_id: {
        id: "",
      },
      tempTrace:{
        proposer_id:"",
        link_state:"",
        link_desc:""
      },
      tempProject: {
        id: "",
        content: "",
      },
    };
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
          url: "/proposer/query",
          method: "get",
          params: this.listQuery
        }).then(data => {
          // console.log("proposerdata",data)
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
            // console.log(("d",this.listQuery.pageNum-1)*this.listQuery.pageRow)
            for(let i=(this.listQuery.pageNum-1)*this.listQuery.pageRow;i<this.aftersearch.length&&i<(this.listQuery.pageNum-1)*this.listQuery.pageRow+this.listQuery.pageRow;i++)
              temp_list.push(this.aftersearch[i])
            console.log("temp_list",temp_list)
            this.list = temp_list;
          }
          
      });
      this.api({
        url: "/user/queryList",
        method: "get",
      }).then(data => {
        // console.log("em_list",data)
        this.em_list = data.list;
        this.em_totalCount = data.totalCount
        // console.log("em_totalCount",this.em_totalCount)
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
        url: "/proposer/queryList",
        method: "get",
      }).then(data => {
        this.total_list=data.list
      });
    }, 
    showtrace($index) {
      if ($index != undefined) {
        this.tempProject = this.list[$index];
      }
      this.trace_id.id = this.tempProject.id;
      this.dialogTraceFormVisible = true;
      this.progress_listLoading = true;
      // console.log(this.trace_id)
      // console.log("11")
      this.api({
        url: "/proposer/queryTrace",
        method: "post",
        data: this.trace_id,
        //params: this.listQuery
      }).then((data) => {
        //console.log("data",data)
        //console.log("id",this.tempProject.id)
        this.progress_listLoading = false;
        // console.log("2")
        // console.log("progress_list",data.list)
        this.progress_list = data.list;
        //console.log("list",this.progress_listlist);
        //this.totalCount = data.totalCount;
        //console.log(this.totalCount);
      });
    },
    addTrace() {
      this.tempTrace.proposer_id=this.tempProject.id
      console.log("tempProject",this.tempProject.id) 
      // console.log("proposer_id",this.tempTrace)
      this.api({
        url: "/proposer/addTrace",
        method: "post",
        data: this.tempTrace,
      }).then(() => {
        this.showtrace();
        this.dialogaddTraceFormVisible = false;
        this.getList()
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
    // upload() {
    //   //上传文件proposer/upload
    //   let files = document.querySelector("#fileInput").files;
    //   // console.log("files", files);
    //   var formData = new FormData()
    //   if (files.length > 0) {
    //     // let file = files[0];
    //     formData.append( 'multipartFile',files[0])

    //     //  console.log(file)
    //     this.api({
    //       url: '/inboundProject/upload' + "?project_id="+ this.tempProject.id,
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
      this.listQuery.pageRow = val;
      // console.log(val);
      this.handleFilter();
    },
    handleCurrentChange(val) {
      //改变页码
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleFilter() {
      //改变了查询条件,从第一页开始查询
      this.listQuery.pageNum = 1;
      this.getList();
    },
    getIndex($index) {
      //表格序号
      return this.totalCount-((this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index);
    },
    showCreate() {
      //显示新增对话框
      this.tempProject = {};
      this.tempProject.outa="是",
      this.tempProject.person_type="1",
      this.tempProject.status="1"
      //console.log("showcreate",this.tempProject)
      this.dialogStatus = "create";
      this.dialogCreateFormVisible = true;
    },
    showaddTrace() {
      this.tempTrace = {};
      //console.log("id",this.tempProject.id)
      this.dialogStatus = "create";
      this.dialogaddTraceFormVisible = true;
    },
    showUpdate($index) {
      //显示修改对话框
      this.tempProject = this.list[$index];
      this.tempProject.emp_now_id=this.now_id
      // console.log("show", this.tempProject);
      // this.employer_name = this.find_employerin(this.tempProject.employerin_id)
      // console.log("this.tempProject.employerin_id",this.tempProject.employerin_id)
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.dialogCreateFormVisible = false;
      this.dialogTraceFormVisible = false;
    },
    
    createProject() {
      //保存新文章
      this.tempProject.employerin_id=this.now_id
      for(let i=0;i<this.totalCount;i++){
        if(this.tempProject.project_name==this.total_list[i].project_name){
          this.$message.error("该项目已存在");
          return;
        }
      }
      this.api({
        url: "/proposer/add",
        method: "post",
        data: this.tempProject,
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
      //  let files = document.querySelector("#fileInput").files;
      // // console.log("files", files);
      // var formData = new FormData()
      // if (files.length > 0) {
      //   // let file = files[0];
      //   formData.append( 'multipartFile',files[0])

      //   //  console.log(file)
      //   that.$axios.post('/api/inboundProject/upload', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   },
      // }).then((res) => {
      //   console.log('上传结束')
      //   console.log(res)
      // }).catch((err) => {
      //   console.log('上传错误')
      //   console.log(err)
      // })
      // }
      // let files = document.querySelector("#fileInput").files;
      // // console.log("files", files);
      // var formData = new FormData()
      // if (files.length > 0) {
      //   // let file = files[0];
      //   formData.append( 'multipartFile',files[0])

      //   //  console.log(file)
      //   this.axios({
      //     url: '/api/proposer/upload',
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
    updateProject() {
      //修改文章
      this.api({
        url: "/proposer/update",
        method: "post",
        data: this.tempProject,
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
    },
    deleteProject() {
      //删除
      //console.log("shanchu ",this.tempProject)
      let tempid = {};
      tempid.proposer_id = this.tempProject.id;
      this.api({
        url: "proposer/delete",
        method: "post",
        data: tempid,
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
    },
    search() {
      //搜索
      console.log("this.searchkey-->", this.searchkey);
      this.totalCount=0;
      if (this.searchkey != "") {
        //this.list=this.firstdata;
        //console.log(this.list);
        // console.log("search")
        this.search_status=1;
        // console.log("s",this.search_status)
        this.aftersearch = [];
        this.beforsearch = this.total_list;
        // console.log(this.beforsearch.length)
        // console.log(this.beforsearch)
        for (let i = 0; i < this.beforsearch.length; i++) {
          // console.log("i",i)
          // console.log("this.beforsearch[i].person_type",this.beforsearch[i].person_type)
          let pro_name = this.beforsearch[i].project_name;
          let per_type = ""
          if(this.beforsearch[i].person_type=="1")
            per_type="企业"
          else if(this.beforsearch[i].person_type=="2")
            per_type="人才"
          else if(this.beforsearch[i].person_type=="3")
            per_type="团队"
          else per_type="融资"
          // console.log("this.beforsearch[i].project_name",this.beforsearch[i].project_name)
          let per_name = this.beforsearch[i].person_name;
          let mob = this.beforsearch[i].mobile;
          let pho = this.beforsearch[i].phone;
          let mai = this.beforsearch[i].mail;
          let com = this.beforsearch[i].companya;
          let sch = this.beforsearch[i].school
          let out = this.beforsearch[i].outa
          let emp_name = this.find_employerin(this.beforsearch[i].employerin_id)
          if(emp_name==undefined) emp_name=""
          // console.log("employerin_id",this.beforsearch[i].employerin_id)
          // console.log("emp_name",emp_name)
          // console.log(typeof(emp_id))
          let sta = ""
          if(this.beforsearch[i].status=="1")
            sta="待联系"
          else if(this.beforsearch[i].status=="2")
            sta="联系中"
          else if(this.beforsearch[i].status=="3")
            sta="意向合作"
          else if(this.beforsearch[i].status=="34")
            sta="不合作"
          else sta="已入库"
          let des = this.beforsearch[i].desc_str
          //console.log(name.includes(this.searchkey),type.includes(this.searchkey_type))
          if (pro_name.includes(this.searchkey) || per_type.includes(this.searchkey) || per_name.includes(this.searchkey) || mob.includes(this.searchkey) 
          || pho.includes(this.searchkey) || mai.includes(this.searchkey) || com.includes(this.searchkey) || sch.includes(this.searchkey) 
          || out.includes(this.searchkey) || des.includes(this.searchkey) || emp_name.includes(this.searchkey) || sta.includes(this.searchkey) ) {
            this.aftersearch.push(this.beforsearch[i]);
            // console.log("push")
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
    // download($index) {
    //   var fileDownload=require('js-file-download')
    //   this.axios({
    //     method: 'get',
    //     url: "/api/proposer/download",
    //     responseType: 'blob', 
    //     // params: 
    //   }).then(res => {
    //     console.log(res)
    //     let contentDisposition = res.headers['content-disposition'];
    //     // console.log(contentDisposition.substring(contentDisposition.indexOf('=')+1))
    //    let fileName = window.decodeURI(contentDisposition.substring(contentDisposition.indexOf('=')+1));
    //     console.log('fileName=' + fileName);
    //     // let content = res.headers['content-disposition'].split(';') // 从响应头中拿到文件名
    //     // let fileName = content[1].split('=')[1] // 从响应头中拿到文件名
    //     // console.log(fileName)
    //     fileDownload(res.data, fileName);
    //   })
    // },
    showpinstorage($index) {

      this.tempProject = this.list[$index];
      if(this.tempProject.status!="3"){
        if(this.tempProject.status=="5")
        this.$message.error("该项目已入库");
        else this.$message.error("未达到意向合作");
        return;
      }
      this.tempProject.emp_one_id=this.now_id
      this.emp_one_name=this.find_employerin(this.tempProject.emp_one_id)
      this.tempProject.emp_now_id=this.tempProject.employerin_id
      this.dialogStatus = "create";
      this.dialogpinstorageFormVisible = true;
      // console.log("tempProject",this.tempProject)
      // console.log("content",this.tempProject.id)
    },
    pinstorage() {
      let tempp_id={}
      tempp_id=this.tempProject
      tempp_id.proposer_id=this.tempProject.id
      console.log("tempp_id", tempp_id);
      this.api({
        url: "/proposer/addInboundProject",
        method: "post",
        data: tempp_id,
      }).then(() => {
        this.getList();
        this.dialogpinstorageFormVisible = false;
      });
      // let files = document.querySelector("#fileInput").files;
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
  },
};
</script>
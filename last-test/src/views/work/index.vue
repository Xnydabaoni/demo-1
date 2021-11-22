<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button
            type="primary"
            icon="plus"
            @click="showCreate"
            v-if="hasPerm('work:add')"
            >添加员工
          </el-button>
          <div style="margin-top: 15px;">
 
       <el-col :span="10">
          <el-input placeholder="请输入搜索内容" v-model="searchkey"  clearable v-on:keyup.enter.native="search" class="input-with-select">                
         </el-input>        
         </el-col>
    <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
  </el-input>
</div>
          
        </el-form-item>
      </el-form>
      
      
      
    </div>
    <el-table
      :data="list"
      v-loading.body="listLoading"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="ename"
        label="员工姓名"
        style="width: 60px"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="deptno"
        label="部门"
        style="width: 60px"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="sal"
        label="薪水"
        style="width: 60px"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="edate"
        label="入职日期"
        style="width: 60px"
      >
      <template v-slot="scope">{{ scope.row.edate|dateFormatFilter }}</template>
      </el-table-column>
      <el-table-column
        align="center"
        prop="eage"
        label="年龄"
        style="width: 60px"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="eaddress"
        label="地址"
        style="width: 60px"
      ></el-table-column>
      <el-table-column
        align="center"
        label="管理"
        width="200"
        v-if="hasPerm('record:update')"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="edit"
            @click="showUpdate(scope.$index)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="delete"
            v-if="hasPerm('work:delete')"
            @click="userdelete(scope.$index, scope.row)"
            >删除
          </el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        
        class="small-space"
        :model="tempEmp"
        label-position="left"
        label-width="60px"
        style="width: 300px; margin-left: 50px"
      >
        <el-form-item label="姓名">
          <el-input placeholder="请输入姓名" type="text" v-model="tempEmp.ename"> </el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-input placeholder="请输入部门" type="text" v-model="tempEmp.deptno"> </el-input>
        </el-form-item>
        <el-form-item label="薪水">
          <el-input placeholder="请输入薪水" type="text" v-model="tempEmp.sal"> </el-input>
        </el-form-item>
        <el-form-item label="日 期" >
          <el-date-picker type="date" placeholder="选择日期" style="width:100%" v-model="tempEmp.edate"></el-date-picker>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input placeholder="请输入年龄" type="text" v-model="tempEmp.eage"> </el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input placeholder="请输入地址" type="text" v-model="tempEmp.eaddress"> </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="success"
          @click="createArticle"
          >添  加</el-button
        >
        <el-button type="primary" v-else @click="updateArticle"
        
          >确  定</el-button
        >
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
        firstdata:[],
      totalCount: 0, //分页组件--数据总条数
      list: [], //表格的数据
      listLoading: false, //数据加载等待动画
      listQuery: {
        pageNum: 1, //页码
        pageRow: 5, //每页条数
        name: "",
      },
      dialogStatus: "create",
      dialogFormVisible: false,
      textMap: {
        update: "修改",
        create: "员工信息",
      },
      tempEmp: {
        ename: "",
        deptno: "",
        sal: "",
        edate: "",
        eage: "",
        eaddress: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
     search(){
        console.log('this.searchkey-->',this.searchkey);
         if(this.searchkey!=''){
           this.list=this.firstdata;
           this.aftersearch=[];
           this.beforsearch=this.list;
           for(let i=0;i<this.beforsearch.length;i++){
             if(this.searchkey==this.beforsearch[i].ename){
               this.aftersearch.push(this.beforsearch[i]);
               this.list=this.aftersearch;
               this.totalCount=1;
             }
           }
         }else{
           this.getList();
         }
      },
    userdelete($index) {
      let _vue = this;
      this.$confirm("确定删除此用户?", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
        type: "warning",
      }).then(() => {
        var work = _vue.list[$index];
        console.log(work);

        _vue
          .api({
            url: "/emp/deleteEmp",
            method: "post",
            data: work,
          })
          .then(() => {
            _vue.getList();
          })
          .catch(() => {
            _vue.$message.error("删除失败");
          });
      });
    },
    getList() {
      //查询列表
      if (!this.hasPerm("record:list")) {
        return;
      }
      this.listLoading = true;
      this.api({
        url: "/emp/list",
        method: "get",
        params: this.listQuery,
      }).then((data) => {
        this.listLoading = false;
        this.list = data.list;
        this.firstdata=data.list;
        this.totalCount = data.totalCount;
      });
    },
    handleSizeChange(val) {
      //改变每页数量
      this.listQuery.pageRow = val;
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
      return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1;
    },
    showCreate() {
      //显示新增对话框
      this.tempEmp.ename = "";
      this.tempEmp.deptno = "";
      this.tempEmp.sal = "";
      this.tempEmp.edate = "";
      this.tempEmp.eage = "";
      this.tempEmp.eaddress = "";
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    showUpdate($index) {
      //显示修改对话框
      this.tempEmp.ename = this.list[$index].ename;
      this.tempEmp.deptno = this.list[$index].deptno;
      this.tempEmp.sal = this.list[$index].sal;
       this.tempEmp.edate = this.list[$index].edate;
      this.tempEmp.eage = this.list[$index].eage;
      this.tempEmp.eaddress = this.list[$index].eaddress;

      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
        dateFormat(row,column){ //row:得到当前行数据 column :列信息;
            let t=new Date(row.edate);//row 表示一行数据, udate 表示要格式化的字段名称
            let m = (t.getMonth()+1) < 10 ? '0'+(t.getMonth()+1) :(t.getMonth()+1);
            let d =  t.getDate() < 10 ? '0'+t.getDate() : t.getDate();
            return t.getFullYear()+"-"+ m +"-" + d;
        },
            filters:{
        dateFormatFilter(val){
            let t=new Date(val);//row 表示一行数据, udate 表示要格式化的字段名称
            let m = (t.getMonth()+1) < 10 ? '0'+(t.getMonth()+1) :(t.getMonth()+1);
            let d =  t.getDate() < 10 ? '0'+t.getDate() : t.getDate();
            return t.getFullYear()+"-"+ m +"-" + d;
        }
    },
    createArticle() {
      var e=new Date(this.tempEmp.edate);
            e=e.getFullYear() + '-' + (e.getMonth() + 1) + '-' + e.getDate(); 
            this.tempEmp.edate=e;
      //保存新文章
      this.api({
        url: "/emp/addEmp",
        method: "post",
        data: this.tempEmp,
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
      });
    },
 
    updateArticle(){
      var d=new Date(this.tempEmp.edate);
            d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
            this.tempEmp.edate=d;
        //修改商品
        this.api({
          url: "/emp/updateEmp",
          method: "post",
          data: this.tempEmp
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
    
  },
};
</script>

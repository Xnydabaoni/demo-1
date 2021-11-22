<!--  -->
<template>
<div class='app-container'>
    <div class="filter-container">
      <el-form>
        <el-form-item>

            <el-row :gutter="40" >
              <el-col :span="7">
                 <el-input placeholder="请输入内容"  v-model="searchkey"  clearable v-on:keyup.enter.native="search" >
            <el-button slot="append"  icon="el-icon-search" @click="search" ></el-button>
            </el-input>
              </el-col>
              <el-col :span="7"> 
                <el-button type="primary" icon="plus" @click="showCreate" v-if="hasPerm('client:add')">添加</el-button></el-col>
              <el-col :span="7">
                <el-button type="primary" @click="ExportExcel" >导出excel表格 </el-button>
              </el-col>
            </el-row>
        </el-form-item>
      </el-form>
    </div>
     <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
        <el-table-column label="会员ID" prop="cid"></el-table-column>
        <el-table-column label="姓名" prop="cname"></el-table-column>
        <el-table-column label="地址" prop="caddress"></el-table-column>
        <el-table-column label="电话" prop="ctel"></el-table-column>
        <el-table-column label="日期" prop="cdate">
          <template v-slot="scope">{{ scope.row.cdate|dateFormatFilter}}</template>
        </el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('article:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" v-if="hasPerm('client:delete')" @click="removeClient(scope.$index)">删除 </el-button>
        </template>
      </el-table-column>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" append-to-body>
      <el-form class="small-space" :model="tempClient" label-position="left" label-width="60px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="会员ID">
          <el-input type="text" v-model="tempClient.cid">
          </el-input>
        </el-form-item>
        
        <el-form-item label="姓名">
          <el-input type="text" v-model="tempClient.cname">
          </el-input>
        </el-form-item>

        <el-form-item label="地址">
          <el-input type="text" v-model="tempClient.caddress">
          </el-input>
        </el-form-item>

        <el-form-item label="电话">
          <el-input type="text" v-model="tempClient.ctel">
          </el-input>
        </el-form-item>

        <el-form-item label="日 期" >
                    <el-date-picker type="date" placeholder="选择日期" style="width:100%" v-model="tempClient.cdate"></el-date-picker>
        </el-form-item>
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createClient">创 建</el-button>
        <el-button type="primary" v-else  @click="updateClient" >修 改</el-button>
      </div>
    </el-dialog>
      
       
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
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '添加客户'
        },
        tempClient: {
          cid: "",
          cname:"",
          caddress:"",
          ctel:"",
          cdate:"",
        }
    }
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
             if(this.searchkey==this.beforsearch[i].cid){
               this.aftersearch.push(this.beforsearch[i]);
               this.list=this.aftersearch;
               this.totalCount=1;
             }
           }
         }else{
           this.getList();
         }
      },

    getList() {
        //查询列表
        if (!this.hasPerm('client:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/client/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.firstdata=data.list;
          this.totalCount = data.totalCount;
        })
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
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
      },

      showCreate() {
        //显示新增对话框
        this.tempClient.cid = "";
        this.tempClient.cname = "";
        this.tempClient.cdate = "";
        this.tempClient.caddress="";
        this.tempClient.ctel="";
        this.dialogStatus = "create";
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        //显示修改对话框
        this.tempClient.cid = this.list[$index].cid;
        this.tempClient.cname = this.list[$index].cname;
        this.tempClient.cdate = this.list[$index].cdate;
        this.tempClient.caddress=this.list[$index].caddress;
        this.tempClient.ctel=this.list[$index].ctel
        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      removeClient($index) {
        let _vue = this;
        this.$confirm('确定删除此用户?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          var client = _vue.list[$index];
          console.log(client)
          
          _vue.api({
            url: "/client/deleteClient",
            method: "post",
            data: client
          }).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },

        createClient() {
        //添加
        var d =new Date(this.tempClient.cdate);
        d=d.getFullYear() +'-' +(d.getMonth()+1) + '-' +d.getDate();
         this.tempClient.cdate=d;
        this.api({
          url: "/client/addClient",
          method: "post",
          data: this.tempClient
        }).then(() => {
          this.getList();
        this.dialogFormVisible = false
        })

      },
        updateClient() {
        //修改
        var d =new Date(this.tempClient.cdate);
        d=d.getFullYear() +'-' +(d.getMonth()+1) + '-' +d.getDate();
        this.tempClient.cdate=d;
        this.api({
          url: "/client/updateClient",
          method: "post",
          data: this.tempClient
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },

      ExportExcel(){
          window.open("/api/client/list/export");
      },
},
     filters:{
    dateFormatFilter(val){
        let t=new Date(val);//row 表示一行数据, udate 表示要格式化的字段名称
            let m = (t.getMonth()+1) < 10 ? '0'+(t.getMonth()+1) :(t.getMonth()+1);
            let d =  t.getDate() < 10 ? '0'+t.getDate() : t.getDate();
            return t.getFullYear()+"-"+ m +"-" + d;
    }
    },

}
</script>


<style lang='scss' scoped>

</style>
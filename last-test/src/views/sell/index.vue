<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-row>
            <el-col :span="6">
              <el-input placeholder="请输入雇员编号"   v-model="searchkey" clearable v-on:keyup.enter.native="search">
                        <el-button slot="append"  icon="el-icon-search" @click="search" ></el-button>
              </el-input>
            </el-col>
            <el-col :span="1">&#8195;
            </el-col>
            <el-button type="primary" icon="plus" size="meduim" @click="showCreate" v-if="hasPerm('goods:add')">添加</el-button>
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
      <el-table-column align="center" prop="eid" label="雇员编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="deptno" label="部门编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="sal" label="薪水" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="edate" label="入职日期" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="eage" label="雇员年龄" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="eaddress" label="地址" style="width: 60px;"></el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('goods:update')">
        <template slot-scope="scope">
          <el-button type="primary" icon="edit" size="mini" @click="showUpdate(scope.$index)">修改</el-button>
          <el-button type="danger" icon="delete" size="mini" v-if="hasPerm('goods:delete')"
                     @click="deleteGoods(scope.$index)">删除
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
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

     <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="35%">
      <el-form class="small-space" :model="tempGoods" label-position="left" label-width="100px" :rules="checkRoles" ref="tempGoods">
        <el-form-item label="雇员编号">
          <el-input type="text" v-model="tempGoods.eid">
          </el-input>
        </el-form-item>

        <el-form-item label="部门编号">
          <el-select placeholder="请输入部门编号" v-model="tempGoods.deptno">
            <el-option label="部门1" value="1" ></el-option>
            <el-option label="部门2" value="2" ></el-option>
            <el-option label="部门3" value="3" ></el-option>
            <el-option label="部门4" value="4" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪水" prop="sal">
          <el-input type="text" v-model="tempGoods.sal">
          </el-input>
        </el-form-item>
        <el-form-item label="入职日期">
           <el-date-picker type="date" placeholder="选择日期" style="width:100%" v-model="tempGoods.edate"></el-date-picker>
           <!-- <el-input type="text" v-model="tempGoods.edate" v-show="false"></el-input> -->
        </el-form-item>
        <el-form-item label="年龄" prop="eage">
          <el-input type="text" v-model="tempGoods.eage">
          </el-input>
        </el-form-item>
        <el-form-item label="地址" prop="eaddress">
          <el-input type="text" v-model="tempGoods.eaddress">
          </el-input>
        </el-form-item>
        
       
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createGoods('tempGoods')">创 建</el-button>
        <el-button type="primary" v-else @click="updateGoods('tempGoods')" >修 改</el-button>
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
        list: [],//表格的数据

        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageRow: 5,//每页条数
          name: ''
        },
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '创建'
        },
        tempGoods: {
          eid:0,
          deptno:'',
          sal:'',
          edate:'',
          eage:'',
          eaddress:'',
        },
        date:'',
      checkRoles:{
                eid:[
                    {required: true, message: '雇员编号不能为空', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                sal:[
                    {required: true, message: '雇员薪水不能为空', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                eage:[
                    {required: true, message: '雇员年龄不能为空', trigger: 'blur' },
                    { min: 2, max: 3, message: '长度在 2 到 3 个字符', trigger: 'blur' }
                ],
                eaddress:[
                    {required: true, message: '居住地址不能为空', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
               
     },
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
             if(this.searchkey==this.beforsearch[i].eid){
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
        if (!this.hasPerm('sell:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/emps/list",
          method: "get",
          params: this.listQuery
        }).then(data => {
            console.log(data);
          this.listLoading = false;
          this.list = data.list;
          this.firstdata=data.list;
          console.log(this.list);
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
        this.tempGoods.eid='';
        this.tempGoods.deptno='';
        this.tempGoods.sal='';
        this.tempGoods.edate='';
        this.tempGoods.eage='';
        this.tempGoods.eaddress='';

       this.dialogStatus = "create"
        this.dialogFormVisible = true
       
      },
      showUpdate($index) {
        this.tempGoods.eid=this.list[$index].eid;
        this.tempGoods.deptno=this.list[$index].deptno;
        this.tempGoods.sal=this.list[$index].sal;
        this.tempGoods.edate=this.list[$index].edate;
        this.tempGoods.eage=this.list[$index].eage;
        this.tempGoods.eaddress=this.list[$index].eaddress;

        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createGoods(tempGoods) {
        this.$refs[tempGoods].validate((valid) => {
          if (valid) {
            // alert('submit!');
            var d=new Date(this.tempGoods.edate);
            d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
            this.tempGoods.edate=d;
            this.api({
              url: "/emps/addEmps",
              method: "post",
              data: this.tempGoods
            }).then(() => {
              this.getList();
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

        
      },

      updateGoods(tempGoods) {
        this.$refs[tempGoods].validate((valid) => {
          if (valid) {
            var d=new Date(this.tempGoods.edate);
            d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
            this.tempGoods.edate=d;
            this.api({
              url: "/emps/updateEmps",
              method: "post",
              data: this.tempGoods
            }).then(() => {
              this.getList();
              this.dialogFormVisible = false
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

        
      },
      deleteGoods($index) {
        let _vue = this;
        this.$confirm('确定删除此用户?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          var goods = _vue.list[$index];
          console.log(goods)
          
          _vue.api({
            url: "/emps/deleteEmps",
            method: "post",
            data: goods
          }).then(() => {
            _vue.getList()
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },
      
      
     
    }
  }
</script>

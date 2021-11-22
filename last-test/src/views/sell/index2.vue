<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-row>
            <el-col :span="6">
              <el-input placeholder="请输入订单编号"   v-model="searchkey" clearable v-on:keyup.enter.native="search">
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
      <el-table-column align="center" prop="oid" label="订单编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="odate" label="订单日期" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="gid" label="商品编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="cid" label="客户编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="eid" label="雇员编号" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="otype" label="订单状态" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="onumber" label="购买数量" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="oprice" label="订单金额" style="width: 60px;"></el-table-column>
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
        <el-form-item label="订单编号" >
          <el-input type="text" v-model="tempGoods.oid"> </el-input>
        </el-form-item>
        <el-form-item label="订单日期" >
          <el-date-picker type="date" placeholder="选择日期" style="width:100%" v-model="tempGoods.odate"></el-date-picker>
        </el-form-item>

        <el-form-item label="商品编号" prop="gid">
          <el-input type="text" v-model="tempGoods.gid">
          </el-input>
        </el-form-item>
        <el-form-item label="客户编号" prop="cid">
          <el-input type="text" v-model="tempGoods.cid">
          </el-input>
        </el-form-item>
        <el-form-item label="雇员编号">
           <!-- <el-date-picker type="date" placeholder="选择日期" style="width:100%" v-model="tempGoods.edate"></el-date-picker> -->
           <el-input type="text" v-model="tempGoods.eid"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="otype">
          <el-input type="text" v-model="tempGoods.otype">
          </el-input>
        </el-form-item>
        <el-form-item label="购买数量" prop="onumber">
          <el-input type="text" v-model="tempGoods.onumber">
          </el-input>
        </el-form-item>
        <el-form-item label="订单金额" prop="oprice">
          <el-input type="text" v-model="tempGoods.oprice">
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
          oid:0,
          gid:'',
          cid:'',
          eid:'',
          otype:'',
          onumber:'',
          oprice:'',
          odate:'',

        },
      checkRoles:{
                gid:[
                    {required: true, message: '商品编号不能为空', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                cid:[
                    {required: true, message: '客户编号不能为空', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                onumber:[
                    {required: true, message: '购买数量不能为空', trigger: 'blur' },
                    { min: 1, max: 3, message: '长度在 1 到 3 个字符', trigger: 'blur' }
                ],
                oprice:[
                    {required: true, message: '订单金额不能为空', trigger: 'blur' },
                    { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
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
             if(this.searchkey==this.beforsearch[i].oid){
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
          url: "/orders/list",
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
        this.tempGoods.oid='';
        this.tempGoods.gid='';
        this.tempGoods.cid='';
        this.tempGoods.eid='';
        this.tempGoods.otype='';
        this.tempGoods.onumber='';
        this.tempGoods.oprice='';
        this.tempGoods.odate='';

       this.dialogStatus = "create"
        this.dialogFormVisible = true
       
      },
      showUpdate($index) {
        this.tempGoods.oid=this.list[$index].oid;
        this.tempGoods.gid=this.list[$index].gid;
        this.tempGoods.cid=this.list[$index].cid;
        this.tempGoods.eid=this.list[$index].eid;
        this.tempGoods.otype=this.list[$index].otype;
        this.tempGoods.onumber=this.list[$index].onumber;
        this.tempGoods.oprice=this.list[$index].oprice;
        this.tempGoods.odate=this.list[$index].odate;

        this.dialogStatus = "update"
        this.dialogFormVisible = true
      },
      createGoods(tempGoods) {
        this.$refs[tempGoods].validate((valid) => {
          if (valid) {
            // alert('submit!');
            //保存新文章
            var d=new Date(this.tempGoods.odate);
            d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
            this.tempGoods.odate=d;
            this.api({
              url: "/orders/addOrders",
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
            // alert('submit!');
            //修改商品
            var d=new Date(this.tempGoods.odate);
            d=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); 
            this.tempGoods.odate=d;
            this.api({
              url: "/orders/updateOrders",
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
            url: "/orders/deleteOrders",
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

1<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button type="success"  icon="el-icon-search"   @click="search">搜索</el-button>
          <el-button type="primary" icon="plus" @click="showAdd" v-if="hasPerm('goods:add')">添加商品
          </el-button>
           <el-col :span="10">
          <el-input placeholder="请输入商品序号"  v-model="searchkey" clearable v-on:keyup.enter.native="search">                
         </el-input>        
         </el-col>          
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit fixed
              highlight-current-row>
      <el-table-column align="center" prop="gid"   label="序号" width="80" sortable >
        <!-- <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template> -->
      </el-table-column>
      <el-table-column align="center" prop="gname" label="商品名" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="gphoto" label="图片" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="gtypeid" label="类型" style="width: 60px;" sortable></el-table-column>
      <el-table-column align="center" prop="gbrandid" label="品牌" style="width: 60px;" ></el-table-column>
      <el-table-column align="center" prop="gdetail" label="详情" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="gsell" label="是否上架" style="width: 60px;"></el-table-column>
      <el-table-column align="center" prop="gprice" label="价格" style="width: 60px;"  ></el-table-column>
      <el-table-column align="center" label="管理" width="200" v-if="hasPerm('goods:update')">
        <template slot-scope="scope">
          <el-button type="primary" class="el-icon-edit" @click="showUpdate(scope.row)" size="small">修改</el-button>
          <el-button type="danger"  class="el-icon-delete" v-if="hasPerm('goods:delete') "  @click="deleteGoods(scope.$index) " size="small" >删除 </el-button>
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
    <!-- 添加商品 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="displayAddDialog" width="40%"  top=5vh :before-close="handleClose">
        <el-alert
         title="请根据实际情况填写商品信息"
         type="warning" show-icon style="margin-top:-30p;margin-bottom:10px">
        </el-alert> 
       <el-form  :label-position="labelPosition"  label-width="70px"  size="medium" ref="tempGoods" :rules="addRoles" :model="tempGoods" >
       <el-form-item label="商品序号" prop="gid">
                    <el-input placeholder="请输入商品序号" v-model=" tempGoods.gid" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="gname">
                    <el-input placeholder="请输入商品名称" v-model=" tempGoods.gname" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品图片" prop="gphoto">
                   <el-input placeholder="请添加商品图片，若没有则填写暂无" v-model=" tempGoods.gphoto" clearable></el-input>
                </el-form-item>
                <el-form-item label="分类编号" prop="gtypeid">
                    <el-input placeholder="请输入分类编号" v-model=" tempGoods.gtypeid" clearable ></el-input>
                </el-form-item>
                <el-form-item label="品牌id" prop="gbrandid">
                    <el-input placeholder="请输入品牌id" clearable v-model=" tempGoods.gbrandid" ></el-input>
                </el-form-item>
                <el-form-item label="商品详细信息" prop="gdetail">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" clearable placeholder="请输入商品详细信息" v-model=" tempGoods.gdetail"></el-input>
                </el-form-item>
                <el-form-item label="上架状态" prop="gsell" >
                  <el-input placeholder="请输入在售或已下架" clearable v-model=" tempGoods.gsell" ></el-input>
                </el-form-item>
                 <el-form-item label="商品单价" prop="gprice">
                    <el-input placeholder="请输入商品单价" clearable  v-model=" tempGoods.gprice"></el-input>
                </el-form-item> 
                <el-form-item>
                 <el-button @click="resetForm">重 置</el-button>
                 <el-button type="primary"  @click="addGoods" >确认添加</el-button> 
                 <el-button type="primary" @click="handleClose " >取消添加</el-button>              
                </el-form-item>              
               </el-form>               
    </el-dialog>
<!-- 修改商品 -->
 <el-dialog :title="textMap[dialogStatus]" :visible.sync="displayUpdateDialog" width="40%"  top=5vh :before-close="handleClose1">
        <el-alert
         title="请根据实际情况修改商品信息"
         type="warning" show-icon style="margin-top:-30p;margin-bottom:10px">
        </el-alert> 
       <el-form  :label-position="labelPosition"  label-width="70px" size="medium " ref="tempGoods" :rules="addRoles" :model="tempGoods" >
       <el-form-item label="商品序号" prop="gid">
                    <el-input  disabled v-model=" tempGoods.gid" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品名称" prop="gname">
                    <el-input placeholder="请输入商品名称" v-model=" tempGoods.gname" clearable></el-input>
                </el-form-item>
                <el-form-item label="商品图片" prop="gphoto">
                   <el-input placeholder="请添加商品图片，若没有则填写暂无" v-model=" tempGoods.gphoto" clearable></el-input>
                </el-form-item>
                <el-form-item label="分类编号" prop="gtypeid">
                    <el-input placeholder="请输入分类编号" v-model=" tempGoods.gtypeid" clearable ></el-input>
                </el-form-item>
                <el-form-item label="品牌id" prop="gbrandid">
                    <el-input placeholder="请输入品牌id" clearable v-model=" tempGoods.gbrandid" ></el-input>
                </el-form-item>
                <el-form-item label="商品详细信息" prop="gdetail">
                  <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" clearable placeholder="请输入商品详细信息" v-model=" tempGoods.gdetail"></el-input>
                </el-form-item>
                <el-form-item label="上架状态" prop="gsell" >
                  <el-input placeholder="请输入在售或已下架" clearable v-model=" tempGoods.gsell" ></el-input>
                </el-form-item>
                 <el-form-item label="商品单价" prop="gprice">
                    <el-input placeholder="请输入商品单价" clearable  v-model=" tempGoods.gprice"></el-input>
                </el-form-item> 
                <el-form-item>
                 <el-button @click="resetForm">重 置</el-button>
                 <el-button type="primary"  @click="updateGoods" >保 存</el-button> 
                 <el-button type="primary" @click="handleClose1 " >取消修改</el-button>              
                </el-form-item>              
               </el-form>               
    </el-dialog>
  </div>
</template>
<script>

  export default {
    data() {
      return {
       
        searchkey:'',//搜索值
        beforsearch:[],//搜索前
        aftersearch:[],//搜索后
        firstdata:[],//第一次获得的数据
        labelPosition: 'top',//对话框对齐方式
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
       
        listQuery: {
          pageNum: 1,//页码
          pageRow: 10,//每页条数
          name: ''
        },
        dialogStatus: 'create',
        displayAddDialog: false,
        displayUpdateDialog: false,
        textMap: {
          update: '编辑商品',
          create:' 添加商品'
        },
       
         tempGoods:{
                gid:'',
                gname:'',
                gphoto:'',
                gtypeid:'',
                gbrandid:'',
                gdetail:'',
                gsell:'',
                gprice:''
         },
         addRoles:{
                 gid:[
                    {required: true, message: '商品id不能为空', trigger: 'blur' }
                    
                ],
                gname:[
                    {required: true, message: '请输入商品名称', trigger: 'blur' }
                   
                ],
                gtypeid:[
                    {required: true, message: '分类编号不能为空', trigger: 'blur' }
                ],
                gbrandid:[   {required: true, message: '品牌id不能为空', trigger: 'blur' }],
                gdetail:[  {required: true, message: '请输入商品详细信息', trigger: 'blur' }],
                gsell:[ {required: true, message: '必需填写商品状态', trigger: 'blur' }],
                gprice:[
                    { required: true, message: '请输入商品单价', trigger: 'blur' },
                   
                ]
            },
            updateRoles:{
                 gid:[
                    {required: true, message: '商品id不能为空', trigger: 'blur' }
                    
                ],
                gname:[
                    {required: true, message: '请输入商品名称', trigger: 'blur' }
                   
                ],
                gtypeid:[
                    {required: true, message: '分类编号不能为空', trigger: 'blur' }
                ],
                gbrandid:[   {required: true, message: '品牌id不能为空', trigger: 'blur' }],
                gdetail:[  {required: true, message: '请输入商品详细信息', trigger: 'blur' }],
                gsell:[ {required: true, message: '必需填写商品状态', trigger: 'blur' }],
                gprice:[
                    { required: true, message: '请输入商品单价', trigger: 'blur' },
                   
                ]
            },

      }
    },
    created() {
        //取数据
      this.getList();
    },
    methods: {
      search(){//精确搜索
        console.log('this.searchkey-->',this.searchkey);
         if(this.searchkey!=''){
           this.list=this.firstdata;
           this.aftersearch=[];
           this.beforsearch=this.list;
           for(let i=0;i<this.beforsearch.length;i++){
             if(this.searchkey==this.beforsearch[i].gid){
               this.aftersearch.push(this.beforsearch[i]);
               this.list=this.aftersearch;
               this.totalCount=1;
             }
           }
         }else{
           this.getList();
         }
      },
  
        handleClose() {//退出添加
        this.$confirm('确认退出吗，已填写的信息将不会保存！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if (action === 'confirm') {
            console.log('确定')
            this.resetForm()
            this.displayAddDialog=false 
           
          }
          else {
            console.log('取消')
          }
        }
      })
    },
      handleClose1() {//退出修改
        this.$confirm('确认退出吗，已修改的信息将不会保存！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: action => {
          if (action === 'confirm') {
            console.log('确定')
            this.displayUpdateDialog=false 
            this.resetForm1()
          }
          else {
            console.log('取消')
          }
        }
      })
    },
   
      resetForm (){
          this.$refs.tempGoods.resetFields()//重置添加               
           },
      resetForm1 (){
          this.$refs.tempGoods.resetFields()//重置修改              
           }, 
         
      getList() {
        //查询列表
        if (!this.hasPerm('goods:list')) {
          return
        }
        this.listLoading = true;
        this.api({
          url: "/goods/list",
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
      showAdd() {
        //显示新增对话框
        this.tempGoods.gid = "";
        this.tempGoods.gname = "";
        this.tempGoods.gphoto = "";
        this.tempGoods.gtypeid = "";
        this.tempGoods.gbrandid = "";
        this.tempGoods.gdetail = "";
        this.tempGoods.gsell = "";
        this.tempGoods.gprice = "";
        this.dialogStatus = "create"
        this.displayAddDialog = true
      },
       showUpdate(goods) {
       //显示修改对话框
        this.dialogStatus = "update"
        this.displayUpdateDialog =true;
            //初使化;
        this.tempGoods.gid=goods.gid;
        this.tempGoods.gname=goods.gname;
        this.tempGoods.gphoto=goods.gphoto;
        this.tempGoods.gtypeid=goods.gtypeid;
        this.tempGoods.gbrandid=goods.gbrandid;
        this.tempGoods.gdetail=goods.gdetail;
        this.tempGoods.gsell=goods.gsell;
        this.tempGoods.gprice=goods.gprice;
      },
       addGoods() {
        //添加商品
        let _vue=this
        this.api({
          url: "/goods/add",
          method: "post",
          data: this.tempGoods
        }).then(() => {
          this.getList();
          this.displayAddDialog = false
          _vue.$message.success("添加成功")
        })
      },
      updateGoods() {
        //修改商品
        let _vue=this
        this.api({
          url: "/goods/update",
          method: "post",
          data: this.tempGoods
        }).then(() => {
          this.getList();
          this.displayUpdateDialog = false
          _vue.$message.success("修改成功")
        })
      },
        deleteGoods($index) {
          //删除商品
        let _vue = this;
        this.$confirm('确定删除此商品?', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',  
          type: 'warning'
        }).then(() => {
          var goods = _vue.list[$index];
          console.log(goods)
          _vue.api({
            url: "/goods/delete",
            method: "post",
            data: goods
          }).then(() => {
            _vue.getList(),
             _vue.$message.success("删除成功")
          }).catch(() => {
            _vue.$message.error("删除失败")
          })
        })
      },
    }
  }
</script>

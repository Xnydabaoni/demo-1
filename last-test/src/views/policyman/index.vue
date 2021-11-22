<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button
            type="primary"
            icon="plus"
            @click="showCreate"
            v-if="hasPerm('article:add')"
            >添加
          </el-button>
          <el-input
            placeholder="请输入政策标题进行查找"
            style="width: 300px; margin-left: 50px"
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
      <!-- <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="scope.row.id"> </span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="政策标题"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.zhengce_title }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="政策内容"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.zhengce_des }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="受理时间"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.start_time }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="最终截止时间"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.last_time }}</span></template
        >
      </el-table-column>
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
          <el-button
            type="primary"
            icon="edit"
            @click="showdownload(scope.$index)"
            >下载</el-button
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
    >
      <el-form
        class="small-space"
        :model="tempArticle"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left: 50px"
      >
        <el-form-item label="政策标题">
          <el-input type="text" v-model="tempArticle.zhengce_title"> </el-input>
        </el-form-item>
        <el-form-item label="政策内容">
          <el-input type="text" v-model="tempArticle.zhengce_des"> </el-input>
        </el-form-item>
        <el-form-item label="受理时间">
          <el-input type="text" v-model="tempArticle.start_time"> </el-input>
        </el-form-item>
        <!-- <el-form-item label="受理时间">
          <el-date-picker
            v-model="tempArticle.start_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择受理时间"
          >
          </el-date-picker>
        </el-form-item> -->
        <el-form-item label="最终截止时间">
          <el-date-picker
            v-model="tempArticle.last_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择最终截止时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item>
        <!-- <el-upload
          ref="uploadExcel"
          action="#"
          :limit=limitNum
          :auto-upload="false"
          :before-upload="beforeUploadFile"
          :on-change="fileChange"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList">
          <el-button size="small" plain>选择文件</el-button>
          <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
        </el-upload> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCreateFormVisible = false">取 消</el-button>
        <el-button
          v-if="dialogStatus == 'create'"
          type="success"
          @click="createArticle"
          >创 建</el-button
        >
      </div>
    </el-dialog>
    <!-- xiugai -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        class="small-space"
        :model="tempArticle"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left: 50px"
      >
        <el-form-item label="政策标题">
          <el-input type="text" v-model="tempArticle.zhengce_title"> </el-input>
        </el-form-item>
        <el-form-item label="政策内容">
          <el-input type="text" v-model="tempArticle.zhengce_des"> </el-input>
        </el-form-item>
        <el-form-item label="受理时间">
          <el-input type="text" v-model="tempArticle.start_time"> </el-input>
        </el-form-item>
        <el-form-item label="最终截止时间">
          <el-date-picker
            v-model="tempArticle.last_time"
            type="datetime"
            placeholder="请选择最终截止时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item>
        <!-- <el-upload
          ref="uploadExcel"
          action="/policy/upload"
          :limit=limitNum
          :auto-upload="false"
          :before-upload="beforeUploadFile"
          :on-change="fileChange"
          :on-exceed="exceedFile"
          :on-success="handleSuccess"
          :on-error="handleError"
          :file-list="fileList">
          <el-button size="small" plain>选择文件</el-button>
          <el-button size="small" type="primary" @click="uploadFile">立即上传</el-button>
        </el-upload> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus != 'create'" @click="deleteUser"
          >删 除</el-button
        >
        <el-button
          v-if="dialogStatus != 'create'"
          type="success"
          @click="updateArticle"
          >修 改</el-button
        >
      </div>
    </el-dialog>
    <!-- download -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogshowdownloadFormVisible"
    >
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
      <el-button @click="dialogshowdownloadFormVisible = false">取 消</el-button>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchkey: "",
      search_status: 0,
      beforsearch: [],
      aftersearch: [],
      totalCount: 0, //分页组件--数据总条数
      list: [], //表格的数据
      total_list:[],//所有数据
      download_list: [],
      listLoading: false, //数据加载等待动画
      download_listLoading: false,
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10, //每页条数
        name: "",
      },
      dialogStatus: "create",
      dialogFormVisible: false,
      dialogCreateFormVisible: false,
      dialogshowdownloadFormVisible: false,
      textMap: {
        update: "编辑",
        create: "编辑",
      },
      tempArticle: {
        id: "",
        content: "",
      },
      tempDownload: {
        id: "",
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // getList() {
    //   //查询列表
    //   if (!this.hasPerm("article:list")) {
    //     return;
    //   }
    //   this.listLoading = true;
    //   this.api({
    //     url: "/policy/query",
    //     method: "get",
    //     params: this.listQuery,
    //   }).then((data) => {
    //     this.listLoading = false;
    //     this.list = data.list;
    //     this.totalCount = data.totalCount;
    //     console.log(this.totalCount);
    //   });
    // },
    getList() {
        //查询列表
        // if (!this.hasPerm('article:list')) {
        //   return
        // }
        this.listLoading = true;
        this.api({
          url: "/policy/query",
          method: "get",
          params: this.listQuery
        }).then(data => {
          
          if(this.search_status==0){
            console.log("data",data)
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
        this.api({//全部查询
          url: "/policy/queryList",
          method: "get",
        }).then(data => {
          this.total_list=data.list
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
    // getIndex($index) {
    //   //表格序号
    //   return (this.listQuery.pageNum - 1) * this.listQuery.pageRow + $index + 1
    // },
    showCreate() {
      //显示新增对话框
      this.tempArticle={};
      this.dialogStatus = "create";
      this.dialogCreateFormVisible = true;
    },
    showUpdate($index) {
      //显示修改对话框
      this.tempArticle = this.list[$index];
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    showdownload($index) {
      if ($index != undefined) {
        this.tempArticle = this.list[$index];
      }
      // this.tempArticle = this.list[$index];
      this.tempDownload.id = this.tempArticle.id;
      this.tempDownload.module="3";
      this.dialogshowdownloadFormVisible = true;
      if (!this.hasPerm("article:list")) {
        return;
      }
      this.download_listLoading = true;
      this.api({
        url: "/inboundProject/queryFiles"+ "?module="+ "3",
        method: "post",
        data: this.tempDownload,
      }).then((data) => {
        this.download_listLoading = false;
        console.log("download_list", data.list);
        this.download_list = data.list;
      });
    },
    createArticle() {
      //保存新文章
      this.api({
        url: "/policy/add",
        method: "post",
        data: this.tempArticle,
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
      let files = document.querySelector("#fileInput").files;
      console.log("files", files);
      var formData = new FormData()
      if (files.length > 0) {
        let file = files[0];
        formData.append( 'multipartFile',files[0])
        console.log("====", file);
        this.api({
          url: '/inboundProject/upload' + "?module="+ "3" + "&project_id="+ this.tempArticle.id,
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
    updateArticle() {
      //修改文章
      this.api({
        url: "/policy/update",
        method: "post",
        data: this.tempArticle,
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
      let files = document.querySelector("#fileInput").files;
      console.log("files", files);
      var formData = new FormData()
      if (files.length > 0) {
        let file = files[0];
        formData.append( 'multipartFile',files[0])
        console.log("====", file);
        this.api({
          url: '/inboundProject/upload' + "?module="+ "3" + "&project_id="+ this.tempArticle.id,
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
    deleteUser() {
      //修改文章
      this.api({
        url: "/policy/delete",
        method: "post",
        data: { ...this.tempArticle, deleteStatus: 0 },
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
    },
    upload() {
      //上传文件proposer/upload
      let files = document.querySelector("#fileInput").files;
      console.log("files", files);
      var formData = new FormData()
      if (files.length > 0) {
        let file = files[0];
        formData.append( 'multipartFile',files[0])
        console.log("====", file);
        this.api({
          url: '/inboundProject/upload' + "?module="+ "3" + "&project_id="+ this.tempArticle.id,
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
    // exceedFile(files, fileList) {
    //     this.$notify.warning({
    //       title: '警告',
    //       message: `只能选择 ${this.limitNum} 个文件，当前共选择了 ${files.length + fileList.length} 个`
    //     });
    //   },
    //   // 文件状态改变时的钩子
    //   fileChange(file, fileList) {
    //     console.log('change')
    //     console.log(file)
    //     this.form.file = file.raw
    //     console.log(this.form.file)
    //     console.log(fileList)
    //   },
    //   // 上传文件之前的钩子, 参数为上传的文件,若返回 false 或者返回 Promise 且被 reject，则停止上传
    //   beforeUploadFile(file) {
    //     console.log('before upload')
    //     console.log(file)
    //     let extension = file.name.substring(file.name.lastIndexOf('.')+1)
    //     let size = file.size / 1024 / 1024
    //     // if(extension !== 'xlsx') {
    //     //   this.$notify.warning({
    //     //     title: '警告',
    //     //     message: `只能上传Excel2017（即后缀是.xlsx）的文件`
    //     //   });
    //     // }
    //     if(size > 10) {
    //       this.$notify.warning({
    //         title: '警告',
    //         message: `文件大小不得超过10M`
    //       });
    //     }
    //   },
    //   // 文件上传成功时的钩子
    //   handleSuccess(res, file, fileList) {
    //     this.$notify.success({
    //       title: '成功',
    //       message: `文件上传成功`
    //     });
    //   },
    //   // 文件上传失败时的钩子
    //   handleError(err, file, fileList) {
    //     this.$notify.error({
    //       title: '错误',
    //       message: `文件上传失败`
    //     });
    //   },
    //   uploadFile() {
    //     this.$refs.uploadExcel.submit()
    //     /*
    //     let formData = new FormData()
    //     formData.append('file', this.form.file)
    //     axios.post('https://jsonplaceholder.typicode.com/posts/', 
    //       formData,
    //       { "Content-Type": "multipart/form-data" }
    //     )
    //     .then(res => {
    //       console.log('res')
    //       console.log(res)
    //     })
    //     .catch(err => {

    //     })
    //     */
    //   },
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
             let name=this.beforsearch[i].zhengce_title
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
    download($index) {
      var fileDownload = require("js-file-download");
      console.log("this.download_list[$index].id,",this.download_list[$index].id,)
      this.axios({
        method: "get",
        url:
          "/api/inboundProject/download" + "?module="+ "3" + "&id=" + this.download_list[$index].id,
        responseType: "blob",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        console.log("res",res);
        let contentDisposition = res.headers["content-disposition"];
        // console.log(contentDisposition);
        let fileName = window.decodeURI(
          contentDisposition.substring(contentDisposition.indexOf("=") + 1)
        );
        // console.log("fileName=" + fileName);
        fileDownload(res.data, fileName);
      });
    },
  },
};
</script>
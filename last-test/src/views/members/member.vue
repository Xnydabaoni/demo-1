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
            placeholder="请输入会员姓名进行查找"
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
        label="会员性质"
        style="width: 100px"
      >
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.typea }}</span></template
        > -->
        <template slot-scope="scope">
          <span>{{ findcharacter(scope.row.typea) }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="会员姓名"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.vip_name }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="工作单位"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.workplace }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="任职"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.renzhi }}</span></template
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
        label="电话"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span></template
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
        label="微信"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.weixin }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="联系地址"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.adress }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="性别"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="年龄"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.old }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="学历"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.degree }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="职称"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.zhicheng }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="政治面貌"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.zhengzhimianmao }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="个人介绍"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.introduce }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="入会时间"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.ruhui_time }}</span></template
        >
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="目前状态"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ findstatus(scope.row.status) }}</span></template
        >
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.status }}</span></template
        > -->
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="级别"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ findlevela(scope.row.levela) }}</span></template
        >
        <!-- <template slot-scope="scope">
          <span>{{ scope.row.levela }}</span></template
        > -->
      </el-table-column>
      <el-table-column
        align="center"
        prop="content"
        label="负责人"
        style="width: 100px"
      >
        <template slot-scope="scope">
          <span>{{ find_employerin(scope.row.employerin_id) }}</span></template
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
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- create -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogCreateFormVisible"
    >
      <el-form
        class="selectbox"
        :model="tempArticle"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left: 50px"
      >
        <el-form-item label="序号">
          <el-input type="text" v-model="tempArticle.id"> </el-input>
        </el-form-item>
        <el-form-item label="会员性质">
          <select
            name="public-choice"
            v-model="tempArticle.typea"
            style="width: 200px"
          >
            <option
              :value="character.id"
              v-for="character in Vip_character"
              :key="character.id"
            >
              {{ character.name }}
            </option>
          </select>
        </el-form-item>
        <!-- <el-form-item label="会员性质">
          <el-input type="text" v-model="tempArticle.typea"> </el-input>
        </el-form-item> -->
        <el-form-item label="会员姓名">
          <el-input type="text" v-model="tempArticle.vip_name"> </el-input>
        </el-form-item>
        <el-form-item label="工作单位">
          <el-input type="text" v-model="tempArticle.workplace"> </el-input>
        </el-form-item>
        <el-form-item label="任职">
          <el-input type="text" v-model="tempArticle.renzhi"> </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="tempArticle.mobile"> </el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="tempArticle.phone"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="tempArticle.mail"> </el-input>
        </el-form-item>
        <el-form-item label="微信">
          <el-input type="text" v-model="tempArticle.weixin"> </el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input type="text" v-model="tempArticle.adress"> </el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input type="text" v-model="tempArticle.sex"> </el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input type="text" v-model="tempArticle.old"> </el-input>
        </el-form-item>
        <el-form-item label="学历">
          <el-input type="text" v-model="tempArticle.degree"> </el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input type="text" v-model="tempArticle.zhicheng"> </el-input>
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-input type="text" v-model="tempArticle.zhengzhimianmao">
          </el-input>
        </el-form-item>
        <el-form-item label="个人介绍">
          <el-input type="text" v-model="tempArticle.introduce"> </el-input>
        </el-form-item>
        <!-- <el-form-item label="入会时间">
          <el-input type="text" v-model="tempArticle.ruhui_time"> </el-input>
        </el-form-item> -->
        <el-form-item label="入会时间">
          <el-date-picker
            v-model="tempArticle.ruhui_time"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择入会时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="目前状态">
          <!-- <el-input type="text" v-model="tempArticle.status"> </el-input> -->
          <select
            name="public-choice"
            v-model="tempArticle.status"
            style="width: 200px"
          >
            <option
              :value="status.id"
              v-for="status in Vip_status"
              :key="status.id"
            >
              {{ status.name }}
            </option>
          </select>
        </el-form-item>
        <el-form-item label="级别">
          <!-- <el-input type="text" v-model="tempArticle.levela"> </el-input> -->
          <select
            name="public-choice"
            v-model="tempArticle.levela"
            style="width: 200px"
          >
            <option
              :value="levela.id"
              v-for="levela in Vip_levela"
              :key="levela.id"
            >
              {{ levela.name }}
            </option>
          </select>
        </el-form-item>
        <el-form-item label="负责人">
          <select
            name="public-choice"
            v-model="tempArticle.employerin_id"
            style="width: 200px"
          >
            <option
              :value="employerin.userId"
              v-for="employerin in em_list"
              :key="employerin.userId"
            >
              {{ employerin.username }}
            </option>
          </select>
        </el-form-item>
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
        class="selectbox"
        :model="tempArticle"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left: 50px"
      >
        <el-form-item label="序号">
          <el-input type="text" v-model="tempArticle.id"> </el-input>
        </el-form-item>
        <el-form-item label="会员性质">
          <select
            name="public-choice"
            v-model="tempArticle.typea"
            style="width: 200px"
          >
            <option
              :value="character.id"
              v-for="character in Vip_character"
              :key="character.id"
            >
              {{ character.name }}
            </option>
          </select>
        </el-form-item>
        <!-- <el-form-item label="会员性质">
          <el-input type="text" v-model="tempArticle.typea"> </el-input>
        </el-form-item> -->
        <el-form-item label="会员姓名">
          <el-input type="text" v-model="tempArticle.vip_name"> </el-input>
        </el-form-item>
        <el-form-item label="工作单位">
          <el-input type="text" v-model="tempArticle.workplace"> </el-input>
        </el-form-item>
        <el-form-item label="任职">
          <el-input type="text" v-model="tempArticle.renzhi"> </el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="tempArticle.mobile"> </el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input type="text" v-model="tempArticle.phone"> </el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="text" v-model="tempArticle.mail"> </el-input>
        </el-form-item>
        <el-form-item label="微信">
          <el-input type="text" v-model="tempArticle.weixin"> </el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input type="text" v-model="tempArticle.adress"> </el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input type="text" v-model="tempArticle.sex"> </el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input type="text" v-model="tempArticle.old"> </el-input>
        </el-form-item>
        <el-form-item label="学历">
          <el-input type="text" v-model="tempArticle.degree"> </el-input>
        </el-form-item>
        <el-form-item label="职称">
          <el-input type="text" v-model="tempArticle.zhicheng"> </el-input>
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-input type="text" v-model="tempArticle.zhengzhimianmao">
          </el-input>
        </el-form-item>
        <el-form-item label="个人介绍">
          <el-input type="text" v-model="tempArticle.introduce"> </el-input>
        </el-form-item>
        <!-- <el-form-item label="入会时间">
          <el-input type="text" v-model="tempArticle.ruhui_time"> </el-input>
        </el-form-item> -->
        <el-form-item label="入会时间">
          <el-date-picker
            v-model="tempArticle.ruhui_time"
            type="datetime"
            placeholder="请选择入会时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="目前状态">
          <!-- <el-input type="text" v-model="tempArticle.status"> </el-input> -->
          <select
            name="public-choice"
            v-model="tempArticle.status"
            style="width: 200px"
          >
            <option
              :value="status.id"
              v-for="status in Vip_status"
              :key="status.id"
            >
              {{ status.name }}
            </option>
          </select>
        </el-form-item>
        <el-form-item label="级别">
          <!-- <el-input type="text" v-model="tempArticle.levela"> </el-input> -->
          <select
            name="public-choice"
            v-model="tempArticle.levela"
            style="width: 200px"
          >
            <option
              :value="levela.id"
              v-for="levela in Vip_levela"
              :key="levela.id"
            >
              {{ levela.name }}
            </option>
          </select>
        </el-form-item>
        <!-- <el-form-item label="负责人">
          <el-input type="text" v-model="tempArticle.employerin_id"> </el-input>
        </el-form-item> -->
        <el-form-item label="负责人">
          <!-- <el-input type="text" v-model="tempArticle.employerin_id"> </el-input> -->
          <select
            name="public-choice"
            v-model="tempArticle.employerin_id"
            style="width: 200px"
          >
            <option
              :value="employerin.userId"
              v-for="employerin in em_list"
              :key="employerin.userId"
            >
              {{ employerin.username }}
            </option>
          </select>
        </el-form-item>
        <!-- <el-form-item label="文件">
          <input type="file" id="fileInput" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus != 'create'" @click="deleteUser"
          >删 除</el-button
        >
        <!-- <el-button v-if="dialogStatus!='create'" @click="upload">上 传</el-button> -->
        <el-button
          v-if="dialogStatus != 'create'"
          type="success"
          @click="updateArticle"
          >修 改</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchkey: "",
      beforsearch: [],
      aftersearch: [],
      totalCount: 0, //分页组件--数据总条数
      list: [], //表格的数据
      em_list: [],
      listLoading: false, //数据加载等待动画
      listQuery: {
        pageNum: 1, //页码
        pageRow: 10, //每页条数
        name: "",
      },
      dialogStatus: "create",
      dialogFormVisible: false,
      dialogCreateFormVisible: false,
      textMap: {
        update: "编辑",
        create: "编辑",
      },
      tempArticle: {
        id: "",
        content: "",
      },
      Vip_character: [
        { name: "个人会员", id: 1 },
        { name: "企业会员", id: 2 },
      ],
      Vip_status: [
        { name: "在任会员", id: 1 },
        { name: "历史会员", id: 2 },
        { name: "待发展会员", id: 3 },
      ],
      Vip_levela: [
        { name: "会长", id: 1 },
        { name: "理事", id: 2 },
        { name: "会员", id: 3 },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      //查询列表
      if (!this.hasPerm("article:list")) {
        return;
      }
      this.listLoading = true;
      this.api({
        url: "/Vip/query",
        method: "get",
        params: this.listQuery,
      }).then((data) => {
        this.listLoading = false;
        this.list = data.list;
        this.totalCount = data.totalCount;
      });
      this.api({
        url: "/user/queryList",
        method: "get",
      }).then((data) => {
        this.em_list = data.list;
      });
    },
    find_employerin(em_id) {
      for (let i = 0; i < this.em_list.length; i++) {
        if (this.em_list[i].userId == em_id) {
          return this.em_list[i].username;
        }
      }
    },
    findcharacter(ch_id) {
      for (let i = 0; i < this.Vip_character.length; i++) {
        if (this.Vip_character[i].id == ch_id)
          return this.Vip_character[i].name;
      }
    },
    findstatus(st_id) {
      for (let i = 0; i < this.Vip_status.length; i++) {
        if (this.Vip_status[i].id == st_id) return this.Vip_status[i].name;
      }
    },
    findlevela(st_id) {
      for (let i = 0; i < this.Vip_levela.length; i++) {
        if (this.Vip_levela[i].id == st_id) return this.Vip_levela[i].name;
      }
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
      this.tempArticle = {};
      this.dialogStatus = "create";
      this.dialogCreateFormVisible = true;
    },
    showUpdate($index) {
      //显示修改对话框
      this.tempArticle = this.list[$index];
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    createArticle() {
      //保存新工作人员
      this.api({
        url: "/Vip/add",
        method: "post",
        data: this.tempArticle,
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
    },
    updateArticle() {
      //修改文章
      this.api({
        url: "/Vip/update",
        method: "post",
        data: this.tempArticle,
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
    },
    deleteUser() {
      //修改文章
      this.api({
        url: "/Vip/delete",
        method: "post",
        data: { ...this.tempArticle, deleteStatus: 0 },
      }).then(() => {
        this.getList();
        this.dialogFormVisible = false;
        this.dialogCreateFormVisible = false;
      });
    },
    // upload(){
    //   //上传文件
    //   let files=document.querySelector("#fileInput").files;
    //   if(files.length>0){
    //     let file=files[0];
    //   }
    // },
    search() {
      console.log("this.searchkey-->", this.searchkey);
      if (this.searchkey != "") {
        //this.list=this.firstdata;
        console.log(this.list);
        this.aftersearch = [];
        this.beforsearch = this.list;
        for (let i = 0; i < this.beforsearch.length; i++) {
          let name = this.beforsearch[i].vip_name;
          if (name && name.includes(this.searchkey)) {
            this.aftersearch.push(this.beforsearch[i]);
            this.totalCount = 1;
          }
        }
        this.list = this.aftersearch;
      } else {
        this.getList();
      }
    },
  },
};
</script>
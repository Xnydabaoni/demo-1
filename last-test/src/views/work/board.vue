<template>
 
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
</template>

<script>
  export default {
    data() {
      return {
      totalCount: 0, //分页组件--数据总条数
      tableData: [], //表格的数据
      
      listQuery: {
        pageNum: 1, //页码
        pageRow: 5, //每页条数
        name: "",
      },
          

      }
    }
  }
</script>
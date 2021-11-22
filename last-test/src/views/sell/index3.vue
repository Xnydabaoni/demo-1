<template>
   <el-card>
        <div id="main" style="width: 1000px;height:400px;"></div>
        <div style="width:100px;height:30px"></div>
        <div id="main2" style="width: 1000px;height:400px;"></div>
    </el-card>
      
</template>

<script>
// import "../../../node_modules/echarts/theme/ayeah.js"
export default {
  data() {
    return {
      // 表格数据
      tableData: [],
      tableData2: [],
      list:[],
      dateData:[],
      sumData:[],
      eData:[],
      sData:[]
    };
  },
  mounted() {
    this.getData();
    this.getData2();
    setTimeout(()=>{this.drawChart()},1000);
  },
  methods: {
      
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("main"));
      let myChart2 = this.$echarts.init(document.getElementById("main2"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "最近日销量"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          name:'最近销售日期',
            type: 'category',
            boundaryGap: false,
          // data: ["衬衫", "羊毛衫", "雪纺衫","衬衫", "羊毛衫", "雪纺衫"]
          data: this.dateData
        },
        yAxis: {
            type: 'value',
            name:'单位:元'
        },
        series: [
          {
            name: "销量",
            type: "line",
            // data: [5000, 2000, 3600,5500, 8000, 3006],
            data: this.sumData,
             areaStyle: {}

          }
        ]
      };
      let option2 = {
        title: {
          text: "销售员业绩"
        },
        tooltip: {},
        legend: {
          data: ["销量"]
        },
        xAxis: {
          name:'销售员编号',
            type: 'category',
          // data: ["衬衫", "羊毛衫", "雪纺衫","衬衫", "羊毛衫", "雪纺衫"]
          data: this.eData
        },
        yAxis: {
            type: 'value',
            name:'单位:元'
        },
        series: [
          {
            name: "销量",
            type: "bar",
            // data: [5000, 2000, 3600,5500, 8000, 3006]
            data: this.sData,

          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      myChart2.setOption(option2);
    },

    getData(){
      this.api({
          url: "/orders/listOrderE",
          method: "get",
        }).then(data => {
            console.log("data--->",data);
            // console.log("--->",data.list[0].eid);
            // console.log("--->",data.list.length);
             for(var i=0;i<data.list.length;i++){
                this.eData.push(data.list[i].eid);
                this.sData.push(data.list[i].sum);
             }
             console.log(this.eDat,this.sData);
        })
    },
    getData2(){
      this.api({
          url: "/orders/listOrderO",
          method: "get",
        }).then(data => {
            console.log("data--->",data);
             for(var i=0;i<data.list.length;i++){
                this.dateData.push(data.list[i].odate);
                this.sumData.push(data.list[i].sum);
             }
             console.log(this.dateData,this.sumData);
        })
    }
  }
};
</script>
<style scoped>
/* @import '/.aa/bootstrap.min.css'; */
</style>

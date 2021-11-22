<!--  -->
<template>
  <el-card>
    <div id="main" style="width: 1000px; height: 400px"></div>
    <div id="main2" style="width: 1000px; height: 400px"></div>
  </el-card>
</template>

<script>
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/bar";
export default {
  name: "App",
  components: {
    "v-chart": ECharts,
  },
  data: function () {
    return {
      listsal: [], //薪水
      listname: [], //名字
      listage: [],
      list: [],
      sData: [],
      nData: [],
      aData: [],
    };
  },
  mounted() {
    this.getListSal();
    this.getListName();
    this.getListAge();
    setTimeout(() => {
      this.drawChart();
    }, 1000);
  },
  methods: {
    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("main"));
      let myChart2 = this.$echarts.init(document.getElementById("main2"));
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: "员工薪水统计表",
        },
        tooltip: {},
        legend: {
          data: ["薪水"],
        },
        xAxis: {
          name: "姓名",
          type: "category",
          data: this.nData,
        },
        yAxis: {
          type: "value",
          name: "单位:元",
        },
        series: [
          {
            name: "薪水",
            type: "bar",
            showBackground: true,
            data: this.sData,
            backgroundStyle: {
              color: "rgba(180, 180, 180, 0.2)",
            },
          },
        ],
      };
      let option2 = {
        title: {
          text: "员工年龄折线图",
        },
        tooltip: {},
        legend: {
          data: ["年龄"],
        },
        xAxis: {
          name: "姓名",
          type: "category",
          data: this.nData,
        },
        yAxis: {
          type: "value",
          name: "年龄",
        },
        series: [
          {
            data: this.aData,
            type: "line",
          },
        ],
      };
      myChart.setOption(option);
      myChart2.setOption(option2);
    },
    getListSal() {
      //查询列表
      this.api({
        url: "/emp/listsal",
        method: "get",
      }).then((data) => {
        //console.log("data--->",data);
        // console.log("--->",data.list[0].eid);
        // console.log("--->",data.list.length);
        for (var i = 0; i < data.list.length; i++) {
          this.sData.push(data.list[i].sal);
        }
        console.log(this.sData);
      });
    },
    getListAge() {
      //查询列表
      this.api({
        url: "/emp/listage",
        method: "get",
      }).then((data) => {
        for (var i = 0; i < data.list.length; i++) {
          this.aData.push(data.list[i].eage);
        }
        console.log(this.aData);
      });
    },
    getListName() {
      this.api({
        url: "/emp/listname",
        method: "get",
      }).then((data) => {
        for (var i = 0; i < data.list.length; i++) {
          this.nData.push(data.list[i].ename);
        }
        console.log(this.nData);
      });
    },
  },
};
</script>
<style scoped>
/* @import '/.aa/bootstrap.min.css'; */
</style>
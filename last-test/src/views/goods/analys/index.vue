<template>
  <div  >
    <div class="title">本月各品牌销量总览（单位：万）</div>

    <div id="myChart1" class="chart-view1" ></div>

     <div id="myChart4" class="chart-view-4"></div>

    <div id="myChart2" class="chart-view2"></div>

    <div id="myChart3" class="chart-view3"></div>

   
    
  </div>
</template>

<script>

var that;

export default {
  name: 'echart',
  data () {
    return {
      chart1_title: '品牌销量（纯属虚构）',
      chart1_dataName:'销量',
      chart1_name:null,
      chart1_data:null,
    }
  },
  created: function () {
    // `this` 指向 vm 实例
    that = this

    that.chart1_name =  ["小米","华为","一加","美的","戴尔","安踏","海尔","惠普星"];
    that.chart1_data =  [50, 60, 36, 20, 45, 20,25,30];
  },
  mounted(){
    //页面加载完成后,才执行
    that.showChart1();

    that.showChart2();

    that.showChart3();

    that.showChart4();
  },
  methods: {
    showChart1()
    {
        // 基于准备好的dom，初始化echarts实例
        let myChart1 = that.$echarts.init(document.getElementById('myChart1'),'dark')
        // 绘制图表
        myChart1.setOption({
         
            title: { text: that.chart1_title },
            tooltip: {},
            xAxis: {
             "axisLabel":{
		         interval: 0
          	},
                data:that.chart1_name
            },
            yAxis: {},
            series: [{
               showBackground: true,
               backgroundStyle: {
               color: 'rgba(180, 180, 180, 0.2)'
               },
                name: that.chart1_dataName,
                type: 'bar',
                data:that.chart1_data,
            }]
        });
    },
    showChart2()
    {
      console.log("showChart2")
      let data2 = [   {value:335, name:'京东'},
                      {value:310, name:'拼多多'},
                      {value:234, name:'苏宁易购'},
                      {value:135, name:'唯品会'},
                      {value:1548, name:'淘宝'}];

      // 基于准备好的dom，初始化echarts实例
      let myChart2 = that.$echarts.init(document.getElementById('myChart2') ,'dark')
      // 绘制图表
      var option2 = {
          title: {
              text: '各平台商品销量分布',
              x:'center'
          },
              tooltip : {
                  trigger: 'item',
                  formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              series: {
              name:'销量分布',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data: data2,
          }
      };

      myChart2.setOption(option2)
    },
    showChart3()
    {
      let myChart3 = that.$echarts.init(document.getElementById('myChart3'),'dark')
      var option3 = {
          title: {
              text: '环形图',
              x:'center'
          },
          tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
              orient: 'vertical',
              x: 'right',
              data:['京东','拼多多','苏宁易购','唯品会','淘宝']
          },
          series: [
              {
                  name:'销量来源',
                  type:'pie',
                  radius: ['50%', '70%'],
                  avoidLabelOverlap: false,
                  label: {
                      normal: {
                          show: false,
                          position: 'center'
                      },
                      emphasis: {
                          show: true,
                          textStyle: {
                              fontSize: '14',
                              fontWeight: 'bold'
                          }
                      }
                  },
                  labelLine: {
                      normal: {
                          show: false
                      }
                  },
                  data:[
                      {value:335, name:'京东'},
                      {value:310, name:'拼多多'},
                      {value:234, name:'苏宁易购'},
                      {value:135, name:'唯品会'},
                      {value:1548, name:'淘宝'}
                  ]
              }
          ]
      };
      myChart3.setOption(option3);
    },
    showChart4()
    {
      var myChart4= that.$echarts.init(document.getElementById('myChart4'),'dark');
      let option4 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999'
                    }
                }
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: true},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            legend: {
                data:["小米","华为","一加","美的","戴尔","安踏","海尔","惠普星"]
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '每月各品牌销量',
                    min: 0,
                    max: 100,
                    interval: 50,
                    axisLabel: {
                        formatter: '{value} 万'
                    }
                // },
                // {
                //     type: 'value',
                //     name: '温度',
                //     min: 0,
                //     max: 25,
                //     interval: 5,
                //     axisLabel: {
                //         formatter: '{value} °C'
                //     }
                }
            ],
            series: [
                {
                    name:'小米',
                    type:'bar',
                    data:[20, 49, 70, 32, 56, 76.7, 56, 62, 36, 20, 64, 33]
                },
                {
                    name:'华为',
                    type:'bar',
                    data:[26, 59, 90, 26, 27, 70, 75, 82.2, 48.7, 88, 60, 73]
                },
                {
                    name:'一加',
                    type:'bar',
                    // yAxisIndex: 1,
                    data:[45, 25, 33, 45, 63, 52, 23, 24, 23, 15, 20, 42]
                },
                {
                    name:'美的',
                    type:'bar',
                    data:[64, 75, 45, 37, 46, 39, 54, 89, 65, 48, 90, 43]
                },
                {
                    name:'戴尔',
                    type:'bar',
                    data:[48, 59, 35, 69, 45, 80, 45, 66, 52, 70, 64, 79]
                },
                {
                    name:'安踏',
                    type:'bar',
                    data:[44, 85, 65, 45, 67, 47, 75, 82.2, 48.7, 88, 60, 73]
                },
                {
                    name:'海尔',
                    type:'bar',
                    data:[41, 49, 78, 36, 47, 70, 65, 86.2, 88, 78, 70, 43]
                },
                {
                    name:'惠普星',
                    type:'bar',
                    data:[28, 59, 55, 44, 72, 75, 71, 41, 38.7, 48, 40, 63]
                },
            ]
        };
         myChart4.setOption(option4)
    }
  }
}
</script>

<style>

.title{
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-left: 55px;
}

.chart-view1{
  
  width: 600px;
  height: 550px;
  left: 50px;
  
}
.chart-view2{
  
  width: 600px;
  height: 600px;
  left: 50px;
 
  
     
}
.chart-view3{
  width: 650px;
  height: 550px;
  left: 650px;
  
}

.chart-view-4{
  left: 648px;
  width: 650px;
  height: 600px;
  
}
</style>
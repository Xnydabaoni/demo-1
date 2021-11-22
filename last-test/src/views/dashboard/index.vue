<template>
  <div class="dashboard-container">
    <!-- <a href="https://baike.baidu.com/item/%E5%AE%A2%E6%88%B7%E5%85%B3%E7%B3%BB%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F/824647?fr=aladdin" target="_blank"></a> -->
    <h1 align="center">
      <b>欢迎进入海智项目管理系统</b></h1>
      <img style="margin: 40px" align="middle" :src="logo">
  </div>
</template>
<script>
import logo from '../../assets/404_images/hz.jpg';
  export default {
    name: 'dashboard',
    data() {
      
      return {
        logo
      }
    },
  }
</script>

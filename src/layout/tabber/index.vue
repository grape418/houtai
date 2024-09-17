<template>
  <div class="tabber">
    <div class="tabber_left">
      <Breadcrumb></Breadcrumb>
    </div>
    <div class="tabber_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumd/index.vue'
import Setting from './setting/index.vue'

</script>
<script lang="ts">
  export default {
    name: 'tabber'
  }
</script>
<style scoped lang="scss">
.tabber{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabber_left{
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .tabber_right{
    display: flex;
    align-items: center;

  }
}

</style>
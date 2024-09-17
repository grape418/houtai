<template>
  <el-card>
    <el-table border :data="skuArr">
      <el-table-column label="序号" width="100px" align="center" type="index"></el-table-column>
      <el-table-column label="名称" align="center" prop="skuName" show-overflow-tooltip></el-table-column>
      <el-table-column label="描述" align="center" prop="skuDesc" show-overflow-tooltip></el-table-column>
      <el-table-column label="图片" align="center" prop="skuDefaultImg" width="300px">
        <template #="{ row,index}">
          <img :src="row.skuDefaultImg" alt="" width="100px" height="100px">
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center" prop="weight" width="100px"></el-table-column>
      <el-table-column label="价格" align="center" prop="price" width="100px"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #="{row,index}">
          <el-button :icon="row.isSale == 1 ? 'Bottom' : 'Top'" type="primary" @click="updateSale(row)" ></el-button>
          <el-button type="primary" icon="Edit" @click="editSale"></el-button>
          <el-button type="primary" icon="InfoFilled" @click="infoSale(row)" :data="infoArr">
          </el-button>
          <el-button type="primary" icon="Delete" @click="deleteSale(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination 
      v-model:current-page="pageNo" 
      v-model:page-size="pageSize" 
      :page-sizes="[5, 10, 15, 20]"
      :background="true" 
      layout="prev, pager, next, jumper,->,sizes,total" 
      :total="total" @current-change="getSkuDate"
      @size-change="handler" />
      <!-- 抽屉 -->
      <el-drawer v-model="drawer" title="查看商品详情">
        <template #default>
          <el-row>
            <el-col :span="6">名称</el-col>
            <el-col :span="18">{{ infoArr.skuName }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">描述</el-col>
            <el-col :span="18">{{ infoArr.skuDesc }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">价格</el-col>
            <el-col :span="18">{{ infoArr.price }}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">平台属性</el-col>
            <el-col :span="18">
              <el-tag type="primary" v-for="(item, index) in infoArr.skuAttrValueList" :Key=item.id>{{ item.valueName}}</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">销售属性</el-col>
            <el-col :span="18">
              <el-tag type="primary" v-for="(item, index) in infoArr.skuSaleAttrValueList" :Key=item.id>{{ item.saleAttrValueName}}</el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">商品图片</el-col>
            <el-col :span="18">
              <el-carousel :interval="4000" type="card" height="250px">
                <el-carousel-item v-for="item in infoArr.skuImageList" :key="item.id">
                  <img :src="item.imgUrl" alt="" style="width: 100%; height: 100%;">
                </el-carousel-item>
              </el-carousel>
            </el-col>
          </el-row>
        </template>
      </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { reqCancelSale, reqRemoveSku, reqSaleSku, reqSkuInfo, reqSkuList } from '@/api/product/sku';
import type { SkuData, SkuResponseData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue';

let pageNo = ref<number>(1)
let pageSize = ref<number>(5) //一页展示多少数据
let total = ref<number>(0)
let skuArr = ref<SkuData[]>([])
let drawer = ref<boolean>(false)
let infoArr = ref<any>({})
onMounted(() => {
  getSkuDate()
})
const getSkuDate = async(pager=1) => {
  pageNo.value = pager
  let result:SkuResponseData = await reqSkuList(pageNo.value,pageSize.value)
  console.log(result);
  
  if(result.code == 200){
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
const handler = (pageSizes: number) => {
  getSkuDate()
}

const updateSale = async(row: SkuData) => {
  if(row.isSale == 1){
    await reqCancelSale((row.id as number))
    ElMessage({
      type:'success',
      message: '下架成功'
    })
    getSkuDate(pageNo.value)
  }else{
    await reqSaleSku((row.id as number))
    ElMessage({
      type:'success',
      message: '上架成功'
    })
    getSkuDate(pageNo.value)
  }
   
}
const editSale = () =>{
  ElMessage({
    type: 'success',
    message: '功能更新中···'
  })
}
const infoSale = async(row: SkuData) => {
  drawer.value = true
  let result =  await reqSkuInfo(row.id as number)
  if(result.code == 200){
    infoArr.value = result.data
  }
}
const deleteSale = async(row: SkuData) => {
  let result =  await reqRemoveSku((row.id as number))
  if(result.code == 200){
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    getSkuDate(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }else{
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
  }
  
}
</script>

<style scoped>
.el-row{
  margin: 15px 0;
}
.el-tag{
 margin-top: 5px;
 margin-right: 10px;
}
</style>
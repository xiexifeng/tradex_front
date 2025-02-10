<template>
  <div class="exchange">
    <van-nav-bar
      title="发起交换"
      left-arrow
      @click-left="onClickLeft"
      right-text="提交"
      @click-right="onSubmit"
    />

    <div class="exchange-form">
      <!-- 目标物品信息 -->
      <van-cell-group inset title="目标物品信息" class="target-info">
        <van-cell title="物品编号" :value="targetItem.id" />
        <van-cell title="区块ID" :value="targetItem.blockId" />
        <van-cell title="物品名称" :value="targetItem.name" />
        <van-image
          width="100%"
          height="200"
          fit="cover"
          :src="targetItem.mainImage"
          class="item-image"
        />
        <van-cell title="期望物品" :value="targetItem.expectedItems" />
        <van-cell title="期望地点" :value="targetItem.expectedLocation" />
      </van-cell-group>

      <!-- 交换表单 -->
      <van-form @submit="onSubmit" ref="formRef">
        <!-- 选择可交换物品 -->
        <van-field
          v-model="formData.selectedItem"
          name="selectedItem"
          label="交换物品"
          placeholder="请选择要交换的物品"
          readonly
          is-link
          @click="showItemPicker = true"
          :rules="[{ required: true, message: '请选择要交换的物品' }]"
        />

        <!-- 期望交换地点 -->
        <van-field
          v-model="formData.exchangeLocation"
          name="exchangeLocation"
          label="交换地点"
          placeholder="请选择交换地点"
          readonly
          is-link
          @click="showLocationPicker = true"
          :rules="[{ required: true, message: '请选择交换地点' }]"
        />

        <!-- 期望交换时间 -->
        <van-field
          v-model="formData.exchangeTime"
          name="exchangeTime"
          label="交换时间"
          placeholder="请选择交换时间"
          readonly
          is-link
          @click="showTimePicker = true"
          :rules="[{ required: true, message: '请选择交换时间' }]"
        />

        <!-- 联系方式 -->
        <van-field
          v-model="formData.contact"
          name="contact"
          label="联系方式"
          placeholder="请输入您的联系方式"
          :rules="[{ required: true, message: '请填写联系方式' }]"
        />

        <!-- 备注信息 -->
        <van-field
          v-model="formData.remarks"
          name="remarks"
          label="备注信息"
          type="textarea"
          rows="2"
          autosize
          placeholder="其他补充说明（选填）"
        />
      </van-form>
    </div>

    <!-- 物品选择弹出层 -->
    <van-popup v-model:show="showItemPicker" position="bottom">
      <van-picker
        :columns="myItems"
        @confirm="onItemConfirm"
        @cancel="showItemPicker = false"
        show-toolbar
        title="选择交换物品"
      />
    </van-popup>

    <!-- 地点选择弹出层 -->
    <van-popup v-model:show="showLocationPicker" position="bottom">
      <van-picker
        :columns="locationColumns"
        @confirm="onLocationConfirm"
        @cancel="showLocationPicker = false"
        show-toolbar
        title="选择交换地点"
      />
    </van-popup>



    <!-- 时间选择弹出层 -->
    <van-popup v-model:show="showTimePicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        title="选择交换时间"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onTimeConfirm"
        @cancel="showTimePicker = false"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'

export default defineComponent({
  name: 'ExchangeView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref(null)
    const showItemPicker = ref(false)
    const showLocationPicker = ref(false)
    const showTimePicker = ref(false)
    const currentDate = ref(['2025', '02', '10']);

    // 目标物品信息
    const targetItem = ref({
      id: route.params.id || 'ITEM001',
      blockId: 'BK001',
      name: '测试物品',
      mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
      expectedItems: '电子产品/数码配件',
      expectedLocation: '商场A'
    })

    // 表单数据
    const formData = ref({
      selectedItem: '',
      exchangeLocation: '',
      exchangeTime: '',
      contact: '',
      remarks: ''
    })

    // 我的可交换物品列表
    const myItems = [
      { text: '二手手机', value: 'ITEM002' },
      { text: '平板电脑', value: 'ITEM003' },
      { text: '智能手表', value: 'ITEM004' }
    ]

    // 地点选择器数据
    const locationColumns = [
      { text: '商场A', value: '商场A' },
      { text: '商场B', value: '商场B' },
      { text: '地铁站C', value: '地铁站C' },
      { text: '公园D', value: '公园D' },
      { text: '便利店E', value: '便利店E' }
    ]

    // 时间范围
    const minDate = new Date()
    const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30天内

    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }

    // 选择物品确认
    const onItemConfirm = ({ selectedOptions }: any) => {
      formData.value.selectedItem = selectedOptions[0].text
      showItemPicker.value = false
    }

    // 选择地点确认
    const onLocationConfirm = ({ selectedOptions }: any) => {
      formData.value.exchangeLocation = selectedOptions[0].text
      showLocationPicker.value = false
    }

    // 选择时间确认
    const onTimeConfirm = ({ selectedOptions }: any) => {
      console.log(selectedOptions)
      formData.value.exchangeTime = selectedOptions[0].text + '-' + selectedOptions[1].text + '-' + selectedOptions[2].text 
      showTimePicker.value = false
    }

    // 提交表单
    const onSubmit = async () => {
      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        await showDialog({
          title: '确认提交',
          message: '确定要发起交换请求吗？',
          showCancelButton: true,
        })
        
        // 这里调用API提交交换请求
        console.log('提交的数据:', {
          targetItemId: targetItem.value.id,
          ...formData.value
        })
        showToast('提交成功')
        router.back()
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }

    return {
      targetItem,
      formData,
      formRef,
      showItemPicker,
      showLocationPicker,
      showTimePicker,
      currentDate,
      myItems,
      locationColumns,
      minDate,
      maxDate,
      onClickLeft,
      onItemConfirm,
      onLocationConfirm,
      onTimeConfirm,
      onSubmit
    }
  }
})
</script>

<style scoped>
.exchange {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.exchange-form {
  padding: 12px;
}

.target-info {
  margin-bottom: 12px;
}

.item-image {
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-field__label) {
  width: 6em !important;
}

:deep(.van-cell-group) {
  margin-bottom: 12px;
}

:deep(.van-button--small) {
  min-width: 80px;
}
</style> 
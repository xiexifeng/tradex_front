<template>
  <div class="transfer">
    <van-nav-bar
      title="发起转让"
      left-arrow
      @click-left="onClickLeft"
      right-text="提交"
      @click-right="onSubmit"
    />

    <div class="transfer-form">
      <!-- 物品基本信息展示 -->
      <van-cell-group inset class="item-info">
        <van-cell title="物品编号" :value="itemInfo.id" />
        <van-cell title="区块ID" :value="itemInfo.blockId" />
        <van-cell title="物品名称" :value="itemInfo.name" />
        <van-image
          width="100%"
          height="200"
          fit="cover"
          :src="itemInfo.mainImage"
          class="item-image"
        />
      </van-cell-group>

      <!-- 转让表单 -->
      <van-form @submit="onSubmit" ref="formRef">
        <!-- 期望交换的物品 -->
        <van-field
          v-model="formData.expectedItems"
          name="expectedItems"
          label="期望物品"
          type="textarea"
          rows="2"
          autosize
          placeholder="请描述您期望交换的物品类型、新旧程度等"
          :rules="[{ required: true, message: '请填写期望交换的物品' }]"
        />

        <!-- 期望交换的地点 -->
        <van-field
          v-model="formData.expectedLocation"
          name="expectedLocation"
          label="交换地点"
          placeholder="请选择期望的交换地点"
          readonly
          is-link
          @click="showLocationPicker = true"
          :rules="[{ required: true, message: '请选择交换地点' }]"
        />

        <!-- 当前位置 -->
        <van-field
          v-model="formData.currentLocation"
          name="currentLocation"
          label="当前位置"
          readonly
        >
          <template #button>
            <van-button size="small" type="primary" @click="getCurrentLocation">
              获取位置
            </van-button>
          </template>
        </van-field>

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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'

export default defineComponent({
  name: 'TransferView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const formRef = ref(null)
    const showLocationPicker = ref(false)

    // 模拟物品信息
    const itemInfo = ref({
      id: route.params.id || 'ITEM001',
      blockId: 'BK001',
      name: '测试物品',
      mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'
    })

    // 表单数据
    const formData = ref({
      expectedItems: '',
      expectedLocation: '',
      currentLocation: '',
      remarks: ''
    })

    // 地点选择器数据
    const locationColumns = [
      {text:'商场A', value:'商场A'},
      {text:'商场B', value:'商场B'},
      {text:'地铁站C', value:'地铁站C'},
      {text:'公园D', value:'公园D'},
      {text:'便利店E', value:'便利店E'}
    ]

    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }

    // 获取当前位置
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            formData.value.currentLocation = 
              `${position.coords.latitude}, ${position.coords.longitude}`
          },
          (error) => {
            showToast('获取位置失败，请检查定位权限')
          }
        )
      } else {
        showToast('您的浏览器不支持地理定位')
      }
    }

    // 选择地点确认
    const onLocationConfirm = ({ selectedOptions }: any) => {
      formData.value.expectedLocation = selectedOptions[0].text
      showLocationPicker.value = false
    }

    // 提交表单
    const onSubmit = async () => {

      if (!formRef.value) return
      
      try {
        await formRef.value.validate()
        await showDialog({
          title: '确认提交',
          message: '确定要发起转让申请吗？',
          showCancelButton: true,
        })
        
        // 这里调用API提交转让申请
        console.log('提交的数据:', {
          itemId: itemInfo.value.id,
          ...formData.value
        })
        showToast('提交成功')
        router.back()
      } catch (error) {
        console.error('表单验证失败:', error)
      }
    }

    return {
      itemInfo,
      formData,
      formRef,
      showLocationPicker,
      locationColumns,
      onClickLeft,
      getCurrentLocation,
      onLocationConfirm,
      onSubmit
    }
  }
})
</script>

<style scoped>
.transfer {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.transfer-form {
  padding: 12px;
}

.item-info {
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
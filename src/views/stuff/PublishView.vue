<template>
  <div class="publish">
    <van-nav-bar
      title="发布物品"
      left-arrow
      @click-left="onClickLeft"
      right-text="发布"
      @click-right="onSubmit"
    />

    <div class="publish-form">
      <van-form @submit="onSubmit" :show-error=true ref="formRef">
        <!-- 物品名称 -->
        <van-field
          v-model="formData.name"
          name="name"
          label="物品名称"
          placeholder="请输入物品名称(1-50字)"
          :rules="[
            { required: true, message: '请填写物品名称' }
          ]"
        />

        <!-- 物品类型 -->
        <van-field
          v-model="formData.clazzText"
          is-link
          readonly
          name="clazz"
          label="物品类型"
          placeholder="请选择物品类型"
          @click="showTypePopup = true"
          :rules="[{ required: true, message: '请选择物品类型' }]"
        />
        <van-popup v-model:show="showTypePopup" position="bottom">
          <van-picker
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showTypePopup = false"
            show-toolbar
            title="选择物品类型"
          />
        </van-popup>

        <!-- 物品描述 -->
        <van-field
          v-model="formData.description"
          name="description"
          label="物品描述"
          type="textarea"
          rows="3"
          autosize
          placeholder="请描述物品的详细信息(1-200字)"
          :rules="[
            { required: true, message: '请填写物品描述' }
          ]"
        />

        <!-- 物品图片 -->
        <div class="upload-images">
          <van-field name="images" label="物品图片">
            <template #input>
              <van-uploader
                v-model="formData.images"
                :max-count="5"
                :after-read="afterRead"
                multiple
                :rules="[
                  { required: true, message: '请上传至少1张图片' },
                ]"
              />
            </template>
          </van-field>
        </div>

        <!-- 物品原始价值 -->
        <!-- <van-field
          v-model="formData.originalPrice"
          type="digit"
          name="originalPrice"
          label="原始价值"
          placeholder="请输入物品原始价值(选填)"
          :rules="[
            { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格' },
            { validator: validatePrice, message: '价格范围0-999999' }
          ]"
        /> -->

        <!-- 物品折旧程度 -->
        <van-field
          v-model="formData.depreciation"
          type="number"
          name="depreciation"
          label="折旧程度"
        >
          <template #input>
            <van-rate 
              v-model="formData.depreciation"
              :count="10"
              color="#ffd21e"
              void-icon="star"
              void-color="#eee"
            />
          </template>
        </van-field>
        <div class="submit-btn">
          <van-button round block type="primary" native-type="submit">
            发布
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog, FormInstance } from 'vant'
import type { UploaderFileListItem } from 'vant'



export default defineComponent({
  name: 'PublishView',
  setup() {
    const router = useRouter()
    const showTypePopup = ref(false)
    const formRef = ref<FormInstance>()

    // 物品类型选项
    const columns = [
      {text: '衣服', value : 'A'},
      {text: '家具', value : 'B'},
      {text: '玩具', value : 'C'},
      {text: '电子产品', value : 'D'},
      {text: '图书', value : 'E'},
      {text: '运动器材', value : 'F'},
      {text: '其他', value : 'G'}
    ]

    // 表单数据
    const formData = reactive({
      name: '',
      clazz: '',
      clazzText: '',
      description: '',
      images: [] as UploaderFileListItem[],
      originalPrice: '',
      depreciation: 5
    })

    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }


    // 选择物品类型
    const onConfirm = (selectedItem:any) => {
      console.log(selectedItem)
      formData.clazz = selectedItem.selectedOptions[0].value
      formData.clazzText = selectedItem.selectedOptions[0].text
      showTypePopup.value = false
    }

    // 验证价格
    const validatePrice = (value: string) => {
      if (!value) return true
      const price = parseFloat(value)
      return price >= 0 && price <= 999999
    }

    // 处理图片上传
    const afterRead = (file: UploaderFileListItem | UploaderFileListItem[]) => {
      // 这里应该调用后端API上传图片
      console.log('上传图片:', file)
    }


    // 提交表单
    const onSubmit = async () => {
      if (!formRef.value) return
      console.log(formRef.value)
      try {
        await formRef.value.validate()

        if (formData.images.length === 0) {
          showToast('请至少上传一张图片')
          return
        }
        await showDialog({
          title: '确认提交',
          message: '确定要发布吗？',
          showCancelButton: true,
        })
        
        // 这里调用API提交转让申请
        console.log('提交的数据:', {
          ...formData
        })
        showToast('发布成功')
        router.back()
      } catch (error) {
        console.error('表单验证失败:', error)
        showDialog({
          title: '发布失败',
          message: '请稍后重试'
        })
      }
      
    }

    onMounted(() => {
      console.log('mounted')
      console.log(formRef.value?.getValues())
    })

    return {
      formData,
      showTypePopup,
      columns,
      formRef,
      onClickLeft,
      onConfirm,
      validatePrice,
      afterRead,
      onSubmit
    }
  }
})
</script>

<style scoped>
.publish {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.publish-form {
  padding: 12px;
}

.upload-images {
  padding: 16px 0;
}

:deep(.van-field__label) {
  width: 6em !important;
}

:deep(.van-uploader) {
  padding: 10px 0;
}

:deep(.van-uploader__upload) {
  background-color: #ffffff;
}

:deep(.van-rate) {
  margin: 5px 0;
}
</style> 
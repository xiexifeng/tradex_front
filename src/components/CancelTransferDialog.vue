<template>
  <van-dialog
    v-model:show="show"
    title="请输入取消原因"
    show-cancel-button
    @confirm="onConfirm"
    @cancel="onCancel"
    :before-close="onBeforeClose"
  >
    <van-form @submit="onSubmit">
      <van-field
        v-model="formData.cancelReason"
        name="cancelReason"
        label="取消原因"
        placeholder="请输入取消原因"
        type="textarea"
        rows="3"
        :rules="[{ required: true, message: '请输入取消原因' }]"
      />
    </van-form>
  </van-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { showToast } from 'vant'
import { cancelTransfer } from '@/api/stuff'

export default defineComponent({
  name: 'CancelTransferDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    itemId: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'success', 'cancel'],
  setup(props, { emit }) {
    const show = ref(props.modelValue)
    const formData = ref({
      cancelReason: ''
    })

    // 监听modelValue变化
    watch(() => props.modelValue, (val) => {
      show.value = val
    })

    // 监听show变化
    watch(show, (val) => {
      emit('update:modelValue', val)
    })

    const onBeforeClose = (action: string, done: Promise<boolean>) => {
      if (action === 'confirm') {
        const cancelReason = formData.value.cancelReason.trim()
        if (cancelReason === '') {
          done = new Promise<boolean>(resolve => resolve(false))
        } else {
          done = new Promise<boolean>(resolve => resolve(true))
        }
      } else {
        done = new Promise<boolean>(resolve => resolve(true))
      }
    }

    const onSubmit = async () => {
      const cancelReason = formData.value.cancelReason.trim()
      if (cancelReason === '') {
        return false
      }

      try {
        const res = await cancelTransfer({
          itemId: props.itemId,
          cancelReason
        })
        
        if (res.success) {
          showToast('取消出让成功')
          show.value = false
          emit('success')
          // 重置表单
          formData.value.cancelReason = ''
        } else {
          showToast(res.desc || '取消出让失败')
        }
      } catch (error) {
        console.error('取消出让失败:', error)
        showToast('取消出让失败')
      }
    }

    const onConfirm = () => {
      onSubmit()
    }

    const onCancel = () => {
      show.value = false
      emit('cancel')
      // 重置表单
      formData.value.cancelReason = ''
    }

    return {
      show,
      formData,
      onBeforeClose,
      onConfirm,
      onCancel,
      onSubmit
    }
  }
})
</script> 
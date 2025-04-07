<template>
  <div class="notification-detail">
    <van-nav-bar
      title="消息详情"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="detail-card">
      <div class="detail-header">
        <h3 class="title">{{ notification.title }}</h3>
        <div class="meta">
          <van-tag 
            :type="getTypeTag(notification.notificationType)"
            round
          >
            {{ getTypeText(notification.notificationType) }}
          </van-tag>
          <span class="time">{{ formatTime(notification.createTime) }}</span>
        </div>
      </div>
      <div class="content">
        {{ notification.content }}
      </div>
      <div class="actions" v-if="notification.relatedId">
        <van-button 
          type="primary" 
          block 
          round
          @click="viewRelated"
        >
          查看相关详情
        </van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const notification = ref<any>({})

    const getTypeText = (type: number) => {
      const typeMap: Record<number, string> = {
        1: '系统',
        2: '交易',
        3: '评分',
        4: '积分'
      }
      return typeMap[type] || '其他'
    }

    const getTypeTag = (type: number) => {
      const typeMap: Record<number, string> = {
        1: 'primary',
        2: 'success',
        3: 'warning',
        4: 'danger'
      }
      return typeMap[type] || 'default'
    }

    const formatTime = (time: number) => {
      try{
        console.log(time)
        console.log(new Date(time))
      }catch(err){
        console.log(err)
      }
      return format(new Date(), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })
    }

    const onClickLeft = () => {
      router.back()
    }

    const viewRelated = () => {
      // 根据通知类型跳转到相应页面
      switch (notification.value.notificationType) {
        case 2:
          router.push(`/stuff/detail/${notification.value.relatedId}`)
          break
        // 添加其他类型的跳转逻辑
      }
    }

    onMounted(() => {
      // 这里应该调用API获取通知详情
      // 现在使用模拟数据
      notification.value = {
        "id": route.params.id,
        "userId": "20250324000001",
        "notificationType": 2,
        "relatedId": "2025032500010",
        "title": "交易通知",
        "content": "换物交易完成-积分增加5",
        "status": 1,
        "createTime": 1742911633000
      }
    })

    return {
      notification,
      getTypeText,
      getTypeTag,
      formatTime,
      onClickLeft,
      viewRelated
    }
  }
})
</script>

<style scoped>
.notification-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.detail-card {
  margin: 12px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-header {
  margin-bottom: 16px;
}

.title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: bold;
  color: #323233;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time {
  font-size: 12px;
  color: #969799;
}

.content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
}

.actions {
  margin-top: 24px;
}
</style> 
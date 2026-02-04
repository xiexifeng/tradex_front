<template>
  <div class="notification-detail">
    <van-nav-bar
      title="消息详情"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" color="#1989fa" />
      <p class="loading-text">加载中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <van-icon name="warning-o" size="48" color="#ff4d4f" />
      <p class="error-text">{{ error }}</p>
      <van-button type="primary" @click="loadNotificationDetail">重新加载</van-button>
    </div>
    
    <div v-else-if="notification.id" class="detail-card">
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
          {{ notification.notificationType === 'AUDIT' ? '前往审核' : '查看相关详情' }}
        </van-button>
      </div>
      <div class="related-content" v-if="notification.relatedContent && notification.notificationType === 'AUDIT'">
        <h4 class="related-title">审核任务信息</h4>
        <div class="related-info" v-if="parseRelatedContent">
          <p class="info-item">物品标题：{{ parseRelatedContent.itemTitle }}</p>
          <p class="info-item">审核类型：{{ parseRelatedContent.auditType === 'ITEM_AUDIT' ? '物品审核' : '其他审核' }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-container">
      <van-empty description="未找到通知详情" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { notificationApi } from '@/api/notification'
import { Icon, Loading, Empty } from 'vant'

export default defineComponent({
  components: {
    vanIcon: Icon,
    vanLoading: Loading,
    vanEmpty: Empty
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const notification = ref<any>({})
    const loading = ref(true)
    const error = ref('')
    
    const parseRelatedContent = computed(() => {
      if (notification.value.relatedContent) {
        try {
          return JSON.parse(notification.value.relatedContent)
        } catch (e) {
          console.error('解析相关内容失败:', e)
          return null
        }
      }
      return null
    })

    const getTypeText = (type: string) => {
      const typeMap: Record<string, string> = {
        'SYSTEM': '系统',
        'TRADE': '交易',
        'STUFF': '物品',
        'REPORT': '举报',
        'AUDIT': '审核'
      }
      return typeMap[type] || '其他'
    }

    const getTypeTag = (type: string) => {
      const typeMap: Record<string, string> = {
        'SYSTEM': 'primary',
        'TRADE': 'success',
        'STUFF': 'info',
        'REPORT': 'danger',
        'AUDIT': 'warning'
      }
      return typeMap[type] || 'default'
    }

    const formatTime = (time: number) => {
      try {
        return format(new Date(time), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })
      } catch (err) {
        console.error('格式化时间失败:', err)
        return ''
      }
    }

    const onClickLeft = () => {
      router.back()
    }

    const viewRelated = () => {
      // 处理审核任务通知的跳转
      if (notification.value.notificationType === 'AUDIT' && notification.value.relatedContent) {
        try {
          const auditInfo = JSON.parse(notification.value.relatedContent)
          if (auditInfo.taskId && auditInfo.itemId) {
            router.push(`/audit/${auditInfo.taskId}?itemId=${auditInfo.itemId}`)
            return
          }
        } catch (e) {
          console.error('解析审核信息失败:', e)
        }
      }
      
      // 根据通知类型跳转到相应页面
      switch (notification.value.notificationType) {
        case 'STUFF':
        case 'TRADE':
          router.push(`/stuff/detail/${notification.value.relatedId}`)
          break
        // 添加其他类型的跳转逻辑
      }
    }

    const loadNotificationDetail = async () => {
      const notificationId = route.params.id as string
      if (!notificationId) {
        error.value = '通知ID不存在'
        loading.value = false
        return
      }

      loading.value = true
      error.value = ''

      try {
        // 调用获取通知详情的API
        const res = await notificationApi.getNotificationDetail(notificationId)
        if (res.success) {
          notification.value = res.data
        } else {
          error.value = res.desc || '获取通知详情失败'
        }
      } catch (e) {
        console.error('获取通知详情失败:', e)
        error.value = '网络错误，请稍后重试'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadNotificationDetail()
    })

    return {
      notification,
      loading,
      error,
      parseRelatedContent,
      getTypeText,
      getTypeTag,
      formatTime,
      onClickLeft,
      viewRelated,
      loadNotificationDetail
    }
  }
})
</script>

<style scoped>
.notification-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 16px;
}

.loading-text {
  font-size: 14px;
  color: #999;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 16px;
  padding: 0 20px;
  text-align: center;
}

.error-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.empty-container {
  padding: 60px 20px;
  text-align: center;
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

.related-content {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.related-title {
  font-size: 14px;
  font-weight: 600;
  color: #323233;
  margin: 0 0 12px;
}

.related-info {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
}

.info-item {
  font-size: 13px;
  color: #646566;
  margin: 0 0 8px;
  line-height: 1.4;
}

.info-item:last-child {
  margin-bottom: 0;
}

@media (max-width: 375px) {
  .detail-card {
    margin: 8px;
    padding: 16px;
  }
  
  .title {
    font-size: 16px;
  }
  
  .content {
    font-size: 13px;
  }
}
</style> 
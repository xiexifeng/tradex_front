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
            :type="getTypeTag(notification.notificationType) as any"
          >
            {{ getTypeText(notification.notificationType) }}
          </van-tag>
          <span class="time">{{ formatTime(notification.createTime) }}</span>
        </div>
      </div>
      <div class="content">
        {{ notification.content }}
      </div>
      <div class="related-content" v-if="notification.relatedContent && notification.notificationType === 'STUFF' && parseRelatedContent">
        <div class="related-info" v-if="parseRelatedContent.auditRemark">
          <p class="info-item" :style="{ color: parseRelatedContent.auditResult === false ? 'red' : '' }">原因：{{ parseRelatedContent.auditRemark }}</p>
        </div>
      </div>
      <div class="actions" v-if="notification.relatedId">
        <van-button 
          type="primary" 
          block 
          round
          @click="viewRelated"
        >
          {{ notification.notificationType === 'AUDIT' ? (notification.isDone ? '查看已完成审核' : '前往审核') : '查看详情' }}

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
          router.push(`/stuff/detail/${parseRelatedContent.value.itemId}`)
          break
        case 'TRADE':
          router.push(`/trade/${notification.value.relatedId}`)
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

<style lang="scss" scoped>
$nav-gradient: linear-gradient(135deg, #1989fa 0%, #39a0ff 100%);
$primary: #1989fa;
$text-title: #323233;
$text-body: #646566;
$text-meta: #969799;
$bg-page: #f5f6f8;
$border-light: #ebedf0;
$card-radius: 14px;
$card-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

.notification-detail {
  min-height: 100vh;
  background: $bg-page;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* 导航栏与列表页一致 */
.van-nav-bar {
  :deep(.van-nav-bar__content) {
    background: $nav-gradient;
    box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
  }
  :deep(.van-nav-bar__title) {
    color: #fff;
    font-size: 17px;
    font-weight: 600;
  }
  :deep(.van-icon) {
    color: rgba(255, 255, 255, 0.95);
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 14px;
}

.loading-text {
  font-size: 14px;
  color: $text-meta;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
  padding: 24px 20px;
  text-align: center;

  .van-button {
    margin-top: 8px;
    min-width: 120px;
  }
}

.error-text {
  font-size: 14px;
  color: $text-body;
  line-height: 1.6;
}

.empty-container {
  padding: 80px 24px;
  text-align: center;
}

.detail-card {
  margin: 14px;
  padding: 22px 20px;
  background: #fff;
  border-radius: $card-radius;
  box-shadow: $card-shadow;
}

.detail-header {
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 1px solid $border-light;
}

.title {
  margin: 0 0 14px;
  font-size: 19px;
  font-weight: 600;
  color: $text-title;
  line-height: 1.4;
  letter-spacing: 0.3px;
}

.meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.time {
  font-size: 12px;
  color: $text-meta;
}

.content {
  font-size: 15px;
  line-height: 1.7;
  color: $text-body;
  margin-bottom: 24px;
  white-space: pre-wrap;
  word-break: break-word;
}

.actions {
  margin-top: 24px;

  :deep(.van-button) {
    height: 44px;
    font-size: 15px;
    font-weight: 500;
    background: $nav-gradient;
    border: none;
  }
}

.related-content {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid $border-light;
}

.related-title {
  font-size: 14px;
  font-weight: 600;
  color: $text-title;
  margin: 0 0 12px;
}

.related-info {
  background: #f7f8fa;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #eee;
}

.info-item {
  font-size: 13px;
  color: $text-body;
  margin: 0 0 8px;
  line-height: 1.5;
}

.info-item:last-child {
  margin-bottom: 0;
}

@media (max-width: 375px) {
  .detail-card {
    margin: 10px;
    padding: 18px 16px;
  }

  .title {
    font-size: 17px;
  }

  .content {
    font-size: 14px;
  }
}
</style> 
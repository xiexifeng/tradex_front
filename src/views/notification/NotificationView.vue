<template>
  <div class="notification">
    <van-nav-bar
      title="消息中心"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-tabs
      v-model:active="activeTab"
      sticky
      swipeable
      @change="onTabChange"
    >
      <van-tab
        v-for="tab in statusTabs"
        :key="tab.value"
        :title="tab.title"
      >
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          loading-text="加载中..."
          @load="loadMore"
        >
          <notification-list
            :notifications="notifications"
            @click-item="viewDetail"
          />
        </van-list>
      </van-tab>
    </van-tabs>
  </div>

  <!-- 底部导航栏 -->
  <AppTabBar />
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import NotificationList from './components/NotificationList.vue'
import AppTabBar from '@/components/ui/AppTabBar.vue'
import { notificationApi } from '@/api/notification'
import type { Notification } from '@/api/types'

export default defineComponent({
  components: {
    NotificationList,
    AppTabBar
  },
  setup() {
    const router = useRouter()
    const notifications = ref<Notification[]>([])
    const activeTab = ref(0)
    const loading = ref(false)
    const finished = ref(false)
    const pageNo = ref(1)
    const pageSize = ref(10)
    const requestId = ref(0)

    const statusTabs: Array<{ title: string; value: Notification['status'] | 0 }> = [
      { title: '全部', value: 0 },
      { title: '未读', value: 1 },
      { title: '已读', value: 2 }
    ]

    const currentStatus = computed(() => statusTabs[activeTab.value]?.value)

    const loadNotifications = async (
      status: Notification['status'] | 0 = currentStatus.value,
      { reset = false }: { reset?: boolean } = {}
    ) => {
      // console.log('loadNotifications:loading.value:'+loading.value)
      // console.log('loadNotifications:finished.value:'+finished.value)
      if (loading.value) return

      if (reset) {
        requestId.value++
        pageNo.value = 1
        finished.value = false
        notifications.value = []
      }

      loading.value = true

      try {
        const res = await notificationApi.listMyNotification({
          pageNo: pageNo.value,
          pageSize: pageSize.value,
          status
        })

        if (res.success) {
          if (pageNo.value === 1) {
            notifications.value = res.data
          } else {
            notifications.value = [...notifications.value, ...res.data]
          }
          if (res.data.length < pageSize.value) {
            finished.value = true
          } else {
            pageNo.value++
          }
        } else {
          finished.value = true
        }
      } catch (error) {
        console.error('加载通知失败:', error)
        finished.value = true
      } finally {
        loading.value = false
      }
    }

    // 加载更多
    const loadMore = async () => {
      if (finished.value) return
      loading.value = false;
      await loadNotifications()
    }

    const onTabChange = () => {
      loadNotifications(currentStatus.value, { reset: true })
    }

    const onClickLeft = () => {
      router.back()
    }

    const viewDetail = (notification: any) => {
      if (notification.notificationType === 'AUDIT' && notification.relatedContent) {
        try {
          const auditInfo = JSON.parse(notification.relatedContent)
          if (auditInfo.taskId && auditInfo.itemId) {
            router.push(`/audit/${auditInfo.taskId}?itemId=${auditInfo.itemId}`)
            return
          }
        } catch (e) {
          console.error('解析审核信息失败:', e)
        }
      }
      router.push(`/notification/detail/${notification.id}`)
    }

    const userStore = useUserStore()
    const userInfo = computed(() => userStore.userInfo)
    onMounted(() => {
      if (!userStore.token || !userInfo.value) {
        router.push('/login')
        return
      }
      loadNotifications()
    })

    return {
      loading,
      finished,
      notifications,
      statusTabs,
      activeTab,
      onClickLeft,
      viewDetail,
      loadMore,
      onTabChange
    }
  }
})
</script>

<style lang="scss" scoped>
.notification {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}

.van-nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #39a0ff);
  }
  
  :deep(.van-nav-bar__title) {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }
  
  :deep(.van-icon) {
    color: #fff;
  }
}

.van-tabs {
  :deep(.van-tabs__wrap) {
    height: 48px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    
    .van-tabs__nav {
      padding: 6px 0;
      
      &::before {
        display: none;
      }
    }
    
    .van-tab {
      font-size: 14px;
      color: #666;
      line-height: 36px;
      transition: all 0.3s ease;
      position: relative;
      
      &--active {
        color: #1989fa;
        font-weight: 500;
        transform: scale(1.05);
      }
    }
    
    .van-tabs__line {
      background: linear-gradient(to right, #1989fa, #39a0ff);
      height: 3px;
      border-radius: 3px;
      bottom: 8px;
      transition: all 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
  
  :deep(.van-tabs__content) {
    background: transparent;
    
    .van-tab__pane {
      animation: fadeIn 0.3s ease-out;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0.8;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

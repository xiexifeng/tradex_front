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
$nav-gradient: linear-gradient(135deg, #1989fa 0%, #39a0ff 100%);
$tab-active: #1989fa;
$bg-page: #f5f6f8;
$card-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

.notification {
  min-height: 100vh;
  background: $bg-page;
  padding-bottom: calc(50px + env(safe-area-inset-bottom, 0));
}

.van-nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;

  :deep(.van-nav-bar__content) {
    background: $nav-gradient;
    box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
  }

  :deep(.van-nav-bar__title) {
    color: #fff;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  :deep(.van-icon) {
    color: rgba(255, 255, 255, 0.95);
  }

  :deep(.van-nav-bar__arrow) {
    font-size: 20px;
  }
}

.van-tabs {
  :deep(.van-tabs__wrap) {
    height: 48px;
    background: #fff;
    box-shadow: $card-shadow;

    .van-tabs__nav {
      padding: 6px 12px 0;

      &::before {
        display: none;
      }
    }

    .van-tab {
      font-size: 15px;
      color: #646566;
      line-height: 36px;
      transition: color 0.25s ease, transform 0.2s ease;
      position: relative;

      &--active {
        color: $tab-active;
        font-weight: 600;
      }
    }

    .van-tabs__line {
      background: $nav-gradient;
      height: 3px;
      border-radius: 2px;
      bottom: 8px;
      width: 24px;
      margin: 0 auto;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }

  :deep(.van-tabs__content) {
    background: transparent;
    min-height: 50vh;

    .van-tab__pane {
      animation: fadeIn 0.3s ease-out;
    }
  }

  :deep(.van-list__finished-text),
  :deep(.van-list__loading-text) {
    color: #969799;
    font-size: 13px;
    padding: 16px 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0.85;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

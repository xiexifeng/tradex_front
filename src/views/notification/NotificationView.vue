<template>
  <div class="notification">
    <van-nav-bar
      title="消息中心"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-tabs v-model:active="activeTab" sticky swipeable>
      <van-tab title="全部">
        <notification-list :notifications="notifications" @click-item="viewDetail"/>
      </van-tab>
      <van-tab title="未读">
        <notification-list :notifications="unreadNotifications" @click-item="viewDetail"/>
      </van-tab>
      <van-tab title="已读">
        <notification-list :notifications="readNotifications" @click-item="viewDetail"/>
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

    const loadNotifications = async () => {
      const res = await notificationApi.listMyNotification({ pageNo: 1, pageSize: 10 })
      notifications.value = res.data
    }

    const unreadNotifications = computed(() => {
      return notifications.value.filter(item => item.status === 1)
    })

    const readNotifications = computed(() => {
      return notifications.value.filter(item => item.status === 2)
    })

    const onClickLeft = () => {
      router.back()
    }

    const viewDetail = (notification: any) => {
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
      notifications,
      unreadNotifications,
      readNotifications,
      activeTab,
      onClickLeft,
      viewDetail
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

.notification-list {
  padding: 12px;
  
  .notification-item {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    position: relative;
    
    &:active {
      transform: scale(0.98);
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, #1989fa, #39a0ff);
      border-radius: 4px 0 0 4px;
    }
    
    .notification-header {
      padding: 16px;
      border-bottom: 1px solid #f5f5f5;
      
      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .type-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 18px;
          
          &.system {
            color: #1989fa;
            background: rgba(25, 137, 250, 0.1);
          }
          
          &.trade {
            color: #1989fa;
            background: rgba(25, 137, 250, 0.1);
          }
        }
      }
      
      .status-tag {
        padding: 2px 12px;
        border-radius: 12px;
        font-size: 12px;
        
        &.unread {
          color: #1989fa;
          background: rgba(25, 137, 250, 0.1);
        }
        
        &.read {
          color: #969799;
          background: #f5f5f5;
        }
      }
    }
    
    .notification-content {
      padding: 16px;
      background: #fafafa;
    }
    
    .notification-footer {
      padding: 12px 16px;
      border-top: 1px solid #f5f5f5;
      
      .action-link {
        color: #1989fa;
        
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
  
  .empty-state {
    padding: 48px 16px;
    text-align: center;
    
    .empty-icon {
      font-size: 48px;
      color: #969799;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 50%;
      margin-bottom: 16px;
    }
    
    :deep(.van-empty__description) {
      color: #969799;
      font-size: 14px;
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

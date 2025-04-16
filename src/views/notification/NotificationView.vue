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
  <van-tabbar v-model="activeTab" fixed route>
      <van-tabbar-item icon="home-o" to="/">
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="envelop-o" to="/notification">
        消息
      </van-tabbar-item>
      <van-tabbar-item to="/stuff/publish">
        <template #icon>
          <div class="publish-button">
            <van-icon name="plus" size="20" />
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/stuff/trades">
        交易列表
      </van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user/profile">
        我的
      </van-tabbar-item>
    </van-tabbar>

    <!-- 为底部导航腾出空间 -->
    <div class="bottom-space"></div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NotificationList from './components/NotificationList.vue'

export default defineComponent({
  components: {
    NotificationList
  },
  setup() {
    const router = useRouter()
    const activeTab = ref(0)

    // 模拟通知数据
    const notifications = ref([
      {
        "id": "2025032500011",
        "userId": "20250324000001",
        "notificationType": 2,
        "relatedId": "2025032500010",
        "title": "交易通知",
        "content": "换物交易完成-积分增加5",
        "status": 1,
        "createTime": "2025-04-01 12:00:00"
      },
      {
        "id": "2025032500012",
        "userId": "20250324000001",
        "notificationType": 1,
        "relatedId": "2025032500011",
        "title": "系统通知",
        "content": "您的物品已通过审核",
        "status": 0,
        "createTime": "2025-04-01 11:00:00"
      }
    ])

    const unreadNotifications = computed(() => {
      return notifications.value.filter(item => item.status === 0)
    })

    const readNotifications = computed(() => {
      return notifications.value.filter(item => item.status === 1)
    })

    const onClickLeft = () => {
      router.back()
    }

    const viewDetail = (notification: any) => {
      router.push(`/notification/detail/${notification.id}`)
    }

    return {
      activeTab,
      notifications,
      unreadNotifications,
      readNotifications,
      onClickLeft,
      viewDetail
    }
  }
})
</script>

<style scoped>
.notification {
  min-height: 100vh;
  background-color: #f7f8fa;
}

:deep(.van-tabs__line) {
  background: linear-gradient(to right, #ff6034, #ee0a24);
}

:deep(.van-tab--active) {
  color: #ee0a24;
  font-weight: bold;
}

.bottom-space {
  height: 50px;
}

.publish-button {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1989fa, #0066ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
}

.publish-button .van-icon {
  color: white;
}

/* 调整底部导航样式 */
:deep(.van-tabbar-item) {
  color: #7d7e80;
}

:deep(.van-tabbar-item--active) {
  color: #1989fa;
}

:deep(.van-tabbar-item__icon) {
  font-size: 20px;
}

:deep(.van-tabbar-item:nth-child(3)) {
  margin-top: -14px;
}

:deep(.van-tabbar-item:nth-child(3) .van-tabbar-item__text) {
  margin-top: 4px;
}
</style>

<template>
  <div class="settings">
    <van-nav-bar
      title="设置"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="settings-content">
      <!-- 常规设置项 -->
      <van-cell-group inset class="settings-group">
        <van-cell 
          title="账号与安全" 
          is-link 
          @click="goToSecurity"
        >
          <template #icon>
            <van-icon name="shield-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset class="settings-group">
        <van-cell 
          title="收货地址" 
          is-link 
          @click="goToAddress"
        >
          <template #icon>
            <van-icon name="location-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset class="settings-group">
        <van-cell 
          title="帮助与客服" 
          is-link 
          @click="goToHelp"
        >
          <template #icon>
            <van-icon name="service-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group inset class="settings-group">
        <van-cell 
          title="关于X平台" 
          is-link 
          @click="goToAbout"
        >
          <template #icon>
            <van-icon name="info-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 底部固定操作区 -->
    <div class="bottom-actions">
      <van-cell-group inset>
        <van-cell 
          title="切换账号" 
          is-link 
          @click="switchAccount"
          class="switch-account"
        >
          <template #icon>
            <van-icon name="exchange" class="cell-icon" />
          </template>
        </van-cell>
        <van-cell 
          title="退出登录" 
          @click="logout"
          class="logout-cell"
        >
          <template #icon>
            <van-icon name="close" class="cell-icon logout-icon" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog } from 'vant'
import { useUserStore } from '@/store/modules/user'

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const onClickLeft = () => {
      router.back()
    }

    const goToSecurity = () => {
      router.push('/user/security')
    }

    const goToAddress = () => {
      router.push('/user/address')
    }

    const goToHelp = () => {
      router.push('/user/help')
    }

    const goToAbout = () => {
      router.push('/user/about')
    }

    const switchAccount = () => {
      router.push('/login')
    }

    const logout = () => {
      showDialog({
        title: '退出登录',
        message: '确定要退出登录吗？',
        showCancelButton: true,
      }).then(() => {
        // 清除用户登录状态
        userStore.logout()
        router.push('/login')
      })
    }

    return {
      onClickLeft,
      goToSecurity,
      goToAddress,
      goToHelp,
      goToAbout,
      switchAccount,
      logout
    }
  }
})
</script>

<style scoped lang="scss">
.settings {
  min-height: 100vh;
  position: relative;
  background: linear-gradient(180deg, #eaf2ff 0%, #f7f8fa 200px);
  padding-bottom: 140px; /* 为底部操作区留出空间 */
}

.van-nav-bar {
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #0066ff);
  }

  :deep(.van-nav-bar__title),
  :deep(.van-icon) {
    color: #fff;
  }
}

.settings-content {
  padding: 12px 12px 0;
}

.settings-group {
  margin-bottom: 12px;

  :deep(.van-cell-group--inset) {
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
}

.bottom-actions {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 12px calc(12px + env(safe-area-inset-bottom));
  background: rgba(247, 248, 250, 0.9);
  backdrop-filter: blur(8px);

  :deep(.van-cell-group--inset) {
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
}

.cell-icon {
  margin-right: 10px;
  font-size: 20px;
  color: #1989fa;
}

:deep(.van-cell) {
  align-items: center;
  padding: 16px 14px;
}

::deep(.van-cell:active) {
  background-color: #f2f3f5;
}

.switch-account {
  border-bottom: 1px solid #f2f3f5;
}

.logout-cell {
  :deep(.van-cell__title),
  :deep(.van-cell__value),
  :deep(.van-icon) {
    color: #ee0a24;
  }
}

.logout-icon {
  color: #ee0a24;
}
</style> 
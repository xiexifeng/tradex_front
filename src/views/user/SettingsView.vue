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

export default defineComponent({
  name: 'SettingsView',
  setup() {
    const router = useRouter()

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

<style scoped>
.settings {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 120px; /* 为底部操作区留出空间 */
  position: relative;
}

.settings-content {
  padding: 12px;
}

.settings-group {
  margin-bottom: 12px;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background-color: #f7f8fa;
}

.cell-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #969799;
}

:deep(.van-cell) {
  align-items: center;
  padding: 16px;
}

.switch-account {
  border-bottom: 1px solid #f5f5f5;
}

.logout-cell {
  color: #ee0a24;
}

.logout-icon {
  color: #ee0a24;
}
</style> 
<template>
  <div class="security">
    <van-nav-bar
      title="账号与安全"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="security-content">
      <!-- 手机号 -->
      <van-cell-group inset class="security-group">
        <van-cell title="手机号" :value="maskedPhone" />
      </van-cell-group>

      <!-- 登录密码 -->
      <van-cell-group inset class="security-group">
        <van-cell 
          title="登录密码" 
          :value="loginPasswordStatus"
          is-link
          @click="handleSetLoginPassword"
        >
          <template #icon>
            <van-icon name="lock" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 交易密码 -->
      <van-cell-group inset class="security-group">
        <van-cell 
          title="交易密码" 
          :value="tradePasswordStatus"
          is-link
          @click="handleSetTradePassword"
        >
          <template #icon>
            <van-icon name="shield-o" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 微信账号 -->
      <van-cell-group inset class="security-group">
        <van-cell 
          title="微信账号" 
          :value="userInfo?.wechat || '未绑定'"
        >
          <template #icon>
            <van-icon name="wechat" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- QQ账号 -->
      <van-cell-group inset class="security-group">
        <van-cell 
          title="QQ账号" 
          :value="userInfo?.qq || '未绑定'"
        >
          <template #icon>
            <van-icon name="qq" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 实名认证 -->
      <van-cell-group inset class="security-group">
        <van-cell 
          title="实名认证" 
          :value="authStatusText"
        >
          <template #icon>
            <van-icon name="certificate" class="cell-icon" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 注销账号 -->
      <van-cell-group inset class="security-group">
        <van-cell 
          title="注销账号" 
          value=""
          is-link
          @click="handleDeleteAccount"
          class="delete-account"
        >
          <template #icon>
            <van-icon name="delete-o" class="cell-icon delete-icon" />
          </template>
        </van-cell>
      </van-cell-group>
    </div>

    <!-- 设置密码弹窗 -->
    <van-popup
      v-model:show="showPasswordDialog"
      position="bottom"
      round
      closeable
      :style="{ height: '50%' }"
    >
      <div class="password-popup">
        <div class="popup-title">{{ passwordDialogTitle }}</div>
        <van-form @submit="confirmSetPassword">
          <van-cell-group inset>
            <van-field
              v-model="passwordForm.password"
              name="password"
              type="password"
              label="密码"
              placeholder="请输入密码"
              :rules="[
                { required: true, message: '请输入密码' },
                { pattern: /^.{6,}$/, message: '密码长度至少6位' }
              ]"
            />
            <van-field
              v-model="passwordForm.confirmPassword"
              name="confirmPassword"
              type="password"
              label="确认密码"
              placeholder="请再次输入密码"
              :rules="[
                { required: true, message: '请再次输入密码' },
                { validator: validatePasswordMatch, message: '两次输入的密码不一致' }
              ]"
            />
          </van-cell-group>
          <div class="submit-button">
            <van-button round block type="primary" native-type="submit" :loading="isSubmitting">
              确认设置
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog, showConfirmDialog } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { userApi } from '@/api/user'

export default defineComponent({
  name: 'SecurityView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const userInfo = computed(() => userStore.userInfo)
    const loginAccount = computed(() => userStore.loginAccount)
    const phone = ref(loginAccount.value?.phone || '')
    console.log('loginAccount:', loginAccount.value)
    const loginPasswordSet = ref(loginAccount.value?.loginPasswordSet || false)
    const tradePasswordSet = ref(loginAccount.value?.tradePasswordSet || false)
    const showPasswordDialog = ref(false)
    const passwordType = ref<'login' | 'trade'>('login')
    const isSubmitting = ref(false)
    const passwordForm = ref({
      password: '',
      confirmPassword: ''
    })

    // 从 token 中解析手机号
    const parsePhoneFromToken = () => {
      try {
        const token = userStore.token
        if (!token) return ''
        
        // JWT token 格式: header.payload.signature
        const payload = token.split('.')[1]
        if (!payload) return ''
        
        const decoded = JSON.parse(atob(payload))
        // token 中的 sub 字段包含用户信息
        if (decoded.sub) {
          const userData = JSON.parse(decoded.sub)
          return userData.phone || ''
        }
        return ''
      } catch (error) {
        console.error('解析手机号失败:', error)
        return ''
      }
    }

    // 手机号掩码显示
    const maskedPhone = computed(() => {
      if (!phone.value || phone.value.length !== 11) {
        return '未绑定'
      }
      // 11位手机号，中间4位掩码：138****5678
      return phone.value.slice(0, 3) + '****' + phone.value.slice(7)
    })

    // 登录密码状态
    const loginPasswordStatus = computed(() => {
      return loginPasswordSet.value ? '已设置' : '未设置'
    })

    // 交易密码状态
    const tradePasswordStatus = computed(() => {
      return tradePasswordSet.value ? '已设置' : '未设置'
    })

    // 实名认证状态
    const authStatusText = computed(() => {
      const status = userInfo.value?.authStatus
      if (!status) return '未认证'
      // 可以根据实际状态值映射
      return status === 'AUTHENTICATED' ? '已认证' : '未认证'
    })

    // 密码对话框标题
    const passwordDialogTitle = computed(() => {
      return passwordType.value === 'login' ? '设置登录密码' : '设置交易密码'
    })

    // 验证密码是否一致
    const validatePasswordMatch = (value: string) => {
      return value === passwordForm.value.password
    }

    // 处理设置登录密码
    const handleSetLoginPassword = () => {
      passwordType.value = 'login'
      passwordForm.value = {
        password: '',
        confirmPassword: ''
      }
      showPasswordDialog.value = true
    }

    // 处理设置交易密码
    const handleSetTradePassword = () => {
      passwordType.value = 'trade'
      passwordForm.value = {
        password: '',
        confirmPassword: ''
      }
      showPasswordDialog.value = true
    }

    // 确认设置密码
    const confirmSetPassword = async () => {
      if (!passwordForm.value.password) {
        showToast('请输入密码')
        return
      }

      if (passwordForm.value.password !== passwordForm.value.confirmPassword) {
        showToast('两次输入的密码不一致')
        return
      }

      if (passwordForm.value.password.length < 6) {
        showToast('密码长度至少6位')
        return
      }

      isSubmitting.value = true
      try {
        if (passwordType.value === 'login') {
          await userApi.setLoginPassword(passwordForm.value.password)
          if(loginAccount.value) {
            userStore.setLoginAccount({
              ...loginAccount.value,
              loginPasswordSet: true
            })
          }
          showToast('登录密码设置成功')
        } else {
          await userApi.setTradePassword(passwordForm.value.password)
          if(loginAccount.value) {
            userStore.setLoginAccount({
              ...loginAccount.value,
              tradePasswordSet: true
            })
          }
          showToast('交易密码设置成功')
        }
        showPasswordDialog.value = false
        passwordForm.value = {
          password: '',
          confirmPassword: ''
        }
      } catch (error: any) {
        console.error('设置密码失败:', error)
        showToast(error?.response?.data?.desc || '设置密码失败，请重试')
      } finally {
        isSubmitting.value = false
      }
    }

    // 处理注销账号
    const handleDeleteAccount = () => {
      showConfirmDialog({
        title: '注销账号',
        message: '注销账号后，您的所有数据将被永久删除，且无法恢复。确定要注销吗？',
        confirmButtonColor: '#ee0a24'
      }).then(() => {
        showToast('注销账号功能开发中')
        // TODO: 实现注销账号功能
      }).catch(() => {
        // 用户取消
      })
    }

    const onClickLeft = () => {
      router.back()
    }

    onMounted(() => {
      // 从 token 中解析手机号
      // phone.value = parsePhoneFromToken()
      
      // TODO: 如果接口支持，可以从接口获取密码设置状态
      // 目前假设密码未设置，用户点击设置后才会设置
    })

    return {
      userInfo,
      phone,
      maskedPhone,
      loginPasswordStatus,
      tradePasswordStatus,
      authStatusText,
      showPasswordDialog,
      passwordDialogTitle,
      passwordForm,
      validatePasswordMatch,
      handleSetLoginPassword,
      handleSetTradePassword,
      confirmSetPassword,
      handleDeleteAccount,
      onClickLeft,
      isSubmitting
    }
  }
})
</script>

<style lang="scss" scoped>
.security {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.security-content {
  padding: 12px;
}

.security-group {
  margin-bottom: 12px;
}

.cell-icon {
  margin-right: 8px;
  font-size: 20px;
  color: #969799;
}

.delete-account {
  color: #ee0a24;
}

.delete-icon {
  color: #ee0a24;
}

.password-popup {
  padding: 16px;
}

.popup-title {
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  padding: 16px 0;
  border-bottom: 1px solid #ebedf0;
  margin-bottom: 16px;
}

.submit-button {
  padding: 16px;
  padding-top: 24px;
}

:deep(.van-cell) {
  align-items: center;
  padding: 16px;
}
</style>

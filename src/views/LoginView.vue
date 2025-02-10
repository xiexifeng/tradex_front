<template>
  <div class="login">
    <van-nav-bar
      title="用户登录"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="login-container">
      <div class="login-header">
        <img src="@/assets/logo.png" alt="logo" class="logo">
        <h2>区块链电商平台</h2>
      </div>

      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-model="username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
          />
          <van-field
            v-model="password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '请填写密码' }]"
          />
        </van-cell-group>

        <div class="submit-btn">
          <van-button round block type="primary" native-type="submit">
            登录
          </van-button>
        </div>

        <div class="actions">
          <van-button type="text" size="small" @click="onRegister">
            注册账号
          </van-button>
          <van-button type="text" size="small" @click="onForgotPassword">
            忘记密码
          </van-button>
        </div>
      </van-form>

      <div class="blockchain-info">
        <van-icon name="shield-o" />
        <span>区块链加密保护</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'LoginView',
  setup() {
    const router = useRouter()
    const username = ref('')
    const password = ref('')

    const onClickLeft = () => {
      router.back()
    }

    const onSubmit = (values: any) => {
      console.log('submit', values)
      // 处理登录逻辑
    }

    const onRegister = () => {
      router.push('/register')
    }

    const onForgotPassword = () => {
      router.push('/forgot-password')
    }

    return {
      username,
      password,
      onClickLeft,
      onSubmit,
      onRegister,
      onForgotPassword
    }
  }
})
</script>

<style scoped>
.login {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.login-container {
  padding: 20px;
}

.login-header {
  text-align: center;
  margin: 40px 0;
}

.logo {
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
}

.login-header h2 {
  color: #323233;
  font-size: 24px;
  margin: 0;
}

.submit-btn {
  margin: 24px 16px;
}

.actions {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
}

.blockchain-info {
  text-align: center;
  margin-top: 40px;
  color: #969799;
  font-size: 14px;
}

.blockchain-info .van-icon {
  margin-right: 4px;
  vertical-align: -2px;
}
</style> 
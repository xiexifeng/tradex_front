<template>
  <div class="login-container">
    <div class="login-header">
      <h2>欢迎登录</h2>
      <p class="sub-title">请输入您的账号和密码</p>
    </div>

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="username"
          placeholder="用户名/手机号/邮箱"
          :rules="[{ required: true, message: '请填写用户名' }]"
        >
          <template #left-icon>
            <van-icon name="user-o" />
          </template>
        </van-field>

        <van-field
          v-model="password"
          :type="passwordType"
          name="password"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        >
          <template #left-icon>
            <van-icon name="lock" />
          </template>
          <template #right-icon>
            <van-icon
              :name="passwordType === 'password' ? 'closed-eye' : 'eye-o'"
              @click="togglePasswordVisibility"
            />
          </template>
        </van-field>
      </van-cell-group>

      <div class="form-actions">
        <van-button round block type="primary" native-type="submit" size="large">
          登录
        </van-button>
      </div>

      <div class="additional-links">
        <van-button plain type="primary" size="small">忘记密码？</van-button>
        <van-button plain type="primary" size="small">立即注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';

const username = ref('');
const password = ref('');
const passwordType = ref('password');

const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

const onSubmit = (values: any) => {
  console.log('submit', values);
  showToast('登录中...');
};
</script>

<style scoped lang="less">
.login-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
}

.login-header {
  text-align: center;
  margin: 40px 0;

  h2 {
    font-size: 24px;
    color: #323233;
    margin-bottom: 8px;
  }

  .sub-title {
    font-size: 14px;
    color: #969799;
  }
}

.form-actions {
  margin: 24px 16px;
}

.additional-links {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 16px;

  .van-button {
    color: #666;
  }
}

:deep(.van-cell-group--inset) {
  margin: 0;
}

:deep(.van-field__left-icon) {
  margin-right: 8px;
}
</style>
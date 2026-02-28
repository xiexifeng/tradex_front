<template>
  <div class="login-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="onClickLeft"
    />

    <!-- 登录方式切换 -->
    <van-tabs v-model:active="activeTab" animated swipeable>
      <van-tab title="密码登录">
        <van-form @submit="onPasswordSubmit">
          <van-cell-group inset>
            <van-field
              v-model="passwordForm.username"
              name="username"
              placeholder="请输入手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
            >
              <template #left-icon>
                <van-icon name="phone-o" />
              </template>
            </van-field>

            <van-field
              v-model="passwordForm.password"
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
        </van-form>
      </van-tab>

      <van-tab title="验证码登录">
        <van-form @submit="onCodeSubmit">
          <van-cell-group inset>
            <van-field
              v-model="codeForm.phone"
              name="phone"
              placeholder="请输入手机号"
              :rules="[{ required: true, message: '请填写手机号' }]"
            >
              <template #left-icon>
                <van-icon name="phone-o" />
              </template>
            </van-field>

            <van-field
              v-model="codeForm.code"
              name="code"
              placeholder="请输入验证码"
              :rules="[{ required: true, message: '请填写验证码' }]"
            >
              <template #left-icon>
                <van-icon name="comment-o" />
              </template>
              <template #button>
                <van-button 
                  size="small" 
                  type="primary" 
                  :disabled="!!countdown"
                  @click="onSendCode"
                >
                  {{ countdown ? `${countdown}s后重发` : '发送验证码' }}
                </van-button>
              </template>
            </van-field>
          </van-cell-group>

          <div class="form-actions">
            <van-button round block type="primary" native-type="submit" size="large">
              登录
            </van-button>
          </div>
        </van-form>
      </van-tab>
    </van-tabs>

    <div class="additional-links">
      <van-button plain type="primary" size="small">忘记密码？</van-button>
      <van-button plain type="primary" size="small">立即注册</van-button>
    </div>

    <div class="agreement-entry">
      <span class="text">登录即表示您已阅读并同意</span>
      <span class="link" @click="goPrivacyAgreement">《用户隐私协议》</span>
      <span class="text">与</span>
      <span class="link" @click="goSwapAgreement">《换物使用协议》</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import { userApi } from '@/api/user';
import { useUserStore } from '@/store/modules/user';
import type { LoginResponse } from '@/api/types';

const router = useRouter();
const activeTab = ref(0);
const passwordType = ref<'password' | 'text'>('password');
const countdown = ref(0);

// 密码登录表单
const passwordForm = ref({
  username: '',
  password: ''
});

// 验证码登录表单
const codeForm = ref({
  phone: '',
  code: ''
});

const userStore = useUserStore();

const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

const onClickLeft = () => {
  router.push('/');
};

const goPrivacyAgreement = () => {
  router.push('/agreement/privacy');
};

const goSwapAgreement = () => {
  router.push('/agreement/swap');
};

// 发送验证码
const onSendCode = async () => {
  if (!codeForm.value.phone) {
    showToast('请输入手机号');
    return;
  }
  
  try {
    await userApi.sendSms(codeForm.value.phone);
    showToast('验证码已发送');
    startCountdown();
  } catch (error) {
    console.error('发送验证码失败:', error);
  }
};

const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value--;
  }, 1000);
};

// 密码登录提交
const onPasswordSubmit = (values: any) => {
  console.log('password submit', values);
  showToast('登录中...');
};

// 验证码登录提交
const onCodeSubmit = async (values: any) => {
  try {
    const res = await userApi.loginByCode(values.phone, values.code);
    const { token, client, phone, username, loginPasswordSet, tradePasswordSet, userContext } = (res.data as unknown) as LoginResponse;
    
    userStore.setToken(token);
    userStore.setUserInfo(userContext);
    userStore.setLoginAccount({
      userId: userContext.userId,
      phone: phone,
      client: client,
      username: username,
      loginPasswordSet: loginPasswordSet,
      tradePasswordSet: tradePasswordSet
    });
    
    showToast('登录成功');
    router.push('/');
  } catch (error) {
    console.error('登录失败:', error);
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}

.van-nav-bar {
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #0066ff);
  }
  
  :deep(.van-nav-bar__title), :deep(.van-icon) {
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
      
      &--active {
        color: #1989fa;
        font-weight: 500;
        transform: scale(1.05);
      }
    }
    
    .van-tabs__line {
      background: linear-gradient(to right, #1989fa, #0066ff);
      height: 3px;
      border-radius: 3px;
      bottom: 8px;
    }
  }
}

.form-actions {
  margin: 24px 16px;
  
  :deep(.van-button) {
    background: linear-gradient(to right, #1989fa, #0066ff);
    border: none;
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    
    &:active {
      opacity: 0.9;
    }
  }
}

.additional-links {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 16px;
  
  :deep(.van-button) {
    color: #1989fa;
    border-color: #1989fa;
    
    &:active {
      opacity: 0.8;
    }
  }
}

.agreement-entry {
  margin-top: 14px;
  padding: 0 18px;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #777;

  .link {
    color: #1989fa;
    cursor: pointer;
  }
}

:deep(.van-cell-group--inset) {
  margin: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

:deep(.van-field__left-icon) {
  margin-right: 8px;
  color: #1989fa;
}

:deep(.van-field__button) {
  .van-button {
    background: linear-gradient(to right, #1989fa, #0066ff);
    border: none;
    height: 32px;
    padding: 0 12px;
    font-size: 14px;
    
    &:active {
      opacity: 0.9;
    }
  }
}
</style>
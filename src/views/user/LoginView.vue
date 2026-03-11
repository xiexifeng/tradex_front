<template>
  <div class="login-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="登录"
      left-arrow
      @click-left="onClickLeft"
    />

    <!-- 登录页 Slogan 区 -->
    <div class="hero-section">
      <div class="hero-text">
        <div class="hero-title">欢迎来到 X平台</div>
        <div class="hero-subtitle">登录后即可发布闲置、发起换物并查看交易进度</div>
      </div>
    </div>

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

          <div class="forgot-row">
            <span class="forgot-link">忘记密码？</span>
          </div>

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
      <!-- 预留后续注册入口 -->
      <!-- <van-button plain type="primary" size="small">立即注册</van-button> -->
    </div>

    <div class="agreement-entry">
      <span class="text">登录即表示您已阅读并同意</span>
      <span class="link" @click="goPrivacyAgreement">《用户隐私协议》</span>
      <span class="text">与</span>
      <span class="link" @click="goSwapAgreement">《换物使用协议》</span>
      <van-button plain type="primary" size="small">忘记密码？</van-button>
      <van-button plain type="primary" size="small" @click="goToRegister">立即注册</van-button>
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

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register');
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
const onPasswordSubmit = async (values: { username: string; password: string }) => {
  try {
    showToast('登录中...');
    const res = await userApi.loginByPassword(values.username, values.password);
    const { token, userContext } = (res.data as unknown) as LoginResponse;

    userStore.setToken(token);
    userStore.setUserInfo(userContext);

    showToast('登录成功');
    router.push('/');
  } catch (error) {
    console.error('密码登录失败:', error);
    const msg = (error as any)?.message ?? '登录失败，请检查手机号与密码';
    showToast(msg);
  }
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
@import '@/styles/theme.scss';

.login-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #eaf2ff 0%, $background-color 260px);
  padding-bottom: 50px;
}

.van-nav-bar {
  :deep(.van-nav-bar__content) {
    background: $primary-gradient;
  }
  
  :deep(.van-nav-bar__title), :deep(.van-icon) {
    color: #fff;
  }
}

.hero-section {
  padding: 12px 18px 4px;
  color: $text-primary;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-title {
  font-size: $font-size-xl;
  font-weight: 600;
}

.hero-subtitle {
  font-size: $font-size-xs;
  color: $text-regular;
}

.van-tabs {
  :deep(.van-tabs__wrap) {
    height: 48px;
    background: $white;
    box-shadow: $shadow-sm;
    
    .van-tabs__nav {
      padding: 6px 0;
      
      &::before {
        display: none;
      }
    }
    
    .van-tab {
      font-size: $font-size-md;
      color: $text-regular;
      line-height: 36px;
      transition: all 0.3s ease;
      
      &--active {
        color: $primary-color;
        font-weight: 500;
        transform: scale(1.05);
      }
    }
    
    .van-tabs__line {
      background: $primary-gradient;
      height: 3px;
      border-radius: 3px;
      bottom: 8px;
    }
  }
}

.form-actions {
  margin: 24px 16px;
  
  :deep(.van-button) {
    background: $primary-gradient;
    border: none;
    height: 44px;
    font-size: 16px;
    font-weight: 500;
    
    &:active {
      opacity: 0.9;
    }
  }
}

.forgot-row {
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  margin-top: 4px;

  .forgot-link {
    font-size: $font-size-xs;
    color: $primary-color;
  }
}

.additional-links {
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-top: 16px;
  
  :deep(.van-button) {
    color: $primary-color;
    border-color: $primary-color;
    
    &:active {
      opacity: 0.8;
    }
  }
}

.agreement-entry {
  margin-top: 14px;
  padding: 0 18px;
  font-size: $font-size-xs;
  line-height: 18px;
  text-align: center;
  color: $text-regular;

  .link {
    color: $primary-color;
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
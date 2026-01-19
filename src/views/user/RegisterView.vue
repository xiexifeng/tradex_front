<template>
  <div class="register-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="注册"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <!-- 手机号 -->
        <van-field
          v-model="form.phone"
          name="phone"
          label="手机号"
          placeholder="请输入手机号"
          :rules="phoneRules"
          @blur="onPhoneBlur"
        >
          <template #left-icon>
            <van-icon name="phone-o" />
          </template>
        </van-field>
        <div v-if="phoneError" class="error-text">{{ phoneError }}</div>

        <!-- 密码 -->
        <van-field
          v-model="form.password"
          :type="passwordType"
          name="password"
          label="密码"
          placeholder="请输入密码（不少于6位）"
          :rules="passwordRules"
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

        <!-- 性别 -->
        <van-field
          v-model="genderDisplayText"
          name="gender"
          label="性别"
          placeholder="请选择性别"
          readonly
          is-link
          @click="showGenderPicker = true"
        >
          <template #left-icon>
            <van-icon name="friends-o" />
          </template>
        </van-field>

        <!-- 出生日期 -->
        <van-field
          v-model="form.birthday"
          name="birthday"
          label="出生日期"
          placeholder="请选择出生日期"
          readonly
          is-link
          @click="showDatePicker = true"
        >
          <template #left-icon>
            <van-icon name="calendar-o" />
          </template>
        </van-field>

        <!-- 头像URL -->
        <van-field
          v-model="form.avatarUrl"
          name="avatarUrl"
          label="头像URL"
          placeholder="请输入头像URL（选填）"
        >
          <template #left-icon>
            <van-icon name="photo-o" />
          </template>
        </van-field>

        <!-- Email -->
        <van-field
          v-model="form.email"
          name="email"
          label="邮箱"
          placeholder="请输入邮箱（选填）"
          type="email"
        >
          <template #left-icon>
            <van-icon name="envelop-o" />
          </template>
        </van-field>
      </van-cell-group>

      <div class="form-actions">
        <van-button round block type="primary" native-type="submit" size="large" :loading="submitting">
          注册
        </van-button>
      </div>
    </van-form>

    <!-- 性别选择器 -->
    <van-popup v-model:show="showGenderPicker" position="bottom">
      <van-picker
        :columns="genderOptions"
        title="选择性别"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { showToast } from 'vant';
import { useRouter, useRoute } from 'vue-router';
import { userApi } from '@/api/user';
import type { ApiResponse } from '@/api/types';

const router = useRouter();
const route = useRoute();

const passwordType = ref<'password' | 'text'>('password');
const showGenderPicker = ref(false);
const showDatePicker = ref(false);
const phoneError = ref('');
const submitting = ref(false);

// 表单数据
const form = ref({
  phone: '',
  password: '',
  gender: '',
  birthday: '',
  avatarUrl: '',
  email: ''
});

// 从URL参数获取邀请信息
const inviteUserId = ref('');
const inviteTime = ref('');

// 性别选项
const genderOptions = [
  { text: '男', value: 'MAN' },
  { text: '女', value: 'WOMAN' }
];

// 日期选择器
const currentDate = ref<string[]>([]);
const minDate = new Date(1900, 0, 1);
const maxDate = new Date();

// 验证规则
const phoneRules = [
  { required: true, message: '请填写手机号' },
  { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
];

const passwordRules = [
  { required: true, message: '请填写密码' },
  { validator: (value: string) => value.length >= 6, message: '密码不少于6位' }
];

// 切换密码显示
const togglePasswordVisibility = () => {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password';
};

// 手机号失焦验证
const onPhoneBlur = async () => {
  if (!form.value.phone) return;
  
  if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
    phoneError.value = '';
    return;
  }

  try {
    const res = await userApi.verifyPhone(form.value.phone);
    if (res.data === false) {
      phoneError.value = '该手机号已注册，请直接登录';
    } else {
      phoneError.value = '';
    }
  } catch (error) {
    console.error('验证手机号失败:', error);
  }
};

// 性别确认
const onGenderConfirm = ({ selectedOptions }: any) => {
  if (selectedOptions && selectedOptions.length > 0) {
    form.value.gender = selectedOptions[0].value;
  }
  showGenderPicker.value = false;
};

// 性别显示文本
const genderDisplayText = computed(() => {
  const option = genderOptions.find((opt) => opt.value === form.value.gender);
  return option ? option.text : '';
});

// 日期确认
const onDateConfirm = ({ selectedOptions }: any) => {
  if (selectedOptions && selectedOptions.length >= 3) {
    const year = selectedOptions[0].text || selectedOptions[0];
    const month = selectedOptions[1].text || selectedOptions[1];
    const day = selectedOptions[2].text || selectedOptions[2];
    form.value.birthday = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  showDatePicker.value = false;
};

// 返回
const onClickLeft = () => {
  router.push('/login');
};

// 提交注册
const onSubmit = async (values: any) => {
  if (phoneError.value) {
    showToast('请先解决手机号问题');
    return;
  }

  submitting.value = true;
  try {
    const registerData = {
      phone: form.value.phone,
      password: form.value.password,
      gender: form.value.gender || undefined,
      birthday: form.value.birthday || undefined,
      avatarUrl: form.value.avatarUrl || undefined,
      email: form.value.email || undefined,
      inviteUserId: inviteUserId.value || undefined,
      inviteTime: inviteTime.value || undefined
    };

    const res = await userApi.register(registerData);
    if (res.success) {
      showToast('注册成功');
      router.push('/login');
    } else {
      showToast(res.desc || '注册失败');
    }
  } catch (error: any) {
    console.error('注册失败:', error);
    showToast(error.message || '注册失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

// 初始化：从URL参数获取邀请信息
onMounted(() => {
  inviteUserId.value = (route.query.inviteUserId as string) || '';
  inviteTime.value = (route.query.inviteTime as string) || '';
});
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}

.van-nav-bar {
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #0066ff);
    
    .van-nav-bar__title,
    .van-icon {
      color: #fff;
    }
  }
}

.error-text {
  padding: 8px 16px;
  color: #ee0a24;
  font-size: 12px;
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
</style>

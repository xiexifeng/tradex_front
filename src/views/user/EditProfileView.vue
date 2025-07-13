<template>
  <div class="edit-profile">
    <van-nav-bar
      title="编辑资料"
      left-arrow
      @click-left="onClickLeft"
      class="nav-bar"
    >
      <template #right>
        <van-button
          size="small"
          type="primary"
          :loading="saving"
          @click="saveProfile"
        >
          保存
        </van-button>
      </template>
    </van-nav-bar>

    <div class="edit-content">
      <!-- 头像编辑 -->
      <van-cell-group inset class="avatar-group">
        <div class="avatar-section">
          <div class="avatar-wrapper">
            <van-image
              round
              width="80"
              height="80"
              :src="form.avatarUrl || userInfo?.avatarUrl"
              class="avatar"
            />
            <div class="avatar-overlay" @click="uploadAvatar">
              <van-icon name="photograph" size="24" />
            </div>
          </div>
          <div class="avatar-text">
            <p>点击更换头像</p>
            <p class="sub-text">支持 JPG、PNG 格式</p>
          </div>
        </div>
      </van-cell-group>

      <!-- 基本信息 -->
      <van-cell-group inset title="基本信息">
        <van-field
          v-model="form.nickname"
          label="昵称"
          placeholder="请输入昵称"
          :maxlength="20"
          show-word-limit
        />

        <van-field
          v-model="genderDisplayText"
          label="性别"
          readonly
          is-link
          @click="showGenderPicker = true"
        />

        <van-field
          v-model="form.birthday"
          label="生日"
          readonly
          is-link
          @click="openDatePicker"
        />
      </van-cell-group>

      <!-- 联系方式 -->
      <van-cell-group inset title="联系方式">
        <van-field
          v-model="form.address"
          label="地址"
          placeholder="请输入地址"
          type="textarea"
          rows="2"
          autosize
        />

        <van-field
          v-model="form.wechat"
          label="微信"
          placeholder="请输入微信号"
        />

        <van-field v-model="form.qq" label="QQ" placeholder="请输入QQ号" />
      </van-cell-group>

      <!-- 个人简介 -->
      <van-cell-group inset title="个人简介">
        <van-field
          v-model="form.brief"
          label="简介"
          placeholder="介绍一下自己吧..."
          type="textarea"
          rows="4"
          autosize
          :maxlength="200"
          show-word-limit
        />
      </van-cell-group>
    </div>

    <!-- 性别选择器 -->
    <van-popup v-model:show="showGenderPicker" position="bottom">
      <van-picker
        :columns="genderOptions"
        @confirm="onGenderConfirm"
        @cancel="showGenderPicker = false"
        title="选择性别"
      />
    </van-popup>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="selectedDate"
        title="选择生日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>

    <!-- 文件上传 -->
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="onFileChange"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { showToast } from "vant";
import { userApi } from "@/api/user";
import { uploadFile } from "@/api/stuff";
import { useUserStore } from "@/store/modules/user";

export default defineComponent({
  name: "EditProfileView",
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    const userInfo = computed(() => userStore.userInfo);

    const saving = ref(false);
    const showGenderPicker = ref(false);
    const showDatePicker = ref(false);
    const currentDate = ref(new Date());
    const selectedDate = ref(['2025', '02', '10']);
    const fileInput = ref<HTMLInputElement>();

    // 性别选项
    const genderOptions = [
      { text: "男", value: "MAN" },
      { text: "女", value: "FEMALE" },
    ];

    // 性别显示文本
    const genderDisplayText = computed(() => {
      const option = genderOptions.find((opt) => opt.value === form.gender);
      return option ? option.text : "";
    });

    

    // 表单数据
    const form = reactive({
      nickname: "",
      gender: "",
      birthday: "",
      avatarUrl: "",
      address: "",
      wechat: "",
      qq: "",
      brief: "",
    });

    // 初始化表单数据
    const initForm = () => {
      if (userInfo.value) {
        form.nickname = userInfo.value.nickname || "";
        form.gender = userInfo.value.gender || "";
        form.birthday = userInfo.value.birthday || "";
        form.avatarUrl = userInfo.value.avatarUrl || "";
        form.address = userInfo.value.address || "";
        form.wechat = userInfo.value.wechat || "";
        form.qq = userInfo.value.qq || "";
        form.brief = userInfo.value.brief || "";
        
        
      }
    };

    // 返回上一页
    const onClickLeft = () => {
      router.back();
    };

    // 上传头像
    const uploadAvatar = () => {
      fileInput.value?.click();
    };

    // 文件选择处理
    const onFileChange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      // 检查文件类型
      if (!file.type.startsWith("image/")) {
        showToast("请选择图片文件");
        return;
      }

      // 检查文件大小 (限制为 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast("图片大小不能超过 5MB");
        return;
      }

      try {
        showToast("上传中...");
        const res = await uploadFile(file);
        if (res.success) {
          form.avatarUrl = res.data;
          showToast("头像上传成功");
        } else {
          showToast(res.desc || "上传失败");
        }
      } catch (error) {
        showToast("上传失败");
      }

      // 清空文件输入
      target.value = "";
    };

    // 性别确认
    const onGenderConfirm = ({ selectedOptions }: any) => {
      form.gender = selectedOptions[0].value
      showGenderPicker.value = false;
    };

    // 打开日期选择器
    const openDatePicker = () => {
 
      showDatePicker.value = true;
    };

    // 日期确认
    const onDateConfirm = ({ selectedOptions }: any) => {
      form.birthday = selectedOptions[0].text + '-' + selectedOptions[1].text + '-' + selectedOptions[2].text 
      showDatePicker.value = false;
    };

    
    // 日期范围 - 使用 Date 对象
    const minDate = new Date(1900, 0, 1); // 1900年1月1日
    const maxDate = new Date(); // 当前日期

    // 保存资料
    const saveProfile = async () => {
      if (!form.nickname.trim()) {
        showToast("请输入昵称");
        return;
      }

      saving.value = true;

      try {
        const res = await userApi.updateUserProfile({
          nickname: form.nickname.trim(),
          gender: form.gender || undefined,
          birthday: form.birthday || undefined,
          avatarUrl: form.avatarUrl || undefined,
          address: form.address.trim() || undefined,
          wechat: form.wechat.trim() || undefined,
          qq: form.qq.trim() || undefined,
          brief: form.brief.trim() || undefined,
        });
        if (res.success) {
          showToast("保存成功");
          // 更新用户信息
          if (userInfo.value) {
            userStore.setUserInfo({
              ...userInfo.value,
              nickname: form.nickname.trim(),
              gender: form.gender,
              birthday: form.birthday,
              avatarUrl: form.avatarUrl,
              address: form.address.trim(),
              wechat: form.wechat.trim(),
              qq: form.qq.trim(),
              brief: form.brief.trim(),
            });
          }
          router.back();
        } else {
          showToast(res.desc || "保存失败");
        }
      } catch (error) {
        showToast("保存失败");
      } finally {
        saving.value = false;
      }
    };

    onMounted(() => {
      initForm();
    });

    return {
      userInfo,
      saving,
      form,
      genderDisplayText,
      showGenderPicker,
      showDatePicker,
      currentDate,
      selectedDate,
      minDate,
      maxDate,
      genderOptions,
      fileInput,
      onClickLeft,
      uploadAvatar,
      onFileChange,
      onGenderConfirm,
      openDatePicker,
      onDateConfirm,
      saveProfile,
    };
  },
});
</script>

<style lang="scss" scoped>
.edit-profile {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 20px;
}

.nav-bar {
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

  :deep(.van-button) {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: #fff;

    &:active {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.edit-content {
  padding: 16px;
}

.avatar-group {
  margin-bottom: 16px;

  .avatar-section {
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .avatar-wrapper {
    position: relative;
    cursor: pointer;

    .avatar {
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .avatar-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      .van-icon {
        color: #fff;
      }
    }

    &:hover .avatar-overlay {
      opacity: 1;
    }
  }

  .avatar-text {
    text-align: center;

    p {
      margin: 0;
      font-size: 14px;
      color: #323233;

      &.sub-text {
        font-size: 12px;
        color: #969799;
        margin-top: 4px;
      }
    }
  }
}

:deep(.van-cell-group) {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .van-cell-group__title {
    padding: 16px 16px 8px;
    font-size: 14px;
    font-weight: 500;
    color: #323233;
    background: #fafafa;
  }

  .van-cell {
    padding: 16px;

    &:not(:last-child)::after {
      left: 16px;
      right: 16px;
    }
  }

  .van-field__label {
    color: #323233;
    font-weight: 500;
  }

  .van-field__control {
    color: #666;
  }
}

:deep(.van-popup) {
  border-radius: 16px 16px 0 0;
}

:deep(.van-picker__title),
:deep(.van-datetime-picker__title) {
  color: #323233;
  font-weight: 500;
}

:deep(.van-picker__confirm),
:deep(.van-datetime-picker__confirm) {
  color: #1989fa;
}

:deep(.van-picker__cancel),
:deep(.van-datetime-picker__cancel) {
  color: #969799;
}
</style> 
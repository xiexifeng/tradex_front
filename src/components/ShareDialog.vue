<template>
  <van-popup
    v-model:show="show"
    position="bottom"
    :style="{ padding: '20px' }"
    round
    closeable
    close-icon-position="top-right"
  >
    <div class="share-dialog">
      <div class="share-title">分享到</div>
      
      <!-- 分享封面图 -->
      <div class="share-preview" v-if="shareImage">
        <img :src="shareImage" alt="分享封面" class="preview-image" />
        <div class="preview-info">
          <div class="preview-title">{{ shareTitle }}</div>
          <div class="preview-desc">{{ shareDesc }}</div>
        </div>
      </div>

      <!-- 分享选项 -->
      <div class="share-options">
        <!-- 微信内：直接调起微信分享 -->
        <template v-if="isWeChat">
          <div class="share-option" @click="shareToWeChat">
            <div class="option-icon wechat">
              <span class="icon-text">微</span>
            </div>
            <div class="option-label">微信好友</div>
          </div>
          <div class="share-option" @click="shareToMoments">
            <div class="option-icon moments">
              <span class="icon-text">朋</span>
            </div>
            <div class="option-label">朋友圈</div>
          </div>
        </template>

        <!-- 手机浏览器：显示分享选项 -->
        <template v-else-if="isMobile">
          <div class="share-option" @click="shareToWeChatMobile">
            <div class="option-icon wechat">
              <span class="icon-text">微</span>
            </div>
            <div class="option-label">微信好友</div>
          </div>
          <div class="share-option" @click="shareToMomentsMobile">
            <div class="option-icon moments">
              <span class="icon-text">朋</span>
            </div>
            <div class="option-label">朋友圈</div>
          </div>
        </template>

        <!-- 复制链接（所有平台都显示） -->
        <div class="share-option" @click="copyLink">
          <div class="option-icon copy">
            <van-icon name="link-o" size="32" />
          </div>
          <div class="option-label">复制链接</div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { showToast } from 'vant';

interface Props {
  show: boolean;
  shareTitle?: string;
  shareDesc?: string;
  shareImage?: string;
  shareUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  shareTitle: '区块链电商平台',
  shareDesc: '邀请好友一起加入！',
  shareImage: '',
  shareUrl: ''
});

const emit = defineEmits<{
  'update:show': [value: boolean];
}>();

// 检测环境
const isWeChat = computed(() => {
  const ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua);
});

const isMobile = computed(() => {
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  );
});

const show = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
});

// 微信内分享
const shareToWeChat = () => {
  // 微信内需要配置微信JS-SDK
  // 这里先使用复制链接的方式
  copyLink();
  showToast('请使用右上角菜单分享到微信');
};

const shareToMoments = () => {
  // 微信内需要配置微信JS-SDK
  copyLink();
  showToast('请使用右上角菜单分享到朋友圈');
};

// 手机浏览器分享
const shareToWeChatMobile = () => {
  const url = encodeURIComponent(props.shareUrl || window.location.href);
  const title = encodeURIComponent(props.shareTitle);
  const desc = encodeURIComponent(props.shareDesc);
  
  // 尝试调起微信分享
  window.location.href = `weixin://dl/business/?ticket=${url}`;
  
  // 如果无法调起，则复制链接
  setTimeout(() => {
    copyLink();
  }, 500);
};

const shareToMomentsMobile = () => {
  // 手机浏览器无法直接分享到朋友圈，提示用户复制链接
  copyLink();
  showToast('请在微信中打开链接后分享到朋友圈');
};

// 复制链接
const copyLink = async () => {
  const url = props.shareUrl || window.location.href;
  
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      showToast('链接已复制');
    } else {
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      
      try {
        document.execCommand('copy');
        showToast('链接已复制');
      } catch (err) {
        showToast('复制失败，请手动复制');
      }
      
      document.body.removeChild(textArea);
    }
    
    // 关闭弹窗
    show.value = false;
  } catch (error) {
    console.error('复制失败:', error);
    showToast('复制失败，请手动复制');
  }
};

// 监听微信JS-SDK（如果已配置）
watch(() => props.show, (newVal) => {
  if (newVal && isWeChat.value && (window as any).wx) {
    // 配置微信分享
    const wx = (window as any).wx;
    wx.ready(() => {
      wx.updateAppMessageShareData({
        title: props.shareTitle,
        desc: props.shareDesc,
        link: props.shareUrl || window.location.href,
        imgUrl: props.shareImage || '',
        success: () => {
          console.log('分享配置成功');
        }
      });

      wx.updateTimelineShareData({
        title: props.shareTitle,
        link: props.shareUrl || window.location.href,
        imgUrl: props.shareImage || '',
        success: () => {
          console.log('朋友圈分享配置成功');
        }
      });
    });
  }
});
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.share-dialog {
  .share-title {
    font-size: 18px;
    font-weight: 600;
    color: #323233;
    text-align: center;
    margin-bottom: 20px;
  }

  .share-preview {
    display: flex;
    gap: 12px;
    padding: 12px;
    margin-bottom: 20px;
    background: #f7f8fa;
    border-radius: 8px;

    .preview-image {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
      flex-shrink: 0;
    }

    .preview-info {
      flex: 1;
      min-width: 0;

      .preview-title {
        font-size: 14px;
        font-weight: 600;
        color: #323233;
        margin-bottom: 4px;
        @include text-ellipsis;
      }

      .preview-desc {
        font-size: 12px;
        color: #969799;
        @include text-ellipsis;
      }
    }
  }

  .share-options {
    display: flex;
    justify-content: space-around;
    padding: 20px 0;

    .share-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: transform 0.2s;

      &:active {
        transform: scale(0.95);
      }

      .option-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f7f8fa;

        &.wechat {
          background: #07c160;
          color: #fff;
        }

        &.moments {
          background: #ffd21e;
          color: #fff;
        }

        &.copy {
          background: #1989fa;
          color: #fff;
        }

        .icon-text {
          font-size: 24px;
          font-weight: 600;
        }
      }

      .option-label {
        font-size: 12px;
        color: #323233;
      }
    }
  }
}
</style>

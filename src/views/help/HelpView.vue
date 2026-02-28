<template>
  <div class="help-page">
    <van-nav-bar title="帮助与客服" left-arrow @click-left="onBack" />

    <div class="content">
      <van-cell-group inset class="group">
        <van-cell title="常见问题" icon="question-o" />
      </van-cell-group>

      <van-collapse v-model="activeNames" accordion class="collapse">
        <van-collapse-item name="1" title="如何发布物品？">
          进入首页或“发布”入口，按提示填写物品名称、描述、图片与期望换物条件，提交后即可在列表中展示。
        </van-collapse-item>
        <van-collapse-item name="2" title="如何发起换物/交易？">
          在物品详情页点击“发起换物/交换”，与对方确认物品状态、物流方式、交付时间等信息后再进行确认。
        </van-collapse-item>
        <van-collapse-item name="3" title="验证码收不到怎么办？">
          请确认手机号是否填写正确、短信是否被拦截；可稍后重试或更换网络环境。若仍无法收到，请联系在线客服协助处理。
        </van-collapse-item>
        <van-collapse-item name="4" title="出现纠纷怎么处理？">
          建议优先与对方协商解决；如协商不成，可在通知/反馈入口提交证据（聊天记录、物流信息、照片等），我们会尽力协助核查。
        </van-collapse-item>
      </van-collapse>

      <van-cell-group inset class="group">
        <van-cell title="联系客服" icon="service-o" />
        <van-cell
          title="在线客服"
          is-link
          label="工作日 09:00-18:00（示例）"
          @click="onOnlineService"
        />
        <van-cell
          title="客服邮箱"
          :value="supportEmail"
          label="点击复制"
          @click="copyText(supportEmail)"
        />
        <van-cell
          title="意见反馈"
          is-link
          label="提交问题与建议（示例入口）"
          @click="onFeedback"
        />
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="相关协议" icon="description" />
        <van-cell title="用户隐私协议" is-link @click="go('/agreement/privacy')" />
        <van-cell title="换物使用协议" is-link @click="go('/agreement/swap')" />
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const activeNames = ref<string | string[]>('1');
const supportEmail = 'support@x-platform.example';

const onBack = () => router.back();
const go = (path: string) => router.push(path);

const onOnlineService = () => {
  showToast('在线客服入口待接入');
};

const onFeedback = () => {
  showToast('反馈入口待接入');
};

const copyText = async (text: string) => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      showToast('已复制');
      return;
    }
  } catch (e) {
    // ignore
  }
  showToast('复制失败，请手动复制');
};
</script>

<style scoped lang="scss">
.help-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding: 12px;
}

.group {
  margin-bottom: 12px;
}

.collapse {
  margin: 0 0 12px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>

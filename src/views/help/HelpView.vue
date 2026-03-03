<template>
  <div class="help-page">
    <van-nav-bar title="帮助中心" left-arrow @click-left="onBack" />

    <div class="content">
      <div class="header">
        <h1>x平台帮助中心</h1>
        <p class="subtitle">为您提供全面的使用指南和常见问题解答</p>
      </div>

      <van-cell-group inset class="group">
        <van-cell title="常见问题" icon="question-o" />
      </van-cell-group>

      <van-collapse v-model="activeNames" accordion class="collapse">
        <van-collapse-item name="1" title="如何发布物品？">
          <div class="collapse-content">
            <p>进入首页或“发布”入口，按提示填写物品名称、描述、图片与期望换物条件，提交后即可在列表中展示。</p>
            <p class="tip">请确保您发布的物品信息真实、准确，避免发布虚假信息。</p>
          </div>
        </van-collapse-item>
        <van-collapse-item name="2" title="如何联系对方？">
          <div class="collapse-content">
            <p>在物品详情页查看对方联系方式，通过平台提供的联系方式与对方沟通，确认物品状态、交易时间、地点等信息后再进行线下交易。</p>
            <p class="tip">平台仅提供信息撮合服务，不参与任何交易环节。</p>
          </div>
        </van-collapse-item>
        <van-collapse-item name="3" title="线下交易安全提示">
          <div class="collapse-content">
            <ul>
              <li>选择公共场所进行交易，如商场、咖啡厅等</li>
              <li>建议结伴前往，确保人身安全</li>
              <li>仔细检查物品状况，确认无误后再完成交易</li>
              <li>现金交易时注意验钞，避免收到假币</li>
              <li>保留交易凭证，如聊天记录、交易照片等</li>
              <li>如遇可疑情况，立即终止交易并报警</li>
            </ul>
            <p class="highlight">安全提示：线下交易存在一定风险，请务必谨慎行事，确保自身安全。</p>
          </div>
        </van-collapse-item>
        <van-collapse-item name="4" title="验证码收不到怎么办？">
          <div class="collapse-content">
            <p>请确认手机号是否填写正确、短信是否被拦截；可稍后重试或更换网络环境。若仍无法收到，请联系在线客服协助处理。</p>
          </div>
        </van-collapse-item>
        <van-collapse-item name="5" title="出现纠纷怎么处理？">
          <div class="collapse-content">
            <p>建议优先与对方协商解决；如协商不成，可通过法律途径解决，平台仅提供信息撮合服务，不参与交易纠纷处理。</p>
            <p class="tip">请在交易前仔细确认物品信息，避免产生不必要的纠纷。</p>
          </div>
        </van-collapse-item>
        <van-collapse-item name="6" title="如何修改个人信息？">
          <div class="collapse-content">
            <p>进入个人中心，点击“编辑资料”，即可修改您的个人信息，包括昵称、头像、联系方式等。</p>
          </div>
        </van-collapse-item>
      </van-collapse>

      <van-cell-group inset class="group">
        <van-cell title="联系我们" icon="service-o" />
        <van-cell
          title="在线客服"
          is-link
          label="工作日 09:00-18:00"
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
          label="提交问题与建议"
          @click="onFeedback"
        />
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="相关协议" icon="description" />
        <van-cell title="用户隐私协议" is-link @click="go('/agreement/privacy')" />
        <van-cell title="x平台使用协议" is-link @click="go('/agreement/swap')" />
      </van-cell-group>

      <div class="footer">
        <p>© 2026 xx公司 保留所有权利</p>
      </div>
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
  padding: 16px;
}

.header {
  text-align: center;
  margin-bottom: 24px;
  
  h1 {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 14px;
    color: #666;
    line-height: 20px;
  }
}

.group {
  margin-bottom: 16px;
}

.collapse {
  margin: 0 0 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  :deep(.van-collapse-item__content) {
    padding: 16px;
  }
}

.collapse-content {
  p {
    margin: 0 0 12px;
    font-size: 14px;
    color: #555;
    line-height: 22px;
  }
  
  ul {
    margin: 0 0 12px;
    padding-left: 20px;
    
    li {
      font-size: 14px;
      color: #555;
      line-height: 22px;
      margin-bottom: 4px;
    }
  }
  
  .tip {
    font-size: 13px;
    color: #999;
    line-height: 20px;
    margin-top: 8px;
  }
  
  .highlight {
    background: #fffbe6;
    border: 1px solid #ffe58f;
    border-radius: 6px;
    padding: 10px;
    margin: 10px 0;
    font-size: 14px;
    color: #d48806;
    line-height: 20px;
  }
}

.footer {
  margin-top: 24px;
  text-align: center;
  font-size: 12px;
  color: #999;
  line-height: 18px;
}
</style>

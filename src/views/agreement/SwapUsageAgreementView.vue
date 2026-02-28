<template>
  <div class="agreement-page">
    <van-nav-bar title="换物使用协议" left-arrow @click-left="onBack" />

    <div class="content">
      <div class="meta">
        <div>生效日期：2026-02-28</div>
        <div>版本号：V1.0</div>
      </div>

      <van-divider />

      <div class="section">
        <div class="h">一、协议范围与接受</div>
        <p>欢迎使用本平台换物服务。您在注册、登录或使用换物相关功能（包括发布、浏览、发起换物、沟通、确认、评价等）即表示您已阅读并同意本协议全部条款。</p>
      </div>

      <div class="section">
        <div class="h">二、账号与行为规范</div>
        <p>您应保证注册信息真实、准确、完整，并妥善保管账号信息。因账号保管不当造成的损失由您自行承担。</p>
        <p>您不得发布违法违规、侵权、欺诈、虚假或扰乱平台秩序的内容，不得利用平台从事任何非法活动。</p>
      </div>

      <div class="section">
        <div class="h">三、发布与换物规则</div>
        <p>发布物品时，请如实描述物品信息（成色、缺陷、来源、规格等）。因描述不实引发的纠纷，您应承担相应责任。</p>
        <p>换物过程中的沟通、确认、物流与交付由双方自行协商。平台可能提供必要的工具与记录，但不对双方线下履约承担担保责任。</p>
      </div>

      <div class="section">
        <div class="h">四、风险提示与免责声明</div>
        <p>换物属于用户之间的自主交易行为，存在信息不对称、物流风险、质量争议等不确定性。您应审慎评估并自行承担相关风险。</p>
        <p>因不可抗力、第三方原因或用户自身原因导致的服务中断、数据丢失、交易损失等，平台在法律允许范围内不承担责任。</p>
      </div>

      <div class="section">
        <div class="h">五、违规处理</div>
        <p>如您存在违规行为，平台有权依据规则采取包括但不限于内容下架、限制功能、冻结账号、终止服务等措施，并保留追究法律责任的权利。</p>
      </div>

      <div class="section">
        <div class="h">六、争议解决</div>
        <p>因本协议或换物服务产生的争议，双方应友好协商解决；协商不成的，可向平台所在地有管辖权的人民法院提起诉讼。</p>
      </div>

      <van-divider />

      <div class="footer">提示：本页面为协议展示页，具体条款可根据业务规则与法务要求完善与更新。</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const onBack = () => {
  router.back();
};
</script>

<style scoped lang="scss">
.agreement-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding: 12px 14px 28px;
}

.meta {
  font-size: 12px;
  color: #666;
  line-height: 18px;
}

.section {
  margin-top: 12px;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .h {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
  }

  p {
    margin: 0 0 8px;
    font-size: 13px;
    color: #555;
    line-height: 20px;
  }

  p:last-child {
    margin-bottom: 0;
  }
}

.footer {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  line-height: 18px;
}
</style>

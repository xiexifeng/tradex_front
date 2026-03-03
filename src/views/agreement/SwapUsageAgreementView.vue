<template>
  <div class="agreement-page">
    <van-nav-bar title="x平台使用协议" left-arrow @click-left="onBack" />

    <div class="content">
      <div class="header">
        <h1>xx公司x平台使用协议</h1>
        <div class="meta">
          <div>生效日期：2026-02-28</div>
          <div>版本号：V1.0</div>
        </div>
      </div>

      <van-divider />

      <div class="section">
        <div class="h">一、协议范围与接受</div>
        <p>欢迎使用xx公司（以下简称"我们"）运营的x平台（以下简称"平台"）提供的信息撮合服务。您在注册、登录或使用平台相关功能（包括发布、浏览、信息沟通等）即表示您已阅读并同意本协议全部条款。</p>
        <p class="highlight">请您仔细阅读本协议，确保理解协议内容。如您不同意本协议，请勿使用平台服务。</p>
      </div>

      <div class="section">
        <div class="h">二、账号管理</div>
        <p>您应保证注册信息真实、准确、完整，并妥善保管账号信息。因账号保管不当造成的损失由您自行承担。</p>
        <p>您不得将账号转让、出租、出借或授权他人使用。如发现账号异常使用，应及时联系客服。</p>
      </div>

      <div class="section">
        <div class="h">三、用户行为规范</div>
        <p>您在使用平台服务时，应遵守法律法规和公序良俗，不得从事以下行为：</p>
        <ul>
          <li>发布违法违规、侵权、欺诈、虚假或扰乱平台秩序的内容</li>
          <li>利用平台从事任何非法活动</li>
          <li>侵犯他人的合法权益</li>
          <li>干扰平台的正常运行</li>
          <li>其他违反法律法规或本协议的行为</li>
        </ul>
      </div>

      <div class="section">
        <div class="h">四、信息发布规则</div>
        <p>发布物品时，请如实描述物品信息（成色、缺陷、来源、规格等）。因描述不实引发的纠纷，您应承担相应责任。</p>
        <p class="highlight">平台仅提供信息撮合服务，不参与任何交易环节。用户之间的沟通、交易、物流与交付由双方自行协商完成，平台不对线下交易过程承担任何责任。</p>
        <p>用户应选择安全的线下交易方式，建议在公共场所进行交易，注意人身和财产安全。</p>
      </div>

      <div class="section">
        <div class="h">五、风险提示与免责声明</div>
        <p>用户之间的信息交流和线下交易属于自主行为，存在信息不对称、交易风险、质量争议等不确定性。您应审慎评估并自行承担相关风险。</p>
        <p class="highlight">平台仅提供信息撮合服务，不参与任何交易环节，不对交易的真实性、合法性、安全性承担任何责任。</p>
        <p>因不可抗力、第三方原因或用户自身原因导致的服务中断、数据丢失、交易损失等，平台在法律允许范围内不承担责任。</p>
      </div>

      <div class="section">
        <div class="h">六、违规处理</div>
        <p>如您存在违规行为，平台有权依据规则采取包括但不限于以下措施：</p>
        <ul>
          <li>内容下架</li>
          <li>限制功能</li>
          <li>冻结账号</li>
          <li>终止服务</li>
          <li>保留追究法律责任的权利</li>
        </ul>
      </div>

      <div class="section">
        <div class="h">七、协议更新</div>
        <p>我们可能会根据法律法规的要求或业务发展需要更新本协议，更新后的协议将在平台上公布。请您定期查看本协议的最新版本。</p>
      </div>

      <div class="section">
        <div class="h">八、争议解决</div>
        <p>因本协议或平台服务产生的争议，双方应友好协商解决；协商不成的，可向平台所在地有管辖权的人民法院提起诉讼。</p>
      </div>

      <div class="section">
        <div class="h">九、其他条款</div>
        <p>本协议的订立、执行、解释及争议的解决均适用中华人民共和国法律。</p>
        <p>如本协议的任何条款被视为无效或不可执行，不影响其他条款的效力。</p>
      </div>

      <van-divider />

      <div class="footer">© 2026 xx公司 保留所有权利</div>
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
  padding: 16px 16px 32px;
}

.header {
  text-align: center;
  margin-bottom: 16px;
  
  h1 {
    font-size: 18px;
    font-weight: 700;
    color: #333;
    margin-bottom: 8px;
  }
  
  .meta {
    font-size: 12px;
    color: #666;
    line-height: 18px;
  }
}

.section {
  margin-top: 16px;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  .h {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }

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

  p:last-child {
    margin-bottom: 0;
  }
}

.footer {
  margin-top: 20px;
  text-align: center;
  font-size: 12px;
  color: #999;
  line-height: 18px;
}
</style>

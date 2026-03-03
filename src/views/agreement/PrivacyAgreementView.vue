<template>
  <div class="agreement-page">
    <van-nav-bar title="用户隐私协议" left-arrow @click-left="onBack" />

    <div class="content">
      <div class="header">
        <h1>xx公司用户隐私协议</h1>
        <div class="meta">
          <div>生效日期：2026-02-28</div>
          <div>版本号：V1.0</div>
        </div>
      </div>

      <van-divider />

      <div class="section">
        <div class="h">一、协议目的</div>
        <p>本隐私协议旨在向您说明xx公司（以下简称"我们"）如何收集、使用、存储和保护您的个人信息，以及您享有的权利。本协议适用于您使用x平台（以下简称"平台"）提供的各项服务。</p>
      </div>

      <div class="section">
        <div class="h">二、信息收集与使用</div>
        <p>为向您提供信息撮合相关服务，我们可能会收集并使用您在使用服务过程中提供或产生的信息，包括但不限于：</p>
        <ul>
          <li>基本信息：手机号、登录凭证等</li>
          <li>设备信息：设备型号、操作系统版本、IP地址等</li>
          <li>使用信息：操作日志、发布信息、浏览记录等</li>
          <li>联系方式：您在平台上填写的联系方式</li>
        </ul>
        <p class="highlight">特别说明：平台仅作为信息撮合方，不参与任何交易环节，不会收集或存储与交易资金相关的信息。</p>
      </div>

      <div class="section">
        <div class="h">三、信息共享与披露</div>
        <p>除非获得您的明示同意，或法律法规另有规定，我们不会向第三方共享、转让您的个人信息。</p>
        <p>在提供必要服务时（例如短信验证码服务、风控与安全服务），我们可能与合作方共享实现功能所必需的信息，并要求其遵守本协议与相关法律法规。</p>
      </div>

      <div class="section">
        <div class="h">四、信息存储与保护</div>
        <p>我们会在法律法规要求的期限内保存您的信息，并采用合理可行的安全措施保护您的信息安全，包括但不限于：</p>
        <ul>
          <li>访问控制：严格的权限管理机制</li>
          <li>加密传输与存储：采用HTTPS加密传输，敏感数据加密存储</li>
          <li>安全审计：定期进行安全评估和漏洞扫描</li>
        </ul>
        <p class="highlight">请您妥善保管账号与密码，因您自身原因导致的账号信息泄露，由您自行承担相应风险与责任。</p>
      </div>

      <div class="section">
        <div class="h">五、您的权利</div>
        <p>您可以按照产品提供的功能入口对个人信息进行查询、更正、删除，或撤回授权同意。部分信息在法律法规或安全要求下可能无法立即删除。</p>
      </div>

      <div class="section">
        <div class="h">六、未成年人保护</div>
        <p>若您为未成年人，请在监护人陪同与指导下阅读并同意本协议后使用本服务。我们不会主动收集未成年人的个人信息，若发现未成年人使用服务，我们将及时删除相关信息。</p>
      </div>

      <div class="section">
        <div class="h">七、协议更新</div>
        <p>我们可能会根据法律法规的要求或业务发展需要更新本协议，更新后的协议将在平台上公布。请您定期查看本协议的最新版本。</p>
      </div>

      <div class="section">
        <div class="h">八、联系我们</div>
        <p>如您对本协议有任何疑问、意见或建议，可通过以下方式与我们联系：</p>
        <ul>
          <li>客服邮箱：support@xx-company.com</li>
          <li>平台内反馈入口：个人中心 - 意见反馈</li>
        </ul>
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

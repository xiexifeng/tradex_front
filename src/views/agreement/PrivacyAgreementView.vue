<template>
  <div class="agreement-page">
    <van-nav-bar title="用户隐私协议" left-arrow @click-left="onBack" />

    <div class="content">
      <div class="meta">
        <div>生效日期：2026-02-28</div>
        <div>版本号：V1.0</div>
      </div>

      <van-divider />

      <div class="section">
        <div class="h">一、我们如何收集与使用您的信息</div>
        <p>为向您提供换物/交易相关服务，我们可能会收集并使用您在使用服务过程中提供或产生的信息，包括但不限于：手机号、登录凭证、设备信息、操作日志、交易与发布信息、联系方式与收货地址等。</p>
        <p>我们仅会在实现产品功能与保障安全所必需的范围内处理您的信息，并尽可能采取去标识化、加密等措施降低风险。</p>
      </div>

      <div class="section">
        <div class="h">二、我们如何共享、转让与公开披露您的信息</div>
        <p>除非获得您的明示同意，或法律法规另有规定，我们不会向第三方共享、转让您的个人信息。</p>
        <p>在提供必要服务时（例如短信验证码服务、风控与安全服务），我们可能与合作方共享实现功能所必需的信息，并要求其遵守本协议与相关法律法规。</p>
      </div>

      <div class="section">
        <div class="h">三、我们如何存储与保护您的信息</div>
        <p>我们会在法律法规要求的期限内保存您的信息，并采用合理可行的安全措施保护您的信息安全，包括但不限于访问控制、加密传输与存储、安全审计等。</p>
        <p>请您妥善保管账号与密码，因您自身原因导致的账号信息泄露，由您自行承担相应风险与责任。</p>
      </div>

      <div class="section">
        <div class="h">四、您的权利</div>
        <p>您可以按照产品提供的功能入口对个人信息进行查询、更正、删除，或撤回授权同意。部分信息在法律法规或安全要求下可能无法立即删除。</p>
      </div>

      <div class="section">
        <div class="h">五、未成年人保护</div>
        <p>若您为未成年人，请在监护人陪同与指导下阅读并同意本协议后使用本服务。</p>
      </div>

      <div class="section">
        <div class="h">六、联系我们</div>
        <p>如您对本协议有任何疑问、意见或建议，可通过产品内的反馈入口与我们联系。</p>
      </div>

      <van-divider />

      <div class="footer">提示：本页面为协议展示页，具体条款可根据法务要求完善与更新。</div>
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

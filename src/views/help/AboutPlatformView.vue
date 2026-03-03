<template>
  <div class="about-page">
    <van-nav-bar title="关于x平台" left-arrow @click-left="onBack" />

    <div class="content">
      <div class="brand">
        <div class="logo">X</div>
        <div class="name">x平台</div>
        <div class="desc">让闲置流转更简单</div>
      </div>

      <van-cell-group inset class="group">
        <van-cell title="平台介绍" icon="info-o" />
        <div class="paragraph">
          x平台是xx公司旗下的闲置物品信息撮合平台，致力于为用户提供便捷的闲置物品信息发布和获取服务，帮助更多好物实现再利用，减少浪费。
        </div>
        <div class="paragraph">
          <span class="highlight">平台仅作为信息撮合方，不参与任何交易环节，所有交易均由用户线下自行协商完成。</span>
        </div>
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="核心价值" icon="star-o" />
        <div class="paragraph">
          <ul>
            <li>便捷高效：快速发布和发现闲置物品</li>
            <li>环保节能：促进资源循环利用</li>
            <li>安全可靠：提供信息撮合服务，保障用户隐私</li>
            <li>社区友好：构建互助共享的邻里关系</li>
          </ul>
        </div>
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="主要功能" icon="apps-o" />
        <van-cell title="发布与管理物品" label="发布物品信息、图片与期望换物条件" />
        <van-cell title="浏览与搜索" label="按关键词/分类快速找到心仪物品" />
        <van-cell title="信息沟通" label="通过平台提供的联系方式与对方沟通" />
        <van-cell title="消息通知" label="重要信息及时提醒" />
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="联系我们" icon="service-o" />
        <van-cell title="客服邮箱" :value="supportEmail" label="点击复制" @click="copyText(supportEmail)" />
        <van-cell title="商务合作" :value="bizEmail" label="点击复制" @click="copyText(bizEmail)" />
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="法律与协议" icon="description" />
        <van-cell title="用户隐私协议" is-link @click="go('/agreement/privacy')" />
        <van-cell title="x平台使用协议" is-link @click="go('/agreement/swap')" />
      </van-cell-group>

      <div class="footer">
        <p>© 2026 xx公司 保留所有权利</p>
        <p class="version">版本号：V1.0.0</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

const router = useRouter();
const supportEmail = 'support@x-platform.example';
const bizEmail = 'business@x-platform.example';

const onBack = () => router.back();
const go = (path: string) => router.push(path);

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
.about-page {
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding: 16px;
}

.brand {
  background: #fff;
  border-radius: 12px;
  padding: 24px 16px;
  margin-bottom: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 12px;
  border-radius: 16px;
  background: linear-gradient(to right, #1989fa, #0066ff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
}

.name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
}

.desc {
  margin-top: 8px;
  font-size: 14px;
  color: #777;
}

.group {
  margin-bottom: 16px;
}

.paragraph {
  padding: 12px 16px 16px;
  font-size: 14px;
  color: #555;
  line-height: 22px;
  
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
    padding: 8px;
    font-size: 14px;
    color: #d48806;
    line-height: 20px;
  }
}

.footer {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 16px 0 8px;
  
  .version {
    margin-top: 4px;
    font-size: 11px;
  }
}
</style>

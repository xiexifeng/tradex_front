<template>
  <div class="about-page">
    <van-nav-bar title="关于X平台" left-arrow @click-left="onBack" />

    <div class="content">
      <div class="brand">
        <div class="logo">X</div>
        <div class="name">X平台</div>
        <div class="desc">让闲置流转更简单</div>
      </div>

      <van-cell-group inset class="group">
        <van-cell title="平台介绍" icon="info-o" />
        <div class="paragraph">
          X平台致力于为用户提供便捷的闲置物品展示与换物体验，帮助更多好物实现再利用，减少浪费。
        </div>
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="主要功能" icon="apps-o" />
        <van-cell title="发布与管理物品" label="发布物品信息、图片与期望换物条件" />
        <van-cell title="浏览与搜索" label="按关键词/分类快速找到心仪物品" />
        <van-cell title="发起换物" label="与对方沟通确认后完成交换" />
        <van-cell title="消息通知" label="重要进度及时提醒" />
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="联系我们" icon="service-o" />
        <van-cell title="客服邮箱" :value="supportEmail" label="点击复制" @click="copyText(supportEmail)" />
        <van-cell title="商务合作" :value="bizEmail" label="点击复制" @click="copyText(bizEmail)" />
      </van-cell-group>

      <van-cell-group inset class="group">
        <van-cell title="法律与协议" icon="description" />
        <van-cell title="用户隐私协议" is-link @click="go('/agreement/privacy')" />
        <van-cell title="换物使用协议" is-link @click="go('/agreement/swap')" />
      </van-cell-group>

      <div class="footer">© 2026 X平台</div>
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
  padding: 12px;
}

.brand {
  background: #fff;
  border-radius: 12px;
  padding: 18px 12px;
  margin-bottom: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.logo {
  width: 56px;
  height: 56px;
  margin: 0 auto 8px;
  border-radius: 16px;
  background: linear-gradient(to right, #1989fa, #0066ff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
}

.name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}

.desc {
  margin-top: 4px;
  font-size: 12px;
  color: #777;
}

.group {
  margin-bottom: 12px;
}

.paragraph {
  padding: 10px 16px 14px;
  font-size: 13px;
  color: #555;
  line-height: 20px;
}

.footer {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 8px 0 4px;
}
</style>

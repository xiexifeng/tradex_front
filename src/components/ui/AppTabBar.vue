<template>
  <div>
    <van-tabbar v-model="activeTab" fixed route>
      <van-tabbar-item icon="home-o" to="/">
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="envelop-o" to="/notification">
        消息
      </van-tabbar-item>
      <van-tabbar-item to="/stuff/publish">
        <template #icon>
          <div class="publish-button">
            <van-icon name="plus" size="20" />
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/stuff/trades">
        交易
      </van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user/profile">
        我的
      </van-tabbar-item>
    </van-tabbar>
    <!-- 为底部导航腾出空间 -->
    <div class="bottom-space"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AppTabBar',
  setup() {
    const activeTab = ref(0)
    return {
      activeTab
    }
  }
})
</script>

<style lang="scss" scoped>
.publish-button {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1989fa, #39a0ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.95);
  }
  
  .van-icon {
    color: #fff;
  }
}

.bottom-space {
  height: 50px;
}

:deep(.van-tabbar) {
  border-top: 1px solid #f5f5f5;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  
  .van-tabbar-item {
    color: #7d7e80;
    
    &--active {
      color: #1989fa;
    }
    
    &__icon {
      font-size: 20px;
      margin-bottom: 4px;
    }
    
    &:nth-child(3) {
      margin-top: -14px;
      overflow: visible;
      
      // 消除白线
      &::before {
        display: none;
      }
      
      .van-tabbar-item__icon {
        background: transparent;
        border: none;
        margin-top: -1px; // 向上移动1px遮挡白线
      }
    }
    
    &:nth-child(3) .van-tabbar-item__text {
      margin-top: 4px;
    }
  }
  
  // 消除发布按钮项的白线
  .van-tabbar-item:nth-child(3) {
    &::before {
      display: none !important;
    }
    
    background: transparent !important;
    border: none !important;
    position: relative;
    overflow: visible;
    
    // 遮挡上方的边框线 - 使用白色背景覆盖
    &::after {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #fff;
      z-index: 1;
    }
    
    .van-tabbar-item__icon {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      position: relative;
      z-index: 2;
    }
    
    .van-tabbar-item__text {
      display: none;
    }
  }
}
</style>

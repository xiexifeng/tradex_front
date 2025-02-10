<template>
  <div class="home">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="区块链电商"
      :right-text="userInfo ? '' : '登录'"
      @click-right="onClickRight"
    >
      <template #right v-if="userInfo">
        <van-icon name="user-o" size="18" @click="goToProfile"/>
      </template>
    </van-nav-bar>

    <!-- 搜索框 -->
    <div class="search-box">
      <van-search
        v-model="searchValue"
        placeholder="搜索商品"
        shape="round"
        background="#f7f8fa"
      />
    </div>

    <!-- 轮播图 -->
    <van-swipe class="banner" :autoplay="3000" indicator-color="#1989fa">
      <van-swipe-item v-for="(image, index) in banners" :key="index">
        <img :src="image" alt="banner">
      </van-swipe-item>
    </van-swipe>

    <!-- 功能导航 -->
    <van-grid :column-num="4" :border="false" class="feature-grid">
      <van-grid-item icon="shop-o" text="全部商品" />
      <van-grid-item icon="gift-o" text="特惠专区" />
      <van-grid-item icon="medal-o" text="信用排行" />
      <van-grid-item icon="balance-o" text="代币中心" />
    </van-grid>

    <!-- 商品列表 -->
    <div class="product-section">
      <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
      >
        推荐商品
      </van-divider>
      
      <van-card
        v-for="product in products"
        :key="product.id"
        :price="product.price"
        :title="product.title"
        :thumb="product.thumb"
        :tag="product.tag"
      >
        <template #footer>
          <van-button size="mini" type="primary" @click="onBuyClick(product.id)">
            购买
          </van-button>
        </template>
      </van-card>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTab" fixed route>
      <van-tabbar-item icon="shop-o" to="/mall">
        电商广场
      </van-tabbar-item>
      <van-tabbar-item icon="exchange" to="/barter">
        易物广场
      </van-tabbar-item>
      <van-tabbar-item to="/publish">
        <template #icon>
          <div class="publish-button">
            <van-icon name="plus" size="20" />
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/trades">
        交易列表
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
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const searchValue = ref('')
    const userInfo = ref(1) // 实际项目中从vuex或pinia获取
    const activeTab = ref(0)

    // 模拟数据
    const banners = ref([
      'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
    ])

    const products = ref([
      {
        id: 1,
        title: '区块链认证商品A',
        price: '2.00',
        thumb: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        tag: 'NFT'
      },
      {
        id: 2,
        title: '区块链认证商品B',
        price: '2.00',
        thumb: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        tag: 'NFT'
      }
    ])

    const onClickRight = () => {
      router.push('/login')
    }

    const goToProfile = () => {
      router.push('/user/profile')
    }

    const onBuyClick = (productId: number) => {
      if (!userInfo.value) {
        router.push('/login')
        return
      }
      // 处理购买逻辑
    }

    return {
      searchValue,
      userInfo,
      banners,
      products,
      onClickRight,
      goToProfile,
      onBuyClick,
      activeTab,
    }
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.search-box {
  padding: 8px 0;
}

.banner {
  height: 160px;
  margin: 0 12px;
  border-radius: 8px;
  overflow: hidden;
}

.banner img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature-grid {
  margin: 12px 0;
  background: linear-gradient(145deg, #ffffff, #f0f2f5);
}

.van-grid-item__icon {
  color: #1989fa;
}

.product-section {
  padding: 0 12px;
}

.van-card {
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.van-button--primary {
  background: linear-gradient(135deg, #1989fa, #0066ff);
  border: none;
}

.bottom-space {
  height: 50px;
}

.publish-button {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1989fa, #0066ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
}

.publish-button .van-icon {
  color: white;
}

/* 调整底部导航样式 */
:deep(.van-tabbar-item) {
  color: #7d7e80;
}

:deep(.van-tabbar-item--active) {
  color: #1989fa;
}

:deep(.van-tabbar-item__icon) {
  font-size: 20px;
}

:deep(.van-tabbar-item:nth-child(3)) {
  margin-top: -14px;
}

:deep(.van-tabbar-item:nth-child(3) .van-tabbar-item__text) {
  margin-top: 4px;
}
</style>

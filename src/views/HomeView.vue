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
        readonly
        @click="onSearchClick"
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
      
      <!-- 筛选工具栏 -->
      <van-dropdown-menu class="filter-toolbar">
        <van-dropdown-item v-model="itemTypeFilter" :options="itemTypeOptions" />
        <van-dropdown-item v-model="tradeMethodFilter" :options="tradeMethodOptions" />
        <van-dropdown-item v-model="sortOrder" :options="sortOptions" />
      </van-dropdown-menu>
      
      <div class="product-list">
        <van-card
          v-for="product in filteredProducts"
          :key="product.id"
          :price="product.tradeMethod === '人民币' ? product.transferPrice : product.tradeMethod === '积分' ? product.transferPoints : product.expectItem"
          :currency="product.tradeMethod === '人民币' ? '¥' : product.tradeMethod === '积分' ? '积分' : ''"
          :desc="product.itemDescription"
          :title="product.itemTitle"
          :thumb="product.firstImage"
          class="product-card"
        >
          <template #tags>
            <van-tag plain type="primary" class="product-tag">{{product.itemType}}</van-tag>
            <van-tag plain type="success" class="product-tag">{{product.depreciation}}成新</van-tag>
            <van-tag plain type="warning" class="product-tag">{{product.tradeMethod}}</van-tag>
          </template>
          <template #footer>
            <div class="card-footer">
              <div class="user-info">
                <span class="user-name">{{product.userNickname}}</span>
                <span class="publish-time">{{product.publishTime}}</span>
              </div>
              <div class="product-stats">
                <span><van-icon name="eye-o" /> {{product.viewCount}}</span>
                <span><van-icon name="like-o" /> {{product.loveCount}}</span>
                <span><van-icon name="star-o" /> {{product.collectionCount}}</span>
              </div>
            </div>
            <div class="action-buttons">
              <van-button v-if="product.tradeMethod !== '以物换物'" size="small" type="primary" @click="onBuyClick(product.id)">
                购买
              </van-button>
              <van-button size="small" type="primary" @click="onViewClick(product.id)">
                查看
              </van-button>
            </div>
          </template>
        </van-card>
      </div>
    </div>

    <!-- 底部导航栏 -->
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
import { defineComponent, ref, computed } from 'vue'
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
        "id": "2025032800001",
        "userId": "2025032800001",
        "userAvatar": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        "userNickname": "NPE",
        "itemTitle": "iphone 16",
        "itemType": "数码手机",
        "itemDescription": "刚买2个月 32G 9成新",
        "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
        "itemImageList": [
          "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        ],
        "depreciation": 9,
        "tradeMethod": "以物换物",
        "expectItem": "山地自行车",
        "transferTimes": 0,
        "lastUserId": "2025032800001",
        "blockchainId": "Hash2025032800001",
        "loveCount": 10,
        "collectionCount": 10,
        "viewCount": 10,
        "publishTime": "2025-03-28 12:10:00"
      },
      {
        "id": "2025032800001",
        "userId": "2025032800001",
        "userAvatar": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        "userNickname": "NPE",
        "itemTitle": "iphone 16",
        "itemType": "数码手机",
        "itemDescription": "刚买2个月 32G 9成新",
        "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
        "itemImageList": [
          "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        ],
        "depreciation": 9,
        "tradeMethod": "人民币",
        "transferPrice": 10000,
        "transferTimes": 0,
        "lastUserId": "2025032800001",
        "blockchainId": "Hash2025032800001",
        "loveCount": 10,
        "collectionCount": 10,
        "viewCount": 10,
        "publishTime": "2025-03-28 12:10:00"
      },
      {
        "id": "2025032800001",
        "userId": "2025032800001",
        "userAvatar": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        "userNickname": "NPE",
        "itemTitle": "iphone 16",
        "itemType": "数码手机",
        "itemDescription": "刚买2个月 32G 9成新",
        "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
        "itemImageList": [
          "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        ],
        "depreciation": 9,
        "tradeMethod": "积分",
        "transferPoints": 100,
        "transferTimes": 0,
        "lastUserId": "2025032800001",
        "blockchainId": "Hash2025032800001",
        "loveCount": 10,
        "collectionCount": 10,
        "viewCount": 10,
        "publishTime": "2025-03-28 12:10:00"
      },
      {
        "id": "2025032800001",
        "userId": "2025032800001",
        "userAvatar": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        "userNickname": "NPE",
        "itemTitle": "iphone 16",
        "itemType": "数码手机",
        "itemDescription": "刚买2个月 32G 9成新",
        "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
        "itemImageList": [
          "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        ],
        "depreciation": 9,
        "tradeMethod": "人民币",
        "transferPrice": 100,
        "transferTimes": 0,
        "lastUserId": "2025032800001",
        "blockchainId": "Hash2025032800001",
        "loveCount": 10,
        "collectionCount": 10,
        "viewCount": 10,
        "publishTime": "2025-03-28 12:10:00"
      },
      {
        "id": "2025032800001",
        "userId": "2025032800001",
        "userAvatar": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        "userNickname": "NPE",
        "itemTitle": "iphone 16",
        "itemType": "数码手机",
        "itemDescription": "刚买2个月 32G 9成新刚买2个月 32G 9成新 刚买2个月 32G 9成新 ",
        "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
        "itemImageList": [
          "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
        ],
        "depreciation": 9,
        "tradeMethod": "人民币",
        "transferPrice": 100,
        "transferTimes": 0,
        "lastUserId": "2025032800001",
        "blockchainId": "Hash2025032800001",
        "loveCount": 10,
        "collectionCount": 10,
        "viewCount": 10,
        "publishTime": "2025-03-28 12:10:00"
      }
    ])

    // 筛选选项
    const itemTypeFilter = ref('all')
    const tradeMethodFilter = ref('all')
    const sortOrder = ref('newest')

    const itemTypeOptions = [
      { text: '全部类型', value: 'all' },
      { text: '数码手机', value: '数码手机' },
      { text: '电脑办公', value: '电脑办公' },
      { text: '服装配饰', value: '服装配饰' },
      { text: '图书音像', value: '图书音像' },
      { text: '其他', value: '其他' },
    ]

    const tradeMethodOptions = [
      { text: '全部交易', value: 'all' },
      { text: '人民币', value: '人民币' },
      { text: '积分', value: '积分' },
      { text: '以物换物', value: '以物换物' },
    ]

    const sortOptions = [
      { text: '最新发布', value: 'newest' },
      { text: '价格最低', value: 'price_asc' },
      { text: '价格最高', value: 'price_desc' },
    ]

    // 过滤后的商品列表
    const filteredProducts = computed(() => {
      return products.value.filter(product => {
        const typeMatch = itemTypeFilter.value === 'all' || product.itemType === itemTypeFilter.value
        const methodMatch = tradeMethodFilter.value === 'all' || product.tradeMethod === tradeMethodFilter.value
        return typeMatch && methodMatch
      }).sort((a, b) => {
        switch (sortOrder.value) {
          case 'price_asc':
            return (a.transferPrice || 0) - (b.transferPrice || 0)
          case 'price_desc':
            return (b.transferPrice || 0) - (a.transferPrice || 0)
          case 'newest':
          default:
            return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
        }
      })
    })

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
    const onViewClick = (productId: number) => {
      router.push(`/square/item/detail/${productId}`)
    }

    const onSearchClick = () => {
      router.push('/search')
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
      onViewClick,
      onSearchClick,
      itemTypeFilter,
      tradeMethodFilter,
      sortOrder,
      itemTypeOptions,
      tradeMethodOptions,
      sortOptions,
      filteredProducts
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

.product-section {
  padding: 0 12px;
  transition: transform 0.3s ease;
}

.product-list {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.product-card {
  margin-bottom: 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  font-size: 16px;
}

.product-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-name {
  font-size: 12px;
  color: #323233;
}

.publish-time {
  font-size: 10px;
  color: #969799;
  margin-top: 2px;
}

.product-stats {
  display: flex;
  gap: 8px;
  color: #999;
  font-size: 12px;
}

.product-stats span {
  display: flex;
  align-items: center;
  gap: 2px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
}

.filter-toolbar {
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: #fff;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

:deep(.van-dropdown-menu__bar) {
  box-shadow: none;
}

:deep(.van-dropdown-menu__item) {
  justify-content: center;
}

:deep(.van-dropdown-menu__title) {
  font-size: 13px;
}
</style>

<template>
  <div class="page-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="custom-nav" title="区块链电商">
      <template #right>
        <template v-if="userInfo">
          <van-icon name="user-o" size="20" class="nav-icon" @click="goToProfile"/>
        </template>
        <template v-else>
          <span class="login-text" @click="onClickRight">登录</span>
        </template>
      </template>
    </van-nav-bar>

    <!-- 搜索框 -->
    <div class="search-wrapper">
      <van-search
        v-model="searchValue"
        placeholder="搜索你想要的商品"
        shape="round"
        background="transparent"
        readonly
        @click="onSearchClick"
      >
        <template #left-icon>
          <van-icon name="search" size="18" color="#1989fa"/>
        </template>
      </van-search>
    </div>

    <!-- 轮播图 -->
    <div class="banner-wrapper">
      <van-swipe class="banner" :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for="(image, index) in banners" :key="index">
          <div class="banner-item">
            <img :src="image" alt="banner">
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 功能导航 -->
    <div class="feature-section">
      <van-grid :column-num="4" :border="false" :gutter="10">
        <van-grid-item v-for="(item, index) in features" :key="index" :icon="item.icon" :text="item.text" @click="item.action">
          <template #icon>
            <div class="feature-icon" :style="{ background: item.color }">
              <van-icon :name="item.icon" size="24" color="#fff"/>
            </div>
          </template>
          <template #text>
            <span class="feature-text">{{ item.text }}</span>
          </template>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 商品列表 -->
    <div class="products-section">
      <!-- 筛选工具栏 -->
      <van-sticky>
        <div class="filter-bar">
          <van-dropdown-menu>
            <van-dropdown-item v-model="itemTypeFilter" :options="itemTypeOptions" />
            <van-dropdown-item v-model="tradeMethodFilter" :options="tradeMethodOptions" />
            <van-dropdown-item v-model="sortOrder" :options="sortOptions" />
          </van-dropdown-menu>
        </div>
      </van-sticky>

      <!-- 商品列表 -->
      <div class="products-grid">
        <div v-for="product in items" :key="product.id" class="product-card" @click="onViewClick(product.id)">
          <div class="product-image">
            <img :src="product.firstImage" :alt="product.itemTitle">
            <div class="product-tags">
              <van-tag round type="primary">{{ product.itemType }}</van-tag>
              <van-tag round type="warning">{{ product.depreciation }}成新</van-tag>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title">{{ product.itemTitle }}</h3>
            <p class="product-desc">{{ product.itemDescription }}</p>
            <div class="product-meta">
              <div class="price-info">
                <template v-if="product.tradeMethod === 'ITEM_TO_MONEY'">
                  <span class="price">¥{{ product.transferPrice }}</span>
                </template>
                <template v-else-if="product.tradeMethod === 'ITEM_TO_POINTS'">
                  <span class="price">{{ product.transferPoints }}积分</span>
                </template>
                <template v-else>
                  <span class="exchange">换{{ product.expectItem }}</span>
                </template>
              </div>
              <div class="trade-method">
                <van-tag plain :type="getTradeMethodType(product.tradeMethod)">
                  {{ getValueText(product.tradeMethod, 'tradeMethod') }}
                </van-tag>
              </div>
            </div>
            <div class="product-footer">
              <div class="user-info">
                <img :src="product.userAvatar" class="user-avatar">
                <span class="user-name">{{ product.userNickname }}</span>
              </div>
              <div class="stats">
                <span><van-icon name="eye-o" /> {{ product.viewCount }}</span>
                <span><van-icon name="like-o" /> {{ product.loveCount }}</span>
                <span><van-icon name="star-o" /> {{ product.collectionCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部导航栏 -->
    <van-tabbar v-model="activeTab" fixed route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="envelop-o" to="/notification">消息</van-tabbar-item>
      <van-tabbar-item to="/stuff/publish">
        <template #icon>
          <div class="publish-button">
            <van-icon name="plus" size="20" />
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/stuff/trades">交易</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user/profile">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
// 首先定义 mixins
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin multi-ellipsis($lines) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.page-container {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}

.custom-nav {
  background: linear-gradient(135deg, #1989fa, #0066ff);
  
  :deep(.van-nav-bar__title), :deep(.nav-icon) {
    color: #fff;
  }
  
  .login-text {
    color: #fff;
    font-size: 14px;
  }
}

.search-wrapper {
  padding: 8px 12px;
  background: #fff;
  
  :deep(.van-search) {
    padding: 0;
  }
  
  :deep(.van-search__content) {
    background: #f5f6fa;
  }
}

.banner-wrapper {
  padding: 0 12px;
  margin: 12px 0;
  
  .banner {
    height: 150px;
    border-radius: 12px;
    overflow: hidden;
    
    .banner-item {
      width: 100%;
      height: 100%;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
}

.feature-section {
  padding: 0 12px;
  margin-bottom: 12px;
  
  .feature-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .feature-text {
    font-size: 12px;
    color: #323233;
    margin-top: 4px;
  }
}

.filter-bar {
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
}

.products-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.98);
  }
  
  .product-image {
    position: relative;
    padding-top: 100%;
    
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .product-tags {
      position: absolute;
      top: 8px;
      left: 8px;
      display: flex;
      gap: 4px;
    }
  }
  
  .product-info {
    padding: 12px;
    
    .product-title {
      font-size: 14px;
      font-weight: bold;
      margin: 0;
      @include text-ellipsis;
    }
    
    .product-desc {
      font-size: 12px;
      color: #666;
      margin: 4px 0;
      @include multi-ellipsis(2);
    }
    
    .product-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0;
      
      .price {
        font-size: 16px;
        font-weight: bold;
        color: #ff6b6b;
      }
      
      .exchange {
        font-size: 14px;
        color: #1989fa;
      }
    }
    
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
      padding-top: 8px;
      border-top: 1px solid #f5f5f5;
      
      .user-info {
        display: flex;
        align-items: center;
        gap: 4px;
        
        .user-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        
        .user-name {
          font-size: 12px;
          color: #666;
        }
      }
      
      .stats {
        display: flex;
        gap: 8px;
        font-size: 12px;
        color: #999;
        
        span {
          display: flex;
          align-items: center;
          gap: 2px;
        }
      }
    }
  }
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
  
  .van-icon {
    color: #fff;
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useItemList } from '@/composables/useItemList'
import { getValueText } from '@/constants/stuff'

export default defineComponent({
  name: 'HomeView',
  setup() {
    const router = useRouter()
    const searchValue = ref('')
    const userInfo = ref(1) // 实际项目中从vuex或pinia获取
    const activeTab = ref(0)

    // 使用物品列表组合式函数
    const {
      loading,
      finished,
      items,
      itemTypeFilter,
      tradeMethodFilter,
      sortOrder,
      itemTypeOptions,
      tradeMethodOptions,
      sortOptions,
      getTradeMethodType,
      loadItems,
      loadMore
    } = useItemList()

    // 模拟数据
    const banners = ref([
      'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
      'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg'
    ])

    const onClickRight = () => {
      router.push('/login')
    }

    const goToProfile = () => {
      router.push('/user/profile')
    }

    const onViewClick = (productId: string) => {
      router.push(`/square/item/detail/${productId}`)
    }

    const onSearchClick = () => {
      router.push('/search')
    }

    const features = [
      {
        icon: 'shop-o',
        text: '全部商品',
        color: '#1989fa',
        action: () => router.push('/square')
      },
      {
        icon: 'gift-o',
        text: '区块链验证',
        color: '#07c160',
        action: () => router.push('/blockchain')
      },
      {
        icon: 'medal-o',
        text: '信用排行',
        color: '#ff976a',
        action: () => router.push('/credit-rank')
      },
      {
        icon: 'balance-o',
        text: '积分排行',
        color: '#ee0a24',
        action: () => router.push('/points-rank')
      }
    ]

    // 初始加载数据
    loadItems({
      pageNo: 1,
      pageSize: 10,
      itemType: itemTypeFilter.value,
      tradeMethod: tradeMethodFilter.value,
      sortBy: sortOrder.value
    })

    // 监听筛选条件变化
    watch([itemTypeFilter, tradeMethodFilter, sortOrder], () => {
      loadItems({
        pageNo: 1,
        pageSize: 10,
        itemType: itemTypeFilter.value,
        tradeMethod: tradeMethodFilter.value,
        sortBy: sortOrder.value
      })
    })

    return {
      searchValue,
      userInfo,
      banners,
      loading,
      finished,
      items,
      onClickRight,
      goToProfile,
      onViewClick,
      activeTab,
      onSearchClick,
      itemTypeFilter,
      tradeMethodFilter,
      sortOrder,
      itemTypeOptions,
      tradeMethodOptions,
      sortOptions,
      features,
      getTradeMethodType,
      loadMore,
      getValueText
    }
  }
})
</script>
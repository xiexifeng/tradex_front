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
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        loading-text="加载中..."
        @load="loadMore"
      >
        <div class="products-grid">
          <ItemCard
            v-for="product in items"
            :key="product.id"
            :item="product"
            @select="onViewClick"
          />
        </div>
      </van-list>
    </div>

    <!-- 底部导航栏 -->
    <AppTabBar />
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

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

</style>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useItemList } from '@/composables/useItemList'
import { getValueText } from '@/constants/stuff'
import ItemCard from '@/components/ui/ItemCard.vue'
import AppTabBar from '@/components/ui/AppTabBar.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    ItemCard,
    AppTabBar
  },
  setup() {
    const router = useRouter()
    const searchValue = ref('')
    const userInfo = ref(1) // 实际项目中从vuex或pinia获取

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
      pageSize,
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
      pageSize: pageSize.value,
      itemType: itemTypeFilter.value,
      tradeMethod: tradeMethodFilter.value,
      sortBy: sortOrder.value
    })

    // 监听筛选条件变化
    watch([itemTypeFilter, tradeMethodFilter, sortOrder], () => {
      loadItems({
        pageNo: 1,
        pageSize: pageSize.value,
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
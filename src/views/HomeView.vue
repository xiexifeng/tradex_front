<template>
  <div class="page-container">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="custom-nav" title="X平台">
      <template #right>
        <template v-if="userInfo">
          <van-icon name="user-o" size="20" class="nav-icon" @click="goToProfile"/>
        </template>
        <template v-else>
          <span class="login-text" @click="onClickRight">登录</span>
        </template>
      </template>
    </van-nav-bar>

    <!-- 搜索 + 首屏引导 -->
    <div class="search-wrapper">
      <van-search
        v-model="searchValue"
        placeholder="搜索你想要的好物"
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

    <div class="hero-section">
      <div class="hero-text">
        <div class="hero-title">让闲置重新流转</div>
        <div class="hero-subtitle">发布闲置 · 寻找好物 · 安全换物</div>
        <div class="hero-notice">平台仅提供信息撮合，所有交易均为线下进行</div>
      </div>
      <van-button
        round
        type="primary"
        size="small"
        class="hero-button"
        @click="goToPublish"
      >
        立即发布闲置
      </van-button>
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
        <div v-if="items.length" class="products-grid">
          <ItemCard
            v-for="product in items"
            :key="product.id"
            :item="product"
            @select="onViewClick"
          />
        </div>
        <div v-else class="empty-state">
          <div class="empty-title">还没有发现合适的好物</div>
          <div class="empty-subtitle">去发布一件闲置，或稍后再来逛逛</div>
          <van-button round type="primary" size="small" @click="goToPublish">
            发布我的第一件闲置
          </van-button>
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
  background: linear-gradient(180deg, #eaf2ff 0%, #f7f8fa 220px);
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
  background: transparent;
  
  :deep(.van-search) {
    padding: 0;
  }
  
  :deep(.van-search__content) {
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
}

.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px 4px;
  color: #323233;
}

.hero-text {
  display: flex;
  flex-direction: column;
}

.hero-title {
  font-size: 18px;
  font-weight: 600;
}

.hero-subtitle {
  margin-top: 4px;
  font-size: 12px;
  color: #707070;
}

.hero-notice {
  margin-top: 6px;
  font-size: 10px;
  color: #969799;
  background: #f5f7fa;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
}

.hero-button {
  border: none;
  background: linear-gradient(135deg, #ff9f43, #ff6b6b);
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

.empty-state {
  padding: 36px 16px 24px;
  text-align: center;
  color: #646566;

  .empty-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .empty-subtitle {
    font-size: 12px;
    margin-bottom: 12px;
  }
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

    const goToPublish = () => {
      router.push('/stuff/publish')
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
        text: '逛换物广场',
        color: '#1989fa',
        action: () => router.push({ name: 'profile', query: { section: 'items' } })
      },
      {
        icon: 'plus',
        text: '发布闲置',
        color: '#ff6b6b',
        action: () => router.push('/stuff/publish')
      },
      {
        icon: 'records',
        text: '我的交易',
        color: '#07c160',
        action: () => router.push('/trade/list')
      },
      {
        icon: 'bell',
        text: '消息通知',
        color: '#ff976a',
        action: () => router.push('/notification')
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
      goToPublish,
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
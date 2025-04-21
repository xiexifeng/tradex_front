<template>
  <div class="page-container">
    <!-- 搜索框 -->
    <div class="search-header">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="搜索你想要的商品"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
        autofocus
      >
        <template #left-icon>
          <van-icon name="search" size="18" color="#1989fa"/>
        </template>
      </van-search>
    </div>

    <!-- 搜索结果 -->
    <div class="search-content" v-if="searchValue">
      <!-- 添加筛选栏 -->
      <van-sticky>
        <div class="filter-bar">
          <van-dropdown-menu>
            <van-dropdown-item v-model="itemTypeFilter" :options="itemTypeOptions" />
            <van-dropdown-item v-model="tradeMethodFilter" :options="tradeMethodOptions" />
            <van-dropdown-item v-model="sortOrder" :options="sortOptions" />
          </van-dropdown-menu>
        </div>
      </van-sticky>

      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="products-grid">
          <div v-for="product in filteredResults" 
               :key="product.id" 
               class="product-card" 
               @click="onViewClick(product.id)"
          >
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
                  <template v-if="product.tradeMethod === '人民币'">
                    <span class="price">¥{{ product.transferPrice }}</span>
                  </template>
                  <template v-else-if="product.tradeMethod === '积分'">
                    <span class="price">{{ product.transferPoints }}积分</span>
                  </template>
                  <template v-else>
                    <span class="exchange">换{{ product.expectItem }}</span>
                  </template>
                </div>
                <div class="trade-method">
                  <van-tag plain :type="getTradeMethodType(product.tradeMethod)">
                    {{ product.tradeMethod }}
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
      </van-list>
    </div>

    <!-- 搜索历史 -->
    <div v-else class="search-history">
      <div class="history-section">
        <div class="section-header">
          <span class="section-title">搜索历史</span>
          <van-icon name="delete-o" size="18" class="clear-icon" @click="clearHistory" />
        </div>
        <div class="history-tags">
          <van-tag
            v-for="item in searchHistory"
            :key="item"
            plain
            type="primary"
            size="medium"
            class="history-tag"
            @click="onHistoryClick(item)"
          >
            {{ item }}
          </van-tag>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div class="hot-section">
        <div class="section-header">
          <span class="section-title">热门搜索</span>
        </div>
        <div class="hot-tags">
          <van-tag
            v-for="(item, index) in hotSearches"
            :key="index"
            :type="index < 3 ? 'danger' : 'primary'"
            size="medium"
            class="hot-tag"
            @click="onHistoryClick(item)"
          >
            {{ item }}
          </van-tag>
        </div>
      </div>
    </div>
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
}

.search-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;

  :deep(.van-search) {
    padding: 8px 12px;
  }

  :deep(.van-search__content) {
    background: #f5f6fa;
  }
}

.search-content {
  padding: 0;
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

.search-history {
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  .section-title {
    font-size: 15px;
    font-weight: bold;
    color: #323233;
  }

  .clear-icon {
    color: #969799;
  }
}

.history-tags, .hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag, .hot-tag {
  cursor: pointer;
  border-radius: 4px;
  
  &:active {
    opacity: 0.8;
  }
}

.hot-section {
  margin-top: 24px;
}

:deep(.van-loading) {
  padding: 20px 0;
}

:deep(.van-list__finished-text) {
  color: #969799;
  font-size: 14px;
  padding: 16px 0;
}

// 添加筛选栏样式
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
  
  :deep(.van-dropdown-menu) {
    box-shadow: none;
    height: 40px;
  }

  :deep(.van-dropdown-menu__item) {
    justify-content: center;
    
    .van-dropdown-menu__title {
      font-size: 13px;
      color: #323233;
      
      &::after {
        border-color: transparent transparent #969799 #969799;
      }
      
      &--active {
        color: #1989fa;
        
        &::after {
          border-color: transparent transparent #1989fa #1989fa;
        }
      }
    }
  }
}

// 优化加载状态的显示
:deep(.van-list__loading) {
  padding: 16px 0;
  background: #fff;
}

:deep(.van-list__finished-text) {
  padding: 16px 0;
  background: #fff;
  color: #969799;
  font-size: 14px;
}
</style>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

// 修改 SearchResult 类型定义
interface SearchResult {
  id: string
  userId: string
  userAvatar: string
  userNickname: string
  itemTitle: string
  itemType: string
  itemDescription: string
  firstImage: string
  depreciation: number
  tradeMethod: string
  expectItem?: string
  transferPrice?: number
  transferPoints?: number
  loveCount: number
  collectionCount: number
  viewCount: number
  publishTime: string
}

export default defineComponent({
  name: 'SearchView',
  setup() {
    const router = useRouter()
    const searchValue = ref('')
    const loading = ref(false)
    const finished = ref(false)
    const searchResults = ref<SearchResult[]>([])
    const searchHistory = ref<string[]>([])

    // 添加筛选相关的状态
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

    // 添加筛选逻辑
    const filteredResults = computed(() => {
      return searchResults.value.filter(product => {
        const typeMatch = itemTypeFilter.value === 'all' || product.itemType === itemTypeFilter.value
        const methodMatch = tradeMethodFilter.value === 'all' || product.tradeMethod === tradeMethodFilter.value
        return typeMatch && methodMatch
      }).sort((a, b) => {
        switch (sortOrder.value) {
          case 'price_asc':
            return ((a.transferPrice || 0) - (b.transferPrice || 0))
          case 'price_desc':
            return ((b.transferPrice || 0) - (a.transferPrice || 0))
          case 'newest':
          default:
            return new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
        }
      })
    })

    // 从本地存储加载搜索历史
    onMounted(() => {
      const history = localStorage.getItem('searchHistory')
      if (history) {
        searchHistory.value = JSON.parse(history)
      }
    })

    // 保存搜索历史
    const saveHistory = (keyword: string) => {
      if (!keyword) return
      const history = new Set([keyword, ...searchHistory.value])
      searchHistory.value = Array.from(history).slice(0, 10)
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory.value))
    }

    // 清除搜索历史
    const clearHistory = () => {
      searchHistory.value = []
      localStorage.removeItem('searchHistory')
    }

    // 点击历史记录
    const onHistoryClick = (keyword: string) => {
      searchValue.value = keyword
      onSearch()
    }

    // 搜索
    const onSearch = () => {
      if (!searchValue.value.trim()) return
      
      finished.value = false
      searchResults.value = []
      saveHistory(searchValue.value)
      onLoad()
    }

    // 加载搜索结果
    const onLoad = () => {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        // 这里应该调用实际的搜索API
        searchResults.value = [
          {
            id: '2025032800001',
            userId: '2025032800001',
            userAvatar: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
            userNickname: "NPE",
            itemTitle: "iphone 16",
            itemType: "数码手机",
            itemDescription: "刚买2个月 32G 9成新",
            firstImage: "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            depreciation: 9,
            tradeMethod: "以物换物",
            expectItem: "山地自行车",
            loveCount: 10,
            collectionCount: 10,
            viewCount: 10,
            publishTime: "2025-03-28 12:10:00"
          }
        ]
        loading.value = false
        finished.value = true
      }, 1000)
    }

    const onCancel = () => {
      router.back()
    }

    const onFocus = () => {
      // 获取焦点时的处理
    }

    const onBuyClick = (productId: number) => {
      router.push('/login')
    }

    const onViewClick = (productId: string) => {
      router.push(`/square/item/detail/${productId}`)
    }

    // 添加热门搜索数据
    const hotSearches = ref([
      'iPhone 16',
      'MacBook Pro',
      'AirPods',
      'iPad Pro',
      'Switch',
      'PS5',
      '机械键盘',
      '显示器'
    ])

    // 添加交易方式类型判断方法
    const getTradeMethodType = (method: string) => {
      switch (method) {
        case '人民币': return 'danger'
        case '积分': return 'warning'
        case '以物换物': return 'primary'
        default: return 'default'
      }
    }

    return {
      searchValue,
      loading,
      finished,
      searchResults,
      searchHistory,
      onSearch,
      onCancel,
      onFocus,
      onLoad,
      clearHistory,
      onHistoryClick,
      onBuyClick,
      onViewClick,
      hotSearches,
      getTradeMethodType,
      itemTypeFilter,
      tradeMethodFilter,
      sortOrder,
      itemTypeOptions,
      tradeMethodOptions,
      sortOptions,
      filteredResults
    }
  }
})
</script> 
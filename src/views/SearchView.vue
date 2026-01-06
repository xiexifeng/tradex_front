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
          <ItemCard
            v-for="product in items"
            :key="product.id"
            :item="product"
            @select="onViewClick"
          />
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
@import '@/styles/theme.scss';

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
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useItemList } from '@/composables/useItemList'
import { getValueText } from '@/constants/stuff'
import ItemCard from '@/components/ui/ItemCard.vue'

export default defineComponent({
  name: 'SearchView',
  components: {
    ItemCard
  },
  setup() {
    const router = useRouter()
    const searchValue = ref('')
    const searchHistory = ref<string[]>([])

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
      resetList,
      loadMore
    } = useItemList()

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
      resetList()
      saveHistory(searchValue.value)
      loadItems({
        pageNo: 1,
        pageSize: 10,
        searchKey: searchValue.value,
        itemType: itemTypeFilter.value,
        tradeMethod: tradeMethodFilter.value,
        sortBy: sortOrder.value
      })
    }

    // 加载更多
    const onLoad = () => {
      console.log('onLoad:'+searchValue.value)
      if (!searchValue.value.trim()) return
      
      loadMore(searchValue.value)
      loading.value = false;
    }

    const onCancel = () => {
      router.back()
    }

    const onFocus = () => {
      // 获取焦点时的处理
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

    // 监听筛选条件变化
    watch([itemTypeFilter, tradeMethodFilter, sortOrder], () => {
      resetList()
      loadItems({
        pageNo: 1,
        pageSize: 10,
        searchKey: searchValue.value,
        itemType: itemTypeFilter.value,
        tradeMethod: tradeMethodFilter.value,
        sortBy: sortOrder.value
      })
    })

    return {
      searchValue,
      loading,
      finished,
      items,
      searchHistory,
      onSearch,
      onCancel,
      onFocus,
      onLoad,
      clearHistory,
      onHistoryClick,
      onViewClick,
      hotSearches,
      getTradeMethodType,
      itemTypeFilter,
      tradeMethodFilter,
      sortOrder,
      itemTypeOptions,
      tradeMethodOptions,
      sortOptions,
      getValueText
    }
  }
})
</script> 
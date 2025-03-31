<template>
  <div class="search">
    <form action="/" class="search-form">
      <van-search
        v-model="searchValue"
        show-action
        placeholder="搜索商品"
        @search="onSearch"
        @cancel="onCancel"
        @focus="onFocus"
        autofocus
      />
    </form>

    <!-- 搜索结果 -->
    <div class="search-result" v-if="searchValue">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-card
          v-for="product in searchResults"
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
      </van-list>
    </div>

    <!-- 搜索历史 -->
    <div v-else class="search-history">
      <div class="history-header">
        <span>搜索历史</span>
        <van-icon name="delete-o" @click="clearHistory" />
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
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
type SearchResult = {
            id: number,
            userId: number,
            userAvatar: string,
            userNickname: string,
            itemTitle: string,
            itemType: string,
            itemDescription: string,
            firstImage: string,
            depreciation: number,
            tradeMethod: string,
            expectItem: string,
            loveCount: number,
            collectionCount: number,
            viewCount: number,
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
            id: 2025032800001,
            userId: 2025032800001,
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

    const onViewClick = (productId: number) => {
      router.push(`/square/item/detail/${productId}`)
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
      onViewClick
    }
  }
})
</script>

<style scoped>
.search {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.search-form {
  position: sticky;
  top: 0;
  z-index: 100;
}

.search-history {
  padding: 16px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  color: #323233;
}

.history-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.history-tag {
  cursor: pointer;
}

.product-card {
  margin: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
  gap: 8px;
}

.product-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}
</style> 
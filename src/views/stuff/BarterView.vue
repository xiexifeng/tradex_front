<template>
  <div class="barter">
    <van-nav-bar title="易物广场" left-arrow
    @click-left="onClickLeft"/>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter">
      <van-search
        v-model="searchValue"
        placeholder="搜索物品"
        @search="onSearch"
      />
      <van-dropdown-menu>
        <van-dropdown-item 
          v-model="distance" 
          :options="distanceOptions"
          @change="onDistanceChange"
        />
        <van-dropdown-item 
          v-model="clazz" 
          :options="clazzOptions"
          @change="onClazzChange"
        />
        <van-dropdown-item 
          v-model="sortType" 
          :options="sortOptions"
          @change="onSortChange"
        />
      </van-dropdown-menu>
    </div>

    <!-- 物品列表 -->
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-card
          v-for="item in items"
          :key="item.id"
          :title="item.name"
          :thumb="item.mainImage"
          :tag="item.blockId"
        >
          <template #desc>
            <div class="item-info">
              <div class="item-distance">
                <van-icon name="location-o" />
                <span>{{ item.distance }}km</span>
              </div>
              <div class="item-tags">
                <van-tag plain type="primary" size="small">{{ item.type }}</van-tag>
                <van-tag plain type="success" size="small" v-if="item.originalPrice">
                  原价¥{{ item.originalPrice }}
                </van-tag>
              </div>
              <div class="item-description">{{ item.description }}</div>
            </div>
          </template>
          <template #footer>
            <div class="action-buttons">
              <van-button size="small" type="primary" @click="viewDetail(item)">
                查看详情
              </van-button>
              <van-button size="small" type="primary" plain @click="initiateExchange(item)">
                发起交换
              </van-button>
            </div>
          </template>
        </van-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

export default defineComponent({
  name: 'BarterView',
  setup() {
    const router = useRouter()
    const searchValue = ref('')
    const distance = ref(5)
    const clazz = ref('A')
    const sortType = ref('distance')
    const loading = ref(false)
    const finished = ref(false)
    const refreshing = ref(false)

    // 距离选项
    const distanceOptions = [
      { text: '1公里内', value: 1 },
      { text: '3公里内', value: 3 },
      { text: '5公里内', value: 5 },
      { text: '10公里内', value: 10 },
      { text: '30公里内', value: 30 }
    ]

    // 排序选项
    const sortOptions = [
      { text: '距离优先', value: 'distance' },
      { text: '时间最新', value: 'time' },
      { text: '价值最高', value: 'price' }
    ]

    // 物品类型选项
    const clazzOptions = [
      {text: '衣服', value : 'A'},
      {text: '家具', value : 'B'},
      {text: '玩具', value : 'C'},
      {text: '电子产品', value : 'D'},
      {text: '图书', value : 'E'},
      {text: '运动器材', value : 'F'},
      {text: '其他', value : 'G'}
    ]


    // 物品列表
    const items = ref([
      {
        id: '001',
        blockId: 'BK001',
        name: '二手笔记本电脑',
        type: '电子产品',
        description: '95新 MacBook Pro 2021',
        distance: 0.8,
        originalPrice: 12999,
        mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'
      },
      {
        id: '002',
        blockId: 'BK002',
        name: '实木书架',
        type: '家具',
        description: '八成新 可调节层高',
        distance: 2.5,
        originalPrice: 299,
        mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'
      }
    ])

    // 搜索
    const onSearch = () => {
      refreshList()
    }

    // 距离变化
    const onDistanceChange = () => {
      refreshList()
    }

    // 排序变化
    const onSortChange = () => {
      refreshList()
    }
    // 排序变化
    const onClazzChange = () => {
      refreshList()
    }

    // 刷新列表
    const refreshList = () => {
      finished.value = false
      items.value = []
      onLoad()
    }

    // 加载更多
    const onLoad = () => {
      loading.value = true
      // 模拟API调用
      setTimeout(() => {
        // 这里应该调用后端API获取数据
        loading.value = false
        finished.value = true
      }, 1000)
    }

    // 下拉刷新
    const onRefresh = () => {
      refreshing.value = true
      refreshList()
      refreshing.value = false
    }

    // 查看详情
    const viewDetail = (item: any) => {
      router.push(`/stuff/detail/${item.id}`)
    }

    // 发起交换
    const initiateExchange = (item: any) => {
      router.push(`/stuff/exchange/${item.id}`)
    }

    const onClickLeft = () => {
      router.back()
    }

    return {
      searchValue,
      distance,
      clazz,
      sortType,
      loading,
      finished,
      refreshing,
      items,
      distanceOptions,
      sortOptions,
      clazzOptions,
      onSearch,
      onDistanceChange,
      onSortChange,
      onClazzChange,
      onLoad,
      onRefresh,
      onClickLeft,
      viewDetail,
      initiateExchange
    }
  }
})
</script>

<style scoped>
.barter {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.search-filter {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #fff;
}

.van-card {
  margin: 8px;
  background-color: #ffffff;
  border-radius: 8px;
}

.item-info {
  margin-top: 8px;
}

.item-distance {
  display: flex;
  align-items: center;
  color: #969799;
  font-size: 12px;
  margin-bottom: 4px;
}

.item-distance .van-icon {
  margin-right: 4px;
  font-size: 14px;
}

.item-tags {
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
}

.item-description {
  color: #323233;
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

:deep(.van-dropdown-menu) {
  box-shadow: none;
  height: 40px;
}

:deep(.van-button--small) {
  min-width: 64px;
}
</style> 
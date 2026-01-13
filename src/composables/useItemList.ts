import { ref, computed } from 'vue'
import { getValueText } from '@/constants/stuff'
import { listSquareItems } from '@/api/stuff'

export interface ItemListParams {
  pageNo: number
  pageSize: number
  searchKey?: string
  itemType?: string
  tradeMethod?: string
  sortBy?: string
}

export interface ItemListItem {
  id: string
  userId: string
  userAvatar: string
  userNickname: string
  itemTitle: string
  itemType: string
  itemDescription: string
  firstImage: string
  depreciation: number
  transferTimes: number
  lastUserId: string
  blockchainId: string
  loveCount: number
  collectionCount: number
  viewCount: number
  tradeMethod: string
  transferPrice: number | null
  transferPoints: number | null
  expectItem: string | null
  publishTime: number
}

export function useItemList() {
  const loading = ref(false)
  const finished = ref(false)
  const items = ref<ItemListItem[]>([])
  const currentPage = ref(1)
  const pageSize = ref(4)

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
    { text: '人民币', value: 'ITEM_TO_MONEY' },
    { text: '积分', value: 'ITEM_TO_POINTS' },
    { text: '以物换物', value: 'ITEM_TO_ITEM' },
  ]

  const sortOptions = [
    { text: '最新发布', value: 'newest' },
    { text: '价格最低', value: 'price_asc' },
    { text: '价格最高', value: 'price_desc' },
  ]

  // 获取交易方式类型
  const getTradeMethodType = (method: string) => {
    switch (method) {
      case 'ITEM_TO_MONEY': return 'danger'
      case 'ITEM_TO_POINTS': return 'warning'
      case 'ITEM_TO_ITEM': return 'primary'
      default: return 'default'
    }
  }

  // 加载数据
  const loadItems = async (params: ItemListParams) => {
    if (loading.value) return
    
    loading.value = true
    try {
      const res = await listSquareItems({
        ...params,
        itemType: params.itemType === 'all' ? undefined : params.itemType,
        tradeMethod: params.tradeMethod === 'all' ? undefined : params.tradeMethod
      })
      if (res.success) {
        if (params.pageNo === 1) {
          items.value = res.data
        } else {
          items.value = [...items.value, ...res.data]
        }
        finished.value = res.data.length < params.pageSize
        currentPage.value = params.pageNo
        // console.log('loadItems:finished.value:'+finished.value)
      }
    } catch (error) {
      console.error('加载物品列表失败:', error)
      finished.value = true
    } finally {
      loading.value = false
      // console.log('loadItems:loading.value:'+loading.value)
    }
  }

  // 重置列表
  const resetList = () => {
    items.value = []
    currentPage.value = 1
    finished.value = false
  }

  // 加载更多
  const loadMore = async (searchKey?: string) => {
    console.log('loadMore:finished.value:'+finished.value)
    // console.log('loadMore:loading.value:'+loading.value)
    if (finished.value) return
    loading.value = false;
    const params: ItemListParams = {
      pageNo: currentPage.value + 1,
      pageSize: pageSize.value,
      searchKey,
      itemType: itemTypeFilter.value,
      tradeMethod: tradeMethodFilter.value,
      sortBy: sortOrder.value
    }
    
    await loadItems(params)
  }

  return {
    loading,
    finished,
    items,
    currentPage,
    pageSize,
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
  }
} 
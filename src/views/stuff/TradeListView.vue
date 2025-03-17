<template>
  <div class="trade-list">
    <van-nav-bar
      title="交易列表"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-tabs v-model:active="activeTab" sticky>
      <van-tab 
        v-for="status in statusList" 
        :key="status.value" 
        :title="status.text"
      >
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-card
              v-for="trade in getFilteredTrades(status.value)"
              :key="trade.id"
              :title="`交易编号: ${trade.id}`"
              :desc="trade.description"
              :thumb="trade.mainImage"
            >
              <template #tags>
                <div class="trade-info">
                  <van-tag :type="getStatusType(trade.status)" round>
                    {{ getStatusText(trade.status) }}
                  </van-tag>
                  <van-tag type="primary" round plain>
                    {{ trade.counterparties }}个交易对手
                  </van-tag>
                  <van-tag type="warning" round plain>
                    代币 +{{ trade.tokens }}
                  </van-tag>
                </div>
              </template>
              <template #footer>
                <div class="action-buttons">
                  <van-button size="small" type="primary" plain @click="viewDetail(trade)">
                    查看详情
                  </van-button>
                  <template v-if="trade.status === 'trading'">
                    <van-button size="small" type="primary" @click="acceptTrade(trade)">
                      接受交易
                    </van-button>
                    <van-button size="small" type="danger" plain @click="cancelTrade(trade)">
                      取消交易
                    </van-button>
                  </template>
                  <template v-if="trade.status === 'accepted'">
                    <van-button size="small" type="success" @click="confirmTrade(trade)">
                      确认交易
                    </van-button>
                  </template>
                </div>
              </template>
            </van-card>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'

export default defineComponent({
  name: 'TradeListView',
  setup() {
    const router = useRouter()
    const activeTab = ref(0)
    const loading = ref(false)
    const finished = ref(false)
    const refreshing = ref(false)

    // 交易状态列表
    const statusList = [
      { text: '全部', value: 'all' },
      { text: '交易中', value: 'trading' },
      { text: '已达成', value: 'accepted' },
      { text: '已完成', value: 'completed' },
      { text: '已取消', value: 'cancelled' }
    ]

    // 模拟交易数据
    const trades = ref([
      {
        id: 'TR001',
        itemId: 'ITEM001',
        description: '二手iPhone 12 换平板电脑',
        mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        status: 'trading',
        counterparties: 2,
        tokens: 100
      },
      {
        id: 'TR002',
        itemId: 'ITEM002',
        description: '耳机换键盘',
        mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        status: 'accepted',
        counterparties: 1,
        tokens: 50
      }
    ])

    // 获取状态样式
    const getStatusType = (status: string) => {
      const typeMap: Record<string, string> = {
        trading: 'primary',
        accepted: 'success',
        completed: 'warning',
        cancelled: 'danger'
      }
      return typeMap[status] || 'default'
    }

    // 获取状态文本
    const getStatusText = (status: string) => {
      const textMap: Record<string, string> = {
        trading: '交易中',
        accepted: '已达成',
        completed: '已完成',
        cancelled: '已取消'
      }
      return textMap[status] || status
    }

    // 根据状态筛选交易
    const getFilteredTrades = (status: string) => {
      if (status === 'all') return trades.value
      return trades.value.filter(trade => trade.status === status)
    }

    // 下拉刷新
    const onRefresh = () => {
      refreshing.value = true
      setTimeout(() => {
        refreshing.value = false
      }, 1000)
    }

    // 上拉加载
    const onLoad = () => {
      loading.value = true
      setTimeout(() => {
        loading.value = false
        finished.value = true
      }, 1000)
    }

    // 查看详情
    const viewDetail = (trade: any) => {
      router.push(`/stuff/trade/${trade.id}`)
    }

    // 接受交易
    const acceptTrade = (trade: any) => {
      showDialog({
        title: '确认接受',
        message: '确定要接受这个交易吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('已接受交易')
        trade.status = 'accepted'
      }).catch(() => {
        console.log('cancel')
      })
    }

    // 确认交易
    const confirmTrade = (trade: any) => {
      showDialog({
        title: '确认完成',
        message: '确定要完成这个交易吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('交易已完成')
        trade.status = 'completed'
      }).catch(() => {
        console.log('cancel')
      })
    }

    // 取消交易
    const cancelTrade = (trade: any) => {
      showDialog({
        title: '取消交易',
        message: '确定要取消这个交易吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('交易已取消')
        trade.status = 'cancelled'
      }).catch(() => {
        console.log('cancel')
      })
    }

    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }

    return {
      activeTab,
      loading,
      finished,
      refreshing,
      statusList,
      trades,
      getStatusType,
      getStatusText,
      getFilteredTrades,
      onRefresh,
      onLoad,
      viewDetail,
      acceptTrade,
      confirmTrade,
      cancelTrade,
      onClickLeft
    }
  }
})
</script>

<style scoped>
.trade-list {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.van-card {
  margin: 8px;
  background-color: #ffffff;
  border-radius: 8px;
}

.trade-info {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

:deep(.van-button--small) {
  min-width: 64px;
}

:deep(.van-card__desc) {
  margin: 8px 0;
}
</style> 
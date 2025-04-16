<template>
  <div class="trade-list">
    <van-nav-bar
      title="交易列表"
      left-arrow
      @click-left="onClickLeft"
      class="nav-bar"
    />

    <van-tabs 
      v-model:active="activeTab" 
      sticky 
      :line-width="20"
      :line-height="3"
      color="#ee0a24"
      title-active-color="#ee0a24"
      class="trade-tabs"
    >
      <van-tab 
        v-for="status in statusList" 
        :key="status.value" 
        :title="status.text"
      >
        <van-pull-refresh 
          v-model="refreshing" 
          @refresh="onRefresh"
          success-text="刷新成功"
          class="refresh-wrapper"
        >
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            class="trade-list-content"
          >
            <div class="trade-item" v-for="trade in getFilteredTrades(status.value)" :key="trade.id">
              <div class="trade-header">
                <div class="trade-status" :class="trade.tradeStatus">
                  {{ getStatusText(trade.tradeStatus) }}
                </div>
                <div class="trade-type" :class="trade.flag.toLowerCase()">
                  {{ trade.flag === 'SELL' ? '换/售出' : '换/购入' }}
                </div>
              </div>

              <div class="trade-content">
                <van-image
                  :src="trade.firstImage"
                  fit="cover"
                  class="trade-image"
                />
                <div class="trade-info">
                  <div class="trade-title">{{ trade.itemTitle }}</div>
                  <div class="trade-id">交易编号: {{ trade.id }}</div>
                  <div class="trade-price">
                    <span class="label">{{ trade.tradeMethod === '人民币' ? '交易金额：¥' : trade.tradeMethod === '积分' ? '交易积分：' : '交换物：' }}</span>
                    <span class="value">{{ trade.tradeMethod === '人民币' ? trade.tradePrice : trade.tradeMethod === '积分' ? trade.tradePoints : trade.swapItemTitle }}</span>
                  </div>
                  
                  <template v-if="trade.tradeStatus === 'completed'">
                    <div class="trade-score">
                      <div class="score-item">
                        <span class="label">评分：</span>
                        <van-rate v-model="trade.fromScore" size="12" readonly allow-half void-icon="star" void-color="#eee" />
                      </div>
                      <div class="score-item">
                        <span class="label">得分：</span>
                        <van-rate v-model="trade.toScore" size="12" readonly allow-half void-icon="star" void-color="#eee" />
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <div class="trade-footer">
                <van-button size="small" type="primary" plain hairline @click="viewDetail(trade)">
                  查看详情
                </van-button>
                <template v-if="trade.tradeStatus === 'trading'">
                  <template v-if="trade.fromUserId === userInfo.userId && trade.tradeMethod === '以物换物'">
                    <van-button size="small" type="primary" @click="acceptTrade(trade)">接受交易</van-button>
                    <van-button size="small" type="danger" plain hairline @click="rejectTrade(trade)">拒绝交易</van-button>
                  </template>
                  <template v-if="trade.fromUserId !== userInfo.userId">
                    <van-button size="small" type="danger" plain hairline @click="cancelTrade(trade)">取消交易</van-button>
                    <template v-if="trade.tradeMethod !== '以物换物'">
                      <van-button size="small" type="primary" @click="goPayTrade(trade)">去支付</van-button>
                    </template>
                  </template>
                </template>
                <template v-if="trade.tradeStatus === 'accepted'">
                  <van-button size="small" type="success" @click="confirmTrade(trade)">确认交易</van-button>
                  <template v-if="trade.fromUserId !== userInfo.userId && trade.tradeMethod !== '以物换物'">
                    <van-button size="small" type="warning" plain hairline @click="refundTrade(trade)">发起退款</van-button>
                  </template>
                </template>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
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
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
type TradeList = {
            "id": string,
            "itemId": string,
            "itemTitle": string,
            "firstImage": string,
            "fromUserId": string,
            "toUserId": string,
            "tradeMethod": number|string,
            "tradeStatus": string,
            "paymentStatus": number|string,
            "tradePrice": number|undefined,
            "tradePoints": number|undefined,
            "swapItemId": string|undefined,
            "swapItemTitle": string|undefined,
            "contactInfo": string,
            "logisticsFrom": string|undefined,
            "logisticsTo": string|undefined,
            "fromScore": number|undefined,
            "toScore": number|undefined,
            "finishTradeTime": string|undefined,
            "createTime": number,
            "flag": string
        }

export default defineComponent({
  name: 'TradeListView',
  setup() {
    const router = useRouter()
    const activeTab = ref(0)
    const loading = ref(false)
    const finished = ref(false)
    const refreshing = ref(false)
    const userInfo = ref({
      userId: "20250324000002"
    })

    // 交易状态列表
    const statusList = [
      { text: '全部', value: 'all' },
      { text: '交易中', value: 'trading' },
      { text: '已达成', value: 'accepted' },
      { text: '已完成', value: 'completed' },
      { text: '已取消', value: 'cancelled' },
      { text: '已拒绝', value: 'rejected' },
      { text: '已退款', value: 'refunded' }
    ]

    // 模拟交易数据
    const trades = ref<TradeList[]>([
      {
            "id": "2025040100001",
            "itemId": "2025040100001",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "以物换物",
            "tradeStatus": 'trading',
            "paymentStatus": 0,
            "tradePrice": undefined,
            "tradePoints": undefined,
            "swapItemId": '20250324000002',
            "swapItemTitle": '小米6',
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": undefined,
            "toScore": undefined,
            "finishTradeTime": undefined,
            "createTime": 1743470905967,
            "flag": 'SELL'
        },
        {
            "id": "2025040100002",
            "itemId": "2025040100002",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "以物换物",
            "tradeStatus": 'accepted',
            "paymentStatus": 0,
            "tradePrice": undefined,
            "tradePoints": undefined,
            "swapItemId": '20250324000002',
            "swapItemTitle": '小米6',
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": undefined,
            "toScore": undefined,
            "finishTradeTime": undefined,
            "createTime": 1743470905967,
            "flag": 'SELL'
        },
        {
            "id": "2025040100003",
            "itemId": "2025040100004",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "以物换物",
            "tradeStatus": 'completed',
            "paymentStatus": 0,
            "tradePrice": undefined,
            "tradePoints": undefined,
            "swapItemId": '20250324000002',
            "swapItemTitle": '小米6',
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": 6,
            "toScore": 9,
            "finishTradeTime": '2025-04-01 12:12:10',
            "createTime": 1743470905967,
            "flag": 'SELL'
        },
        {
            "id": "2025040100004",
            "itemId": "2025040100004",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "以物换物",
            "tradeStatus": 'rejected',
            "paymentStatus": 0,
            "tradePrice": undefined,
            "tradePoints": undefined,
            "swapItemId": '20250324000002',
            "swapItemTitle": '小米6',
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": 6,
            "toScore": 9,
            "finishTradeTime": '2025-04-01 12:12:10',
            "createTime": 1743470905967,
            "flag": 'SELL'
        },
        {
            "id": "2025040100005",
            "itemId": "2025040100004",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "以物换物",
            "tradeStatus": 'cancelled',
            "paymentStatus": 0,
            "tradePrice": undefined,
            "tradePoints": undefined,
            "swapItemId": '20250324000002',
            "swapItemTitle": '小米6',
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": 6,
            "toScore": 9,
            "finishTradeTime": '2025-04-01 12:12:10',
            "createTime": 1743470905967,
            "flag": 'SELL'
        },
        {
            "id": "2025040100006",
            "itemId": "2025040100007",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "人民币",
            "tradeStatus": 'accepted',
            "paymentStatus": 0,
            "tradePrice": undefined,
            "tradePoints": undefined,
            "swapItemId": '20250324000002',
            "swapItemTitle": undefined,
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": 6,
            "toScore": 9,
            "finishTradeTime": undefined,
            "createTime": 1743470905967,
            "flag": 'SELL'
        },
        {
            "id": "2025040100011",
            "itemId": "2025040100002",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000003",
            "toUserId": "20250324000002",
            "tradeMethod": "人民币",
            "tradeStatus": 'trading',
            "paymentStatus": 0,
            "tradePrice": 100,
            "tradePoints": undefined,
            "swapItemId": undefined,
            "swapItemTitle": undefined,
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": undefined,
            "toScore": undefined,
            "finishTradeTime": undefined,
            "createTime": 1743470905967,
            "flag": 'BUY'
        },
        {
            "id": "2025040100012",
            "itemId": "2025040100002",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000003",
            "toUserId": "20250324000002",
            "tradeMethod": "人民币",
            "tradeStatus": 'accepted',
            "paymentStatus": 0,
            "tradePrice": 100,
            "tradePoints": undefined,
            "swapItemId": undefined,
            "swapItemTitle": undefined,
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": undefined,
            "toScore": undefined,
            "finishTradeTime": undefined,
            "createTime": 1743470905967,
            "flag": 'BUY'
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
        cancelled: '已取消',
        rejected: '已拒绝',
        refunded: '已退款'
      }
      return textMap[status] || status
    }

    // 根据状态筛选交易
    const getFilteredTrades = (status: string) => {
      if (status === 'all') return trades.value
      return trades.value.filter(trade => trade.tradeStatus === status)
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
        trade.tradeStatus = 'accepted'
      }).catch(() => {
        console.log('cancel')
      })
    }
    // 拒绝交易
    const rejectTrade = (trade: any) => {
      showDialog({
        title: '确认拒绝',
        message: '确定要拒绝这个交易吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('已拒绝交易')
        trade.tradeStatus = 'rejected'
      }).catch(() => {
        console.log('rejected')
      })
    }
    
    // 发起退款
    const refundTrade = (trade: any) => {
      showDialog({
        title: '确认发起退款',
        message: '确定要发起退款这个交易吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('已发起退款')
        trade.tradeStatus = 'refunded'
      }).catch(() => {
        console.log('refunded')
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
        trade.tradeStatus = 'completed'
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
        trade.tradeStatus = 'cancelled'
      }).catch(() => {
        console.log('cancel')
      })
    }
    // 继续支付/去支付
    const goPayTrade = (trade: any) => {
      showDialog({
        title: '继续支付',
        message: '确定要支付这个交易吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('支付已成功')
        trade.tradeStatus = 'accepted'
      }).catch(() => {
        console.log('accepted')
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
      userInfo,
      getStatusType,
      getStatusText,
      getFilteredTrades,
      onRefresh,
      onLoad,
      viewDetail,
      acceptTrade,
      rejectTrade,
      goPayTrade,
      refundTrade,
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
  padding-bottom: 50px;
}

.nav-bar {
  background: linear-gradient(to right, #ff6034, #ee0a24);
}

:deep(.nav-bar .van-nav-bar__title) {
  color: #fff;
}

:deep(.nav-bar .van-icon) {
  color: #fff;
}

.trade-tabs {
  position: sticky;
  top: 0;
  z-index: 99;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.trade-list-content {
  padding: 12px;
}

.trade-item {
  margin-bottom: 12px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.trade-header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
}

.trade-status {
  font-size: 14px;
  font-weight: 500;
}

.trade-status.trading { color: #1989fa; }
.trade-status.accepted { color: #07c160; }
.trade-status.completed { color: #ff976a; }
.trade-status.cancelled { color: #969799; }
.trade-status.rejected { color: #ee0a24; }
.trade-status.refunded { color: #7232dd; }

.trade-type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
}

.trade-type.sell {
  color: #ee0a24;
  background: #fff1f0;
}

.trade-type.buy {
  color: #07c160;
  background: #f0fff3;
}

.trade-content {
  display: flex;
  padding: 12px;
}

.trade-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 12px;
}

.trade-info {
  flex: 1;
}

.trade-title {
  font-size: 15px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 4px;
}

.trade-id {
  font-size: 12px;
  color: #969799;
  margin-bottom: 8px;
}

.trade-price {
  margin-bottom: 8px;
}

.trade-price .label {
  font-size: 13px;
  color: #969799;
}

.trade-price .value {
  font-size: 15px;
  color: #ee0a24;
  font-weight: 500;
}

.trade-score {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-item .label {
  font-size: 12px;
  color: #969799;
}

.trade-footer {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #f5f5f5;
  justify-content: flex-end;
}

:deep(.van-button--small) {
  padding: 0 16px;
  height: 32px;
  font-size: 13px;
}

:deep(.van-button--primary) {
  background: linear-gradient(to right, #ff6034, #ee0a24);
  border: none;
}

:deep(.van-button--success) {
  background: linear-gradient(to right, #07c160, #06ae56);
  border: none;
}

:deep(.van-rate) {
  display: inline-flex;
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

</style> 
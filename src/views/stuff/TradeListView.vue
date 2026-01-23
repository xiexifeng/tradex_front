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
            <div class="trade-item" v-for="trade in trades" :key="trade.id">
              <div class="trade-header">
                <div class="trade-status" :class="trade.tradeStatus">
                  {{ getStatusText(trade.tradeStatus) }}
                </div>
                <div class="trade-type" :class="trade.flag?.toLowerCase()">
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
                    <span class="label">{{ trade.tradeMethod === 'ITEM_TO_MONEY' ? '交易金额：¥' : trade.tradeMethod === 'ITEM_TO_POINTS' ? '交易积分：' : '交换物：' }}</span>
                    <span class="value">{{ trade.tradeMethod === 'ITEM_TO_MONEY' ? trade.tradePrice : trade.tradeMethod === 'ITEM_TO_POINTS' ? trade.tradePoints : trade.swapItemTitle }}</span>
                  </div>
                  <template v-if="trade.tradeStatus === 'completed'">
                    <div class="trade-score">
                      <div class="score-item">
                        <span class="label">评分：</span>
                        <template  v-if="trade.toUserId === userInfo?.userId">
                          <van-rate v-model="trade.toScore" size="12" readonly allow-half void-icon="star" void-color="#eee" />
                        </template>
                        <template  v-if="trade.fromUserId === userInfo?.userId">
                          <van-rate v-model="trade.fromScore" size="12" readonly allow-half void-icon="star" void-color="#eee" />
                        </template>
                       </div>
                      <div class="score-item">
                        <span class="label">得分：</span>
                        <template  v-if="trade.toUserId === userInfo?.userId">
                          <van-rate v-model="trade.fromScore" size="12" readonly allow-half void-icon="star" void-color="#eee" />
                        </template>
                        <template  v-if="trade.fromUserId === userInfo?.userId">
                          <van-rate v-model="trade.toScore" size="12" readonly allow-half void-icon="star" void-color="#eee" />
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <div class="trade-footer">
                <van-button size="small" type="primary" @click="viewDetail(trade)">
                  查看详情
                </van-button>
                <template v-if="trade.tradeStatus === 'trading'">
                  <template v-if="trade.fromUserId === userInfo?.userId && (trade.tradeMethod === 'ITEM_TO_ITEM' || trade.tradeMethod === 'ITEM_TO_MONEY')">
                    <van-button size="small" type="danger" @click="rejectTrade(trade)">拒绝交易</van-button>
                    <van-button size="small" type="primary" @click="acceptTrade(trade)">接受交易</van-button>
                  </template>
                  <template v-if="trade.fromUserId !== userInfo?.userId">
                    <van-button size="small" type="danger" @click="cancelTrade(trade)">取消交易</van-button>
                    <template v-if="trade.tradeMethod === 'ITEM_TO_POINTS'">
                      <van-button size="small" type="primary" @click="openPayPopup(trade)">去支付</van-button>
                    </template>
                  </template>
                </template>
                <template v-if="trade.toUserId === userInfo?.userId && trade.tradeStatus === 'accepted'">
                  <van-button size="small" type="success" @click="confirmTrade(trade)">确认交易</van-button>
                  <!-- <template v-if="trade.fromUserId !== userInfo?.userId && trade.tradeMethod !== 'ITEM_TO_ITEM'">
                    <van-button size="small" type="warning" @click="refundTrade(trade)">发起退款</van-button>
                  </template> -->
                </template>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
  <PointsPayPopup
    v-model:show="showPayPopup"
    :trade-points="payPoints"
    :loading="false"
    @submit="onPayPopupSubmit"
  />

  <!-- 底部导航栏 -->
  <AppTabBar />
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { getTradeList } from '@/api/stuff'
import type { TradeListItem } from '@/api/types'
import { useUserStore } from '@/store/modules/user'
import PointsPayPopup from '@/components/ui/PointsPayPopup.vue'
import { useTradeActions } from '@/composables/useTradeActions'
import AppTabBar from '@/components/ui/AppTabBar.vue'

export default defineComponent({
  name: 'TradeListView',
  components: {
    AppTabBar,
    PointsPayPopup
  },
  setup() {
    const router = useRouter()
    const activeTab = ref(0)
    const loading = ref(false)
    const finished = ref(false)
    const refreshing = ref(false)
    const trades = ref<TradeListItem[]>([])
    const pageNo = ref(1)
    const pageSize = ref(10)
    const userStore = useUserStore()
    const userInfo = computed(() => userStore.userInfo)
    const showPayPopup = ref(false)
    const payPoints = ref(0)
    const currentTradeForPay = ref<TradeListItem | null>(null)
    const { handleAcceptTrade, handleRejectTrade, handleConfirmTrade, handleCancelTrade, handleGoPayTrade } = useTradeActions()

    // 交易状态列表
    const statusList = [
      
      { text: '交易中', value: 'trading' },
      { text: '已达成', value: 'accepted' },
      { text: '已完成', value: 'completed' },
      { text: '已取消', value: 'cancelled' },
      { text: '已拒绝', value: 'rejected' },
      { text: '已退款', value: 'refunded' },
      { text: '全部', value: 'all' }
    ]

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

    // 获取交易列表
    const fetchTrades = async (isRefresh = false) => {
      if (isRefresh) {
        pageNo.value = 1
        finished.value = false
        trades.value = []
      }
      loading.value = true
      const status = statusList[activeTab.value].value
      const params: any = {
        pageNo: pageNo.value,
        pageSize: pageSize.value
      }
      if (status !== 'all') params.tradeStatus = status
      try {
        params.tradeMethod='ITEM_TO_ITEM'
        const res = await getTradeList(params)
        if (res.success) {
          if (isRefresh) {
            trades.value = res.data
          } else {
            trades.value = trades.value.concat(res.data)
          }
          finished.value = res.data.length < pageSize.value
          pageNo.value++
        } else {
          // showToast(res.desc || '获取失败')
          finished.value = true
        }
      } catch (e) {
        // showToast('获取失败')
        finished.value = true
      } finally {
        loading.value = false
        if (isRefresh) refreshing.value = false
      }
    }

    const onRefresh = () => {
      refreshing.value = true
      fetchTrades(true)
    }

    const onLoad = () => {
      if (!finished.value) fetchTrades()
    }

    // 监听 tab 切换
    watch(activeTab, () => {
      fetchTrades(true)
    })

    // 初始化加载
    onMounted(() => {
      fetchTrades(true)
    })

    // 查看详情
    const viewDetail = (trade: TradeListItem) => {
      router.push(`/stuff/trade/${trade.id}`)
    }

    // 接受交易
    const acceptTrade = (trade: TradeListItem) => {
      handleAcceptTrade(trade.id, () => {
        trade.tradeStatus = 'accepted'
        fetchTrades(true)
      })
    }

    // 拒绝交易
    const rejectTrade = (trade: TradeListItem) => {
      handleRejectTrade(trade.id, () => {
        trade.tradeStatus = 'rejected'
        fetchTrades(true)
      })
    }

    // 发起退款
    const refundTrade = (trade: TradeListItem) => {
      showDialog({
        title: '确认发起退款',
        message: '确定要发起退款这个交易吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('已发起退款')
        trade.tradeStatus = 'refunded'
      })
    }

    // 确认交易
    const confirmTrade = (trade: TradeListItem) => {
      handleConfirmTrade(trade.id, () => {
        trade.tradeStatus = 'completed'
        fetchTrades(true)
      })
    }
    const cancelTrade = (trade: TradeListItem) => {
      handleCancelTrade(trade.id, () => {
        trade.tradeStatus = 'cancelled'
        fetchTrades(true)
      })
    }


    const openPayPopup = (trade: TradeListItem) => {
      currentTradeForPay.value = trade
      payPoints.value = trade.tradePoints || 0
      showPayPopup.value = true
    }

    const onPayPopupSubmit = ({ tradePassword }: { tradePassword: string }) => {
      if (!currentTradeForPay.value) return
      const trade = currentTradeForPay.value
      handleGoPayTrade(
        {
          itemId: trade.itemId,
          tradeId: trade.id,
          tradePassword,
          tradeMethod: trade.tradeMethod,
          tradePrice: trade.tradePrice,
          tradePoints: trade.tradePoints,
          paymentMethod: null
        },
        () => {
          trade.tradeStatus = 'accepted'
          showPayPopup.value = false
          fetchTrades(true)
        }
      )
    }

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
      showPayPopup,
      payPoints,
      getStatusType,
      getStatusText,
      onRefresh,
      onLoad,
      viewDetail,
      acceptTrade,
      rejectTrade,
      openPayPopup,
      onPayPopupSubmit,
      refundTrade,
      confirmTrade,
      cancelTrade,
      onClickLeft
    }
  }
})
</script>

<style lang="scss" scoped>
// 工具 mixins - 必须放在最前面
@mixin text-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.trade-list {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}

// 导航栏样式优化
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #39a0ff);
  }
  
  :deep(.van-nav-bar__title) {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }
  
  :deep(.van-icon) {
    color: #fff;
  }
}

// 标签页样式优化
.trade-tabs {
  position: sticky;
  top: 46px;
  z-index: 99;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  
  :deep(.van-tabs__wrap) {
    padding: 0 12px;
    height: 48px;
    
    .van-tabs__nav {
      background: transparent;
      padding: 6px 0;
      
      &::before {
        display: none;
      }
    }
    
    .van-tab {
      flex: none;
      min-width: 66px;
      padding: 0 12px;
      font-size: 14px;
      color: #666;
      line-height: 36px;
      transition: all 0.3s ease;
      position: relative;
      
      &--active {
        color: #1989fa;
        font-weight: 500;
        transform: scale(1.05);
      }
      
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 1px;
        height: 12px;
        background: #ebedf0;
        opacity: 0.6;
      }
    }
    
    .van-tabs__line {
      background: linear-gradient(to right, #1989fa, #39a0ff);
      height: 3px;
      border-radius: 3px;
      bottom: 8px;
      transition: all 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
  
  :deep(.van-tabs__content) {
    .van-tab__pane {
      animation: fadeIn 0.3s ease-out;
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0.8;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 列表内容区域
.trade-list-content {
  padding: 12px;
}

// 交易卡片样式优化
.trade-item {
  margin-bottom: 12px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;
  
  &:active {
    transform: scale(0.99);
  }
  
  // 卡片头部
  .trade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f5f5f5;
    
    .trade-status {
      font-size: 14px;
      font-weight: 500;
      
      &.trading { 
        color: #1989fa;
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #1989fa;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
      &.accepted { 
        color: #07c160;
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #07c160;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
      &.completed { 
        color: #ff976a;
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff976a;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
      &.cancelled { 
        color: #969799;
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #969799;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
      &.rejected { 
        color: #ee0a24;
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ee0a24;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
      &.refunded { 
        color: #7232dd;
        &::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7232dd;
          margin-right: 6px;
          vertical-align: middle;
        }
      }
    }
    
    .trade-type {
      font-size: 12px;
      padding: 4px 12px;
      border-radius: 12px;
      font-weight: 500;
      
      &.sell {
        color: #ee0a24;
        background: rgba(238, 10, 36, 0.1);
      }
      
      &.buy {
        color: #07c160;
        background: rgba(7, 193, 96, 0.1);
      }
    }
  }
  
  // 卡片内容
  .trade-content {
    display: flex;
    padding: 16px;
    
    .trade-image {
      width: 90px;
      height: 90px;
      border-radius: 8px;
      overflow: hidden;
      margin-right: 12px;
      flex-shrink: 0;
      
      :deep(img) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .trade-info {
      flex: 1;
      min-width: 0;
      
      .trade-title {
        font-size: 15px;
        font-weight: bold;
        color: #323233;
        margin-bottom: 8px;
        @include text-ellipsis;
      }
      
      .trade-id {
        font-size: 12px;
        color: #969799;
        margin-bottom: 8px;
      }
      
      .trade-price {
        margin-bottom: 12px;
        
        .label {
          font-size: 13px;
          color: #969799;
        }
        
        .value {
          font-size: 16px;
          color: #ee0a24;
          font-weight: 500;
          margin-left: 4px;
        }
      }
      
      .trade-score {
        display: flex;
        flex-direction: column;
        gap: 6px;
        
        .score-item {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .label {
            font-size: 12px;
            color: #969799;
          }
          
          :deep(.van-rate) {
            display: inline-flex;
            
            .van-icon {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
  
  // 卡片底部
  .trade-footer {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    border-top: 1px solid #f5f5f5;
    justify-content: flex-end;
    
    :deep(.van-button) {
      height: 32px;
      padding: 0 16px;
      font-size: 13px;
      border-radius: 16px;
      
      // 移除默认边框样式
      &::before {
        display: none;
      }
    }
    
    // 主要按钮样式
    :deep(.van-button--primary) {
      &.van-button--plain {
        background: rgba(25, 137, 250, 0.05);
        border: 1px solid #1989fa;
        color: #1989fa;
        
        &:active {
          background: rgba(25, 137, 250, 0.1);
        }
      }
      
      &:not(.van-button--plain) {
        background: linear-gradient(to right, #1989fa, #39a0ff);
        border: none;
        color: #fff;
      }
    }
    
    // 危险按钮样式
    :deep(.van-button--danger) {
      &.van-button--plain {
        background: rgba(238, 10, 36, 0.05);
        border: 1px solid #ee0a24;
        color: #ee0a24;
        
        &:active {
          background: rgba(238, 10, 36, 0.1);
        }
      }
      
      &:not(.van-button--plain) {
        background: linear-gradient(to right, #ff6034, #ee0a24);
        border: none;
        color: #fff;
      }
    }
    
    // 警告按钮样式
    :deep(.van-button--warning) {
      &.van-button--plain {
        background: rgba(255, 151, 106, 0.05);
        border: 1px solid #ff976a;
        color: #ff976a;
        
        &:active {
          background: rgba(255, 151, 106, 0.1);
        }
      }
      
      &:not(.van-button--plain) {
        background: linear-gradient(to right, #ffa666, #ff976a);
        border: none;
        color: #fff;
      }
    }
    
    // 成功按钮样式
    :deep(.van-button--success) {
      background: linear-gradient(to right, #07c160, #06ae56);
      border: none;
      color: #fff;
      
      &:active {
        opacity: 0.9;
      }
    }
  }
}

// 下拉刷新和加载更多
:deep(.van-pull-refresh),
:deep(.van-list) {
  min-height: calc(100vh - 100px);
  background: transparent;
  
  .van-pull-refresh__track {
    background: transparent;
  }
  
  .van-list__loading,
  .van-list__finished-text,
  .van-pull-refresh__loading,
  .van-pull-refresh__success-text {
    color: #969799;
    font-size: 13px;
    padding: 16px 0;
  }
}

</style> 
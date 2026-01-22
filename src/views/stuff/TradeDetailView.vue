<template>
  <div class="trade-detail">
    <van-nav-bar
      title="交易详情"
      left-arrow
      @click-left="onClickLeft"
      class="nav-bar"
    />

    <div class="detail-content" v-if="tradeInfo">
      <!-- 交易状态卡片 -->
      <div class="trade-header">
        <div class="status-wrap">
          <div class="trade-status" :class="tradeInfo.tradeStatus">
            {{ getStatusText(tradeInfo.tradeStatus) }}
          </div>
          <div class="trade-time">创建时间：{{ new Date(tradeInfo.createTime).toLocaleString() }}</div>
        </div>
        <div class="trade-type" :class="tradeInfo.flag.toLowerCase()">
          {{ tradeInfo.flag === 'SELL' ? '换/售出' : '换/购入' }}
        </div>
      </div>

      <!-- 交易物品信息卡片 -->
      <van-cell-group inset class="info-group">
        <div class="section-title">
          <van-icon name="shop" class="section-icon" />
          <span>物品信息</span>
        </div>
        <div class="trade-content">
          <van-image
            :src="tradeInfo.firstImage"
            fit="cover"
            class="trade-image"
          />
          <div class="item-info">
            <div class="item-title">{{ tradeInfo.itemTitle }}</div>
            <div class="item-meta">
              <div class="meta-item">
                <van-icon name="bar-code" />
                <span>物品编号：{{ tradeInfo.itemId }}</span>
              </div>
              <div class="meta-item">
                <van-icon name="orders-o" />
                <span>交易编号：{{ tradeInfo.id }}</span>
              </div>
              <div class="meta-item">
                <van-icon name="user-o" />
                <span>卖家ID：{{ tradeInfo.fromUserId }}</span>
              </div>
            </div>
          </div>
        </div>
      </van-cell-group>

      <!-- 交易方式信息卡片 -->
      <van-cell-group inset class="trade-method-group">
        <div class="section-title">
          <van-icon name="balance-o" class="section-icon" />
          <span>交易方式</span>
        </div>
        <!-- 以物换物 -->
        <template v-if="tradeInfo.tradeMethod === 'ITEM_TO_ITEM'">
          <div class="swap-info">
            <div class="swap-title">
              <van-icon name="exchange" />
              <span>换物信息</span>
            </div>
            <div class="swap-content">
              <van-image
                :src="tradeInfo.swapItemFirstImage"
                fit="cover"
                class="swap-image"
              />
              <div class="swap-details">
                <div class="swap-item-title">{{ tradeInfo.swapItemTitle }}</div>
                <div class="swap-meta">
                  <div class="meta-item">
                    <van-icon name="bar-code" />
                    <span>物品编号：{{ tradeInfo.swapItemId }}</span>
                  </div>
                  <div class="meta-item">
                    <van-icon name="user-o" />
                    <span>买家ID：{{ tradeInfo.toUserId }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- 人民币/积分 -->
        <template v-else>
          <div class="payment-info">
            <div class="payment-amount">
              <van-icon :name="tradeInfo.tradeMethod === 'ITEM_TO_MONEY' ? 'cash-back-record' : 'points'" />
              <span class="label">{{ tradeInfo.tradeMethod === 'ITEM_TO_MONEY' ? '交易金额：' : '交易积分：' }}</span>
              <span class="value">{{ tradeInfo.tradeMethod === 'ITEM_TO_MONEY' ? `¥${tradeInfo.tradePrice}` : tradeInfo.tradePoints }}</span>
            </div>
            <template v-if="tradeInfo.payment">
              <div class="payment-detail">
                <div class="meta-item">
                  <van-icon name="peer-pay" />
                  <span>支付方式：{{ tradeInfo.payment.paymentMethod }}</span>
                </div>
                <div class="meta-item">
                  <van-icon name="label-o" />
                  <span>支付单号：{{ tradeInfo.payment.paymentNo }}</span>
                </div>
              </div>
            </template>
          </div>
        </template>
      </van-cell-group>

      <!-- 物流信息卡片 -->
      <van-cell-group inset v-if="tradeInfo.logisticsFrom || tradeInfo.logisticsTo" class="logistics-group">
        <div class="section-title">
          <van-icon name="logistics" class="section-icon" />
          <span>物流信息</span>
        </div>
        <div class="logistics-info">
          <div v-if="tradeInfo.logisticsFrom" class="address-item">
            <van-icon name="location-o" />
            <span class="label">发货地址：</span>
            <span class="value">{{ tradeInfo.logisticsFrom }}</span>
          </div>
          <div v-if="tradeInfo.logisticsTo" class="address-item">
            <van-icon name="location" />
            <span class="label">收货地址：</span>
            <span class="value">{{ tradeInfo.logisticsTo }}</span>
          </div>
        </div>
      </van-cell-group>

      <!-- 评分信息卡片 -->
      <van-cell-group inset v-if="tradeInfo.tradeStatus === 'completed'" class="score-group">
        <div class="section-title">
          <van-icon name="star" class="section-icon" />
          <span>交易评分</span>
        </div>
        <div class="score-info">
          <div class="score-item">
            <van-icon name="smile" />
            <span class="label">评分：</span>
            <template v-if="isSeller">
              <template v-if="tradeInfo.fromScore == null">
                <van-rate v-model="rateValue" :count="5"  @change="submitScore" />
                <span class="score-value">{{ rateValue ? rateValue + '分' : '' }}</span>
              </template>
              <template v-else>
                <van-rate v-model="fromScoreSafe" size="14" readonly allow-half void-icon="star" void-color="#eee" />
                <span class="score-value">{{ fromScoreSafe }}分</span>
              </template>
            </template>
            <template v-else>
              <template v-if="tradeInfo.toScore == null">
                <van-rate v-model="rateValue" :count="5"  @change="submitScore" />
                <span class="score-value">{{ rateValue ? rateValue + '分' : '' }}</span>
              </template>
              <template v-else>
                <van-rate v-model="toScoreSafe" size="14" readonly allow-half void-icon="star" void-color="#eee" />
                <span class="score-value">{{ toScoreSafe }}分</span>
              </template>
            </template>
          </div>
          <div class="score-item">
            <van-icon name="good-job" />
            <span class="label">得分：</span>
            <template v-if="isSeller">
              <van-rate v-model="toScoreSafe" size="14" readonly allow-half void-icon="star" void-color="#eee" />
              <span class="score-value">{{ toScoreSafe }}分</span>
            </template>
            <template v-else>
              <van-rate v-model="fromScoreSafe" size="14" readonly allow-half void-icon="star" void-color="#eee" />
              <span class="score-value">{{ fromScoreSafe }}分</span>
            </template>
          </div>
        </div>
      </van-cell-group>
    </div>
    <div v-else class="loading">加载中...</div>

    <!-- 底部按钮 -->
    <div class="action-buttons" v-if="tradeInfo && tradeInfo.tradeStatus !== 'completed'">
      <template v-if="tradeInfo.tradeStatus === 'trading'">
        <template v-if="tradeInfo.fromUserId === userInfo?.userId && tradeInfo.tradeMethod === 'ITEM_TO_ITEM'">
          <van-button size="large" type="primary" @click="acceptTrade">接受交易</van-button>
          <van-button size="large" type="danger" plain hairline @click="rejectTrade">拒绝交易</van-button>
        </template>
        <template v-if="tradeInfo.fromUserId !== userInfo?.userId">
          <van-button size="large" type="danger" plain hairline @click="cancelTrade">取消交易</van-button>
          <template v-if="tradeInfo.tradeMethod !== 'ITEM_TO_ITEM'">
            <van-button size="large" type="primary" @click="goPayTrade">去支付</van-button>
          </template>
        </template>
      </template>
      <template v-if="tradeInfo.toUserId === userInfo?.userId && tradeInfo.tradeStatus === 'accepted'">
        <van-button size="large" type="success" @click="confirmTrade">确认交易</van-button>
        <template v-if="tradeInfo.toUserId === userInfo.userId && tradeInfo.tradeMethod !== 'ITEM_TO_ITEM'">
          <van-button size="large" type="warning" plain hairline @click="refundTrade">发起退款</van-button>
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import type { TradeDetail } from '@/api/types'
import { getTradeDetail } from '@/api/stuff'
import { useUserStore } from '@/store/modules/user'
import { useTradeActions } from '@/composables/useTradeActions'
import { tradeScore } from '@/api/stuff'

export default defineComponent({
  name: 'TradeDetailView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    // 交易信息
    const tradeInfo = ref<TradeDetail | null>(null)

    // 评分安全绑定
    const fromScoreSafe = computed({
      get: () => tradeInfo.value?.fromScore ?? 0,
      set: v => { if (tradeInfo.value) tradeInfo.value.fromScore = v }
    })
    const toScoreSafe = computed({
      get: () => tradeInfo.value?.toScore ?? 0,
      set: v => { if (tradeInfo.value) tradeInfo.value.toScore = v }
    })

    const rateValue = ref(0)
    const isSeller = computed(() => tradeInfo.value && userInfo.value && tradeInfo.value.fromUserId === userInfo.value.userId)

    // 提交评分
    const submitScore = async (score: number) => {
      if (!tradeInfo.value) return
      const data = {
        tradeId: tradeInfo.value.id,
        tradeScore: score
      }
      const res = await tradeScore(data)
      if (res.success) {
        showToast('评分成功')
        if (isSeller.value) {
          tradeInfo.value.fromScore = score
        } else {
          tradeInfo.value.toScore = score
        }
      } else {
        showToast(res.desc || '评分失败')
      }
    }

    // 交换物品列表
    const exchangeItems = ref([
      {
        id: 'ITEM002',
        mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        description: '平板电脑，95新',
        location: '商场B',
        time: '2024-02-21',
        contact: '13900139000'
      },
      {
        id: 'ITEM003',
        mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
        description: '平板电脑，98新',
        location: '地铁站C',
        time: '2024-02-22',
        contact: '13700137000'
      }
    ])

    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }

    // 达成交易
    const acceptExchange = (item: any) => {
      showDialog({
        title: '确认交易',
        message: `确定要与物品 ${item.id} 达成交易吗？`,
        showCancelButton: true,
      }).then(() => {
        showToast('已达成交易')
        tradeInfo.value!.tradeStatus = 'accepted'
      }).catch(() => {
        console.log('cancel')
      })
    }

    // 拒绝交易
    const rejectExchange = (item: any) => {
      showDialog({
        title: '拒绝交易',
        message: `确定要拒绝与物品 ${item.id} 的交易吗？`,
        showCancelButton: true,
      }).then(() => {
        showToast('已拒绝交易')
        exchangeItems.value = exchangeItems.value.filter(i => i.id !== item.id)
      }).catch(() => {
        console.log('cancel')
      })
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
    const userStore = useUserStore()
    const userInfo = computed(() => userStore.userInfo)
    const { handleAcceptTrade, handleRejectTrade, handleConfirmTrade } = useTradeActions()

    onMounted(async () => {
      const tradeId = route.params.id as string
      if (!tradeId) {
        showToast('交易ID不存在')
        return
      }
      try {
        const res = await getTradeDetail(tradeId)
        if (res.success && res.data) {
          tradeInfo.value = res.data
        } else {
          showToast(res.desc || '获取交易详情失败')
        }
      } catch (e) {
        showToast('获取交易详情失败')
      }
    })

    // 接受交易
    const acceptTrade = () => {
      if (!tradeInfo.value) return
      handleAcceptTrade(tradeInfo.value.id, () => {
        tradeInfo.value!.tradeStatus = 'accepted'
      })
    }

    // 拒绝交易
    const rejectTrade = () => {
      if (!tradeInfo.value) return
      handleRejectTrade(tradeInfo.value.id, () => {
        tradeInfo.value!.tradeStatus = 'rejected'
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
    const confirmTrade = () => {
      if (!tradeInfo.value) return
      handleConfirmTrade(tradeInfo.value.id, () => {
        tradeInfo.value!.tradeStatus = 'completed'
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

    return {
      tradeInfo,
      userInfo,
      getStatusText,
      exchangeItems,
      onClickLeft,
      acceptExchange,
      rejectExchange,
      acceptTrade,
      rejectTrade,
      goPayTrade,
      refundTrade,
      confirmTrade,
      cancelTrade,
      fromScoreSafe,
      toScoreSafe,
      rateValue,
      isSeller,
      submitScore
    }
  }
})
</script>

<style scoped>
.trade-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 24px;
}

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

.detail-content {
  padding: 16px;
}

.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  .status-wrap {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .trade-time {
      font-size: 12px;
      color: #969799;
    }
  }
  
  .trade-status {
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 8px;
    }
    
    &.trading { 
      color: #1989fa;
      &::before { background: #1989fa; }
    }
    &.accepted { 
      color: #07c160;
      &::before { background: #07c160; }
    }
    &.completed { 
      color: #ff976a;
      &::before { background: #ff976a; }
    }
    &.cancelled { 
      color: #969799;
      &::before { background: #969799; }
    }
    &.rejected { 
      color: #ee0a24;
      &::before { background: #ee0a24; }
    }
    &.refunded { 
      color: #7232dd;
      &::before { background: #7232dd; }
    }
  }
  
  .trade-type {
    font-size: 13px;
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

.info-group,
.trade-method-group,
.logistics-group,
.score-group {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #323233;
    padding: 16px;
    border-bottom: 1px solid #f5f5f5;
  }
}

.section-icon {
  font-size: 18px;
  color: #1989fa;
}

.item-meta,
.swap-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  
  .meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #666;
    
    .van-icon {
      font-size: 14px;
      color: #969799;
    }
  }
}

.trade-content {
  display: flex;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  margin: 12px;
  
  .trade-image {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: scale(1.02);
      transition: transform 0.3s ease;
    }
  }
  
  .trade-id {
    font-size: 13px;
    color: #969799;
    margin-bottom: 12px;
  }
  
  .item-info {
    flex: 1;
    min-width: 0;
    
    .item-title {
      font-size: 16px;
      font-weight: bold;
      color: #323233;
      margin-bottom: 8px;
    }
  }
}

.trade-method-group {
  .swap-info,
  .payment-info {
    padding: 16px;
  }
  
  .swap-title {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
  }
  
  .swap-content {
    background: #fafafa;
    border-radius: 8px;
    margin: 12px;
    padding: 16px;
    
    .swap-image {
      width: 100px;
      height: 100px;
    }
  }
  
  .payment-info {
    padding: 16px;
    
    .payment-amount {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: #fff7f7;
      border-radius: 8px;
      margin-bottom: 16px;
      
      .van-icon {
        font-size: 20px;
        color: #ee0a24;
      }
      
      .value {
        font-size: 24px;
        font-weight: bold;
        color: #ee0a24;
      }
    }
    
    .payment-detail {
      font-size: 13px;
      color: #666;
      line-height: 1.8;
    }
  }
}

.logistics-group {
  .logistics-info {
    padding: 16px;
    
    .address-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 12px;
      
      .van-icon {
        font-size: 16px;
        color: #1989fa;
        margin-top: 2px;
      }
    }
  }
}

.score-group {
  .score-info {
    padding: 16px;
    
    .score-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #f5f5f5;
      border-radius: 8px;
      margin-bottom: 12px;
      
      .van-icon {
        font-size: 16px;
        color: #ff976a;
      }
      
      .score-value {
        margin-left: 8px;
        color: #ff976a;
        font-weight: 500;
      }
    }
  }
}

.action-buttons {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 16px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  gap: 12px;
  z-index: 99;
  
  :deep(.van-button) {
    flex: 1;
    height: 44px;
    font-size: 15px;
    border-radius: 22px;
    
    &::before {
      display: none;
    }
    
    &--primary {
      background: linear-gradient(to right, #1989fa, #39a0ff);
      border: none;
      
      &.van-button--plain {
        background: #fff;
        border: 1px solid #1989fa;
        color: #1989fa;
      }
    }
    
    &--danger {
      background: linear-gradient(to right, #ff6034, #ee0a24);
      border: none;
      
      &.van-button--plain {
        background: rgba(238, 10, 36, 0.05);
        border: 1px solid #ee0a24;
        color: #ee0a24;
      }
    }
    
    &--warning {
      background: linear-gradient(to right, #ffa666, #ff976a);
      border: none;
      
      &.van-button--plain {
        background: rgba(255, 151, 106, 0.05);
        border: 1px solid #ff976a;
        color: #ff976a;
      }
    }
    
    &--success {
      background: linear-gradient(to right, #07c160, #06ae56);
      border: none;
    }
  }
}
</style> 
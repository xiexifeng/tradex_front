<template>
  <div class="trade-detail">
    <van-nav-bar
      title="交易详情"
      left-arrow
      @click-left="onClickLeft"
      class="nav-bar"
    />

    <div class="detail-content">
      <!-- 交易状态 -->
      <div class="trade-header">
        <div class="trade-status" :class="tradeInfo.tradeStatus">
          {{ getStatusText(tradeInfo.tradeStatus) }}
        </div>
        <div class="trade-type" :class="tradeInfo.flag.toLowerCase()">
          {{ tradeInfo.flag === 'SELL' ? '换/售出' : '换/购入' }}
        </div>
      </div>

      <!-- 交易基本信息 -->
      <van-cell-group inset class="info-group">
        <div class="trade-id">交易编号：{{ tradeInfo.id }}</div>
        <div class="trade-content">
          <van-image
            :src="tradeInfo.firstImage"
            fit="cover"
            class="trade-image"
          />
          <div class="item-info">
            <div class="item-title">{{ tradeInfo.itemTitle }}</div>
            <div class="item-id">物品编号：{{ tradeInfo.itemId }}</div>
          </div>
        </div>
      </van-cell-group>

      <!-- 交易方式信息 -->
      <van-cell-group inset class="trade-method-group">
        <div class="section-title">交易方式</div>
        <!-- 以物换物 -->
        <template v-if="tradeInfo.tradeMethod === '以物换物'">
          <div class="swap-info">
            <div class="swap-title">换物信息</div>
            <div class="swap-content">
              <van-image
                :src="tradeInfo.swapItemFirstImage"
                fit="cover"
                class="swap-image"
              />
              <div class="swap-details">
                <div class="swap-item-title">{{ tradeInfo.swapItemTitle }}</div>
                <div class="swap-item-id">物品编号：{{ tradeInfo.swapItemId }}</div>
              </div>
            </div>
          </div>
        </template>
        <!-- 人民币/积分 -->
        <template v-else>
          <div class="payment-info">
            <div class="payment-amount">
              <span class="label">{{ tradeInfo.tradeMethod === '人民币' ? '交易金额：' : '交易积分：' }}</span>
              <span class="value">{{ tradeInfo.tradeMethod === '人民币' ? `¥${tradeInfo.tradePrice}` : tradeInfo.tradePoints }}</span>
            </div>
            <template v-if="tradeInfo.payment">
              <div class="payment-detail">
                <div class="payment-method">支付方式：{{ tradeInfo.payment.paymentMethod }}</div>
                <div class="payment-no">支付单号：{{ tradeInfo.payment.paymentNo }}</div>
              </div>
            </template>
          </div>
        </template>
      </van-cell-group>

      <!-- 物流信息 -->
      <van-cell-group inset v-if="tradeInfo.logisticsFrom || tradeInfo.logisticsTo" class="logistics-group">
        <div class="section-title">物流信息</div>
        <div class="logistics-info">
          <div v-if="tradeInfo.logisticsFrom" class="address-item">
            <span class="label">发货地址：</span>
            <span class="value">{{ tradeInfo.logisticsFrom }}</span>
          </div>
          <div v-if="tradeInfo.logisticsTo" class="address-item">
            <span class="label">收货地址：</span>
            <span class="value">{{ tradeInfo.logisticsTo }}</span>
          </div>
        </div>
      </van-cell-group>

      <!-- 评分信息 -->
      <van-cell-group inset v-if="tradeInfo.tradeStatus === 'completed'" class="score-group">
        <div class="section-title">交易评分</div>
        <div class="score-info">
          <div class="score-item">
            <span class="label">评分：</span>
            <van-rate v-model="tradeInfo.fromScore" size="14" readonly allow-half void-icon="star" void-color="#eee" />
          </div>
          <div class="score-item">
            <span class="label">得分：</span>
            <van-rate v-model="tradeInfo.toScore" size="14" readonly allow-half void-icon="star" void-color="#eee" />
          </div>
        </div>
      </van-cell-group>

      <!-- 操作按钮 -->
      <div class="action-buttons" v-if="tradeInfo.tradeStatus !== 'completed'">
        <template v-if="tradeInfo.tradeStatus === 'trading'">
          <template v-if="tradeInfo.fromUserId === userInfo.userId && tradeInfo.tradeMethod === '以物换物'">
            <van-button size="large" type="primary" @click="acceptTrade">接受交易</van-button>
            <van-button size="large" type="danger" plain hairline @click="rejectTrade">拒绝交易</van-button>
          </template>
          <template v-if="tradeInfo.fromUserId !== userInfo.userId">
            <van-button size="large" type="danger" plain hairline @click="cancelTrade">取消交易</van-button>
            <template v-if="tradeInfo.tradeMethod !== '以物换物'">
              <van-button size="large" type="primary" @click="goPayTrade">去支付</van-button>
            </template>
          </template>
        </template>
        <template v-if="tradeInfo.tradeStatus === 'accepted'">
          <van-button size="large" type="success" @click="confirmTrade">确认交易</van-button>
          <template v-if="tradeInfo.fromUserId !== userInfo.userId && tradeInfo.tradeMethod !== '以物换物'">
            <van-button size="large" type="warning" plain hairline @click="refundTrade">发起退款</van-button>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
type TradeDetail = {
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
            "swapItemFirstImage": string|undefined,
            "contactInfo": string,
            "logisticsFrom": string|undefined,
            "logisticsTo": string|undefined,
            "fromScore": number|undefined,
            "toScore": number|undefined,
            "finishTradeTime": string|undefined,
            "createTime": number,
            "flag": string
            "payment": undefined|{
              "paymentMethod": string|number|undefined,
              "paymentNo": string|undefined,
              "amount": number|undefined
            }
        }

export default defineComponent({
  name: 'TradeDetailView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    // 交易信息
    const tradeInfo = ref<TradeDetail>({
            "id": "2025040100001",
            "itemId": "2025040100001",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "人民币",
            "tradeStatus": 'trading',
            "paymentStatus": 0,
            "tradePrice": 100,
            "tradePoints": undefined,
            "swapItemId": '20250324000002',
            "swapItemTitle": '小米6',
            "swapItemFirstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "contactInfo": '',
            "logisticsFrom": undefined,
            "logisticsTo": undefined,
            "fromScore": undefined,
            "toScore": undefined,
            "finishTradeTime": undefined,
            "createTime": 1743470905967,
            "flag": 'SELL',
            "payment": {
              "paymentMethod": '微信支付',
              "paymentNo": 'PAY2025040100003',
              "amount": 100
            }
        })

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
        tradeInfo.value.tradeStatus = 'accepted'
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
    const userInfo = ref({
      userId: "20250324000002"
    })
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

    onMounted(() => {
      // 这里应该根据路由参数获取交易详情
      console.log('Trade ID:', route.params.id)
    })

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
      cancelTrade
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
  background: linear-gradient(to right, #ff6034, #ee0a24);
}

:deep(.nav-bar .van-nav-bar__title),
:deep(.nav-bar .van-icon) {
  color: #fff;
}

.detail-content {
  padding: 12px;
}

.trade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.trade-status {
  font-size: 16px;
  font-weight: 500;
}

.trade-status.trading { color: #1989fa; }
.trade-status.accepted { color: #07c160; }
.trade-status.completed { color: #ff976a; }
.trade-status.cancelled { color: #969799; }
.trade-status.rejected { color: #ee0a24; }
.trade-status.refunded { color: #7232dd; }

.trade-type {
  font-size: 13px;
  padding: 4px 12px;
  border-radius: 12px;
}

.trade-type.sell {
  color: #ee0a24;
  background: #fff1f0;
}

.trade-type.buy {
  color: #07c160;
  background: #f0fff3;
}

.info-group,
.trade-method-group,
.logistics-group,
.score-group {
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.section-title {
  font-size: 15px;
  font-weight: 500;
  color: #323233;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.trade-content {
  display: flex;
  padding: 16px;
}

.trade-image,
.swap-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 12px;
}

.item-info,
.swap-details {
  flex: 1;
}

.item-title,
.swap-item-title {
  font-size: 15px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 4px;
}

.item-id,
.swap-item-id,
.trade-id {
  font-size: 13px;
  color: #969799;
}

.payment-info,
.logistics-info,
.score-info {
  padding: 16px;
}

.payment-amount {
  margin-bottom: 12px;
}

.payment-amount .value {
  font-size: 20px;
  font-weight: bold;
  color: #ee0a24;
}

.payment-detail,
.address-item {
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}

.score-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.score-item .label {
  width: 60px;
  font-size: 14px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
  padding: 0 12px;
  margin-top: 24px;
}

:deep(.van-button--large) {
  flex: 1;
  height: 44px;
  font-size: 15px;
}

:deep(.van-button--primary) {
  background: linear-gradient(to right, #ff6034, #ee0a24);
  border: none;
}

:deep(.van-button--success) {
  background: linear-gradient(to right, #07c160, #06ae56);
  border: none;
}
</style> 
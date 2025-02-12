<template>
  <div class="trade-detail">
    <van-nav-bar
      title="交易详情"
      left-arrow
      @click-left="onClickLeft"
    />

    <!-- 拥有者物品信息 -->
    <van-cell-group inset title="我的物品" class="owner-info">
      <van-cell title="交易编号" :value="tradeInfo.id" />
      <van-cell title="物品编号" :value="tradeInfo.itemId" />
      <van-image
        width="100%"
        height="200"
        fit="cover"
        :src="tradeInfo.mainImage"
        class="item-image"
      />
      <van-cell title="物品描述" :label="tradeInfo.description" />
      <van-cell title="交易地点" :value="tradeInfo.location" />
      <van-cell title="交易时间" :value="tradeInfo.time" />
      <van-cell title="联系方式" :value="tradeInfo.contact" />
    </van-cell-group>

    <!-- 目标交换物品列表 -->
    <van-cell-group inset title="交换请求列表" class="exchange-list">
      <div 
        v-for="item in exchangeItems" 
        :key="item.id" 
        class="exchange-item"
      >
        <van-card
          :title="`物品编号: ${item.id}`"
          :desc="item.description"
          :thumb="item.mainImage"
        >
          <template #tags>
            <div class="item-info">
              <van-tag type="primary" plain>{{ item.location }}</van-tag>
              <van-tag type="success" plain>{{ item.time }}</van-tag>
            </div>
          </template>
          <template #footer>
            <div class="contact-info">
              联系方式: {{ item.contact }}
            </div>
            <div class="action-buttons">
              <van-button 
                size="small" 
                type="primary" 
                @click="acceptExchange(item)"
                v-if="tradeInfo.status === 'trading'"
              >
                达成交易
              </van-button>
              <van-button 
                size="small" 
                type="danger" 
                plain 
                @click="rejectExchange(item)"
                v-if="tradeInfo.status === 'trading'"
              >
                拒绝交易
              </van-button>
            </div>
          </template>
        </van-card>
      </div>
    </van-cell-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'

export default defineComponent({
  name: 'TradeDetailView',
  setup() {
    const router = useRouter()
    const route = useRoute()

    // 交易信息
    const tradeInfo = ref({
      id: 'TR001',
      itemId: 'ITEM001',
      mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
      description: '二手iPhone 12 换平板电脑',
      location: '商场A',
      time: '2024-02-20',
      contact: '13800138000',
      status: 'trading'
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
        tradeInfo.value.status = 'accepted'
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

    onMounted(() => {
      // 这里应该根据路由参数获取交易详情
      console.log('Trade ID:', route.params.id)
    })

    return {
      tradeInfo,
      exchangeItems,
      onClickLeft,
      acceptExchange,
      rejectExchange
    }
  }
})
</script>

<style scoped>
.trade-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.owner-info,
.exchange-list {
  margin: 12px;
}

.item-image {
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
}

.exchange-item {
  margin-bottom: 12px;
}

.item-info {
  display: flex;
  gap: 8px;
  margin: 8px 0;
}

.contact-info {
  color: #666;
  font-size: 14px;
  margin: 8px 0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

:deep(.van-button--small) {
  min-width: 64px;
}

:deep(.van-card) {
  background-color: #ffffff;
  border-radius: 8px;
}
</style> 
<template>
  <div class="stuff-list">
    <van-nav-bar
      title="我的物品"
      left-arrow
      @click-left="onClickLeft"
    />

    <van-tabs v-model:active="activeTab" sticky>
      <van-tab 
        v-for="status in statusList" 
        :key="status.value" 
        :title="status.text"
      >
        <template v-if="getFilteredItems(status.value).length">
          <van-card
            v-for="item in getFilteredItems(status.value)"
            :key="item.id"
            :title="item.name"
            :thumb="item.mainImage"
            :tag="item.blockId"
          >
            <template #desc>
              <div class="item-info">
                <span class="item-id">编号: {{ item.id }}</span>
                <span :class="['item-status', `status-${item.status}`]">
                  {{ getStatusText(item.status) }}
                </span>
              </div>
            </template>
            <template #footer>
              <div class="action-buttons">
                <!-- 根据不同状态显示不同按钮 -->
                <template v-if="item.status === 'owned'">
                  <van-button size="small" type="primary" @click="initiateTransfer(item)">
                    发起出让
                  </van-button>
                  <van-button size="small" type="danger" @click="destroyItem(item)">
                    销毁
                  </van-button>
                </template>
                <template v-if="item.status === 'pending'">
                  <van-button size="small" plain type="primary" @click="cancelTransfer(item)">
                    取消出让
                  </van-button>
                </template>
                <template v-if="item.status === 'rejected'">
                  <van-button size="small" type="warning" @click="viewReason(item)">
                    查看原因
                  </van-button>
                </template>
                <template v-if="item.status === 'available'">
                  <van-button size="small" type="primary" @click="viewOffers(item)">
                    查看报价
                  </van-button>
                  <van-button size="small" plain type="primary" @click="cancelListing(item)">
                    下架
                  </van-button>
                </template>
                <template v-if="item.status === 'trading'">
                  <van-button size="small" type="primary" @click="viewTradeDetails(item)">
                    交易详情
                  </van-button>
                </template>
              </div>
            </template>
          </van-card>
        </template>
        <template v-else>
          <van-empty description="暂无物品" />
        </template>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'

export default defineComponent({
  name: 'StuffListView',
  setup() {
    const router = useRouter()
    const activeTab = ref(0)

    // 状态列表
    const statusList = [
      { text: '全部', value: 'all' },
      { text: '拥有', value: 'owned' },
      { text: '审核中', value: 'pending' },
      { text: '已驳回', value: 'rejected' },
      { text: '可出让', value: 'available' },
      { text: '交易中', value: 'trading' },
      { text: '已转让', value: 'transferred' },
      { text: '已销毁', value: 'destroyed' }
    ]

    // 模拟物品数据
    const items = ref([
      {
        id: '001',
        blockId: 'BK001',
        name: '测试物品1',
        status: 'owned',
        mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'
      },
      {
        id: '002',
        blockId: 'BK002',
        name: '测试物品2',
        status: 'pending',
        mainImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'
      }
      // ... 其他测试数据
    ])

    // 获取状态文本
    const getStatusText = (status: string) => {
      const statusMap: Record<string, string> = {
        owned: '拥有',
        pending: '审核中',
        rejected: '已驳回',
        available: '可出让',
        trading: '交易中',
        transferred: '已转让',
        destroyed: '已销毁'
      }
      return statusMap[status] || status
    }

    // 根据状态筛选物品
    const getFilteredItems = (status: string) => {
      if (status === 'all') return items.value
      return items.value.filter(item => item.status === status)
    }

    // 操作方法
    const initiateTransfer = (item: any) => {
      showDialog({
        title: '确认出让',
        message: '确定要发起出让申请吗？',
        showCancelButton: true,
      }).then(() => {
        // 调用API发起出让
        showToast('已提交出让申请')
      })
    }

    const destroyItem = (item: any) => {
      showDialog({
        title: '确认销毁',
        message: '物品销毁后将无法恢复，是否继续？',
        showCancelButton: true,
      }).then(() => {
        // 调用API销毁物品
        showToast('物品已销毁')
      })
    }

    const cancelTransfer = (item: any) => {
      showDialog({
        title: '取消出让',
        message: '确定要取消出让申请吗？',
        showCancelButton: true,
      }).then(() => {
        // 调用API取消出让
        showToast('已取消出让申请')
      })
    }

    const viewReason = (item: any) => {
      showDialog({
        title: '驳回原因',
        message: '不符合出让条件：物品信息不完整',
        showConfirmButton: true,
      })
    }

    const viewOffers = (item: any) => {
      router.push(`/stuff/offers/${item.id}`)
    }

    const cancelListing = (item: any) => {
      showDialog({
        title: '下架物品',
        message: '确定要将物品下架吗？',
        showCancelButton: true,
      }).then(() => {
        // 调用API下架物品
        showToast('物品已下架')
      })
    }

    const viewTradeDetails = (item: any) => {
      router.push(`/stuff/trade/${item.id}`)
    }

    const onClickLeft = () => {
      router.back()
    }

    return {
      activeTab,
      statusList,
      items,
      getStatusText,
      getFilteredItems,
      initiateTransfer,
      destroyItem,
      cancelTransfer,
      viewReason,
      viewOffers,
      cancelListing,
      viewTradeDetails,
      onClickLeft
    }
  }
})
</script>

<style scoped>
.stuff-list {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.van-card {
  margin: 8px;
  background-color: #ffffff;
  border-radius: 8px;
}

.item-info {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.item-id {
  color: #969799;
  font-size: 12px;
}

.item-status {
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-owned { background: #e8f3ff; color: #1989fa; }
.status-pending { background: #fff7e8; color: #ff976a; }
.status-rejected { background: #fef0f0; color: #ee0a24; }
.status-available { background: #e8fff3; color: #07c160; }
.status-trading { background: #f0f9eb; color: #67c23a; }
.status-transferred { background: #f4f4f5; color: #909399; }
.status-destroyed { background: #666666; color: #ffffff; }

.action-buttons {
  display: flex;
  gap: 8px;
}

:deep(.van-button--small) {
  min-width: 64px;
}
</style> 
<template>
  <div class="stuff-detail">
    <van-nav-bar
      title="物品详情"
      left-arrow
      @click-left="onClickLeft"
      class="detail-nav"
    />
    
    <!-- 图片轮播 -->
    <van-swipe class="item-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in itemDetail.itemImageList" :key="index">
        <van-image :src="image" fit="cover" width="100%" height="100%" />
      </van-swipe-item>
    </van-swipe>

    <!-- 基本信息 -->
    <van-cell-group inset class="info-group">
      <div class="status-row">
        <div class="item-status" :class="itemDetail.status">
          {{ getItemStatusText(itemDetail.status) }}
        </div>
        <div class="item-id">物品编号: {{ itemDetail.id }}</div>
      </div>
      <div class="title">{{ itemDetail.itemTitle }}</div>
      <div class="tags">
        <van-tag round plain type="primary" size="medium">{{ itemDetail.itemType }}</van-tag>
        <van-tag round plain type="success" size="medium">{{ itemDetail.depreciation }}成新</van-tag>
        <van-tag round plain type="warning" size="medium">{{ itemDetail.deliveryMethod }}</van-tag>
      </div>
    </van-cell-group>

    <!-- 区块链信息 -->
    <van-cell-group inset class="blockchain-group">
      <div class="section-title">
        <van-icon name="shield-o" />
        <span>区块链信息</span>
      </div>
      <div class="blockchain-info">
        <van-cell title="区块链ID" :value="itemDetail.blockchainId" />
        <van-cell title="转让次数" :value="`${itemDetail.transferTimes}次`" />
        <van-cell title="最后持有人" :value="itemDetail.lastUserId" />
      </div>
    </van-cell-group>

    <!-- 物品描述 -->
    <van-cell-group inset class="desc-group">
      <div class="section-title">
        <van-icon name="description" />
        <span>物品描述</span>
      </div>
      <div class="description">{{ itemDetail.itemDescription }}</div>
    </van-cell-group>

    <!-- 交易设置 -->
    <van-cell-group inset class="trade-group" v-if="itemDetail.transferStatus === 'transferring'">
      <div class="section-title">
        <van-icon name="transaction" />
        <span>交易设置</span>
      </div>
      <div class="trade-info">
        <van-cell title="交易方式" :value="itemDetail.tradeMethod" />
        <template v-if="itemDetail.tradeMethod === '人民币'">
          <van-cell title="转让价格" :value="`¥${itemDetail.transferPrice}`" />
        </template>
        <template v-else-if="itemDetail.tradeMethod === '积分'">
          <van-cell title="所需积分" :value="`${itemDetail.transferPoints}积分`" />
        </template>
        <template v-else>
          <van-cell title="期望物品" :value="itemDetail.expectItem" />
        </template>
        <van-cell title="交付方式" :value="itemDetail.deliveryMethod" />
        <van-cell title="联系方式" :value="itemDetail.contactInfo" />
      </div>
    </van-cell-group>

    <!-- 互动数据 -->
    <van-cell-group inset class="stats-group">
      <div class="interaction-stats">
        <div class="stat-item">
          <van-icon name="eye-o" />
          <span>{{ itemDetail.viewCount }}</span>
        </div>
        <div class="stat-item">
          <van-icon name="like-o" />
          <span>{{ itemDetail.loveCount }}</span>
        </div>
        <div class="stat-item">
          <van-icon name="star-o" />
          <span>{{ itemDetail.collectionCount }}</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <template v-if="itemDetail.transferStatus === 'owned'">
        <van-button type="primary" block round @click="initiateTransfer">
          发起出让
        </van-button>
      </template>
      <template v-if="itemDetail.transferStatus === 'transferring'">
        <van-button type="primary" block round plain @click="cancelTransfer">
          取消出让
        </van-button>
        <van-button type="primary" block round @click="viewOffers">
          查看报价
        </van-button>
      </template>

      <template v-if="itemDetail.transferStatus === 'trading'">
        <van-button type="primary" block round @click="viewTradeDetails">
          查看交易详情
        </van-button>
      </template>
    </div>

    <!-- 在底部操作栏之前添加 -->
    <van-popup
      v-model:show="showTransferForm"
      position="bottom"
      round
      closeable
      :style="{ height: '70%' }"
    >
      <div class="transfer-popup">
        <div class="popup-title">发起出让</div>
        <van-form @submit="onTransferSubmit">
          <!-- 交付方式 -->
          <van-field
            v-model="transferForm.deliveryMethod"
            name="deliveryMethod"
            label="交付方式"
            placeholder="请选择交付方式"
            readonly
            is-link
            @click="showDeliveryPicker = true"
            :rules="[{ required: true, message: '请选择交付方式' }]"
          />

          <!-- 交易方式 -->
          <van-field
            v-model="transferForm.tradeMethod"
            name="tradeMethod"
            label="交易方式"
            placeholder="请选择交易方式"
            readonly
            is-link
            @click="showTradeMethodPicker = true"
            :rules="[{ required: true, message: '请选择交易方式' }]"
          />

          <!-- 根据交易方式显示不同的输入框 -->
          <template v-if="transferForm.tradeMethod === '人民币'">
            <van-field
              v-model="transferForm.transferPrice"
              name="transferPrice"
              label="转让价格"
              placeholder="请输入转让价格"
              type="number"
              :rules="[{ required: true, message: '请输入转让价格' }]"
            >
              <template #prefix>¥</template>
            </van-field>
          </template>

          <template v-if="transferForm.tradeMethod === '积分'">
            <van-field
              v-model="transferForm.transferPoints"
              name="transferPoints"
              label="所需积分"
              placeholder="请输入所需积分"
              type="number"
              :rules="[{ required: true, message: '请输入所需积分' }]"
            />
          </template>

          <template v-if="transferForm.tradeMethod === '以物换物'">
            <van-field
              v-model="transferForm.expectItem"
              name="expectItem"
              label="期望物品"
              type="textarea"
              rows="2"
              placeholder="请描述期望交换的物品"
              :rules="[{ required: true, message: '请描述期望交换的物品' }]"
            />
          </template>

          <!-- 联系方式 -->
          <van-field
            v-model="transferForm.contactInfo"
            name="contactInfo"
            label="联系方式"
            placeholder="请输入联系方式"
            :rules="[{ required: true, message: '请输入联系方式' }]"
          />

          <div class="submit-button">
            <van-button round block type="primary" native-type="submit">
              提交
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 交付方式选择器 -->
    <van-popup v-model:show="showDeliveryPicker" position="bottom">
      <van-picker
        :columns="deliveryColumns"
        @confirm="onDeliveryConfirm"
        @cancel="showDeliveryPicker = false"
        show-toolbar
        title="选择交付方式"
      />
    </van-popup>

    <!-- 交易方式选择器 -->
    <van-popup v-model:show="showTradeMethodPicker" position="bottom">
      <van-picker
        :columns="tradeMethodColumns"
        @confirm="onTradeMethodConfirm"
        @cancel="showTradeMethodPicker = false"
        show-toolbar
        title="选择交易方式"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showDialog, showToast } from 'vant'

export default defineComponent({
  setup() {
    const router = useRouter()
    
    // 模拟物品详情数据
    const itemDetail = ref({
      id: '2025032500010',
      status: 'active',
      transferStatus: 'owned', // owned, transfferring transferred
      itemTitle: 'iPhone 16',
      itemType: '电子产品',
      itemDescription: '刚买2个月 32G 9成新',
      firstImage: 'https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg',
      itemImageList: ['https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg'],
      depreciation: 9,
      transferTimes: 0,
      lastUserId: '20250324000002',
      blockchainId: 'Hash0030343jkjlkj',
      loveCount: 10,
      collectionCount: 10,
      viewCount: 10,
      tradeMethod: '人民币',
      transferPrice: 100.0000,
      transferPoints: null,
      expectItem: null,
      contactInfo: '13800001234',
      exchangeApplyCount: null,
      deliveryMethod: '同城自取'
    })

    const getStatusText = (status: string) => {
      const statusMap: Record<string, string> = {
        owned: '拥有',
        transferring: '转让中',
        transferred: '已转让'
      }
      return statusMap[status] || status
    }
    // 获取物品状态文本
    const getItemStatusText = (status: string) => {
      const statusMap: Record<string, string> = {
        active: '有效',
        auditing: '审核中',
        inactive: '无效'
      }
      return statusMap[status] || status
    }
    const onClickLeft = () => {
      router.back()
    }

    // 表单相关
    const showTransferForm = ref(false)
    const showDeliveryPicker = ref(false)
    const showTradeMethodPicker = ref(false)

    const transferForm = ref({
      deliveryMethod: '',
      tradeMethod: '',
      transferPrice: '',
      transferPoints: '',
      expectItem: '',
      contactInfo: ''
    })


    const deliveryColumns = [
      { text: '同城自取', value: '同城自取' },
      { text: '快递邮寄', value: '快递邮寄' }
    ]
    const tradeMethodColumns = [
      { text: '人民币', value: '人民币' },
      { text: '积分', value: '积分' },
      { text: '以物换物', value: '以物换物' }
    ]

    // 修改发起转让方法
    const initiateTransfer = () => {
      showTransferForm.value = true
    }

    const onDeliveryConfirm = ({ selectedOptions }: any) => {
      transferForm.value.deliveryMethod = selectedOptions[0].value
      showDeliveryPicker.value = false
    }

    const onTradeMethodConfirm = ({ selectedOptions }: any) => {
      transferForm.value.tradeMethod = selectedOptions[0].value
      showTradeMethodPicker.value = false
    }

    const onTransferSubmit = (values: any) => {
      console.log('提交的数据:', values)
      showDialog({
        title: '确认提交',
        message: '确定要发起出让申请吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('提交成功')
        showTransferForm.value = false
        router.push('/stuff/list')
      })
    }

    const cancelTransfer = () => {
      showDialog({
        title: '取消出让',
        message: '确定要取消出让申请吗？',
        showCancelButton: true,
      }).then(() => {
        showToast('已取消出让申请')
      })
    }

    const viewOffers = () => {
      router.push(`/stuff/offers/${itemDetail.value.id}`)
    }

    const viewTradeDetails = () => {
      router.push(`/stuff/trade/${itemDetail.value.id}`)
    }

    return {
      itemDetail,
      getStatusText,
      getItemStatusText,
      onClickLeft,
      initiateTransfer,
      cancelTransfer,
      viewOffers,
      viewTradeDetails,
      showTransferForm,
      showDeliveryPicker,
      showTradeMethodPicker,
      transferForm,
      deliveryColumns,
      tradeMethodColumns,
      onDeliveryConfirm,
      onTradeMethodConfirm,
      onTransferSubmit
    }
  }
})
</script>

<style scoped>
.stuff-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 100px;
}

.item-swipe {
  height: 300px;
}

.info-group {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f5f5f5;
}

.item-status {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 12px;
}

.item-status.owned { background: #e8f3ff; color: #1989fa; }
.item-status.transferring { background: #fff7e8; color: #ff976a; }
.item-status.rejected { background: #fef0f0; color: #ee0a24; }
.item-status.available { background: #e8fff3; color: #07c160; }
.item-status.trading { background: #f0f9eb; color: #67c23a; }
.item-status.transferred { background: #f4f4f5; color: #909399; }
.item-status.destroyed { background: #666666; color: #ffffff; }

.status-active { background: #1b983c; color: #ffffff; }
.status-auditing { background: #d7ea08; color: #ffffff; }
.status-inactive { background: #f0fef5b6; color: #ee0a24; }

.item-id {
  font-size: 13px;
  color: #969799;
}

/* 其他样式保持与ItemDetailView一致 */
.title {
  font-size: 18px;
  font-weight: bold;
  color: #323233;
  padding: 12px 16px;
}

.tags {
  display: flex;
  gap: 8px;
  padding: 0 16px 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  border-bottom: 1px solid #f5f5f5;
}

.interaction-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px;
  border-top: 1px solid #f5f5f5;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #969799;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #fff;
  display: flex;
  gap: 12px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
}

:deep(.van-button--primary) {
  background: linear-gradient(to right, #ff6034, #ee0a24);
  border: none;
}

:deep(.van-button--danger) {
  background: linear-gradient(to right, #ee0a24, #ff6034);
  border: none;
}

.transfer-popup {
  padding: 24px 16px;
}

.popup-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 20px;
}

.submit-button {
  margin: 24px 16px;
}

:deep(.van-field__label) {
  width: 6em !important;
}

:deep(.van-popup) {
  max-height: 90%;
  overflow-y: auto;
}
</style> 
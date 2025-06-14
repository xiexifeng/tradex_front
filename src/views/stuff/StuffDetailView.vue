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
          <template v-if="itemDetail.transferStatus === 'own'">
            {{ getItemStatusText(itemDetail.status) }}
          </template>
          <template v-else-if="itemDetail.transferStatus !== 'own'">
            {{ getStatusText(itemDetail.transferStatus) }}
          </template>
        </div>
        <div class="item-id">物品编号: {{ itemDetail.id }}</div>
      </div>
      <div class="title">{{ itemDetail.itemTitle }}</div>
      <div class="tags">
        <van-tag round plain type="primary" size="medium">{{ itemDetail.itemType }}</van-tag>
        <van-tag round plain type="success" size="medium">{{ itemDetail.depreciation }}成新</van-tag>
        <van-tag v-if="itemDetail.deliveryMethod" round plain type="warning" size="medium">{{ getValueText(itemDetail.deliveryMethod, 'deliveryMethod') }}</van-tag>
      </div>
    </van-cell-group>

    <!-- 区块链信息 -->
    <van-cell-group inset class="blockchain-group" v-if="itemDetail.blockchainId || itemDetail.transferTimes > 0 || itemDetail.lastUserId">
      <div class="section-title">
        <van-icon name="shield-o" />
        <span>区块链信息</span>
      </div>
      <div class="blockchain-info">
        <van-cell v-if="itemDetail.blockchainId" title="区块链ID" :value="itemDetail.blockchainId" />
        <van-cell v-if="itemDetail.transferTimes > 0" title="转让次数" :value="`${itemDetail.transferTimes}次`" />
        <van-cell v-if="itemDetail.lastUserId" title="最后持有人" :value="itemDetail.lastUserId" />
      </div>
    </van-cell-group>

    <!-- 物品描述 -->
    <van-cell-group inset class="desc-group" v-if="itemDetail.itemDescription">
      <div class="section-title">
        <van-icon name="description" />
        <span>物品描述</span>
      </div>
      <div class="description">{{ itemDetail.itemDescription }}</div>
    </van-cell-group>

    <!-- 交易设置 -->
    <van-cell-group inset class="trade-group" v-if="itemDetail.transferStatus === 'transferring' && itemDetail.tradeMethod">
      <div class="section-title">
        <van-icon name="transaction" />
        <span>交易设置</span>
      </div>
      <div class="trade-info">
        <van-cell title="交易方式" :value="getValueText(itemDetail.tradeMethod, 'tradeMethod')" />
        <template v-if="itemDetail.tradeMethod === 'ITEM_TO_MONEY' && itemDetail.transferPrice">
          <van-cell title="转让价格" :value="`¥${itemDetail.transferPrice}`" />
        </template>
        <template v-else-if="itemDetail.tradeMethod === 'ITEM_TO_POINTS' && itemDetail.transferPoints">
          <van-cell title="所需积分" :value="`${itemDetail.transferPoints}积分`" />
        </template>
        <template v-else-if="itemDetail.tradeMethod === 'ITEM_TO_ITEM' && itemDetail.expectItem">
          <van-cell title="期望物品" :value="itemDetail.expectItem" />
        </template>
        <van-cell v-if="itemDetail.deliveryMethod" title="交付方式" :value="getValueText(itemDetail.deliveryMethod, 'deliveryMethod')" />
        <van-cell v-if="itemDetail.contactInfo" title="联系方式" :value="itemDetail.contactInfo" />
      </div>
    </van-cell-group>

    <!-- 互动数据 -->
    <van-cell-group inset class="stats-group" v-if="itemDetail.viewCount > 0 || itemDetail.loveCount > 0 || itemDetail.collectionCount > 0">
      <div class="interaction-stats">
        <div class="stat-item" v-if="itemDetail.viewCount > 0">
          <van-icon name="eye-o" />
          <span>{{ itemDetail.viewCount }}</span>
        </div>
        <div class="stat-item" v-if="itemDetail.loveCount > 0">
          <van-icon name="like-o" />
          <span>{{ itemDetail.loveCount }}</span>
        </div>
        <div class="stat-item" v-if="itemDetail.collectionCount > 0">
          <van-icon name="star-o" />
          <span>{{ itemDetail.collectionCount }}</span>
        </div>
      </div>
    </van-cell-group>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <template v-if="itemDetail.transferStatus === 'own'">
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
            v-model="transferForm.deliveryMethodText"
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
            v-model="transferForm.tradeMethodText"
            name="tradeMethod"
            label="交易方式"
            placeholder="请选择交易方式"
            readonly
            is-link
            @click="showTradeMethodPicker = true"
            :rules="[{ required: true, message: '请选择交易方式' }]"
          />

          <!-- 根据交易方式显示不同的输入框 -->
          <template v-if="transferForm.tradeMethodText === '人民币'">
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

          <template v-if="transferForm.tradeMethodText === '积分'">
            <van-field
              v-model="transferForm.transferPoints"
              name="transferPoints"
              label="所需积分"
              placeholder="请输入所需积分"
              type="number"
              :rules="[{ required: true, message: '请输入所需积分' }]"
            />
          </template>

          <template v-if="transferForm.tradeMethodText === '以物换物'">
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
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showDialog, showToast } from 'vant'
import { getItemDetail, transferItem } from '@/api/stuff'
import type { ItemDetail } from '@/api/types'
import { getValueText, DELIVERY_COLUMNS, TRADE_METHOD_COLUMNS } from '@/constants/stuff'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const itemId = route.params.id as string
    
    // 物品详情数据
    const itemDetail = ref<ItemDetail>({
      id: '',
      userId: '',
      itemTitle: '',
      itemType: '',
      itemDescription: '',
      firstImage: '',
      itemImageList: [],
      depreciation: 0,
      status: '',
      transferStatus: '',
      transferTimes: 0,
      lastUserId: '',
      blockchainId: '',
      loveCount: 0,
      collectionCount: 0,
      viewCount: 0,
      tradeMethod: '',
      transferPrice: 0,
      transferPoints: 0,
      expectItem: '',
      contactInfo: '',
      deliveryMethod: ''
    })

    // 获取物品详情
    const fetchItemDetail = async () => {
      try {
        const res = await getItemDetail(itemId)
        if (res.success) {
          itemDetail.value = res.data
        } else {
          showToast(res.desc || '获取物品详情失败')
        }
      } catch (error) {
        console.error('获取物品详情失败:', error)
        showToast('获取物品详情失败')
      }
    }

    const getStatusText = (status: string) => {
      return getValueText(status, 'status')
    }

    const getItemStatusText = (status: string) => {
      return getValueText(status, 'itemStatus')
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
      deliveryMethodText: '',
      tradeMethod: '',
      tradeMethodText: '',
      transferPrice: '',
      transferPoints: '',
      expectItem: '',
      contactInfo: ''
    })

    // 使用导入的常量
    const deliveryColumns = DELIVERY_COLUMNS
    const tradeMethodColumns = TRADE_METHOD_COLUMNS

    // 修改发起转让方法
    const initiateTransfer = () => {
      showTransferForm.value = true
    }

    const onDeliveryConfirm = ({ selectedOptions }: any) => {
      transferForm.value.deliveryMethod = selectedOptions[0].value
      transferForm.value.deliveryMethodText = selectedOptions[0].text
      showDeliveryPicker.value = false
    }

    const onTradeMethodConfirm = ({ selectedOptions }: any) => {
      transferForm.value.tradeMethod = selectedOptions[0].value
      transferForm.value.tradeMethodText = selectedOptions[0].text
      showTradeMethodPicker.value = false
    }

    const onTransferSubmit = async (values: any) => {
      try {
        await showDialog({
          title: '确认提交',
          message: '确定要发起出让申请吗？',
          showCancelButton: true,
        })
        
        // 构建请求参数
        const params = {
          itemId: itemDetail.value.id,
          tradeMethod: transferForm.value.tradeMethod,
          transferPrice: transferForm.value.tradeMethod === 'ITEM_TO_MONEY' ? Number(values.transferPrice) : 0,
          transferPoints: transferForm.value.tradeMethod === 'ITEM_TO_POINTS' ? Number(values.transferPoints) : 0,
          expectItem: transferForm.value.tradeMethod === 'ITEM_TO_ITEM' ? values.expectItem : '',
          contactInfo: values.contactInfo,
          deliveryMethod: transferForm.value.deliveryMethod
        }

        const res = await transferItem(params)
        if (res.success) {
          showToast('提交成功')
          showTransferForm.value = false
          await fetchItemDetail() // 刷新物品详情
        } else {
          showToast(res.desc || '提交失败')
        }
      } catch (error) {
        console.error('提交失败:', error)
        showToast('提交失败')
      }
    }

    const cancelTransfer = async () => {
      try {
        await showDialog({
          title: '取消出让',
          message: '确定要取消出让申请吗？',
          showCancelButton: true,
        })
        
        // TODO: 调用取消出让接口
        showToast('已取消出让申请')
        await fetchItemDetail() // 刷新物品详情
      } catch (error) {
        console.error('取消出让失败:', error)
      }
    }

    const viewOffers = () => {
      router.push(`/stuff/offers/${itemDetail.value.id}`)
    }

    const viewTradeDetails = () => {
      router.push(`/stuff/trade/${itemDetail.value.id}`)
    }

    onMounted(() => {
      fetchItemDetail()
    })

    return {
      itemDetail,
      getValueText,
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

<style lang="scss" scoped>
.stuff-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 100px;
}

.detail-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #39a0ff);
  }
  
  :deep(.van-nav-bar__title) {
    color: #fff;
  }
  
  :deep(.van-icon) {
    color: #fff;
  }
  
  :deep(.van-nav-bar__text) {
    color: #fff;
  }
}

.item-swipe {
  height: 300px;
  background: #fff;
  
  :deep(.van-swipe__indicator) {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.6);
  }
  
  :deep(.van-swipe__indicator--active) {
    width: 12px;
    background: #fff;
    border-radius: 3px;
  }
}

.info-group {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .status-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #f5f5f5;
  }
  
  .item-status {
    font-size: 13px;
    padding: 4px 12px;
    border-radius: 12px;
    font-weight: 500;
    
    &.active { background: #e8fff3; color: #07c160; }
    &.auditing { background: #fff7e8; color: #ff976a; }
    &.inactive { background: #fef0f0; color: #ee0a24; }
  }
  
  .item-id {
    font-size: 13px;
    color: #969799;
  }
  
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #323233;
    padding: 16px;
    line-height: 1.4;
  }
  
  .tags {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
    flex-wrap: wrap;
    
    .van-tag {
      padding: 4px 8px;
      font-size: 12px;
    }
  }
}

.blockchain-group,
.desc-group,
.trade-group {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    border-bottom: 1px solid #f5f5f5;
    
    .van-icon {
      color: #1989fa;
    }
  }
  
  .blockchain-info,
  .trade-info {
    :deep(.van-cell) {
      padding: 16px;
    }
    
    :deep(.van-cell::after) {
      display: none;
    }
    
    :deep(.van-cell__title) {
      color: #969799;
      font-size: 14px;
      width: 100px;
      flex: none;
    }
    
    :deep(.van-cell__value) {
      color: #323233;
      font-size: 14px;
      text-align: left;
    }
    
    :deep(.van-cell__value--alone) {
      color: #323233;
    }
  }
  
  .description {
    padding: 16px;
    font-size: 14px;
    color: #666;
    line-height: 1.6;
  }
}

.stats-group {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .interaction-stats {
    display: flex;
    justify-content: space-around;
    padding: 16px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #969799;
      font-size: 14px;
      
      .van-icon {
        font-size: 16px;
      }
    }
  }
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
  
  .van-button {
    flex: 1;
    height: 40px;
    font-size: 15px;
    font-weight: 500;
    
    &--primary {
      background: linear-gradient(to right, #1989fa, #39a0ff);
      border: none;
      
      &.van-button--plain {
        background: #fff;
        border: 1px solid #1989fa;
        color: #1989fa;
      }
    }
  }
}

// 弹出层样式
.transfer-popup {
  padding: 24px 16px;
  
  .popup-title {
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #323233;
    margin-bottom: 24px;
  }
  
  :deep(.van-field) {
    padding: 16px 0;
  }
  
  :deep(.van-field__label) {
    width: 90px;
    color: #323233;
  }
  
  .submit-button {
    margin-top: 24px;
    
    .van-button {
      height: 44px;
      font-size: 16px;
      font-weight: 500;
      background: linear-gradient(to right, #1989fa, #39a0ff);
      border: none;
    }
  }
}
</style> 
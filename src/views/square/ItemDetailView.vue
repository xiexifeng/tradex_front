<template>
  <div class="page-container">
    <!-- 顶部区域（导航栏+轮播）整合为一个视觉区块 -->
    <div class="header-section">
      <van-nav-bar
        title="物品详情"
        left-arrow
        @click-left="onClickLeft"
        class="detail-nav"
      >
        <template #right>
          <van-icon name="share-o" size="20" class="nav-icon" @click="share"/>
        </template>
      </van-nav-bar>

      <div class="swipe-container">
        <van-swipe class="item-swipe" :autoplay="3000">
          <van-swipe-item v-for="(image, index) in itemDetail.itemImageList" :key="index">
            <van-image :src="image" fit="cover" width="100%" height="100%" />
          </van-swipe-item>
          <template #indicator="{ active, total }">
            <div class="custom-indicator">
              <van-icon name="photograph" class="indicator-icon" />
              <span>{{ active + 1 }}/{{ total }}</span>
            </div>
          </template>
        </van-swipe>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="content-section">
      <!-- 价格和交易方式突出显示 -->
      <div class="price-card">
        <div class="price-main">
          <template v-if="itemDetail.tradeMethod === TRADE_METHOD_MAP.ITEM_TO_MONEY">
            <span class="currency">¥</span>
            <span class="amount">{{ itemDetail.transferPrice }}</span>
          </template>
          <template v-else-if="itemDetail.tradeMethod === TRADE_METHOD_MAP.ITEM_TO_POINTS">
            <span class="amount">{{ itemDetail.transferPoints }}</span>
            <span class="unit">积分</span>
          </template>
          <template v-else>
            <div class="exchange-info">
              <span class="exchange-label">期望交换</span>
              <span class="exchange-target">{{ itemDetail.expectItem }}</span>
            </div>
          </template>
        </div>
        <van-tag 
          round 
          :type="getTradeMethodType(itemDetail.tradeMethod)" 
          size="medium"
          class="trade-method-tag"
        >
          {{ getValueText(itemDetail.tradeMethod, 'tradeMethod') }}
        </van-tag>
      </div>

      <!-- 商品基本信息卡片 -->
      <div class="info-card">
        <h1 class="title">{{ itemDetail.itemTitle }}</h1>
        <div class="blockchain-info">
          <van-icon name="certificate" />
          <span class="blockchain-label">区块链ID：</span>
          <span class="blockchain-value">{{ itemDetail.blockchainId }}</span>
        </div>
        <div class="tags-row">
          <van-tag round plain type="primary" size="medium">{{ itemDetail.itemType }}</van-tag>
          <van-tag round plain type="success" size="medium">{{ itemDetail.depreciation }}成新</van-tag>
          <van-tag round plain type="warning" size="medium">{{ getValueText(itemDetail.deliveryMethod, 'deliveryMethod') }}</van-tag>
        </div>
        <div class="item-stats">
          <div class="stat-box">
            <van-icon name="eye-o" />
            <span class="stat-value">{{ itemDetail.viewCount }}</span>
            <span class="stat-label">浏览</span>
          </div>
          <div class="stat-box">
            <van-icon name="like-o" />
            <span class="stat-value">{{ itemDetail.loveCount }}</span>
            <span class="stat-label">点赞</span>
          </div>
          <div class="stat-box">
            <van-icon name="star-o" />
            <span class="stat-value">{{ itemDetail.collectionCount }}</span>
            <span class="stat-label">收藏</span>
          </div>
          <div class="stat-box">
            <van-icon name="exchange" />
            <span class="stat-value">{{ itemDetail.transferTimes }}</span>
            <span class="stat-label">转让</span>
          </div>
        </div>
      </div>

      <!-- 卖家信息卡片改版 -->
      <div class="seller-card">
        <div class="seller-main">
          <div class="seller-avatar">
            <van-image
              round
              width="60"
              height="60"
              :src="itemDetail.userAvatar"
            />
            <div class="seller-badge">
              <van-icon name="shield-o" />
            </div>
          </div>
          <div class="seller-info">
            <div class="seller-name-row">
              <span class="seller-name">{{ itemDetail.userNickname }}</span>
              <van-tag type="primary" size="small" plain>认证用户</van-tag>
            </div>
            <div class="seller-score">
              <van-rate v-model="itemDetail.userExt.tradeScore" size="12" color="#ffd21e" void-icon="star" void-color="#eee" readonly allow-half />
              <span class="score-text">{{ itemDetail.userExt.tradeScore }}分</span>
            </div>
            <div class="blockchain-id">
              <van-icon name="certificate" />
              <span>区块链ID: {{ itemDetail.userExt.blockchainId }}</span>
            </div>
          </div>
        </div>
        <van-button 
          round 
          type="primary" 
          plain 
          icon="chat-o" 
          class="contact-button"
          @click="contactSeller"
        >
          联系卖家
        </van-button>
      </div>

      <!-- 商品描述卡片 -->
      <div class="desc-card">
        <div class="section-title">
          <van-icon name="description" />
          <span>商品描述</span>
        </div>
        <div class="description-content">
          {{ itemDetail.itemDescription }}
        </div>
      </div>

      <!-- 交易信息卡片 -->
      <div class="trade-card">
        <div class="section-title">
          <van-icon name="transaction" />
          <span>交易信息</span>
        </div>
        <div class="trade-grid">
          <div class="trade-item">
            <span class="item-label">联系人</span>
            <span class="item-value">{{ itemDetail.contactInfo.linkman }}</span>
          </div>
          <div class="trade-item">
            <span class="item-label">联系电话</span>
            <span class="item-value">{{ itemDetail.contactInfo.phone }}</span>
          </div>
          <div class="trade-item">
            <span class="item-label">交付方式</span>
            <span class="item-value">{{ getValueText(itemDetail.deliveryMethod, 'deliveryMethod') }}</span>
          </div>
          <div class="trade-item">
            <span class="item-label">交付地址</span>
            <span class="item-value">{{ itemDetail.contactInfo.address }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏改版 -->
    <div class="bottom-bar">
      <div class="action-group">
        <div class="action-item" @click="toggleLike">
          <div class="action-icon" :class="{ active: isLiked }">
            <van-icon :name="isLiked ? 'like' : 'like-o'" />
          </div>
          <span>{{ isLiked ? '已点赞' : '点赞' }}</span>
        </div>
        <div class="action-item" @click="toggleCollect">
          <div class="action-icon" :class="{ active: isCollected }">
            <van-icon :name="isCollected ? 'star' : 'star-o'" />
          </div>
          <span>{{ isCollected ? '已收藏' : '收藏' }}</span>
        </div>
      </div>
      <div class="button-group">
        <van-button 
          type="primary" 
          round 
          block 
          :loading="isSubmitting"
          @click="itemDetail.tradeMethod === 'ITEM_TO_ITEM' ? exchange() : buy()"
        >
          <template #icon>
            <van-icon :name="itemDetail.tradeMethod === 'ITEM_TO_ITEM' ? 'exchange' : 'cash-back-record'" />
          </template>
          {{ itemDetail.tradeMethod === 'ITEM_TO_ITEM' ? '发起交换' : '立即购买' }}
        </van-button>
      </div>
    </div>

    <!-- 交换表单弹出层 -->
    <van-popup
      v-model:show="showExchangeForm"
      position="bottom"
      round
      closeable
      :style="{ height: '70%' }"
    >
      <div class="exchange-popup">
        <div class="popup-title">发起交换</div>
        <van-form @submit="onExchangeSubmit">
          <van-cell-group inset>
            <van-field
              v-model="exchangeForm.linkman"
              name="linkman"
              label="联系人"
              placeholder="请输入联系人姓名"
              :rules="[{ required: true, message: '请填写联系人' }]"
            />
            <van-field
              v-model="exchangeForm.phone"
              name="phone"
              label="联系电话"
              placeholder="请输入联系电话"
              :rules="[{ required: true, message: '请填写联系电话' }]"
            />
            <van-field
              v-model="exchangeForm.itemType"
              name="itemType"
              label="物品类型"
              placeholder="请选择物品类型"
              readonly
              is-link
              @click="showItemTypePopup = true"
              :rules="[{ required: true, message: '请选择物品类型' }]"
            />
            <van-field
              v-model="selectedItemTitle"
              name="exchangeItem"
              label="交换物品"
              placeholder="请选择要交换的物品"
              readonly
              is-link
              @click="showItemListPopup = true"
              :rules="[{ required: true, message: '请选择交换物品' }]"
            />
            <van-field
              v-model="exchangeForm.remark"
              name="remark"
              label="备注"
              type="textarea"
              rows="2"
              autosize
              placeholder="请输入备注信息（选填）"
            />
          </van-cell-group>
          <div class="submit-button">
            <van-button round block type="primary" native-type="submit">
              提交申请
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <!-- 物品类型选择弹出层 -->
    <van-popup v-model:show="showItemTypePopup" position="bottom" round>
      <van-picker
        :columns="itemTypeColumns"
        @confirm="onItemTypeConfirm"
        @cancel="showItemTypePopup = false"
        show-toolbar
        title="选择物品类型"
      />
    </van-popup>

    <!-- 交换物品选择弹出层 -->
    <van-popup v-model:show="showItemListPopup" position="bottom" round>
      <van-picker
        :columns="myItemColumns"
        @confirm="onItemConfirm"
        @cancel="showItemListPopup = false"
        show-toolbar
        title="选择交换物品"
      />
    </van-popup>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import { getSquareItemDetail } from '@/api/stuff'
import { TRADE_METHOD_MAP, DELIVERY_METHOD_MAP, getValueText } from '@/constants/stuff'
import type { SquareItemDetail } from '@/api/types'

type ExchangeForm = {
  targetItemId: string,
  linkman: string,
  phone: string,
  itemId: string,
  itemTitle: string,
  itemType: string,
  remark: string
}  

export default defineComponent({
  name: 'ItemDetailView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isLiked = ref(false)
    const isCollected = ref(false)
    const loading = ref(false)

    const itemDetail = ref<SquareItemDetail>({
      id: '0',
      userId: '0',
      userAvatar: '',
      userNickname: '',
      itemTitle: '',
      itemType: '',
      itemDescription: '',
      firstImage: '',
      itemImageList: [],
      depreciation: 0,
      transferTimes: 0,
      lastUserId: '0',
      blockchainId: '',
      loveCount: 0,
      collectionCount: 0,
      viewCount: 0,
      tradeMethod: '',
      transferPrice: 0,
      transferPoints: 0,
      expectItem: '',
      publishTime: 0,
      userExt: {
        blockchainId: '',
        tradeScore: 0
      },
      contactInfo: {
        linkman: '',
        phone: '',
        address: ''
      },
      exchangeApplyCount: 0,
      deliveryMethod: '',
      isLiked: false,
      isCollected: false
    })

    onMounted(async () => {
      const itemId = route.params.id as string
      if (!itemId) {
        showToast('物品ID不存在')
        router.back()
        return
      }

      loading.value = true
      try {
        const res = await getSquareItemDetail(itemId)
        if (res.success) {
          itemDetail.value = res.data
          isLiked.value = itemDetail.value.isLiked
          isCollected.value = itemDetail.value.isCollected
        } else {
          showToast(res.desc || '获取物品详情失败')
        }
      } catch (error) {
        console.error('获取物品详情失败:', error)
        showToast('获取物品详情失败')
      } finally {
        loading.value = false
      }
    })

    const onClickLeft = () => {
      router.back()
    }

    const toggleLike = () => {
      isLiked.value = !isLiked.value
      showToast(isLiked.value ? '已点赞' : '已取消点赞')
    }

    const toggleCollect = () => {
      isCollected.value = !isCollected.value
      showToast(isCollected.value ? '已收藏' : '已取消收藏')
    }

    const share = () => {
      showToast('分享功能开发中')
    }

    const contactSeller = () => {
      showToast(`联系方式：${itemDetail.value.contactInfo.phone}`)
    }

    const buy = () => {
      if (itemDetail.value.tradeMethod === 'ITEM_TO_MONEY') {
        router.push(`/stuff/transfer/${itemDetail.value.id}`)
      } else if (itemDetail.value.tradeMethod === 'ITEM_TO_POINTS') {
        router.push(`/stuff/transfer/${itemDetail.value.id}`)
      } else {
        router.push(`/stuff/exchange/${itemDetail.value.id}`)
      }
    }

    // 交换表单相关
    const showExchangeForm = ref(false)
    const showItemTypePopup = ref(false)
    const showItemListPopup = ref(false)
    const selectedItemTitle = ref('')

    const exchangeForm = ref<ExchangeForm>({
      targetItemId: '0',
      linkman: '',
      phone: '',
      itemId: '0',
      itemTitle: '',
      itemType: '',
      remark: ''
    })

    // 物品类型选项
    const itemTypeColumns = [
      {text: '电子产品', value: '电子产品'},
      {text: '服装配饰', value: '服装配饰'},
      {text: '图书音像', value: '图书音像'},
      {text: '运动器材', value: '运动器材'},
      {text: '家居用品', value: '家居用品'},
      {text: '其他', value: '其他'}
    ]

    // 模拟我的物品列表
    const myItemColumns = [
      { text: 'iPhone 16', value: '2025032500011' },
      { text: 'iPad Pro', value: '2025032500012' },
      { text: 'MacBook Air', value: '2025032500013' }
    ]

    // 打开交换表单
    const exchange = () => {
      showExchangeForm.value = true
      exchangeForm.value.targetItemId = itemDetail.value.id
    }

    // 选择物品类型
    const onItemTypeConfirm = ({ selectedOptions }: any) => {
      exchangeForm.value.itemType = selectedOptions[0].value
      showItemTypePopup.value = false
    }

    // 选择交换物品
    const onItemConfirm = ({ selectedOptions }: any) => {
      const selected = selectedOptions[0]
      exchangeForm.value.itemId = selected.value
      exchangeForm.value.itemTitle = selected.text
      selectedItemTitle.value = selected.text
      showItemListPopup.value = false
    }

    // 提交交换申请
    const onExchangeSubmit = (values: any) => {
      console.log('交换申请表单：', exchangeForm.value)
      showToast('申请已提交')
      showExchangeForm.value = false
    }

    // 添加交易方式类型判断方法
    const getTradeMethodType = (method: string) => {
      switch (method) {
        case 'ITEM_TO_MONEY': return 'danger'
        case 'ITEM_TO_POINTS': return 'warning'
        case 'ITEM_TO_ITEM': return 'primary'
        default: return 'default'
      }
    }

    return {
      itemDetail,
      isLiked,
      isCollected,
      onClickLeft,
      toggleLike,
      toggleCollect,
      share,
      contactSeller,
      buy,
      exchange,
      showExchangeForm,
      showItemTypePopup,
      showItemListPopup,
      exchangeForm,
      selectedItemTitle,
      itemTypeColumns,
      myItemColumns,
      onItemTypeConfirm,
      onItemConfirm,
      onExchangeSubmit,
      getTradeMethodType,
      isSubmitting: ref(false),
      TRADE_METHOD_MAP,
      getValueText
    }
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 60px;
}

.header-section {
  position: relative;
  height: 420px;
  background: #000;
  
  .detail-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    
    :deep(.van-nav-bar__content) {
      background: linear-gradient(to right, #1989fa, #39a0ff);
      
      .van-nav-bar__title,
      .van-icon {
        color: #fff;
      }
    }
  }

  .swipe-container {
    height: 100%;
    
    .item-swipe {
      height: 100%;
      
      :deep(.van-image) {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    .custom-indicator {
      position: absolute;
      right: 16px;
      bottom: 16px;
      padding: 6px 12px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 16px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 4px;
      
      .indicator-icon {
        font-size: 16px;
      }
    }
  }
}

.content-section {
  margin-top: -20px;
  position: relative;
  z-index: 1;
  border-radius: 20px 20px 0 0;
  background: #f8f9fa;
  padding: 16px;
}

.price-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .price-main {
    display: flex;
    align-items: baseline;
    
    .currency {
      font-size: 20px;
      color: #ee0a24;
      margin-right: 2px;
    }
    
    .amount {
      font-size: 32px;
      font-weight: bold;
      color: #ee0a24;
    }
    
    .unit {
      font-size: 16px;
      color: #ee0a24;
      margin-left: 4px;
    }
    
    .exchange-info {
      .exchange-label {
        font-size: 14px;
        color: #969799;
        margin-right: 8px;
      }
      
      .exchange-target {
        font-size: 20px;
        font-weight: bold;
        color: #1989fa;
      }
    }
  }
  
  .trade-method-tag {
    font-size: 14px;
    padding: 6px 16px;
  }
}

.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .title {
    font-size: 20px;
    font-weight: bold;
    color: #323233;
    margin: 0 0 12px;
    line-height: 1.4;
  }
  
  .blockchain-info {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 8px;
    
    .van-icon {
      font-size: 16px;
      color: #1989fa;
    }
    
    .blockchain-label {
      font-size: 14px;
      color: #969799;
    }
    
    .blockchain-value {
      font-size: 14px;
      color: #1989fa;
      flex: 1;
      word-break: break-all;
    }
  }
  
  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }
  
  .item-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #f5f5f5;
    
    .stat-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      
      .van-icon {
        font-size: 20px;
        color: #1989fa;
      }
      
      .stat-value {
        font-size: 16px;
        font-weight: bold;
        color: #323233;
      }
      
      .stat-label {
        font-size: 12px;
        color: #969799;
      }
    }
  }
}

.seller-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .seller-main {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    
    .seller-avatar {
      position: relative;
      
      .seller-badge {
        position: absolute;
        right: -4px;
        bottom: -4px;
        width: 20px;
        height: 20px;
        background: #1989fa;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .van-icon {
          color: #fff;
          font-size: 12px;
        }
      }
    }
    
    .seller-info {
      flex: 1;
      
      .seller-name-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        
        .seller-name {
          font-size: 18px;
          font-weight: bold;
          color: #323233;
        }
      }
      
      .seller-score {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        
        .score-text {
          font-size: 14px;
          color: #ffd21e;
        }
      }
      
      .blockchain-id {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #969799;
        
        .van-icon {
          color: #1989fa;
        }
      }
    }
  }
  
  .contact-button {
    width: 100%;
    height: 40px;
  }
}

.desc-card,
.trade-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    
    .van-icon {
      color: #1989fa;
    }
  }
  
  .description-content {
    color: #666;
    line-height: 1.6;
    font-size: 14px;
  }
  
  .trade-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    
    .trade-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      &.full-width {
        grid-column: 1 / -1;
      }
      
      .item-label {
        font-size: 13px;
        color: #969799;
      }
      
      .item-value {
        font-size: 14px;
        color: #323233;
        
        &.blockchain {
          color: #1989fa;
          word-break: break-all;
        }
      }
    }
  }
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  
  .action-group {
    display: flex;
    gap: 24px;
  }
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    
    .action-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f7f8fa;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      
      .van-icon {
        font-size: 24px;
        color: #666;
      }
      
      &.active {
        background: #fee;
        
        .van-icon {
          color: #ee0a24;
        }
      }
    }
    
    span {
      font-size: 12px;
      color: #666;
    }
  }
  
  .button-group {
    flex: 1;
    
    :deep(.van-button--primary) {
      background: linear-gradient(to right, #ff6034, #ee0a24);
      border: none;
      height: 44px;
      
      .van-icon {
        font-size: 18px;
        margin-right: 4px;
      }
    }
  }
}
</style> 
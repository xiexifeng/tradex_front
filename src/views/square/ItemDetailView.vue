<template>
  <div class="item-detail">
    <van-nav-bar
      title="物品详情"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <!-- 图片轮播 -->
    <van-swipe class="item-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(image, index) in itemDetail.itemImageList" :key="index">
        <van-image :src="image" fit="cover" width="100%" height="100%" />
      </van-swipe-item>
    </van-swipe>

    <!-- 基本信息 -->
    <van-cell-group inset class="info-group">
      <div class="price-row">
        <template v-if="itemDetail.tradeMethod === '人民币'">
          <span class="price">¥{{ itemDetail.transferPrice }}</span>
        </template>
        <template v-else-if="itemDetail.tradeMethod === '积分'">
          <span class="price">{{ itemDetail.transferPoints }}积分</span>
        </template>
        <template v-else>
          <span class="price">期望物品：{{ itemDetail.expectItem }}</span>
        </template>
        <van-tag type="warning">{{ itemDetail.tradeMethod }}</van-tag>
      </div>
      <div class="title">{{ itemDetail.itemTitle }}</div>
      <div class="tags">
        <van-tag plain type="primary" class="tag">{{ itemDetail.itemType }}</van-tag>
        <van-tag plain type="success" class="tag">{{ itemDetail.depreciation }}成新</van-tag>
        <van-tag plain type="warning" class="tag">{{ itemDetail.deliveryMethod }}</van-tag>
      </div>
    </van-cell-group>

    <!-- 物品描述 -->
    <van-cell-group inset class="desc-group">
      <van-cell title="物品描述" :border="false" />
      <div class="description">{{ itemDetail.itemDescription }}</div>
    </van-cell-group>

    <!-- 交易信息 -->
    <van-cell-group inset class="trade-group">
      <van-cell title="交易信息">
        <template #value>
          <div class="trade-stats">
            <span><van-icon name="eye-o" /> {{ itemDetail.viewCount }}</span>
            <span><van-icon name="like-o" /> {{ itemDetail.loveCount }}</span>
            <span><van-icon name="star-o" /> {{ itemDetail.collectionCount }}</span>
          </div>
        </template>
      </van-cell>
      <van-cell title="区块链ID" :value="itemDetail.blockchainId" />
      <van-cell title="转让次数" :value="itemDetail.transferTimes + '次'" />
    </van-cell-group>

    <!-- 卖家信息 -->
    <van-cell-group inset class="seller-group">
      <van-cell center>
        <template #title>
          <div class="seller-info">
            <van-image
              round
              width="40"
              height="40"
              :src="itemDetail.avatarUrl"
            />
            <div class="seller-name">{{ itemDetail.nickname }}</div>
          </div>
        </template>
        <template #right-icon>
          <van-button size="small" type="primary" plain @click="contactSeller">
            联系卖家
          </van-button>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <div class="action-icons">
        <div class="action-item" @click="toggleLike">
          <van-icon :name="isLiked ? 'like' : 'like-o'" :class="{ active: isLiked }" />
          <span>点赞</span>
        </div>
        <div class="action-item" @click="toggleCollect">
          <van-icon :name="isCollected ? 'star' : 'star-o'" :class="{ active: isCollected }" />
          <span>收藏</span>
        </div>
        <div class="action-item" @click="share">
          <van-icon name="share-o" />
          <span>分享</span>
        </div>
      </div>
      <div class="button-group">
        <van-button 
          v-if="itemDetail.tradeMethod !== '以物换物'"
          type="primary" 
          block 
          @click="buy"
        >
          立即购买
        </van-button>
        <van-button 
          v-else
          type="primary" 
          block 
          @click="exchange"
        >
          发起交换
        </van-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'

export default defineComponent({
  name: 'ItemDetailView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const isLiked = ref(false)
    const isCollected = ref(false)

    const itemDetail = ref({
      id: '',
      userId: '',
      nickname: '',
      avatarUrl: '',
      itemTitle: '',
      itemType: '',
      itemDescription: '',
      firstImage: '',
      itemImageList: [],
      depreciation: 0,
      transferTimes: 0,
      lastUserId: '',
      blockchainId: '',
      loveCount: 0,
      collectionCount: 0,
      viewCount: 0,
      tradeMethod: '',
      transferPrice: 0,
      transferPoints: null,
      expectItem: null,
      contactInfo: '',
      exchangeApplyCount: null,
      deliveryMethod: ''
    })

    onMounted(async () => {
      // 这里应该调用API获取物品详情
      // 模拟API调用
      itemDetail.value = {
        id: "2025032500010",
        userId: "20250324000002",
        nickname: "NPE",
        avatarUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        itemTitle: "iphone 16",
        itemType: "电子产品",
        itemDescription: "刚买2个月 32G 9成新",
        firstImage: "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
        itemImageList: ["https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"],
        depreciation: 9,
        transferTimes: 0,
        lastUserId: "20250324000002",
        blockchainId: "Hash0030343jkjlkj",
        loveCount: 10,
        collectionCount: 10,
        viewCount: 10,
        tradeMethod: "人民币",
        transferPrice: 100.0000,
        transferPoints: null,
        expectItem: null,
        contactInfo: "13800001234",
        exchangeApplyCount: null,
        deliveryMethod: "同城自取"
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
      showToast(`联系方式：${itemDetail.value.contactInfo}`)
    }

    const buy = () => {
      if (itemDetail.value.tradeMethod === '人民币') {
        router.push(`/stuff/transfer/${itemDetail.value.id}`)
      } else {
        router.push(`/stuff/exchange/${itemDetail.value.id}`)
      }
    }

    const exchange = () => {
      router.push(`/stuff/exchange/${itemDetail.value.id}`)
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
      exchange
    }
  }
})
</script>

<style scoped>
.item-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 50px;
}

.item-swipe {
  height: 300px;
}

.info-group {
  margin: 12px;
  padding: 12px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #ee0a24;
}

.title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  gap: 8px;
}

.desc-group,
.trade-group,
.seller-group {
  margin: 12px;
}

.description {
  padding: 0 16px 16px;
  color: #666;
  line-height: 1.5;
}

.trade-stats {
  display: flex;
  gap: 16px;
  color: #999;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-name {
  font-size: 14px;
  color: #323233;
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
  justify-content: space-between;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
}

.action-icons {
  display: flex;
  gap: 24px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #666;
}

.action-item span {
  font-size: 12px;
}

.van-icon {
  font-size: 20px;
}

.van-icon.active {
  color: #ee0a24;
}

.button-group {
  flex: 1;
  margin-left: 16px;
}
</style> 
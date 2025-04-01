<template>
  <div class="item-detail">
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
        <van-tag round type="warning" size="medium">{{ itemDetail.tradeMethod }}</van-tag>
      </div>
      <div class="title">{{ itemDetail.itemTitle }}</div>
      <div class="tags">
        <van-tag round plain type="primary" size="medium">{{ itemDetail.itemType }}</van-tag>
        <van-tag round plain type="success" size="medium">{{ itemDetail.depreciation }}成新</van-tag>
        <van-tag round plain type="warning" size="medium">{{ itemDetail.deliveryMethod }}</van-tag>
      </div>
    </van-cell-group>

     <!-- 卖家信息 -->
     <van-cell-group inset class="seller-group">
      <div class="seller-card">
        <div class="seller-info">
          <van-image
            round
            width="50"
            height="50"
            :src="itemDetail.avatarUrl"
          />
          <div class="seller-details">
            <div class="seller-name">{{ itemDetail.nickname }}</div>
            <div class="seller-score">
              <van-rate v-model="itemDetail.userDetail.tradeScore" size="12" color="#ffd21e" void-icon="star" void-color="#eee" readonly allow-half />
              <span>{{ itemDetail.userDetail.tradeScore }}分</span>
            </div>
          </div>
        </div>
        <div class="seller-blockchain">
          <van-icon name="shield-o" />
          <span class="blockchain-id">区块链ID: {{ itemDetail.userDetail.blockchainId }}</span>
        </div>
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

    <!-- 交易信息 -->
    <van-cell-group inset class="trade-group">
      <div class="section-title">
        <van-icon name="transaction" />
        <span>交易信息</span>
      </div>
      <div class="trade-info">
        <van-cell title="联系人" :value="itemDetail.contactInfo.linkman" />
        <van-cell title="联系电话" :value="itemDetail.contactInfo.phone" />
        <van-cell title="交付方式" :value="itemDetail.deliveryMethod" />
        <van-cell title="交付地址" :value="itemDetail.contactInfo.address" />
        <van-cell title="物品区块链ID" :value="itemDetail.blockchainId" />
        <van-cell title="物品转让次数" :value="itemDetail.transferTimes + '次'" />
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
      </div>
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
          round
          block 
          @click="buy"
        >
          立即购买
        </van-button>
        <van-button 
          v-else
          type="primary" 
          round
          block 
          @click="exchange"
        >
          发起交换
        </van-button>
      </div>
    </div>

    <!-- 交换申请弹出层 -->
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
type ItemDetail = {
      id: string,
      userId: string,
      nickname: string,
      avatarUrl: string,
      itemTitle: string,
      itemType: string,
      itemDescription: string,
      firstImage: string,
      itemImageList: string[],
      depreciation: number,
      transferTimes: number,
      lastUserId: string,
      blockchainId: string,
      loveCount: number,
      collectionCount: number,
      viewCount: number,
      tradeMethod: string,
      transferPrice: number,
      transferPoints: number,
      expectItem: string,
      contactInfo: {
        linkman: string,
        phone: string,
        address: string
      },
      exchangeApplyCount: number,
      deliveryMethod: string,
      isLiked: boolean,
      isCollected: boolean,
      userDetail: {
        tradeScore: number,
        blockchainId: string
      }
    }
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

    const itemDetail = ref<ItemDetail>({
      id: '0',
      userId: '0',
      nickname: '',
      avatarUrl: '',
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
      contactInfo: {
        linkman: '',
        phone: '',
        address: ''
      },
      exchangeApplyCount: 0,
      deliveryMethod: '',
      isLiked: false,
      isCollected: false,
      userDetail: {
        tradeScore: 0,
        blockchainId: ''
      }
    })

    onMounted(async () => {
      // 这里应该调用API获取物品详情
      // 模拟API调用
      itemDetail.value = {
        id: '2025032500010',
        userId: '20250324000002',
        nickname: "NPE",
        avatarUrl: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        itemTitle: "iphone 16",
        itemType: "电子产品",
        itemDescription: "刚买2个月 32G 9成新",
        firstImage: "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
        itemImageList: ["https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg","https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"],
        depreciation: 9,
        transferTimes: 0,
        lastUserId: '20250324000002',
        blockchainId: "Hash0030343jkjlkj",
        loveCount: 10,
        collectionCount: 10,
        viewCount: 10,
        tradeMethod: "以物换物",
        transferPrice: 190.0000,
        transferPoints: 0,
        expectItem: "ipad 10",
        contactInfo: {
          linkman: '张先生',
          phone: '13800008888',
          address: '深圳市南山区xx小区'
        },
        exchangeApplyCount: 0,
        deliveryMethod: "同城自取",
        isLiked: true,
        isCollected: false,
        userDetail: {
          tradeScore: 8.9,
          blockchainId: 'Hash0x99eeieidd'
        }

      }
      isLiked.value = itemDetail.value.isLiked
      isCollected.value = itemDetail.value.isCollected
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
      onExchangeSubmit
    }
  }
})
</script>

<style scoped>
.item-detail {
  min-height: 100vh;
  background-color: #f7f8fa;
  padding-bottom: 60px;
}

.detail-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: transparent;
}

.item-swipe {
  height: 375px;
  margin-top: -46px;
}

.info-group {
  margin: 12px;
  padding: 16px;
  border-radius: 12px;
}

.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.price {
  font-size: 28px;
  font-weight: bold;
  color: #ee0a24;
}

.title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #323233;
  line-height: 1.4;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.seller-group {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
}

.seller-card {
  padding: 16px;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.seller-details {
  flex: 1;
}

.seller-name {
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  margin-bottom: 4px;
}

.seller-score {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #969799;
  font-size: 12px;
}

.seller-blockchain {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #969799;
  font-size: 13px;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.desc-group,
.trade-group {
  margin: 12px;
  border-radius: 12px;
  overflow: hidden;
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

.description {
  padding: 16px;
  color: #666;
  line-height: 1.6;
  font-size: 14px;
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
  font-size: 24px;
}

.van-icon.active {
  color: #ee0a24;
}

.button-group {
  flex: 1;
  margin-left: 16px;
}

:deep(.van-button--primary) {
  background: linear-gradient(to right, #ff6034, #ee0a24);
  border: none;
}

:deep(.van-cell) {
  padding: 12px 16px;
}

:deep(.van-tag--medium) {
  padding: 0 12px;
  height: 28px;
  line-height: 26px;
}

.exchange-popup {
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

:deep(.van-popup) {
  max-height: 90%;
  overflow-y: auto;
}

:deep(.van-field__label) {
  width: 6em !important;
}

:deep(.van-cell-group) {
  margin: 0;
}
</style> 
<template>
  <div class="profile">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="我的"
      class="profile-nav"
    >
      <template #left>
        <van-icon name="setting-o" size="20" class="nav-icon" @click="goToSettings"/>
      </template>
      <template #right>
        <div class="nav-right">
          <van-icon name="scan" size="20" class="nav-icon" @click="openCamera"/>
          <van-icon name="share-o" size="20" class="nav-icon" style="margin-left: 24px" @click="onShare"/>
        </div>
      </template>
    </van-nav-bar>

    <div class="profile-content">
      <!-- 用户信息卡片 -->
      <div class="user-card" v-if="userInfo">
        <div class="user-header">
          <div class="avatar-wrapper">
            <van-image
              round
              width="80"
              height="80"
              :src="userInfo?.avatarUrl || ''"
              class="avatar"
            />
            <div class="user-badge">
              <van-icon name="shield-o" />
            </div>
          </div>
          <div class="user-info">
            <div class="nickname">
              {{ userInfo?.nickname || '' }}
              <span :class="['gender-tag', userInfo?.gender === 'MAN' ? 'male' : 'female']">
                {{ userInfo?.gender === 'MAN' ? '♂' : '♀' }}
              </span>
            </div>
            <div class="user-meta">
              <span class="user-id">ID: {{ userInfo?.userId || '' }}</span>
              <van-icon name="qr" class="qr-icon"/>
            </div>
            <div class="location">
              <van-icon name="location-o"/>
              <span>{{ userInfo?.ipAddress || '' }}</span>
            </div>
          </div>
          <van-button 
            size="small" 
            round 
            plain 
            type="primary" 
            class="edit-btn"
            @click="editProfile"
          >
            编辑资料
          </van-button>
        </div>
        <div class="user-brief">{{ userInfo?.brief || '这个人很懒，什么都没写~' }}</div>
      </div>

      <!-- 数据统计卡片 -->
      <div class="stats-card">
        <div class="stat-item">
          <span class="stat-value">{{ userInfo?.followers || 0 }}</span>
          <span class="stat-label">关注</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userInfo?.followers || 0 }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userInfo?.likes || 0 }}</span>
          <span class="stat-label">获赞</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userInfo?.collects || 0 }}</span>
          <span class="stat-label">收藏</span>
        </div>
      </div>

      <!-- 区块链信息卡片 -->
      <div class="blockchain-card">
        <div class="section-title">
          <van-icon name="shield-o"/>
          <span>区块链信息</span>
        </div>
        <div class="blockchain-content">
          <div class="blockchain-item">
            <div class="blockchain-row">
              <van-icon name="certificate" class="cert-icon"/>
              <span class="label">区块链ID</span>
              <span class="value">
                {{ userInfo?.blockchainId ? userInfo.blockchainId.slice(0, 10) + '...' : '' }}
                <van-icon v-if="userInfo?.blockchainId" 
                  name="question" 
                  class="copy-icon"
                  style="margin-left: 6px; cursor: pointer;"
                  @click="copyBlockchainId(userInfo?.blockchainId)"
                />
              </span>
            </div>
            <div class="blockchain-row">
              <van-icon name="star" class="star-icon"/>
              <span class="label">综合评分</span>
              <div class="score-wrapper">
                <span class="score">{{ userInfo?.tradeScore || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 交易记录卡片 -->
      <van-collapse v-model="activeNames" accordion class="records-card">
        <van-collapse-item :title="`综合评分：${userInfo?.tradeScore || 0}`" name="1">
          <div class="table-wrapper">
            <div class="table-header">
              <span class="col-score">得分</span>
              <span class="col-item">交易项</span>
              <span class="col-time">评分时间</span>
            </div>
            <div class="table-body">
              <div v-for="item in transactions" :key="item.tradeId" class="table-row">
                <span class="col-score">{{ item.tradeScore }}</span>
                <span class="col-item">{{ item.tradeRemark }}</span>
                <span class="col-time">{{ formatTime(item.scoreTime) }}</span>
              </div>
            </div>
          </div>
        </van-collapse-item>

        <van-collapse-item :title="`积分余额：${pointsAccount?.pointsBalance || 0}`" name="2">
          <div class="table-wrapper">
            <div class="table-header">
              <span class="col-points">变动</span>
              <span class="col-type">类型</span>
              <span class="col-time">时间</span>
            </div>
            <div class="table-body">
              <div v-for="item in usages" :key="item.id" class="table-row">
                <span :class="['col-points', item.pointsChange > 0 ? 'increase' : 'decrease']">
                  {{ item.pointsChange > 0 ? '+' : '' }}{{ item.pointsChange }}
                </span>
                <span class="col-type">{{ getValueText(item.transactionType, 'transactionType') }}</span>
                <span class="col-time">{{ formatTime(item.transactionTime) }}</span>
              </div>
            </div>
          </div>
        </van-collapse-item>
      </van-collapse>

      <!-- 物品管理标签页 -->
      <div class="items-section">
        <van-tabs 
          v-model:active="activeTab" 
          sticky 
          animated
          swipeable
          class="custom-tabs"
          @change="onTabChange"
        >
          <van-tab 
            v-for="status in statusList" 
            :key="status.value" 
            :title="status.text"
          >
            <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
              <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="loadItems(status.value)"
              >
                <template v-if="getFilteredItems(status.value).length">
                  <div class="items-grid">
                    <van-card
                      v-for="item in getFilteredItems(status.value)"
                      :key="item.id"
                      :title="item.itemTitle"
                      :thumb="item.firstImage"
                      class="item-card"
                    >
                      <template #tags>
                        <div class="item-tags">
                          <van-tag round :type="getStatusTagType(item.status)">
                            {{ getItemStatusText(item.status) }}
                          </van-tag>
                          <van-tag round :type="getTransferTagType(item.transferStatus)">
                            {{ getStatusText(item.transferStatus) }}
                          </van-tag>
                        </div>
                      </template>
                      <template #desc>
                        <div class="item-desc">
                          <span class="item-id">编号: {{ item.id }}</span>
                          <span class="blockchain-id">{{ item.blockchainId.slice(0, 10) + '...' }} <van-icon v-if="item.blockchainId" 
                            name="question" 
                            class="copy-icon"
                            style="margin-left: 6px; cursor: pointer;"
                            @click="copyBlockchainId(item.blockchainId)"
                          /></span>
                          
                        </div>
                      </template>
                      <template #footer>
                        <div class="action-buttons">
                          <template v-if="item.transferStatus === 'own'">
                            <van-button 
                              v-if="item.status === 'active'" 
                              size="small" 
                              type="primary" 
                              plain
                              @click="viewStuffDetails(item)"
                            >
                              发起出让
                            </van-button>
                          </template>
                          <template v-if="item.transferStatus === 'transferring'">
                            <van-button 
                              size="small" 
                              plain
                              type="danger" 
                              @click="showCancelDialog(item.id)"
                            >
                              取消出让
                            </van-button>
                            <van-button 
                              size="small" 
                              type="primary" 
                              @click="viewOffers(item)"
                            >
                              查看报价
                            </van-button>
                          </template>
                          <van-button 
                            size="small" 
                            type="primary" 
                            plain
                            @click="viewStuffDetails(item)"
                          >
                            物品详情
                          </van-button>
                        </div>
                      </template>
                    </van-card>
                  </div>
                </template>
                <template v-else>
                  <van-empty description="暂无物品" />
                </template>
              </van-list>
            </van-pull-refresh>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>

  <!-- 底部导航栏 -->
  <van-tabbar v-model="activeTab" fixed route>
      <van-tabbar-item icon="home-o" to="/">
        首页
      </van-tabbar-item>
      <van-tabbar-item icon="envelop-o" to="/notification">
        消息
      </van-tabbar-item>
      <van-tabbar-item to="/stuff/publish">
        <template #icon>
          <div class="publish-button">
            <van-icon name="plus" size="20" />
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/stuff/trades">
        交易
      </van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user/profile">
        我的
      </van-tabbar-item>
    </van-tabbar>

    <!-- 为底部导航腾出空间 -->
    <div class="bottom-space"></div>

    <cancel-transfer-dialog
      v-model="showCancelTransfer"
      :item-id="currentItemId"
      @success="onCancelSuccess"
    />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { showToast } from 'vant'
import { useRouter } from 'vue-router'
import { getMyItems } from '@/api/stuff'
import CancelTransferDialog from '@/components/CancelTransferDialog.vue'
import { useUserStore } from '@/store/modules/user'
import { getPointsAccount, getPointsTransactions, getTradeScoreTransactions } from '@/api/user';
import type { Item, PointsTransaction, PointsAccount, TradeScoreTransaction } from '@/api/types';
import { getValueText } from '@/constants/stuff'

export default defineComponent({
  components: {
    CancelTransferDialog
  },
  setup() {
    const userStore = useUserStore()
    const userInfo = computed(() => userStore.userInfo)

    const openCamera = () => {
      showToast('打开相机')
    }

    const onShare = () => {
      showToast('分享')
    }
    const router = useRouter()
    const activeTab = ref(0)
    const activeNames = ref(['1'])
    const items = ref<Item[]>([])
    const loading = ref(false)
    const finished = ref(false)
    const refreshing = ref(false)
    const pageNo = ref(1)
    const pageSize = ref(10)
    const showCancelTransfer = ref(false)
    const currentItemId = ref('')

    // 状态列表
    const statusList = [
      { text: '我的物品', value: 'all' },
      { text: '拥有', value: 'own' },
      { text: '转让中', value: 'transferring' },
      // { text: '已转让', value: 'transferred' }
    ]

    // 获取状态文本
    const getStatusText = (status: string) => {
      const statusMap: Record<string, string> = {
        own: '拥有',
        transferring: '转让中',
        // transferred: '已转让'
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

    // 加载物品列表
    const loadItems = async (status: string) => {
      if (loading.value) return
      loading.value = true
      
      try {
        const params = {
          pageNo: pageNo.value,
          pageSize: pageSize.value,
          status: status === 'all' ? undefined : status
        }
        
        const res = await getMyItems(params)
        if (res.success) {
          if (pageNo.value === 1) {
            items.value = res.data
          } else {
            items.value.push(...res.data)
          }
          
          // 判断是否加载完成
          finished.value = res.data.length < pageSize.value
          pageNo.value++
        }
      } catch (error) {
        console.error('加载物品列表失败:', error)
        showToast('加载失败')
      } finally {
        loading.value = false
      }
    }

    // 根据状态筛选物品
    const getFilteredItems = (status: string) => {
      if (status === 'all') return items.value
      return items.value.filter(item => item.transferStatus === status)
    }
    // 查看报价
    const viewOffers = (item: Item) => {
      router.push(`/stuff/offers/${item.id}`)
    }

    // 查看物品详情
    const viewStuffDetails = async (item: any) => {
      router.push({
            path: `/stuff/detail/${item.id}`
          })
    }
    // 下拉刷新
    const onRefresh = () => {
      pageNo.value = 1
      finished.value = false
      loadItems(statusList[activeTab.value].value)
      refreshing.value = false
    }

    // 标签类型
    const getStatusTagType = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
      const typeMap: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
        active: 'success',
        auditing: 'warning',
        inactive: 'danger'
      }
      return typeMap[status] || 'default'
    }

    const getTransferTagType = (status: string): 'primary' | 'warning' | 'default' => {
      const typeMap: Record<string, 'primary' | 'warning' | 'default'> = {
        own: 'primary',
        transferring: 'warning',
        transferred: 'default'
      }
      return typeMap[status] || 'default'
    }

    // 监听标签页切换
    const onTabChange = (index: number) => {
      const status = statusList[index].value
      pageNo.value = 1
      finished.value = false
      loadItems(status)
    }

    const showCancelDialog = (itemId: string) => {
      currentItemId.value = itemId
      showCancelTransfer.value = true
    }

    const onCancelSuccess = () => {
      console.log('activeTab.value' + activeTab.value)
      console.log('statusList.activeTab.value' + statusList[activeTab.value].value)
      // 刷新列表数据
      onRefresh()
    }

    const copyBlockchainId = (blockchainId: string) => {
      if (blockchainId) {
        navigator.clipboard.writeText(blockchainId)
          .then(() => {
            showToast('已复制区块链ID')
          })
          .catch(() => {
            showToast('复制失败')
          })
      }
    }

    onMounted(() => {
      if (!userStore.token || !userInfo.value) {
        router.push('/login')
        return
      }
      loadItems('all')
    })

    return {
      openCamera,
      onShare,
      activeTab,
      activeNames,
      statusList,
      items,
      loading,
      finished,
      refreshing,
      getStatusText,
      getFilteredItems,
      viewStuffDetails,
      getItemStatusText,
      getStatusTagType,
      getTransferTagType,
      loadItems,
      onTabChange,
      onRefresh,
      viewOffers,
      showCancelTransfer,
      currentItemId,
      showCancelDialog,
      onCancelSuccess,
      userInfo,
      copyBlockchainId,
      getValueText
    }
  },
  data() {
    return {
      transactions: [] as TradeScoreTransaction[] | [],
      pointsAccount: null as PointsAccount | null,
      usages: [] as PointsTransaction[] | [],
      // 分页参数
      pageNo: 1,
      pageSize: 5,
    };
  },
  mounted() {
    this.fetchPointsAccount();
    this.fetchPointsTransactions();
    this.fetchTradeScoreTransactions();
  },
  methods: {
    formatTime(timestamp: number) {
      const date = new Date(timestamp);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');
      return `${y}-${m}-${d} ${h}:${min}:${s}`;
    },
    async fetchPointsAccount() {
      const res = await getPointsAccount();
      if (res.success) {
        this.pointsAccount = res.data;
      }
    },
    async fetchPointsTransactions() {
      const res = await getPointsTransactions({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      });
      if (res.success) {
        this.usages = res.data;
      }
    },
    async fetchTradeScoreTransactions() {
      const res = await getTradeScoreTransactions({
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      });
      if (res.success) {
        this.transactions = res.data;
      }
    },
    
    showTransactionDetail(transaction: any) {
      showToast({
        message: `交易哈希: ${transaction.hash}\n交易时间: ${transaction.time}\n交易金额: ${transaction.amount}`
      });
    },
    editProfile() {
      this.$router.push('/user/edit-profile')
    },
    goToSettings() {
      this.$router.push('/user/settings')
    }
  }
})
</script>

<style lang="scss" scoped>
.profile {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 50px;
}

.profile-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #39a0ff);
    
    .van-nav-bar__title,
    .van-icon {
      color: #fff;
    }
  }
}

.profile-content {
  padding: 16px;
}

.user-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  .user-header {
    display: flex;
    gap: 16px;
    position: relative;
  }
  
  .avatar-wrapper {
    position: relative;
    
    .user-badge {
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
  
  .avatar {
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .user-info {
    flex: 1;
    
    .nickname {
      font-size: 20px;
      font-weight: bold;
      color: #323233;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .gender-tag {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 12px;
      
      &.male {
        background: #e8f3ff;
        color: #1989fa;
      }
      
      &.female {
        background: #ffd8e6;
        color: #ff2c7d;
      }
    }
    
    .user-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
      
      .user-id {
        font-size: 14px;
        color: #969799;
      }
      
      .qr-icon {
        color: #1989fa;
      }
    }
    
    .location {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #969799;
      font-size: 13px;
    }
  }
  
  .edit-btn {
    position: absolute;
    right: 0;
    top: 0;
  }
  
  .user-brief {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #f5f5f5;
    color: #666;
    font-size: 14px;
    line-height: 1.5;
  }
}

.stats-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    
    .stat-value {
      font-size: 20px;
      font-weight: bold;
      color: #323233;
    }
    
    .stat-label {
      font-size: 12px;
      color: #969799;
    }
  }
}

.blockchain-card,
.records-card {
  background: #fff;
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  
  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: bold;
    color: #323233;
    border-bottom: 1px solid #f5f5f5;
    
    .van-icon {
      color: #1989fa;
    }
  }
}

.blockchain-content {
  padding: 20px;
  
  .blockchain-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .cert-icon,
    .star-icon {
      color: #1989fa;
      font-size: 16px;
    }
    
    .label {
      width: 80px;
      color: #969799;
      font-size: 14px;
    }
    
    .value {
      flex: 1;
      color: #323233;
      font-size: 14px;
      display: flex;
      align-items: center;
    }
    
    .copy-icon {
      color: #1989fa;
      font-size: 14px;
    }
    
    .score-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .score {
        color: #ffd21e;
        font-weight: bold;
      }
    }
  }
}

.table-wrapper {
  .table-header {
    display: grid;
    grid-template-columns: 80px 1fr 120px;
    padding: 12px 16px;
    background: #f7f8fa;
    font-size: 13px;
    color: #323233;
    font-weight: bold;
  }
  
  .table-body {
    .table-row {
      display: grid;
      grid-template-columns: 80px 1fr 120px;
      padding: 12px 16px;
      font-size: 13px;
      color: #666;
      border-bottom: 1px solid #f5f5f5;
      
      &:last-child {
        border-bottom: none;
      }
    }
  }
  
  .increase {
    color: #07c160;
  }
  
  .decrease {
    color: #ee0a24;
  }
}

.items-section {
  margin: 0 -16px;
  
  .custom-tabs {
    :deep(.van-tabs__wrap) {
      height: 48px;
      background: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    
    :deep(.van-tabs__nav) {
      padding: 6px 0;
      
      &::before {
        display: none;
      }
    }
    
    :deep(.van-tab) {
      font-size: 14px;
      color: #666;
      line-height: 36px;
      transition: all 0.3s ease;
      position: relative;
    }
    
    :deep(.van-tab--active) {
      color: #1989fa;
      font-weight: 500;
      transform: scale(1.05);
    }
    
    :deep(.van-tabs__line) {
      background: linear-gradient(to right, #1989fa, #39a0ff);
      height: 3px;
      border-radius: 3px;
      bottom: 8px;
      transition: all 0.35s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
  }
}

.items-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 12px;
  
  .item-card {
    margin: 0;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    
    :deep(.van-card__header) {
      position: relative;
    }
    
    :deep(.van-card__thumb) {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    :deep(.van-card__content) {
      padding-left: 12px;
    }
    
    :deep(.van-card__title) {
      font-size: 15px;
      font-weight: bold;
      color: #323233;
      margin-bottom: 8px;
    }
    
    .item-tags {
      margin-top: 8px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      
      .van-tag {
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 4px;
      }
    }
    
    .item-desc {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      
      .item-id {
        font-size: 12px;
        color: #969799;
        display: flex;
        align-items: center;
        
        &::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          background: #969799;
          border-radius: 50%;
          margin-right: 6px;
        }
      }
      
      .blockchain-id {
        font-size: 12px;
        color: #1989fa;
        background: #e8f3ff;
        padding: 4px 8px;
        border-radius: 4px;
        word-break: break-all;
        display: flex;
        align-items: center;
        
        &::before {
          content: '区块链ID: ';
          color: #969799;
          margin-right: 4px;
          font-size: 12px;
        }
      }
    }
    
    .action-buttons {
      margin-top: 12px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      
      .van-button {
        height: 28px;
        padding: 0 12px;
        
        &--plain {
          background: #fff;
        }
      }
    }
  }
}

// 添加空状态样式
:deep(.van-empty) {
  padding: 32px 0;
  background: #fff;
  border-radius: 12px;
  margin: 12px;
}

.publish-button {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #1989fa, #0066ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.3);
  
  .van-icon {
    color: #fff;
  }
}
</style>
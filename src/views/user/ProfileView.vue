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
      <!-- 用户信息核心卡片 - 突出显示 -->
      <BaseCard class="user-hero-card" v-if="userInfo">
        <div class="hero-header">
          <div class="hero-left">
            <div class="avatar-wrapper">
              <van-image
                round
                width="64"
                height="64"
                :src="userInfo?.avatarUrl || ''"
                class="avatar"
              />
              <div class="user-badge">
                <van-icon name="shield-o" />
              </div>
            </div>
            <div class="user-info-compact">
              <div class="nickname-row">
                <span class="nickname">{{ userInfo?.nickname || '' }}</span>
                <span :class="['gender-tag', userInfo?.gender === 'MAN' ? 'male' : 'female']">
                  {{ userInfo?.gender === 'MAN' ? '♂' : '♀' }}
                </span>
              </div>
              <div class="user-id-compact">用户编号: {{ userInfo?.userId || '' }}</div>
            </div>
          </div>
          <van-button 
            size="small" 
            round 
            plain 
            type="primary" 
            class="edit-btn-compact"
            @click="editProfile"
          >
            编辑
          </van-button>
        </div>
        
        <!-- 核心数据突出显示 -->
        <div class="core-stats">
          <div class="core-stat-item highlight">
            <div class="core-stat-icon">
              <van-icon name="gold-coin-o" />
            </div>
            <div class="core-stat-content">
              <div class="core-stat-value">{{ pointsAccount?.pointsBalance || 0 }}</div>
              <div class="core-stat-label">积分余额</div>
            </div>
          </div>
          <div class="core-stat-item highlight">
            <div class="core-stat-icon score">
              <van-icon name="star" />
            </div>
            <div class="core-stat-content">
              <div class="core-stat-value">{{ userInfo?.tradeScore || 0 }}</div>
              <div class="core-stat-label">信用评分</div>
            </div>
          </div>
        </div>

        <!-- 社交数据紧凑展示 -->
        <div class="social-stats">
          <div class="social-item">
            <span class="social-value">{{ userInfo?.followers || 0 }}</span>
            <span class="social-label">关注</span>
          </div>
          <div class="social-divider"></div>
          <div class="social-item">
            <span class="social-value">{{ userInfo?.followers || 0 }}</span>
            <span class="social-label">粉丝</span>
          </div>
          <div class="social-divider"></div>
          <div class="social-item">
            <span class="social-value">{{ userInfo?.likes || 0 }}</span>
            <span class="social-label">获赞</span>
          </div>
          <div class="social-divider"></div>
          <div class="social-item">
            <span class="social-value">{{ userInfo?.collects || 0 }}</span>
            <span class="social-label">收藏</span>
          </div>
        </div>

        <!-- 区块链ID紧凑展示 -->
        <div class="blockchain-compact" v-if="userInfo?.blockchainId">
          <van-icon name="certificate" class="cert-icon-small"/>
          <span class="blockchain-text">
            {{ userInfo.blockchainId.slice(0, 12) + '...' }}
          </span>
          <van-icon 
            name="question" 
            class="copy-icon-small"
            @click="copyBlockchainId(userInfo.blockchainId)"
          />
        </div>
      </BaseCard>

      <!-- 交易记录卡片 - 紧凑折叠 -->
      <BaseCard class="records-card-compact">
        <van-collapse v-model="activeNames" accordion>
          <van-collapse-item name="1">
            <template #title>
              <div class="collapse-title">
                <van-icon name="star-o" />
                <span>评分记录</span>
                <span class="collapse-count">({{ transactions.length }})</span>
              </div>
            </template>
            <div class="table-wrapper-compact">
              <div class="table-header-compact">
                <span class="col-score">得分</span>
                <span class="col-item">交易项</span>
                <span class="col-time">时间</span>
              </div>
              <div class="table-body-compact">
                <div v-for="item in transactions" :key="item.tradeId" class="table-row-compact">
                  <span class="col-score">{{ item.tradeScore }}</span>
                  <span class="col-item">{{ item.tradeRemark }}</span>
                  <span class="col-time">{{ formatTime(item.scoreTime) }}</span>
                </div>
                <div v-if="transactions.length === 0" class="empty-hint">暂无评分记录</div>
              </div>
            </div>
          </van-collapse-item>

          <van-collapse-item name="2">
            <template #title>
              <div class="collapse-title">
                <van-icon name="gold-coin-o" />
                <span>积分明细</span>
                <span class="collapse-count">({{ usages.length }})</span>
              </div>
            </template>
            <div class="table-wrapper-compact">
              <div class="table-header-compact">
                <span class="col-points">变动</span>
                <span class="col-type">类型</span>
                <span class="col-time">时间</span>
              </div>
              <div class="table-body-compact">
                <div v-for="item in usages" :key="item.id" class="table-row-compact">
                  <span :class="['col-points', item.pointsChange > 0 ? 'increase' : 'decrease']">
                    {{ item.pointsChange > 0 ? '+' : '' }}{{ item.pointsChange }}
                  </span>
                  <span class="col-type">{{ getValueText(item.transactionType, 'transactionType') }}</span>
                  <span class="col-time">{{ formatTime(item.transactionTime) }}</span>
                </div>
                <div v-if="usages.length === 0" class="empty-hint">暂无积分记录</div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </BaseCard>

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
                @load="loadMore(status.value)"
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
                          <template v-if="item.isCanCancel">
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
  <AppTabBar />

    <cancel-transfer-dialog
      v-model="showCancelTransfer"
      :item-id="currentItemId"
      @success="onCancelSuccess"
    />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, nextTick } from 'vue'
import { showToast } from 'vant'
import { useRouter, useRoute } from 'vue-router'
import { getMyItems } from '@/api/stuff'
import CancelTransferDialog from '@/components/CancelTransferDialog.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import AppTabBar from '@/components/ui/AppTabBar.vue'
import { useUserStore } from '@/store/modules/user'
import { getPointsAccount, getPointsTransactions, getTradeScoreTransactions, userApi } from '@/api/user';
import type { Item, PointsTransaction, PointsAccount, TradeScoreTransaction } from '@/api/types';
import { getValueText } from '@/constants/stuff'

export default defineComponent({
  components: {
    CancelTransferDialog,
    BaseCard,
    AppTabBar
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
    const route = useRoute()
    const activeTab = ref(0)
    const activeNames = ref('0')
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
      { text: '申请交换中', value: 'transfer_applying' },
      // { text: '已转让', value: 'transferred' }
    ]

    // 获取状态文本
    const getStatusText = (status: string) => {
      const statusMap: Record<string, string> = {
        own: '拥有',
        transferring: '转让中',
        transfer_applying: '申请交换中',
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

    // 加载更多
  const loadMore = async (status: string) => {
    // console.log('loadMore:finished.value:'+finished.value)
    // console.log('loadMore:loading.value:'+loading.value)
    if (finished.value) return
    loading.value = false;
    
    await loadItems(status)
  }

    // 加载物品列表
    const loadItems = async (status: string) => {
      console.log('loadItems:loading.value:'+loading.value)
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
        finished.value = true
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
      console.log('onRefresh:loading.value:'+loading.value)
      pageNo.value = 1
      finished.value = false
      loading.value = false
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
        transferred: 'default',
        transfer_applying: 'warning',
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
      userApi.refreshUserInfo().then(res => {
        if(res){
            userStore.setUserInfo(res)
        }
      }).catch(error => {
        console.error('刷新用户信息失败:', error);
        // 错误已在 request.ts 中统一处理并显示提示
      })

      if (route.query.section === 'items') {
        activeTab.value = 0
        nextTick(() => {
          const el = document.querySelector('.items-section')
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        })
      }
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
      loadMore,
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
      try {
        const res = await getPointsAccount();
        if (res.success) {
          this.pointsAccount = res.data;
        }
      } catch (error) {
        console.error('获取积分账户失败:', error);
        // 错误已在 request.ts 中统一处理并显示提示
      }
    },
    async fetchPointsTransactions() {
      try {
        const res = await getPointsTransactions({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        });
        if (res.success) {
          this.usages = res.data;
        }
      } catch (error) {
        console.error('获取积分交易记录失败:', error);
        // 错误已在 request.ts 中统一处理并显示提示
      }
    },
    async fetchTradeScoreTransactions() {
      try {
        const res = await getTradeScoreTransactions({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
        });
        if (res.success) {
          this.transactions = res.data;
        }
      } catch (error) {
        console.error('获取信用评分记录失败:', error);
        // 错误已在 request.ts 中统一处理并显示提示
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
@import '@/styles/theme.scss';

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
  padding: 12px;
}

// 用户核心信息卡片 - 突出显示
.user-hero-card {
  margin-bottom: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fbff 0%, #ffffff 100%);
  border: 1px solid #e8f3ff;
  
  .hero-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    
    .hero-left {
      display: flex;
      gap: 12px;
      flex: 1;
    }
    
    .avatar-wrapper {
      position: relative;
      flex-shrink: 0;
      
      .user-badge {
        position: absolute;
        right: -2px;
        bottom: -2px;
        width: 18px;
        height: 18px;
        background: linear-gradient(135deg, #1989fa, #39a0ff);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #fff;
        
        .van-icon {
          color: #fff;
          font-size: 10px;
        }
      }
    }
    
    .avatar {
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(25, 137, 250, 0.15);
    }
    
    .user-info-compact {
      flex: 1;
      min-width: 0;
      
      .nickname-row {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 4px;
        
        .nickname {
          font-size: 18px;
          font-weight: 700;
          color: #323233;
          @include text-ellipsis;
        }
        
        .gender-tag {
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 10px;
          flex-shrink: 0;
          
          &.male {
            background: #e8f3ff;
            color: #1989fa;
          }
          
          &.female {
            background: #ffd8e6;
            color: #ff2c7d;
          }
        }
      }
      
      .user-id-compact {
        font-size: 12px;
        color: #969799;
      }
    }
    
    .edit-btn-compact {
      flex-shrink: 0;
      height: 28px;
      padding: 0 12px;
      font-size: 12px;
    }
  }
  
  // 核心数据突出显示
  .core-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 12px;
    
    .core-stat-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      background: #fff;
      border-radius: 12px;
      border: 1px solid #f0f0f0;
      
      &.highlight {
        background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
        border-color: #ffe58f;
      }
      
      .core-stat-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: linear-gradient(135deg, #1989fa, #39a0ff);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        .van-icon {
          color: #fff;
          font-size: 20px;
        }
        
        &.score {
          background: linear-gradient(135deg, #ffd21e, #ffb800);
        }
      }
      
      .core-stat-content {
        flex: 1;
        min-width: 0;
        
        .core-stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #323233;
          line-height: 1.2;
          margin-bottom: 2px;
        }
        
        .core-stat-label {
          font-size: 11px;
          color: #969799;
        }
      }
    }
  }
  
  // 社交数据紧凑展示
  .social-stats {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-top: 1px solid #f5f5f5;
    
    .social-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      
      .social-value {
        font-size: 16px;
        font-weight: 700;
        color: #323233;
      }
      
      .social-label {
        font-size: 11px;
        color: #969799;
      }
    }
    
    .social-divider {
      width: 1px;
      height: 24px;
      background: #f0f0f0;
    }
  }
  
  // 区块链ID紧凑展示
  .blockchain-compact {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    margin-top: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    font-size: 12px;
    
    .cert-icon-small {
      color: #1989fa;
      font-size: 14px;
    }
    
    .blockchain-text {
      flex: 1;
      color: #666;
      font-family: 'Courier New', monospace;
    }
    
    .copy-icon-small {
      color: #1989fa;
      font-size: 14px;
      cursor: pointer;
      flex-shrink: 0;
    }
  }
}

// 交易记录卡片 - 紧凑样式
.records-card-compact {
  margin-bottom: 12px;
  padding: 0;
  
  :deep(.van-collapse-item) {
    border-bottom: 1px solid #f5f5f5;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  :deep(.van-collapse-item__title) {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  :deep(.van-collapse-item__content) {
    padding: 0;
  }
  
  .collapse-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 600;
    color: #323233;
    
    .van-icon {
      color: #1989fa;
      font-size: 16px;
    }
    
    .collapse-count {
      color: #969799;
      font-weight: normal;
      font-size: 12px;
    }
  }
  
  .table-wrapper-compact {
    .table-header-compact {
      display: grid;
      grid-template-columns: 60px 1fr 100px;
      padding: 10px 16px;
      background: #f8f9fa;
      font-size: 12px;
      color: #969799;
      font-weight: 600;
    }
    
    .table-body-compact {
      .table-row-compact {
        display: grid;
        grid-template-columns: 60px 1fr 100px;
        padding: 10px 16px;
        font-size: 12px;
        color: #666;
        border-bottom: 1px solid #f5f5f5;
        
        &:last-child {
          border-bottom: none;
        }
        
        .col-score {
          font-weight: 600;
          color: #ffd21e;
        }
        
        .col-item {
          @include text-ellipsis;
        }
        
        .col-time {
          color: #969799;
          font-size: 11px;
        }
        
        .col-points {
          font-weight: 600;
          
          &.increase {
            color: #07c160;
          }
          
          &.decrease {
            color: #ee0a24;
          }
        }
      }
      
      .empty-hint {
        padding: 24px;
        text-align: center;
        color: #969799;
        font-size: 12px;
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
  margin: 0 -12px;
  
  .custom-tabs {
    :deep(.van-tabs__wrap) {
      height: 44px;
      background: #fff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    }
    
    :deep(.van-tabs__nav) {
      padding: 4px 0;
      
      &::before {
        display: none;
      }
    }
    
    :deep(.van-tab) {
      font-size: 13px;
      color: #666;
      line-height: 36px;
      transition: all 0.3s ease;
      padding: 0 16px;
    }
    
    :deep(.van-tab--active) {
      color: #1989fa;
      font-weight: 600;
    }
    
    :deep(.van-tabs__line) {
      background: linear-gradient(to right, #1989fa, #39a0ff);
      height: 2px;
      border-radius: 2px;
      bottom: 6px;
    }
  }
}

.items-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 10px;
  
  .item-card {
    margin: 0;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    border: 1px solid #f0f0f0;
    transition: all 0.2s;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }
    
    :deep(.van-card__header) {
      position: relative;
      padding: 10px;
    }
    
    :deep(.van-card__thumb) {
      width: 100px;
      height: 100px;
      border-radius: 8px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    
    :deep(.van-card__content) {
      padding: 10px 10px 10px 12px;
    }
    
    :deep(.van-card__title) {
      font-size: 14px;
      font-weight: 600;
      color: #323233;
      margin-bottom: 6px;
      @include text-ellipsis;
    }
    
    .item-tags {
      margin-top: 6px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      
      .van-tag {
        padding: 2px 6px;
        font-size: 11px;
        border-radius: 3px;
      }
    }
    
    .item-desc {
      margin-top: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .item-id {
        font-size: 11px;
        color: #969799;
        display: flex;
        align-items: center;
        
        &::before {
          content: '';
          display: inline-block;
          width: 3px;
          height: 3px;
          background: #969799;
          border-radius: 50%;
          margin-right: 4px;
        }
      }
      
      .blockchain-id {
        font-size: 11px;
        color: #1989fa;
        background: #f0f7ff;
        padding: 3px 6px;
        border-radius: 4px;
        word-break: break-all;
        display: flex;
        align-items: center;
        
        &::before {
          content: 'ID: ';
          color: #969799;
          margin-right: 2px;
          font-size: 11px;
        }
      }
    }
    
    .action-buttons {
      margin-top: 10px;
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      flex-wrap: wrap;
      
      .van-button {
        height: 26px;
        padding: 0 10px;
        font-size: 11px;
        
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

</style>
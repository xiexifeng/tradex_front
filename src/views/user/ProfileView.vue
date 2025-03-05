<template>
  <van-nav-bar
    title="我的"
    @click-left="onClickLeft"
    @click-right="onClickRight"
    class="custom-nav"
  >
    <template #left>
      <van-icon name="bars" size="20" class="nav-icon" />
    </template>
    <template #right>
      <div class="nav-right">
        <van-icon name="scan" size="20" class="nav-icon" @click="openCamera"/>
        <van-icon name="share-o" size="20" class="nav-icon" style="margin-left: 24px" @click="onShare"/>
      </div>
    </template>
  </van-nav-bar>

  <div class="user-profile">
    <!-- 用户信息卡片 -->
    <van-card>
      <template #tags>
          <div class="user-header">
          <van-image
            round
            width="80px"
            height="80px"
            :src="user.avatar"
          />
          <div class="user-info">
            <div class="nickname">
              {{ user.nickname }}
              <span :class="['gender-icon', user.sex === '男' ? 'male' : 'female']">
                {{ user.sex === '男' ? '♂' : '♀' }}
              </span>
            </div>
            <!-- <van-tag :type="user.role === '卖家' ? 'danger' : 'primary'">
              {{ user.role }}
            </van-tag> -->
            <div class="brief">平台ID: {{ user.xTradeId }} <van-icon name="qr" size="15"/></div>
            <div class="brief">IP属地: {{ user.ipAddress }} </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="brief">简介：{{ user.brief }}</div>
        <!-- <div class="balance">
          <van-icon name="balance-o" size="18" />
          <span>虚拟币余额: {{ user.balance }}</span>
        </div> -->
      </template>
    </van-card>

    <!-- 用户数据统计 -->
    <van-cell-group inset class="user-stats">
      <div class="stats-row">
        <div class="stat-item">
          <span class="stat-value">{{ user.followers }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ user.likes }}</span>
          <span class="stat-label">获赞</span>
        </div>
        <div class="stat-item">
          <van-button size="small" type="primary" plain @click="editProfile">
            编辑资料
          </van-button>
        </div>
        <div class="stat-item">
          <van-button size="small" plain @click="goToSettings">
            设置
          </van-button>
        </div>
      </div>
    </van-cell-group>

    <!-- 交易记录 -->
    <van-cell title="交易记录" icon="balance-list" />
    <van-list v-if="transactions.length > 0">
      <van-cell
        v-for="(transaction, index) in transactions.slice(0, 5)"
        :key="index"
        :title="`交易 ${index + 1}`"
        :value="`${transaction.amount} 币`"
        :label="`时间: ${transaction.time}`"
        @click="showTransactionDetail(transaction)"
      />
    </van-list>
    <van-empty v-else description="暂无交易记录" />

    <!-- 虚拟币使用记录 -->
    <van-cell title="虚拟币使用记录" icon="gold-coin" />
    <van-list v-if="usages.length > 0">
      <van-cell
        v-for="(usage, index) in usages.slice(0, 5)"
        :key="index"
        :title="`使用记录 ${index + 1}`"
        :value="`${usage.amount} 币`"
        :label="`类型: ${usage.type}`"
      />
    </van-list>
    <van-empty v-else description="暂无使用记录" />

    <!-- 物品管理 -->
    <van-cell-group inset title="物品管理">
      <van-cell 
        title="我的物品" 
        is-link 
        to="/stuff/list"
        icon="goods-collect-o"
      />
    </van-cell-group>
  </div>

  <!-- 底部导航栏 -->
  <van-tabbar v-model="activeTab" fixed route>
      <van-tabbar-item icon="shop-o" to="/mall">
        电商广场
      </van-tabbar-item>
      <van-tabbar-item icon="exchange" to="/stuff/barter">
        易物广场
      </van-tabbar-item>
      <van-tabbar-item to="/stuff/publish">
        <template #icon>
          <div class="publish-button">
            <van-icon name="plus" size="20" />
          </div>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="orders-o" to="/stuff/trades">
        交易列表
      </van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/user/profile">
        我的
      </van-tabbar-item>
    </van-tabbar>

    <!-- 为底部导航腾出空间 -->
    <div class="bottom-space"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { showToast } from 'vant'

export default defineComponent({
  setup() {
    const onClickLeft = () => {
      showToast('点击设置')
    }

    const openCamera = () => {
      showToast('打开相机')
    }

    const onShare = () => {
      showToast('分享')
    }

    return {
      onClickLeft,
      openCamera,
      onShare
    }
  },
  data() {
    return {
      user: {
        avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg',
        nickname: 'NPE',
        xTradeId: '43071222006X',
        sex: '男',
        brief: '这个人有点懒，什么也没写',
        role: '卖家', // 或 '买家'
        ipAddress: '广东',
        balance: '1000',
        followers: 328,
        likes: 1208,
      },
      transactions: [
        { id: 1, amount: '100', time: '2023-10-01', hash: '0x1234567890abcdef1' }
      ],
      usages: [
        { id: 1, amount: '50', time: '2023-10-01', type: '购买商品' },
        { id: 2, amount: '100', time: '2023-10-02', type: '提现' },
        { id: 3, amount: '150', time: '2023-10-03', type: '购买商品' }
      ]
    };
  },
  methods: {
    showTransactionDetail(transaction: any) {
      showToast({
        message: `交易哈希: ${transaction.hash}\n交易时间: ${transaction.time}\n交易金额: ${transaction.amount}`
      });
    },
    editProfile() {
      showToast('编辑资料')
    },
    goToSettings() {
      this.$router.push('/user/settings')
    }
  }
})
</script>

<style scoped>
.user-profile {
  padding: 16px;
  background-color: #f7f8fa;
}

.user-header {
  display: flex;
  align-items: center;
  padding: 16px;
}

.user-info {
  margin-left: 16px;
  text-align: left;
}

.nickname {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.brief {
  text-align: left;
  font-size: 10px;
  margin-bottom: 8px;
}

.balance {
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #1989fa;
}

.balance span {
  margin-left: 8px;
}

.van-cell {
  margin-bottom: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.van-empty {
  margin-top: 16px;
}

.custom-nav {
  background-color: transparent;
}

:deep(.van-nav-bar__content) {
  background-color: transparent;
}

:deep(.van-nav-bar__title) {
  color: #323233;
  font-weight: bold;
}

.nav-icon {
  color: #323233;
}

.nav-right {
  display: flex;
  align-items: center;
}

.gender-icon {
  display: inline-block;
  margin-left: 4px;
  font-size: 16px;
  font-weight: bold;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 50%;
}

.male {
  color: #fff;
  background-color: #1989fa;
}

.female {
  color: #fff;
  background-color: #ff6b81;
}

.user-stats {
  margin: 12px 16px;
}

.stats-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
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

:deep(.van-button--small) {
  padding: 0 16px;
  height: 28px;
}
.bottom-space {
  height: 50px;
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
}

.publish-button .van-icon {
  color: white;
}

/* 调整底部导航样式 */
:deep(.van-tabbar-item) {
  color: #7d7e80;
}

:deep(.van-tabbar-item--active) {
  color: #1989fa;
}

:deep(.van-tabbar-item__icon) {
  font-size: 20px;
}

:deep(.van-tabbar-item:nth-child(3)) {
  margin-top: -14px;
}

:deep(.van-tabbar-item:nth-child(3) .van-tabbar-item__text) {
  margin-top: 4px;
}
</style>
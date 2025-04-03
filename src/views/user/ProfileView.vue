<template>
  <van-nav-bar
    title="我的"
    @click-left="onClickLeft"
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
            :src="user.avatarUrl"
          />
          <div class="user-info">
            <div class="nickname">
              {{ user.nickname }}
              <span :class="['gender-icon', user.gender === '男' ? 'male' : 'female']">
                {{ user.gender === '男' ? '♂' : '♀' }}
              </span>
            </div>
            <!-- <van-tag :type="user.role === '卖家' ? 'danger' : 'primary'">
              {{ user.role }}
            </van-tag> -->
            <div class="brief">平台ID: {{ user.userId }} <van-icon name="qr" size="15"/></div>
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
          <span class="stat-label">关注</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ user.followers }}</span>
          <span class="stat-label">粉丝</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ user.likes }}</span>
          <span class="stat-label">获赞</span>
        </div>
        <div class="stat-item">
          <!-- <van-button size="small" type="primary" plain @click="editProfile">
            编辑资料
          </van-button> -->
          <van-icon name="edit" @click="editProfile"/>
        </div>
        <div class="stat-item">
          <!-- <van-button size="small" plain @click="goToSettings">
            设置
          </van-button> -->
          <van-icon name="setting-o" @click="goToSettings"/>
        </div>
      </div>
    </van-cell-group>

    <div>
    <!-- 折叠面板 -->
    <van-collapse v-model="activeNames" accordion>
      <van-collapse-item :title="`综合评分：${user.tradeScore}`" name="1">
        <!-- 折叠内容中的 Grid 宫格 -->
         <div class="table-container">
          <!-- 表头 -->
          <van-row class="table-row">
            <van-col span="5" class="table-header">得分</van-col>
            <van-col span="10" class="table-header">交易项</van-col>
            <van-col span="9" class="table-header">评分时间</van-col>
          </van-row>
          <!-- 表体 -->
          <van-row  v-for="item in transactions" :key="item.tradeId">
            <van-col span="5" class="table-cell">{{ item.tradeScore }}</van-col>
            <van-col span="10" class="table-cell">{{ item.tradeRemark }}</van-col>
            <van-col span="9" class="table-cell">{{ item.scoreTime }}</van-col>
          </van-row>

         </div>
         
      </van-collapse-item>
      <van-collapse-item :title="`积分：${pointsAccount.pointsBalance}`" name="2">
        <!-- 折叠内容中的 Grid 宫格 -->
         <div class="table-container">
          <!-- 表头 -->
          <van-row class="table-row">
            <van-col span="5" class="table-header">业务编号</van-col>
            <van-col span="5" class="table-header">积分</van-col>
            <van-col span="7" class="table-header">描述</van-col>
            <van-col span="7" class="table-header">交易时间</van-col>
          </van-row>
          <!-- 表体 -->

          <van-row  v-for="item in usages" :key="item.id">
            <van-col span="5" class="table-cell">{{ item.bizNo }}</van-col>
            <van-col span="5" class="table-cell">{{ item.pointsChange }}</van-col>
            <van-col span="7" class="table-cell">{{ item.transactionDescription }}</van-col>
            <van-col span="7" class="table-cell">{{ item.transactionTime }}</van-col>
          </van-row>

         </div>
         
      </van-collapse-item>
    </van-collapse>
  </div>


    <!-- 物品管理 -->
    <div class="stuff-list">

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
            :title="item.itemTitle"
            :thumb="item.firstImage"
            :tag="item.blockchainId"
          >
            <template #desc>
              <div class="item-info">
                <span class="item-id">编号: {{ item.id }}</span>
                <span :class="['item-status', `status-${item.transferStatus}`]">
                  {{ getStatusText(item.transferStatus) }}
                </span>
                <span :class="['item-status', `status-${item.status}`]">
                  {{ getItemStatusText(item.status) }}
                </span>
              </div>
            </template>
            <template #footer>
              <div class="action-buttons">
                <!-- 根据不同状态显示不同按钮 -->
                <template v-if="item.transferStatus === 'owned'">
                  <van-button v-if="item.status === 'active'" size="small" type="primary" @click="initiateTransfer(item)">
                    发起出让
                  </van-button>
                </template>
                <template v-if="item.transferStatus === 'transferring'">
                  <van-button size="small" plain type="primary" @click="cancelTransfer(item)">
                    取消出让
                  </van-button>
                  <van-button size="small" type="primary" @click="viewOffers(item)">
                    查看报价
                  </van-button>
                </template>
               
                <van-button size="small" type="primary" @click="viewStuffDetails(item)">
                    物品详情
                </van-button>
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
import { defineComponent, ref } from 'vue'
import {  showDialog, showToast,Collapse, CollapseItem, Col, Row } from 'vant'
import { useRouter } from 'vue-router'
type UserInfo = {
  "userId": string,
  "nickname": string,
  "realName": string,
  "gender": string,
  "birthday": string,
  "avatarUrl": string,
  "address": string,
  "wechat": string|undefined,
  "qq": string|undefined,
  "brief": string|undefined,
  "authStatus": string|undefined,
  "blockchainId": string|undefined,
  "tradeScore": number,
  "followers": number,
  "likes": number,
  "collects": number,
  "ipAddress": string,
}

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
    const activeTab = ref(0)
    const activeNames = ref(['1']); // 默认展开的折叠项
    const router = useRouter()
    // const activeTab = ref(0)

    // 状态列表
    const statusList = [
      { text: '我的物品', value: 'all' },
      { text: '拥有', value: 'owned' },
      { text: '转让中', value: 'transferring' },
      { text: '已转让', value: 'transferred' }
    ]

    // 模拟物品数据
    const items = ref([
        {
            "id": "2025032500010",
            "userId": "20250324000001",
            "itemTitle": "iphone 18",
            "itemType": "电子产品",
            "itemDescription": "刚买2个月，iphone正版",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "itemImageList": null,
            "depreciation": 9,
            "status": "active",
            "transferStatus": "owned",
            "transferTimes": 0,
            "lastUserId": "20250324000001",
            "blockchainId": "Hash0x000002244"
        },
        {
            "id": "2025032500011",
            "userId": "20250324000001",
            "itemTitle": "iphone 19",
            "itemType": "电子产品",
            "itemDescription": "刚买2个月，iphone正版",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "itemImageList": null,
            "depreciation": 9,
            "status": "auditing",
            "transferStatus": "owned",
            "transferTimes": 0,
            "lastUserId": "20250324000001",
            "blockchainId": "Hash0x000002244"
        },
        {
            "id": "2025032500012",
            "userId": "20250324000001",
            "itemTitle": "iphone 19",
            "itemType": "电子产品",
            "itemDescription": "刚买2个月，iphone正版",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "itemImageList": null,
            "depreciation": 9,
            "status": "inactive",
            "transferStatus": "owned",
            "transferTimes": 0,
            "lastUserId": "20250324000001",
            "blockchainId": "Hash0x000002244"
        },
        {
            "id": "2025032500013",
            "userId": "20250324000001",
            "itemTitle": "iphone 19",
            "itemType": "电子产品",
            "itemDescription": "刚买2个月，iphone正版",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "itemImageList": null,
            "depreciation": 9,
            "status": "active",
            "transferStatus": "transferring",
            "transferTimes": 0,
            "lastUserId": "20250324000001",
            "blockchainId": "Hash0x000002244"
        },
        {
            "id": "2025032500013",
            "userId": "20250324000001",
            "itemTitle": "iphone 19",
            "itemType": "电子产品",
            "itemDescription": "刚买2个月，iphone正版",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "itemImageList": null,
            "depreciation": 9,
            "status": "active",
            "transferStatus": "transferred",
            "transferTimes": 0,
            "lastUserId": "20250324000001",
            "blockchainId": "Hash0x000002244"
        }
      // ... 其他测试数据
    ])

    // 获取状态文本
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

    // 根据状态筛选物品
    const getFilteredItems = (status: string) => {
      if (status === 'all') return items.value
      return items.value.filter(item => item.transferStatus === status)
    }

    // 操作方法
    const initiateTransfer = (item: any) => {
      // showDialog({
      //   title: '确认出让',
      //   message: '确定要发起出让申请吗？',
      //   showCancelButton: true,
      // }).then(() => {
      //   // 调用API发起出让
      //   showToast('已提交出让申请')
      // })
      router.push('/stuff/transfer/' + item.id)
    }


    const cancelTransfer = (item: any) => {
      showDialog({
        title: '取消出让',
        message: '确定要取消出让申请吗？',
        showCancelButton: true,
      }).then(() => {
        item.transferStatus='owned'
        // 调用API取消出让
        showToast('已取消出让申请')
      })
    }



    const viewOffers = (item: any) => {
      router.push(`/stuff/offers/${item.id}`)
    }



    const viewStuffDetails = (item: any) => {
      router.push(`/stuff/detail/${item.id}`)
    }
    return {
      onClickLeft,
      openCamera,
      onShare,
      activeTab,
      activeNames,
      statusList,
      items,
      getStatusText,
      getFilteredItems,
      initiateTransfer,
      cancelTransfer,
      viewOffers,
      viewStuffDetails,
      getItemStatusText,
    }
  },
  data() {
    return {
      user: {
        "userId": "20250324000001",
        "nickname": "NPE",
        "realName": "张三丰",
        "gender": '男',
        "birthday": "1990-01-01",
        "avatarUrl": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        "address": "深圳市南山区xx小区",
        "wechat": "13800001234",
        "qq": "3738843",
        "brief": "这个人有点懒",
        "authStatus": 0,
        "blockchainId": "Hashweruworw939423",
        "tradeScore": 8.9000,
        "followers": 100,
        "likes": 8,
        "collects": 100,
        "ipAddress": "广东"
    },
      transactions: [
      {"tradeId":"2025032500012","userId":"20250324000001","tradeScore":5,"tradeRemark":"iphone 18","scoreTime":"2025-04-01 12:11:00"},
      {"tradeId":"2025032500013","userId":"20250324000001","tradeScore":5,"tradeRemark":"iphone 19","scoreTime":"2025-04-01 12:12:00"}
      ],
      usages: [
      {"id":"20250324000001","bizNo":"2025032500010","pointsChange":-100.0,"transactionType": "消费","transactionDescription":"购买物品","transactionTime":"2025-04-01 12:00:00"},
      {"id":"20250324000002","bizNo":"2025032500011","pointsChange": 100.0,"transactionType": "奖励","transactionDescription":"审核奖励","transactionTime":"2025-04-01 12:01:00"},
      {"id":"20250324000003","bizNo":"2025032500012","pointsChange": 100.0,"transactionType": "卖出收入","transactionDescription":"换物-iphone16","transactionTime":"2025-04-01 12:02:00"}
      ],
      pointsAccount:{
        "id": "20250324000001",
        "userId": "20250324000001",
        "pointsBalance": 10000.0000,
        "frozenPoints": 0.0000
    }
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
.status-transferring { background: #fff7e8; color: #ff976a; }
.status-rejected { background: #fef0f0; color: #ee0a24; }
.status-available { background: #e8fff3; color: #07c160; }
.status-trading { background: #f0f9eb; color: #67c23a; }
.status-transferred { background: #ffffff; color: #909399; }
.status-destroyed { background: #666666; color: #ffffff; }

.status-active { background: #1b983c; color: #ffffff; }
.status-auditing { background: #d7ea08; color: #ffffff; }
.status-inactive { background: #f0fef5b6; color: #ee0a24; }

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

.table-container {
  width: 100%;
  overflow-x: auto;
}

.table-row {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #eee;
}

.table-header {
  background-color: #f5f5f5;
  font-weight: bold;
  padding: 10px 0;
}

.table-cell-container {
  padding: 10px 0;
}

.table-cell {
  flex: 1;
  text-align: center;
  padding: 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 响应式样式 */
@media (max-width: 600px) {
  .table-row {
    flex-wrap: wrap;
  }
  
  .table-cell {
    flex: 1 1 33.33%;
  }
}

@media (max-width: 400px) {
  .table-cell {
    flex: 1 1 50%;
  }
}

@media (max-width: 300px) {
  .table-cell {
    flex: 1 1 100%;
  }
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
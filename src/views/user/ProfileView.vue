<template>
  <van-nav-bar
      title="我的"
      left-arrow
      @click-left="onClickLeft"
    />
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
              <div class="nickname">{{ user.nickname }}</div>
              <van-tag :type="user.role === '卖家' ? 'danger' : 'primary'">
                {{ user.role }}
              </van-tag>
            </div>
          </div>
        </template>
        
        <template #footer>
          <div class="balance">
            <van-icon name="balance-o" size="18" />
            <span>虚拟币余额: {{ user.balance }}</span>
          </div>
        </template>
      </van-card>
  
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
  </template>
  
  <script>
  import { showDialog } from 'vant';
  import { useRouter } from 'vue-router'

  export default {
    setup() {
      const router = useRouter()
       // 返回上一页
      const onClickLeft = () => {
        router.back()
      }

      return {onClickLeft}
    },
    data() {
      return {
        user: {
          avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d',
          nickname: '用户昵称',
          role: '卖家', // 或 '买家'
          balance: '1000'
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
      showTransactionDetail(transaction) {
        showDialog({
          title: '交易详情',
          message: `交易哈希: ${transaction.hash}\n交易时间: ${transaction.time}\n交易金额: ${transaction.amount}`
        });
      }
    }
  };
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
  }
  
  .nickname {
    font-size: 18px;
    font-weight: bold;
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
  </style>
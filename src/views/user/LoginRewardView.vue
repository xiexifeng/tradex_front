<template>
  <div class="login-reward-page">
    <van-nav-bar
      title="每日登录奖励"
      left-arrow
      @click-left="$router.back()"
      class="reward-nav"
    />

    <div class="reward-content">
      <!-- 规则说明 -->
      <div class="rules-card">
        <div class="rules-title">
          <van-icon name="info-o" />
          <span>奖励规则</span>
        </div>
        <ul class="rules-list">
          <li>每日登录可领取 <strong>1</strong> 积分；</li>
          <li>连续登录 <strong>10</strong> 天，额外赠送 <strong>5</strong> 积分；</li>
          <li>当月 <strong>满勤</strong>（全部天数均登录并领取），额外赠送 <strong>10</strong> 积分；</li>
          <li>当日登录后请及时领取，过期未领取的积分将失效。</li>
        </ul>
      </div>

      <!-- 当月日历 -->
      <div class="calendar-card">
        <div class="calendar-header">
          <span class="month-title">{{ monthTitle }}</span>
        </div>
        <div class="calendar-weekdays">
          <span v-for="w in weekdays" :key="w" class="weekday">{{ w }}</span>
        </div>
        <div class="calendar-grid" v-if="calendarDays.length">
          <template v-for="(cell, index) in calendarDays" :key="index">
            <div v-if="cell.empty" class="day-cell empty"></div>
            <div
              v-else
              :class="['day-cell', 'day-' + cell.status, { clickable: cell.status === 0 }]"
              @click="cell.status === 0 ? onReceive(cell) : null"
            >
              <span class="day-num">{{ cell.day }}</span>
              <span v-if="cell.status !== -1" class="day-points">+{{ cell.rewardPoint }}</span>
              <span v-if="cell.status === 0" class="day-action">点击领取</span>
              <span v-else-if="cell.status === 1" class="day-done">已领取</span>
              <span v-else-if="cell.status === 2" class="day-expired">已过期</span>
            </div>
          </template>
        </div>
      </div>

      <!-- 图例 -->
      <div class="legend">
        <span class="legend-item"><i class="dot not-login"></i> 未登录</span>
        <span class="legend-item"><i class="dot can-receive"></i> 可领取</span>
        <span class="legend-item"><i class="dot received"></i> 已领取</span>
        <span class="legend-item"><i class="dot expired"></i> 已过期</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { getLoginRewardMonthList, receiveLoginReward } from '@/api/user'
import type { LoginRewardDayItem } from '@/api/types'

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

interface DayCell {
  empty?: boolean
  day?: number
  dateStr?: string
  status: number
  rewardPoint: number
}

export default defineComponent({
  name: 'LoginRewardView',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const userId = computed(() => userStore.userInfo?.userId || '')
    const list = ref<LoginRewardDayItem[]>([])
    const loading = ref(false)
    const currentYear = ref(new Date().getFullYear())
    const currentMonth = ref(new Date().getMonth() + 1)

    const monthTitle = computed(() => {
      return `${currentYear.value}年${currentMonth.value}月`
    })

    const dayMap = computed(() => {
      const map: Record<string, LoginRewardDayItem> = {}
      list.value.forEach(item => {
        map[item.loginDate] = item
      })
      return map
    })

    const calendarDays = computed(() => {
      const year = currentYear.value
      const month = currentMonth.value
      const first = new Date(year, month - 1, 1)
      const last = new Date(year, month, 0)
      const firstWeekday = first.getDay()
      const totalDays = last.getDate()
      const cells: DayCell[] = []

      for (let i = 0; i < firstWeekday; i++) {
        cells.push({ empty: true, status: -1, rewardPoint: 0 })
      }
      for (let d = 1; d <= totalDays; d++) {
        const dateStr = `${year}${String(month).padStart(2, '0')}${String(d).padStart(2, '0')}`
        const item = dayMap.value[dateStr]
        cells.push({
          day: d,
          dateStr,
          status: item ? item.rewardStatus : -1,
          rewardPoint: item ? item.rewardPoint : 0
        })
      }
      return cells
    })

    const fetchList = async () => {
      const id = userId.value
      if (!id) {
        showToast('请先登录')
        router.push('/login')
        return
      }
      loading.value = true
      try {
        const res = await getLoginRewardMonthList(id)
        if (res.success && res.data) {
          list.value = res.data
        }
      } catch (e) {
        console.error('获取登录奖励月列表失败', e)
      } finally {
        loading.value = false
      }
    }

    const onReceive = async (cell: DayCell) => {
      if (cell.empty || cell.status !== 0 || !cell.dateStr) return
      const id = userId.value
      if (!id) return
      try {
        const res = await receiveLoginReward({
          userId: id,
          loginDate: cell.dateStr,
          rewardPoint: cell.rewardPoint
        })
        if (res.code === '000000') {
          showToast('领取成功')
          await fetchList()
        } else {
          showToast(res.desc || '领取失败')
        }
      } catch (e) {
        console.error('领取失败', e)
      }
    }

    onMounted(() => {
      fetchList()
    })

    return {
      weekdays,
      monthTitle,
      calendarDays,
      onReceive
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.login-reward-page {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 24px;
}

.reward-nav {
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #39a0ff);
    .van-nav-bar__title,
    .van-icon {
      color: #fff;
    }
  }
}

.reward-content {
  padding: 12px;
}

.rules-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px 16px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  .rules-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
    color: #323233;
    margin-bottom: 10px;

    .van-icon {
      color: #1989fa;
    }
  }

  .rules-list {
    margin: 0;
    padding-left: 20px;
    color: #646566;
    font-size: 13px;
    line-height: 1.8;

    strong {
      color: #1989fa;
    }
  }
}

.calendar-card {
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.calendar-header {
  text-align: center;
  margin-bottom: 12px;

  .month-title {
    font-size: 16px;
    font-weight: 600;
    color: #323233;
  }
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;

  .weekday {
    text-align: center;
    font-size: 12px;
    color: #969799;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-size: 12px;
  min-height: 44px;

  &.empty {
    background: transparent;
  }

  &.day--1 {
    background: #f0f0f0;
    color: #c8c9cc;

    .day-num {
      color: #969799;
    }
  }

  &.day-0 {
    background: linear-gradient(135deg, #e8f4ff, #fff7e6);
    border: 1px solid #1989fa;
    color: #1989fa;

    .day-num {
      font-weight: 600;
    }
    .day-action {
      font-size: 10px;
      margin-top: 2px;
    }
    &.clickable {
      cursor: pointer;
      &:active {
        opacity: 0.85;
      }
    }
  }

  &.day-1 {
    background: #e8f8f0;
    color: #07c160;

    .day-done {
      font-size: 10px;
      margin-top: 2px;
    }
  }

  &.day-2 {
    background: #f5f5f5;
    color: #969799;

    .day-expired {
      font-size: 10px;
      margin-top: 2px;
    }
  }

  .day-num {
    font-size: 14px;
  }
  .day-points {
    font-size: 11px;
    font-weight: 600;
    margin-top: 2px;
  }
}

.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  padding: 12px;
  font-size: 12px;
  color: #646566;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: inline-block;

    &.not-login {
      background: #c8c9cc;
    }
    &.can-receive {
      background: #1989fa;
    }
    &.received {
      background: #07c160;
    }
    &.expired {
      background: #969799;
    }
  }
}
</style>

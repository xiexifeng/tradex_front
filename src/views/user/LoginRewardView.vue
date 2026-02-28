<template>
  <div class="login-reward-page">
    <van-nav-bar
      title="每日奖励"
      left-arrow
      @click-left="$router.back()"
      class="reward-nav"
    />

    <div class="reward-content">
      <!-- 当月日历（不超过屏幕 1/3，首屏留空间给每日任务） -->
      <div class="calendar-card">
        <div class="calendar-header">
          <span class="month-title">{{ monthTitle }}</span>
          <span class="rules-link" @click="showRulesPopup = true">每日登录奖励规则</span>
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
              <span v-if="cell.status === 0" class="day-action">领</span>
              <span v-else-if="cell.status === 1" class="day-done">已领</span>
              <span v-else-if="cell.status === 2" class="day-expired">过期</span>
            </div>
          </template>
        </div>
        <div class="legend-inline">
          <span><i class="dot not-login"></i>未登录</span>
          <span><i class="dot can-receive"></i>可领</span>
          <span><i class="dot received"></i>已领</span>
          <span><i class="dot expired"></i>过期</span>
        </div>
      </div>

      <!-- 每日任务 -->
      <div class="tasks-card">
        <div class="tasks-title">
          <span class="tasks-title-left">
            <van-icon name="todo-list-o" />
            <span>每日任务</span>
          </span>
          <span class="rules-link" @click="showTaskRulesPopup = true">每日任务奖励规则</span>
        </div>
        <van-loading v-if="taskLoading" class="task-loading" size="24" vertical>加载中...</van-loading>
        <template v-else>
          <div
            v-for="task in dailyTasks"
            :key="task.taskCode"
            class="task-item"
            :class="{ done: task.taskState === 2 }"
          >
            <div class="task-main">
              <div class="task-name">{{ task.taskName }}</div>
              <div class="task-desc">{{ task.taskDesc }}</div>
              <div class="task-progress">
                <span class="progress-text">{{ task.finishNum }} / {{ task.targetNum }}</span>
                <van-progress :percentage="progressPercent(task)" stroke-width="6" />
              </div>
              <div class="task-footer">
                <span class="reward-point">+{{ task.rewardPoint }} 积分</span>
                <van-button
                  v-if="task.taskState === 2"
                  size="small"
                  type="default"
                  plain
                  disabled
                  class="btn-do"
                >
                  已完成
                </van-button>
                <van-button
                  v-else
                  size="small"
                  type="primary"
                  class="btn-do"
                  @click="onGoTask(task)"
                >
                  去完成
                </van-button>
              </div>
            </div>
          </div>
          <van-empty v-if="!taskLoading && dailyTasks.length === 0" description="暂无每日任务" />
        </template>
      </div>
    </div>

    <!-- 每日登录奖励规则弹窗 -->
    <van-popup
      v-model:show="showRulesPopup"
      position="center"
      round
      class="rules-popup"
      :style="{ width: '90%', maxWidth: '360px' }"
    >
      <div class="rules-popup-content">
        <div class="rules-popup-title">每日登录奖励规则</div>
        <ol class="rules-list">
          <li>每日登录可领取 <strong>1</strong> 积分；</li>
          <li>连续登录 <strong>10</strong> 天，额外赠送 <strong>5</strong> 积分；</li>
          <li>当月 <strong>满勤</strong>（全部天数均登录并领取），额外赠送 <strong>10</strong> 积分；</li>
          <li>当日登录后请及时领取，过期未领取的积分将失效。</li>
        </ol>
      </div>
    </van-popup>

    <!-- 每日任务奖励规则弹窗 -->
    <van-popup
      v-model:show="showTaskRulesPopup"
      position="center"
      round
      class="rules-popup"
      :style="{ width: '90%', maxWidth: '360px' }"
    >
      <div class="rules-popup-content">
        <div class="rules-popup-title">每日任务奖励规则</div>
        <ol class="rules-list">
          <li>完成每个任务即可领取对应的 <strong>积分</strong> 奖励；</li>
          <li>任务类型包括：点赞、发布物品、评价、分享等，按任务要求完成即可；</li>
          <li>每日 <strong>0 点</strong> 刷新任务列表，请当日完成并领取奖励；</li>
          <li>任务完成后请及时领取积分，<strong>过期未领取</strong>的奖励将失效。</li>
        </ol>
      </div>
    </van-popup>

    <!-- 分享弹窗（公用） -->
    <ShareDialog
      v-model:show="showShareDialog"
      :share-title="shareOptions.shareTitle"
      :share-desc="shareOptions.shareDesc"
      :share-image="shareOptions.shareImage"
      :share-url="shareOptions.shareUrl"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { getLoginRewardMonthList, receiveLoginReward, getDailyTaskList } from '@/api/user'
import type { LoginRewardDayItem } from '@/api/types'
import type { DailyTaskItem } from '@/api/types'
import { useShareDialog } from '@/composables/useShareDialog'
import ShareDialog from '@/components/ShareDialog.vue'

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
  components: { ShareDialog },
  setup() {
    const router = useRouter()
    const userStore = useUserStore()
    const userId = computed(() => userStore.userInfo?.userId || '')
    const list = ref<LoginRewardDayItem[]>([])
    const loading = ref(false)
    const currentYear = ref(new Date().getFullYear())
    const currentMonth = ref(new Date().getMonth() + 1)
    const showRulesPopup = ref(false)
    const showTaskRulesPopup = ref(false)
    const dailyTasks = ref<DailyTaskItem[]>([])
    const taskLoading = ref(false)

    const { showShareDialog, shareOptions, openShare } = useShareDialog()

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

    const progressPercent = (task: DailyTaskItem) => {
      if (task.targetNum <= 0) return 0
      return Math.min(100, Math.round((task.finishNum / task.targetNum) * 100))
    }

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

    const fetchDailyTasks = async () => {
      const id = userId.value
      if (!id) return
      taskLoading.value = true
      try {
        const res = await getDailyTaskList(id)
        if (res.success && res.data) {
          dailyTasks.value = res.data
        }
      } catch (e) {
        console.error('获取每日任务失败', e)
      } finally {
        taskLoading.value = false
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

    const onGoTask = (task: DailyTaskItem) => {
      if (task.taskState === 2) return
      const type = task.taskType
      if (type === 1) {
        router.push('/')
      } else if (type === 2) {
        router.push('/stuff/publish')
      } else if (type === 3) {
        router.push('/stuff/trades')
      } else if (type === 4) {
        const baseUrl = window.location.origin
        openShare({
          shareTitle: '每日任务 - 分享得积分',
          shareDesc: '一起来体验区块链电商的便利吧！',
          shareImage: userStore.userInfo?.avatarUrl || '',
          shareUrl: `${baseUrl}/user/login-reward`
        })
      }
    }

    onMounted(() => {
      fetchList()
      fetchDailyTasks()
    })

    return {
      weekdays,
      monthTitle,
      calendarDays,
      showRulesPopup,
      showTaskRulesPopup,
      dailyTasks,
      taskLoading,
      progressPercent,
      onReceive,
      onGoTask,
      showShareDialog,
      shareOptions
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
  display: flex;
  flex-direction: column;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.calendar-card {
  background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
  border-radius: 14px;
  padding: 10px 12px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  max-height: 33vh;
  display: flex;
  flex-direction: column;
  min-height: 0;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
  flex-shrink: 0;

  .month-title {
    font-size: 14px;
    font-weight: 700;
    color: #323233;
  }

  .rules-link {
    font-size: 12px;
    font-weight: 500;
    color: #1989fa;
    cursor: pointer;
    &:active { opacity: 0.8; }
  }
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  margin-bottom: 4px;
  flex-shrink: 0;

  .weekday {
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #323233;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  flex: 1;
  min-height: 0;
  grid-auto-rows: 28px;
}

.day-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 11px;
  min-height: 0;
  height: 28px;
  width: 100%;
  box-sizing: border-box;
  min-width: 28px;

  &.empty {
    background: transparent;
  }

  &.day--1 {
    background: #e8e9eb;
    color: #969799;
    .day-num { color: #969799; font-weight: 500; }
  }

  &.day-0 {
    background: linear-gradient(145deg, #d4ebff 0%, #e8f4ff 50%, #fff4e0 100%);
    border: 1.5px solid #1989fa;
    color: #1989fa;
    box-shadow: 0 1px 3px rgba(25, 137, 250, 0.2);
    .day-num { font-weight: 700; font-size: 13px; }
    .day-points { font-size: 10px; }
    .day-action { font-size: 10px; margin-top: 0; font-weight: 600; }
    &.clickable {
      cursor: pointer;
      &:active { opacity: 0.9; transform: scale(0.97); }
    }
  }

  &.day-1 {
    background: linear-gradient(145deg, #d4f0e0 0%, #e8f8f0 100%);
    border: 1px solid rgba(7, 193, 96, 0.35);
    color: #07c160;
    .day-num { font-weight: 600; }
    .day-done { font-size: 10px; margin-top: 0; font-weight: 600; }
  }

  &.day-2 {
    background: #ebeced;
    color: #969799;
    .day-num { color: #969799; }
    .day-expired { font-size: 10px; margin-top: 0; color: #969799; }
  }

  .day-num { font-size: 12px; }
  .day-points { font-size: 10px; font-weight: 600; margin-top: 0; }
}

.legend-inline {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 6px;
  font-size: 11px;
  font-weight: 500;
  color: #646566;
  flex-shrink: 0;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 3px;
    vertical-align: middle;
    &.not-login { background: #c8c9cc; }
    &.can-receive { background: #1989fa; box-shadow: 0 0 0 1px rgba(25, 137, 250, 0.3); }
    &.received { background: #07c160; box-shadow: 0 0 0 1px rgba(7, 193, 96, 0.3); }
    &.expired { background: #969799; }
  }
}

.tasks-card {
  background: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  flex: 1;
  min-width: 0;

  .tasks-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 12px;

    .tasks-title-left {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 15px;
      font-weight: 600;
      color: #323233;
      .van-icon { color: #1989fa; }
    }

    .rules-link {
      font-size: 12px;
      font-weight: 500;
      color: #1989fa;
      cursor: pointer;
      flex-shrink: 0;
      &:active { opacity: 0.8; }
    }
  }

  .task-loading {
    padding: 24px;
  }

  .task-item {
    border: 1px solid #ebedf0;
    border-radius: 10px;
    padding: 12px;
    margin-bottom: 10px;
    background: #fafafa;

    &:last-child { margin-bottom: 0; }
    &.done {
      background: #f0f9f4;
      border-color: #e8f8f0;
    }

    .task-main {
      .task-name {
        font-size: 14px;
        font-weight: 600;
        color: #323233;
        margin-bottom: 4px;
      }
      .task-desc {
        font-size: 12px;
        color: #969799;
        margin-bottom: 8px;
      }
      .task-progress {
        margin-bottom: 8px;
        .progress-text {
          font-size: 12px;
          color: #646566;
          margin-bottom: 4px;
          display: block;
        }
      }
      .task-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .reward-point {
          font-size: 12px;
          color: #1989fa;
          font-weight: 500;
        }
        .btn-do {
          flex-shrink: 0;
        }
      }
    }
  }
}

.rules-popup-content {
  padding: 20px 16px;
  text-align: left;

  .rules-popup-title {
    font-size: 16px;
    font-weight: 600;
    color: #323233;
    margin-bottom: 14px;
    text-align: left;
  }

  .rules-list {
    margin: 0;
    padding-left: 22px;
    color: #646566;
    font-size: 14px;
    line-height: 1.9;
    text-align: left;
    list-style-type: decimal;

    li {
      margin-bottom: 6px;
      padding-left: 4px;
    }
    strong { color: #1989fa; }
  }
}
</style>

<template>
  <div class="notification-list">
    <template v-if="notifications.length">
      <van-cell
        v-for="item in notifications"
        :key="item.id"
        :title="item.title"
        :label="item.content"
        :class="{ unread: item.status === 0 }"
        @click="$emit('click-item', item)"
      >
        <template #value>
          <div class="notification-meta">
            <span class="time">{{ formatTime(item.createTime) }}</span>
            <van-tag 
              :type="getTypeTag(item.notificationType)"
              round
              size="small"
            >
              {{ getTypeText(item.notificationType) }}
            </van-tag>
          </div>
        </template>
      </van-cell>
    </template>
    <van-empty v-else description="暂无消息" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default defineComponent({
  props: {
    notifications: {
      type: Array,
      required: true
    }
  },
  emits: ['click-item'],
  setup() {
    const formatTime = (time: string) => {
      return formatDistanceToNow(new Date(time), { 
        addSuffix: true,
        locale: zhCN
      })
    }

    const getTypeText = (type: number) => {
      const typeMap: Record<number, string> = {
        1: '系统',
        2: '交易',
        3: '评分',
        4: '积分'
      }
      return typeMap[type] || '其他'
    }

    const getTypeTag = (type: number) => {
      const typeMap: Record<number, string> = {
        1: 'primary',
        2: 'success',
        3: 'warning',
        4: 'danger'
      }
      return typeMap[type] || 'default'
    }

    return {
      formatTime,
      getTypeText,
      getTypeTag
    }
  }
})
</script>

<style scoped>
.notification-list {
  padding: 8px 0;
}

.notification-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.time {
  font-size: 12px;
  color: #969799;
}

.unread {
  background-color: #f7f8fa;
}

.unread::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background-color: #ee0a24;
  border-radius: 50%;
}

:deep(.van-cell__title) {
  padding-left: 12px;
}
</style> 
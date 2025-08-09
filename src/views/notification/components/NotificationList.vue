<template>
  <div class="notification-list">
    <template v-if="notifications && notifications.length">
      <div v-for="item in notifications" 
           :key="item.id" 
           class="notification-item"
           @click="$emit('click-item', item)">
        <div class="notification-header">
          <div class="title">
            <div :class="['type-icon', item.notificationType.toLowerCase() === 'system' ? 'system' : 'trade']">
              <van-icon :name="item.notificationType.toLowerCase() === 'system' ? 'info-o' : 'exchange'"/>
            </div>
            <span>{{ item.title }}</span>
          </div>
          <div :class="['status-tag', item.status === 0 ? 'unread' : 'read']">
            {{ item.status === 1 ? '未读' : '已读' }}
          </div>
        </div>
        <div class="notification-content">
          {{ item.content }}
          <div class="time">
            <van-icon name="clock-o"/>
            <span>{{ formatTime(item.createTime) }}</span>
          </div>
        </div>
        <div class="notification-footer">
          <div class="action-link">
            查看详情
            <van-icon name="arrow"/>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="empty-state">
        <van-empty description="暂无消息"/>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'NotificationList',
  props: {
    notifications: {
      type: Array,
      default: () => []
    }
  },
  emits: ['click-item'],
  setup() { 
    const formatTime = (timestamp: number) => {
      const date = new Date(timestamp);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      const s = String(date.getSeconds()).padStart(2, '0');
      return `${y}-${m}-${d} ${h}:${min}:${s}`;
    }
    return {
      formatTime
    }
  }
})

</script>

<style lang="scss" scoped>
.notification-list {
  padding: 12px;
  
  .notification-item {
    background: #fff;
    border-radius: 12px;
    margin-bottom: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.3s ease;
    position: relative;
    
    &:active {
      transform: scale(0.98);
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(to bottom, #1989fa, #0066ff);
      border-radius: 4px 0 0 4px;
    }
    
    .notification-header {
      padding: 16px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      .title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 15px;
        font-weight: 500;
        color: #323233;
        
        .type-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 18px;
          
          &.system {
            color: #1989fa;
            background: rgba(25, 137, 250, 0.1);
          }
          
          &.trade {
            color: #1989fa;
            background: rgba(25, 137, 250, 0.1);
          }
        }
      }
      
      .status-tag {
        padding: 2px 12px;
        border-radius: 12px;
        font-size: 12px;
        
        &.unread {
          color: #1989fa;
          background: rgba(25, 137, 250, 0.1);
        }
        
        &.read {
          color: #969799;
          background: #f5f5f5;
        }
      }
    }
    
    .notification-content {
      padding: 16px;
      background: #fafafa;
      color: #666;
      font-size: 14px;
      line-height: 1.5;
      
      .time {
        margin-top: 8px;
        display: flex;
        align-items: center;
        gap: 4px;
        color: #969799;
        font-size: 12px;
      }
    }
    
    .notification-footer {
      padding: 12px 16px;
      border-top: 1px solid #f5f5f5;
      display: flex;
      justify-content: flex-end;
      
      .action-link {
        color: #1989fa;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;
        
        &:active {
          opacity: 0.8;
        }
      }
    }
  }
  
  .empty-state {
    padding: 32px 16px;
    background: #fff;
    border-radius: 12px;
    margin-top: 12px;
  }
}
</style> 
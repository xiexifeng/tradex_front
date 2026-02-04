<template>
  <div class="notification-list">
    <template v-if="notifications && notifications.length">
      <div v-for="item in notifications" 
           :key="item.id" 
           :class="['notification-item', { 'unread': item.status === 1 }]"
           @click="$emit('click-item', item)">
        <!-- 未读指示点 -->
        <div v-if="item.status === 1" class="unread-dot"></div>
        
        <!-- 图标 -->
        <div :class="['type-icon', getIconClass(item.notificationType)]">
          <van-icon :name="getIconName(item.notificationType)"/>
        </div>
        
        <!-- 内容区域 -->
        <div class="content-wrapper">
          <div class="header-row">
            <h3 class="title">{{ item.title }}</h3>
            <span class="time">{{ formatTime(item.createTime) }}</span>
          </div>
          <p class="content">{{ item.content }}</p>
        </div>
        
        <!-- 右侧箭头 -->
        <van-icon name="arrow" class="arrow-icon"/>
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
      const now = Date.now();
      const diff = now - timestamp;
      const date = new Date(timestamp);
      
      // 小于1分钟
      if (diff < 60000) {
        return '刚刚';
      }
      // 小于1小时
      if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`;
      }
      // 小于24小时
      if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`;
      }
      // 小于7天
      if (diff < 604800000) {
        return `${Math.floor(diff / 86400000)}天前`;
      }
      // 超过7天，显示日期
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      const h = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${m}-${d} ${h}:${min}`;
    }
    
    const getIconClass = (type: string) => {
      switch (type.toLowerCase()) {
        case 'system':
          return 'system';
        case 'audit':
          return 'audit';
        default:
          return 'trade';
      }
    }
    
    const getIconName = (type: string) => {
      switch (type.toLowerCase()) {
        case 'system':
          return 'info-o';
        case 'audit':
          return 'check-circle-o';
        default:
          return 'exchange';
      }
    }
    
    return {
      formatTime,
      getIconClass,
      getIconName
    }
  }
})

</script>

<style lang="scss" scoped>
.notification-list {
  padding: 8px 12px;
  
  .notification-item {
    background: #fff;
    border-radius: 8px;
    margin-bottom: 8px;
    padding: 12px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    position: relative;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
    transition: all 0.2s ease;
    border: 1px solid #f0f0f0;
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    }
    
    &.unread {
      border-left: 3px solid #1989fa;
      background: #f8faff;
      
      .title {
        font-weight: 600;
        color: #323233;
      }
    }
    
    .unread-dot {
      position: absolute;
      left: 4px;
      top: 16px;
      width: 8px;
      height: 8px;
      background: #1989fa;
      border-radius: 50%;
      box-shadow: 0 0 0 2px #fff;
    }
    
    .type-icon {
      flex-shrink: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 20px;
      
      &.system {
        color: #1989fa;
        background: linear-gradient(135deg, rgba(25, 137, 250, 0.1), rgba(25, 137, 250, 0.15));
      }
      
      &.trade {
        color: #07c160;
        background: linear-gradient(135deg, rgba(7, 193, 96, 0.1), rgba(7, 193, 96, 0.15));
      }
      
      &.audit {
        color: #fa8c16;
        background: linear-gradient(135deg, rgba(250, 140, 22, 0.1), rgba(250, 140, 22, 0.15));
      }
    }
    
    .content-wrapper {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
      
      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 8px;
        
        .title {
          flex: 1;
          font-size: 15px;
          font-weight: 500;
          color: #323233;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .time {
          flex-shrink: 0;
          font-size: 12px;
          color: #969799;
          white-space: nowrap;
        }
      }
      
      .content {
        font-size: 13px;
        color: #646566;
        line-height: 1.5;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        word-break: break-word;
      }
    }
    
    .arrow-icon {
      flex-shrink: 0;
      color: #c8c9cc;
      font-size: 16px;
      margin-top: 2px;
    }
  }
  
  .empty-state {
    padding: 48px 16px;
    text-align: center;
  }
}
</style> 
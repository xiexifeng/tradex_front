<template>
  <div class="status-tag" :class="[type, status]">
    <template v-if="type === 'item'">
      <template v-if="transferStatus === 'own'">
        {{ getItemStatusText(status) }}
      </template>
      <template v-else>
        {{ getStatusText(transferStatus) }}
      </template>
    </template>
    <template v-else>
      {{ getValueText(value, type) }}
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { getValueText } from '@/constants/stuff'

export default defineComponent({
  name: 'StatusTag',
  props: {
    // 状态类型：item(物品状态), delivery(交付方式), trade(交易方式)等
    type: {
      type: String as PropType<'item' | 'deliveryMethod' | 'tradeMethod'>,
      required: true
    },
    // 状态值
    value: {
      type: String,
      required: true
    },
    // 转让状态（仅当type为item时需要）
    transferStatus: {
      type: String,
      default: ''
    },
    // 状态
    status: {
      type: String,
      default: ''
    }
  },
  setup() {
    const getStatusText = (status: string) => {
      return getValueText(status, 'status')
    }

    const getItemStatusText = (status: string) => {
      return getValueText(status, 'itemStatus')
    }

    return {
      getValueText,
      getStatusText,
      getItemStatusText
    }
  }
})
</script>

<style lang="scss" scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;

  // 物品状态样式
  &.item {
    &.active { background: #e8fff3; color: #07c160; }
    &.auditing { background: #fff7e8; color: #ff976a; }
    &.inactive { background: #fef0f0; color: #ee0a24; }
  }

  // 交付方式样式
  &.deliveryMethod {
    background: #fff7e8;
    color: #ff976a;
  }

  // 交易方式样式
  &.tradeMethod {
    background: #e8f3ff;
    color: #1989fa;
  }
}
</style> 
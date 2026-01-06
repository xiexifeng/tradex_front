<template>
  <div class="bottom-bar">
    <div class="bottom-bar__left">
      <slot name="left" />
    </div>
    <div class="bottom-bar__right">
      <slot name="right" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'BottomBar'
})
</script>

<style scoped lang="scss">
@import '@/styles/theme.scss';

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: var(--van-background-2, #fff);
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;

  &__left {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  &__right {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
</style>

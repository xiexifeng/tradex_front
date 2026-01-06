<template>
  <div class="base-card" :class="variantClass" :style="cardStyle">
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'BaseCard',
  props: {
    padding: {
      type: String,
      default: '16px'
    },
    radius: {
      type: String,
      default: 'var(--van-radius-lg)'
    },
    variant: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const cardStyle = computed(() => ({
      padding: props.padding,
      borderRadius: props.radius
    }))

    const variantClass = computed(() => (props.variant ? `base-card--${props.variant}` : ''))

    return {
      cardStyle,
      variantClass
    }
  }
})
</script>

<style lang="scss" scoped>
@import '@/styles/theme.scss';

.base-card {
  @include card;
  width: 100%;
  box-sizing: border-box;
  background: var(--van-background-2, #fff);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &--interactive {
    cursor: pointer;

    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    }
  }
}
</style>

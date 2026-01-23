<template>
  <van-popup
    v-model:show="innerShow"
    position="bottom"
    round
    closeable
    :style="{ height }"
  >
    <div class="exchange-popup">
      <div class="popup-title">{{ title }}</div>
      <van-form @submit="onSubmit">
        <van-cell-group inset>
          <van-field
            v-if="showPoints"
            v-model="localPoints"
            name="tradePoints"
            label="支付积分"
            type="number"
            :readonly="true"
          />
          <van-field
            v-model="password"
            name="tradePassword"
            :label="passwordLabel"
            type="password"
            maxlength="6"
            :placeholder="passwordPlaceholder"
            :rules="passwordRules"
          />
        </van-cell-group>
        <div class="submit-button">
          <van-button
            round
            block
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            {{ submitText }}
          </van-button>
        </div>
      </van-form>
    </div>
  </van-popup>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue'

export default defineComponent({
  name: 'PointsPayPopup',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    tradePoints: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '40%'
    },
    title: {
      type: String,
      default: '积分支付'
    },
    submitText: {
      type: String,
      default: '确认支付'
    },
    showPoints: {
      type: Boolean,
      default: true
    },
    passwordLabel: {
      type: String,
      default: '支付密码'
    },
    passwordPlaceholder: {
      type: String,
      default: '请输入6位支付密码'
    }
  },
  emits: ['update:show', 'submit'],
  setup(props, { emit }) {
    const innerShow = ref(props.show)
    const password = ref('')
    const localPoints = ref(props.tradePoints)

    const passwordRules = computed(() => ([
      { required: true, message: '请输入支付密码' },
      { pattern: /^\d{6}$/, message: '请输入6位数字密码' }
    ]))

    watch(() => props.show, val => {
      innerShow.value = val
      if (!val) {
        password.value = ''
      }
    })

    watch(innerShow, val => {
      emit('update:show', val)
      if (!val) {
        password.value = ''
      }
    })

    watch(
      () => props.tradePoints,
      val => {
        localPoints.value = val
      }
    )

    const onSubmit = () => {
      emit('submit', {
        tradePassword: password.value
      })
    }

    return {
      innerShow,
      password,
      localPoints,
      passwordRules,
      onSubmit
    }
  }
})
</script>

<style scoped lang="scss">
.exchange-popup {
  padding: 16px;
}

.popup-title {
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 12px;
}

.submit-button {
  margin: 16px;
}
</style>


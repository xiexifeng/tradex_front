<template>
  <div class="address-list">
    <van-nav-bar
      title="收货地址"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="address-content">
      <van-address-list
        v-model="selectedAddressId"
        :list="addressList"
        default-tag-text="默认"
        @add="onAdd"
        @edit="onEdit"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AddressListAddress } from 'vant';

export default defineComponent({
  name: 'AddressListView',
  setup() {
    const router = useRouter()
    const selectedAddressId = ref('1')
    
    const addressList = ref<AddressListAddress[]>([
      {
        id: '1',
        name: '张三',
        tel: '13000000000',
        address: '浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室',
        isDefault: true,
      },
      {
        id: '2',
        name: '李四',
        tel: '1310000000',
        address: '浙江省杭州市拱墅区莫干山路 50 号',
      },
    ]);

    const onClickLeft = () => {
      router.back()
    }

    const onAdd = () => {
      router.push('/user/address/new')
    }

    const onEdit = (item: AddressListAddress) => {
      router.push(`/user/address/edit/${item.id}`)
    }

    return {
      selectedAddressId,
      addressList,
      onClickLeft,
      onAdd,
      onEdit
    }
  }
})
</script>

<style scoped>
.address-list {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.address-content {
  padding: 12px;
}
</style> 
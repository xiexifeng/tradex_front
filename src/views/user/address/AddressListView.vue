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
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { AddressListAddress } from 'vant';
import { addressApi } from '@/api/address';
import type { ReceiveAddress } from '@/api/types';

export default defineComponent({
  name: 'AddressListView',
  setup() {
    const router = useRouter()
    const selectedAddressId = ref<string | undefined>(undefined)
    const addressList = ref<AddressListAddress[]>([])
    const rawList = ref<ReceiveAddress[]>([])

    const loadAddresses = async () => {
      try {
        const res = await addressApi.listReceiveAddress()
        const list = (res.data as unknown as ReceiveAddress[]) || []
        rawList.value = list
        addressList.value = list.map(item => ({
          id: item.id,
          name: item.recipientName,
          tel: item.phone,
          address: `${item.province}${item.city}${item.district}${item.address}`,
          isDefault: item.isDefault
        }))

        const defaultItem = list.find(i => i.isDefault) || list[0]
        selectedAddressId.value = defaultItem ? defaultItem.id : undefined
      } catch (error) {
        console.error('加载地址列表失败:', error)
      }
    }

    onMounted(() => {
      loadAddresses()
    })

    const onClickLeft = () => {
      router.back()
    }

    const onAdd = () => {
      router.push('/user/address/new')
    }

    const onEdit = (item: AddressListAddress) => {
      const source = rawList.value.find(addr => addr.id === String(item.id))

      if (source) {
        router.push({
          path: `/user/address/edit/${source.id}`,
          query: {
            recipientName: source.recipientName,
            phone: source.phone,
            province: source.province,
            city: source.city,
            district: source.district,
            address: source.address,
            isDefault: source.isDefault ? '1' : '0',
          },
        })
      } else {
        router.push(`/user/address/edit/${item.id}`)
      }
    }

    return {
      selectedAddressId,
      addressList,
      rawList,
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
<template>
  <div class="address-edit">
    <van-nav-bar
      :title="isEdit ? '编辑地址' : '新建地址'"
      left-arrow
      @click-left="onClickLeft"
    />
    
    <div class="edit-content">
      <van-address-edit
        :area-list="areaList"
        show-delete
        show-set-default
        :address-info="addressInfo"
        @save="onSave"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast } from 'vant'
import type { AddressEditInfo, AddressEditSearchItem } from 'vant'
import { areaList } from '@vant/area-data'
import { addressApi } from '@/api/address'

export default defineComponent({
  name: 'AddressEditView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const isEdit = computed(() => route.params.id !== undefined)
    const currentId = computed(() => route.params.id as string | undefined)
    const addressInfo = ref<Partial<AddressEditInfo>>({
      name: '',
      tel: '',
      province: '',
      city: '',
      county: '',
      addressDetail: '',
      areaCode: '',
      isDefault: false,
    })

    const findAreaCode = (provinceName: string, cityName: string, countyName: string): string => {
      const { province_list, city_list, county_list } = areaList as any

      let provinceCode = ''
      let cityCode = ''
      let countyCode = ''

      if (provinceName) {
        provinceCode =
          Object.keys(province_list).find(code => province_list[code] === provinceName) || ''
      }

      if (cityName) {
        cityCode =
          Object.keys(city_list).find(code => {
            if (city_list[code] !== cityName) return false
            if (!provinceCode) return true
            return code.startsWith(provinceCode.slice(0, 2))
          }) || ''
      }

      if (countyName) {
        countyCode =
          Object.keys(county_list).find(code => {
            if (county_list[code] !== countyName) return false
            if (cityCode) return code.startsWith(cityCode.slice(0, 4))
            if (provinceCode) return code.startsWith(provinceCode.slice(0, 2))
            return true
          }) || ''
      }

      return countyCode || cityCode || provinceCode || ''
    }

    const onClickLeft = () => {
      router.back()
    }

    const initFromRoute = () => {
      if (!isEdit.value) return
      const q = route.query || {}

      const province = (q.province as string) || ''
      const city = (q.city as string) || ''
      const district = (q.district as string) || ''

      const isDefaultRaw = q.isDefault as string | undefined
      const areaCode = findAreaCode(province, city, district)

      addressInfo.value = {
        name: (q.recipientName as string) || '',
        tel: (q.phone as string) || '',
        province,
        city,
        county: district,
        addressDetail: (q.address as string) || '',
        isDefault: isDefaultRaw === '1' || isDefaultRaw === 'true',
        areaCode,
      }
    }

    const onSave = async (content: AddressEditInfo) => {
      const payload = {
        recipientName: content.name,
        phone: content.tel,
        province: content.province,
        city: content.city,
        district: content.county,
        address: content.addressDetail,
        isDefault: !!content.isDefault,
      }

      try {
        if (isEdit.value && currentId.value) {
          await addressApi.updateReceiveAddress({
            id: currentId.value,
            ...payload,
          })
        } else {
          await addressApi.addReceiveAddress(payload)
        }
        showToast('保存成功')
        router.back()
      } catch (error) {
        console.error('保存地址失败:', error)
      }
    }

    const onDelete = async () => {
      if (!currentId.value) {
        router.back()
        return
      }
      try {
        await addressApi.deleteReceiveAddress(currentId.value)
        showToast('删除成功')
        router.back()
      } catch (error) {
        console.error('删除地址失败:', error)
      }
    }
    onMounted(() => {
      if (isEdit.value) {
        initFromRoute()
      }
    })

    return {
      isEdit,
      areaList,
      addressInfo,
      onClickLeft,
      onSave,
      onDelete
    }
  }
})
</script>

<style scoped>
.address-edit {
  min-height: 100vh;
  background-color: #f7f8fa;
}

.edit-content {
  padding: 12px;
}

:deep(.van-button--danger) {
  margin-top: 12px;
}
</style> 
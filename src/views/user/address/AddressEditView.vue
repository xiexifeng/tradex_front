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
        show-search-result
        :search-result="searchResult"
        :address-info="addressInfo"
        @save="onSave"
        @delete="onDelete"
        @change-detail="onChangeDetail"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showToast, Area } from 'vant'
import type { AddressEditInfo, AddressEditSearchItem } from 'vant'
import { areaList } from '@vant/area-data'

export default defineComponent({
  name: 'AddressEditView',
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const isEdit = computed(() => route.params.id !== undefined)
    
    
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

    const onClickLeft = () => {
      router.back()
    }

    const onSave = (content: AddressEditInfo) => {
      showToast('保存成功')
      router.back()
    }

    const onDelete = () => {
      showToast('删除成功')
      router.back()
    }
    const searchResult = ref<AddressEditSearchItem[]>([]);

    const onChangeDetail = (val: any) => {
      
      if (val) {
        searchResult.value = [
        {
            name: '黄龙万科中心',
            address: '杭州市西湖区',
          },
        ];
        console.log(searchResult)
      } else {
        searchResult.value = [];
      }
    };

    return {
      isEdit,
      areaList,
      addressInfo,
      searchResult,
      onClickLeft,
      onSave,
      onDelete,
      onChangeDetail
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
<template>
  <div class="audit-page">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="物品审核"
      left-arrow
      @click-left="onClickLeft"
      class="audit-nav"
    />
    
    <div v-if="loading" class="loading-container">
      <van-loading type="spinner" color="#1989fa" />
      <p class="loading-text">加载中...</p>
    </div>
    
    <div v-else-if="error" class="error-container">
      <van-icon name="warning-o" size="48" color="#ff4d4f" />
      <p class="error-text">{{ error }}</p>
      <van-button type="primary" @click="loadItemDetail">重新加载</van-button>
    </div>
    
    <div v-else-if="itemDetail" class="audit-content">
      <!-- 图片轮播（全宽，与物品详情页一致） -->
      <van-swipe
        class="item-swipe"
        :autoplay="3000"
        indicator-color="white"
        @click="handleImagePreview"
      >
        <van-swipe-item v-for="(image, index) in (itemDetail.itemImageList || [])" :key="index">
          <van-image :src="image" fit="cover" width="100%" height="100%" />
        </van-swipe-item>
      </van-swipe>

      <!-- 基本信息卡片 -->
      <div class="info-card">
        <div class="section-title">
          <van-icon name="description" />
          <span>物品信息</span>
        </div>
        <div class="item-info">
          <h3 class="item-title">{{ itemDetail.itemTitle }}</h3>
          <p class="item-description">{{ itemDetail.itemDescription }}</p>
          <div class="item-tags">
            <van-tag round plain type="primary" size="medium">{{ itemDetail.itemTypeName || itemDetail.itemType || '未知' }}</van-tag>
            <van-tag round plain type="success" size="medium">{{ itemDetail.depreciation != null ? itemDetail.depreciation + '成新' : '未知' }}</van-tag>
          </div>
          <div class="item-meta">
            <div class="meta-item">
              <span class="meta-label">残余估值(元)：</span>
              <span class="meta-value">{{ itemDetail.valuation || '未知' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">发布时间：</span>
              <span class="meta-value">{{ formatTime(itemDetail.publishTime) || '未知' }}</span>
            </div>
          </div>
        </div>
      </div>
      
            
      <!-- 审核操作或结果卡片 -->
      <div class="audit-card">
        <!-- 审核操作界面 -->
        <div v-if="itemDetail.auditResult === 'WAIT_AUDIT'">
          <div class="section-title">
            <van-icon name="todo-list" />
            <span>审核操作</span>
          </div>
          <div class="audit-form">
            <van-field
              v-model="auditRemark"
              type="textarea"
              label="审核备注"
              placeholder="请输入审核备注（选填）"
              :rows="4"
            />
            <div class="audit-actions">
              <van-button 
                type="danger" 
                class="action-btn reject-btn"
                @click="handleReject"
              >
                拒绝
              </van-button>
              <van-button 
                type="primary" 
                class="action-btn approve-btn"
                @click="handleApprove"
              >
                通过
              </van-button>
            </div>
          </div>
        </div>
        
        <!-- 审核结果界面 -->
        <div v-else>
          <div class="section-title">
            <van-icon name="success" />
            <span>审核结果</span>
          </div>
          <div class="audit-result">
            <div class="result-status" :class="itemDetail.auditResult === 'PASS_AUDIT' ? 'status-pass' : 'status-reject'">
              <van-icon 
                :name="itemDetail.auditResult === 'PASS_AUDIT' ? 'success' : 'close'" 
                size="40"
              />
              <h3>{{ itemDetail.auditResult === 'PASS_AUDIT' ? '审核通过' : '审核不通过' }}</h3>
            </div>
            <div v-if="itemDetail.auditRemark" class="result-remark">
              <span class="remark-label">审核备注：</span>
              <p class="remark-value">{{ itemDetail.auditRemark }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="empty-container">
      <van-empty description="未找到物品信息" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showNotify, showImagePreview } from 'vant'
import { useUserStore } from '@/store/modules/user'
import { auditApi } from '@/api'
import type { AuditItemDetailCO } from '@/api/types'

export default defineComponent({
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userStore = useUserStore()
    
    const taskId = ref(route.params.id as string)
    const itemId = ref(route.query.itemId as string)
    const loading = ref(true)
    const error = ref('')
    const itemDetail = ref<AuditItemDetailCO | null>(null)
    const auditRemark = ref('')
    
    const formatTime = (timestamp: number | undefined | null) => {
      if (!timestamp) {
        return '未知'
      }
      const date = new Date(timestamp)
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const min = String(date.getMinutes()).padStart(2, '0')
      return `${m}-${d} ${h}:${min}`
    }
    
    const loadItemDetail = async () => {
      if (!itemId.value) {
        error.value = '物品ID不存在'
        loading.value = false
        return
      }
      
      loading.value = true
      error.value = ''
      
      try {
        // 使用获取审核任务物品详情的接口，确保审核员能够查看任何物品的详情
        const res = await auditApi.getItemDetailForAudit(taskId.value, itemId.value)
        if (res.success) {
          itemDetail.value = res.data
        } else {
          error.value = res.desc || '获取物品详情失败'
        }
      } catch (e) {
        console.error('加载物品详情失败:', e)
        error.value = '网络错误，请稍后重试'
      } finally {
        loading.value = false
      }
    }
    
    const handleApprove = async () => {
      await submitAuditResult(true)
    }
    
    const handleReject = async () => {
      await submitAuditResult(false)
    }
    
    const submitAuditResult = async (result: boolean) => {
      if (!taskId.value) {
        showNotify({ type: 'danger', message: '审核任务ID不存在' })
        return
      }
      
      try {
        const res = await auditApi.submitAuditResult({
          relatedId: itemId.value,
          taskId: taskId.value,
          result,
          auditRemark: auditRemark.value
        })
        
        if (res.success) {
          showNotify({ 
            type: 'success', 
            message: result ? '审核通过' : '审核拒绝',
            duration: 2000,
            onClose: () => {
              router.back()
            }
          })
        } else {
          showNotify({ type: 'danger', message: res.desc || '提交审核结果失败' })
        }
      } catch (e) {
        console.error('提交审核结果失败:', e)
        showNotify({ type: 'danger', message: '网络错误，请稍后重试' })
      }
    }
    
    const handleImagePreview = () => {
      if (itemDetail.value?.itemImageList && itemDetail.value.itemImageList.length > 0) {
        showImagePreview({
          images: itemDetail.value.itemImageList,
          startPosition: 0,
          showIndex: true,
          closeable: true
        })
      }
    }
    
    const previewImage = (index: number) => {
      if (itemDetail.value?.itemImageList && itemDetail.value.itemImageList.length > 0) {
        showImagePreview({
          images: itemDetail.value.itemImageList,
          startPosition: index,
          showIndex: true,
          closeable: true
        })
      }
    }
    
    const onClickLeft = () => {
      router.back()
    }
    
    onMounted(() => {
      if (!userStore.token) {
        router.push('/login')
        return
      }
      loadItemDetail()
    })
    
    return {
      loading,
      error,
      itemDetail,
      auditRemark,
      formatTime,
      loadItemDetail,
      handleApprove,
      handleReject,
      previewImage,
      handleImagePreview,
      onClickLeft
    }
  }
})
</script>

<style lang="scss" scoped>
/* 与物品详情页 StuffDetailView 保持一致的变量与结构 */
$nav-gradient: linear-gradient(to right, #1989fa, #39a0ff);
$primary: #1989fa;
$danger: #ff4d4f;
$success: #52c41a;
$text-title: #323233;
$text-body: #646566;
$text-meta: #969799;
$bg-page: #f7f8fa;
$border-card: #f5f5f5;
$card-radius: 12px;
$card-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

.audit-page {
  min-height: 100vh;
  background: $bg-page;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0));
}

.audit-nav {
  position: sticky;
  top: 0;
  z-index: 100;

  :deep(.van-nav-bar__content) {
    background: $nav-gradient;
  }

  :deep(.van-nav-bar__title) {
    color: #fff;
  }

  :deep(.van-icon),
  :deep(.van-nav-bar__text) {
    color: #fff;
  }
}

/* 图片轮播：与物品详情页 .item-swipe 一致 */
.item-swipe {
  height: 300px;
  background: #fff;
  cursor: pointer;

  :deep(.van-swipe__indicator) {
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.6);
  }

  :deep(.van-swipe__indicator--active) {
    width: 12px;
    background: #fff;
    border-radius: 3px;
  }

  :deep(.van-image) {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 14px;
}

.loading-text {
  font-size: 14px;
  color: $text-meta;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
  padding: 24px 20px;
  text-align: center;

  .van-button {
    min-width: 120px;
  }
}

.error-text {
  font-size: 14px;
  color: $text-body;
  line-height: 1.6;
}

.empty-container {
  padding: 80px 24px;
  text-align: center;
}

.audit-content {
  padding-bottom: 24px;
}

/* 信息卡片、审核卡片：与物品详情页 .info-group / .blockchain-group 一致 */
.info-card,
.audit-card {
  margin: 12px;
  border-radius: $card-radius;
  overflow: hidden;
  background: #fff;
  box-shadow: $card-shadow;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: bold;
  color: $text-title;
  border-bottom: 1px solid $border-card;

  .van-icon {
    color: $primary;
  }
}

.info-card .item-info {
  padding: 0 16px 16px;
}

.item-info {
  .item-title {
    font-size: 18px;
    font-weight: bold;
    color: $text-title;
    padding: 16px 0 0;
    margin: 0;
    line-height: 1.4;
  }

  .item-description {
    padding: 16px 0;
    font-size: 14px;
    color: $text-body;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .item-tags {
    display: flex;
    gap: 8px;
    padding: 0 0 12px;
    flex-wrap: wrap;

    .van-tag {
      padding: 4px 10px;
      font-size: 12px;
    }
  }

  .item-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
    border-top: 1px solid $border-card;

    .meta-item {
      display: flex;
      align-items: center;
      min-height: 32px;

      .meta-label {
        font-size: 14px;
        color: $text-meta;
        width: 8em;
        flex-shrink: 0;
        text-align: left;
      }

      .meta-value {
        font-size: 14px;
        color: $text-title;
        flex: 1;
        text-align: left;
        min-width: 0;
      }
    }
  }
}

.audit-card .section-title {
  margin-bottom: 0;
}

/* 审核表单：与物品详情页表单位于卡片内一致 */
.audit-form {
  padding: 0 16px 16px;

  .audit-actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;

    .action-btn {
      flex: 1;
      height: 40px;
      font-size: 15px;
      font-weight: 500;
      border-radius: 20px;
      transition: transform 0.2s ease;

      &:active {
        transform: scale(0.98);
      }
    }

    .reject-btn {
      background: $danger;
      border: none;
    }

    .approve-btn {
      background: $nav-gradient;
      border: none;
    }
  }
}

.audit-card :deep(.van-field) {
  padding: 0 0 12px;

  .van-field__label {
    color: $text-title;
  }

  .van-field__control {
    font-size: 14px;
    line-height: 1.6;
    min-height: 88px;
    padding: 12px;
    background: #f7f8fa;
    border-radius: 8px;
    border: 1px solid #ebedf0;

    &::placeholder {
      color: $text-meta;
    }

    &:focus {
      border-color: $primary;
    }
  }
}

/* 审核结果 */
.audit-result {
  padding: 0 16px 16px;

  .result-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 18px 16px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: #f7f8fa;

    &.status-pass {
      background: #f6ffed;

      .van-icon {
        color: $success;
      }

      h3 {
        color: $success;
      }
    }

    &.status-reject {
      background: #fff2f0;

      .van-icon {
        color: $danger;
      }

      h3 {
        color: $danger;
      }
    }

    .van-icon {
      margin-bottom: 6px;
    }

    h3 {
      font-size: 18px;
      font-weight: bold;
      margin: 0;
    }
  }

  .result-remark {
    display: flex;
    align-items: flex-start;
    gap: 0;
    padding: 16px 12px 16px 0;
    background: #f7f8fa;
    border-radius: 8px;
    border-left: 4px solid $primary;

    .remark-label {
      font-size: 14px;
      font-weight: bold;
      color: $text-title;
      width: 8em;
      flex-shrink: 0;
      text-align: left;
      line-height: 1.6;
    }

    .remark-value {
      font-size: 14px;
      color: $text-body;
      line-height: 1.7;
      margin: 0;
      flex: 1;
      min-width: 0;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }
}

@media (max-width: 375px) {
  .item-swipe {
    height: 260px;
  }

  .info-card,
  .audit-card {
    margin: 10px;
  }

  .section-title,
  .item-info .item-title,
  .audit-form {
    padding-left: 14px;
    padding-right: 14px;
  }

  .item-info .item-title {
    font-size: 17px;
  }

  .item-info .item-meta .meta-item .meta-label {
    width: 7.5em;
  }

  .audit-result {
    padding-left: 14px;
    padding-right: 14px;

    .result-remark .remark-label {
      width: 7.5em;
    }
  }
}
</style>
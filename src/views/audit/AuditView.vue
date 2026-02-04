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
      <!-- 图片展示区域 -->
      <div class="swipe-container" @click="handleImagePreview">
        <van-swipe class="item-swipe" :autoplay="3000">
          <van-swipe-item v-for="(image, index) in (itemDetail.itemImageList || [])" :key="index">
            <img
              :src="image"
              alt="物品图片"
              class="audit-image"
            />
          </van-swipe-item>
          <template #indicator="{ active, total }">
            <div class="custom-indicator">
              <van-icon name="photograph" class="indicator-icon" />
              <span>{{ active + 1 }}/{{ total }}</span>
            </div>
          </template>
        </van-swipe>
      </div>
      
      <!-- 基本信息卡片 -->
      <div class="info-card">
        <div class="section-title">
          <van-icon name="description" />
          <span>物品信息</span>
        </div>
        <div class="item-info">
          <h3 class="item-title">{{ itemDetail.itemTitle }}</h3>
          <p class="item-description">{{ itemDetail.itemDescription }}</p>
          <div class="item-meta">
            <div class="meta-item">
              <span class="meta-label">物品类型：</span>
              <span class="meta-value">{{ itemDetail.itemTypeName || itemDetail.itemType || '未知' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">折旧程度：</span>
              <span class="meta-value">{{ itemDetail.depreciation || '未知' }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">残余估值：</span>
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
                size="48"
              />
              <h3>{{ itemDetail.auditResult === 'PASS_AUDIT' ? '审核通过' : '审核不通过' }}</h3>
            </div>
            <div v-if="itemDetail.auditRemark" class="result-remark">
              <h4>审核备注</h4>
              <p>{{ itemDetail.auditRemark }}</p>
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
/* 重置默认样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

img {
  border: none;
  outline: none;
}

button {
  border: none;
  outline: none;
}

input,
textarea {
  border: none;
  outline: none;
}

.audit-page {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 32px;
}

.audit-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #39a0ff);
    
    .van-nav-bar__title,
    .van-icon {
      color: #fff;
    }
  }
  
  :deep(.van-nav-bar__left .van-icon) {
    color: #fff;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 20px;
}

.loading-text {
  font-size: 15px;
  color: #999;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  gap: 20px;
  padding: 0 24px;
  text-align: center;
}

.error-text {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}

.empty-container {
  padding: 80px 24px;
  text-align: center;
}

.audit-content {
  padding: 16px;
}

/* 图片展示区域 */
.swipe-container {
  height: 360px;
  background: #f5f6fa;
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  
  .item-swipe {
    height: 100%;
    
    :deep(.van-swipe-item) {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .audit-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  
  .custom-indicator {
    position: absolute;
    right: 16px;
    bottom: 16px;
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 16px;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 4px;
    
    .indicator-icon {
      font-size: 16px;
    }
  }
}

/* 信息卡片 */
.info-card,
.audit-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: bold;
  color: #323233;
  
  .van-icon {
    color: #1989fa;
  }
}

.item-info {
  .item-title {
    font-size: 18px;
    font-weight: 600;
    color: #323233;
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  .item-description {
    font-size: 14px;
    color: #646566;
    line-height: 1.5;
    margin-bottom: 16px;
    white-space: pre-wrap;
    padding: 12px 16px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border-left: 3px solid #1989fa;
  }
  
  .item-meta {
    background-color: #fafafa;
    border-radius: 8px;
    padding: 16px;
    
    .meta-item {
      display: flex;
      margin-bottom: 12px;
      align-items: center;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .meta-label {
        font-size: 14px;
        color: #969799;
        min-width: 90px;
        font-weight: 500;
      }
      
      .meta-value {
        font-size: 14px;
        color: #323233;
        flex: 1;
        font-weight: 500;
        background-color: #fff;
        padding: 6px 12px;
        border-radius: 4px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }
    }
  }
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 0;
  
  .user-avatar {
    flex-shrink: 0;
    
    :deep(.van-image) {
      border: 2px solid #f0f0f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  .user-details {
    flex: 1;
    
    .user-name {
      font-size: 16px;
      font-weight: 600;
      color: #323233;
      margin-bottom: 12px;
    }
    
    .user-stats {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 8px 12px;
        background-color: #f7f8fa;
        border-radius: 8px;
        min-width: 80px;
        
        .stat-label {
          font-size: 12px;
          color: #969799;
        }
        
        .stat-value {
          font-size: 14px;
          font-weight: 600;
          color: #1989fa;
        }
      }
    }
  }
}

/* 审核表单 */
.audit-form {
  .audit-actions {
    display: flex;
    gap: 16px;
    margin-top: 24px;
    
    .action-btn {
      flex: 1;
      height: 44px;
      font-size: 15px;
      font-weight: 600;
      border-radius: 22px;
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      &:active {
        transform: translateY(0);
      }
    }
    
    .reject-btn {
      background-color: #ff4d4f;
      border: none;
      
      &:hover {
        background-color: #ff7875;
      }
    }
    
    .approve-btn {
      background-color: #1989fa;
      border: none;
      
      &:hover {
        background-color: #40a9ff;
      }
    }
  }
}

/* 优化van-field样式 */
:deep(.van-field) {
  margin-bottom: 8px;
  
  .van-field__control {
    font-size: 15px;
    line-height: 1.6;
    min-height: 120px;
    padding: 12px;
    background-color: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    
    &:focus {
      border-color: #1989fa;
      box-shadow: 0 0 0 2px rgba(25, 137, 250, 0.1);
    }
  }
  
  .van-field__label {
    font-size: 15px;
    font-weight: 500;
    color: #323233;
    padding: 12px 0;
  }
}

/* 审核结果样式 */
.audit-result {
  padding: 20px 0;
  
  .result-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
    margin-bottom: 24px;
    border-radius: 12px;
    background-color: #f7f8fa;
    
    &.status-pass {
      background-color: #f6ffed;
      
      .van-icon {
        color: #52c41a;
      }
      
      h3 {
        color: #52c41a;
      }
    }
    
    &.status-reject {
      background-color: #fff2f0;
      
      .van-icon {
        color: #ff4d4f;
      }
      
      h3 {
        color: #ff4d4f;
      }
    }
    
    .van-icon {
      margin-bottom: 16px;
    }
    
    h3 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
  }
  
  .result-remark {
    padding: 20px;
    background-color: #f7f8fa;
    border-radius: 12px;
    border-left: 4px solid #1989fa;
    
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #323233;
      margin-bottom: 12px;
    }
    
    p {
      font-size: 15px;
      color: #646566;
      line-height: 1.6;
      margin: 0;
      white-space: pre-wrap;
    }
  }
}

@media (max-width: 375px) {
  .audit-content {
    padding: 12px;
  }
  
  .swipe-container {
    height: 280px;
  }
  
  .info-card,
  .audit-card {
    padding: 16px;
  }
  
  .item-info {
    .item-title {
      font-size: 16px;
    }
    
    .item-meta {
      .meta-item {
        .meta-label {
          min-width: 80px;
        }
      }
    }
  }
  
  .audit-form {
    .audit-actions {
      .action-btn {
        height: 40px;
        font-size: 14px;
      }
    }
  }
}
</style>
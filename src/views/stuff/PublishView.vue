<template>
  <div class="publish">
    <!-- 顶部导航栏 -->
    <van-nav-bar
      title="发布物品"
      left-arrow
      @click-left="onClickLeft"
      class="publish-nav"
    >
      <template #right>
        <van-button 
          type="primary" 
          size="small" 
          round 
          class="publish-btn"
          @click="onSubmit"
        >
          发布
        </van-button>
      </template>
    </van-nav-bar>

    <div class="publish-content">
      <van-form @submit="onSubmit" :show-error=true ref="formRef">
        <!-- 图片上传区域 -->
        <div class="upload-card">
          <div class="section-title">
            <van-icon name="photo-o" />
            <span>物品图片</span>
            <span class="subtitle">（最多5张）</span>
          </div>
          <van-uploader
            v-model="formData.images"
            :max-count="5"
            :after-read="afterRead"
            multiple
            :rules="[{ required: true, message: '请上传至少1张图片' }]"
            upload-text="上传图片"
            class="custom-uploader"
          />
        </div>

        <!-- 基本信息卡片 -->
        <div class="info-card">
          <div class="section-title">
            <van-icon name="description" />
            <span>基本信息</span>
          </div>
          
          <van-cell-group inset class="form-group">
            <van-field
              v-model="formData.name"
              name="name"
              label="物品名称"
              placeholder="请输入物品名称(1-50字)"
              :rules="[{ required: true, message: '请填写物品名称' }]"
            />

            <van-field
              v-model="formData.clazzText"
              is-link
              readonly
              name="clazz"
              label="物品类型"
              placeholder="请选择物品类型"
              @click="showTypePopup = true"
              :rules="[{ required: true, message: '请选择物品类型' }]"
            />

            <van-field
              v-model="formData.description"
              name="description"
              label="物品描述"
              type="textarea"
              rows="3"
              autosize
              placeholder="请描述物品的详细信息(1-200字)"
              :rules="[{ required: true, message: '请填写物品描述' }]"
            />

            <van-field
              class="depreciation-field"
              label="折旧程度"
              name="depreciation"
              :rules="[{ required: true, message: '请选择折旧程度' }]"
            >
              <template #input>
                <div class="depreciation-input">
                  <van-slider 
                    v-model="formData.depreciation" 
                    :min="1" 
                    :max="10"
                    :step="1"
                    bar-height="4px"
                    active-color="#07c160"
                  >
                    <template #button>
                      <div class="custom-button">
                        {{ formData.depreciation }}成新
                      </div>
                    </template>
                  </van-slider>
                </div>
              </template>
            </van-field>
          </van-cell-group>
        </div>
      </van-form>
    </div>

    <!-- 物品类型选择弹出层 -->
    <van-popup v-model:show="showTypePopup" position="bottom" round>
      <van-picker
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showTypePopup = false"
        show-toolbar
        title="选择物品类型"
      />
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.publish {
  min-height: 100vh;
  background-color: #f8f9fa;
  padding-bottom: 32px;
}

.publish-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  
  :deep(.van-nav-bar__content) {
    background: linear-gradient(to right, #1989fa, #39a0ff);
    
    .van-nav-bar__title,
    .van-icon {
      color: #fff;
    }
    
    .van-nav-bar__left .van-icon {
      color: #fff;
    }
  }
  
  .publish-btn {
    position: relative;
    height: 32px;
    padding: 0 16px;
    background: linear-gradient(135deg, #29e075, #14dd89);
    border: none;
    font-weight: 500;
    font-size: 14px;
    box-shadow: 0 2px 8px rgba(41, 224, 117, 0.3);
    transition: all 0.3s ease;
    
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 8px;
      height: 8px;
      background: #ee0a24;
      border-radius: 50%;
      border: 2px solid #fff;
      animation: pulse 2s infinite;
    }
    
    &:active {
      transform: scale(0.95);
      opacity: 0.9;
    }
    
    :deep(.van-button__content) {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.publish-content {
  padding: 16px;
}

.upload-card,
.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
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
  
  .subtitle {
    font-size: 12px;
    color: #969799;
    font-weight: normal;
  }
}

.custom-uploader {
  :deep(.van-uploader__wrapper) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  :deep(.van-uploader__upload) {
    margin: 0;
    background-color: #f7f8fa;
    border-radius: 8px;
    
    &:active {
      background-color: #e8e8e8;
    }
  }
  
  :deep(.van-uploader__preview) {
    margin: 0;
    
    .van-uploader__preview-image {
      border-radius: 8px;
    }
  }
}

.form-group {
  background: transparent;
  
  :deep(.van-cell) {
    padding: 16px 0;
    background: transparent;
    
    &:not(:last-child) {
      border-bottom: 1px solid #f5f5f5;
    }
    
    &::after {
      display: none;
    }
  }
  
  :deep(.van-field__label) {
    width: 6em;
    color: #323233;
  }
}

.depreciation-field {
  :deep(.van-field__label) {
    width: 6em;
    color: #323233;
  }
  
  :deep(.van-field__value) {
    flex: 1;
    padding: 8px 0;
  }
  
  .depreciation-input {
    width: 100%;
    padding: 8px 16px 8px 0;
    
    :deep(.van-slider) {
      margin: 12px 0;
      
      .custom-button {
        position: absolute;
        top: -30px;
        transform: translateX(-50%);
        min-width: 48px;
        height: 24px;
        padding: 0 8px;
        color: #fff;
        font-size: 12px;
        line-height: 24px;
        text-align: center;
        background-color: #07c160;
        border-radius: 100px;
        white-space: nowrap;
      }
      
      .van-slider__bar {
        background: linear-gradient(to right, #95ec89, #07c160);
      }
      
      .van-slider__button {
        width: 20px;
        height: 20px;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(238, 10, 36, 0.4);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(238, 10, 36, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(238, 10, 36, 0);
  }
}
</style>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog, FormInstance } from 'vant'
import type { UploaderFileListItem } from 'vant'
import { uploadFile, publishItem } from '@/api/stuff'
import imageCompression from 'browser-image-compression'

export default defineComponent({
  name: 'PublishView',
  setup() {
    const router = useRouter()
    const showTypePopup = ref(false)
    const formRef = ref<FormInstance>()

    // 物品类型选项
    const columns = [
      {text: '衣服', value : 'A'},
      {text: '家具', value : 'B'},
      {text: '玩具', value : 'C'},
      {text: '电子产品', value : 'D'},
      {text: '图书', value : 'E'},
      {text: '运动器材', value : 'F'},
      {text: '其他', value : 'G'}
    ]

    // 表单数据
    const formData = reactive({
      name: '',
      clazz: '',
      clazzText: '',
      description: '',
      images: [] as UploaderFileListItem[],
      originalPrice: '',
      depreciation: 5
    })

    // 返回上一页
    const onClickLeft = () => {
      router.back()
    }

    // 选择物品类型
    const onConfirm = (selectedItem:any) => {
      console.log(selectedItem)
      formData.clazz = selectedItem.selectedOptions[0].value
      formData.clazzText = selectedItem.selectedOptions[0].text
      showTypePopup.value = false
    }

    // 验证价格
    const validatePrice = (value: string) => {
      if (!value) return true
      const price = parseFloat(value)
      return price >= 0 && price <= 999999
    }
    // 选择图片后处理
    async function handleBeforeUpload(file: File) {
      let uploadHandledFile = file
      if (file.size > 1 * 1024 * 1024) {
        try {
          uploadHandledFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 800, // 可根据需求调整
            useWebWorker: true
          })
          if (uploadHandledFile.size > 1 * 1024 * 1024) {
            showToast('图片压缩后仍大于1M，请选择更小的图片')
            return
          }
          return new File([uploadHandledFile], file.name, { type: file.type })
        } catch (e) {
          showToast('图片压缩失败')
          return
        }
      }
      return file

    }

    // 处理图片上传
    const afterRead = async (file: UploaderFileListItem | UploaderFileListItem[]) => {
      try {
        if (Array.isArray(file)) {
          // 多文件上传
          for (const item of file) {
            if (item.file) {
              // 检查文件类型
              if (!item.file.type.startsWith("image/")) {
                    showToast("请选择图片文件");
                    return;
              }
              item.file = await handleBeforeUpload(item.file)
              if(item.file == null) {
                return
              }
              // 检查文件大小 (限制为 5MB)
              if (item.file.size > 1 * 1024 * 1024) {
                showToast("图片大小不能超过 1MB");
                return;
              }

              const res = await uploadFile(item.file);
              if (res.success && res.data) {
                item.url = res.data; // 更新图片预览地址
                item.status = 'done'; // 标记上传成功
              } else {
                item.status = 'failed'; // 标记上传失败
                showToast('图片上传失败');
              }
            }
          }
        } else {
          // 单文件上传
          if (file.file) {
            file.file = await handleBeforeUpload(file.file)
            if(file.file == null) {
              return
            }
            // 检查文件大小 (限制为 5MB)
            if (file.file.size > 1 * 1024 * 1024) {
              showToast("图片大小不能超过 1MB");
              return;
            }
            console.log('file.file:'+file.file.size)
            const res = await uploadFile(file.file);
            if (res.success && res.data) {
              file.url = res.data; // 更新图片预览地址
              file.status = 'done'; // 标记上传成功
            } else {
              file.status = 'failed'; // 标记上传失败
              showToast('图片上传失败');
            }
          }
        }
      } catch (error) {
        console.error('上传图片失败:', error);
        showToast('上传图片失败');
        // 标记上传失败
        if (Array.isArray(file)) {
          file.forEach(item => {
            if (item.file) {
              item.status = 'failed';
            }
          });
        } else {
          if (file.file) {
            file.status = 'failed';
          }
        }
      }
    }

    

    // 提交表单
    const onSubmit = async () => {
      if (!formRef.value) return;
      
      try {
        await formRef.value.validate();

        if (formData.images.length === 0) {
          showToast('请至少上传一张图片');
          return;
        }

        // 检查是否有上传失败的图片
        const failedImages = formData.images.filter(img => img.status === 'failed');
        if (failedImages.length > 0) {
          showToast('有图片上传失败，请重新上传');
          return;
        }

        // 检查所有图片URL是否有效
        const validImages = formData.images.filter(img => img.url && img.url.trim() !== '');
        if (validImages.length === 0) {
          showToast('请至少上传一张有效的图片');
          return;
        }

        // 确认对话框
        await showDialog({
          title: '确认提交',
          message: '确定要发布吗？',
          showCancelButton: true,
        });
        
        // 准备提交数据
        const submitData = {
          itemTitle: formData.name,
          itemType: formData.clazzText,
          itemImageList: validImages.map(img => img.url || ''),
          itemDescription: formData.description,
          depreciation: formData.depreciation
        };

        // 调用发布接口
        const res = await publishItem(submitData);
        
        if (res.success) {
          showToast('发布成功');
          router.back();
        }
      } catch (error) {
        console.error('发布失败:', error);
        showDialog({
          title: '发布失败',
          message: '请稍后重试'
        });
      }
    }

    onMounted(() => {
      console.log('mounted')
      console.log(formRef.value?.getValues())
    })

    return {
      formData,
      showTypePopup,
      columns,
      formRef,
      onClickLeft,
      onConfirm,
      validatePrice,
      afterRead,
      onSubmit
    }
  }
})
</script> 
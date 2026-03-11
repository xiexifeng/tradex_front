import { ref, reactive } from 'vue'

export interface ShareOptions {
  shareTitle?: string
  shareDesc?: string
  shareImage?: string
  shareUrl?: string
}

const defaultOptions: Required<ShareOptions> = {
  shareTitle: '区块链电商平台',
  shareDesc: '邀请好友一起加入！',
  shareImage: '',
  shareUrl: ''
}

/**
 * 公用分享弹窗：任意页面引入后可直接调用 openShare(options) 打开分享窗口。
 * 用法：
 * 1. const { showShareDialog, shareOptions, openShare } = useShareDialog()
 * 2. 模板中：<ShareDialog v-model:show="showShareDialog" v-bind="shareOptions" />
 * 3. 需要分享时：openShare({ shareTitle: '...', shareDesc: '...', shareImage: '...', shareUrl: '...' })
 */
export function useShareDialog() {
  const showShareDialog = ref(false)
  const shareOptions = reactive<Required<ShareOptions>>({ ...defaultOptions })

  function openShare(options: ShareOptions = {}) {
    shareOptions.shareTitle = options.shareTitle ?? defaultOptions.shareTitle
    shareOptions.shareDesc = options.shareDesc ?? defaultOptions.shareDesc
    shareOptions.shareImage = options.shareImage ?? defaultOptions.shareImage
    shareOptions.shareUrl = options.shareUrl ?? defaultOptions.shareUrl
    showShareDialog.value = true
  }

  return {
    showShareDialog,
    shareOptions,
    openShare
  }
}

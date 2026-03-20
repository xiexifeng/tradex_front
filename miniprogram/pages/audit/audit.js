const { getItemDetailForAudit, submitAuditResult } = require('../../api/audit.js');

function formatTime(timestamp) {
  if (timestamp == null || timestamp === '') return '未知';
  const date = new Date(timestamp);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${m}-${d} ${h}:${min}`;
}

Page({
  data: {
    taskId: '',
    itemId: '',
    loading: true,
    error: '',
    itemDetail: null,
    auditRemark: '',
    publishTimeStr: '',
    imageList: [],
  },

  onLoad(options) {
    const taskId = options.id || options.taskId || '';
    const itemId = options.itemId || '';
    this.entryTaskId = taskId;
    this.entryItemId = itemId;
    this.setData({ taskId, itemId });
  },

  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      this.setData({ loading: false });
      wx.showToast({ title: '请先登录', icon: 'none' });
      setTimeout(() => {
        wx.navigateTo({ url: '/pages/user/login/login' });
      }, 400);
      return;
    }

    const taskId = this.entryTaskId || '';
    const itemId = this.entryItemId || '';
    if (!itemId) {
      this.setData({ loading: false, error: '物品ID不存在', itemDetail: null });
      return;
    }
    if (!taskId) {
      this.setData({ loading: false, error: '审核任务ID不存在', itemDetail: null });
      return;
    }

    this.loadItemDetail();
  },

  async loadItemDetail() {
    const taskId = this.entryTaskId || '';
    const itemId = this.entryItemId || '';
    if (!itemId) {
      this.setData({ loading: false, error: '物品ID不存在', itemDetail: null });
      return;
    }
    if (!taskId) {
      this.setData({ loading: false, error: '审核任务ID不存在', itemDetail: null });
      return;
    }

    this.setData({ loading: true, error: '' });
    try {
      const res = await getItemDetailForAudit(taskId, itemId);
      if (res.success && res.data) {
        const d = res.data;
        const imageList =
          d.itemImageList && d.itemImageList.length
            ? d.itemImageList
            : d.firstImage
              ? [d.firstImage]
              : [];
        this.setData({
          itemDetail: d,
          loading: false,
          error: '',
          publishTimeStr: formatTime(d.publishTime),
          imageList,
        });
      } else if (res.success) {
        this.setData({
          loading: false,
          error: '',
          itemDetail: null,
          imageList: [],
          publishTimeStr: '',
        });
      } else {
        this.setData({
          loading: false,
          error: (res && res.desc) || '获取物品详情失败',
          itemDetail: null,
        });
      }
    } catch (_) {
      this.setData({
        loading: false,
        error: '网络错误，请稍后重试',
        itemDetail: null,
      });
    }
  },

  onRemarkInput(e) {
    this.setData({ auditRemark: e.detail.value });
  },

  async submitAuditResultAction(result) {
    const taskId = this.entryTaskId || '';
    const itemId = this.entryItemId || '';
    const { auditRemark } = this.data;
    if (!taskId) {
      wx.showToast({ title: '审核任务ID不存在', icon: 'none' });
      return;
    }
    try {
      const res = await submitAuditResult({
        relatedId: itemId,
        taskId,
        result,
        auditRemark: auditRemark || undefined,
      });
      if (res.success) {
        wx.showToast({
          title: result ? '审核通过' : '审核拒绝',
          icon: 'success',
        });
        setTimeout(() => wx.navigateBack(), 1500);
      }
    } catch (_) {
      /* 失败时 request 已 toast */
    }
  },

  handleApprove() {
    this.submitAuditResultAction(true);
  },

  handleReject() {
    this.submitAuditResultAction(false);
  },

  onSwipeTap() {
    const { imageList } = this.data;
    if (imageList && imageList.length) {
      wx.previewImage({
        urls: imageList,
        current: imageList[0],
      });
    }
  },

  onPreviewCurrent(e) {
    const index = Number(e.currentTarget.dataset.index) || 0;
    const { imageList } = this.data;
    if (!imageList || !imageList.length) return;
    wx.previewImage({
      urls: imageList,
      current: imageList[index] || imageList[0],
    });
  },
});

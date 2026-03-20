const {
  getItemDetail,
  transferItem,
  cancelTransfer,
} = require('../../../api/stuff.js');
const {
  getValueText,
  DELIVERY_COLUMNS,
  TRADE_METHOD_COLUMNS,
} = require('../../../constants/stuff.js');

function shortBlockchain(s) {
  if (!s || typeof s !== 'string') return '';
  return s.length > 10 ? `${s.slice(0, 10)}...` : s;
}

Page({
  data: {
    itemId: '',
    loading: true,
    itemDetail: null,
    statusMainText: '',
    tradeMethodDisplay: '',
    deliveryDisplay: '',
    swiperImages: [],
    currentSwiper: 0,
    blockchainShort: '',
    showTransferForm: false,
    showCancelSheet: false,
    cancelReason: '',
    deliveryColumns: DELIVERY_COLUMNS,
    tradeMethodColumns: TRADE_METHOD_COLUMNS,
    deliveryPickIndex: 0,
    tradeMethodPickIndex: 0,
    transferForm: {
      deliveryMethod: '',
      deliveryMethodText: '',
      tradeMethod: '',
      tradeMethodText: '',
      transferPrice: '',
      transferPoints: '',
      expectItem: '',
      phone: '',
      tradeAreaText: '',
      tradeAddressDetail: '',
    },
  },

  onLoad(options) {
    const id = options.id;
    if (!id) {
      wx.showToast({ title: '物品ID不存在', icon: 'none' });
      this.setData({ loading: false });
      return;
    }
    this.setData({ itemId: id });
    this.fetchDetail();
  },

  onPullDownRefresh() {
    this.fetchDetail().finally(() => wx.stopPullDownRefresh());
  },

  async fetchDetail() {
    const { itemId } = this.data;
    if (!itemId) return;
    this.setData({ loading: true });
    try {
      const res = await getItemDetail(itemId);
      if (res.success && res.data) {
        const d = res.data;
        if (!d.contactInfo) d.contactInfo = { linkman: '', phone: '', address: '' };
        const imgs =
          d.itemImageList && d.itemImageList.length
            ? d.itemImageList
            : d.firstImage
              ? [d.firstImage]
              : ['/images/home/banner1.jpg'];
        const statusMainText =
          d.transferStatus === 'own'
            ? getValueText(d.status, 'itemStatus')
            : getValueText(d.transferStatus, 'status');
        this.setData({
          itemDetail: d,
          loading: false,
          swiperImages: imgs,
          currentSwiper: 0,
          blockchainShort: shortBlockchain(d.blockchainId),
          statusMainText,
          tradeMethodDisplay: d.tradeMethod ? getValueText(d.tradeMethod, 'tradeMethod') : '',
          deliveryDisplay: d.deliveryMethod ? getValueText(d.deliveryMethod, 'deliveryMethod') : '',
        });
      } else {
        this.setData({ itemDetail: null, loading: false });
      }
    } catch (_) {
      wx.showToast({
        title: '物品已逃走',
        icon: 'none',
        duration: 2000,
        complete: () => setTimeout(() => wx.navigateBack({ fail: () => {} }), 500),
      });
      this.setData({ itemDetail: null, loading: false });
    }
  },

  onSwiperChange(e) {
    this.setData({ currentSwiper: e.detail.current });
  },

  previewImages() {
    const urls = this.data.swiperImages;
    if (urls && urls.length) wx.previewImage({ current: urls[0], urls });
  },

  copyBlockchain() {
    const id = this.data.itemDetail && this.data.itemDetail.blockchainId;
    if (!id) return;
    wx.setClipboardData({
      data: String(id),
      success: () => wx.showToast({ title: '已复制区块链ID', icon: 'success' }),
    });
  },

  initiateTransfer() {
    this.setData({ showTransferForm: true });
  },

  closeTransferForm() {
    this.setData({ showTransferForm: false });
  },

  noop() {},

  onDeliveryPick(e) {
    const idx = Number(e.detail.value);
    const row = this.data.deliveryColumns[idx];
    if (!row) return;
    this.setData({
      'transferForm.deliveryMethod': row.value,
      'transferForm.deliveryMethodText': row.text,
      deliveryPickIndex: idx,
    });
  },

  onTradeMethodPick(e) {
    const idx = Number(e.detail.value);
    const row = this.data.tradeMethodColumns[idx];
    if (!row) return;
    this.setData({
      'transferForm.tradeMethod': row.value,
      'transferForm.tradeMethodText': row.text,
      tradeMethodPickIndex: idx,
    });
  },

  onTransferInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`transferForm.${field}`]: e.detail.value });
  },

  onRegionChange(e) {
    const parts = e.detail.value;
    const text = Array.isArray(parts) ? parts.join('') : '';
    this.setData({ 'transferForm.tradeAreaText': text });
  },

  chooseMapLocation() {
    wx.chooseLocation({
      success: (res) => {
        const addr = [res.name, res.address].filter(Boolean).join(' ');
        wx.showToast({ title: '已填入地图位置，可继续选择省市区或修改', icon: 'none' });
        this.setData({
          'transferForm.tradeAreaText': res.address || '',
          'transferForm.tradeAddressDetail': res.name || '',
        });
      },
      fail: () => {
        wx.showToast({ title: '未选择位置，请手动填写地址', icon: 'none' });
      },
    });
  },

  async onTransferSubmit() {
    const d = this.data.itemDetail;
    const f = this.data.transferForm;
    if (!d) return;
    if (!f.deliveryMethod) {
      wx.showToast({ title: '请选择交付方式', icon: 'none' });
      return;
    }
    if (!f.tradeMethod) {
      wx.showToast({ title: '请选择交易方式', icon: 'none' });
      return;
    }
    if (f.tradeMethod === 'ITEM_TO_MONEY' && !f.transferPrice) {
      wx.showToast({ title: '请输入转让价格', icon: 'none' });
      return;
    }
    if (f.tradeMethod === 'ITEM_TO_POINTS' && !f.transferPoints) {
      wx.showToast({ title: '请输入所需积分', icon: 'none' });
      return;
    }
    if (f.tradeMethod === 'ITEM_TO_ITEM' && !f.expectItem) {
      wx.showToast({ title: '请描述期望交换的物品', icon: 'none' });
      return;
    }
    if (!f.phone) {
      wx.showToast({ title: '请输入联系方式', icon: 'none' });
      return;
    }
    if (!f.tradeAreaText) {
      wx.showToast({ title: '请选择或填写省市区', icon: 'none' });
      return;
    }
    if (!f.tradeAddressDetail) {
      wx.showToast({ title: '请输入街道小区信息', icon: 'none' });
      return;
    }

    const ok = await new Promise((resolve) => {
      wx.showModal({
        title: '确认提交',
        content: '确定要发起出让申请吗？',
        success: (r) => resolve(r.confirm),
      });
    });
    if (!ok) return;

    const tradeAddress = `${f.tradeAreaText}${f.tradeAddressDetail ? ` ${f.tradeAddressDetail}` : ''}`.trim();
    try {
      const res = await transferItem({
        itemId: d.id,
        tradeMethod: f.tradeMethod,
        transferPrice: f.tradeMethod === 'ITEM_TO_MONEY' ? Number(f.transferPrice) : 0,
        transferPoints: f.tradeMethod === 'ITEM_TO_POINTS' ? Number(f.transferPoints) : 0,
        expectItem: f.tradeMethod === 'ITEM_TO_ITEM' ? f.expectItem : '',
        contactInfo: { phone: f.phone, address: tradeAddress },
        deliveryMethod: f.deliveryMethod,
      });
      if (res.success) {
        wx.showToast({ title: '提交成功', icon: 'success' });
        this.setData({ showTransferForm: false });
        await this.fetchDetail();
      }
    } catch (_) {
      wx.showToast({ title: '提交失败', icon: 'none' });
    }
  },

  cancelTransferShow() {
    this.setData({ showCancelSheet: true, cancelReason: '' });
  },

  closeCancelSheet() {
    this.setData({ showCancelSheet: false, cancelReason: '' });
  },

  onCancelReasonInput(e) {
    this.setData({ cancelReason: e.detail.value });
  },

  async confirmCancelTransfer() {
    const reason = (this.data.cancelReason || '').trim();
    if (!reason) {
      wx.showToast({ title: '请输入取消原因', icon: 'none' });
      return;
    }
    const id = this.data.itemDetail && this.data.itemDetail.id;
    try {
      const res = await cancelTransfer({ itemId: id, cancelReason: reason });
      if (res.success) {
        wx.showToast({ title: '取消出让成功', icon: 'success' });
        this.setData({ showCancelSheet: false, cancelReason: '' });
        await this.fetchDetail();
      }
    } catch (_) {
      wx.showToast({ title: '取消出让失败', icon: 'none' });
    }
  },

  viewOffers() {
    wx.showModal({
      title: '查看报价',
      content: '请在「交易」页查看与该物品相关的交易与报价。',
      confirmText: '去交易',
      success: (r) => {
        if (r.confirm) wx.switchTab({ url: '/pages/trade/list/list' });
      },
    });
  },

  viewTradeDetails() {
    const id = this.data.itemDetail && this.data.itemDetail.id;
    if (!id) return;
    wx.navigateTo({ url: `/pages/trade/detail/detail?id=${id}` });
  },
});

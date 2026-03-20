const {
  getSquareItemDetail,
  socialItem,
  applySquareExchange,
  getMyCanTradeItems,
  createOrderForPay,
} = require('../../../../api/stuff.js');
const { confirmPay } = require('../../../../api/trade.js');
const { getValueText } = require('../../../../constants/stuff.js');

const ITEM_TYPE_LABELS = ['电子产品', '服装配饰', '图书音像', '运动器材', '家居用品', '其他'];

function shortId(s) {
  if (!s || typeof s !== 'string') return '';
  return s.length > 10 ? `${s.slice(0, 10)}...` : s;
}

Page({
  data: {
    itemId: '',
    userId: '',
    loading: true,
    loadError: false,
    itemDetail: null,
    swiperImages: [],
    currentSwiper: 0,
    isLiked: false,
    isCollected: false,
    tradeMethodText: '',
    deliveryText: '',
    itemBlockchainShort: '',
    userBlockchainShort: '',
    showBuyForm: false,
    showExchangeForm: false,
    showPayPopup: false,
    isSubmitting: false,
    payTradeId: '',
    payPoints: 0,
    buyForm: { linkman: '', phone: '', address: '', remark: '' },
    exchangeForm: {
      linkman: '',
      phone: '',
      address: '',
      remark: '',
      itemType: '',
      itemId: '',
      itemTitle: '',
    },
    itemTypeLabels: ITEM_TYPE_LABELS,
    itemTypeIndex: 0,
    myItemColumns: [],
    myItemIndex: 0,
  },

  _viewSent: false,

  onLoad(options) {
    const id = options.id;
    if (!id) {
      wx.showToast({ title: '物品ID不存在', icon: 'none' });
      this.setData({ loading: false, loadError: true });
      return;
    }
    this.setData({ itemId: id });
    this.loadDetail();
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    const userId = userInfo && userInfo.userId ? userInfo.userId : '';
    this.setData({ userId });
  },

  onPullDownRefresh() {
    this.loadDetail().finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onShareAppMessage() {
    const d = this.data.itemDetail;
    const id = this.data.itemId;
    let title = (d && d.itemTitle) || '物品详情';
    let path = `/pages/square/item/detail/detail?id=${id}`;
    let imageUrl = '';
    if (d) {
      if (d.firstImage) imageUrl = d.firstImage;
      else if (d.itemImageList && d.itemImageList.length) imageUrl = d.itemImageList[0];
    }
    let desc = (d && d.itemDescription) || '';
    let priceInfo = '';
    if (d) {
      if (d.tradeMethod === 'ITEM_TO_MONEY' && d.transferPrice) priceInfo = `¥${d.transferPrice}`;
      else if (d.tradeMethod === 'ITEM_TO_POINTS' && d.transferPoints) priceInfo = `${d.transferPoints}积分`;
      else if (d.tradeMethod === 'ITEM_TO_ITEM' && d.expectItem) priceInfo = `换${d.expectItem}`;
    }
    let fullDesc = priceInfo ? priceInfo + (desc ? ` | ${desc}` : '') : desc;
    if (fullDesc.length > 100) fullDesc = `${fullDesc.slice(0, 100)}...`;
    return {
      title: fullDesc ? `${title} — ${fullDesc}` : title,
      path,
      imageUrl: imageUrl || undefined,
    };
  },

  async loadDetail() {
    const { itemId } = this.data;
    if (!itemId) return;
    this.setData({ loading: true, loadError: false });
    try {
      const res = await getSquareItemDetail(itemId);
      if (res.success && res.data) {
        const d = res.data;
        if (!d.userExt) {
          d.userExt = { blockchainId: '登录后可查看', tradeScore: -999 };
        }
        if (!d.contactInfo) {
          d.contactInfo = { linkman: '', phone: '', address: '' };
        }
        const images =
          d.itemImageList && d.itemImageList.length
            ? d.itemImageList
            : d.firstImage
              ? [d.firstImage]
              : ['/images/home/banner1.jpg'];
        this.setData({
          itemDetail: d,
          loading: false,
          loadError: false,
          isLiked: !!d.isLiked,
          isCollected: !!d.isCollected,
          tradeMethodText: getValueText(d.tradeMethod, 'tradeMethod'),
          deliveryText: getValueText(d.deliveryMethod, 'deliveryMethod'),
          swiperImages: images,
          currentSwiper: 0,
          itemBlockchainShort: shortId(d.blockchainId),
          userBlockchainShort: shortId(d.userExt.blockchainId),
        });
        if (!this._viewSent) {
          this._viewSent = true;
          try {
            await socialItem({
              itemId,
              socialType: 'VIEW',
              socialOperate: 'ADD',
            });
            d.viewCount = (d.viewCount || 0) + 1;
            this.setData({ itemDetail: d });
          } catch (_) {
            /* ignore */
          }
        }
      } else {
        this.setData({ itemDetail: null, loading: false, loadError: true });
      }
    } catch (_) {
      this.setData({ itemDetail: null, loading: false, loadError: true });
    }
  },

  onSwiperChange(e) {
    this.setData({ currentSwiper: e.detail.current });
  },

  previewImages() {
    const urls = this.data.swiperImages;
    if (!urls || !urls.length) return;
    wx.previewImage({ current: urls[0], urls });
  },

  copyItemBlockchain() {
    const id = this.data.itemDetail && this.data.itemDetail.blockchainId;
    if (!id) return;
    wx.setClipboardData({
      data: String(id),
      success: () => wx.showToast({ title: '已复制区块链ID', icon: 'success' }),
    });
  },

  copyUserBlockchain() {
    const id = this.data.itemDetail && this.data.itemDetail.userExt && this.data.itemDetail.userExt.blockchainId;
    if (!id || id === '登录后可查看') return;
    wx.setClipboardData({
      data: String(id),
      success: () => wx.showToast({ title: '已复制区块链ID', icon: 'success' }),
    });
  },

  contactSeller() {
    const phone = this.data.itemDetail && this.data.itemDetail.contactInfo && this.data.itemDetail.contactInfo.phone;
    wx.showToast({
      title: phone ? `联系方式：${phone}` : '暂无电话',
      icon: 'none',
    });
  },

  onScoreTap() {
    const sc = this.data.itemDetail && this.data.itemDetail.userExt && this.data.itemDetail.userExt.tradeScore;
    if (sc === -999) {
      wx.navigateTo({ url: '/pages/user/login/login' });
    }
  },

  async toggleLike() {
    if (!this.data.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.navigateTo({ url: '/pages/user/login/login' });
      return;
    }
    const d = this.data.itemDetail;
    if (!d) return;
    const nextLiked = !this.data.isLiked;
    try {
      const res = await socialItem({
        itemId: d.id,
        socialType: 'LOVE',
        socialOperate: nextLiked ? 'ADD' : 'CANCEL',
      });
      if (res.success) {
        let loveCount = d.loveCount || 0;
        loveCount = nextLiked ? loveCount + 1 : Math.max(0, loveCount - 1);
        d.loveCount = loveCount;
        this.setData({
          isLiked: nextLiked,
          itemDetail: d,
        });
        wx.showToast({ title: nextLiked ? '已点赞' : '已取消点赞', icon: 'none' });
      }
    } catch (_) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  async toggleCollect() {
    if (!this.data.userId) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.navigateTo({ url: '/pages/user/login/login' });
      return;
    }
    const d = this.data.itemDetail;
    if (!d) return;
    const nextCol = !this.data.isCollected;
    try {
      const res = await socialItem({
        itemId: d.id,
        socialType: 'COLLECTION',
        socialOperate: nextCol ? 'ADD' : 'CANCEL',
      });
      if (res.success) {
        let c = d.collectionCount || 0;
        c = nextCol ? c + 1 : Math.max(0, c - 1);
        d.collectionCount = c;
        this.setData({
          isCollected: nextCol,
          itemDetail: d,
        });
        wx.showToast({ title: nextCol ? '已收藏' : '已取消收藏', icon: 'none' });
      }
    } catch (_) {
      wx.showToast({ title: '操作失败', icon: 'none' });
    }
  },

  handleBuyOrExchange() {
    if (!this.data.userId) {
      wx.navigateTo({ url: '/pages/user/login/login' });
      return;
    }
    const d = this.data.itemDetail;
    if (!d) return;
    if (d.tradeMethod === 'ITEM_TO_ITEM' || d.tradeMethod === 'ITEM_TO_MONEY') {
      this.openExchangeForm();
    } else {
      this.setData({ showBuyForm: true });
    }
  },

  closeBuyForm() {
    this.setData({ showBuyForm: false });
  },

  onBuyInput(e) {
    const field = e.currentTarget.dataset.field;
    const v = e.detail.value;
    this.setData({ [`buyForm.${field}`]: v });
  },

  async openExchangeForm() {
    const d = this.data.itemDetail;
    if (d && d.tradeMethod === 'ITEM_TO_ITEM') {
      try {
        const res = await getMyCanTradeItems({ pageNo: 1, pageSize: 100 });
        const list = res.success && Array.isArray(res.data) ? res.data : [];
        const myItemColumns = list.map((it) => ({ text: it.itemTitle, value: it.id }));
        this.setData({
          myItemColumns,
          myItemIndex: 0,
          showExchangeForm: true,
        });
      } catch (_) {
        this.setData({ myItemColumns: [], showExchangeForm: true });
      }
    } else {
      this.setData({ showExchangeForm: true });
    }
  },

  closeExchangeForm() {
    this.setData({ showExchangeForm: false });
  },

  onExchangeInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({ [`exchangeForm.${field}`]: e.detail.value });
  },

  onItemTypePick(e) {
    const idx = Number(e.detail.value);
    const label = ITEM_TYPE_LABELS[idx];
    this.setData({
      itemTypeIndex: idx,
      'exchangeForm.itemType': label || '',
    });
  },

  onMyItemPick(e) {
    const idx = Number(e.detail.value);
    const row = this.data.myItemColumns[idx];
    if (!row) return;
    this.setData({
      myItemIndex: idx,
      'exchangeForm.itemId': row.value,
      'exchangeForm.itemTitle': row.text,
    });
  },

  noop() {},

  async onBuySubmit() {
    const d = this.data.itemDetail;
    const f = this.data.buyForm;
    if (!d) return;
    if (!f.linkman || !f.phone || !f.address) {
      wx.showToast({ title: '请填写完整联系信息', icon: 'none' });
      return;
    }
    this.setData({ isSubmitting: true });
    try {
      const params = {
        itemId: d.id,
        fromUserId: d.userId || '',
        contactInfo: {
          linkman: f.linkman,
          phone: f.phone,
          address: f.address,
        },
      };
      const res = await createOrderForPay(params);
      if (res.success) {
        wx.showToast({ title: '下单成功', icon: 'success' });
        this.setData({ showBuyForm: false });
        const tid = (res.data && res.data.tradeId) || '';
        this.setData({
          showPayPopup: true,
          payTradeId: tid,
          payPoints: d.transferPoints || 0,
        });
      }
    } catch (_) {
      wx.showToast({ title: '下单失败', icon: 'none' });
    } finally {
      this.setData({ isSubmitting: false });
    }
  },

  async onExchangeSubmit() {
    const d = this.data.itemDetail;
    const f = this.data.exchangeForm;
    if (!d) return;
    if (d.tradeMethod === 'ITEM_TO_ITEM') {
      if (!f.itemType) {
        wx.showToast({ title: '请选择物品类型', icon: 'none' });
        return;
      }
      if (!f.itemId) {
        wx.showToast({ title: '请选择交换物品', icon: 'none' });
        return;
      }
    }
    if (!f.linkman || !f.phone || !f.address) {
      wx.showToast({ title: '请填写完整联系信息', icon: 'none' });
      return;
    }
    try {
      await applySquareExchange({
        itemId: d.id,
        fromUserId: d.userId || '',
        swapItemId: d.tradeMethod === 'ITEM_TO_ITEM' ? f.itemId : null,
        contactInfo: {
          linkman: f.linkman,
          phone: f.phone,
          address: f.address,
        },
      });
      wx.showModal({
        title: '提交成功',
        content: '申请已提交，请尽快与出让方联系确认交易事项。',
        showCancel: false,
        success: () => {
          wx.switchTab({ url: '/pages/home/home' });
        },
      });
      this.setData({
        showExchangeForm: false,
        exchangeForm: {
          linkman: '',
          phone: '',
          address: '',
          remark: '',
          itemType: '',
          itemId: '',
          itemTitle: '',
        },
      });
    } catch (_) {
      /* request 已 toast */
    }
  },

  closePayPopup() {
    this.setData({ showPayPopup: false });
  },

  async onPayPopupSubmit(e) {
    const tradePassword = e.detail && e.detail.tradePassword;
    if (!tradePassword || String(tradePassword).length !== 6) {
      wx.showToast({ title: '请输入6位支付密码', icon: 'none' });
      return;
    }
    const d = this.data.itemDetail;
    if (!d) return;
    try {
      const res = await confirmPay({
        itemId: d.id,
        tradeId: this.data.payTradeId,
        tradePassword,
        tradeMethod: d.tradeMethod,
        tradePrice: null,
        tradePoints: this.data.payPoints,
        paymentMethod: null,
      });
      if (res.success) {
        wx.showToast({ title: '支付成功', icon: 'success' });
        this.setData({ showPayPopup: false });
        setTimeout(() => wx.switchTab({ url: '/pages/home/home' }), 500);
      }
    } catch (_) {
      this.setData({ showPayPopup: false });
    }
  },
});

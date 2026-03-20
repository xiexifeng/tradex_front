const tradeApi = require('../api/trade.js');

function showConfirm(title, content) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      content,
      success(res) {
        if (res.confirm) resolve();
        else reject(new Error('cancel'));
      },
      fail: () => reject(new Error('cancel')),
    });
  });
}

async function handleAcceptTrade(tradeId, onSuccess) {
  try {
    await showConfirm('确认接受', '确定要接受这个交易吗？');
    const res = await tradeApi.acceptBiddingApply({ tradeId });
    if (res.success) {
      wx.showToast({ title: '已接受交易', icon: 'success' });
      onSuccess && onSuccess();
    }
  } catch (e) {
    if (e.message !== 'cancel') {
      /* 接口错误已由 request 提示 */
    }
  }
}

async function handleRejectTrade(tradeId, onSuccess) {
  try {
    await showConfirm('确认拒绝', '确定要拒绝这个交易吗？');
    const res = await tradeApi.rejectBiddingApply({
      tradeId,
      rejectReason: '用户拒绝交易',
    });
    if (res.success) {
      wx.showToast({ title: '已拒绝交易', icon: 'success' });
      onSuccess && onSuccess();
    }
  } catch (e) {
    if (e.message !== 'cancel') {
      wx.showToast({ title: '拒绝交易失败', icon: 'none' });
    }
  }
}

async function handleConfirmTrade(tradeId, onSuccess) {
  try {
    await showConfirm('确认完成', '确定要完成这个交易吗？');
    const res = await tradeApi.completeTrade({ tradeId });
    if (res.success) {
      wx.showToast({ title: '交易已完成', icon: 'success' });
      onSuccess && onSuccess();
    }
  } catch (e) {
    if (e.message !== 'cancel') {
    }
  }
}

async function handleCancelTrade(tradeId, onSuccess) {
  try {
    await showConfirm('确认取消', '确定要取消这个交易吗？');
    const res = await tradeApi.cancelTradeApi({
      tradeId,
      cancelReason: '用户取消交易',
    });
    if (res.success) {
      wx.showToast({ title: '已取消交易', icon: 'success' });
      onSuccess && onSuccess();
    }
  } catch (e) {
    if (e.message !== 'cancel') {
      wx.showToast({ title: '取消交易失败', icon: 'none' });
    }
  }
}

async function handleGoPayTrade(params, onSuccess) {
  try {
    await showConfirm('继续支付', '确定要支付这个交易吗？');
    const res = await tradeApi.confirmPay(params);
    if (res.success) {
      wx.showToast({ title: '支付成功', icon: 'success' });
      onSuccess && onSuccess();
    }
  } catch (e) {
    if (e.message !== 'cancel') {
    }
  }
}

module.exports = {
  handleAcceptTrade,
  handleRejectTrade,
  handleConfirmTrade,
  handleCancelTrade,
  handleGoPayTrade,
};

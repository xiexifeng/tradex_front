const { getNotificationDetail } = require('../../../api/notification.js');
const { formatDetailTime } = require('../../../utils/notification-format.js');

function getTypeText(type) {
  const map = {
    SYSTEM: '系统',
    TRADE: '交易',
    STUFF: '物品',
    REPORT: '举报',
    AUDIT: '审核',
  };
  return map[type] || '其他';
}

function getTypeClass(type) {
  const map = {
    SYSTEM: 'tag-primary',
    TRADE: 'tag-success',
    STUFF: 'tag-info',
    REPORT: 'tag-danger',
    AUDIT: 'tag-warning',
  };
  return map[type] || 'tag-default';
}

Page({
  data: {
    notificationId: '',
    notification: {},
    parseRelated: null,
    loading: true,
    error: '',
    timeStr: '',
    typeText: '',
    typeClass: 'tag-default',
    stuffRejectReason: '',
    stuffRejectRed: false,
    auditButtonText: '查看详情',
  },

  onLoad(options) {
    const id = options.id || '';
    this.setData({ notificationId: id });
    if (id) {
      this.loadNotificationDetail();
    } else {
      this.setData({ loading: false, error: '通知ID不存在' });
    }
  },

  parseRelatedContent(str) {
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch (_) {
      return null;
    }
  },

  buildStuffMeta(n, related) {
    let stuffRejectReason = '';
    let stuffRejectRed = false;
    if (n.notificationType === 'STUFF' && related && related.auditRemark) {
      stuffRejectReason = related.auditRemark;
      stuffRejectRed = related.auditResult === false;
    }
    return { stuffRejectReason, stuffRejectRed };
  },

  buildAuditButtonText(n) {
    if (n.notificationType === 'AUDIT') {
      return n.isDone ? '查看已完成审核' : '前往审核';
    }
    return '查看详情';
  },

  async loadNotificationDetail() {
    const notificationId = this.data.notificationId;
    if (!notificationId) {
      this.setData({ loading: false, error: '通知ID不存在' });
      return;
    }

    this.setData({ loading: true, error: '' });
    try {
      const res = await getNotificationDetail(notificationId);
      if (res.success && res.data) {
        const n = res.data;
        const related = this.parseRelatedContent(n.relatedContent);
        const stuff = this.buildStuffMeta(n, related);
        this.setData({
          notification: n,
          parseRelated: related,
          loading: false,
          error: '',
          timeStr: formatDetailTime(n.createTime),
          typeText: getTypeText(n.notificationType),
          typeClass: getTypeClass(n.notificationType),
          auditButtonText: this.buildAuditButtonText(n),
          stuffRejectReason: stuff.stuffRejectReason,
          stuffRejectRed: stuff.stuffRejectRed,
        });
      } else {
        this.setData({
          loading: false,
          error: (res && res.desc) || '获取通知详情失败',
          notification: {},
          parseRelated: null,
        });
      }
    } catch (_) {
      this.setData({
        loading: false,
        error: '网络错误，请稍后重试',
        notification: {},
        parseRelated: null,
      });
    }
  },

  viewRelated() {
    const n = this.data.notification;
    const related = this.data.parseRelated;

    if (n.notificationType === 'AUDIT' && n.relatedContent) {
      try {
        const auditInfo = JSON.parse(n.relatedContent);
        if (auditInfo.taskId && auditInfo.itemId) {
          wx.navigateTo({
            url: `/pages/audit/audit?id=${auditInfo.taskId}&itemId=${auditInfo.itemId}`,
          });
          return;
        }
      } catch (e) {
        console.error('解析审核信息失败:', e);
      }
    }

    switch (n.notificationType) {
      case 'STUFF':
        if (related && related.itemId) {
          wx.navigateTo({ url: `/pages/stuff/detail/detail?id=${related.itemId}` });
        }
        break;
      case 'TRADE':
        if (n.relatedId) {
          wx.navigateTo({ url: `/pages/trade/detail/detail?id=${n.relatedId}` });
        }
        break;
      default:
        break;
    }
  },
});

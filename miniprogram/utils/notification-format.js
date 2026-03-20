function formatListTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const date = new Date(timestamp);

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`;

  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${m}-${d} ${h}:${min}`;
}

function formatDetailTime(time) {
  try {
    const date = new Date(time);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${y}年${m}月${d}日 ${h}:${min}`;
  } catch (_) {
    return '';
  }
}

function iconTypeFor(notificationType) {
  const t = (notificationType || '').toLowerCase();
  if (t === 'system') return 'system';
  if (t === 'audit') return 'audit';
  return 'trade';
}

function iconTextFor(notificationType) {
  const t = (notificationType || '').toLowerCase();
  if (t === 'system') return 'ℹ';
  if (t === 'audit') return '✓';
  return '⇄';
}

function enrichNotification(n) {
  return {
    ...n,
    displayTime: formatListTime(n.createTime),
    iconType: iconTypeFor(n.notificationType),
    iconText: iconTextFor(n.notificationType),
  };
}

module.exports = {
  formatListTime,
  formatDetailTime,
  enrichNotification,
};
